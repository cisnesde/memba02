/**
 * Cloudinary-specific URL utilities for the frontend and backend.
 */

/**
 * Transforms a standard Cloudinary secure URL into a forced download URL
 * by adding the 'fl_attachment' flag.
 * 
 * @param url The original Cloudinary URL
 * @param filename Optional filename (without extension) for the downloaded file
 * @returns The transformed URL with the attachment flag
 */
export function getCloudinaryDownloadUrl(url: string | null, filename?: string): string {
    if (!url) return "#";

    // Clean filename
    const cleanFilename = filename
        ? filename.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/gi, '_')
        : "download";

    // Use our internal proxy API instead of Cloudinary transformations
    // This avoids 401 Unauthorized errors caused by strict transformations
    return `/api/download?url=${encodeURIComponent(url)}&name=${encodeURIComponent(cleanFilename)}`;
}
