import { API_ENDPOINTS } from '../config';

const sessionStorageKey = 'rhynox_analytics_session';

export const getAnalyticsSessionId = () => {
  let sessionId = sessionStorage.getItem(sessionStorageKey);
  if (!sessionId) {
    sessionId = crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    sessionStorage.setItem(sessionStorageKey, sessionId);
  }
  return sessionId;
};

const deviceDetails = () => {
  const ua = navigator.userAgent;
  return {
    device: /Mobi|Android/i.test(ua) ? 'Mobile' : /iPad|Tablet/i.test(ua) ? 'Tablet' : 'Desktop',
    browser: /Edg\//.test(ua) ? 'Edge' : /Chrome\//.test(ua) ? 'Chrome' : /Safari\//.test(ua) ? 'Safari' : /Firefox\//.test(ua) ? 'Firefox' : 'Other',
    os: /Windows/.test(ua) ? 'Windows' : /Android/.test(ua) ? 'Android' : /iPhone|iPad|Mac OS/.test(ua) ? 'Apple' : 'Other'
  };
};

export const trackEvent = async (eventType, meta = {}) => {
  try {
    await fetch(API_ENDPOINTS.ANALYTICS_EVENTS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType,
        sessionId: getAnalyticsSessionId(),
        page: window.location.pathname,
        referrer: document.referrer,
        ...deviceDetails(),
        meta
      })
    });
  } catch (err) {
    // Analytics must never interrupt public-site interactions.
    console.error(`Failed to track ${eventType}:`, err);
  }
};

export const trackButtonClick = async (buttonType) => {
  try {
    await Promise.all([
      fetch(API_ENDPOINTS.ANALYTICS_CLICK, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ buttonType }),
      }),
      trackEvent(buttonType === 'whatsapp' ? 'whatsapp_click' : 'call_click')
    ]);
  } catch (err) {
    console.error(`Failed to track ${buttonType} click:`, err);
  }
};
