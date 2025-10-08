"use client";

import TILEditor from "@/components/til/TILEditor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserSession } from "@/hooks/useUserSession";
import { SERVICE_DOWN_PATH } from "@/lib/constants/error-page";
import type { APIRoute } from "@/types/route";
import Link from "next/link";
import { notFound, useParams, useRouter } from "next/navigation";
import useSWR from "swr";

export default function TILDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { status } = useUserSession();
  const {
    data: til,
    error,
    isLoading,
  } = useSWR<APIRoute<"/api/tils/[id]", "GET">>(
    status === "authenticated" ? `/api/tils/${id}` : null,
  );

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto p-4 max-w-4xl">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!til) notFound();
  if (error) {
    router.push(SERVICE_DOWN_PATH);
  }

  const createdAt = new Date(til.createdAt).toLocaleDateString();
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="mb-4">
          <Button variant="ghost" asChild>
            <Link href="/til">← Back to TILs</Link>
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">{til.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <TILEditor initialContent={til.content} readOnly />
            <div className="mt-4">
              <Badge variant="secondary">Created on {createdAt}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
