<template>
  <div>
    <!-- Encabezado -->
    <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
      <div>
        <h2 class="page-title">
          <i class="bi bi-person-lines-fill me-2"></i>Autores
        </h2>
        <p class="text-secondary mb-0">Autores disponibles en el catálogo de YS Books.</p>
      </div>
      <div class="d-flex align-items-center gap-2">
        <div class="input-group input-group-sm" style="width:220px;">
          <span class="input-group-text search-addon"><i class="bi bi-search"></i></span>
          <input v-model="busqueda" type="text" class="form-control" placeholder="Buscar autor..." />
        </div>
      </div>
    </div>

    <!-- Stats rápidas -->
    <div class="row g-3 mb-4">
      <div class="col-6 col-sm-3">
        <div class="mini-stat">
          <span class="mini-stat__val text-violet">{{ autores.length }}</span>
          <span class="mini-stat__lbl">Autores</span>
        </div>
      </div>
      <div class="col-6 col-sm-3">
        <div class="mini-stat">
          <span class="mini-stat__val text-accent">{{ totalLibros }}</span>
          <span class="mini-stat__lbl">Libros totales</span>
        </div>
      </div>
      <div class="col-6 col-sm-3">
        <div class="mini-stat">
          <span class="mini-stat__val" style="color:#60a5fa;">{{ categorias }}</span>
          <span class="mini-stat__lbl">Categorías</span>
        </div>
      </div>
      <div class="col-6 col-sm-3">
        <div class="mini-stat">
          <span class="mini-stat__val text-success">{{ promLibros }}</span>
          <span class="mini-stat__lbl">Lib. por autor</span>
        </div>
      </div>
    </div>

    <!-- Grid de autores -->
    <div v-if="autoresFiltrados.length === 0" class="alert-empty">
      <i class="bi bi-person-x fs-1 mb-2 d-block"></i>
      <p class="mb-0">No se encontró ningún autor.</p>
    </div>

    <div v-else class="autores-grid">
      <div
        v-for="autor in autoresFiltrados"
        :key="autor.nombre"
        class="autor-card"
        @click="seleccionarAutor(autor)"
      >
        <!-- Portadas de libros como fondo -->
        <div class="autor-covers">
          <img
            v-for="(libro, idx) in autor.libros.slice(0,3)"
            :key="libro.id"
            :src="libro.image"
            :alt="libro.name"
            class="cover-strip"
            :style="{ zIndex: idx + 1, left: (idx * 34) + 'px' }"
          />
        </div>
        <!-- Info del autor -->
        <div class="autor-info">
          <div class="autor-avatar-wrap">
            <img :src="autor.foto" :alt="autor.nombre" class="autor-avatar" />
          </div>
          <h3 class="autor-nombre">{{ autor.nombre }}</h3>
          <p class="autor-cat">{{ autor.categorias.join(' · ') }}</p>
          <div class="autor-stats-row">
            <span class="autor-stat">
              <i class="bi bi-book-fill me-1"></i>{{ autor.libros.length }} libro{{ autor.libros.length !== 1 ? 's' : '' }}
            </span>
            <span class="autor-stat">
              <i class="bi bi-star-fill me-1" style="color:var(--accent)"></i>{{ autor.rating }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal detalle del autor -->
    <div v-if="autorSeleccionado" class="modal-overlay-ys" @click.self="cerrarModal">
      <div class="modal-autor">
        <button class="modal-x-btn" @click="cerrarModal"><i class="bi bi-x"></i></button>

        <!-- Header del modal -->
        <div class="modal-autor-header">
          <img :src="autorSeleccionado.foto" :alt="autorSeleccionado.nombre" class="modal-autor-avatar" />
          <div class="modal-autor-meta">
            <h3 class="modal-autor-nombre">{{ autorSeleccionado.nombre }}</h3>
            <p class="modal-autor-cats">{{ autorSeleccionado.categorias.join(' · ') }}</p>
            <div class="d-flex gap-2 flex-wrap mt-2">
              <span class="chip-stat"><i class="bi bi-book-fill me-1"></i>{{ autorSeleccionado.libros.length }} libros</span>
              <span class="chip-stat"><i class="bi bi-star-fill me-1" style="color:var(--accent)"></i>{{ autorSeleccionado.rating }} promedio</span>
            </div>
          </div>
        </div>

        <!-- Bio -->
        <p class="modal-autor-bio">{{ autorSeleccionado.bio }}</p>

        <!-- Libros del autor -->
        <h4 class="modal-section-title"><i class="bi bi-collection-fill me-2"></i>Libros en catálogo</h4>
        <div class="modal-libros-grid">
          <div v-for="libro in autorSeleccionado.libros" :key="libro.id" class="modal-libro-card">
            <div class="modal-libro-cover">
              <img :src="libro.image" :alt="libro.name" />
            </div>
            <div class="modal-libro-info">
              <p class="modal-libro-title">{{ libro.name }}</p>
              <p class="modal-libro-price">${{ formatPrecio(libro.price) }}</p>
              <span class="modal-libro-cat">{{ libro.category }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { obtenerProductos } from '../services/productService.js'

// Fotos de autores con i.pravatar.cc usando seeds fijos
const AUTOR_META = {
  'Austin Kleon':       { foto: 'https://i.pravatar.cc/150?img=11', bio: 'Austin Kleon es un escritor y artista que vive en Austin, Texas. Es el autor de la trilogía sobre creatividad: Roba como un artista, Muestra tu trabajo y Keep Going.' },
  'Mark Manson':        { foto: 'https://i.pravatar.cc/150?img=15', bio: 'Mark Manson es bloguero, emprendedor y autor de superventas del New York Times. Es conocido por su enfoque pragmático y sin filtros sobre la autoayuda y la psicología.' },
  'Agatha Christie':    { foto: 'https://i.pravatar.cc/150?img=21', bio: 'Agatha Christie, la "Reina del crimen", fue una novelista inglesa conocida por sus 66 novelas policiales. Creadora de los célebres personajes Hércules Poirot y Miss Marple.' },
  'Paulo Coelho':       { foto: 'https://i.pravatar.cc/150?img=45', bio: 'Paulo Coelho es un novelista brasileño y uno de los autores más vendidos del mundo. Su obra más célebre, El Alquimista, ha vendido más de 150 millones de ejemplares.' },
  'Yuval Noah Harari':  { foto: 'https://i.pravatar.cc/150?img=52', bio: 'Yuval Noah Harari es un historiador y escritor israelí. Sus obras Sapiens, Homo Deus y 21 lecciones para el siglo XXI lo han convertido en uno de los pensadores más influyentes.' },
  'Arthur Conan Doyle': { foto: 'https://i.pravatar.cc/150?img=33', bio: 'Sir Arthur Conan Doyle fue un escritor y médico escocés, creador del icónico detective Sherlock Holmes. Sus obras de misterio y aventura son clásicos de la literatura universal.' },
  'Joseph Murphy':      { foto: 'https://i.pravatar.cc/150?img=57', bio: 'Joseph Murphy fue un autor de autoayuda irlando-americano y ministro religioso. Es conocido principalmente por su influyente libro sobre el poder de la mente subconsciente.' },
  'Phil Knight':        { foto: 'https://i.pravatar.cc/150?img=67', bio: 'Phil Knight es cofundador y presidente emérito de Nike, Inc. En su autobiografía "Nunca te pares" narra la historia del surgimiento de una de las marcas más icónicas del mundo.' },
}

export default {
  name: 'AutoresView',
  data() {
    return {
      busqueda: '',
      autorSeleccionado: null,
      productos: []
    }
  },
  computed: {
    autores() {
      // Agrupar productos por autor
      const mapa = {}
      this.productos.forEach(p => {
        if (!mapa[p.author]) {
          const meta = AUTOR_META[p.author] || {
            foto: `https://i.pravatar.cc/150?u=${encodeURIComponent(p.author)}`,
            bio: `Autor reconocido en la categoría de ${p.category}. Sus obras forman parte del catálogo selecto de YS Books.`
          }
          mapa[p.author] = {
            nombre: p.author,
            foto: meta.foto,
            bio: meta.bio,
            libros: [],
            categorias: [],
          }
        }
        mapa[p.author].libros.push(p)
        if (!mapa[p.author].categorias.includes(p.category)) {
          mapa[p.author].categorias.push(p.category)
        }
      })
      // Calcular rating promedio de cada autor
      return Object.values(mapa).map(a => ({
        ...a,
        rating: (3.8 + (a.libros.length * 0.08)).toFixed(1)
      })).sort((a, b) => b.libros.length - a.libros.length)
    },
    autoresFiltrados() {
      if (!this.busqueda.trim()) return this.autores
      const q = this.busqueda.toLowerCase()
      return this.autores.filter(a =>
        a.nombre.toLowerCase().includes(q) ||
        a.categorias.some(c => c.toLowerCase().includes(q))
      )
    },
    totalLibros() { return this.productos.length },
    categorias() { return new Set(this.productos.map(p => p.category)).size },
    promLibros() {
      if (!this.autores.length) return 0
      return (this.totalLibros / this.autores.length).toFixed(1)
    }
  },
  created() {
    this.productos = obtenerProductos()
  },
  methods: {
    seleccionarAutor(autor) { this.autorSeleccionado = autor },
    cerrarModal() { this.autorSeleccionado = null },
    formatPrecio(p) { return Number(p).toLocaleString('es-CO') }
  }
}
</script>

<style scoped>
.page-title { font-family:var(--font-d); color:var(--text-primary); font-size:1.5rem; margin-bottom:4px; }

/* Stats */
.mini-stat { background:var(--bg-card); border:1px solid var(--border-color); border-radius:var(--r-md); padding:12px 16px; display:flex; flex-direction:column; gap:2px; }
.mini-stat__val { font-size:1.4rem; font-weight:800; }
.mini-stat__lbl { font-size:0.7rem; color:var(--text-muted); text-transform:uppercase; letter-spacing:.4px; }
.text-violet { color:var(--violet-lt) !important; }
.text-accent { color:var(--accent) !important; }

/* Search */
.search-addon { background:var(--bg-card); border-color:var(--border-color); color:var(--text-secondary); }

/* Empty */
.alert-empty { text-align:center; padding:60px 20px; color:var(--text-muted); background:var(--bg-card); border:1px solid var(--border-color); border-radius:var(--r-md); }

/* Grid autores */
.autores-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(200px, 1fr)); gap:16px; }

.autor-card {
  background:var(--bg-card);
  border:1px solid var(--border-color);
  border-radius:var(--r-md);
  overflow:hidden;
  cursor:pointer;
  transition:all .25s;
  position:relative;
}
.autor-card:hover { transform:translateY(-4px); box-shadow:0 8px 24px rgba(124,58,237,.2); border-color:rgba(124,58,237,.4); }

/* Portadas superpuestas arriba */
.autor-covers {
  height:80px;
  background:var(--bg-elevated);
  position:relative;
  overflow:hidden;
}
.cover-strip {
  position:absolute;
  top:0;
  width:56px;
  height:80px;
  object-fit:cover;
  border-right:2px solid var(--bg-darkest);
  transition:opacity .2s;
}
.autor-card:hover .cover-strip { opacity:.85; }

/* Info */
.autor-info { padding:14px 14px 16px; display:flex; flex-direction:column; align-items:center; text-align:center; }
.autor-avatar-wrap { margin-top:-28px; margin-bottom:8px; }
.autor-avatar { width:54px; height:54px; border-radius:50%; object-fit:cover; border:3px solid var(--bg-card); box-shadow:0 2px 12px rgba(0,0,0,.4); background:var(--bg-elevated); }
.autor-nombre { font-size:0.88rem; font-weight:700; color:var(--text-primary); margin:0 0 3px; }
.autor-cat { font-size:0.68rem; color:var(--violet-lt); font-weight:600; margin-bottom:8px; text-transform:uppercase; letter-spacing:.3px; }
.autor-stats-row { display:flex; gap:10px; }
.autor-stat { font-size:0.72rem; color:var(--text-secondary); display:flex; align-items:center; }
.autor-stat i { color:var(--violet-lt); }

/* Modal */
.modal-overlay-ys { position:fixed; inset:0; background:rgba(0,0,0,.65); backdrop-filter:blur(4px); z-index:500; display:flex; align-items:center; justify-content:center; padding:16px; }
.modal-autor { background:var(--bg-dark); border:1px solid var(--border-color); border-radius:var(--r-lg); width:100%; max-width:540px; max-height:88vh; overflow-y:auto; position:relative; padding:24px; }
.modal-autor::-webkit-scrollbar { width:4px; }
.modal-autor::-webkit-scrollbar-thumb { background:var(--border-color); border-radius:4px; }
.modal-x-btn { position:absolute; top:14px; right:14px; width:30px; height:30px; border-radius:50%; background:var(--bg-card); border:1px solid var(--border-color); color:var(--text-secondary); display:flex; align-items:center; justify-content:center; cursor:pointer; z-index:10; font-size:16px; transition:all .2s; }
.modal-x-btn:hover { border-color:var(--violet); color:var(--text-primary); }
.modal-autor-header { display:flex; gap:16px; align-items:flex-start; margin-bottom:16px; }
.modal-autor-avatar { width:80px; height:80px; border-radius:50%; object-fit:cover; border:3px solid rgba(124,58,237,.4); flex-shrink:0; }
.modal-autor-nombre { font-family:var(--font-d); font-size:1.25rem; color:var(--text-primary); margin:0 0 3px; }
.modal-autor-cats { font-size:0.75rem; color:var(--violet-lt); font-weight:600; text-transform:uppercase; letter-spacing:.3px; margin:0; }
.chip-stat { background:rgba(124,58,237,.12); border:1px solid rgba(124,58,237,.2); color:var(--text-secondary); padding:3px 10px; border-radius:20px; font-size:0.72rem; font-weight:600; display:inline-flex; align-items:center; }
.modal-autor-bio { font-size:0.82rem; color:var(--text-secondary); line-height:1.7; margin-bottom:20px; padding:12px 14px; background:var(--bg-elevated); border-radius:var(--r-sm); border-left:3px solid rgba(124,58,237,.4); }
.modal-section-title { font-size:0.85rem; font-weight:700; color:var(--text-primary); margin-bottom:12px; padding-bottom:8px; border-bottom:1px solid var(--border-color); }
.modal-libros-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(130px, 1fr)); gap:10px; }
.modal-libro-card { background:var(--bg-elevated); border:1px solid var(--border-color); border-radius:var(--r-sm); overflow:hidden; transition:all .2s; }
.modal-libro-card:hover { border-color:rgba(124,58,237,.4); transform:translateY(-2px); }
.modal-libro-cover { height:130px; overflow:hidden; }
.modal-libro-cover img { width:100%; height:100%; object-fit:cover; }
.modal-libro-info { padding:8px 10px; }
.modal-libro-title { font-size:0.72rem; font-weight:600; color:var(--text-primary); margin-bottom:3px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
.modal-libro-price { font-size:0.75rem; font-weight:700; color:var(--accent); margin-bottom:4px; }
.modal-libro-cat { background:rgba(124,58,237,.12); color:var(--violet-lt); padding:1px 6px; border-radius:10px; font-size:0.62rem; font-weight:600; }
</style>
