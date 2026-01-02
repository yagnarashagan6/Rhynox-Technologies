import { API_ENDPOINTS } from '../config';

export const trackButtonClick = async (buttonType) => {
  try {
    await fetch(API_ENDPOINTS.ANALYTICS_CLICK, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ buttonType }),
    });
  } catch (err) {
    console.error(`Failed to track ${buttonType} click:`, err);
  }
};
