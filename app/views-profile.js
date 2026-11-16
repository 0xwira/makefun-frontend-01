import { getProfile } from './api.js';
import { esc, int, usd, date, paragraphs, avatar } from './format.js';

function webURL(value) {
  if (!value || typeof value !== 'string') return '';
  try {
    const url = new URL(value, 'https://make.fun');
    return /^https?:$/.test(url.protocol) ? url.href : '';
  } catch { return ''; }
}
function recent(title, items) {
  if (!Array.isArray(items) || !items.length) return '';
  return `<h2>${title}</h2><ul class="activity">${items.map(item => {
    if (!item || typeof item !== 'object') return `<li>${esc(item)}</li>`;
    const competition = item.competition ?? item.bounty;
    const slug = competition?.slug ?? item.competition_slug ?? item.bounty_slug;
    const name = competition?.title ?? item.competition_title ?? item.bounty_title ?? slug ?? (typeof competition === 'string' ? competition : null);
    const label = item.title ?? item.solution?.title ?? item.description;
    const amount = item.prize_usd ?? item.amount_usd ?? item.usd;
    return `<li>${name ? (slug ? `<a href="#/bounty/${encodeURIComponent(slug)}">${esc(name)}</a>` : esc(name)) : esc(label ?? 'Activity')}${name && label && label !== name ? ` · ${esc(label)}` : ''}${amount != null && Number.isFinite(Number(amount)) ? ` · ${usd(amount)}` : ''}${item.rank != null ? ` · Place ${esc(item.rank)}` : ''}${item.created_at ? ` <span class="muted">${esc(date(item.created_at))}</span>` : ''}</li>`;
  }).join('')}</ul>`;
}
export async function profile(root, handle) {
  window.__shotReady = false;
  root.innerHTML = '<p class="notice" role="status">Loading profile…</p>';
  const p = await getProfile(handle);
  const image = webURL(p.avatar?.url ?? p.avatar?.url_small ?? p.image);
  const record = p.record ?? {};
  const stats = [['Entered', record.competitions_entered], ['Placed', record.competitions_placed], ['Won', record.competitions_won], ['Podiums', record.podium_finishes], ['Best placement', record.best_placement], ['Total prize', record.prize_usd]];
  const explorer = webURL(p.wallet?.explorer_url);
  root.innerHTML = `<article class="profile"><a href="#/">← All bounties</a><p class="eyebrow" style="margin-top:28px">Builder fieldnotes</p><div class="profile-heading"><span class="portrait">${avatar(image,p.handle||handle)}</span><div><h1>${esc(p.display_name || p.handle || handle)}</h1><p class="muted">@${esc(p.handle || handle)}</p></div></div>${p.bio ? `<div class="prose">${paragraphs(p.bio)}</div>` : ''}${p.joined_at ? `<p class="muted">Joined ${esc(date(p.joined_at))}</p>` : ''}<h2>Track record</h2><div class="facts">${stats.filter(([,v])=>v!=null).map(([label, value]) => `<div class="card"><small>${label}</small><b>${value == null || !Number.isFinite(Number(value)) ? '—' : label === 'Total prize' ? usd(value) : int(value)}</b></div>`).join('')}</div>${recent('Recent solutions', p.solutions)}${recent('Recent payouts', p.payouts)}${p.wallet?.address ? `<h2>Wallet</h2><p class="wallet">${explorer ? `<a href="${esc(explorer)}" target="_blank" rel="noopener noreferrer">${esc(p.wallet.address)} ↗</a>` : esc(p.wallet.address)}</p>` : ''}</article>`;
  window.__shotReady = true;
}
