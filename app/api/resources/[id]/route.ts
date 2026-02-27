import { NextRequest, NextResponse } from "next/server";
import { query, queryOne } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { deleteFromCloudinary } from "@/lib/cloudinary";

interface ResourceRow {
    id: string;
    title: string;
    author: string;
    type: string;
    category: string;
    year: number | null;
    description: string;
    coverImage: string | null;
    sourceType: string;
    fileUrl: string | null;
    filePublicId: string | null;
    externalUrl: string | null;
    source: string | null;
    citations: number | null;
    pages: number | null;
    featured: boolean;
    createdAt: string;
    updatedAt: string;
    createdById: string;
}

// GET /api/resources/[id]
export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const resource = await queryOne<ResourceRow>(
            `SELECT * FROM "resource" WHERE "id" = $1 OR "slug" = $1`,
            [id]
        );

        if (!resource) {
            return NextResponse.json({ error: "Resource not found" }, { status: 404 });
        }

        return NextResponse.json(resource);
    } catch (error) {
        console.error("Error fetching resource:", error);
        return NextResponse.json(
            { error: "Failed to fetch resource" },
            { status: 500 }
        );
    }
}

// PUT /api/resources/[id]
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userRows = await query<{ role: string }>(
            `SELECT "role" FROM "user" WHERE "id" = $1`,
            [session.user.id]
        );
        if (!userRows[0] || userRows[0].role !== "admin") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const { id } = await params;
        const body = await request.json();
        const {
            title, author, type, category, year, description,
            coverImage, sourceType, fileUrl, filePublicId,
            externalUrl, source, citations, pages, featured,
        } = body;

        const result = await query<ResourceRow>(
            `UPDATE "resource" SET
        "title" = COALESCE($1, "title"),
        "author" = COALESCE($2, "author"),
        "type" = COALESCE($3, "type"),
        "category" = COALESCE($4, "category"),
        "year" = $5,
        "description" = COALESCE($6, "description"),
        "coverImage" = $7,
        "sourceType" = COALESCE($8, "sourceType"),
        "fileUrl" = $9,
        "filePublicId" = $10,
        "externalUrl" = $11,
        "source" = $12,
        "citations" = $13,
        "pages" = $14,
        "featured" = COALESCE($15, "featured"),
        "updatedAt" = NOW()
      WHERE "id" = $16 OR "slug" = $16
      RETURNING *`,
            [
                title, author, type, category, year ?? null,
                description, coverImage ?? null, sourceType,
                fileUrl ?? null, filePublicId ?? null,
                externalUrl ?? null, source ?? null,
                citations ?? null, pages ?? null, featured ?? false,
                id,
            ]
        );

        if (!result[0]) {
            return NextResponse.json({ error: "Resource not found" }, { status: 404 });
        }

        return NextResponse.json(result[0]);
    } catch (error) {
        console.error("Error updating resource:", error);
        return NextResponse.json(
            { error: "Failed to update resource" },
            { status: 500 }
        );
    }
}

// DELETE /api/resources/[id]
export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userRows = await query<{ role: string }>(
            `SELECT "role" FROM "user" WHERE "id" = $1`,
            [session.user.id]
        );
        if (!userRows[0] || userRows[0].role !== "admin") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const { id } = await params;

        // Get resource to cleanup Cloudinary files
        const resource = await queryOne<ResourceRow>(
            `SELECT * FROM "resource" WHERE "id" = $1 OR "slug" = $1`,
            [id]
        );

        if (!resource) {
            return NextResponse.json({ error: "Resource not found" }, { status: 404 });
        }

        // Delete from Cloudinary if it was an upload
        if (resource.filePublicId) {
            try {
                await deleteFromCloudinary(resource.filePublicId);
            } catch (e) {
                console.error("Failed to delete from Cloudinary:", e);
            }
        }

        await query(`DELETE FROM "resource" WHERE "id" = $1 OR "slug" = $1`, [id]);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting resource:", error);
        return NextResponse.json(
            { error: "Failed to delete resource" },
            { status: 500 }
        );
    }
}
