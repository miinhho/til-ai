"use client";

import TILEditor from "@/components/TILEditor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TILItemType } from "@/types/til";
import Link from "next/link";
import { useParams } from "next/navigation";
import useSWR from "swr";

export default function TILDetailPage() {
  const { id } = useParams();
  const {
    data: til,
    error,
    isLoading,
  } = useSWR<TILItemType>(`/api/tils/${id}`);

  if (isLoading) {
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

  if (error || !til) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto p-4 max-w-4xl">
          <Card>
            <CardContent className="pt-6">
              <p className="text-red-500 mb-4">
                Error: {error || "TIL not found"}
              </p>
              <Button asChild>
                <Link href="/tils">Back to TILs</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const createdAt = new Date(til.createdAt).toLocaleDateString();
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="mb-4">
          <Button variant="ghost" asChild>
            <Link href="/tils">← Back to TILs</Link>
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
