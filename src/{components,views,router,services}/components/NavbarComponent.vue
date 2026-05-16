<template>
  <!-- NavbarComponent: encabezado superior estilo YS Books Portada -->
  <header class="top-header">
    <!-- Logo -->
    <div class="d-flex align-items-center gap-2 me-3 flex-shrink-0">
      <svg viewBox="0 0 40 40" fill="none" width="32">
        <rect width="40" height="40" rx="10" fill="url(#navGrad)" />
        <path d="M10 28V14a2 2 0 012-2h6v18H12a2 2 0 01-2-2z" fill="white" opacity=".9" />
        <path d="M20 12h8a2 2 0 012 2v14a2 2 0 01-2 2h-8V12z" fill="white" opacity=".6" />
        <defs>
          <linearGradient id="navGrad" x1="0" y1="0" x2="40" y2="40">
            <stop stop-color="#7C3AED" /><stop offset="1" stop-color="#2563EB" />
          </linearGradient>
        </defs>
      </svg>
      <span class="ys-brand">YS <span class="ys-brand-hl">Books</span></span>
    </div>

    <!-- Navegación horizontal -->
    <nav class="header-nav d-none d-md-flex">
      <router-link to="/dashboard" exact class="hn-link" active-class="hn-link--active">Inicio</router-link>
      <router-link to="/dashboard/catalogo" class="hn-link" active-class="hn-link--active">Catálogo</router-link>
      <router-link to="/dashboard/ofertas" class="hn-link" active-class="hn-link--active">Ofertas</router-link>
      <router-link to="/dashboard/clientes" class="hn-link" active-class="hn-link--active">Contacto</router-link>
    </nav>

    <!-- Buscador -->
    <div class="header-search flex-grow-1 mx-3 d-none d-lg-flex">
      <i class="bi bi-search" style="color:var(--text-muted)"></i>
      <input v-model="busqueda" type="text" placeholder="Buscar libros, autores..." @keyup.enter="buscar" />
    </div>

    <!-- Zona derecha -->
    <div class="header-user ms-auto">
      <div class="icon-btn position-relative">
        <i class="bi bi-bell fs-6"></i>
        <span class="hbadge">3</span>
      </div>
      <div class="icon-btn position-relative">
        <i class="bi bi-envelope fs-6"></i>
        <span class="hbadge">1</span>
      </div>
      <div class="icon-btn">
        <i class="bi bi-gear fs-6"></i>
      </div>
      <div class="user-profile">
        <div class="user-info d-none d-md-flex">
          <span class="user-name">{{ nombreUsuario }}</span>
          <span class="user-role">Miembro</span>
        </div>
        <div class="user-avatar">{{ iniciales }}</div>
      </div>
      <button class="btn-logout" @click="$emit('logout')">
        <i class="bi bi-box-arrow-right"></i>
        <span class="d-none d-sm-inline ms-1">Salir</span>
      </button>
    </div>
  </header>
</template>

<script>
export default {
  name: 'NavbarComponent',
  props: { nombreUsuario: { type: String, default: 'Administrador YS Books' } },
  emits: ['logout'],
  data() { return { busqueda: '' } },
  computed: {
    iniciales() { return this.nombreUsuario?.slice(0, 1).toUpperCase() || 'A' }
  },
  methods: {
    buscar() {
      if (this.busqueda.trim()) {
        this.$router.push({ path: '/dashboard/catalogo', query: { q: this.busqueda.trim() } })
        this.busqueda = ''
      }
    }
  }
}
</script>

<style scoped>
.top-header {
  background: rgba(17,24,39,.92);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border-color);
  padding: 0 20px;
  height: 62px;
  display: flex;
  align-items: center;
  gap: 6px;
  position: sticky;
  top: 0;
  z-index: 100;
}
.ys-brand { font-family: var(--font-d); font-size: 1.15rem; font-weight: 700; color: var(--text-primary); }
.ys-brand-hl { color: var(--violet-lt); }
.header-nav { display: flex; gap: 2px; }
.hn-link { padding: 6px 11px; border-radius: var(--r-sm); font-size: 13px; font-weight: 500; color: var(--text-secondary); text-decoration: none; transition: all .2s; }
.hn-link:hover, .hn-link--active { color: var(--text-primary); background: rgba(124,58,237,.15); }
.hn-link--active { color: var(--violet-lt) !important; }
.header-search { max-width: 320px; display: flex; align-items: center; gap: 10px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 30px; padding: 8px 16px; transition: border-color .2s; }
.header-search:focus-within { border-color: var(--violet); box-shadow: 0 0 0 3px rgba(124,58,237,.15); }
.header-search input { background: none; border: none; outline: none; color: var(--text-primary); font-size: 13px; width: 100%; }
.header-search input::placeholder { color: var(--text-muted); }
.header-user { display: flex; align-items: center; gap: 4px; }
.icon-btn { width: 34px; height: 34px; border-radius: var(--r-sm); display: flex; align-items: center; justify-content: center; color: var(--text-secondary); cursor: pointer; transition: all .2s; }
.icon-btn:hover { background: var(--bg-card); color: var(--text-primary); }
.hbadge { position: absolute; top: 2px; right: 2px; background: var(--accent); color: #000; width: 14px; height: 14px; border-radius: 50%; font-size: 8px; font-weight: 700; display: flex; align-items: center; justify-content: center; }
.user-profile { display: flex; align-items: center; gap: 8px; margin-left: 4px; cursor: pointer; }
.user-info { flex-direction: column; align-items: flex-end; }
.user-name { font-weight: 600; font-size: 13px; color: var(--text-primary); }
.user-role { font-size: 11px; color: var(--text-secondary); }
.user-avatar { width: 32px; height: 32px; border-radius: 50%; background: var(--grad-main); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px; color: white; box-shadow: var(--shadow-glow); }
.btn-logout { display: flex; align-items: center; font-size: 12px; font-weight: 600; color: var(--text-secondary); background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--r-sm); padding: 5px 11px; cursor: pointer; transition: all .2s; margin-left: 6px; }
.btn-logout:hover { border-color: var(--danger); color: var(--danger); }
</style>
