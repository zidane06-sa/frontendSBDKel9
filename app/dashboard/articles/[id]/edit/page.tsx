'use client';

import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useEffect, useState } from 'react';
import { Header } from '@/components/header';
import { DashboardSidebar } from '@/components/dashboard-sidebar';
import { ArticleForm } from '@/components/article-form';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/lib/api';
import { CreateArticlePayload, Article } from '@/lib/types';

export default function EditArticlePage() {
  const { isAuthenticated, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const articleId = params.id as string;

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated && articleId) {
      loadArticle();
    }
  }, [isAuthenticated, articleId]);

  const loadArticle = async () => {
    try {
      const { article } = await api.getArticle(articleId);
      setArticle(article);
    } catch (err) {
      console.error('[v0] Failed to load article:', err);
      router.push('/dashboard/articles');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (payload: CreateArticlePayload) => {
    try {
      setSaving(true);
      await api.updateArticle(articleId, payload);
      router.push(`/articles/${articleId}`);
    } catch (err) {
      throw err;
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) return null;
  if (!isAuthenticated) return null;

  if (!isAdmin) {
    return (
      <>
        <Header />
        <div className="flex h-[calc(100vh-64px)]">
          <DashboardSidebar />
          <main className="flex-1 overflow-auto">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <Card>
                <CardContent className="py-12 text-center space-y-4">
                  <div>
                    <h1 className="text-2xl font-bold">Admin access required</h1>
                    <p className="text-muted-foreground mt-2">
                      Backend only allows admin accounts to edit articles.
                    </p>
                  </div>
                  <Button onClick={() => router.push('/dashboard/articles')}>
                    Back to Articles
                  </Button>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className="flex h-[calc(100vh-64px)]">
          <DashboardSidebar />
          <main className="flex-1 overflow-auto">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="space-y-4">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-96" />
              </div>
            </div>
          </main>
        </div>
      </>
    );
  }

  if (!article) {
    return (
      <>
        <Header />
        <div className="flex h-[calc(100vh-64px)]">
          <DashboardSidebar />
          <main className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground">Article not found</p>
          </main>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="flex h-[calc(100vh-64px)]">
        <DashboardSidebar />
        <main className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <ArticleForm
              article={article}
              onSubmit={handleSubmit}
              isLoading={saving}
              submitText="Update Article"
            />
          </div>
        </main>
      </div>
    </>
  );
}
