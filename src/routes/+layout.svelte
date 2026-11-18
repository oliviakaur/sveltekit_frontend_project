<script lang="ts">
  import '../styles/global.css';
  import Header from '$lib/components/Header.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import StickyBottomAd from '$lib/components/StickyBottomAd.svelte';
  import type { LayoutProps } from './$types';

  let { data, children }: LayoutProps = $props();
</script>

<Header
  siteName={data.host}
  categories={data.categories}
  currentQuery={data.currentQuery}
/>

<main class="site-main site-container">
  {@render children()}
</main>

<Footer siteName={data.host} categories={data.categories} />

<StickyBottomAd isBot={data.isBot} />