"use client";

import { UNAUTHENTICATED_PATH } from "@/lib/constants/error-page";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export const useUserSession = () => {
  const router = useRouter();

  return useSession({
    required: true,
    onUnauthenticated: () => {
      router.push(UNAUTHENTICATED_PATH);
    },
  });
};
