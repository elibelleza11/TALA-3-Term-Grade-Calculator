/**
 * TALA Analytics & Visitor Tracking Service
 * Supports GoatCounter (privacy-friendly, no cookies, works on GitHub Pages)
 * and Google Analytics 4 (gtag.js).
 * by Eli Belleza
 */

export interface AnalyticsConfig {
  goatCounterCode: string; // e.g. "tala-deped" for tala-deped.goatcounter.com
  googleAnalyticsId: string; // e.g. "G-XXXXXXXXXX"
  enabled: boolean;
}

const DEFAULT_GOATCOUNTER_CODE = 'tala-deped';
const STORAGE_KEY_CONFIG = 'tala_analytics_config';
const STORAGE_KEY_LOCAL_VISITS = 'tala_traffic_visits';

// Get current analytics settings
export function getAnalyticsConfig(): AnalyticsConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CONFIG);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // fallback
  }
  return {
    goatCounterCode: DEFAULT_GOATCOUNTER_CODE,
    googleAnalyticsId: '',
    enabled: true
  };
}

// Save custom analytics settings (e.g. user's own GoatCounter subdomain or GA ID)
export function saveAnalyticsConfig(config: AnalyticsConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
    applyAnalyticsScripts(config);
  } catch (err) {
    console.error('Failed to save analytics config', err);
  }
}

// Dynamically inject or update GoatCounter and Google Analytics scripts
export function applyAnalyticsScripts(config?: AnalyticsConfig): void {
  const cfg = config || getAnalyticsConfig();
  if (typeof window === 'undefined' || !cfg.enabled) return;

  // 1. GoatCounter Script Injection
  const existingGc = document.getElementById('goatcounter-script');
  if (cfg.goatCounterCode) {
    const endpoint = `https://${cfg.goatCounterCode}.goatcounter.com/count`;
    if (existingGc) {
      existingGc.setAttribute('data-goatcounter', endpoint);
    } else {
      const script = document.createElement('script');
      script.id = 'goatcounter-script';
      script.async = true;
      script.src = '//gc.zgo.at/count.js';
      script.setAttribute('data-goatcounter', endpoint);
      document.head.appendChild(script);
    }
  }

  // 2. Google Analytics 4 (gtag.js)
  if (cfg.googleAnalyticsId && cfg.googleAnalyticsId.startsWith('G-')) {
    const existingGa = document.getElementById('ga-gtag-script');
    if (!existingGa) {
      const gaScript = document.createElement('script');
      gaScript.id = 'ga-gtag-script';
      gaScript.async = true;
      gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${cfg.googleAnalyticsId}`;
      document.head.appendChild(gaScript);

      const gaInline = document.createElement('script');
      gaInline.id = 'ga-gtag-init';
      gaInline.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${cfg.googleAnalyticsId}', { anonymize_ip: true });
      `;
      document.head.appendChild(gaInline);
    }
  }
}

// Track a custom event (such as Grade Revealed or Goal Planned)
export function trackEvent(eventName: string, eventParams?: Record<string, any>): void {
  try {
    // 1. GoatCounter custom count
    if (typeof (window as any).goatcounter?.count === 'function') {
      (window as any).goatcounter.count({
        path: `event/${eventName}`,
        title: eventName,
        event: true
      });
    }

    // 2. Google Analytics gtag
    if (typeof (window as any).gtag === 'function') {
      (window as any).gtag('event', eventName, eventParams);
    }
  } catch (e) {
    // silently catch analytics block
  }
}

// Fetch live visitor count from GoatCounter public JSON endpoint
// Endpoint format: https://[code].goatcounter.com/counter//.json
export async function fetchLiveVisitorCount(code: string = DEFAULT_GOATCOUNTER_CODE): Promise<{ count: number; isLive: boolean }> {
  try {
    if (!code) {
      return { count: getLocalVisitCount(), isLive: false };
    }

    // Try fetching from GoatCounter counter API with a short timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(`https://${code}.goatcounter.com/counter//.json`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      // GoatCounter returns { count: "1,234" } or { count: 1234 }
      const rawCount = data.count;
      const parsed = typeof rawCount === 'number' ? rawCount : parseInt(String(rawCount).replace(/,/g, ''), 10);
      if (!isNaN(parsed) && parsed > 0) {
        // Sync to local fallback
        localStorage.setItem(STORAGE_KEY_LOCAL_VISITS, parsed.toString());
        return { count: parsed, isLive: true };
      }
    }
  } catch {
    // fallback to local visit count when offline or before public endpoint is reached
  }

  return { count: getLocalVisitCount(), isLive: false };
}

// Fallback local visit counter
export function getLocalVisitCount(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LOCAL_VISITS);
    if (raw) return parseInt(raw, 10);
  } catch {
    // ignore
  }
  return 3420;
}

export function incrementLocalVisitCount(): number {
  const current = getLocalVisitCount();
  const updated = current + 1;
  try {
    localStorage.setItem(STORAGE_KEY_LOCAL_VISITS, updated.toString());
  } catch {
    // ignore
  }
  return updated;
}
