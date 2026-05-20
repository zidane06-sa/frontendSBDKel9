'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Header } from '@/components/header';
import { DashboardSidebar } from '@/components/dashboard-sidebar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api';
import { AdminArticle, ArticleStatus } from '@/lib/types';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

const STATUS_TABS: { label: string; value: string }[] = [
  { label: 'Menunggu Review', value: 'pending' },
  { label: 'Disetujui', value: 'approved' },
  { label: 'Ditolak', value: 'rejected' },
];

const statusBadge = (status: ArticleStatus) => {
  if (status === 'approved') return <Badge className="bg-green-500">Disetujui</Badge>;
  if (status === 'rejected') return <Badge className="bg-red-500">Ditolak</Badge>;
  return <Badge className="bg-yellow-500">Pending</Badge>;
};

export default function ReviewPage() {
  const { isAuthenticated, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();

  const [articles, setArticles] = useState<AdminArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState<{ [id: string]: string }>({});
  const [rejectOpen, setRejectOpen] = useState<string | null>(null);
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !isAdmin)) router.push('/dashboard');
  }, [isAuthenticated, isAdmin, authLoading, router]);

  useEffect(() => {
    if (isAdmin) loadArticles(activeTab);
  }, [isAdmin, activeTab]);

  const loadArticles = async (status: string) => {
    try {
      setLoading(true);
      const { articles } = await api.getAdminArticles(status);
      setArticles(articles);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleApprove = async (id: string) => {
    try {
      setActionLoading(id);
      await api.approveArticle(id);
      setArticles((prev) => prev.filter((a) => a.id !== id));
      showToast('✅ Artikel disetujui dan sekarang tampil ke publik.');
    } catch (err) {
      showToast('❌ Gagal menyetujui artikel.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: string) => {
    try {
      setActionLoading(id);
      await api.rejectArticle(id, rejectReason[id]);
      setArticles((prev) => prev.filter((a) => a.id !== id));
      setRejectOpen(null);
      showToast('Artikel ditolak.');
    } catch (err) {
      showToast('❌ Gagal menolak artikel.');
    } finally {
      setActionLoading(null);
    }
  };

  if (authLoading || !isAuthenticated || !isAdmin) return null;

  return (
    <>
      <Header />
      <div className="flex h-[calc(100vh-64px)]">
        <DashboardSidebar />
        <main className="flex-1 overflow-auto">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Review Artikel</h1>
              <p className="text-muted-foreground mt-1">Tinjau artikel yang dikirim oleh pengguna.</p>
            </div>

            {/* Toast */}
            {toast && (
              <div className="p-3 bg-muted border rounded text-sm">{toast}</div>
            )}

            {/* Tabs */}
            <div className="flex gap-2 border-b">
              {STATUS_TABS.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={`pb-2 px-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.value
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Articles */}
            {loading ? (
              <Card><CardContent className="py-8 text-center text-muted-foreground">Memuat...</CardContent></Card>
            ) : articles.length === 0 ? (
              <Card><CardContent className="py-8 text-center text-muted-foreground">Tidak ada artikel dengan status ini.</CardContent></Card>
            ) : (
              <div className="space-y-4">
                {articles.map((article) => (
                  <Card key={article.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <CardTitle className="text-base">{article.title}</CardTitle>
                            {statusBadge(article.status)}
                          </div>
                          <p className="text-sm text-muted-foreground">{article.description}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {/* Meta */}
                      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                        {article.submittedBy && (
                          <span>👤 Dikirim oleh: <strong>{article.submittedBy.name || article.submittedBy.email}</strong></span>
                        )}
                        {article.category && <span>📂 {article.category}</span>}
                        <span>🕐 {new Date(article.createdAt).toLocaleDateString('id-ID', { dateStyle: 'medium' })}</span>
                      </div>

                      {/* Content preview */}
                      <div className="text-sm text-muted-foreground bg-muted/50 rounded p-3 line-clamp-4 whitespace-pre-line">
                        {article.content}
                      </div>

                      {/* Rejection reason display */}
                      {article.status === 'rejected' && (article as AdminArticle).rejectionReason && (
                        <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded p-2">
                          Alasan penolakan: {(article as AdminArticle).rejectionReason}
                        </div>
                      )}

                      {/* Actions: only for pending */}
                      {activeTab === 'pending' && (
                        <div className="flex flex-wrap items-start gap-2 pt-1">
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white gap-1"
                            onClick={() => handleApprove(article.id)}
                            disabled={actionLoading === article.id}
                          >
                            <CheckCircle className="h-4 w-4" />
                            Setujui
                          </Button>

                          {rejectOpen === article.id ? (
                            <div className="flex flex-col gap-2 w-full sm:w-auto">
                              <input
                                type="text"
                                placeholder="Alasan penolakan (opsional)"
                                value={rejectReason[article.id] || ''}
                                onChange={(e) =>
                                  setRejectReason((prev) => ({ ...prev, [article.id]: e.target.value }))
                                }
                                className="rounded-md border border-input bg-background px-3 py-1.5 text-sm w-72 focus:outline-none focus:ring-2 focus:ring-ring"
                              />
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleReject(article.id)}
                                  disabled={actionLoading === article.id}
                                  className="gap-1"
                                >
                                  <XCircle className="h-4 w-4" />
                                  Konfirmasi Tolak
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => setRejectOpen(null)}>
                                  Batal
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => setRejectOpen(article.id)}
                              disabled={actionLoading === article.id}
                              className="gap-1"
                            >
                              <XCircle className="h-4 w-4" />
                              Tolak
                            </Button>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
