<script lang="ts">
  import type { CategoryInfo } from '$lib/types';

  interface Props {
    siteName: string;
    categories: CategoryInfo[];
    currentQuery?: string;
  }

  let { siteName, categories = [], currentQuery = '' }: Props = $props();
</script>

<header class="site-header">
  <div class="site-container">
    <div class="header-bar">
      <a href="/" class="site-brand">{siteName}</a>

      <form class="search-form" action="/" method="GET" role="search">
        <input
          type="search"
          name="q"
          placeholder="Search specifications & diagrams..."
          value={currentQuery}
          aria-label="Search specifications"
        />
        <button type="submit">Search</button>
      </form>
    </div>

    {#if categories.length > 0}
      <nav class="category-nav" aria-label="Technical Categories">
        {#each categories.slice(0, 18) as cat (cat.category)}
          <a href="/{encodeURIComponent(cat.category)}">
            {cat.label} ({cat.count})
          </a>
        {/each}
      </nav>
    {/if}
  </div>
</header>