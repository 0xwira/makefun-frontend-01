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
  return `${days ? `${days}d ${hours}h` : `${hours}h ${minutes % 60}m`}`;
}
export const isOpen = b => new Date(b.deadline) > Date.now();
export const status = b => `<span class="pill ${isOpen(b) ? 'open' : ''}">${isOpen(b) ? '● Live' : 'Closed'}</span>`;
export const paragraphs = text => String(text ?? '').split(/\n\s*\n/).map(p => `<p>${esc(p)}</p>`).join('');
export function facts(b) {
  return `<dl><dt>Live pot</dt><dd>${usd(b.potUsd ?? b.rewardAmount)}</dd><dt>Entry fee</dt><dd>${b.entryFeeUsd == null || Number(b.entryFeeUsd) === 0 ? 'Free' : usd(b.entryFeeUsd)}</dd><dt>Deadline</dt><dd>${date(b.deadline)}</dd><dt>Time remaining</dt><dd>${isOpen(b) ? timeLeft(b.deadline) : 'Closed'}</dd><dt>Entries</dt><dd>${int(b.submissionCount)}</dd></dl>`;
}
export function rewards(b) {
  const rows = Object.entries(b.rewards ?? {});
  return `<h3>Rewards</h3>${rows.length ? `<table><thead><tr><th>Place</th><th>USD</th></tr></thead><tbody>${rows.map(([place, amount]) => `<tr><td>${esc(place)}</td><td>${usd(amount)}</td></tr>`).join('')}</tbody></table>` : '<p class="muted">Reward allocation not published.</p>'}`;
}

export const gradient = b => ({Code:'#2438FF,#00B4FF',Games:'#7B2FFF,#FF2FB3',Forecasting:'#2438FF,#7B2FFF',Growth:'#00B37E,#00B4FF',Trading:'#FF8A00,#FF2F6D'}[b.category] || '#5A6B8C,#2438FF');
export const tile = b => `style="background:linear-gradient(135deg,${gradient(b)})"`;
const iconPaths={users:'<circle cx="9" cy="8" r="3"/><path d="M3 20v-1a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v1M15 5a3 3 0 0 1 0 6M17 15h1a3 3 0 0 1 3 3v1"/>',markdown:'<rect x="3" y="4" width="18" height="16" rx="3"/><path d="M6 16V8l3 4 3-4v8M16 9v6m0 0-2-2m2 2 2-2"/>',crosshair:'<circle cx="12" cy="12" r="6"/><path d="M12 2v4m0 12v4M2 12h4m12 0h4"/>',gamepad:'<path d="M6 8h12a4 4 0 0 1 4 4v2l-2 4h-3l-2-3H9l-2 3H4l-2-4v-2a4 4 0 0 1 4-4Z"/><path d="M7 11v4m-2-2h4m8-1h.01m3 2h.01"/>',sparkles:'<path d="m12 3 2 6 6 2-6 2-2 6-2-6-6-2 6-2 2-6Zm7 12 1 3 2 1-2 1-1 3-1-3-2-1 2-1 1-3Z"/>',trend:'<path d="M3 17 9 11l4 4 8-8M15 7h6v6"/>',layout:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M8 9v11"/>',code:'<path d="m8 8-4 4 4 4m8-8 4 4-4 4m-3-11-2 14"/>',coins:'<circle cx="9" cy="9" r="5"/><path d="M14 13a5 5 0 1 0 1-8M14 18a5 5 0 0 0 5-5"/>',megaphone:'<path d="m4 14 11-5v6L4 11v3a3 3 0 0 0 3 3h1l2 4M15 9l4-3v12l-4-3"/>',star:'<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-2.9-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3Z"/>'};
const iconRules=[[/human|people|referral|signup|sign-up|community/i,'users'],[/markdown|render/i,'markdown'],[/fps|shooter|three\.js|tactical/i,'crosshair'],[/game|play/i,'gamepad'],[/ai|judge|image|excited|art|picture|photo/i,'sparkles'],[/forecast|predict|market|price/i,'trend'],[/frontend|ui|interface|design|website/i,'layout'],[/code|dev|tool|api|bug/i,'code'],[/trad|coin|token|swap/i,'coins'],[/growth|viral|launch/i,'megaphone']];
export function bountyIcon(b){const key=iconRules.find(([r])=>r.test(b.title??''))?.[1]||({Forecasting:'trend',Games:'gamepad',Code:'code',Growth:'megaphone',Trading:'coins'}[b.category]||'star');return `<svg class="bounty-icon" viewBox="0 0 24 24" aria-hidden="true">${iconPaths[key]}</svg>`;}
export function avatar(path,handle='?') { let url=''; try { if(path) url=new URL(path,'https://make.fun').href; } catch {} return `<span class="avatar-wrap"><span class="avatar-fallback">${esc(handle[0]?.toUpperCase())}</span>${url?`<img class="avatar" src="${esc(url)}" crossorigin="anonymous" alt="" onerror="this.style.visibility='hidden'">`:''}</span>`; }
export const rate = e => e.values?.judge == null ? '—' : `${(Number(e.values.judge)/10000).toLocaleString('en-US',{maximumFractionDigits:2})}%`;
