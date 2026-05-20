'use client';

import { useState } from 'react';
import { Article, CreateArticlePayload } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

const CATEGORIES = ['Technology', 'Design', 'Innovation', 'Business', 'Science', 'Other'];

interface ArticleFormProps {
  article?: Article;
  onSubmit: (data: CreateArticlePayload) => Promise<void>;
  isLoading?: boolean;
  submitText?: string;
}

export function ArticleForm({
  article,
  onSubmit,
  isLoading,
  submitText = 'Publish Article',
}: ArticleFormProps) {
  const [title, setTitle] = useState(article?.title || '');
  const [description, setDescription] = useState(article?.description || '');
  const [content, setContent] = useState(article?.content || '');
  const [category, setCategory] = useState(article?.category || 'Technology');
  const [image, setImage] = useState(article?.image || '');
  const [featured, setFeatured] = useState(article?.featured || false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !description.trim() || !content.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      await onSubmit({
        title,
        description,
        content,
        category,
        image: image || undefined,
        featured,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save article');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{article ? 'Edit Article' : 'Create New Article'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title *
            </label>
            <Input
              id="title"
              placeholder="Article title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description *
            </label>
            <Textarea
              id="description"
              placeholder="Brief description of your article"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isLoading}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="content" className="text-sm font-medium">
              Content *
            </label>
            <Textarea
              id="content"
              placeholder="Write your article content here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isLoading}
              rows={10}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium">
                Category
              </label>
              <Select value={category} onValueChange={setCategory} disabled={isLoading}>
                <SelectTrigger id="category">
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

            <div className="space-y-2">
              <label htmlFor="image" className="text-sm font-medium">
                Image URL
              </label>
              <Input
                id="image"
                type="url"
                placeholder="https://example.com/image.jpg"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="featured"
              checked={featured}
              onCheckedChange={(checked) => setFeatured(checked as boolean)}
              disabled={isLoading}
            />
            <label htmlFor="featured" className="text-sm cursor-pointer">
              Mark as featured article
            </label>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : submitText}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
