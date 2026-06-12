<template>
  <!-- App.vue: punto de entrada — carga las vistas mediante router-view -->
  <router-view />
</template>

<script>
export default { name: 'App' }
</script>

<style>
/* ============================================================
   Estilos globales YS Books — Fusión Segundo Parcial + Portada
   Tipografía: Playfair Display + DM Sans
   Paleta: violeta/azul oscuro (#7c3aed → #2563eb)
============================================================ */

@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

:root {
  --bg-darkest: #0b0f1a;
  --bg-dark: #111827;
  --bg-card: #1a2235;
  --bg-elevated: #1e2d47;
  --border-color: rgba(99, 120, 180, 0.18);
  --violet: #7c3aed;
  --violet-lt: #9d6ef5;
  --blue: #2563eb;
  --accent: #f59e0b;
  --danger: #ef4444;
  --success: #10b981;
  --text-primary: #eef2ff;
  --text-secondary: #94a3b8;
  --text-muted: #4b5563;
  --grad-main: linear-gradient(135deg, #7c3aed 0%, #2563eb 100%);
  --grad-card: linear-gradient(160deg, #1e2d47 0%, #131d30 100%);
  --shadow-sm: 0 2px 12px rgba(0, 0, 0, 0.35);
  --shadow-md: 0 8px 32px rgba(0, 0, 0, 0.5);
  --shadow-glow: 0 0 24px rgba(124, 58, 237, 0.35);
  --r-sm: 8px;
  --r-md: 14px;
  --r-lg: 20px;
  --font-d: 'Playfair Display', Georgia, serif;
  --font-b: 'DM Sans', system-ui, sans-serif;
}

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html { scroll-behavior: smooth; }

body {
  background: var(--bg-darkest);
  color: var(--text-primary);
  font-family: var(--font-b);
  font-size: 14px;
  line-height: 1.6;
  min-height: 100vh;
  overflow-x: hidden;
}

a { text-decoration: none; color: inherit; }
button { cursor: pointer; font-family: inherit; }
input, textarea, select { font-family: inherit; }

/* Scrollbar */
::-webkit-scrollbar { width: 5px; height: 5px; }
::-webkit-scrollbar-track { background: var(--bg-dark); }
::-webkit-scrollbar-thumb { background: var(--violet); border-radius: 9px; }

/* Bootstrap overrides */
.btn-primary {
  background: var(--grad-main) !important;
  border: none !important;
  font-weight: 600;
  box-shadow: 0 4px 15px rgba(124,58,237,.4) !important;
}
.btn-primary:hover {
  opacity: .9;
  transform: translateY(-1px);
  box-shadow: var(--shadow-glow) !important;
}

.table-dark {
  --bs-table-bg: var(--bg-card) !important;
  --bs-table-border-color: var(--border-color) !important;
}

.modal-content {
  background: var(--bg-dark) !important;
  border: 1px solid var(--border-color) !important;
  color: var(--text-primary) !important;
}

.form-control,
.form-select {
  background: var(--bg-card) !important;
  border: 1px solid var(--border-color) !important;
  color: var(--text-primary) !important;
}

.form-control:focus,
.form-select:focus {
  box-shadow: 0 0 0 3px rgba(124,58,237,.3) !important;
  border-color: var(--violet) !important;
}

.form-control::placeholder { color: var(--text-muted) !important; }

.alert-danger {
  background: rgba(239,68,68,.15) !important;
  border-color: rgba(239,68,68,.3) !important;
  color: #f87171 !important;
}

/* Badges Bootstrap custom */
.ys-badge {
  background: rgba(124,58,237,.2);
  color: var(--violet-lt);
  border: 1px solid rgba(124,58,237,.3);
  font-size: 10px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 20px;
}

/* Input group addon */
.search-addon {
  background: var(--bg-card) !important;
  border: 1px solid var(--border-color) !important;
  color: var(--text-muted) !important;
}

/* Table rows hover */
.ys-table tbody tr:hover {
  background: rgba(124,58,237,.06) !important;
}

/* Botones de acción */
.btn-action {
  width: 30px;
  height: 30px;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--r-sm);
  font-size: 13px;
  border: 1px solid transparent;
  transition: all .2s;
}

.btn-action--info {
  background: rgba(37,99,235,.15);
  border-color: rgba(37,99,235,.3);
  color: #60a5fa;
}
.btn-action--info:hover { background: rgba(37,99,235,.3); color: #93c5fd; }

.btn-action--edit {
  background: rgba(245,158,11,.15);
  border-color: rgba(245,158,11,.3);
  color: var(--accent);
}
.btn-action--edit:hover { background: rgba(245,158,11,.3); }

.btn-action--delete {
  background: rgba(239,68,68,.15);
  border-color: rgba(239,68,68,.3);
  color: #f87171;
}
.btn-action--delete:hover { background: rgba(239,68,68,.3); }

/* fw helpers */
.fw-500 { font-weight: 500; }
.fw-600 { font-weight: 600; }

.text-violet { color: var(--violet-lt) !important; }
.text-accent { color: var(--accent) !important; }

.alert-empty {
  text-align: center;
  padding: 3rem 1.5rem;
  color: var(--text-muted);
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--r-md);
}

.mini-stat {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--r-md);
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.mini-stat__val { font-size: 1.4rem; font-weight: 800; }
.mini-stat__lbl { font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: .4px; }

.ys-table {
  background: var(--bg-card);
  border-color: var(--border-color) !important;
  font-size: 0.83rem;
}

.ys-table thead th {
  color: var(--text-secondary);
  font-weight: 600;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-color: var(--border-color) !important;
  padding: 12px 10px;
}

.ys-table tbody td {
  border-color: var(--border-color) !important;
  padding: 10px;
  vertical-align: middle;
}

.ys-table tbody tr:hover {
  background: rgba(124, 58, 237, 0.06) !important;
}

.product-thumb {
  width: 44px;
  height: 60px;
  object-fit: cover;
  border-radius: var(--r-sm);
  border: 1px solid var(--border-color);
}

.usuario-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  color: white;
  flex-shrink: 0;
  background: var(--grad-main);
}

.ys-badge {
  background: rgba(124, 58, 237, 0.2);
  color: var(--violet-lt);
  border: 1px solid rgba(124, 58, 237, 0.3);
  font-size: 0.68rem;
  font-weight: 600;
}

.ys-badge--admin {
  background: rgba(37,99,235,.2);
  color: #93c5fd;
  border-color: rgba(37,99,235,.3);
}

.ys-badge--cliente {
  background: rgba(124,58,237,.2);
  color: var(--violet-lt);
  border-color: rgba(124,58,237,.3);
}

.badge-activo,
.badge-inactivo {
  padding: 3px 9px;
  border-radius: 20px;
  font-size: 0.72rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
}

.badge-activo {
  background: rgba(16,185,129,.15);
  color: #34d399;
  border: 1px solid rgba(16,185,129,.3);
}

.badge-inactivo {
  background: rgba(239,68,68,.15);
  color: #f87171;
  border: 1px solid rgba(239,68,68,.3);
}

.btn-action {
  width: 30px;
  height: 30px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--r-sm);
  font-size: 0.8rem;
  transition: all 0.2s;
}

.btn-action--info {
  background: rgba(37, 99, 235, 0.15);
  color: #60a5fa;
  border: 1px solid rgba(37, 99, 235, 0.3);
}
.btn-action--info:hover {
  background: rgba(37, 99, 235, 0.35);
  color: white;
}

.btn-action--edit {
  background: rgba(245, 158, 11, 0.15);
  color: #fbbf24;
  border: 1px solid rgba(245, 158, 11, 0.3);
}
.btn-action--edit:hover {
  background: rgba(245, 158, 11, 0.35);
  color: white;
}

.btn-action--delete {
  background: rgba(239, 68, 68, 0.15);
  color: #f87171;
  border: 1px solid rgba(239, 68, 68, 0.3);
}
.btn-action--delete:hover {
  background: rgba(239, 68, 68, 0.35);
  color: white;
}

.search-addon {
  background: var(--bg-card) !important;
  border: 1px solid var(--border-color) !important;
  border-right: none !important;
  color: var(--text-secondary) !important;
}

.modal-box {
  background: var(--bg-dark);
  border: 1px solid var(--border-color);
  border-radius: var(--r-lg);
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: var(--shadow-md);
}

.modal-box--sm { max-width: 420px; }
.modal-box--detail { max-width: 560px; }

.modal-box__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--border-color);
  color: var(--text-primary);
}

.modal-box__body { padding: 1.25rem; }

.modal-box__footer {
  padding: 1rem 1.25rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: flex-end;
  gap: .5rem;
}

.form-label-ys {
  color: var(--text-secondary);
  font-size: .82rem;
  font-weight: 500;
  margin-bottom: 5px;
}

.btn-secondary {
  background: rgba(99,120,180,.15) !important;
  border: 1px solid var(--border-color) !important;
  color: var(--text-secondary) !important;
}

.detail-img {
  width: 110px;
  height: 160px;
  object-fit: cover;
  border-radius: var(--r-sm);
  border: 1px solid var(--border-color);
  flex-shrink: 0;
}

.detail-title {
  font-family: var(--font-d);
  color: var(--text-primary);
  font-size: 1.05rem;
  line-height: 1.3;
  margin-bottom: 6px;
}

.detail-price {
  color: var(--accent);
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 4px;
}

.page-title {
  font-family: var(--font-d);
  color: var(--text-primary);
  font-size: 1.5rem;
  margin-bottom: 4px;
}

.ys-alert { font-size: 0.88rem; }
</style>
