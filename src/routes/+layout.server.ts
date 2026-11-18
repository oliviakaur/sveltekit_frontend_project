import type { LayoutServerLoad } from './$types';
import { fetchCategoriesDirectory } from '$lib/api';

export const load: LayoutServerLoad = async ({ fetch, url, locals }) => {
  const categoriesData = await fetchCategoriesDirectory(fetch).catch(() => ({
    categories: [],
    totalCategories: 0
  }));

  return {
    origin: url.origin,
    host: url.hostname,
    isBot: locals.isBot,
    categories: categoriesData.categories || [],
    currentQuery: url.searchParams.get('q') || ''
  };
};