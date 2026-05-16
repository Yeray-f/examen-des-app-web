<template>
  <div class="dashboard-wrapper">
    <NavbarComponent :nombreUsuario="nombreUsuario" @logout="cerrarSesion" />
    <div class="dashboard-body">
      <SidebarComponent />
      <main class="dashboard-main">
        <router-view />
        <FooterComponent />
      </main>
      <aside class="right-panel d-none d-xl-flex">
        <div>
          <div class="panel-header">
            <h3>Libros populares</h3>
            <router-link to="/dashboard/catalogo" class="ver-todos-btn">Ver todos</router-link>
          </div>
          <div class="popular-grid">
            <div v-for="libro in libroPopulares" :key="libro.id" class="pop-card" @click="abrirLibro(libro)">
              <div class="pop-cover">
                <img v-if="libro.image" :src="libro.image" :alt="libro.name" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;" />
                <div v-else class="cover-fallback-sm">📚</div>
              </div>
              <p class="pop-title">{{ libro.name }}</p>
              <p class="pop-rating"><span>★</span> {{ libro.rating }}</p>
            </div>
          </div>
        </div>
        <div>
          <div class="panel-header">
            <h3>Autores destacados</h3>
            <router-link to="/dashboard/autores" class="ver-todos-btn">Ver todos</router-link>
          </div>
          <div class="authors-compact">
            <div v-for="autor in autoresDestacados" :key="autor.nombre" class="author-mini">
              <div class="author-mini-avatar">
                <img v-if="autor.img" :src="autor.img" :alt="autor.nombre" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" />
                <span v-else>{{ autor.emoji }}</span>
              </div>
              <span class="author-mini-name">{{ autor.nombre }}</span>
              <span class="author-mini-books">{{ autor.libros }} lib.</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
    <!-- Cart Drawer global -->
    <CartDrawer />
  </div>
</template>

<script>
import NavbarComponent from '../components/NavbarComponent.vue'
import SidebarComponent from '../components/SidebarComponent.vue'
import FooterComponent from '../components/FooterComponent.vue'
import CartDrawer from '../components/CartDrawer.vue'
import { cerrarSesion as logoutSvc, obtenerNombreUsuario } from '../services/authService.js'
import { obtenerProductos } from '../services/productService.js'

export default {
  name: 'DashboardView',
  components: { NavbarComponent, SidebarComponent, FooterComponent, CartDrawer },
  data() {
    return {
      nombreUsuario: obtenerNombreUsuario(),
      autoresDestacados: [
        { nombre: 'Austin', emoji: '👨‍🎨', libros: 5, img: 'https://i.pravatar.cc/80?img=11' },
        { nombre: 'Mark', emoji: '🧠', libros: 5, img: 'https://i.pravatar.cc/80?img=15' },
        { nombre: 'Agatha', emoji: '🔍', libros: 5, img: 'https://i.pravatar.cc/80?img=21' },
        { nombre: 'Joseph', emoji: '🌿', libros: 3, img: 'https://i.pravatar.cc/80?img=33' },
        { nombre: 'Paulo', emoji: '✨', libros: 5, img: 'https://i.pravatar.cc/80?img=45' },
        { nombre: 'Yuval', emoji: '🌍', libros: 4, img: 'https://i.pravatar.cc/80?img=52' }
      ]
    }
  },
  computed: {
    libroPopulares() {
      const productos = obtenerProductos()
      const ratings = ['4.4','4.4','4.4','4.4','4.4','4.4','4.4','4.4']
      return productos.slice(0, 8).map((p, i) => ({ ...p, rating: ratings[i] || '4.4' }))
    }
  },
  methods: {
    cerrarSesion() {
      logoutSvc()
      this.$router.push('/login')
    },
    abrirLibro(libro) {
      this.$router.push('/dashboard/catalogo')
    }
  }
}
</script>

<style scoped>
.dashboard-wrapper { display: flex; flex-direction: column; min-height: 100vh; background: var(--bg-darkest); }
.dashboard-body { display: flex; flex: 1; overflow: hidden; }
.dashboard-main { flex: 1; overflow-y: auto; padding: 24px; background: var(--bg-darkest); min-height: 0; display: flex; flex-direction: column; }
.right-panel { width: 268px; flex-shrink: 0; background: var(--bg-dark); border-left: 1px solid var(--border-color); overflow-y: auto; padding: 20px 14px; flex-direction: column; gap: 24px; }
.panel-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
.panel-header h3 { font-size: 13px; font-weight: 700; color: var(--text-primary); }
.ver-todos-btn { font-size: 11px; color: var(--violet-lt); font-weight: 600; cursor: pointer; background: rgba(124,58,237,.1); border: 1px solid rgba(124,58,237,.2); padding: 3px 10px; border-radius: 20px; text-decoration: none; transition: all .2s; }
.ver-todos-btn:hover { background: rgba(124,58,237,.2); }
.popular-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.pop-card { cursor: pointer; transition: transform .2s; }
.pop-card:hover { transform: translateY(-2px); }
.pop-cover { height: 85px; border-radius: var(--r-sm); background: var(--bg-card); border: 1px solid var(--border-color); overflow: hidden; position: relative; }
.cover-fallback-sm { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 28px; }
.pop-title { font-size: 9px; font-weight: 600; margin-top: 5px; color: var(--text-secondary); text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.pop-rating { font-size: 9px; color: var(--text-muted); text-align: center; }
.pop-rating span { color: var(--accent); }
.authors-compact { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.author-mini { display: flex; flex-direction: column; align-items: center; gap: 4px; }
.author-mini-avatar { width: 44px; height: 44px; border-radius: 50%; background: var(--bg-elevated); border: 2px solid var(--border-color); display: flex; align-items: center; justify-content: center; font-size: 18px; transition: border-color .2s; cursor: pointer; overflow: hidden; }
.author-mini:hover .author-mini-avatar { border-color: var(--violet); }
.author-mini-name { font-size: 10px; font-weight: 600; text-align: center; color: var(--text-primary); }
.author-mini-books { font-size: 9px; color: var(--violet-lt); font-weight: 600; }
@media (max-width: 1400px) { .right-panel { display: none !important; } }
</style>
