<script lang="ts">
  export interface Crumb {
    label: string;
    href?: string;
  }

  interface Props {
    items: Crumb[];
  }

  let { items }: Props = $props();
</script>

<nav class="breadcrumb" aria-label="Breadcrumb">
  <ol>
    {#each items as item, idx (idx)}
      <li>
        {#if item.href && idx < items.length - 1}
          <a href={item.href}>{item.label}</a>
        {:else}
          <span aria-current="page">{item.label}</span>
        {/if}
      </li>
    {/each}
  </ol>
</nav>