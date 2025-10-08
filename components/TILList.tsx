"use client";

import TILItem from "@/components/TILItem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { SortOrder } from "@/types/params";
import type { TILItemType } from "@/types/til";
import { useState } from "react";
import { useDebounce } from "react-use";

const DEBOUNCE_DELAY = 500; // 500ms

export default function TILList() {
  const [tils, setTils] = useState<TILItemType[]>([]);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");

  useDebounce(
    () => {
      const params = new URLSearchParams();
      if (!search) return;
      params.set("search", search);
      params.set("sort", sortOrder);

      fetch(`/api/tils/search?${params.toString()}`)
        .then((res) => res.json())
        .then((data) => setTils(data.data || []));
    },
    DEBOUNCE_DELAY,
    [search, sortOrder],
  );

  const handleDelete = (id: number) => {
    setTils(tils.filter((til) => til.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My TILs</h1>
        <Button asChild>
          <a href="/tils/edit">Write New TIL</a>
        </Button>
      </div>

      <div className="flex gap-4 mb-6">
        <Input
          placeholder="Search TILs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1"
        />
        <Button
          variant="outline"
          onClick={() =>
            setSortOrder(sortOrder === "newest" ? "oldest" : "newest")
          }
        >
          Sort: {sortOrder === "newest" ? "Newest First" : "Oldest First"}
        </Button>
      </div>

      {tils.length === 0 ? (
        <p className="text-center text-gray-500">
          {search ? "No TILs match your search." : "No TILs yet."}
        </p>
      ) : (
        <div>
          {tils.map((til) => (
            <TILItem key={til.id} item={til} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
