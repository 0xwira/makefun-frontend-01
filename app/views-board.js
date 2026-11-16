import { getBounties, getBounty } from './api.js';
import { esc, usd, int, timeLeft, isOpen, status, facts, rewards, paragraphs } from './format.js';
let items;
const details = new Map();
export async function board(root, query = '') {
  items ??= (await getBounties()).items;
  const needle = query.trim().toLowerCase();
  const filtered = items.filter(b => [b.title, b.slug, b.category].some(s => String(s ?? '').toLowerCase().includes(needle)));
  const selected = new URLSearchParams(location.hash.split('?')[1]).get('b');
  const active = filtered.find(b => b.slug === selected) ?? filtered[0];
  root.innerHTML = `<div class="intro"><div><p class="eyebrow">The builder’s field guide / 01</p><h1>Work worth building.</h1></div><p class="muted">${int(filtered.length)} bounties · Select a brief to explore</p></div><div class="workspace"><section class="list" aria-label="Bounties">${filtered.map(b => `<a class="row" href="#/?b=${encodeURIComponent(b.slug)}" aria-current="${b.slug === active?.slug}"><strong>${esc(b.title)}</strong><span class="summary">${esc(b.summary)}</span><span class="metrics"><b>${usd(b.potUsd ?? b.rewardAmount)}</b><span>${b.entryFeeUsd == null || Number(b.entryFeeUsd) === 0 ? 'Free' : usd(b.entryFeeUsd) + ' fee'}</span><span>${isOpen(b) ? timeLeft(b.deadline) : 'Closed'}</span><span>${int(b.submissionCount)} entries</span>${status(b)}</span></a>`).join('') || '<p class="notice">No matching bounties. Try another search.</p>'}</section><aside class="detail" aria-label="Selected bounty"></aside></div>`;
  const panel = root.querySelector('.detail');
  if (!active) { panel.textContent = 'Your next project starts here.'; return; }
  let b = details.get(active.slug);
  if (!b) { b = await getBounty(active.slug); details.set(active.slug, b); }
  const path = `#/bounty/${encodeURIComponent(b.slug)}`;
  panel.innerHTML = `<p class="eyebrow">Selected brief / ${esc(b.category ?? 'Build')}</p>${status(b)}<h2>${esc(b.title)}</h2><p>${esc(b.summary)}</p><div class="prose">${paragraphs(b.description)}</div>${facts(b)}${rewards(b)}<div class="actions"><a class="button" href="${path}">Read full bounty ↗</a><a class="button" href="${path}/leaderboard">Leaderboard</a></div>`;
}
