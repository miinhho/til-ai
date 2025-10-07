import { db } from "@/lib/db";
import { TIL } from "@/lib/db/schema";
import { asc, desc, like } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const search = searchParams.get("search");
  const sort = searchParams.get("sort") || "newest";

  if (!search) {
    return NextResponse.json(
      {
        message: "검색어가 없습니다",
      },
      { status: 400 },
    );
  }

  const all = await db
    .select()
    .from(TIL.Table)
    .where(like(TIL.Table.title, `%${search}%`))
    .orderBy(
      sort === "newest" ? desc(TIL.Table.createdAt) : asc(TIL.Table.createdAt),
    );

  return NextResponse.json({ data: all });
}
