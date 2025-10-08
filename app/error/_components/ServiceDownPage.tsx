"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ServiceDownPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto flex max-w-4xl flex-col items-center justify-center gap-4 p-4 text-center">
        <h2 className="text-2xl font-semibold">서비스가 잠시 중단되었습니다</h2>
        <p className="text-muted-foreground">
          현재 서버에 문제가 발생해 요청을 처리할 수 없어요. 잠시 후 다시
          시도하거나, 아래 버튼으로 홈으로 돌아가 주세요.
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button onClick={() => window.location.reload()}>
            다시 시도하기
          </Button>
          <Button asChild variant="secondary">
            <Link href="/">홈으로 이동</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
