import type { PageServerLoad } from './$types';
import { fetchGlobalRandomListing } from '$lib/api';

export const load: PageServerLoad = async ({ fetch, url, setHeaders }) => {
  const query = url.searchParams.get('q')?.trim() || '';
  const listing = await fetchGlobalRandomListing(fetch, 24, query);

  setHeaders({
    'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0'
  });

  return {
    query,
    articles: listing?.articles || [],
    featuredCategory: listing?.category || '',
    featuredCategoryLabel: listing?.categoryLabel || 'Technical Specifications'
  };
};