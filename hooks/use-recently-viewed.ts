'use client';

import { useCallback, useEffect, useState } from 'react';

const RECENTLY_VIEWED_KEY = 'tech-business-hub:recently-viewed';
const MAX_RECENTLY_VIEWED = 5;

function readRecentlyViewed(): string[] {
  if (typeof window === 'undefined') return [];

  try {
    const saved = window.localStorage.getItem(RECENTLY_VIEWED_KEY);
    const parsed = saved ? (JSON.parse(saved) as unknown) : [];

    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === 'string')
      : [];
  } catch {
    return [];
  }
}

function writeRecentlyViewed(articleIds: string[]) {
  if (typeof window === 'undefined') return;

  window.localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(articleIds));
}

export function useRecentlyViewed() {
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setRecentlyViewedIds(readRecentlyViewed());
    setReady(true);
  }, []);

  const addRecentlyViewed = useCallback((articleId: string) => {
    setRecentlyViewedIds((current) => {
      const next = [articleId, ...current.filter((id) => id !== articleId)].slice(
        0,
        MAX_RECENTLY_VIEWED
      );

      writeRecentlyViewed(next);
      return next;
    });
  }, []);

  const clearRecentlyViewed = useCallback(() => {
    setRecentlyViewedIds([]);
    writeRecentlyViewed([]);
  }, []);

  return {
    recentlyViewedIds,
    ready,
    addRecentlyViewed,
    clearRecentlyViewed,
  };
}