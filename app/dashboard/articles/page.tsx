'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Header } from '@/components/header';
import { DashboardSidebar } from '@/components/dashboard-sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DeleteConfirmDialog } from '@/components/delete-confirm-dialog';
import { api } from '@/lib/api';
import { Article } from '@/lib/types';
import { Eye, Edit2, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

export default function ArticlesManagePage() {
  const { isAuthenticated, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

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
        : await api.getUserArticles();
      setArticles(response.articles);
    } catch (err) {
      console.error('[v0] Failed to load articles:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      setDeleting(true);
      await api.deleteArticle(deleteId);
      setArticles(articles.filter((a) => a.id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      console.error('[v0] Failed to delete article:', err);
    } finally {
      setDeleting(false);
    }
  };

  if (authLoading) return null;
  if (!isAuthenticated) return null;

  return (
    <>
      <Header />
      <div className="flex h-[calc(100vh-64px)]">
        <DashboardSidebar />
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="space-y-8">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold">My Articles</h1>
                  <p className="text-muted-foreground mt-2">Manage your published articles</p>
                </div>
                {isAdmin && (
                  <Button asChild>
                    <Link href="/dashboard/articles/new">New Article</Link>
                  </Button>
                )}
              </div>

              {/* Articles List */}
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
              ) : articles.length > 0 ? (
                <Card>
                  <CardContent className="divide-y">
                    {articles.map((article) => (
                      <div
                        key={article.id}
                        className="py-4 flex items-start justify-between first:pt-6 last:pb-6"
                      >
                        <div className="flex-1">
                          <div className="flex items-start gap-2 mb-2">
                            <h3 className="font-semibold flex-1">{article.title}</h3>
                            {article.featured && (
                              <Badge className="bg-amber-500">Featured</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {article.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {article.views} views
                            </span>
                            <span>{article.category}</span>
                            <span>
                              {new Date(article.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        {isAdmin && (
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/dashboard/articles/${article.id}/edit`}>
                                <Edit2 className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setDeleteId(article.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground mb-4">No articles yet</p>
                    {isAdmin && (
                      <Button asChild>
                        <Link href="/dashboard/articles/new">Create Your First Article</Link>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>

      <DeleteConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Article"
        description="This action cannot be undone. The article will be permanently deleted."
        actionText="Delete"
        isLoading={deleting}
      />
    </>
  );
}
