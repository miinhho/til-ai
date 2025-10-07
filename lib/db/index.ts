import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";

// Pool gives more control, but for simplicity we can just drizzle to handle connections
export const db = drizzle({
  connection: {
    connectionString: process.env.DATABASE_URL,
  },
});
