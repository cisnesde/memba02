import { auth } from "@/lib/auth";
import { query, queryOne } from "@/lib/db";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import crypto from "node:crypto";

export async function POST(req: Request) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const { resourceId, folderId } = await req.json();
        if (!resourceId) return new NextResponse("Resource ID is required", { status: 400 });

        // Verificar se já existe
        const existing = await queryOne(
            'SELECT * FROM "saved_resource" WHERE "userId" = $1 AND "resourceId" = $2',
            [session.user.id, resourceId]
        );

        if (existing) {
            // Atualizar pasta
            const updated = await queryOne(
                'UPDATE "saved_resource" SET "folderId" = $1 WHERE "id" = $2 RETURNING *',
                [folderId || null, (existing as any).id]
            );
            return NextResponse.json(updated);
        }

        // Criar nova entrada
        const id = crypto.randomUUID();
        const saved = await queryOne(
            'INSERT INTO "saved_resource" ("id", "userId", "resourceId", "folderId", "createdAt") VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
            [id, session.user.id, resourceId, folderId || null]
        );

        return NextResponse.json(saved);
    } catch (error) {
        console.error("Error saving resource:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function DELETE(req: Request) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const { resourceId } = await req.json();
        if (!resourceId) return new NextResponse("Resource ID is required", { status: 400 });

        await query(
            'DELETE FROM "saved_resource" WHERE "userId" = $1 AND "resourceId" = $2',
            [session.user.id, resourceId]
        );

        return new NextResponse("Resource removed from library", { status: 200 });
    } catch (error) {
        console.error("Error removing resource:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
