import { auth } from "@/lib/auth";
import { query, queryOne } from "@/lib/db";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import crypto from "node:crypto";

export async function GET() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const folders = await query(
            'SELECT * FROM "folder" WHERE "userId" = $1 ORDER BY "name" ASC',
            [session.user.id]
        );
        return NextResponse.json(folders);
    } catch (error) {
        console.error("Error fetching folders:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const { name } = await req.json();
        if (!name) return new NextResponse("Name is required", { status: 400 });

        const id = crypto.randomUUID();
        const newFolder = await queryOne(
            'INSERT INTO "folder" ("id", "name", "userId", "createdAt", "updatedAt") VALUES ($1, $2, $3, NOW(), NOW()) RETURNING *',
            [id, name, session.user.id]
        );

        return NextResponse.json(newFolder);
    } catch (error) {
        console.error("Error creating folder:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
