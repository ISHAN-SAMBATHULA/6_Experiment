/* ================================================
   common.js — shared API helpers & UI utilities
   ================================================ */

const API = '/api';

/* ---------- fetch wrappers ---------- */

async function api(endpoint, opts = {}) {
  const url = API + endpoint;
  const config = {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  };
  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }
  const res = await fetch(url, config);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

const apiGet    = (path) => api(path);
const apiPost   = (path, body) => api(path, { method: 'POST', body });
const apiPut    = (path, body) => api(path, { method: 'PUT', body });
const apiDelete = (path) => api(path, { method: 'DELETE' });

/* ---------- toast notifications ---------- */

function showToast(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

/* ---------- modal helpers ---------- */

function openModal(id) {
  document.getElementById(id).classList.add('open');
}

function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}

/* ---------- sidebar active link ---------- */

function initSidebar() {
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.sidebar__link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // burger toggle for mobile
  const burger = document.querySelector('.burger');
  const sidebar = document.querySelector('.sidebar');
  if (burger && sidebar) {
    burger.addEventListener('click', () => sidebar.classList.toggle('open'));
    // close sidebar when clicking a link on mobile
    sidebar.querySelectorAll('.sidebar__link').forEach(link => {
      link.addEventListener('click', () => sidebar.classList.remove('open'));
    });
  }
}

/* ---------- template: sidebar HTML (injected by every page) ---------- */

function renderSidebar() {
  return `
    <button class="burger" aria-label="Open menu">☰</button>
    <aside class="sidebar">
      <div class="sidebar__logo">
        <div class="sidebar__logo-icon">SMS</div>
        <span class="sidebar__logo-text">Student Management System</span>
      </div>
      <nav class="sidebar__nav">
        <a href="index.html" class="sidebar__link">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          Dashboard
        </a>
        <a href="register.html" class="sidebar__link">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
          Registration
        </a>
        <a href="marks.html" class="sidebar__link">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
          Marks &amp; Grades
        </a>
        <a href="reports.html" class="sidebar__link">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          Reports
        </a>
      </nav>
    </aside>
  `;
}

/* ---------- grade badge color ---------- */

function gradeBadgeClass(grade) {
  if (!grade) return 'badge--info';
  if (grade === 'A+' || grade === 'A') return 'badge--accent';
  if (grade === 'B+' || grade === 'B') return 'badge--primary';
  if (grade === 'C') return 'badge--warning';
  return 'badge--danger';
}

/* ---------- format date ---------- */

function fmtDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

/* ---------- on ready ---------- */

document.addEventListener('DOMContentLoaded', () => {
  // inject sidebar
  const sidebarSlot = document.getElementById('sidebar-slot');
  if (sidebarSlot) {
    sidebarSlot.innerHTML = renderSidebar();
    initSidebar();
  }
});
