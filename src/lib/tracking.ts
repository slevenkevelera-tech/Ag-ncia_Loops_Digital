// ==========================================
// UNIFIED TRACKING & ADS CONVERSIONS ENGINE
// Meta CAPI, Google Ads, TikTok, LinkedIn & LGPD
// ==========================================

declare global {
  interface Window {
    fbq?: any;
    gtag?: any;
    dataLayer?: any[];
    ttq?: any;
    lintrk?: any;
    _loopsConsent?: {
      ad_storage: 'granted' | 'denied';
      analytics_storage: 'granted' | 'denied';
      ad_user_data: 'granted' | 'denied';
      ad_personalization: 'granted' | 'denied';
    };
  }
}

// SHA-256 Hash Helper for LGPD & Privacy Compliance
export async function sha256(value: string): Promise<string> {
  if (!value) return '';
  const cleanValue = value.trim().toLowerCase();
  const msgUint8 = new TextEncoder().encode(cleanValue);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export interface TrackingUserData {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  city?: string;
  state?: string;
  country?: string;
}

export interface TrackingEventPayload {
  eventName: 'PageView' | 'Lead' | 'Contact' | 'Schedule' | 'ViewContent' | 'InitiateCheckout';
  userData?: TrackingUserData;
  customData?: {
    value?: number;
    currency?: string;
    service?: string;
    channel?: string;
    contentName?: string;
    [key: string]: any;
  };
  eventSourceUrl?: string;
}

// Generate unique event ID for Meta & Google Server-Side Deduplication
export function generateEventId(): string {
  return `evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

// Initialize Google Consent Mode v2 Default State
export function initConsentMode() {
  if (typeof window === 'undefined') return;

  const storedConsent = localStorage.getItem('loops_cookie_consent');
  const isGranted = storedConsent === 'all';

  window._loopsConsent = {
    ad_storage: isGranted ? 'granted' : 'denied',
    analytics_storage: isGranted ? 'granted' : 'denied',
    ad_user_data: isGranted ? 'granted' : 'denied',
    ad_personalization: isGranted ? 'granted' : 'denied',
  };

  // Push to dataLayer if gtag exists
  if (window.gtag) {
    window.gtag('consent', 'default', window._loopsConsent);
  }
}

// Dispatch Conversion Event to ALL Major Social Networks (Client + Server-Side CAPI)
export async function trackConversionEvent(payload: TrackingEventPayload): Promise<{
  eventId: string;
  clientDispatched: string[];
  serverDispatched: boolean;
}> {
  const eventId = generateEventId();
  const eventSourceUrl = payload.eventSourceUrl || (typeof window !== 'undefined' ? window.location.href : '');
  const clientDispatched: string[] = [];

  // 1. Prepare Hashed User Data for LGPD / CAPI compliance
  let hashedUserData: Record<string, string> = {};
  if (payload.userData) {
    if (payload.userData.email) hashedUserData.em = await sha256(payload.userData.email);
    if (payload.userData.phone) hashedUserData.ph = await sha256(payload.userData.phone.replace(/\D/g, ''));
    if (payload.userData.firstName) hashedUserData.fn = await sha256(payload.userData.firstName);
    if (payload.userData.lastName) hashedUserData.ln = await sha256(payload.userData.lastName);
    if (payload.userData.city) hashedUserData.ct = await sha256(payload.userData.city);
    if (payload.userData.state) hashedUserData.st = await sha256(payload.userData.state);
    if (payload.userData.country) hashedUserData.country = await sha256(payload.userData.country);
  }

  // 2. Client-Side: Meta Pixel (with eventID deduplication)
  if (typeof window !== 'undefined' && window.fbq) {
    try {
      window.fbq('track', payload.eventName, payload.customData || {}, { eventID: eventId });
      clientDispatched.push('Meta Pixel');
    } catch {}
  }

  // 3. Client-Side: Google Ads & GA4 (gtag)
  if (typeof window !== 'undefined' && window.gtag) {
    try {
      window.gtag('event', payload.eventName.toLowerCase(), {
        event_id: eventId,
        value: payload.customData?.value,
        currency: payload.customData?.currency || 'BRL',
        user_data: hashedUserData,
      });
      clientDispatched.push('Google Ads / GA4');
    } catch {}
  }

  // 4. Client-Side: TikTok Pixel (ttq)
  if (typeof window !== 'undefined' && window.ttq) {
    try {
      window.ttq.track(payload.eventName, payload.customData || {});
      clientDispatched.push('TikTok Pixel');
    } catch {}
  }

  // 5. Client-Side: LinkedIn Insight Tag
  if (typeof window !== 'undefined' && window.lintrk) {
    try {
      window.lintrk('track', { conversion_id: 12345 });
      clientDispatched.push('LinkedIn Insight Tag');
    } catch {}
  }

  // 6. SERVER-SIDE DISPATCH: Meta Conversions API (CAPI), Google & TikTok Server APIs
  let serverDispatched = false;
  try {
    const res = await fetch('/api/tracking/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventId,
        eventName: payload.eventName,
        eventSourceUrl,
        userData: payload.userData,
        hashedUserData,
        customData: payload.customData,
        timestamp: Math.floor(Date.now() / 1000),
      }),
    });
    serverDispatched = res.ok;
  } catch (err) {
    console.warn('Server-side tracking dispatch error:', err);
  }

  return {
    eventId,
    clientDispatched,
    serverDispatched,
  };
}
