<script lang="ts">
  import type { CategoryInfo } from '$lib/types';

  interface Props {
    siteName: string;
    categories: CategoryInfo[];
  }

  let { siteName, categories = [] }: Props = $props();
  const year = new Date().getFullYear();
</script>

<footer class="site-footer">
  <div class="site-container">
    {#if categories.length > 0}
      <nav class="category-nav" aria-label="Footer Categories" style="border-top: 0; margin-bottom: var(--space-md);">
        {#each categories as cat (cat.category)}
          <a href="/{encodeURIComponent(cat.category)}">{cat.label}</a>
        {/each}
      </nav>
    {/if}
    <p>
      &copy; {year} {siteName}. All technical schematics, specifications, and reference guides are indexed for instant retrieval.
      <a href="/sitemap.xml">XML Sitemap</a>
    </p>
  </div>
</footer>