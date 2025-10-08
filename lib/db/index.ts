import { drizzle } from "drizzle-orm/postgres-js";

// biome-ignore lint/style/noNonNullAssertion: We are sure that this variable will be defined
export const db = drizzle(process.env.DATABASE_URL!);
