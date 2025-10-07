"use client";

import TILEditor from "@/components/TILEditor";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TIL } from "@/lib/db/schema";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ZodError } from "zod";

export default function TilsEditPage() {
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSave = async ({ title, content }: TIL.Insert) => {
    try {
      const parsed = TIL.Schema.Insert.parse({ title, content });

      await fetch(`/api/tils`, {
        method: "POST",
        body: JSON.stringify(parsed),
      });
      toast.success("TIL saved successfully!");
      router.push("/tils");
    } catch (err) {
      if (err instanceof ZodError) {
        setError(err.message);
        return;
      }
      setError("An unexpected error occurred");
    }
  };

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
            <TILEditor onSave={handleSave} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
