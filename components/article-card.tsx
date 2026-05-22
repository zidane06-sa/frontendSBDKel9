'use client';

import { Article } from '@/lib/types';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
}

export function ArticleCard({ article, featured }: ArticleCardProps) {
  return (
    <Link href={`/articles/${article.id}`}>
      <Card className="h-full shadow-none rounded-3xl overflow-hidden transition-colors hover:bg-slate-50 cursor-pointer group">
        {article.image && (
          <div className="relative w-full h-48 bg-gradient-to-br from-blue-100 to-indigo-100 overflow-hidden">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <CardTitle className="text-lg line-clamp-2">{article.title}</CardTitle>
              <CardDescription className="mt-1">{article.author?.name}</CardDescription>
            </div>
            {featured && <Badge className="bg-amber-500">Featured</Badge>}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{article.description}</p>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <Badge variant="outline">{article.category}</Badge>
            <span>{article.views} views</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
