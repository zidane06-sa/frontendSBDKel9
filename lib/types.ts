export interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
  createdAt: Date;
}

export interface Article {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  authorId: string;
  author?: User;
  featured: boolean;
  image?: string;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  username: string;
}

export interface CreateArticlePayload {
  title: string;
  description: string;
  content: string;
  category: string;
  featured?: boolean;
  image?: string;
}

export interface UpdateArticlePayload extends Partial<CreateArticlePayload> {}

export type ArticleStatus = 'approved' | 'pending' | 'rejected';

export interface SubmitArticlePayload {
  title: string;
  summary: string;
  content: string;
  category?: string;
  image?: string;
}

export interface AdminArticle extends Article {
  status: ArticleStatus;
  submittedBy?: User;
  reviewedBy?: User;
  rejectionReason?: string;
}
