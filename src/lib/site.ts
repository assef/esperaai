// Set NEXT_PUBLIC_SITE_URL in Vercel project settings to your production domain.
// The fallback covers localhost and preview deploys.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://esperaai.com'
).replace(/\/$/, '');
