
/**
 * Safely handles image URLs to prevent mixed content errors in production
 * @param {string} url - The image URL to check
 * @returns {string} - The safe URL or a placeholder
 */
export const getSafeImageUrl = (url) => {
  if (!url) return '';
  
  // Check if we are in production (not localhost)
  // We check for window existence for SSR safety, though this is likely client-side only
  const isProduction = typeof window !== 'undefined' && 
                       window.location.hostname !== 'localhost' && 
                       window.location.hostname !== '127.0.0.1';
  
  // If in production and URL is localhost, return a placeholder
  if (isProduction && (url.includes('localhost') || url.includes('127.0.0.1'))) {
    // Return a professional placeholder from a reliable CDN
    return 'https://placehold.co/800x600/1a1a1a/ffffff?text=Image+Not+Available';
  }
  
  return url;
};
