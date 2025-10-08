"use client";

import TILEditor from "@/components/til/TILEditor";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUserSession } from "@/hooks/useUserSession";
import { TIL } from "@/lib/db/schema";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import useSWRMutation from "swr/mutation";
import { ZodError } from "zod";

const createTIL = async (url: string, { arg }: { arg: TIL.Create }) => {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(arg),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = data?.error ?? "TIL 저장에 실패했습니다.";
    throw new Error(message);
  }

  return data;
};

export default function TilsCreatePage() {
  const { status } = useUserSession();
  const router = useRouter();
  const [error, setError] = useState("");
  const { trigger, isMutating: isSaving } = useSWRMutation(
    "/api/tils",
    createTIL,
  );

  const handleSave = async ({ title, content }: TIL.Create) => {
    try {
      setError("");
      const parsed = TIL.Schema.Create.parse({ title, content });
      await trigger(parsed);
      toast.success("TIL saved successfully!");
      router.push("/til");
    } catch (err) {
      if (err instanceof ZodError) {
        setError(err.message);
        return;
      }
      // 이 부분에서 에러가 발생한다면 처리하지 않음
      // 원인이 라이브러리이거나 프레임워크 문제일 가능성이 높기 때문임
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto flex max-w-4xl items-center justify-center p-4">
          <p className="text-muted-foreground">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Write New TIL</CardTitle>
            <CardDescription>Share what you learned today</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <TILEditor onSave={handleSave} isSaving={isSaving} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
