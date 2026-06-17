// Converts a human-readable title into a URL-safe slug.
// e.g. "Sergio Pérez" -> "sergio-perez", "Andrea Kimi Antonelli" -> "andrea-kimi-antonelli"
export function slugify(title: string): string {
  return title
    .normalize('NFKD') // decompose accented chars into base letter + combining mark
    .replace(/\p{M}/gu, '') // strip the combining marks (accents) left behind
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // any run of non-alphanumerics becomes a single hyphen
    .replace(/^-+|-+$/g, '') // trim leading/trailing hyphens
}
