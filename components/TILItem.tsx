"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TILItemType } from "@/types/til";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import TILEditor from "./TILEditor";

interface TILItemProps {
  item: TILItemType;
  onDelete?: (id: number) => void;
}

export default function TILItem({ item, onDelete }: TILItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this TIL?")) {
      return;
    }
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/tils/${item.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("TIL deleted successfully!");
      onDelete?.(item.id);
    } catch (_err) {
      toast.error("Failed to delete TIL");
    } finally {
      setIsDeleting(false);
    }
  };

  const createdAt = new Date(item.createdAt).toLocaleDateString();

  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>
          <Link href={`/tils/${item.id}`} className="hover:underline">
            {item.title}
          </Link>
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          disabled={isDeleting}
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
