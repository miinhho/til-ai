"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

export default function UnauthenticatedPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto flex max-w-4xl flex-col items-center justify-center gap-4 p-4 text-center">
        <h2 className="text-2xl font-semibold">로그인이 필요합니다</h2>
        <p className="text-muted-foreground">
          Google 계정으로 로그인하고 저장된 TIL을 확인하세요.
        </p>
        <Button onClick={() => signIn("google")}>Google로 로그인하기</Button>
      </div>
    </div>
  );
}
