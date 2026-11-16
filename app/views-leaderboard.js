import { getLeaderboard } from './api.js';
import { esc, int } from './format.js';

function avatar(path) {
  try {
    const url = new URL(path, 'https://make.fun');
    return /^https?:$/.test(url.protocol) ? url.href : '';
  } catch { return ''; }
}

export async function leaderboard(root, slug) {
  window.__shotReady = false;
  root.innerHTML = '<p class="notice" role="status">Loading leaderboard…</p>';
  const data = await getLeaderboard(slug);
  const entries = Array.isArray(data.entries) ? [...data.entries] : [];
  const rank = value => value != null && Number.isFinite(Number(value)) ? Number(value) : Infinity;
  entries.sort((a, b) => rank(a.rank) - rank(b.rank));
  root.innerHTML = `<article class="page"><a href="#/bounty/${encodeURIComponent(slug)}">← Back to bounty</a><p class="eyebrow" style="margin-top:28px">The standings / ${esc(data.competition?.status ?? 'Leaderboard')}</p><h1>${esc(data.competition?.title ?? data.title ?? slug)}</h1><p class="muted">${int(entries.length)} entries · Ranked by judge win rate</p><div class="table-scroll"><table class="standings"><thead><tr><th scope="col">Rank</th><th scope="col">Entrant</th><th scope="col">Entry</th><th scope="col">Judge win rate</th><th scope="col">Prize place</th></tr></thead><tbody>${entries.map(entry => {
    const image = entry.image ? avatar(entry.image) : '';
    const judge = entry.values?.judge;
    const rate = judge != null && Number.isFinite(Number(judge)) ? `${(Number(judge) / 1e6 * 100).toLocaleString('en-US', { maximumFractionDigits: 2 })}%` : '—';
    const prize = Number(entry.prize_rank);
    return `<tr><td>${Number.isFinite(rank(entry.rank)) ? esc(entry.rank) : '—'}</td><td><span class="entrant">${image ? `<img class="avatar" src="${esc(image)}" crossorigin="anonymous" alt="" width="32" height="32">` : ''}${entry.handle ? `<a href="#/profile/${encodeURIComponent(entry.handle)}">${esc(entry.handle)}</a>` : esc(typeof entry.display === 'string' ? entry.display : 'Anonymous')}</span></td><td>${esc(entry.title || 'Untitled entry')}</td><td>${rate}</td><td>${Number.isFinite(prize) && prize > 0 ? `<span class="pill" aria-label="Prize place ${esc(prize)}">Prize ${esc(prize)}</span>` : '—'}</td></tr>`;
  }).join('') || '<tr><td colspan="5">No entries yet.</td></tr>'}</tbody></table></div></article>`;
  window.__shotReady = true;
}
