'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Header } from '@/components/header';
import { DashboardSidebar } from '@/components/dashboard-sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { api } from '@/lib/api';

export default function SubmitArticlePage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    title: '',
    summary: '',
    content: '',
    category: '',
    image: '',
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push('/login');
  }, [isAuthenticated, authLoading, router]);

  if (authLoading || !isAuthenticated) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.title.trim() || !form.summary.trim() || !form.content.trim()) {
      setError('Judul, ringkasan, dan konten wajib diisi.');
      return;
    }
    try {
      setLoading(true);
      await api.submitArticle({
        title: form.title,
        summary: form.summary,
        content: form.content,
        category: form.category,
        image: form.image,
      });
      setSuccess(true);
      setForm({ title: '', summary: '', content: '', category: '', image: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal mengirim artikel');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="flex h-[calc(100vh-64px)]">
        <DashboardSidebar />
        <main className="flex-1 overflow-auto">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Card>
              <CardHeader>
                <CardTitle>Submit Artikel</CardTitle>
                <CardDescription>
                  Artikel yang kamu kirim akan ditinjau oleh admin sebelum ditampilkan ke publik.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {success && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded text-sm text-green-700">
                    ✅ Artikel berhasil dikirim! Menunggu persetujuan admin.
                  </div>
                )}
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                    {error}
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Judul *</label>
                    <Input
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      placeholder="Judul artikel"
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Ringkasan *</label>
                    <textarea
                      name="summary"
                      value={form.summary}
                      onChange={handleChange}
                      placeholder="Deskripsi singkat artikel..."
                      rows={2}
                      disabled={loading}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 resize-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Konten *</label>
                    <textarea
                      name="content"
                      value={form.content}
                      onChange={handleChange}
                      placeholder="Tulis isi artikel di sini. Pisahkan paragraf dengan baris kosong."
                      rows={10}
                      disabled={loading}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 resize-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-sm font-medium">Kategori</label>
                      <select
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        disabled={loading}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                      >
                        <option value="">Pilih kategori...</option>
                        <option value="Technology">Technology</option>
                        <option value="Business">Business</option>
                        <option value="Design">Design</option>
                        <option value="Finance">Finance</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium">URL Gambar (opsional)</label>
                      <Input
                        name="image"
                        value={form.image}
                        onChange={handleChange}
                        placeholder="https://..."
                        disabled={loading}
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Mengirim...' : 'Kirim Artikel'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </>
  );
}
