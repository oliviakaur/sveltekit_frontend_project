import { env } from '$env/dynamic/public';
import type {
  AllowlistStatusResponse,
  ArticleSummaryCard,
  CategoriesResponse,
  CategoryListingResponse,
  CrossDomainRelatedLink,
  GlobalListingResponse,
  SingleArticleResponse
} from './types';

export const API_BASE = (env.PUBLIC_API_BASE || 'https://bunbunserver.my.id').replace(/\/+$/, '');

export function toFriendlyUrl(card: ArticleSummaryCard): ArticleSummaryCard {
  return {
    ...card,
    friendlyUrl: `/${encodeURIComponent(card.category)}/${encodeURIComponent(card.slug)}`
  };
}

export async function fetchSingleArticle(
  fetchFn: typeof fetch,
  category: string,
  slug: string
): Promise<SingleArticleResponse | null> {
  const res = await fetchFn(
    `${API_BASE}/api/article/${encodeURIComponent(category)}/${encodeURIComponent(slug)}`,
    { headers: { Accept: 'application/json' } }
  );
  if (!res.ok) return null;
  const data = (await res.json()) as SingleArticleResponse;
  if (!data || !Array.isArray(data.sentences) || data.sentences.length === 0) return null;
  return data;
}

export async function fetchGlobalRandomListing(
  fetchFn: typeof fetch,
  limit = 24,
  query = ''
): Promise<GlobalListingResponse | null> {
  const params = new URLSearchParams({ limit: String(limit) });
  if (query) params.set('q', query);
  const res = await fetchFn(`${API_BASE}/api/articles/random?${params.toString()}`, {
    headers: { Accept: 'application/json' }
  });
  if (!res.ok) return null;
  const data = (await res.json()) as GlobalListingResponse;
  return {
    ...data,
    articles: (data.articles || []).map(toFriendlyUrl)
  };
}

export async function fetchCategoryListing(
  fetchFn: typeof fetch,
  category: string,
  limit = 24,
  query = ''
): Promise<CategoryListingResponse | null> {
  const params = new URLSearchParams({ limit: String(limit) });
  if (query) params.set('q', query);
  const res = await fetchFn(
    `${API_BASE}/api/category/${encodeURIComponent(category)}?${params.toString()}`,
    { headers: { Accept: 'application/json' } }
  );
  if (!res.ok) return null;
  const data = (await res.json()) as CategoryListingResponse;
  return {
    ...data,
    articles: (data.articles || []).map(toFriendlyUrl)
  };
}

let cachedCategories: CategoriesResponse | null = null;
let categoriesCacheExpires = 0;

export async function fetchCategoriesDirectory(
  fetchFn: typeof fetch
): Promise<CategoriesResponse> {
  const now = Date.now();
  if (cachedCategories && now < categoriesCacheExpires) {
    return cachedCategories;
  }
  const res = await fetchFn(`${API_BASE}/api/categories`, {
    headers: { Accept: 'application/json' }
  });
  if (!res.ok) return cachedCategories ?? { categories: [], totalCategories: 0 };
  cachedCategories = (await res.json()) as CategoriesResponse;
  categoriesCacheExpires = now + 5 * 60 * 1000;
  return cachedCategories;
}

export async function fetchRelatedPostsSameDomain(
  fetchFn: typeof fetch,
  currentSlug: string,
  limit = 10
): Promise<ArticleSummaryCard[]> {
  const data = await fetchGlobalRandomListing(fetchFn, limit + 2);
  if (!data || !Array.isArray(data.articles)) return [];
  return data.articles.filter((a) => a.slug !== currentSlug).slice(0, limit);
}

export async function fetchCrossDomainRelatedLinks(
  fetchFn: typeof fetch,
  currentSlug: string,
  currentOrigin: string,
  limit = 5
): Promise<CrossDomainRelatedLink[]> {
  const [articlesData, domainsRes] = await Promise.all([
    fetchGlobalRandomListing(fetchFn, limit + 2),
    fetchFn(`${API_BASE}/api/domains/status`, {
      headers: { Accept: 'application/json', Origin: currentOrigin }
    }).then((r) => (r.ok ? (r.json() as Promise<AllowlistStatusResponse>) : null))
  ]);

  const rawDomains = domainsRes?.activeDomains || [];
  let currentHost = '';
  try {
    currentHost = new URL(currentOrigin).hostname.toLowerCase();
  } catch {
    currentHost = '';
  }

  const validOrigins = rawDomains.filter((d) => {
    try {
      const h = new URL(d).hostname.toLowerCase();
      return h !== currentHost && h !== 'localhost' && h !== '127.0.0.1';
    } catch {
      return false;
    }
  });

  const cards = (articlesData?.articles || [])
    .filter((a) => a.slug !== currentSlug)
    .slice(0, limit);

  return cards.map((item, idx) => {
    const allowedDomain =
      validOrigins.length > 0 ? validOrigins[idx % validOrigins.length] : currentOrigin;
    return {
      ...item,
      allowedDomain,
      domainLabel: allowedDomain.replace(/^https?:\/\//i, ''),
      crossDomainUrl: `${allowedDomain}/?category=${encodeURIComponent(item.category)}&slug=${encodeURIComponent(item.slug)}`
    };
  });
}