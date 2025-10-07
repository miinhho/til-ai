import { db } from "@/lib/db";
import { TIL } from "@/lib/db/schema";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { title, content }: TIL.Insert = await request.json();
  const parsed = TIL.Schema.Insert.safeParse({ title, content });
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }

  const res = await db.insert(TIL.Table).values(parsed.data).returning({
    id: TIL.Table.id,
    title: TIL.Table.title,
    content: TIL.Table.content,
  });

  return NextResponse.json({ data: res });
}
