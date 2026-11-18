<script lang="ts">
  import Breadcrumb from '$lib/components/Breadcrumb.svelte';
  import ArticleCard from '$lib/components/ArticleCard.svelte';
  import CrossDomainLinks from '$lib/components/CrossDomainLinks.svelte';
  import { buildArticleSchema, serializeSchema } from '$lib/seo';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
  let article = $derived(data.article);
  let canonicalUrl = $derived(
    `${data.origin}/${encodeURIComponent(article.category)}/${encodeURIComponent(article.slug)}`
  );

  let heroImage = $derived(article.images.length > 0 ? article.images[0] : null);
  let galleryImages = $derived(article.images.length > 1 ? article.images.slice(1) : []);

  let paragraphs = $derived.by(() => {
    const chunks: string[] = [];
    const s = article.sentences || [];
    for (let i = 0; i < s.length; i += 4) {
      chunks.push(s.slice(i, i + 4).join(' '));
    }
    return chunks;
  });

  let isoModified = $derived(
    new Date((article.updatedAt || article.createdAt) * 1000).toISOString()
  );
  let readableDate = $derived(
    new Date((article.updatedAt || article.createdAt) * 1000).toUTCString()
  );

  let articleSchemaJson = $derived(
    serializeSchema(buildArticleSchema(data.origin, article))
  );
</script>

<svelte:head>
  <title>{article.title} - {article.categoryLabel}</title>
  <link rel="canonical" href={canonicalUrl} />
  <meta
    name="robots"
    content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
  />
  <meta name="description" content={article.metaDesc} />
  <meta name="keywords" content={article.metaKeywords} />
  {@html `<script id="json-ld-schema" type="application/ld+json">${articleSchemaJson}</script>`}
</svelte:head>

<Breadcrumb
  items={[
    { label: 'Home', href: '/' },
    { label: article.categoryLabel, href: `/${encodeURIComponent(article.category)}` },
    { label: article.title }
  ]}
/>

<article class="technical-article">
  <header class="page-heading">
    <div class="meta-row" style="margin-bottom: var(--space-xs);">
      <a class="badge" href="/{encodeURIComponent(article.category)}">{article.categoryLabel}</a>
      <time datetime={isoModified}>Updated: {readableDate}</time>
      <span>{article.sentenceCount} Technical Statements</span>
      <span>{article.imageCount} Schematics</span>
    </div>
    <h1>{article.title}</h1>
  </header>

  {#if heroImage}
    <figure class="hero-diagram">
      <img
        src={heroImage.url}
        alt={heroImage.alt || article.title}
        width={heroImage.width || 800}
        height={heroImage.height || 500}
        fetchpriority="high"
        decoding="async"
      />
      <figcaption>
        <strong>Figure 1:</strong> {heroImage.title}
        {#if heroImage.filetype}
          ({heroImage.filetype.toUpperCase()})
        {/if}
      </figcaption>
    </figure>
  {/if}

  <section class="article-prose" aria-label="Technical Specification Details">
    {#each paragraphs as paragraph, idx (idx)}
      <p>{paragraph}</p>
    {/each}
  </section>

  {#if galleryImages.length > 0}
    <section class="diagram-gallery" aria-labelledby="gallery-heading">
      <h2 id="gallery-heading">
        Technical Schematics &amp; Wiring Diagrams ({galleryImages.length})
      </h2>
      <div class="gallery-grid">
        {#each galleryImages as img, idx (img.url + idx)}
          <figure class="diagram-card">
            <img
              src={img.url}
              alt={img.alt || img.title || `${article.title} Diagram ${idx + 2}`}
              width={img.width || 600}
              height={img.height || 400}
              loading="lazy"
              decoding="async"
            />
            <figcaption>
              <strong>Figure {idx + 2}:</strong> {img.title}
              {#if img.domain}
                <span> &middot; Source: {img.domain}</span>
              {/if}
            </figcaption>
          </figure>
        {/each}
      </div>
    </section>
  {/if}
</article>

{#await data.relatedPostsStream then relatedPosts}
  {#if relatedPosts && relatedPosts.length > 0}
    <aside class="related-section" aria-labelledby="related-posts-heading">
      <h2 id="related-posts-heading">Related Technical Specifications</h2>
      <div class="article-grid">
        {#each relatedPosts as post (post.id + post.slug)}
          <ArticleCard article={post} headingLevel="h3" />
        {/each}
      </div>
    </aside>
  {/if}
{/await}

{#await data.relatedLinksStream then relatedLinks}
  <CrossDomainLinks links={relatedLinks} />
{/await}