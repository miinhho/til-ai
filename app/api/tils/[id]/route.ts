import { db } from "@/lib/db";
import { TIL } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";

interface GETParams {
  params: { id: string };
}
export async function GET(
  _request: NextRequest,
  { params: { id } }: GETParams,
) {
  const numberId = parseInt(id, 10);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "유효하지 않은 Id" }, { status: 400 });
  }

  const til = await db
    .select()
    .from(TIL.Table)
    .where(eq(TIL.Table.id, numberId));

  if (!til.length) {
    return NextResponse.json(
      { error: "TIL을 찾을 수 없습니다" },
      { status: 404 },
    );
  }

  return NextResponse.json({ data: til[0] });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  const id = parseInt(params.id, 10);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "유효하지 않은 Id" }, { status: 400 });
  }

  await db.delete(TIL.Table).where(eq(TIL.Table.id, id));
  return NextResponse.json({ message: "TIL이 삭제되었습니다" });
}
