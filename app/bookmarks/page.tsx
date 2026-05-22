'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/header';
import { ArticleCard } from '@/components/article-card';
import { ArticleCardSkeleton } from '@/components/article-card-skeleton';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { api } from '@/lib/api';
import { Article } from '@/lib/types';
import { useBookmarks } from '@/hooks/use-bookmarks';

export default function BookmarksPage() {
  const { bookmarkIds, ready } = useBookmarks();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBookmarkedArticles = async () => {
      try {
        setLoading(true);

        const results = await Promise.all(
          bookmarkIds.map(async (id) => {
            try {
              const { article } = await api.getArticle(id);
              return article;
            } catch {
              return null;
            }
          })
        );

        const orderedArticles = bookmarkIds
          .map((id) => results.find((article) => article?.id === id))
          .filter((article): article is Article => Boolean(article));

        setArticles(orderedArticles);
      } finally {
        setLoading(false);
      }
    };

    if (ready) {
      loadBookmarkedArticles();
    }
  }, [bookmarkIds, ready]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold">Bookmarks</h1>
              <p className="text-muted-foreground mt-2">
                Articles you saved for later reading.
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <ArticleCardSkeleton key={i} />
                ))}
              </div>
            ) : articles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article) => (
                  <ArticleCard key={article.id} article={article} featured={article.featured} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground mb-4">
                    You have not saved any articles yet.
                  </p>
                  <Button asChild>
                    <Link href="/articles">Browse Articles</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </>
  );
}