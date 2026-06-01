import { API_BASE_URL } from '../config/env';

export function resolveMediaUrl(source?: string | null): string | undefined {
  if (!source) return undefined;
  if (/^https?:\/\//i.test(source)) return source;

  const normalizedBase = API_BASE_URL.replace(/\/$/, '');
  const normalizedPath = source.startsWith('/') ? source : `/${source}`;

  return `${normalizedBase}${normalizedPath}`;
}
