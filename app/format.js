export const esc = value => String(value ?? '').replace(/[&<>"']/g, c => `&#${c.charCodeAt(0)};`);
export const int = n => Number(n ?? 0).toLocaleString('en-US');
export const usd = n => Number(n ?? 0).toLocaleString('en-US', {
  style: 'currency', currency: 'USD', minimumFractionDigits: Number.isInteger(Number(n)) ? 0 : 2,
});
export function date(iso) {
  const value = new Date(iso);
  return Number.isFinite(+value) ? value.toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'UTC',
  }) + ' UTC' : 'Unscheduled';
}
export function timeLeft(iso) {
  const minutes = Math.ceil((new Date(iso) - Date.now()) / 60000);
  if (!(minutes > 0)) return 'Closed';
  const days = Math.floor(minutes / 1440);
  const hours = Math.floor(minutes % 1440 / 60);
  return `Closes in ${days ? `${days}d ${hours}h` : `${hours}h ${minutes % 60}m`}`;
}
export const isOpen = b => new Date(b.deadline) > Date.now() && b.acceptingSubmissions !== false && b.status === 'open';
export const status = b => `<span class="pill ${isOpen(b) ? 'open' : ''}">${isOpen(b) ? 'Open' : 'Closed'}</span>`;
export const paragraphs = text => String(text ?? '').split(/\n\s*\n/).map(p => `<p>${esc(p)}</p>`).join('');
export function facts(b) {
  return `<dl><dt>Live pot</dt><dd>${usd(b.potUsd ?? b.rewardAmount)}</dd><dt>Entry fee</dt><dd>${b.entryFeeUsd == null || Number(b.entryFeeUsd) === 0 ? 'Free' : usd(b.entryFeeUsd)}</dd><dt>Deadline</dt><dd>${date(b.deadline)}</dd><dt>Time remaining</dt><dd>${isOpen(b) ? timeLeft(b.deadline) : 'Closed'}</dd><dt>Entries</dt><dd>${int(b.submissionCount)}</dd></dl>`;
}
export function rewards(b) {
  const rows = Object.entries(b.rewards ?? {});
  return `<h3>Rewards</h3>${rows.length ? `<table><thead><tr><th>Place</th><th>USD</th></tr></thead><tbody>${rows.map(([place, amount]) => `<tr><td>${esc(place)}</td><td>${usd(amount)}</td></tr>`).join('')}</tbody></table>` : '<p class="muted">Reward allocation not published.</p>'}`;
}
