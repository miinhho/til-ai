"use client";

import AuthButton from "@/components/auth/AuthButton";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AppHeader() {
  return (
    <header className="border-b bg-white">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-semibold">
          TIL AI
        </Link>
        <nav className="flex items-center gap-4">
          <Button asChild variant="ghost" size="sm">
            <Link href="/til">내 TIL</Link>
          </Button>
          <AuthButton />
        </nav>
      </div>
    </header>
  );
}
