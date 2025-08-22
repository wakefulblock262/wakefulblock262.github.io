// Utilities
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

// Current year
$('#year').textContent = String(new Date().getFullYear());

// Theme
const THEME_KEY = 'theme';
const getPreferred = () => localStorage.getItem(THEME_KEY) || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
const applyTheme = (t) => {
  document.documentElement.classList.toggle('light', t === 'light');
};
applyTheme(getPreferred());
$('#theme-toggle').addEventListener('click', () => {
  const next = document.documentElement.classList.contains('light') ? 'dark' : 'light';
  localStorage.setItem(THEME_KEY, next);
  applyTheme(next);
});

// Reveal animations
const io = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (e.isIntersecting) e.target.classList.add('in');
  }
}, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });
$$('.reveal').forEach(el => io.observe(el));

// Canvas background: falling snowflakes
(function particles() {
  const c = /** @type {HTMLCanvasElement} */(document.getElementById('bg'));
  const ctx = c.getContext('2d');
  let dpr = Math.max(1, window.devicePixelRatio || 1);
  let w, h;
  const resize = () => {
    w = c.width = Math.floor(innerWidth * dpr);
    h = c.height = Math.floor(innerHeight * dpr);
  };
  resize();
  window.addEventListener('resize', resize);
  const N = 140;
  const flakes = new Array(N).fill(0).map(() => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: (Math.random() * 1.4 + 0.6) * dpr,
    sp: (Math.random() * 0.35 + 0.15) * dpr,
    sway: (Math.random() * 0.6 + 0.2) * dpr,
    a: Math.random() * Math.PI * 2
  }));
  function step() {
    ctx.clearRect(0, 0, w, h);
    const isLight = document.documentElement.classList.contains('light');
    // In light theme, draw darker (black) snowflakes for contrast; keep white in dark mode
    ctx.fillStyle = isLight ? 'rgba(0, 0, 0, .16)' : 'rgba(255, 255, 255, .12)';
    for (const f of flakes) {
      // update
      f.a += 0.01;
      f.y += f.sp;
      f.x += Math.cos(f.a) * f.sway * 0.2;
      if (f.y - f.r > h) { f.y = -10 * dpr; f.x = Math.random() * w; }
      if (f.x < -10 * dpr) f.x = w + 10 * dpr;
      if (f.x > w + 10 * dpr) f.x = -10 * dpr;
      // draw
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(step);
  }
  step();
})();

// Fetch GitHub repos
async function loadRepos() {
  const container = document.getElementById('repos');
  const username = 'wakefulblock262';
  try {
    const resp = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);
    if (!resp.ok) throw new Error('Failed to fetch repos');
    const data = await resp.json();
    container.innerHTML = data.map(repo => `
      <article class="card reveal">
        <a class="stretch" href="${repo.html_url}" target="_blank" rel="noopener" aria-label="Open ${repo.name}"></a>
        <span class="pill">${repo.language || 'Code'}</span>
        <h3>${repo.name}</h3>
        <p>${repo.description ? repo.description.replace(/</g, '&lt;') : 'No description.'}</p>
        <div class="meta">
          <span>★ ${repo.stargazers_count}</span>
          <span>⬇ ${repo.forks_count}</span>
          <span>⏱️ ${new Date(repo.updated_at).toLocaleDateString()}</span>
        </div>
      </article>
    `).join('');
    // Observe newly added elements
    $$('.card.reveal', container).forEach(el => io.observe(el));
  } catch (e) {
    container.innerHTML = `<p class="muted">Couldn\'t load repositories right now. <a href="https://github.com/${username}" target="_blank" rel="noopener">View on GitHub</a>.</p>`;
  }
}
loadRepos();

// Copy source URL button (Package Manager Shortcuts)
const copyBtn = document.getElementById('copy-source');
const sourceUrl = /** @type {HTMLAnchorElement} */(document.getElementById('source-url'));
if (copyBtn && sourceUrl) {
  copyBtn.addEventListener('click', async () => {
    const txt = sourceUrl.href;
    try {
      await navigator.clipboard.writeText(txt);
      const prev = copyBtn.textContent;
      copyBtn.textContent = 'Copied!';
      setTimeout(() => { copyBtn.textContent = prev || 'Copy'; }, 1400);
    } catch (e) {
      // Fallback: prompt
      const ok = window.prompt('Copy this URL', txt);
      if (ok !== null) {
        const prev = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        setTimeout(() => { copyBtn.textContent = prev || 'Copy'; }, 1400);
      }
    }
  });
}
