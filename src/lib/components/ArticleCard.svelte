<script lang="ts">
  import type { ArticleSummaryCard } from '$lib/types';

  interface Props {
    article: ArticleSummaryCard;
    headingLevel?: 'h2' | 'h3';
  }

  let { article, headingLevel = 'h2' }: Props = $props();
  let href = $derived(
    article.friendlyUrl || `/${encodeURIComponent(article.category)}/${encodeURIComponent(article.slug)}`
  );
  let thumbSrc = $derived(article.thumbnail || article.image);
</script>

<article class="summary-card">
  {#if thumbSrc}
    <figure>
      <a {href} tabindex="-1" aria-hidden="true">
        <img
          src={thumbSrc}
          alt={article.imageAlt || article.title}
          width="600"
          height="400"
          loading="lazy"
          decoding="async"
        />
      </a>
    </figure>
  {/if}

  <div class="card-body">
    <div class="meta-row">
      <a class="badge" href="/{encodeURIComponent(article.category)}">{article.categoryLabel}</a>
      <span>{article.imageCount} diagrams</span>
      <span>{article.sentenceCount} specs</span>
    </div>

    {#if headingLevel === 'h3'}
      <h3><a {href}>{article.title}</a></h3>
    {:else}
      <h2><a {href}>{article.title}</a></h2>
    {/if}

    <p>{article.excerpt}</p>
  </div>
</article>