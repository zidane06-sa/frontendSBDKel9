'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/header';
import { ArticleCard } from '@/components/article-card';
import { ArticleCardSkeleton } from '@/components/article-card-skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { api } from '@/lib/api';
import { Article } from '@/lib/types';
import { Search, Filter } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Technology',
  'Design',
  'Innovation',
  'Business',
  'Science',
  'Other',
];

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        setLoading(true);
        const { articles } = await api.getArticles({
          category: category === 'All' ? undefined : category,
          search: search || undefined,
        });
        setArticles(articles);
      } catch (err) {
        console.error('[v0] Failed to load articles:', err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(loadArticles, 300);
    return () => clearTimeout(timer);
  }, [search, category]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold">All Articles</h1>
              <p className="text-muted-foreground mt-2">
                Explore our collection of thoughtful articles
              </p>
            </div>

            {/* Filters */}
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search articles..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Articles Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <ArticleCardSkeleton key={i} />
                ))}
              </div>
            ) : articles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    featured={article.featured}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No articles found</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
