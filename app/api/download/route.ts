import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const fileUrl = searchParams.get("url");
    const fileName = searchParams.get("name") || "download";

    if (!fileUrl) {
        return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    try {
        let downloadUrl = fileUrl;

        // Verify Cloudinary config
        if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
            console.error("Cloudinary keys are missing in environment");
        }

        // If it's a Cloudinary URL, we can use the SDK to generate a signed version
        // that includes the attachment flag, bypassing "Strict Transformations" limits.
        if (fileUrl.includes('cloudinary.com')) {
            // Extract the part after /upload/ and remove the version (v1234567/) and extension
            // URL: .../upload/v1772233722/memba/resources/qkdqzdeidk7k9cru0q3j.pdf
            const parts = fileUrl.split('/upload/');
            if (parts.length > 1) {
                const subPath = parts[1];
                // Remove version if matches v[digits]
                const subPathParts = subPath.split('/');
                if (subPathParts[0].startsWith('v') && /^\d+$/.test(subPathParts[0].substring(1))) {
                    subPathParts.shift();
                }

                const pathWithExt = subPathParts.join('/');
                const lastDotIndex = pathWithExt.lastIndexOf('.');
                const publicId = lastDotIndex !== -1 ? pathWithExt.substring(0, lastDotIndex) : pathWithExt;
                const extension = lastDotIndex !== -1 ? pathWithExt.substring(lastDotIndex + 1) : "";

                // Generate a signed URL with the attachment flag
                // We use type: 'upload' unless we know it's authenticated
                downloadUrl = cloudinary.url(publicId, {
                    resource_type: extension.toLowerCase() === 'pdf' ? 'image' : 'auto',
                    format: extension,
                    flags: 'attachment',
                    sign_url: true,
                    secure: true,
                    type: 'upload' // Default to upload, can try 'authenticated' or 'private' if needed
                });
            }
        }

        console.log("Proxying download from:", downloadUrl);
        const response = await fetch(downloadUrl);

        if (!response.ok) {
            return NextResponse.json({
                error: `Cloudinary returned ${response.status}: ${response.statusText}`,
                attemptedUrl: downloadUrl,
                originalUrl: fileUrl
            }, { status: response.status });
        }

        const buffer = await response.arrayBuffer();
        const headers = new Headers();

        // Get content type from the original response or fallback to octet-stream
        const contentType = response.headers.get("content-type") || "application/octet-stream";
        headers.set("Content-Type", contentType);

        // Force download with a specific filename
        let finalFileName = fileName;
        if (!fileName.includes('.')) {
            const urlExtension = fileUrl.split('?')[0].split('.').pop();
            if (urlExtension && urlExtension.length <= 4 && urlExtension.length > 0) {
                finalFileName = `${fileName}.${urlExtension}`;
            } else {
                // Default to .pdf if we can't determine it, as most resources are PDFs
                finalFileName = `${fileName}.pdf`;
            }
        }

        headers.set("Content-Disposition", `attachment; filename="${finalFileName}"`);

        return new NextResponse(buffer, {
            status: 200,
            headers,
        });
    } catch (error: any) {
        console.error("Download proxy error:", error);
        return NextResponse.json({
            error: "Internal server error during download",
            details: error.message
        }, { status: 500 });
    }
}
