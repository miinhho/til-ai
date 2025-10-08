import { db } from "@/lib/db";
import { TIL } from "@/lib/db/schema";
import { asc, desc, like } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";

export interface TILSearchResponse extends Array<Omit<TIL.Select, "userId">> {}

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const search = searchParams.get("search")?.trim() ?? "";
  if (search.length <= 2) {
    return NextResponse.json(
      {
        error: "검색어는 최소 3글자 이상이어야 합니다.",
      },
      { status: 400 },
    );
  }
  const sort = searchParams.get("sort") === "oldest" ? "oldest" : "newest";

  const tils = await db
    .select({
      id: TIL.Table.id,
      title: TIL.Table.title,
      content: TIL.Table.content,
      createdAt: TIL.Table.createdAt,
    })
    .from(TIL.Table)
    .where(like(TIL.Table.title, `%${search}%`))
    .orderBy(
      sort === "newest" ? desc(TIL.Table.createdAt) : asc(TIL.Table.createdAt),
    );

  return NextResponse.json({ data: tils });
};
