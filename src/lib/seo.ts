import type { ArticleSummaryCard, SingleArticleResponse } from './types';

export function serializeSchema(schema: Record<string, unknown> | Record<string, unknown>[]): string {
  return JSON.stringify(schema).replace(/</g, '\\u003c');
}

export function buildHomeSchema(origin: string, host: string, articles: ArticleSummaryCard[]) {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: `${host} Technical Reference`,
      url: `${origin}/`,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${origin}/?q={search_term_string}`,
        'query-input': 'required name=search_term_string'
      }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      itemListElement: articles.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${origin}${item.friendlyUrl || `/${item.category}/${item.slug}`}`,
        name: item.title
      }))
    }
  ];
}

export function buildCategorySchema(
  origin: string,
  category: string,
  categoryLabel: string,
  articles: ArticleSummaryCard[]
) {
  const categoryUrl = `${origin}/${encodeURIComponent(category)}`;
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: `${categoryLabel} Specifications & Diagrams`,
      url: categoryUrl,
      isPartOf: {
        '@type': 'WebSite',
        url: `${origin}/`
      }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: `${origin}/`
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: categoryLabel,
          item: categoryUrl
        }
      ]
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      itemListElement: articles.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${origin}${item.friendlyUrl || `/${item.category}/${item.slug}`}`,
        name: item.title
      }))
    }
  ];
}

export function buildArticleSchema(origin: string, article: SingleArticleResponse) {
  const canonicalUrl = `${origin}/${encodeURIComponent(article.category)}/${encodeURIComponent(article.slug)}`;
  const categoryUrl = `${origin}/${encodeURIComponent(article.category)}`;

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: article.title,
      description: article.metaDesc,
      articleSection: article.categoryLabel,
      keywords: article.metaKeywords,
      articleBody: article.sentences.join(' '),
      image: article.images.map((img) => ({
        '@type': 'ImageObject',
        url: img.url,
        contentUrl: img.url,
        caption: img.title,
        name: img.title,
        width: img.width || 600,
        height: img.height || 400
      })),
      datePublished: new Date(article.createdAt * 1000).toISOString(),
      dateModified: new Date((article.updatedAt || article.createdAt) * 1000).toISOString(),
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': canonicalUrl
      }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: `${origin}/`
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: article.categoryLabel,
          item: categoryUrl
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: article.title,
          item: canonicalUrl
        }
      ]
    }
  ];
}