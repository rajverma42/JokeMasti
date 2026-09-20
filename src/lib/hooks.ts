"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  STORAGE_EVENTS,
  getStoredTheme,
  isJokeBookmarked,
  isJokeLiked,
  isMemeBookmarked,
  isMemeLiked,
  getRecentSearches,
  type Theme,
} from "@/lib/storage";

// Thin useSyncExternalStore wrappers around our localStorage helpers. This
// is the React-recommended way to read an external store (vs. reading it
// in a useEffect + setState, which causes an extra render and trips the
// react-hooks/set-state-in-effect rule): React renders the server/first
// snapshot during SSR, then re-reads the real value on the client without
// a manual effect, and re-renders automatically whenever the matching
// "jm:*-changed" event fires.
function useStorageSnapshot<T>(
  eventName: string,
  getSnapshot: () => T,
  getServerSnapshot: () => T
): T {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      window.addEventListener(eventName, onStoreChange);
      return () => window.removeEventListener(eventName, onStoreChange);
    },
    [eventName]
  );
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function useBookmarked(slug: string, type: "joke" | "meme"): boolean {
  return useStorageSnapshot(
    STORAGE_EVENTS.bookmarks,
    () => (type === "joke" ? isJokeBookmarked(slug) : isMemeBookmarked(slug)),
    () => false
  );
}

export function useLiked(id: string, type: "joke" | "meme"): boolean {
  return useStorageSnapshot(
    STORAGE_EVENTS.likes,
    () => (type === "joke" ? isJokeLiked(id) : isMemeLiked(id)),
    () => false
  );
}

export function useStoredTheme(): Theme {
  return useStorageSnapshot(STORAGE_EVENTS.theme, getStoredTheme, () => "system");
}

export function useRecentSearches(): string[] {
  return useStorageSnapshot(STORAGE_EVENTS.recentSearches, getRecentSearches, () => []);
}
