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
      <!-- Notificaciones -->
      <div class="icon-btn position-relative" @click.stop="togglePanel('notif')" title="Notificaciones">
        <i class="bi bi-bell fs-6"></i>
        <span v-if="notifCount > 0" class="hbadge">{{ notifCount }}</span>
        <!-- Panel notificaciones -->
        <div v-if="panelAbierto === 'notif'" class="dropdown-panel" @click.stop>
          <div class="panel-head">
            <span>Notificaciones <span v-if="notifCount>0" class="panel-count">{{ notifCount }}</span></span>
            <button class="panel-clear" @click="limpiarNotifs">Limpiar todo</button>
          </div>
          <div v-for="n in notificaciones" :key="n.id" class="panel-item" :class="{unread: !n.leida}" @click="marcarLeida(n)">
            <i :class="n.icon" class="me-2 flex-shrink-0"></i>
            <div class="flex-grow-1">
              <p class="panel-item-title">{{ n.titulo }}</p>
              <p class="panel-item-sub">{{ n.tiempo }}</p>
            </div>
            <button class="item-dismiss" @click.stop="descartarNotif(n.id)" title="Descartar"><i class="bi bi-x"></i></button>
          </div>
          <div v-if="notificaciones.length === 0" class="panel-empty"><i class="bi bi-bell-slash me-2"></i>Sin notificaciones</div>
        </div>
      </div>
      <!-- Correos -->
      <div class="icon-btn position-relative" @click.stop="togglePanel('mail')" title="Mensajes">
        <i class="bi bi-envelope fs-6"></i>
        <span v-if="mailCount > 0" class="hbadge">{{ mailCount }}</span>
        <!-- Panel mensajes -->
        <div v-if="panelAbierto === 'mail'" class="dropdown-panel" @click.stop>
          <div class="panel-head">
            <span>Mensajes <span v-if="mailCount>0" class="panel-count">{{ mailCount }}</span></span>
            <button class="panel-clear" @click="limpiarMails">Limpiar todo</button>
          </div>
          <div v-for="m in mensajes" :key="m.id" class="panel-item" :class="{unread: !m.leido}">
            <div class="mail-avatar" :style="{background: m.color}">{{ m.inicial }}</div>
            <div class="flex-grow-1" @click="marcarMailLeido(m)">
              <p class="panel-item-title">{{ m.de }}</p>
              <p class="panel-item-sub">{{ m.asunto }}</p>
            </div>
            <div class="d-flex gap-1">
              <a :href="'mailto:' + m.correo" class="mail-reply" title="Responder" @click.stop>
                <i class="bi bi-reply-fill"></i>
              </a>
              <button class="item-dismiss" @click.stop="descartarMail(m.id)" title="Eliminar"><i class="bi bi-x"></i></button>
            </div>
          </div>
          <div v-if="mensajes.length === 0" class="panel-empty"><i class="bi bi-envelope-slash me-2"></i>Sin mensajes</div>
        </div>
      </div>
      <button type="button" class="icon-btn icon-btn--button" @click="irPerfil" title="Abrir perfil">
        <i class="bi bi-gear fs-6"></i>
      </button>
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
  data() {
    return {
      busqueda: '',
      panelAbierto: null,
      notificaciones: [
        { id:1, icon:'bi bi-bag-check-fill text-success', titulo:'Nuevo pedido #1042', tiempo:'Hace 5 min', leida: false },
        { id:2, icon:'bi bi-person-plus-fill text-violet', titulo:'Nuevo cliente registrado', tiempo:'Hace 20 min', leida: false },
        { id:3, icon:'bi bi-exclamation-triangle-fill text-warning', titulo:'Stock bajo: Y no quedó ninguno', tiempo:'Hace 1 hora', leida: false },
      ],
      mensajes: [
        { id:1, de:'Laura Martínez', inicial:'L', correo:'laura@mail.com', asunto:'Consulta sobre pedido #1042', color:'rgba(124,58,237,.5)', leido: false },
        { id:2, de:'Carlos Pérez', inicial:'C', correo:'carlos@mail.com', asunto:'¿Tienen Sapiens en stock?', color:'rgba(16,185,129,.5)', leido: false },
        { id:3, de:'Ana Gómez', inicial:'A', correo:'ana@mail.com', asunto:'Pedido con error de envío', color:'rgba(245,158,11,.5)', leido: false },
      ]
    }
  },
  computed: {
    iniciales() { return this.nombreUsuario?.slice(0, 1).toUpperCase() || 'A' },
    notifCount() { return this.notificaciones.filter(n => !n.leida).length },
    mailCount() { return this.mensajes.filter(m => !m.leido).length }
  },
  mounted() {
    document.addEventListener('click', this.cerrarPaneles)
  },
  beforeUnmount() {
    document.removeEventListener('click', this.cerrarPaneles)
  },
  methods: {
    buscar() {
      if (this.busqueda.trim()) {
        this.$router.push({ path: '/dashboard/catalogo', query: { q: this.busqueda.trim() } })
        this.busqueda = ''
      }
    },
    togglePanel(panel) {
      this.panelAbierto = this.panelAbierto === panel ? null : panel
    },
    cerrarPaneles() {
      this.panelAbierto = null
    },
    limpiarNotifs() { this.notificaciones = [] },
    limpiarMails() { this.mensajes = [] },
    marcarLeida(n) { n.leida = true },
    descartarNotif(id) { this.notificaciones = this.notificaciones.filter(n => n.id !== id) },
    marcarMailLeido(m) { m.leido = true },
    descartarMail(id) { this.mensajes = this.mensajes.filter(m => m.id !== id) },
    irPerfil() { this.$router.push('/dashboard/perfil') }
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
.icon-btn--button { border: none; background: transparent; }
.icon-btn:hover { background: var(--bg-card); color: var(--text-primary); }
.hbadge { position: absolute; top: 2px; right: 2px; background: var(--accent); color: #000; width: 14px; height: 14px; border-radius: 50%; font-size: 8px; font-weight: 700; display: flex; align-items: center; justify-content: center; }
.user-profile { display: flex; align-items: center; gap: 8px; margin-left: 4px; cursor: pointer; }
.user-info { flex-direction: column; align-items: flex-end; }
.user-name { font-weight: 600; font-size: 13px; color: var(--text-primary); }
.user-role { font-size: 11px; color: var(--text-secondary); }
.user-avatar { width: 32px; height: 32px; border-radius: 50%; background: var(--grad-main); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px; color: white; box-shadow: var(--shadow-glow); }
.btn-logout { display: flex; align-items: center; font-size: 12px; font-weight: 600; color: var(--text-secondary); background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--r-sm); padding: 5px 11px; cursor: pointer; transition: all .2s; margin-left: 6px; }
.btn-logout:hover { border-color: var(--danger); color: var(--danger); }

/* Dropdown panels */
.dropdown-panel { position: absolute; top: calc(100% + 10px); right: -10px; width: 280px; background: var(--bg-dark); border: 1px solid var(--border-color); border-radius: var(--r-md); box-shadow: 0 8px 32px rgba(0,0,0,.5); z-index: 200; overflow: hidden; }
.panel-head { display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; border-bottom: 1px solid var(--border-color); font-size: 12px; font-weight: 700; color: var(--text-primary); }
.panel-clear { background: none; border: none; color: var(--violet-lt); font-size: 11px; font-weight: 600; cursor: pointer; }
.panel-clear:hover { color: var(--text-primary); }
.panel-count { background: rgba(124,58,237,.25); color: var(--violet-lt); padding: 1px 6px; border-radius: 10px; font-size: 10px; font-weight: 700; margin-left: 4px; }
.panel-item { display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-bottom: 1px solid rgba(255,255,255,.04); transition: background .15s; cursor: pointer; }
.panel-item:last-child { border-bottom: none; }
.panel-item:hover { background: rgba(124,58,237,.08); }
.panel-item.unread { border-left: 3px solid var(--violet-lt); background: rgba(124,58,237,.05); }
.panel-item-title { font-size: 12px; font-weight: 600; color: var(--text-primary); margin: 0 0 2px; }
.panel-item-sub { font-size: 11px; color: var(--text-muted); margin: 0; }
.panel-empty { padding: 20px; text-align: center; font-size: 12px; color: var(--text-muted); }
.item-dismiss { background: none; border: none; color: var(--text-muted); font-size: 13px; cursor: pointer; padding: 2px 4px; border-radius: 4px; line-height: 1; transition: all .15s; flex-shrink: 0; }
.item-dismiss:hover { background: rgba(239,68,68,.15); color: #fca5a5; }
.mail-avatar { width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px; color: white; flex-shrink: 0; }
.mail-reply { color: var(--violet-lt); font-size: 14px; text-decoration: none; opacity: .7; transition: opacity .2s; padding: 2px 4px; }
.mail-reply:hover { opacity: 1; }
</style>
