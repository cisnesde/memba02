import { Pool } from "@neondatabase/serverless";

// Singleton pool for database connections
const globalForDb = globalThis as unknown as {
    pool: Pool | undefined;
};

export const pool =
    globalForDb.pool ??
    new Pool({ connectionString: process.env.DATABASE_URL });

if (process.env.NODE_ENV !== "production") globalForDb.pool = pool;

// Helper to run queries
export async function query<T = Record<string, unknown>>(
    text: string,
    params?: unknown[]
): Promise<T[]> {
    const result = await pool.query(text, params);
    return result.rows as T[];
}

// Helper to run a single-row query
export async function queryOne<T = Record<string, unknown>>(
    text: string,
    params?: unknown[]
): Promise<T | null> {
    const rows = await query<T>(text, params);
    return rows[0] ?? null;
}
