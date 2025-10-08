import { db } from "@/lib/db";
import { TIL } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  if (!id || Number.isNaN(id)) {
    return NextResponse.json(
      { error: "유효한 Id가 필요합니다" },
      { status: 400 },
    );
  }
  const numberId = parseInt(id, 10);

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

export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  if (!id || Number.isNaN(id)) {
    return NextResponse.json(
      { error: "유효한 Id가 필요합니다" },
      { status: 400 },
    );
  }
  const numberId = parseInt(id, 10);

  await db.delete(TIL.Table).where(eq(TIL.Table.id, numberId));
  return NextResponse.json({ message: "TIL이 삭제되었습니다" });
}
