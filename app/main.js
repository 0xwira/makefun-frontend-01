import { board } from './views-board.js';
const app = document.querySelector('#app');
const search = document.querySelector('#search');
let revision = 0;
async function route() {
  const current = ++revision;
  window.__shotReady = false;
  app.innerHTML = '<p class="notice" role="status">Loading fieldnotes…</p>';
  search.disabled = location.hash.split('?')[0] !== '#/' && location.hash !== '';
  const stage = document.createElement('div');
  try {
    const path = (location.hash.slice(1) || '/').split('?')[0];
    const parts = path.split('/').filter(Boolean).map(decodeURIComponent);
    if (!parts.length) await board(stage, search.value);
    else if (parts[0] === 'bounty' && parts.length === 2) {
      const { bounty } = await import('./views-bounty.js');
      await bounty(stage, parts[1]);
    } else if (parts[0] === 'bounty' && parts[2] === 'leaderboard' && parts.length === 3) {
      const { leaderboard } = await import('./views-leaderboard.js');
      await leaderboard(stage, parts[1]);
    } else if (parts[0] === 'profile' && parts.length === 2) {
      const { profile } = await import('./views-profile.js');
      await profile(stage, parts[1]);
    } else throw new Error('Page not found');
    if (current !== revision) return;
    app.replaceChildren(...stage.childNodes);
    document.querySelector('#live').textContent = '● Live data / make.fun';
  } catch (error) {
    if (current !== revision) return;
    app.innerHTML = '<div class="notice"><h1>Unable to load this view</h1><p></p><button>Retry</button> <a href="#/">Back to board</a></div>';
    app.querySelector('p').textContent = error.message;
    app.querySelector('button').onclick = route;
    document.querySelector('#live').textContent = 'Connection interrupted';
  }
  if (current === revision) window.__shotReady = true;
}
search.addEventListener('input', route);
window.addEventListener('hashchange', route);
route();
