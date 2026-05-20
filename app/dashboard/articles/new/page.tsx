'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Header } from '@/components/header';
import { DashboardSidebar } from '@/components/dashboard-sidebar';
import { ArticleForm } from '@/components/article-form';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { CreateArticlePayload } from '@/lib/types';
import { useState, useEffect } from 'react';

export default function NewArticlePage() {
  const { isAuthenticated, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  const handleSubmit = async (payload: CreateArticlePayload) => {
    try {
      setLoading(true);
      const { article } = await api.createArticle(payload);
      router.push(`/articles/${article.id}`);
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
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
                      Backend only allows admin accounts to create articles.
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

  return (
    <>
      <Header />
      <div className="flex h-[calc(100vh-64px)]">
        <DashboardSidebar />
        <main className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <ArticleForm onSubmit={handleSubmit} isLoading={loading} />
          </div>
        </main>
      </div>
    </>
  );
}
