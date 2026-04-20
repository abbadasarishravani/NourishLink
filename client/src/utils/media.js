import { getApiOrigin } from './apiBase';

const API_ORIGIN = getApiOrigin();

export function resolveMediaUrl(url) {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }

  // Handle cache-busting query parameters
  const cleanUrl = url.split('?')[0];
  return `${API_ORIGIN}${cleanUrl.startsWith('/') ? cleanUrl : `/${cleanUrl}`}${url.includes('?') ? url.substring(url.indexOf('?')) : ''}`;
}
