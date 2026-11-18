import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import {
  fetchCrossDomainRelatedLinks,
  fetchRelatedPostsSameDomain,
  fetchSingleArticle
} from '$lib/api';

export const load: PageServerLoad = async ({ params, url, fetch, setHeaders, locals }) => {
  const { category, slug } = params;

  const article = await fetchSingleArticle(fetch, category, slug);
  if (!article) {
    error(404, 'Article not found');
  }

  setHeaders({
    'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800'
  });

  const relatedPostsPromise = fetchRelatedPostsSameDomain(fetch, article.slug, 10).catch(
    () => []
  );
  const relatedLinksPromise = fetchCrossDomainRelatedLinks(
    fetch,
    article.slug,
    url.origin,
    5
  ).catch(() => []);

  if (locals.isBot) {
    const [relatedPosts, relatedLinks] = await Promise.all([
      relatedPostsPromise,
      relatedLinksPromise
    ]);
    return {
      origin: url.origin,
      article,
      relatedPostsStream: Promise.resolve(relatedPosts),
      relatedLinksStream: Promise.resolve(relatedLinks)
    };
  }

  return {
    origin: url.origin,
    article,
    relatedPostsStream: relatedPostsPromise,
    relatedLinksStream: relatedLinksPromise
  };
};