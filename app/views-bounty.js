import { getBounty } from './api.js';
import { esc, date, status, paragraphs, facts, rewards } from './format.js';
export async function bounty(root, slug) {
  const b = await getBounty(slug);
  const path = `#/bounty/${encodeURIComponent(slug)}`;
  const entrants = b.entrants ?? b.submissions ?? [];
  root.innerHTML = `<article class="page"><a href="#/">← All bounties</a><p class="eyebrow" style="margin-top:28px">${esc(b.category ?? 'Builder brief')} / ${esc(b.sponsor?.name ?? 'make.fun')}</p>${status(b)}<h1>${esc(b.title)}</h1><p>${esc(b.summary)}</p><p class="muted">Published ${date(b.publishedAt)} · Opens ${date(b.opensAt)}</p><div class="columns"><section><h2>The brief</h2><div class="prose">${paragraphs(b.description)}</div><h2>Rules of entry</h2><div class="prose">${paragraphs(b.rules || 'No additional rules published.')}</div>${entrants.length ? `<h2>Entrants</h2><ul>${entrants.map(entry => { const handle = entry.handle ?? entry.profile?.handle ?? entry.user?.handle; return handle ? `<li><a href="#/profile/${encodeURIComponent(handle)}">${esc(handle)}</a></li>` : ''; }).join('')}</ul>` : ''}</section><aside><h3>Bounty ledger</h3>${facts(b)}${rewards(b)}<div class="actions"><a class="button" href="${path}/leaderboard">View leaderboard ↗</a></div></aside></div></article>`;
}
