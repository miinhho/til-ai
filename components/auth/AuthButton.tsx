"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AuthButton() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <Button variant="ghost" size="sm" disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      </Button>
    );
  }

  if (!session?.user) {
    return (
      <Button size="sm" onClick={() => router.push("/login")}>
        로그인
      </Button>
    );
  }

  const displayName = session.user.name ?? session.user.email ?? "계정";
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-muted-foreground">
        {displayName}
      </span>
      <Button variant="outline" size="sm" onClick={() => signOut()}>
        로그아웃
      </Button>
    </div>
  );
}
