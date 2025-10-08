"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { APIRoute } from "@/types/route";
import { Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";
import useSWR from "swr";

interface TILViewerProps {
  id: number;
}

export default function TILViewer({ id }: TILViewerProps) {
  const {
    data: til,
    error,
    isLoading,
  } = useSWR<APIRoute<"/api/tils/[id]", "GET">>(`/api/tils/${id}`);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!til?.content || !contentRef.current) return;
    // 서버에서 받아온 HTML 문자열을 실제 HTML로 변환하여 삽입
    // JSON 으로 저장하는 방법도 있었으나 HTML 로 저장하여 띄우는 것이 무거운 tiptap 에서 렌더링하는 것보다 가볍고 빠름
    // tiptap 이라는 검증된 솔루션에서 HTML 관련 보안 이슈를 처리해주기 때문에 선택
    // 단, XSS 공격에 취약할 수 있으므로 신뢰할 수 없는 콘텐츠를 삽입할 때는 주의가 필요
    contentRef.current.innerHTML = til.content;
  }, [til?.content]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12 text-muted-foreground">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (error || !til) {
    return (
      <Card>
        <CardContent className="py-6 text-sm text-red-500">
          내용을 불러오지 못했어요. 잠시 후 다시 시도해주세요.
        </CardContent>
      </Card>
    );
  }

  const createdAt = new Date(til.createdAt).toLocaleDateString();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl font-semibold">{til.title}</CardTitle>
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span>{til.author.name}</span>
          <Badge variant="secondary">{createdAt.toLocaleString()}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div ref={contentRef} className="prose max-w-none dark:prose-invert" />
      </CardContent>
    </Card>
  );
}
