<template>
  <!-- ProductView: gestión de productos con CRUD simulado usando LocalStorage -->
  <div>
    <!-- Encabezado -->
    <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
      <div>
        <h2 class="page-title">
          <i class="bi bi-book-fill me-2"></i>Gestión de Libros
        </h2>
        <p class="text-secondary mb-0">CRUD simulado con LocalStorage</p>
      </div>
      <button class="btn btn-primary" @click="abrirModalCrear">
        <i class="bi bi-plus-lg me-1"></i> Agregar Libro
      </button>
    </div>

    <!-- Barra de búsqueda y filtro -->
    <div class="row g-2 mb-3">
      <div class="col-12 col-md-6">
        <div class="input-group">
          <span class="input-group-text search-addon">
            <i class="bi bi-search"></i>
          </span>
          <input
            v-model="busqueda"
            type="text"
            class="form-control"
            placeholder="Buscar por nombre o autor..."
          />
        </div>
      </div>
      <div class="col-12 col-md-3">
        <select v-model="filtroCategoria" class="form-select">
          <option value="">Todas las categorías</option>
          <option v-for="cat in categorias" :key="cat" :value="cat">{{ cat }}</option>
        </select>
      </div>
      <div class="col-12 col-md-3">
        <button class="btn btn-outline-secondary w-100" @click="reiniciarDatos">
          <i class="bi bi-arrow-counterclockwise me-1"></i> Reiniciar datos
        </button>
      </div>
    </div>

    <!-- Alerta si no hay productos -->
    <div v-if="productosFiltrados.length === 0" class="alert-empty">
      <i class="bi bi-inbox fs-1 mb-2 d-block"></i>
      <p class="mb-0">No se encontraron libros.</p>
    </div>

    <!-- Tabla estilizada con Bootstrap -->
    <div v-else class="table-responsive rounded">
      <table class="table table-dark table-hover align-middle ys-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Portada</th>
            <th>Nombre</th>
            <th>Autor</th>
            <th>Categoría</th>
            <th>Precio</th>
            <th>Stock</th>
            <th class="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <!-- Iteramos sobre los productos filtrados -->
          <tr v-for="(producto, index) in productosFiltrados" :key="producto.id">
            <td class="text-muted">{{ index + 1 }}</td>
            <td>
              <img
                :src="producto.image"
                :alt="producto.name"
                class="product-thumb"
                @error="onImgError"
              />
            </td>
            <td>
              <span class="fw-500">{{ producto.name }}</span>
            </td>
            <td class="text-secondary">{{ producto.author }}</td>
            <td>
              <span class="badge ys-badge">{{ producto.category }}</span>
            </td>
            <td class="text-warning fw-600">$ {{ formatearPrecio(producto.price) }}</td>
            <td>
              <span :class="producto.stock > 10 ? 'text-success' : 'text-warning'">
                {{ producto.stock }}
              </span>
            </td>
            <td class="text-center">
              <div class="d-flex justify-content-center gap-1 flex-wrap">
                <!-- Botón ver detalles -->
                <button
                  class="btn btn-sm btn-action btn-action--info"
                  @click="verDetalles(producto)"
                  title="Ver detalles"
                >
                  <i class="bi bi-eye"></i>
                </button>
                <!-- Botón editar -->
                <button
                  class="btn btn-sm btn-action btn-action--edit"
                  @click="abrirModalEditar(producto)"
                  title="Editar"
                >
                  <i class="bi bi-pencil"></i>
                </button>
                <!-- Botón eliminar -->
                <button
                  class="btn btn-sm btn-action btn-action--delete"
                  @click="confirmarEliminar(producto)"
                  title="Eliminar"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Total de registros -->
    <div class="mt-2 text-secondary" style="font-size:0.8rem;">
      Mostrando {{ productosFiltrados.length }} de {{ productos.length }} libros
    </div>

    <!-- ===== MODAL: CREAR / EDITAR ===== -->
    <div v-if="mostrarModal" class="modal-overlay" @click.self="cerrarModal">
      <div class="modal-box">
        <div class="modal-box__header">
          <h5 class="mb-0">
            <i :class="modoEdicion ? 'bi bi-pencil-square' : 'bi bi-plus-circle'" class="me-2"></i>
            {{ modoEdicion ? 'Editar Libro' : 'Agregar Libro' }}
          </h5>
          <button class="btn-close btn-close-white" @click="cerrarModal"></button>
        </div>
        <div class="modal-box__body">
          <!-- Formulario crear/editar -->
          <div class="row g-3">
            <div class="col-12">
              <label class="form-label form-label-ys">Nombre del libro</label>
              <input v-model="formulario.name" type="text" class="form-control" placeholder="Ej: El alquimista" />
            </div>
            <div class="col-12 col-md-6">
              <label class="form-label form-label-ys">Autor</label>
              <input v-model="formulario.author" type="text" class="form-control" placeholder="Ej: Paulo Coelho" />
            </div>
            <div class="col-12 col-md-6">
              <label class="form-label form-label-ys">Categoría</label>
              <select v-model="formulario.category" class="form-select">
                <option value="">Seleccionar...</option>
                <option>Arte</option>
                <option>Psicología</option>
                <option>Misterio</option>
                <option>Novela</option>
                <option>Historia</option>
                <option>Detective</option>
                <option>Espiritualidad</option>
                <option>Negocios</option>
                <option>Otro</option>
              </select>
            </div>
            <div class="col-12 col-md-6">
              <label class="form-label form-label-ys">Precio (COP)</label>
              <input v-model.number="formulario.price" type="number" class="form-control" placeholder="Ej: 45000" min="0" />
            </div>
            <div class="col-12 col-md-6">
              <label class="form-label form-label-ys">Stock</label>
              <input v-model.number="formulario.stock" type="number" class="form-control" placeholder="Ej: 10" min="0" />
            </div>
            <div class="col-12">
              <label class="form-label form-label-ys">URL de portada</label>
              <input v-model="formulario.image" type="url" class="form-control" placeholder="https://..." />
            </div>
            <div class="col-12">
              <label class="form-label form-label-ys">Descripción</label>
              <textarea v-model="formulario.description" class="form-control" rows="2" placeholder="Breve descripción del libro..."></textarea>
            </div>
          </div>

          <!-- Alerta de validación -->
          <div v-if="errorFormulario" class="alert alert-danger mt-3 py-2" style="font-size:0.83rem;">
            <i class="bi bi-exclamation-triangle me-1"></i>{{ errorFormulario }}
          </div>
        </div>
        <div class="modal-box__footer">
          <button class="btn btn-secondary" @click="cerrarModal">Cancelar</button>
          <button class="btn btn-primary" @click="guardarProducto">
            <i class="bi bi-check-lg me-1"></i>
            {{ modoEdicion ? 'Guardar cambios' : 'Agregar libro' }}
          </button>
        </div>
      </div>
    </div>

    <!-- ===== MODAL: VER DETALLES ===== -->
    <div v-if="productoDetalle" class="modal-overlay" @click.self="productoDetalle = null">
      <div class="modal-box modal-box--detail">
        <div class="modal-box__header">
          <h5 class="mb-0"><i class="bi bi-info-circle me-2"></i>Detalle del libro</h5>
          <button class="btn-close btn-close-white" @click="productoDetalle = null"></button>
        </div>
        <div class="modal-box__body">
          <div class="d-flex gap-3 flex-wrap">
            <img
              :src="productoDetalle.image"
              :alt="productoDetalle.name"
              class="detail-img"
              @error="onImgError"
            />
            <div class="flex-grow-1">
              <h5 class="detail-title">{{ productoDetalle.name }}</h5>
              <p class="text-secondary mb-1"><i class="bi bi-person me-1"></i>{{ productoDetalle.author }}</p>
              <span class="badge ys-badge mb-2">{{ productoDetalle.category }}</span>
              <p class="detail-price">$ {{ formatearPrecio(productoDetalle.price) }}</p>
              <p class="text-secondary" style="font-size:0.85rem;">
                <i class="bi bi-box-seam me-1"></i>Stock: {{ productoDetalle.stock }} unidades
              </p>
              <p class="mt-2" style="font-size:0.85rem; color: var(--text-secondary);">
                {{ productoDetalle.description }}
              </p>
            </div>
          </div>
        </div>
        <div class="modal-box__footer">
          <button class="btn btn-secondary" @click="productoDetalle = null">Cerrar</button>
        </div>
      </div>
    </div>

    <!-- ===== MODAL: CONFIRMAR ELIMINAR ===== -->
    <div v-if="productoAEliminar" class="modal-overlay" @click.self="productoAEliminar = null">
      <div class="modal-box modal-box--sm">
        <div class="modal-box__header">
          <h5 class="mb-0 text-danger"><i class="bi bi-trash me-2"></i>Eliminar libro</h5>
          <button class="btn-close btn-close-white" @click="productoAEliminar = null"></button>
        </div>
        <div class="modal-box__body">
          <p class="mb-0">
            ¿Estás seguro que deseas eliminar <strong>{{ productoAEliminar.name }}</strong>?
            Esta acción no se puede deshacer.
          </p>
        </div>
        <div class="modal-box__footer">
          <button class="btn btn-secondary" @click="productoAEliminar = null">Cancelar</button>
          <button class="btn btn-danger" @click="eliminarProductoConfirmado">
            <i class="bi bi-trash me-1"></i> Sí, eliminar
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import {
  obtenerProductos,
  agregarProducto,
  editarProducto,
  eliminarProducto,
  inicializarProductos,
  reiniciarProductos
} from '../services/productService.js'

export default {
  name: 'ProductView',
  data() {
    return {
      productos: [],           // Lista completa de productos
      busqueda: '',            // Texto de búsqueda
      filtroCategoria: '',     // Filtro por categoría
      mostrarModal: false,     // Controla el modal crear/editar
      modoEdicion: false,      // true = editar, false = crear
      productoDetalle: null,   // Producto para el modal de detalles
      productoAEliminar: null, // Producto para el modal de confirmación
      errorFormulario: '',     // Mensaje de error en el formulario
      formulario: {            // Datos del formulario
        id: null,
        name: '',
        author: '',
        category: '',
        price: 0,
        stock: 0,
        image: '',
        description: ''
      }
    }
  },
  computed: {
    // Filtra los productos según búsqueda y categoría seleccionada
    productosFiltrados() {
      return this.productos.filter(p => {
        const textoBusqueda = this.busqueda.toLowerCase()
        const coincideTexto =
          p.name.toLowerCase().includes(textoBusqueda) ||
          p.author.toLowerCase().includes(textoBusqueda)
        const coincideCategoria =
          !this.filtroCategoria || p.category === this.filtroCategoria
        return coincideTexto && coincideCategoria
      })
    },
    // Lista de categorías únicas para el filtro
    categorias() {
      return [...new Set(this.productos.map(p => p.category))]
    }
  },
  async created() {
    // Cargamos el JSON y precargamos en LocalStorage si está vacío
    try {
      const response = await fetch('/products.json')
      const productosJson = await response.json()
      inicializarProductos(productosJson)
    } catch (e) {
      console.error('Error cargando products.json:', e)
    }
    // Cargamos desde LocalStorage
    this.productos = obtenerProductos()
  },
  methods: {
    // ── LISTAR ──
    cargarProductos() {
      this.productos = obtenerProductos()
    },

    // ── VER DETALLES ──
    verDetalles(producto) {
      this.productoDetalle = producto
    },

    // ── CREAR ──
    abrirModalCrear() {
      this.modoEdicion = false
      this.errorFormulario = ''
      this.formulario = {
        id: null, name: '', author: '', category: '',
        price: 0, stock: 0, image: '', description: ''
      }
      this.mostrarModal = true
    },

    // ── EDITAR ──
    abrirModalEditar(producto) {
      this.modoEdicion = true
      this.errorFormulario = ''
      // Copiamos el producto al formulario para no mutar directamente
      this.formulario = { ...producto }
      this.mostrarModal = true
    },

    // ── GUARDAR (crear o editar) ──
    guardarProducto() {
      // Validación básica
      if (!this.formulario.name || !this.formulario.author || !this.formulario.category) {
        this.errorFormulario = 'El nombre, autor y categoría son obligatorios.'
        return
      }
      if (this.formulario.price <= 0) {
        this.errorFormulario = 'El precio debe ser mayor a 0.'
        return
      }

      if (this.modoEdicion) {
        // Modo edición: actualizamos en LocalStorage
        editarProducto(this.formulario)
      } else {
        // Modo crear: agregamos al LocalStorage
        agregarProducto(this.formulario)
      }

      // Recargamos la lista y cerramos el modal
      this.cargarProductos()
      this.cerrarModal()
    },

    // ── ELIMINAR ──
    confirmarEliminar(producto) {
      this.productoAEliminar = producto
    },

    eliminarProductoConfirmado() {
      eliminarProducto(this.productoAEliminar.id)
      this.cargarProductos()
      this.productoAEliminar = null
    },

    // ── CERRAR MODAL ──
    cerrarModal() {
      this.mostrarModal = false
      this.errorFormulario = ''
    },

    // ── REINICIAR DATOS ──
    async reiniciarDatos() {
      if (confirm('¿Reiniciar todos los datos desde el JSON original?')) {
        reiniciarProductos()
        // Recargar desde el JSON y forzar inicialización
        try {
          const response = await fetch('/products.json')
          const productosJson = await response.json()
          // Forzar guardado directo (localStorage ya fue borrado)
          inicializarProductos(productosJson)
        } catch (e) {
          console.error('Error recargando products.json:', e)
        }
        this.productos = obtenerProductos()
        this.busqueda = ''
        this.filtroCategoria = ''
      }
    },

    // ── UTILIDADES ──
    formatearPrecio(precio) {
      return Number(precio).toLocaleString('es-CO')
    },

    onImgError(e) {
      e.target.src = 'https://via.placeholder.com/60x80/1e2d47/7c3aed?text=YS'
    }
  }
}
</script>

<style scoped>
.page-title {
  font-family: var(--font-d);
  color: var(--text-primary);
  font-size: 1.5rem;
  margin-bottom: 4px;
}

/* Tabla */
.ys-table {
  background: var(--bg-card);
  border-color: var(--border-color);
  font-size: 0.83rem;
}

.ys-table thead tr {
  background: rgba(30, 45, 71, 0.8);
}

.ys-table thead th {
  color: var(--text-secondary);
  font-weight: 600;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-color: var(--border-color);
  padding: 12px 10px;
}

.ys-table tbody td {
  border-color: var(--border-color);
  padding: 10px;
  vertical-align: middle;
}

.ys-table tbody tr:hover {
  background: rgba(124, 58, 237, 0.06);
}

.product-thumb {
  width: 44px;
  height: 60px;
  object-fit: cover;
  border-radius: var(--r-sm);
  border: 1px solid var(--border-color);
}

.ys-badge {
  background: rgba(124, 58, 237, 0.2);
  color: var(--violet-lt);
  border: 1px solid rgba(124, 58, 237, 0.3);
  font-size: 0.68rem;
  font-weight: 600;
}

/* Botones de acción */
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

/* Barra de búsqueda */
.search-addon {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-right: none;
  color: var(--text-secondary);
}

/* Estado vacío */
.alert-empty {
  text-align: center;
  padding: 3rem;
  color: var(--text-muted);
}

/* Modal overlay */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
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

.modal-box--sm {
  max-width: 420px;
}

.modal-box--detail {
  max-width: 560px;
}

.modal-box__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--border-color);
  color: var(--text-primary);
}

.modal-box__body {
  padding: 1.25rem;
}

.modal-box__footer {
  padding: 1rem 1.25rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.form-label-ys {
  color: var(--text-secondary);
  font-size: 0.82rem;
  font-weight: 500;
  margin-bottom: 5px;
}

.btn-secondary {
  background: rgba(99, 120, 180, 0.15) !important;
  border: 1px solid var(--border-color) !important;
  color: var(--text-secondary) !important;
}

/* Modal detalles */
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

.fw-500 { font-weight: 500; }
.fw-600 { font-weight: 600; }

/* Alert oscuro */
.alert-danger {
  background: rgba(239, 68, 68, 0.12) !important;
  border-color: rgba(239, 68, 68, 0.3) !important;
  color: #fca5a5 !important;
}
</style>
