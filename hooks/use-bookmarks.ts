'use client';

import { useCallback, useEffect, useState } from 'react';

const BOOKMARKS_KEY = 'tech-business-hub:bookmarks';

function readBookmarks(): string[] {
  if (typeof window === 'undefined') return [];

  try {
    const saved = window.localStorage.getItem(BOOKMARKS_KEY);
    const parsed = saved ? (JSON.parse(saved) as unknown) : [];

    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : [];
  } catch {
    return [];
  }
}

function writeBookmarks(bookmarkIds: string[]) {
  if (typeof window === 'undefined') return;

  window.localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarkIds));
}

export function useBookmarks() {
  const [bookmarkIds, setBookmarkIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setBookmarkIds(readBookmarks());
    setReady(true);
  }, []);

  const toggleBookmark = useCallback((articleId: string) => {
    setBookmarkIds((current) => {
      const next = current.includes(articleId)
        ? current.filter((id) => id !== articleId)
        : [articleId, ...current];

      writeBookmarks(next);
      return next;
    });
  }, []);

  const clearBookmark = useCallback((articleId: string) => {
    setBookmarkIds((current) => {
      const next = current.filter((id) => id !== articleId);
      writeBookmarks(next);
      return next;
    });
  }, []);

  const isBookmarked = useCallback(
    (articleId: string) => bookmarkIds.includes(articleId),
    [bookmarkIds]
  );

  return {
    bookmarkIds,
    ready,
    toggleBookmark,
    clearBookmark,
    isBookmarked,
  };
}