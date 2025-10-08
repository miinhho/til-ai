"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import useSWRMutation from "swr/mutation";
import TILEditor from "./TILEditor";

interface TILItemProps {
  item: {
    id: number;
    title: string;
    content: string;
    createdAt: Date;
  };
  onDelete?: (id: number) => void;
}

async function deleteTIL(url: string) {
  await fetch(url, {
    method: "DELETE",
  });
}

export default function TILItem({ item, onDelete }: TILItemProps) {
  const { trigger, isMutating } = useSWRMutation(
    `/api/tils/${item.id}`,
    deleteTIL,
  );

  const handleDelete = async () => {
    if (!confirm("정말로 이 TIL을 삭제하실건가요?")) {
      return;
    }

    try {
      await trigger();
      toast.success("TIL이 삭제되었습니다.");
      onDelete?.(item.id);
    } catch {
      toast.error("TIL 삭제에 실패했습니다.");
    }
  };

  const createdAt = new Date(item.createdAt).toLocaleDateString();
  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>
          <Link href={`/til/${item.id}`} className="hover:underline">
            {item.title}
          </Link>
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          disabled={isMutating}
          className="text-red-500 hover:text-red-700"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <TILEditor initialContent={item.content} readOnly />
        <div className="mt-4">
          <Badge variant="secondary">{createdAt}</Badge>
        </div>
      </CardContent>
    </Card>
  );
}
