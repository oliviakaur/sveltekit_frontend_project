import { redirect, type Handle } from '@sveltejs/kit';

const BOT_UA_REGEX =
  /(googlebot|google-inspectiontool|adsbot-google|apis-google|mediapartners-google|googleother|bingbot|msnbot|adidxbot|bingpreview|slurp|duckduckbot|baiduspider|yandexbot|sogou|exabot|facebot|facebookexternalhit|ia_archiver|applebot|ahrefsbot|semrushbot|mj12bot|dotbot|petalbot|bytespider|gptbot|claudebot|perplexitybot|ccbot|twitterbot|linkedinbot|headlesschrome|lighthouse|pagespeed|gtmetrix|pingdom|crawler|spider|robot|crawling)/i;

export const handle: Handle = async ({ event, resolve }) => {
  const { url, request } = event;

  if (url.pathname === '/') {
    const category = url.searchParams.get('category')?.trim();
    const slug = url.searchParams.get('slug')?.trim();

    if (category && slug) {
      redirect(301, `/${encodeURIComponent(category)}/${encodeURIComponent(slug)}`);
    }
    if (category) {
      redirect(301, `/${encodeURIComponent(category)}`);
    }
  }

  const ua = request.headers.get('user-agent') || '';
  const secChUa = request.headers.get('sec-ch-ua') || '';
  event.locals.isBot =
    BOT_UA_REGEX.test(ua) || /headless|googlebot|bingbot/i.test(secChUa);

  return resolve(event);
};