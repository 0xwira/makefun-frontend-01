const base = 'https://make.fun/api';
const cache = new Map();
async function get(path) {
  const url = base + path;
  const saved = cache.get(url);
  if (saved && Date.now() - saved.at < 60000) return saved.data;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Request failed (${response.status})`);
  const data = await response.json();
  cache.set(url, { data, at: Date.now() });
  return data;
}
export const getBounties = () => get('/competitions?status=open&activity=times');
export const getBounty = slug => get(`/competitions/${encodeURIComponent(slug)}`);
export const getLeaderboard = slug => get(`/competitions/${encodeURIComponent(slug)}/leaderboard`);
export const getProfile = handle => get(`/profiles/${encodeURIComponent(handle)}`);
