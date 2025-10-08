import type { AdapterAccountType } from "@auth/core/adapters";
import { relations, sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  primaryKey,
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

export const usersTable = table("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
});

export const accountsTable = table(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    {
      compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
    },
  ],
);

export const sessionsTable = table("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokensTable = table(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => [
    {
      compositePk: primaryKey({
        columns: [verificationToken.identifier, verificationToken.token],
      }),
    },
  ],
);

export const authenticatorsTable = table(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (authenticator) => [
    {
      compositePK: primaryKey({
        columns: [authenticator.userId, authenticator.credentialID],
      }),
    },
  ],
);

export const tilTable = table(
  "tils",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    title: varchar("title", { length: 50 }).notNull(),
    content: text("content").notNull(),
    userId: text("userId")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (_table) => [index("title_idx").using("gin", sql`title gin_trgm_ops`)],
);

export const usersRelations = relations(usersTable, ({ many }) => ({
  tils: many(tilTable),
}));

export const tilRelations = relations(tilTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [tilTable.userId],
    references: [usersTable.id],
  }),
}));

export namespace TIL {
  export const Table = tilTable;

  export type Select = typeof Table.$inferSelect;
  export type Insert = typeof Table.$inferInsert;
  export type Create = Pick<typeof Table.$inferInsert, "title" | "content">;

  const insertSchema = createInsertSchema(Table);

  export const Schema = {
    Select: createSelectSchema(Table),
    Insert: insertSchema,
    Update: createUpdateSchema(Table),
    Create: insertSchema.omit({ userId: true }),
  };
}

export namespace Users {
  export const Table = usersTable;

  export type Select = typeof Table.$inferSelect;
  export type Insert = typeof Table.$inferInsert;

  export const Schema = {
    Select: createSelectSchema(Table),
    Insert: createInsertSchema(Table),
    Update: createUpdateSchema(Table),
  };
}
