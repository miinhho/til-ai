"use client";

import TILItem from "@/components/til/TILItem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { SortOrder } from "@/types/params";
import type { APIRoute } from "@/types/route";
import { useDebounce } from "@uidotdev/usehooks";
import { Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import useSWR from "swr";

const DEBOUNCE_DELAY = 500; // 500ms

export default function MyTILPage() {
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const debouncedSearch = useDebounce(search, DEBOUNCE_DELAY) ?? "";
  const trimmedSearch = debouncedSearch.trim();

  const swrKey = useMemo(() => {
    // 검색어는 3글자 이상일 때만 검색
    if (trimmedSearch.length <= 2) {
      return null;
    }

    const params = new URLSearchParams({
      sort: sortOrder,
      search: trimmedSearch,
    });
    return `/api/tils/search?${params.toString()}`;
  }, [sortOrder, trimmedSearch]);

  const { data, error, isLoading, mutate } =
    useSWR<APIRoute<"/api/tils/search", "GET">>(swrKey);
  const tils = data ?? [];

  const handleDelete = (id: number) => {
    void mutate(
      (current) =>
        current
          ? {
              ...current,
              data: current.filter((til) => til.id !== id),
            }
          : current,
      { revalidate: true, rollbackOnError: true },
    );
  };

  const handleToggleSort = () => {
    const nextSort = sortOrder === "newest" ? "oldest" : "newest";
    setSortOrder(nextSort);
  };

  const isEmpty = tils.length === 0;
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">My TILs</h1>
        <Button asChild>
          <a href="/til/edit">Write New TIL</a>
        </Button>
      </div>

      <div className="mb-6 flex gap-4">
        <Input
          placeholder="TIL 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1"
          disabled={isLoading}
        />
        <Button
          variant="outline"
          onClick={handleToggleSort}
          disabled={isLoading}
        >
          Sort: {sortOrder === "newest" ? "Newest First" : "Oldest First"}
        </Button>
      </div>

      {error && (
        <p className="mb-4 text-sm text-red-500">
          목록을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.
        </p>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : isEmpty ? (
        <p className="text-center text-muted-foreground">
          {trimmedSearch
            ? "검색 결과가 없습니다."
            : "아직 작성한 TIL이 없습니다."}
        </p>
      ) : (
        <div className="space-y-4">
          {tils.map((til) => (
            <TILItem key={til.id} item={til} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
