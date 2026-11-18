import type { RequestHandler } from './$types';
import { API_BASE } from '$lib/api';

export const GET: RequestHandler = async ({ fetch, url }) => {
  const res = await fetch(`${API_BASE}/sitemap.xml?domain=all&db=all&limit=500`, {
    headers: { Accept: 'application/xml, text/xml' }
  });

  if (!res.ok) {
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`,
      {
        status: 200,
        headers: {
          'Content-Type': 'application/xml; charset=UTF-8',
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0'
        }
      }
    );
  }

  const rawXml = await res.text();
  const origin = url.origin.replace(/\/+$/, '');

  const rewrittenXml = rawXml.replace(
    /<loc>https?:\/\/[^<]+\/\?category=([^&<]+)(?:&amp;|&)slug=([^<]+)<\/loc>/gi,
    (_, cat: string, slug: string) =>
      `<loc>${origin}/${encodeURIComponent(decodeURIComponent(cat))}/${encodeURIComponent(decodeURIComponent(slug))}</loc>`
  );

  return new Response(rewrittenXml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=UTF-8',
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0'
    }
  });
};