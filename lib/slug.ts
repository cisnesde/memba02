/**
 * Generate a URL-friendly slug from a string.
 * e.g. "Inteligência Artificial na Medicina" → "inteligencia-artificial-na-medicina"
 */
export function generateSlug(text: string): string {
    return text
        .toString()
        .normalize("NFD")                   // decompose accented chars
        .replace(/[\u0300-\u036f]/g, "")    // remove diacritics
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")      // remove non-alphanumeric
        .replace(/[\s_]+/g, "-")            // spaces/underscores to dashes
        .replace(/-+/g, "-")               // collapse multiple dashes
        .replace(/^-+|-+$/g, "");          // trim leading/trailing dashes
}
