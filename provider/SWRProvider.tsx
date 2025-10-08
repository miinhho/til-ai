"use client";

import { SWRConfig } from "swr";

export default function SWRProvider({ children }: React.PropsWithChildren) {
  return (
    <SWRConfig
      value={{
        // 공용 fetcher 설정
        fetcher: (resource, init) =>
          fetch(resource, init).then((res) => res.json()),
      }}
    >
      {children}
    </SWRConfig>
  );
}
