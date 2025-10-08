"use client";

import { type BareFetcher, SWRConfig } from "swr";

const DEFAULT_ERROR_MESSAGE = "요청을 처리하지 못했습니다";
const fetcher: BareFetcher = async (resource, init) => {
  const response = await fetch(resource, init);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(
      data?.error ?? data?.message ?? DEFAULT_ERROR_MESSAGE,
    );
    throw error;
  }

  return data;
};

export default function SWRProvider({ children }: React.PropsWithChildren) {
  return (
    <SWRConfig
      value={{
        fetcher,
      }}
    >
      {children}
    </SWRConfig>
  );
}
