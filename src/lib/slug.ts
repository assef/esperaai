/** Converts a movie title to a URL-safe slug. */
export function slugify(text: string): string {
  return (
    text
      .normalize('NFD')
      .replace(/\p{M}/gu, '')          // strip all combining marks (accents, etc.)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')     // non-alphanumeric → hyphen
      .replace(/^-+|-+$/g, '')         // trim leading/trailing hyphens
    || 'movie'
  );
}
