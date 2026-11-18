import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
  const body = [
    'User-agent: *',
    'Allow: /',
    `Sitemap: ${url.origin}/sitemap.xml`
  ].join('\n');

  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=UTF-8',
      'Cache-Control': 'public, max-age=86400'
    }
  });
};