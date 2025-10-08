import { withAuth } from "@/lib/auth";
import { db } from "@/lib/db";
import { TIL } from "@/lib/db/schema";
import { asc, desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export interface TILFindListResponse {
  tils: Omit<TIL.Select, "userId">[];
}

export const GET = withAuth(async (request, session) => {
  const sortParam = request.nextUrl.searchParams.get("sort") === "oldest";
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

export const POST = withAuth(async (request, session) => {
  const body = await request.json();
  const parsed = TIL.Schema.Create.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }

  const [til] = await db
    .insert(TIL.Table)
    .values({
      ...parsed.data,
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
