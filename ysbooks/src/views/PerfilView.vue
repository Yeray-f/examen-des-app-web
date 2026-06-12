<template>
  <div class="perfil-wrap">
    <div class="perfil-head">
      <div>
        <h2 class="page-title"><i class="bi bi-person-badge me-2"></i>Mi perfil</h2>
        <p class="text-secondary mb-0">Gestiona tu cuenta, deseos, pedidos y configuración desde un solo lugar.</p>
      </div>

      <div class="perfil-switcher">
        <button
          v-for="t in tabs"
          :key="t.key"
          class="perfil-tab"
          :class="{ 'perfil-tab--active': tab === t.key }"
          @click="tab = t.key"
        >
          {{ t.label }}
        </button>
      </div>
    </div>

    <div class="perfil-hero">
      <div class="perfil-avatar">{{ iniciales }}</div>
      <div class="perfil-meta">
        <p class="perfil-name">{{ nombreUsuario }}</p>
        <p class="perfil-sub">Usuario demo activo en YS Books</p>
      </div>
      <div class="perfil-stats">
        <div class="perfil-stat">
          <span class="perfil-stat__val">{{ librosFavoritos.length }}</span>
          <span class="perfil-stat__lbl">Favoritos</span>
        </div>
        <div class="perfil-stat">
          <span class="perfil-stat__val">{{ pedidosDemo.length }}</span>
          <span class="perfil-stat__lbl">Pedidos</span>
        </div>
        <div class="perfil-stat">
          <span class="perfil-stat__val">{{ librosLeidos }}</span>
          <span class="perfil-stat__lbl">Leídos</span>
        </div>
      </div>
    </div>

    <div class="perfil-grid">
      <section class="perfil-card">
        <h3 class="perfil-card__title">Resumen</h3>
        <div v-if="tab === 'perfil'" class="perfil-block">
          <p class="perfil-note">Aquí verías la información principal del usuario, sus datos de contacto y accesos rápidos.</p>
          <div class="perfil-mini-grid">
            <div class="perfil-mini">
              <span>Correo</span>
              <strong>{{ correoDemo }}</strong>
            </div>
            <div class="perfil-mini">
              <span>Tipo</span>
              <strong>Cuenta académica</strong>
            </div>
            <div class="perfil-mini">
              <span>Estado</span>
              <strong>Activa</strong>
            </div>
            <div class="perfil-mini">
              <span>Plan</span>
              <strong>Demo</strong>
            </div>
          </div>
        </div>

        <div v-else-if="tab === 'deseos'" class="perfil-block">
          <p class="perfil-note">Tu lista de deseos muestra libros guardados para más tarde.</p>
          <div class="perfil-list">
            <article v-for="libro in librosFavoritos" :key="libro.id" class="perfil-item">
              <img :src="libro.image" :alt="libro.name" @error="onImgError" />
              <div>
                <h4>{{ libro.name }}</h4>
                <p>{{ libro.author }}</p>
              </div>
              <strong>${{ formatPrecio(libro.price) }}</strong>
            </article>
          </div>
        </div>

        <div v-else-if="tab === 'pedidos'" class="perfil-block">
          <p class="perfil-note">Tus pedidos recientes aparecerían aquí con el estado de entrega.</p>
          <div class="perfil-orders">
            <article v-for="pedido in pedidosDemo" :key="pedido.id" class="pedido-card">
              <div>
                <h4>Pedido #{{ pedido.id }}</h4>
                <p>{{ pedido.fecha }} · {{ pedido.items }} libros</p>
              </div>
              <span class="pedido-status" :class="'pedido-status--' + pedido.estado">{{ pedido.estadoTexto }}</span>
            </article>
          </div>
        </div>

        <div v-else class="perfil-block">
          <p class="perfil-note">Ajustes rápidos para tu experiencia de lectura.</p>
          <div class="perfil-settings">
            <label class="setting-row">
              <span>Notificaciones por correo</span>
              <span class="setting-pill">Activadas</span>
            </label>
            <label class="setting-row">
              <span>Modo oscuro</span>
              <span class="setting-pill">Siempre activo</span>
            </label>
            <label class="setting-row">
              <span>Idioma</span>
              <span class="setting-pill">Español</span>
            </label>
          </div>
        </div>
      </section>

      <section class="perfil-card">
        <h3 class="perfil-card__title">Accesos rápidos</h3>
        <div class="quick-links">
          <router-link to="/dashboard/catalogo" class="quick-link"><i class="bi bi-grid-fill"></i> Ir al catálogo</router-link>
          <router-link to="/dashboard/ofertas" class="quick-link"><i class="bi bi-tags-fill"></i> Ver ofertas</router-link>
          <router-link to="/dashboard/autores" class="quick-link"><i class="bi bi-person-lines-fill"></i> Autores</router-link>
          <router-link to="/dashboard/productos" class="quick-link"><i class="bi bi-book-fill"></i> Gestión de libros</router-link>
        </div>

        <div class="perfil-tip">
          <i class="bi bi-info-circle-fill me-2"></i>
          Desde el pie de página puedes abrir tu perfil, pedidos, deseos y configuración.
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { obtenerNombreUsuario } from '../services/authService.js'
import { obtenerProductos } from '../services/productService.js'

export default {
  name: 'PerfilView',
  data() {
    return {
      tab: 'perfil',
      nombreUsuario: obtenerNombreUsuario(),
      productos: obtenerProductos(),
      correoDemo: 'usuario@ysbooks.com',
      tabs: [
        { key: 'perfil', label: 'Perfil' },
        { key: 'deseos', label: 'Lista de deseos' },
        { key: 'pedidos', label: 'Pedidos' },
        { key: 'configuracion', label: 'Configuración' }
      ],
      pedidosDemo: [
        { id: 1042, fecha: 'Hoy', items: 3, estado: 'entregado', estadoTexto: 'Entregado' },
        { id: 1031, fecha: 'Ayer', items: 2, estado: 'en_camino', estadoTexto: 'En camino' },
        { id: 1018, fecha: 'Hace 4 días', items: 1, estado: 'preparando', estadoTexto: 'Preparando' }
      ]
    }
  },
  computed: {
    iniciales() {
      return this.nombreUsuario?.trim()?.slice(0, 1).toUpperCase() || 'U'
    },
    librosFavoritos() {
      return this.productos.slice(0, 4)
    },
    librosLeidos() {
      return Math.max(12, Math.round(this.productos.length * 0.35))
    }
  },
  watch: {
    '$route.query.tab': {
      immediate: true,
      handler(value) {
        const allowed = ['perfil', 'deseos', 'pedidos', 'configuracion']
        this.tab = allowed.includes(value) ? value : 'perfil'
      }
    }
  },
  methods: {
    formatPrecio(price) { return Number(price).toLocaleString('es-CO') },
    onImgError(e) {
      if (e?.target) {
        e.target.onerror = null
        e.target.src = '/assets/covers/cover-fallback.svg'
      }
    }
  }
}
</script>

<style scoped>
.perfil-wrap { display: flex; flex-direction: column; gap: 18px; }
.page-title { font-family: var(--font-d); color: var(--text-primary); font-size: 1.5rem; margin-bottom: 4px; }
.perfil-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 14px; flex-wrap: wrap; }
.perfil-switcher { display: flex; flex-wrap: wrap; gap: 8px; }
.perfil-tab {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  border-radius: 999px;
  padding: 8px 14px;
  font-size: 12px;
  font-weight: 600;
}
.perfil-tab--active {
  background: rgba(124,58,237,.18);
  border-color: rgba(124,58,237,.4);
  color: var(--violet-lt);
}
.perfil-hero {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 16px;
  align-items: center;
  background: linear-gradient(160deg, #1e2d47 0%, #131d30 100%);
  border: 1px solid var(--border-color);
  border-radius: var(--r-lg);
  padding: 18px;
}
.perfil-avatar {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.7rem;
  font-weight: 800;
  color: white;
  background: var(--grad-main);
  box-shadow: var(--shadow-glow);
}
.perfil-name { font-size: 1.05rem; font-weight: 800; margin: 0; color: var(--text-primary); }
.perfil-sub { margin: 0; color: var(--text-secondary); font-size: 12px; }
.perfil-stats { display: flex; gap: 10px; flex-wrap: wrap; justify-content: flex-end; }
.perfil-stat {
  min-width: 92px;
  padding: 10px 12px;
  border-radius: 16px;
  background: rgba(255,255,255,.03);
  border: 1px solid var(--border-color);
}
.perfil-stat__val { display: block; font-size: 1rem; font-weight: 800; color: var(--text-primary); }
.perfil-stat__lbl { display: block; font-size: 10px; color: var(--text-secondary); text-transform: uppercase; letter-spacing: .4px; }
.perfil-grid { display: grid; grid-template-columns: 1.3fr .9fr; gap: 16px; }
.perfil-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--r-lg);
  padding: 18px;
}
.perfil-card__title { font-size: 13px; font-weight: 800; color: var(--text-primary); margin: 0 0 14px; }
.perfil-note { color: var(--text-secondary); font-size: 12px; margin-bottom: 14px; }
.perfil-mini-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
.perfil-mini {
  background: rgba(255,255,255,.03);
  border: 1px solid var(--border-color);
  border-radius: 14px;
  padding: 12px;
}
.perfil-mini span { display:block; font-size: 10px; color: var(--text-muted); text-transform: uppercase; letter-spacing: .4px; margin-bottom: 4px; }
.perfil-mini strong { color: var(--text-primary); font-size: 12px; }
.perfil-list, .perfil-orders, .perfil-settings { display: flex; flex-direction: column; gap: 10px; }
.perfil-item, .pedido-card, .setting-row {
  display: grid;
  grid-template-columns: 46px 1fr auto;
  gap: 10px;
  align-items: center;
  padding: 10px;
  border-radius: 14px;
  background: rgba(255,255,255,.03);
  border: 1px solid var(--border-color);
}
.perfil-item img {
  width: 46px;
  height: 60px;
  object-fit: cover;
  border-radius: 10px;
}
.perfil-item h4, .pedido-card h4 { margin: 0; font-size: 12px; color: var(--text-primary); }
.perfil-item p, .pedido-card p { margin: 2px 0 0; font-size: 11px; color: var(--text-secondary); }
.pedido-card { grid-template-columns: 1fr auto; }
.pedido-status {
  font-size: 10px;
  font-weight: 800;
  padding: 6px 10px;
  border-radius: 999px;
}
.pedido-status--entregado { background: rgba(16,185,129,.15); color: #6ee7b7; }
.pedido-status--en_camino { background: rgba(37,99,235,.15); color: #93c5fd; }
.pedido-status--preparando { background: rgba(245,158,11,.15); color: #fbbf24; }
.setting-row {
  grid-template-columns: 1fr auto;
  color: var(--text-secondary);
}
.setting-pill {
  background: rgba(124,58,237,.15);
  color: var(--violet-lt);
  padding: 5px 10px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 700;
}
.quick-links { display: flex; flex-direction: column; gap: 10px; }
.quick-link {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(255,255,255,.03);
  border: 1px solid var(--border-color);
  border-radius: 14px;
  padding: 12px 14px;
  color: var(--text-secondary);
  font-size: 12px;
  font-weight: 600;
}
.quick-link:hover { color: var(--violet-lt); border-color: rgba(124,58,237,.35); }
.perfil-tip {
  margin-top: 14px;
  padding: 12px 14px;
  border-radius: 14px;
  background: rgba(124,58,237,.1);
  color: var(--text-secondary);
  font-size: 12px;
  border: 1px solid rgba(124,58,237,.2);
}

@media (max-width: 992px) {
  .perfil-grid { grid-template-columns: 1fr; }
  .perfil-hero { grid-template-columns: 1fr; text-align: center; }
  .perfil-stats { justify-content: center; }
}
@media (max-width: 576px) {
  .perfil-mini-grid { grid-template-columns: 1fr; }
}
</style>
