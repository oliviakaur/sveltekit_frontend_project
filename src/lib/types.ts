export interface ArticleImage {
  keyword?: string;
  slug?: string;
  title: string;
  alt: string;
  url: string;
  thumb: string;
  filetype: string;
  source: string;
  domain?: string;
  width: number;
  height: number;
}

export interface SingleArticleResponse {
  id: number;
  category: string;
  categoryLabel: string;
  keyword: string;
  slug: string;
  title: string;
  content: string;
  sentences: string[];
  images: ArticleImage[];
  imageCount: number;
  sentenceCount: number;
  metaDesc: string;
  metaKeywords: string;
  createdAt: number;
  updatedAt: number;
  status: number;
  rewriteCount: number;
  canonicalPath: string;
}

export interface ArticleSummaryCard {
  id: number;
  category: string;
  categoryLabel: string;
  keyword: string;
  title: string;
  slug: string;
  excerpt: string;
  thumbnail: string | null;
  image: string | null;
  imageAlt: string;
  imageCount: number;
  sentenceCount: number;
  createdAt: number;
  updatedAt: number;
  url: string;
  friendlyUrl?: string;
}

export interface CategoryInfo {
  category: string;
  label: string;
  count: number;
  loadedAt: number;
  updatedAt: number;
}

export interface GlobalListingResponse {
  articles: ArticleSummaryCard[];
  count: number;
  query: string;
  category: string;
  categoryLabel: string;
  categories: CategoryInfo[];
}

export interface CategoryListingResponse {
  category: string;
  categoryLabel: string;
  totalInCategory: number;
  articles: ArticleSummaryCard[];
}

export interface CategoriesResponse {
  categories: CategoryInfo[];
  totalCategories: number;
}

export interface AllowlistStatusResponse {
  policy: string;
  allowedDomainsFile: string;
  activeCount: number;
  publicFrontendDomainCount: number;
  sampledCount: number;
  isSampled: boolean;
  activeDomains: string[];
}

export interface CrossDomainRelatedLink extends ArticleSummaryCard {
  allowedDomain: string;
  domainLabel: string;
  crossDomainUrl: string;
}

export interface ApiErrorResponse {
  error: string;
  message?: string;
  category?: string;
  slug?: string;
}