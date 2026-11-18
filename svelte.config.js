import adapterNode from '@sveltejs/adapter-node';
import adapterVercel from '@sveltejs/adapter-vercel';
import adapterCloudflare from '@sveltejs/adapter-cloudflare';
import adapterNetlify from '@sveltejs/adapter-netlify';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const target = process.env.DEPLOY_TARGET || 'node';

function resolveAdapter() {
  switch (target) {
    case 'vercel':
      return adapterVercel({ runtime: 'nodejs22.x' });
    case 'cloudflare':
      return adapterCloudflare();
    case 'netlify':
      return adapterNetlify({ edge: false });
    case 'node':
    default:
      return adapterNode({ out: 'build' });
  }
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: resolveAdapter()
  }
};

export default config;