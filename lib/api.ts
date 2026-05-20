import {
  Article,
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  CreateArticlePayload,
  UpdateArticlePayload,
  User,
} from './types';

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  '/api';
const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true';
const ARTICLES_KEY = 'tech-business-hub:articles';
const USER_KEY = 'tech-business-hub:user';
const TOKEN_KEY = 'tech-business-hub:token';

interface BackendUser {
  _id?: string;
  id?: string;
  email?: string;
  name?: string;
  username?: string;
  role?: string;
  createdAt?: string;
}

interface BackendArticle {
  _id?: string;
  id?: string;
  title?: string;
  summary?: string;
  description?: string;
  content?: string | string[];
  topic?: string;
  category?: string;
  section?: string;
  url?: string;
  image?: string;
  featured?: boolean;
  views?: number;
  author?: BackendUser;
  authorId?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface AuthResponseBody {
  token?: string;
  accessToken?: string;
  jwt?: string;
  user?: BackendUser;
  data?: BackendUser & {
    token?: string;
    accessToken?: string;
    jwt?: string;
    user?: BackendUser;
  };
}

const demoUser: User = {
  id: 'demo-user',
  email: 'demo@example.com',
  name: 'Demo Writer',
  role: 'admin',
  createdAt: new Date('2026-05-01'),
};

const seedArticles: Article[] = [
  {
    id: 'ai-productivity-shifts',
    title: 'How AI Is Changing Everyday Productivity',
    description:
      'A practical look at how teams are folding AI into writing, research, planning, and operations.',
    content:
      'AI tools are becoming less like separate destinations and more like quiet layers inside the tools people already use.\n\nThe best results usually come from pairing clear human intent with fast iteration: draft, compare, refine, and verify. Teams that treat AI as a thinking partner tend to move faster without losing judgment.',
    category: 'Technology',
    authorId: demoUser.id,
    author: demoUser,
    featured: true,
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80',
    views: 1280,
    createdAt: new Date('2026-04-22'),
    updatedAt: new Date('2026-04-22'),
  },
  {
    id: 'startup-operating-rhythm',
    title: 'The Operating Rhythm Behind Calm Startups',
    description:
      'Why simple weekly rituals can matter more than complicated dashboards.',
    content:
      'A calm business is not a slow business. It is a business where priorities are visible, decisions have owners, and people know what matters this week.\n\nA lightweight rhythm can include a Monday planning note, a midweek blocker review, and a Friday reflection. The point is not ceremony. The point is shared attention.',
    category: 'Business',
    authorId: demoUser.id,
    author: demoUser,
    featured: true,
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80',
    views: 842,
    createdAt: new Date('2026-04-15'),
    updatedAt: new Date('2026-04-15'),
  },
  {
    id: 'design-systems-that-scale',
    title: 'Design Systems That Scale Without Getting Heavy',
    description:
      'A guide to keeping components useful, documented, and flexible as products grow.',
    content:
      'A design system should reduce repeated thinking, not create a second product that everyone has to negotiate with.\n\nThe healthiest systems start with real interface patterns, name them clearly, and only add rules when those rules prevent repeated mistakes.',
    category: 'Design',
    authorId: demoUser.id,
    author: demoUser,
    featured: true,
    image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=1200&q=80',
    views: 621,
    createdAt: new Date('2026-04-08'),
    updatedAt: new Date('2026-04-08'),
  },
];

function getStoredToken() {
  if (typeof window === 'undefined') return null;

  return window.localStorage.getItem(TOKEN_KEY);
}

function setStoredToken(token: string | null) {
  if (typeof window === 'undefined') return;

  if (token) {
    window.localStorage.setItem(TOKEN_KEY, token);
  } else {
    window.localStorage.removeItem(TOKEN_KEY);
  }
}

function decodeJwtPayload(token: string): Partial<BackendUser> {
  try {
    const payload = token.split('.')[1];
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = window.atob(normalized);

    return JSON.parse(decoded);
  } catch {
    return {};
  }
}

function extractAuth(response: AuthResponseBody): AuthResponse {
  const token =
    response.token ??
    response.accessToken ??
    response.jwt ??
    response.data?.token ??
    response.data?.accessToken ??
    response.data?.jwt ??
    '';
  const tokenUser = token ? decodeJwtPayload(token) : {};
  const responseUser = response.user ?? response.data?.user ?? response.data;
  const user = normalizeUser({
    ...tokenUser,
    ...responseUser,
    role: responseUser?.role ?? tokenUser.role,
  });

  setStoredToken(token);
  return { user, token };
}

function normalizeUser(user?: BackendUser | null): User {
  return {
    id: user?._id ?? user?.id ?? 'backend-user',
    email: user?.email ?? '',
    name: user?.name ?? user?.username ?? user?.email ?? 'User',
    role: user?.role,
    createdAt: new Date(user?.createdAt ?? Date.now()),
  };
}

function normalizeArticle(article: BackendArticle): Article {
  const content = Array.isArray(article.content)
    ? article.content.join('\n\n')
    : article.content ?? article.summary ?? '';
  const category = article.topic || article.category || article.section || 'Uncategorized';

  return {
    id: article._id ?? article.id ?? article.url ?? crypto.randomUUID(),
    title: article.title ?? 'Untitled article',
    description: article.summary ?? article.description ?? content.slice(0, 160),
    content,
    category,
    authorId: article.authorId ?? article.author?._id ?? article.author?.id ?? 'backend',
    author: article.author ? normalizeUser(article.author) : undefined,
    featured: article.featured ?? false,
    image: article.image,
    views: article.views ?? 0,
    createdAt: new Date(article.createdAt ?? Date.now()),
    updatedAt: new Date(article.updatedAt ?? article.createdAt ?? Date.now()),
  };
}

function unwrapArticles(response: unknown): { articles: Article[]; total: number } {
  if (Array.isArray(response)) {
    const articles = response.map((article) => normalizeArticle(article as BackendArticle));
    return { articles, total: articles.length };
  }

  const body = response as {
    data?: BackendArticle[];
    articles?: BackendArticle[];
    total?: number;
  };
  const rawArticles = body.data ?? body.articles ?? [];
  const articles = rawArticles.map((article) => normalizeArticle(article));

  return { articles, total: body.total ?? articles.length };
}

function unwrapArticle(response: unknown): { article: Article } {
  const body = response as {
    data?: BackendArticle;
    article?: BackendArticle;
  };

  return { article: normalizeArticle(body.data ?? body.article ?? (response as BackendArticle)) };
}

function toBackendArticlePayload(payload: CreateArticlePayload | UpdateArticlePayload) {
  return {
    title: payload.title,
    summary: payload.description,
    content: payload.content ? payload.content.split(/\n{2,}/).filter(Boolean) : undefined,
    topic: payload.category,
    category: payload.category,
    image: payload.image,
    featured: payload.featured,
  };
}

class MockAPI {
  private readArticles(): Article[] {
    if (typeof window === 'undefined') return seedArticles;

    const saved = window.localStorage.getItem(ARTICLES_KEY);
    if (!saved) {
      this.writeArticles(seedArticles);
      return seedArticles;
    }

    return JSON.parse(saved).map((article: Article) => ({
      ...article,
      createdAt: new Date(article.createdAt),
      updatedAt: new Date(article.updatedAt),
      author: article.author
        ? { ...article.author, createdAt: new Date(article.author.createdAt) }
        : undefined,
    }));
  }

  private writeArticles(articles: Article[]) {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(ARTICLES_KEY, JSON.stringify(articles));
    }
  }

  private readUser(): User | null {
    if (typeof window === 'undefined') return null;

    const saved = window.localStorage.getItem(USER_KEY);
    if (!saved) return null;

    const user = JSON.parse(saved) as User;
    return { ...user, createdAt: new Date(user.createdAt) };
  }

  private writeUser(user: User | null) {
    if (typeof window === 'undefined') return;

    if (user) {
      window.localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      window.localStorage.removeItem(USER_KEY);
    }
  }

  async login(payload: LoginPayload): Promise<AuthResponse> {
    const user: User = {
      id: 'local-user',
      email: payload.email,
      name: payload.email.split('@')[0] || 'Local Writer',
      role: 'admin',
      createdAt: new Date(),
    };
    this.writeUser(user);
    return { user, token: 'mock-token' };
  }

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const user: User = {
      id: 'local-user',
      email: payload.email,
      name: payload.username,
      role: 'user',
      createdAt: new Date(),
    };
    this.writeUser(user);
    return { user, token: 'mock-token' };
  }

  async logout(): Promise<void> {
    this.writeUser(null);
  }

  async getCurrentUser(): Promise<{ user: User | null }> {
    return { user: this.readUser() };
  }

  async getArticles(params?: {
    category?: string;
    search?: string;
    page?: number;
  }): Promise<{ articles: Article[]; total: number }> {
    const search = params?.search?.trim().toLowerCase();
    const articles = this.readArticles().filter((article) => {
      const matchesCategory = !params?.category || article.category === params.category;
      const matchesSearch =
        !search ||
        [article.title, article.description, article.content, article.category]
          .join(' ')
          .toLowerCase()
          .includes(search);

      return matchesCategory && matchesSearch;
    });

    return { articles, total: articles.length };
  }

  async getFeaturedArticles(): Promise<{ articles: Article[] }> {
    return { articles: this.readArticles().filter((article) => article.featured) };
  }

  async getArticle(id: string): Promise<{ article: Article }> {
    const article = this.readArticles().find((item) => item.id === id);
    if (!article) throw new Error('Article not found');

    return { article };
  }

  async createArticle(payload: CreateArticlePayload): Promise<{ article: Article }> {
    const user = this.readUser() ?? demoUser;
    const article: Article = {
      id: `${Date.now()}`,
      ...payload,
      authorId: user.id,
      author: user,
      featured: payload.featured ?? false,
      views: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.writeArticles([article, ...this.readArticles()]);
    return { article };
  }

  async updateArticle(
    id: string,
    payload: UpdateArticlePayload
  ): Promise<{ article: Article }> {
    let updatedArticle: Article | undefined;
    const articles = this.readArticles().map((article) => {
      if (article.id !== id) return article;

      updatedArticle = {
        ...article,
        ...payload,
        featured: payload.featured ?? article.featured,
        updatedAt: new Date(),
      };
      return updatedArticle;
    });

    if (!updatedArticle) throw new Error('Article not found');

    this.writeArticles(articles);
    return { article: updatedArticle };
  }

  async deleteArticle(id: string): Promise<void> {
    this.writeArticles(this.readArticles().filter((article) => article.id !== id));
  }

  async getUserArticles(): Promise<{ articles: Article[] }> {
    const user = this.readUser();
    if (!user) return { articles: [] };

    return {
      articles: this.readArticles().filter((article) => article.authorId === user.id),
    };
  }

  async incrementViews(id: string): Promise<void> {
    this.writeArticles(
      this.readArticles().map((article) =>
        article.id === id ? { ...article, views: article.views + 1 } : article
      )
    );
  }
}

class APIClient {
  private mock = new MockAPI();

  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const token = getStoredToken();
    const response = await fetch(`${BACKEND_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      const fallback =
        response.status === 403
          ? 'Forbidden: this action requires an admin account.'
          : `HTTP ${response.status}`;
      throw new Error(error.message || fallback);
    }

    return response.json();
  }

  async login(payload: LoginPayload): Promise<AuthResponse> {
    if (USE_MOCK_API) return this.mock.login(payload);

    const response = await this.request<AuthResponseBody>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return extractAuth(response);
  }

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    if (USE_MOCK_API) return this.mock.register(payload);

    const response = await this.request<AuthResponseBody>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return extractAuth(response);
  }

  async logout(): Promise<void> {
    if (USE_MOCK_API) return this.mock.logout();

    setStoredToken(null);
  }

  async getCurrentUser(): Promise<{ user: User | null }> {
    if (USE_MOCK_API) return this.mock.getCurrentUser();

    const token = getStoredToken();
    if (!token) return { user: null };

    try {
      const response = await this.request<{
        user?: BackendUser;
        data?: BackendUser;
      }>('/auth/me');
      const tokenUser = decodeJwtPayload(token);

      return {
        user: normalizeUser({
          ...tokenUser,
          ...(response.user ?? response.data ?? response),
        }),
      };
    } catch {
      return { user: null };
    }
  }

  async getArticles(params?: {
    category?: string;
    search?: string;
    page?: number;
  }): Promise<{ articles: Article[]; total: number }> {
    if (USE_MOCK_API) return this.mock.getArticles(params);

    const query = new URLSearchParams();
    if (params?.category) {
      query.append('category', params.category);
      query.append('topic', params.category);
    }
    if (params?.search) query.append('search', params.search);
    if (params?.page) query.append('page', params.page.toString());

    return unwrapArticles(await this.request(`/articles?${query.toString()}`));
  }

  async getFeaturedArticles(): Promise<{ articles: Article[] }> {
    if (USE_MOCK_API) return this.mock.getFeaturedArticles();

    const { articles } = unwrapArticles(await this.request('/articles'));

    return { articles: articles.slice(0, 3).map((article) => ({ ...article, featured: true })) };
  }

  async getArticle(id: string): Promise<{ article: Article }> {
    if (USE_MOCK_API) return this.mock.getArticle(id);

    try {
      return unwrapArticle(await this.request(`/articles/${id}`));
    } catch {
      const { articles } = unwrapArticles(await this.request('/articles'));
      const article = articles.find((item) => item.id === id);
      if (!article) throw new Error('Article not found');

      return { article };
    }
  }

  async createArticle(payload: CreateArticlePayload): Promise<{ article: Article }> {
    if (USE_MOCK_API) return this.mock.createArticle(payload);

    return unwrapArticle(await this.request('/articles', {
      method: 'POST',
      body: JSON.stringify(toBackendArticlePayload(payload)),
    }));
  }

  async updateArticle(
    id: string,
    payload: UpdateArticlePayload
  ): Promise<{ article: Article }> {
    if (USE_MOCK_API) return this.mock.updateArticle(id, payload);

    return unwrapArticle(await this.request(`/articles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(toBackendArticlePayload(payload)),
    }));
  }

  async deleteArticle(id: string): Promise<void> {
    if (USE_MOCK_API) return this.mock.deleteArticle(id);

    return this.request(`/articles/${id}`, {
      method: 'DELETE',
    });
  }

  async getUserArticles(): Promise<{ articles: Article[] }> {
    if (USE_MOCK_API) return this.mock.getUserArticles();

    const { articles } = unwrapArticles(await this.request('/articles/me'));
    return { articles };
  }

  async incrementViews(id: string): Promise<void> {
    if (USE_MOCK_API) return this.mock.incrementViews(id);
  }

  async submitArticle(payload: import('./types').SubmitArticlePayload): Promise<{ article: Article }> {
    if (USE_MOCK_API) return this.mock.createArticle({
      title: payload.title,
      description: payload.summary,
      content: payload.content,
      category: payload.category || 'Uncategorized',
    });

    return unwrapArticle(await this.request('/articles/submit', {
      method: 'POST',
      body: JSON.stringify({
        title: payload.title,
        summary: payload.summary,
        content: payload.content,
        category: payload.category,
        image: payload.image,
      }),
    }));
  }

  async getAdminArticles(status?: string): Promise<{ articles: import('./types').AdminArticle[] }> {
    if (USE_MOCK_API) {
      const { articles } = await this.mock.getArticles();
      return { articles: articles.map(a => ({ ...a, status: 'approved' as import('./types').ArticleStatus })) };
    }

    const query = status ? `?status=${status}` : '';
    const result = await this.request<{ total: number; data: BackendArticle[] }>(`/articles/admin/all${query}`);
    const articles = (result.data ?? []).map(a => ({
      ...normalizeArticle(a),
      status: ((a as BackendArticle & { status?: string }).status || 'approved') as import('./types').ArticleStatus,
      submittedBy: (a as BackendArticle & { submittedBy?: BackendUser }).submittedBy
        ? normalizeUser((a as BackendArticle & { submittedBy?: BackendUser }).submittedBy)
        : undefined,
      rejectionReason: (a as BackendArticle & { rejectionReason?: string }).rejectionReason || '',
    }));
    return { articles };
  }

  async approveArticle(id: string): Promise<{ article: Article }> {
    if (USE_MOCK_API) return this.mock.getArticle(id);
    return unwrapArticle(await this.request(`/articles/${id}/approve`, { method: 'PATCH' }));
  }

  async rejectArticle(id: string, reason?: string): Promise<{ article: Article }> {
    if (USE_MOCK_API) return this.mock.getArticle(id);
    return unwrapArticle(await this.request(`/articles/${id}/reject`, {
      method: 'PATCH',
      body: JSON.stringify({ reason: reason || '' }),
    }));
  }

}

export const api = new APIClient();
