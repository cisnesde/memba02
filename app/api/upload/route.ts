import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { query } from "@/lib/db";
import { uploadToCloudinary } from "@/lib/cloudinary";

// POST /api/upload — upload a file to Cloudinary
export async function POST(request: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Check admin role
        const userRows = await query<{ role: string }>(
            `SELECT "role" FROM "user" WHERE "id" = $1`,
            [session.user.id]
        );
        if (!userRows[0] || userRows[0].role !== "admin") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const formData = await request.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // Validate file size (max 50MB)
        if (file.size > 50 * 1024 * 1024) {
            return NextResponse.json(
                { error: "File too large (max 50MB)" },
                { status: 400 }
            );
        }

        const folder = formData.get("folder")?.toString() || "memba";
        const result = await uploadToCloudinary(file, folder);

        return NextResponse.json({
            url: result.url,
            publicId: result.publicId,
        });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json(
            { error: "Upload failed" },
            { status: 500 }
        );
    }
}
