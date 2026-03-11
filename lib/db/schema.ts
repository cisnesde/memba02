import { pgTable, text, timestamp, unique, foreignKey } from "drizzle-orm/pg-core";

// Tabelas existentes (para manter as relações)
export const user = pgTable("user", {
  id: text("id").primaryKey(),
});

export const resource = pgTable("resource", {
  id: text("id").primaryKey(),
});

// Novas Tabelas para a Biblioteca
export const folder = pgTable("folder", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  userId: text("userId").notNull().references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow(),
});

export const savedResource = pgTable("saved_resource", {
  id: text("id").primaryKey(),
  userId: text("userId").notNull().references(() => user.id, { onDelete: "cascade" }),
  resourceId: text("resourceId").notNull().references(() => resource.id, { onDelete: "cascade" }),
  folderId: text("folderId").references(() => folder.id, { onDelete: "set null" }),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow(),
}, (t) => [
  unique().on(t.userId, t.resourceId),
]);
