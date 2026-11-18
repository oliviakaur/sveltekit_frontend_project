<script lang="ts">
  interface Props {
    isBot: boolean;
  }

  let { isBot }: Props = $props();
  let humanVerified = $state(false);
  let adSrcDoc = $state('');

  const CLIENT_BOT_REGEX =
    /(googlebot|google-inspectiontool|adsbot|bingbot|msnbot|slurp|duckduckbot|baiduspider|yandexbot|applebot|ahrefsbot|semrushbot|petalbot|bytespider|gptbot|headless|lighthouse|pagespeed|crawler|spider|robot|crawling)/i;

  function buildAdDocument(): string {
    const adKey = 'a215683d2d0ce8fecd54e01b99606d75';
    const adHost = 'https://hiibel.com/22/';
    const sOpen = '<scr' + 'ipt>';
    const sClose = '</scr' + 'ipt>';
    const sExt = `<scr` + `ipt src="${adHost}${adKey}"></scr` + `ipt>`;

    return `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;padding:0;width:300px;height:250px;overflow:hidden;background:transparent;}</style></head><body>${sOpen}atOptions={'key':'${adKey}','format':'iframe','height':250,'width':300,'params':{}};${sClose}${sExt}</body></html>`;
  }

  $effect(() => {
    if (isBot || typeof window === 'undefined') return;
    if (navigator.webdriver) return;
    if (CLIENT_BOT_REGEX.test(navigator.userAgent || '')) return;
    if (window.outerWidth === 0 && window.outerHeight === 0) return;

    function activateOnHumanInteraction(e: Event) {
      if (!e.isTrusted) return;
      humanVerified = true;
      adSrcDoc = buildAdDocument();
      cleanup();
    }

    function cleanup() {
      window.removeEventListener('pointermove', activateOnHumanInteraction);
      window.removeEventListener('touchstart', activateOnHumanInteraction);
      window.removeEventListener('wheel', activateOnHumanInteraction);
      window.removeEventListener('keydown', activateOnHumanInteraction);
    }

    window.addEventListener('pointermove', activateOnHumanInteraction, { once: true, passive: true });
    window.addEventListener('touchstart', activateOnHumanInteraction, { once: true, passive: true });
    window.addEventListener('wheel', activateOnHumanInteraction, { once: true, passive: true });
    window.addEventListener('keydown', activateOnHumanInteraction, { once: true, passive: true });

    return cleanup;
  });
</script>

{#if !isBot && humanVerified && adSrcDoc}
  <aside class="sticky-bottom-ad" aria-label="Sponsored Content">
    <iframe
      title="Sponsored Banner"
      width="300"
      height="250"
      scrolling="no"
      sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
      srcdoc={adSrcDoc}
    ></iframe>
  </aside>
{/if}