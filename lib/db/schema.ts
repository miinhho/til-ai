import { sql } from "drizzle-orm";
import {
  index,
  integer,
  pgTable as table,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";

export const tilTable = table(
  "tils",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    title: varchar("title", { length: 50 }).notNull(),
    content: text("content").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (_table) => [index("title_idx").using("gin", sql`title gin_trgm_ops`)],
);

export namespace TIL {
  export const Table = tilTable;

  export type Select = typeof Table.$inferSelect;
  export type Insert = typeof Table.$inferInsert;

  export const Schema = {
    Select: createSelectSchema(Table),
    Insert: createInsertSchema(Table),
    Update: createUpdateSchema(Table),
  };
}
