import type { TIL } from "@/lib/db/schema";

export type TILItemType = Pick<
  TIL.Select,
  "id" | "title" | "content" | "createdAt"
>;
