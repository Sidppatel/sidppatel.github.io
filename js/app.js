/* ==========================================================================
 * Portfolio site - app.js
 * Loads data/resume.json and data/blog.json and renders each section.
 * Pure vanilla JS - no build step.
 * ========================================================================== */

const RESUME_PATH = 'data/resume.json';
const BLOG_PATH   = 'data/blog.json';

// --------------------------------------------------------- helpers
const $  = (sel, root = document) => root.querySelector(sel);
const escapeHtml = (s) => String(s).replace(/[&<>"']/g, c => (
  { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]
));

// --------------------------------------------------------- theme toggle
function initTheme() {
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (saved === 'dark' || (!saved && prefersDark)) {
    document.documentElement.classList.add('dark');
  }
  $('#theme-toggle')?.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    refreshThemeIcon();
  });
  refreshThemeIcon();
}
function refreshThemeIcon() {
  const isDark = document.documentElement.classList.contains('dark');
  $('.theme-icon-light')?.classList.toggle('hidden', isDark);
  $('.theme-icon-dark') ?.classList.toggle('hidden', !isDark);
}

// --------------------------------------------------------- footer year
function setFooterYear() {
  const el = $('#footer-year');
  if (el) el.textContent = new Date().getFullYear();
}

// =========================================================
// RESUME
// =========================================================
async function loadResume() {
  const target = $('#resume-render');
  target.innerHTML = '<p class="text-slate-400">Loading resume...</p>';
  try {
    const r = await fetch(RESUME_PATH, { cache: 'no-store' });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const data = await r.json();
    target.innerHTML = renderResume(data);
    // Fan projects out into the dedicated Projects section too
    renderProjectsSection(data.projects || []);
  } catch (err) {
    target.innerHTML = `<p class="text-red-500">Could not load resume (${escapeHtml(err.message)}).</p>`;
  }
}

function renderResume(d) {
  const pi = d.personal_info || {};
  return `
    <header class="pb-6 mb-6 border-b-2 border-navy dark:border-white">
      <h3 class="text-3xl font-extrabold text-navy dark:text-white tracking-tight">${escapeHtml(pi.name)}</h3>
      <p class="mt-1 text-lg font-bold text-accent">${escapeHtml(pi.title)} ${pi.subtitle ? '<span class="text-slate-400 font-normal">  |  </span>' + escapeHtml(pi.subtitle) : ''}</p>
      <p class="mt-2 text-sm text-slate-500">
        ${escapeHtml(pi.location)}  &middot;  ${escapeHtml(pi.phone)}  &middot;
        <a class="hover:underline" href="mailto:${escapeHtml(pi.email)}">${escapeHtml(pi.email)}</a>${pi.portfolio ? `  &middot;  <a class="hover:underline" target="_blank" rel="noopener" href="https://${escapeHtml(pi.portfolio)}">${escapeHtml(pi.portfolio)}</a>` : ''}
      </p>
    </header>

    ${renderSection('Professional Summary', `<p class="leading-relaxed text-slate-700 dark:text-slate-300">${escapeHtml(d.professional_summary)}</p>`)}

    ${renderSection('Core Competencies', renderCompetencies(d.core_competencies))}

    ${renderSection('Technical Proficiencies', renderTechSkills(d.technical_skills))}

    ${renderSection('Professional Experience', renderExperience(d.experience))}

    ${d.projects?.length ? renderSection('Key Projects', renderProjectsList(d.projects)) : ''}

    ${renderSection('Education', renderEducation(d.education))}

    ${renderSection('Certifications', renderCerts(d.certifications))}
  `;
}

function renderSection(title, body) {
  return `
    <section class="mb-7">
      <h4 class="text-sm font-bold tracking-widest text-navy dark:text-white border-b border-slate-200 dark:border-slate-700 pb-1 mb-3 uppercase">${escapeHtml(title)}</h4>
      ${body}
    </section>`;
}

function renderCompetencies(groups) {
  if (!groups?.length) return '';
  return `
    <div class="grid md:grid-cols-3 gap-4">
      ${groups.map(g => `
        <div class="rounded-md overflow-hidden border border-slate-200 dark:border-slate-700">
          <div class="bg-navy text-white px-3 py-2 text-xs font-bold tracking-wide">${escapeHtml(g.category)}</div>
          <ul class="bg-slate-50 dark:bg-slate-700/40 px-3 py-2 space-y-1 text-sm">
            ${g.items.map(it => `<li class="text-slate-700 dark:text-slate-200">&#9656;&nbsp; ${escapeHtml(it)}</li>`).join('')}
          </ul>
        </div>
      `).join('')}
    </div>`;
}

function renderTechSkills(skills) {
  if (!skills?.length) return '';
  return `<div class="space-y-1.5 text-sm">
    ${skills.map(s => `<p><span class="font-bold text-ink dark:text-white">${escapeHtml(s.category)}:</span> <span class="text-slate-700 dark:text-slate-300">${escapeHtml(s.details)}</span></p>`).join('')}
  </div>`;
}

function renderExperience(roles) {
  if (!roles?.length) return '';
  return roles.map(r => `
    <div class="mb-5 last:mb-0">
      <div class="flex flex-wrap items-baseline justify-between gap-2">
        <p class="font-semibold text-ink dark:text-white">${escapeHtml(r.company)}  <span class="text-slate-400">|</span>  ${escapeHtml(r.location)}</p>
        <p class="text-xs italic text-slate-500">${escapeHtml(r.dates)}</p>
      </div>
      <p class="italic font-semibold text-slate1 mt-0.5">${escapeHtml(r.title)}${r.subtitle ? '  -  ' + escapeHtml(r.subtitle) : ''}</p>
      <ul class="mt-2 space-y-1.5 text-sm text-slate-700 dark:text-slate-300 list-disc pl-5">
        ${r.responsibilities.map(b => `<li>${escapeHtml(b)}</li>`).join('')}
      </ul>
    </div>
  `).join('');
}

function renderProjectsList(projects) {
  return projects.map(p => `
    <div class="mb-4 last:mb-0">
      <p class="font-semibold text-navy dark:text-white">${escapeHtml(p.name)}  <span class="text-slate-400 font-normal">|  ${escapeHtml(p.company)}</span></p>
      <ul class="mt-1.5 space-y-1 text-sm text-slate-700 dark:text-slate-300 list-disc pl-5">
        ${p.details.map(d => `<li>${escapeHtml(d)}</li>`).join('')}
      </ul>
    </div>
  `).join('');
}

function renderEducation(edus) {
  if (!edus?.length) return '';
  return edus.map(e => `
    <div class="mb-3">
      <div class="flex flex-wrap items-baseline justify-between gap-2">
        <p class="font-semibold text-ink dark:text-white">${escapeHtml(e.school)}  <span class="text-slate-400">|</span>  ${escapeHtml(e.department)}</p>
        <p class="text-xs italic text-slate-500">${escapeHtml(e.dates)}</p>
      </div>
      ${e.details ? `<p class="text-sm text-slate-600 dark:text-slate-300">${escapeHtml(e.details)}</p>` : ''}
    </div>
  `).join('');
}

function renderCerts(certs) {
  if (!certs?.length) return '';
  return `<ul class="space-y-1 text-sm text-slate-700 dark:text-slate-300">
    ${certs.map(c => `<li>${escapeHtml(c)}</li>`).join('')}
  </ul>`;
}

// =========================================================
// PROJECTS SECTION  (rendered from the same resume.json projects array)
// =========================================================
function renderProjectsSection(projects) {
  const grid = $('#projects-grid');
  if (!grid) return;
  if (!projects.length) { grid.innerHTML = '<p class="text-slate-400">No projects yet.</p>'; return; }
  grid.innerHTML = projects.map(p => `
    <article class="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 p-6 hover:shadow-md transition">
      <h3 class="text-lg font-bold text-navy dark:text-white">${escapeHtml(p.name)}</h3>
      <p class="text-xs text-slate-500 mb-3">${escapeHtml(p.company)}</p>
      <ul class="space-y-1.5 text-sm text-slate-700 dark:text-slate-300 list-disc pl-5">
        ${p.details.map(d => `<li>${escapeHtml(d)}</li>`).join('')}
      </ul>
    </article>
  `).join('');
}

// =========================================================
// BLOG
// =========================================================
async function loadBlog() {
  const list = $('#blog-list');
  try {
    const r = await fetch(BLOG_PATH); if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const { posts = [] } = await r.json();
    if (!posts.length) { list.innerHTML = '<p class="text-slate-400">No posts yet.</p>'; return; }
    posts.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    list.innerHTML = posts.map(p => `
      <article class="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 p-6 hover:shadow-md transition">
        <div class="flex items-baseline justify-between gap-3">
          <h3 class="text-lg font-bold text-navy dark:text-white">${escapeHtml(p.title)}</h3>
          <time class="text-xs text-slate-500 whitespace-nowrap">${escapeHtml(formatDate(p.date))}</time>
        </div>
        <p class="mt-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">${escapeHtml(p.excerpt || '')}</p>
        <div class="mt-3 flex flex-wrap gap-1.5">
          ${(p.tags || []).map(t => `<span class="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">${escapeHtml(t)}</span>`).join('')}
        </div>
        <details class="mt-4">
          <summary class="cursor-pointer text-sm font-semibold text-accent hover:underline">Read more</summary>
          <div class="mt-3 text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">${escapeHtml(p.body || '')}</div>
        </details>
      </article>
    `).join('');
  } catch (err) {
    list.innerHTML = `<p class="text-red-500">Could not load blog (${escapeHtml(err.message)}).</p>`;
  }
}

function formatDate(iso) {
  if (!iso) return '';
  try {
    return new Date(iso + 'T00:00:00').toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  } catch { return iso; }
}

// =========================================================
// boot
// =========================================================
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  setFooterYear();
  loadResume();   // also fans projects into #projects-grid
  loadBlog();
});
