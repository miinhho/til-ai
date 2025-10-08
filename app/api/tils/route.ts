import { withAuth } from "@/lib/auth";
import { db } from "@/lib/db";
import { TIL } from "@/lib/db/schema";
import { asc, desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export interface TILFindListResponse {
  tils: Omit<TIL.Select, "userId">[];
}

export const GET = withAuth(async (req, session) => {
  const sortParam = req.nextUrl.searchParams.get("sort") === "oldest";
  const orderBy = sortParam
    ? asc(TIL.Table.createdAt)
    : desc(TIL.Table.createdAt);

  const tils = await db
    .select({
      id: TIL.Table.id,
      title: TIL.Table.title,
      content: TIL.Table.content,
      createdAt: TIL.Table.createdAt,
    })
    .from(TIL.Table)
    .where(eq(TIL.Table.userId, session.user.id))
    .orderBy(orderBy);

  return NextResponse.json({
    tils,
  } as TILFindListResponse);
});

export interface TILCreateResponse extends Omit<TIL.Select, "userId"> {}

export const POST = withAuth(async (req, session) => {
  const body = await req.json();
  const parsed = TIL.Schema.Create.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "제목이나 내용이 유효하지 않습니다" },
      { status: 400 },
    );
  }

  const [til] = await db
    .insert(TIL.Table)
    .values({
      title: parsed.data.title,
      content: parsed.data.content,
      userId: session.user.id,
    })
    .returning({
      id: TIL.Table.id,
      title: TIL.Table.title,
      content: TIL.Table.content,
      createdAt: TIL.Table.createdAt,
    });

  return NextResponse.json({ ...til } as TILCreateResponse, { status: 201 });
});
