const base = 'https://make.fun/api';
const cache = new Map();
async function get(path) {
  const url = base + path;
  const saved = cache.get(url);
  const response = await fetch(url, {
    headers: saved?.etag ? { 'If-None-Match': saved.etag } : {},
  });
  if (response.status === 304 && saved) return saved.data;
  if (!response.ok) throw new Error(`Request failed (${response.status})`);
  const data = await response.json();
  cache.set(url, { etag: response.headers.get('ETag'), data });
  return data;
}
export const getBounties = () => get('/competitions?status=open&activity=times');
export const getBounty = slug => get(`/competitions/${encodeURIComponent(slug)}`);
export const getLeaderboard = slug => get(`/competitions/${encodeURIComponent(slug)}/leaderboard`);
export const getProfile = handle => get(`/profiles/${encodeURIComponent(handle)}`);
