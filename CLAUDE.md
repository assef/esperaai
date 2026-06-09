@AGENTS.md

# EsperaAí — project guide for AI agents

## What this is

EsperaAí ("Should I wait?") is a community-driven web app that tells users whether a movie has post-credit scenes and whether it is worth staying for. Users search for a movie, vote on the scene count and whether it was worth it, and the app surfaces the community consensus.

## Stack

- **Next.js 16 App Router** — `src/` directory, file-based routing under `src/app/[lang]/`
- **React 19** — Server Components by default; `'use client'` only at the interaction boundary
- **MongoDB Atlas** — votes and cached movie metadata stored in the `esperaai` database
- **TMDB API** — movie search and detail fetched server-side, cached via Next.js fetch revalidation
- **TypeScript** — strict mode, no `any`
- **Vercel** — deployment target; secrets live in Vercel environment variables

## Guiding principles

### Styling — CSS Modules per component

Every component has a co-located `ComponentName.module.css` file. Import it with `import styles from './ComponentName.module.css'`.

Rules:
- **Static structural styles** → CSS module class (layout, typography, spacing).
- **Boolean/enum state** (`selected`, `hasData`, `big`) → multiple CSS classes toggled conditionally: `className={active ? styles.active : styles.inactive}`.
- **Computed continuous values** that can't be expressed as classes (`width`, `height`, `borderRadius` props, `posterGradient(hue)`) → inline `style={{ prop: value }}` for that value only.
- CSS variables from `globals.css` (`var(--bg-elev)`, `var(--accent)`, etc.) are used freely inside module files.
- Layout utility classes shared across components (`home-container`, `detail-layout`, `skeleton`, animation classes) stay in `globals.css`.
- Never use Tailwind utility classes on custom components — CSS Modules are the styling layer.

### Use the latest React and Next.js features

Prefer the App Router model in every decision:

- Components are **Server Components by default**. Add `'use client'` only when you need browser APIs, event handlers, or React hooks.
- Data fetching happens in Server Components or Route Handlers — never `useEffect` + fetch on the client unless there is no server-side alternative.
- Use **Server Actions** (`'use server'`) for mutations. Do not create REST endpoints for mutations that a Server Action can handle.
- Use `useDeferredValue`, `useOptimistic`, `useTransition`, and `Suspense` where they reduce perceived latency.
- Use `next/image` (`<Image />`) for every image — never raw `<img>`. Configure `remotePatterns` in `next.config.ts` for external domains.
- Use `next/link` (`<Link />`) for every internal navigation — never `<a href>`.
- Use `next/font` for fonts loaded at build time.
- Cache TMDB responses with `next: { revalidate }` in `fetch()` calls — see `src/lib/tmdb.ts`. Do not bypass the cache without a documented reason.

### Accessibility

Every interactive element must be keyboard-operable and screen-reader-friendly:

- Buttons and links must have visible focus styles (do not remove `outline` without a replacement).
- Icon-only controls need an `aria-label`.
- Modals and sheets must trap focus, support `Escape` to close, and restore focus to the trigger on close.
- Use semantic HTML: `<button>` for actions, `<a>` for navigation, `<h1>`–`<h6>` in document order, `<fieldset>` + `<legend>` for grouped inputs.
- Use `role`, `aria-modal`, `aria-labelledby`, `aria-pressed`, `aria-label` where native semantics fall short.
- Dynamic content updates must be announced to screen readers (`aria-live` or equivalent).
- Color contrast must meet WCAG AA minimums. Never convey information by color alone.

### Security — nothing sensitive on the client

- `TMDB_BEARER_TOKEN`, `MONGODB_URI`, and any other secrets must **never** reach the browser.
- Files that access secrets must begin with `import 'server-only'`. This causes a build-time error if they are accidentally imported from a Client Component.
- API route handlers must validate and sanitize all inputs from query strings and request bodies before use.
- Do not expose raw MongoDB documents to the client — map them to typed DTOs in `src/lib/movies.ts`.
- All TMDB and MongoDB calls happen in Server Components, Server Actions, or Route Handlers — never in Client Components.

## Architecture at a glance

```
src/
  app/
    [lang]/               # locale segment (pt-BR | en-US)
      page.tsx            # home — Server Component, calls getMovies()
      HomeScreen.tsx      # client shell: search + movie list
      movie/[id]/
        page.tsx          # movie detail — Server Component, calls getMovie(id)
        MovieDetailScreen.tsx  # client shell: vote UI + optimistic updates
    api/
      search/route.ts     # GET /api/search?q= — proxies TMDB search, server-side
  components/             # shared UI components
  lib/
    db.ts                 # MongoDB singleton (server-only)
    tmdb.ts               # TMDB fetch helpers (server-only)
    movies.ts             # DB-first, TMDB cache-aside (server-only)
    actions.ts            # Server Actions for vote submission
    consensus.ts          # pure: computeConsensus, worthVerdict
    types.ts              # shared TypeScript interfaces
    format.ts             # mkT() — typed i18n helper
    poster.ts             # posterGradient() — safe to import in client components
  dictionaries/           # pt-BR.json, en-US.json
  proxy.js                # Next.js 16 middleware (locale redirect)
```

## Data flow

1. **Search**: browser → `/api/search?q=` → TMDB `/search/movie` (1 h cache) → JSON list
2. **Movie page**: Server Component calls `getMovie(id)` → DB lookup → if miss, TMDB fetch + DB insert → rendered HTML
3. **Vote**: Client Component calls `submitVote` Server Action → `findOneAndUpdate` in MongoDB → returns accurate aggregate

## Environment variables

| Variable            | Where used        | Notes                               |
| ------------------- | ----------------- | ----------------------------------- |
| `MONGODB_URI`       | `src/lib/db.ts`   | Atlas connection string             |
| `MONGODB_DB`        | `src/lib/db.ts`   | Database name (default: `esperaai`) |
| `TMDB_BEARER_TOKEN` | `src/lib/tmdb.ts` | v4 read-only bearer token           |

Set these in `.env.local` for development and in Vercel project settings for production. Never commit them.
