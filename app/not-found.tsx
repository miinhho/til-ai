import { ArrowLeft, BookOpenCheck } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_hsl(222,75%,85%)_0%,_transparent_55%)] opacity-70 dark:bg-[radial-gradient(circle_at_top,_hsl(222,75%,18%)_0%,_transparent_55%)]" />
      <Card className="relative z-10 max-w-lg text-center">
        <CardHeader className="space-y-4">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full border border-dashed border-primary/40 bg-primary/5 text-primary">
            <BookOpenCheck className="size-8" aria-hidden />
          </div>
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-xs font-medium tracking-wide text-primary">
            404 · 페이지를 찾을 수 없어요
          </div>
          <CardTitle className="text-2xl font-semibold sm:text-3xl">
            길을 잃으셨나요?
          </CardTitle>
          <CardDescription className="leading-relaxed">
            요청하신 페이지가 존재하지 않거나 이동되었어요. 홈으로 돌아가거나
            최신 TIL을 둘러보며 새로운 배움을 발견해보세요.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild size="lg">
            <Link href="/">
              <ArrowLeft className="size-4" aria-hidden />
              홈으로 돌아가기
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/til">최신 TIL 보러가기</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
