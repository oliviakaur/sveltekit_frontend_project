<script lang="ts">
  import Breadcrumb from '$lib/components/Breadcrumb.svelte';
  import ArticleCard from '$lib/components/ArticleCard.svelte';
  import { buildCategorySchema, serializeSchema } from '$lib/seo';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();

  let canonicalUrl = $derived(`${data.origin}/${encodeURIComponent(data.category)}`);
  let categorySchemaJson = $derived(
    serializeSchema(
      buildCategorySchema(data.origin, data.category, data.categoryLabel, data.articles)
    )
  );
</script>

<svelte:head>
  <title>{data.categoryLabel} Specifications &amp; Wiring Diagrams - {data.host}</title>
  <link rel="canonical" href={canonicalUrl} />
  <meta
    name="robots"
    content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
  />
  <meta
    name="description"
    content="Explore {data.totalInCategory} technical specifications, schematics, and troubleshooting guides in {data.categoryLabel} on {data.host}."
  />
  {@html `<script type="application/ld+json">${categorySchemaJson}</script>`}
</svelte:head>

<Breadcrumb
  items={[
    { label: 'Home', href: '/' },
    { label: data.categoryLabel }
  ]}
/>

<header class="page-heading">
  <span class="badge">{data.categoryLabel}</span>
  <h1>{data.categoryLabel} Technical Database</h1>
  <p>
    Showing {data.articles.length} of {data.totalInCategory} indexed engineering specifications and diagrams.
  </p>
</header>

<section aria-label="{data.categoryLabel} Articles" class="article-grid">
  {#each data.articles as article (article.id + article.slug)}
    <ArticleCard {article} headingLevel="h2" />
  {/each}
</section>