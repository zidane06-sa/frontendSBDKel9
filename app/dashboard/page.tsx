'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Header } from '@/components/header';
import { DashboardSidebar } from '@/components/dashboard-sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { Article } from '@/lib/types';
import { FileText, Eye, Users } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const { isAuthenticated, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      loadArticles();
    }
  }, [isAuthenticated, isAdmin]);

  const loadArticles = async () => {
    try {
      const response = isAdmin
      ? await api.getAdminArticles()
      : await api.getArticles();
      setArticles(response.articles);
    } catch (err) {
      console.error('[v0] Failed to load articles:', err);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return null;
  if (!isAuthenticated) return null;

  const totalArticles = articles.length;
  const totalViews = articles.reduce((sum, article) => sum + article.views, 0);
  const recentArticles = articles.slice(0, 5);

  return (
    <>
      <Header />
      <div className="flex h-[calc(100vh-64px)]">
        <DashboardSidebar />
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="space-y-8">
              {/* Header */}
              <div>
                <h1 className="text-3xl font-bold">Platform Overview</h1>
                <p className="text-muted-foreground mt-2">
                  Welcome back! Here is the current global activity across the platform.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Total Articles
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{totalArticles}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      Total Views
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{totalViews.toLocaleString()}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Avg. Views per Article
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {totalArticles > 0 ? Math.round(totalViews / totalArticles) : 0}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Articles */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Recent Articles</h2>
                    <p className="text-muted-foreground">Latest publications from all users</p>
                  </div>
                  {isAdmin && (
                    <Button asChild>
                      <Link href="/dashboard/articles/new">New Article</Link>
                    </Button>
                  )}
                </div>

                {loading ? (
                  <Card>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="space-y-2">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ) : recentArticles.length > 0 ? (
                  <Card>
                    <CardContent className="divide-y">
                      {recentArticles.map((article) => (
                        <div key={article.id} className="py-4 flex items-start justify-between first:pt-6 last:pb-6">
                          <div className="flex-1">
                            <h3 className="font-semibold">{article.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1">{article.description}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                              <span>{article.views} views</span>
                              <span>
                                {new Date(article.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          {isAdmin && (
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/dashboard/articles/${article.id}/edit`}>Edit</Link>
                            </Button>
                          )}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="py-8 text-center">
                      <p className="text-muted-foreground">No articles yet</p>
                      {isAdmin && (
                        <Button asChild className="mt-4">
                          <Link href="/dashboard/articles/new">Create Your First Article</Link>
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
