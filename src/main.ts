const $ = (sel: string, root: Document | HTMLElement = document) => root.querySelector(sel) as HTMLElement;
const $$ = (sel: string, root: Document | HTMLElement = document) => Array.from(root.querySelectorAll(sel)) as HTMLElement[];

($('#year') as HTMLElement).textContent = String(new Date().getFullYear());

// Theme
const THEME_KEY = 'theme';
const getPreferred = (): 'light' | 'dark' => (localStorage.getItem(THEME_KEY) as 'light' | 'dark') || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
const applyTheme = (t: 'light' | 'dark') => {
  document.documentElement.classList.toggle('light', t === 'light');
};
applyTheme(getPreferred());
($('#theme-toggle') as HTMLButtonElement).addEventListener('click', () => {
  const next = document.documentElement.classList.contains('light') ? 'dark' : 'light';
  localStorage.setItem(THEME_KEY, next);
  applyTheme(next as 'light' | 'dark');
});

// Reveal animations
const io = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (e.isIntersecting) (e.target as HTMLElement).classList.add('in');
  }
}, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });
$$('.reveal').forEach(el => io.observe(el));

// Particles: falling snowflakes
(function particles() {
  const c = document.getElementById('bg') as HTMLCanvasElement;
  const ctx = c.getContext('2d')!;
  let dpr = Math.max(1, window.devicePixelRatio || 1);
  let w: number, h: number;
  const resize = () => {
    w = c.width = Math.floor(innerWidth * dpr);
    h = c.height = Math.floor(innerHeight * dpr);
  };
  resize();
  window.addEventListener('resize', resize);
  const N = 140;
  type Flake = { x: number; y: number; r: number; sp: number; sway: number; a: number };
  const flakes: Flake[] = new Array(N).fill(0).map((): Flake => ({
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
    // In light theme, use black translucent flakes for contrast; keep white in dark mode
    ctx.fillStyle = isLight ? 'rgba(0, 0, 0, .16)' : 'rgba(255, 255, 255, .12)';
    for (const f of flakes) {
      f.a += 0.01;
      f.y += f.sp;
      f.x += Math.cos(f.a) * f.sway * 0.2;
      if (f.y - f.r > h) { f.y = -10 * dpr; f.x = Math.random() * w; }
      if (f.x < -10 * dpr) f.x = w + 10 * dpr;
      if (f.x > w + 10 * dpr) f.x = -10 * dpr;
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(step);
  }
  step();
})();

// GitHub repos
async function loadRepos() {
  const container = document.getElementById('repos')!;
  const username = 'wakefulblock262';
  try {
    const resp = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);
    if (!resp.ok) throw new Error('Failed to fetch repos');
    const data: any[] = await resp.json();
    container.innerHTML = data.map((repo: any) => `
      <article class="card reveal">
        <a class="stretch" href="${repo.html_url}" target="_blank" rel="noopener" aria-label="Open ${repo.name}"></a>
        <span class="pill">${repo.language || 'Code'}</span>
        <h3>${repo.name}</h3>
        <p>${repo.description ? String(repo.description).replace(/</g, '&lt;') : 'No description.'}</p>
        <div class="meta">
          <span>★ ${repo.stargazers_count}</span>
          <span>⬇ ${repo.forks_count}</span>
          <span>⏱️ ${new Date(repo.updated_at).toLocaleDateString()}</span>
        </div>
      </article>
    `).join('');
    $$('.card.reveal', container as any).forEach(el => io.observe(el));
  } catch (e) {
    container.innerHTML = `<p class="muted">Couldn\'t load repositories right now. <a href="https://github.com/${username}" target="_blank" rel="noopener">View on GitHub</a>.</p>`;
  }
}
loadRepos();
