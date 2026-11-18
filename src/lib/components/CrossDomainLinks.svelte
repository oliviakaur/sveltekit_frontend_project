<script lang="ts">
  import type { CrossDomainRelatedLink } from '$lib/types';

  interface Props {
    links: CrossDomainRelatedLink[];
  }

  let { links = [] }: Props = $props();
</script>

{#if links.length > 0}
  <aside class="related-section" aria-labelledby="cross-domain-heading">
    <h2 id="cross-domain-heading">External Network Technical References</h2>
    <ul class="cross-domain-list">
      {#each links as item (item.id + item.crossDomainUrl)}
        <li>
          <span class="badge">{item.domainLabel}</span>
          <a href={item.crossDomainUrl} rel="noopener">
            {item.title}
          </a>
          <p style="font-size: var(--text-xs); color: var(--color-text-muted);">
            {item.categoryLabel} &middot; {item.excerpt}
          </p>
        </li>
      {/each}
    </ul>
  </aside>
{/if}