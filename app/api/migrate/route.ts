import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

// Run this once to create the resource table
// GET /api/migrate
export async function GET() {
    try {
        await pool.query(`
      -- Add role column to user table if it doesn't exist
      ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "role" TEXT DEFAULT 'user';

      -- Create the resource table
      CREATE TABLE IF NOT EXISTS "resource" (
        "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        "slug" TEXT UNIQUE,
        "title" TEXT NOT NULL,
        "author" TEXT NOT NULL,
        "type" TEXT NOT NULL,
        "category" TEXT NOT NULL,
        "year" INTEGER,
        "description" TEXT NOT NULL,
        "coverImage" TEXT,
        "sourceType" TEXT NOT NULL,
        "fileUrl" TEXT,
        "filePublicId" TEXT,
        "externalUrl" TEXT,
        "source" TEXT,
        "citations" INTEGER,
        "pages" INTEGER,
        "featured" BOOLEAN DEFAULT false,
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW(),
        "createdById" TEXT NOT NULL REFERENCES "user"("id")
      );

      -- Add slug column if table already exists
      ALTER TABLE "resource" ADD COLUMN IF NOT EXISTS "slug" TEXT UNIQUE;

      -- Generate slugs for existing rows that don't have one
      UPDATE "resource"
      SET "slug" = LOWER(
        REGEXP_REPLACE(
          REGEXP_REPLACE(
            TRANSLATE("title", 'áàâãäéèêëíìîïóòôõöúùûüçÁÀÂÃÄÉÈÊËÍÌÎÏÓÒÔÕÖÚÙÛÜÇ',
                              'aaaaaeeeeiiiioooooouuuucAAAAAEEEEIIIIOOOOOUUUUC'),
            '[^a-zA-Z0-9\\s-]', '', 'g'
          ),
          '[\\s]+', '-', 'g'
        )
      ) || '-' || LEFT("id", 6)
      WHERE "slug" IS NULL;
    `);

        return NextResponse.json({ success: true, message: "Migration completed!" });
    } catch (error) {
        console.error("Migration error:", error);
        return NextResponse.json(
            { success: false, error: String(error) },
            { status: 500 }
        );
    }
}
