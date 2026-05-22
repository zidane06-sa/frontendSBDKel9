'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/lib/api';
import { Article } from '@/lib/types';
import { ArrowLeft, Eye, Bookmark, BookmarkCheck } from 'lucide-react';
import { useBookmarks } from '@/hooks/use-bookmarks';

export default function ArticleDetailPage() {
  const params = useParams();
  const articleId = params.id as string;
  
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { ready, isBookmarked, toggleBookmark } = useBookmarks();

  useEffect(() => {
    const loadArticle = async () => {
      try {
        setLoading(true);
        setError('');
        const { article } = await api.getArticle(articleId);
        setArticle(article);
        
        // Increment views
        try {
          await api.incrementViews(articleId);
        } catch (err) {
          console.error('[v0] Failed to increment views:', err);
        }
      } catch (err) {
        setError('Article not found');
        console.error('[v0] Failed to load article:', err);
      } finally {
        setLoading(false);
      }
    };

    loadArticle();
  }, [articleId]);

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Skeleton className="h-8 w-20 mb-8" />
            <Skeleton className="h-12 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/2 mb-8" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </main>
      </>
    );
  }

  if (error || !article) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background flex items-center justify-center">
          <Card className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-2">Article not found</h2>
            <p className="text-muted-foreground mb-4">
              The article you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <Button asChild>
              <Link href="/articles">Back to Articles</Link>
            </Button>
          </Card>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Back Button */}
          <div className="mb-8 flex items-center justify-between gap-3">
            <Button variant="ghost" asChild>
              <Link href="/articles" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Articles
              </Link>
            </Button>

            {ready && (
              <Button
                variant="outline"
                onClick={() => toggleBookmark(article.id)}
                className="gap-2"
              >
                {isBookmarked(article.id) ? (
                  <>
                    <BookmarkCheck className="h-4 w-4" />
                    Saved
                  </>
                ) : (
                  <>
                    <Bookmark className="h-4 w-4" />
                    Save
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Hero Image */}
          {article.image && (
            <div className="mb-8 rounded-lg overflow-hidden bg-linear-to-br from-blue-100 to-indigo-100 h-96">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Header */}
          <div className="space-y-4 mb-8">
            <div className="flex flex-wrap items-center gap-2">
              <Badge>{article.category}</Badge>
              {article.featured && <Badge className="bg-amber-500">Featured</Badge>}
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold">{article.title}</h1>

            <p className="text-xl text-muted-foreground">{article.description}</p>

            {/* Meta Information */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-4 border-t">
              <div>
                <p className="font-semibold">{article.author?.name}</p>
                <p className="text-sm text-muted-foreground">{article.author?.email}</p>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>
                  {new Date(article.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {article.views} views
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <div className="text-base leading-relaxed whitespace-pre-wrap">
              {article.content}
            </div>
          </div>
        </article>
      </main>
    </>
  );
}
