import {getBounties,getBounty,getLeaderboard} from './api.js';
import {esc,usd,timeLeft,isOpen,status,tile,avatar,rate} from './format.js';
let category='All',sort='ending';
const leaders=new Map();
export async function board(root,query=''){
 const items=(await getBounties()).items;
 const live=items.filter(isOpen);
 document.querySelector('#totals').textContent=`${live.length} live bounties · ${usd(live.reduce((n,b)=>n+Number(b.potUsd??b.rewardAmount??0),0))} in live pots`;
 const filtered=items.filter(b=>(category==='All'||b.category===category)&&[b.title,b.slug,b.category].some(v=>String(v??'').toLowerCase().includes(query.trim().toLowerCase()))).sort((a,b)=>Number(isOpen(b))-Number(isOpen(a))||(sort==='pot'?Number(b.potUsd??b.rewardAmount)-Number(a.potUsd??a.rewardAmount):sort==='entries'?b.submissionCount-a.submissionCount:isOpen(a)?new Date(a.deadline)-new Date(b.deadline):new Date(b.deadline)-new Date(a.deadline)));
 const selected=new URLSearchParams(location.hash.split('?')[1]).get('b');
 const active=filtered.find(b=>b.slug===selected)??filtered.find(isOpen)??filtered[0];
 root.innerHTML=`<div class="intro"><span class="eyebrow">FIND YOUR NEXT CHALLENGE</span><h1>Explore Bounties</h1><p class="muted">Discover and join exciting challenges from the community.</p></div><div class="filters">${['All',...new Set(items.map(b=>b.category).filter(Boolean))].map(c=>`<button class="chip ${c===category?'active':''}" data-cat="${esc(c)}">${esc(c)}</button>`).join('')}<select id="sort" aria-label="Sort bounties"><option value="ending">Ending soon</option><option value="pot">Biggest pot</option><option value="entries">Most entries</option></select></div><div class="workspace"><section class="list">${filtered.map(b=>`<a class="row" aria-current="${active===b}" href="#/?b=${encodeURIComponent(b.slug)}"><div class="thumb" ${tile(b)}>${esc(b.title[0])}</div><div class="card-copy"><strong>${esc(b.title)}</strong><span class="summary">${esc(b.summary)}</span><span class="cat">${esc(b.category)}</span></div><div class="stat"><small>Prize Pool</small><b>${usd(b.potUsd??b.rewardAmount)}</b></div><div class="stat"><small>Top Prizes</small><b>${Object.keys(b.rewards??{}).length}</b></div><div class="stat"><small>Ends</small><b>${timeLeft(b.deadline)}</b></div>${status(b)}</a>`).join('')||'<p>No matching bounties.</p>'}</section><aside class="detail"></aside></div>`;
 root.querySelectorAll('[data-cat]').forEach(el=>el.onclick=()=>{category=el.dataset.cat;board(root,query)});
 const select=root.querySelector('#sort');select.value=sort;select.onchange=()=>{sort=select.value;board(root,query)};
 if(!active)return;
 const b=await getBounty(active.slug),path=`#/bounty/${encodeURIComponent(b.slug)}`;
 const panel=root.querySelector('.detail');
 panel.innerHTML=`<div class="hero" ${tile(b)}>${esc(b.title[0])}<span class="cat">${esc(b.category)}</span></div><h2>${esc(b.title)}</h2><p class="muted">${esc(b.summary)}</p><dl>${[['Total Prize Pool',usd(b.potUsd??b.rewardAmount)],['Top Prizes',Object.keys(b.rewards??{}).length],['Time Left',timeLeft(b.deadline)]].map(([a,v])=>`<div><dt>${a}</dt><dd>${v}</dd></div>`).join('')}</dl><a class="button primary" href="${path}">View Bounty Details →</a><h3>Rules Summary</h3><ul class="rules">${String(b.description??'').split('\n').filter(s=>s.trim()).slice(0,4).map(s=>`<li>${esc(s.replace(/^[#*\-\s]+/,'').slice(0,130))}</li>`).join('')}</ul><div class="top-entrants"></div>`;
 try{if(!leaders.has(b.slug))leaders.set(b.slug,await getLeaderboard(b.slug));const entries=[...(leaders.get(b.slug).entries??[])].sort((a,b)=>a.rank-b.rank).slice(0,3);if(entries.length)panel.querySelector('.top-entrants').innerHTML=`<h3>Top Entrants (Live)</h3>${entries.map(e=>`<div class="entrant top"><b>${esc(e.rank)}</b>${avatar(e.image,e.handle||'?')}<a href="#/profile/${encodeURIComponent(e.handle)}">${esc(e.handle)}</a><small>${rate(e)}</small></div>`).join('')}<a class="see" href="${path}/leaderboard">See all →</a>`;}catch{}
}
