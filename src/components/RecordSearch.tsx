"use client";

import { useEffect } from "react";
import { addRecentSearch } from "@/lib/storage";

export function RecordSearch({ query }: { query: string }) {
  useEffect(() => {
    if (query.trim()) addRecentSearch(query);
  }, [query]);
  return null;
}
