import type { NextRequest } from "next/server";

export function parseId(rawId: string | undefined) {
  const number = Number(rawId);
  if (!rawId || Number.isNaN(number) || !Number.isInteger(number)) {
    return null;
  }
  return number;
}

/**
 * `id` 쿼리 파라미터를 파싱하여 정수로 반환합니다.
 * 유효하지 않은 경우 `null`을 반환합니다.
 */
export function getIdParam(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = parseId(searchParams.get("id") ?? undefined);
  return id;
}
