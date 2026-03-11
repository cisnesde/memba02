import { auth } from "@/lib/auth";
import { query } from "@/lib/db";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const { searchParams } = new URL(req.url);
    const folderId = searchParams.get("folderId");

    try {
        let sql = `
            SELECT r.*, sr."folderId", sr."createdAt" as "savedAt"
            FROM "saved_resource" sr
            JOIN "resource" r ON sr."resourceId" = r."id"
            WHERE sr."userId" = $1
        `;
        const params: any[] = [session.user.id];

        if (folderId) {
            if (folderId === "none") {
                sql += ` AND sr."folderId" IS NULL`;
            } else {
                sql += ` AND sr."folderId" = $2`;
                params.push(folderId);
            }
        }

        sql += ` ORDER BY sr."createdAt" DESC`;

        const resources = await query(sql, params);
        return NextResponse.json(resources);
    } catch (error) {
        console.error("Error fetching saved resources:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
