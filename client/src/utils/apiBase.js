const DEFAULT_API_ORIGIN = 'http://localhost:5000';

export function getApiOrigin() {
  const rawUrl = (import.meta.env.VITE_API_URL || DEFAULT_API_ORIGIN).trim();

  return rawUrl
    .replace(/\/+$/, '')
    .replace(/\/api$/, '');
}

export function getApiBaseUrl() {
  return `${getApiOrigin()}/api`;
}
