import { query } from "./lib/db";
import dotenv from "dotenv";

dotenv.config();

async function migrate() {
    console.log("🚀 Starting library tables migration...");
    try {
        // Table: library_folder
        await query(`
            CREATE TABLE IF NOT EXISTS "library_folder" (
                "id" TEXT PRIMARY KEY,
                "name" TEXT NOT NULL,
                "userId" TEXT NOT NULL,
                "isDefault" BOOLEAN DEFAULT false,
                "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT "library_folder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE
            );
        `);
        console.log("✅ Table 'library_folder' created or already exists.");

        // Table: saved_resource
        await query(`
            CREATE TABLE IF NOT EXISTS "saved_resource" (
                "id" TEXT PRIMARY KEY,
                "userId" TEXT NOT NULL,
                "resourceId" TEXT NOT NULL,
                "folderId" TEXT NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT "saved_resource_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE,
                CONSTRAINT "saved_resource_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "resource"("id") ON DELETE CASCADE,
                CONSTRAINT "saved_resource_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "library_folder"("id") ON DELETE CASCADE
            );
        `);
        console.log("✅ Table 'saved_resource' created or already exists.");

        console.log("🎉 Migration completed successfully.");
        process.exit(0);
    } catch (error) {
        console.error("❌ Migration failed:", error);
        process.exit(1);
    }
}

migrate();
