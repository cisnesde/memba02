import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { generateSlug } from "@/lib/slug";
import { discoverExternalCourses } from "@/lib/course-discovery";

export interface ResourceRow {
    id: string;
    slug: string;
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

// GET /api/resources — list resources with optional filters
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get("search") || "";
        const category = searchParams.get("category") || "";
        const featured = searchParams.get("featured");
        const limit = parseInt(searchParams.get("limit") || "50");

        let sql = `SELECT * FROM "resource"`;
        const conditions: string[] = [];
        const params: unknown[] = [];
        let paramIndex = 1;

        if (search) {
            conditions.push(
                `(LOWER("title") LIKE $${paramIndex} OR LOWER("author") LIKE $${paramIndex} OR LOWER("description") LIKE $${paramIndex})`
            );
            params.push(`%${search.toLowerCase()}%`);
            paramIndex++;
        }

        if (category && category !== "Todos") {
            if (category === "Livros") {
                conditions.push(`"type" = $${paramIndex}`);
                params.push("Livro");
                paramIndex++;
            } else if (category === "Artigos") {
                conditions.push(`"type" = $${paramIndex}`);
                params.push("Artigo");
                paramIndex++;
            } else {
                conditions.push(`"category" = $${paramIndex}`);
                params.push(category);
                paramIndex++;
            }
        }

        if (featured === "true") {
            conditions.push(`"featured" = true`);
        }

        if (conditions.length > 0) {
            sql += ` WHERE ${conditions.join(" AND ")}`;
        }

        sql += ` ORDER BY "createdAt" DESC LIMIT $${paramIndex}`;
        params.push(limit);

        // Fetch DB results and external discovery results concurrently
        const [dbResources, externalCourses] = await Promise.all([
            query<ResourceRow>(sql, params),
            search ? discoverExternalCourses(search) : Promise.resolve([])
        ]);

        // Merge results
        const combinedResults = [...dbResources, ...externalCourses];

        return NextResponse.json(combinedResults);
    } catch (error) {
        console.error("Error fetching resources:", error);
        return NextResponse.json(
            { error: "Failed to fetch resources" },
            { status: 500 }
        );
    }
}

// POST /api/resources — create a new resource (admin only)
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
            return NextResponse.json({ error: "Forbidden: admin only" }, { status: 403 });
        }

        const body = await request.json();
        const {
            title,
            author,
            type,
            category,
            year,
            description,
            coverImage,
            sourceType,
            fileUrl,
            filePublicId,
            externalUrl,
            source,
            citations,
            pages,
            featured,
        } = body;

        if (!title || !author || !type || !category || !description || !sourceType) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Generate slug from title
        const baseSlug = generateSlug(title);
        // Add short random suffix for uniqueness
        const slug = `${baseSlug}-${Date.now().toString(36).slice(-4)}`;

        const result = await query<ResourceRow>(
            `INSERT INTO "resource" (
        "slug", "title", "author", "type", "category", "year", "description",
        "coverImage", "sourceType", "fileUrl", "filePublicId",
        "externalUrl", "source", "citations", "pages", "featured", "createdById"
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17
      ) RETURNING *`,
            [
                slug,
                title,
                author,
                type,
                category,
                year || null,
                description,
                coverImage || null,
                sourceType,
                fileUrl || null,
                filePublicId || null,
                externalUrl || null,
                source || null,
                citations || null,
                pages || null,
                featured || false,
                session.user.id,
            ]
        );

        return NextResponse.json(result[0], { status: 201 });
    } catch (error) {
        console.error("Error creating resource:", error);
        return NextResponse.json(
            { error: "Failed to create resource" },
            { status: 500 }
        );
    }
}
