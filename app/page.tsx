'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/header';
import { ArticleCard } from '@/components/article-card';
import { ArticleCardSkeleton } from '@/components/article-card-skeleton';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { Article } from '@/lib/types';
import { ChevronRight } from 'lucide-react';

export default function HomePage() {
  const [featured, setFeatured] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const { articles } = await api.getFeaturedArticles();
        setFeatured(articles.slice(0, 3));
      } catch (err) {
        console.error('[v0] Failed to load featured articles:', err);
      } finally {
        setLoading(false);
      }
    };

    loadFeatured();
  }, []);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <div className="text-center space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-balance">
              Discover Thoughtful
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Articles & Ideas
              </span>
            </h1>
            <p className="text-xl text-muted-foreground text-balance mx-auto max-w-2xl">
              Explore a curated collection of articles on technology, design, and innovation. Share your insights with our community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" asChild>
                <Link href="/articles">Explore Articles</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/register">Start Writing</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Featured Articles Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold">Featured Articles</h2>
                <p className="text-muted-foreground mt-2">
                  Hand-picked stories that matter
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/articles" className="gap-2">
                  View All <ChevronRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <ArticleCardSkeleton key={i} />
                ))}
              </div>
            ) : featured.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featured.map((article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    featured={article.featured}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No featured articles yet</p>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg p-8 sm:p-12 text-white text-center space-y-4">
            <h3 className="text-3xl font-bold">Share Your Knowledge</h3>
            <p className="text-lg opacity-90">
              Join our community and publish your own articles
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t bg-muted/30 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Calm Scope. All rights reserved.</p>
          </div>
        </footer>
      </main>
    </>
  );
}
