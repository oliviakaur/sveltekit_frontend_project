<script lang="ts">
  import ArticleCard from '$lib/components/ArticleCard.svelte';
  import { buildHomeSchema, serializeSchema } from '$lib/seo';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();

  let pageTitle = $derived(
    data.query
      ? `Search Results for "${data.query}" - ${data.host}`
      : `${data.host} - Technical Specifications, Wiring Diagrams & Repair Manuals`
  );

  let pageDesc = $derived(
    `Browse verified technical specifications, schematic diagrams, and diagnostic procedures across ${data.featuredCategoryLabel} and related engineering databases on ${data.host}.`
  );

  let homeSchemaJson = $derived(
    serializeSchema(buildHomeSchema(data.origin, data.host, data.articles))
  );
</script>

<svelte:head>
  <title>{pageTitle}</title>
  <link rel="canonical" href="{data.origin}/" />
  <meta
    name="robots"
    content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
  />
  <meta name="description" content={pageDesc} />
  {@html `<script type="application/ld+json">${homeSchemaJson}</script>`}
</svelte:head>

<header class="page-heading">
  {#if data.query}
    <h1>Search Results: "{data.query}"</h1>
    <p>{data.articles.length} matching technical articles found.</p>
  {:else}
    <h1>Technical Specifications &amp; Schematic Diagrams</h1>
    <p>
      Featured Database: <strong>{data.featuredCategoryLabel}</strong> &mdash; Instant access to verified component tolerances and wiring schematics.
    </p>
  {/if}
</header>

{#if data.articles.length > 0}
  <section aria-label="Technical Articles" class="article-grid">
    {#each data.articles as article (article.id + article.slug)}
      <ArticleCard {article} headingLevel="h2" />
    {/each}
  </section>
{:else}
  <p>No articles matched your query. Try another keyword or select a category above.</p>
{/if}