export const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const money=x=>x==null||!Number.isFinite(Number(x))?'—':new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:2}).format(Number(x));
export const number=x=>x==null?'—':new Intl.NumberFormat('en-US').format(x);
export const open=b=>/^(open|live|active)$/i.test(b.status)&&(!b.deadline||new Date(b.deadline)>Date.now());
export function left(b){if(!open(b))return 'Closed';if(!b.deadline)return '—';const m=Math.max(0,Math.floor((new Date(b.deadline)-Date.now())/60000));return `${Math.floor(m/60)}h ${m%60}m`}
export const date=x=>x?new Date(x).toLocaleString('en-US',{timeZone:'UTC',dateStyle:'medium',timeStyle:'short'})+' UTC':'—';
export const rewards=b=>Array.isArray(b.rewards)?b.rewards:Object.entries(b.rewards||{}).map(([place,amount])=>typeof amount==='object'?{place,...amount}:{place,amount});
export const places=b=>b.topPrizes??b.top_prizes??rewards(b).length;
export const prize=r=>typeof r==='number'?r:r.feeShareAmount??r.fee_share_amount??r.amountWithFees??r.amount_with_fees??r.totalAmount??r.total_amount??r.amount;
export const pill=b=>`<span class="pill ${open(b)?'live':'closed'}">${open(b)?'● Live':'Closed'}</span>`;
export const category=b=>`<span class="pill category">${esc(b.category)}</span>`;
export const color=b=>['Growth','Code','Games','Forecasting','Trading'].includes(b.category)?b.category:'Other';
const paths={people:'<circle cx="19" cy="13" r="5"/><path d="M9 35v-3q0-9 10-9t10 9v3m0-27q10 0 7 9m-3 7q9 0 9 10"/>',markdown:'<rect x="6" y="8" width="36" height="30" rx="4"/><path d="M12 31V16l7 9 7-9v15m8-15v16m-4-5 4 5 4-5"/>',crosshair:'<circle cx="24" cy="24" r="12"/><path d="M24 3v13m0 16v13M3 24h13m16 0h13"/>',gamepad:'<path d="M16 16h16q9 0 11 18 0 9-8 3l-6-5H19l-6 5q-8 6-8-3 2-18 11-18Z M15 20v10m-5-5h10m11-2h1m5 5h1"/>',sparkle:'<path d="m24 5 5 14 14 5-14 5-5 14-5-14L5 24l14-5Z m13 29 2 5 5 2-5 2-2 5-2-5-5-2 5-2Z"/>',chart:'<path d="M7 6v35h35M12 32l10-11 8 5 12-16m-11 0h11v11"/>',layout:'<rect x="6" y="6" width="36" height="36" rx="4"/><path d="M6 17h36M16 17v25"/>',code:'<path d="m16 13-11 11 11 11m16-22 11 11-11 11M28 7l-8 34"/>',coins:'<ellipse cx="20" cy="13" rx="14" ry="6"/><path d="M6 13v15q14 12 28 0V13M6 21q14 12 28 0m1-3q12 1 8 10v10q-12 9-24 1"/>',megaphone:'<path d="M6 20v10h10l25 10V10L16 20Zm10 10 5 13h7l-5-10M16 20v10"/>'};
export function icon(b){const t=(b.title||'').toLowerCase();const tests=[[/people|human|referral|signup|community/,'people'],[/markdown|render/,'markdown'],[/fps|shooter|tactical/,'crosshair'],[/game|play/,'gamepad'],[/\bai\b|judge|image|excited|art|picture|photo/,'sparkle'],[/forecast|predict|market|price/,'chart'],[/frontend|\bui\b|interface|design|website/,'layout'],[/code|dev|tool|api|bug/,'code'],[/trading|coin|token|swap/,'coins'],[/growth|viral|launch/,'megaphone']];const k=tests.find(([re])=>re.test(t))?.[1]||({Forecasting:'chart',Games:'gamepad',Code:'code',Growth:'megaphone',Trading:'coins'}[b.category])||'sparkle';return `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[k]}</svg>`}
export const musang='<svg viewBox="0 0 40 40" aria-hidden="true"><path fill="white" d="m8 5 8 5h8l8-5-1 21-11 11L9 26Z"/><path fill="#3035ff" d="m9 15 11 3 11-3-2 9-9 6-9-6Z"/><path fill="white" d="m16 25 4 8 4-8Z"/></svg>';
export const stat=(label,value)=>`<div class="stat"><small>${label}</small><strong>${value}</strong></div>`;
export const route=b=>'#/bounty/'+encodeURIComponent(b.slug);
export const handle=e=>e.handle||e.user?.handle||e.username||e.user?.username||'Unknown';
export const error=e=>`<div class="notice"><h2>Live data unavailable</h2><p>${esc(e.message)}</p><button onclick="location.reload()">Try again</button></div>`;

export const plain=x=>String(x??'').replace(/```[^\n]*\n?([\s\S]*?)```/g,'$1').replace(/!\[([^\]]*)\]\([^)]*\)/g,'$1').replace(/\[([^\]]+)\]\([^)]*\)/g,'$1').replace(/^\s{0,3}(?:#{1,6}\s+|>\s?|[-*+]\s+|\d+[.)]\s+)/gm,'').replace(/[*_`~]/g,'').trim();
export const paragraphs=x=>plain(x).split(/\n\s*\n/).filter(Boolean).map(p=>`<p>${esc(p.replace(/\n/g,' '))}</p>`).join('');
