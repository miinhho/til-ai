import { withAuth } from "@/lib/auth";
import { db } from "@/lib/db";
import { TIL, Users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";

export interface TILFindByIdResponse extends Omit<TIL.Select, "userId"> {
  author: {
    name: string | null;
    image: string | null;
  };
}

export const GET = async (
  _req: NextRequest,
  { params }: RouteContext<"/api/tils/[id]">,
) => {
  const { id: stringId } = await params;
  const id = parseInt(stringId, 10);
  if (Number.isNaN(id)) {
    return NextResponse.json(
      { error: "유효한 Id가 필요합니다" },
      { status: 400 },
    );
  }

  const [til] = await db
    .select({
      id: TIL.Table.id,
      title: TIL.Table.title,
      content: TIL.Table.content,
      createdAt: TIL.Table.createdAt,
      userId: TIL.Table.userId,
    })
    .from(TIL.Table)
    .where(eq(TIL.Table.id, id));
  if (!til) {
    return NextResponse.json(
      { error: "TIL을 찾을 수 없습니다" },
      { status: 404 },
    );
  }

  const [author] = await db
    .select({
      name: Users.Table.name,
      image: Users.Table.image,
    })
    .from(Users.Table)
    .where(eq(Users.Table.id, til.userId));
  if (!author) {
    return NextResponse.json(
      { error: "글쓴이를 찾을 수 없습니다" },
      { status: 404 },
    );
  }

  return NextResponse.json({
    ...til,
    author,
  } as TILFindByIdResponse);
};

export interface TILDeleteResponse {
  message: string;
}

export const DELETE = withAuth(
  async (_req, session, { params }: RouteContext<"/api/tils/[id]">) => {
    const { id: stringId } = await params;
    const id = parseInt(stringId, 10);
    if (Number.isNaN(id)) {
      return NextResponse.json(
        { error: "유효한 Id가 필요합니다" },
        { status: 400 },
      );
    }

    const [til] = await db
      .select({ userId: TIL.Table.userId })
      .from(TIL.Table)
      .where(eq(TIL.Table.id, id));

    if (!til) {
      return NextResponse.json(
        { error: "TIL을 찾을 수 없습니다" },
        { status: 404 },
      );
    }

    if (til.userId !== session.user.id) {
      return NextResponse.json(
        { error: "삭제 권한이 없습니다" },
        { status: 403 },
      );
    }

    await db.delete(TIL.Table).where(eq(TIL.Table.id, id));
    return NextResponse.json({ message: "TIL이 삭제되었습니다" });
  },
);
