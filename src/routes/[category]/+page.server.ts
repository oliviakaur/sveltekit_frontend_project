import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { fetchCategoryListing } from '$lib/api';

export const load: PageServerLoad = async ({ params, url, fetch, setHeaders }) => {
  const { category } = params;
  const query = url.searchParams.get('q')?.trim() || '';

  const categoryData = await fetchCategoryListing(fetch, category, 24, query);
  if (!categoryData) {
    error(404, 'Category database not found');
  }

  setHeaders({
    'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0'
  });

  return {
    query,
    category: categoryData.category,
    categoryLabel: categoryData.categoryLabel,
    totalInCategory: categoryData.totalInCategory,
    articles: categoryData.articles
  };
};