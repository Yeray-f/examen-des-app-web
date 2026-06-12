<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
      <div>
        <h2 class="page-title">
          <i class="bi bi-book-fill me-2"></i>Gestión de Libros
        </h2>
        <p class="text-secondary mb-0">CRUD administrado con Bootstrap Modal y persistencia local + MockAPI.</p>
      </div>

      <button class="btn btn-primary" type="button" @click="abrirModalCrear">
        <i class="bi bi-plus-lg me-1"></i> Agregar libro
      </button>
    </div>

    <div v-if="alerta" class="alert alert-dismissible fade show d-flex align-items-center gap-2 ys-alert" :class="`alert-${alerta.type}`" role="alert">
      <i :class="alerta.icon"></i>
      <span>{{ alerta.message }}</span>
      <button type="button" class="btn-close btn-close-white ms-auto" @click="clearAlert"></button>
    </div>

    <div class="row g-2 mb-3">
      <div class="col-12 col-md-6">
        <div class="input-group">
          <span class="input-group-text search-addon"><i class="bi bi-search"></i></span>
          <input v-model.trim="busqueda" type="text" class="form-control" placeholder="Buscar por nombre, autor o categoría..." />
        </div>
      </div>
      <div class="col-12 col-md-3">
        <select v-model="filtroCategoria" class="form-select">
          <option value="">Todas las categorías</option>
          <option v-for="cat in categoriasDisponibles" :key="cat" :value="cat">{{ cat }}</option>
        </select>
      </div>
      <div class="col-12 col-md-3">
        <button class="btn btn-outline-secondary w-100" type="button" @click="reiniciarDatos">
          <i class="bi bi-arrow-counterclockwise me-1"></i> Reiniciar datos
        </button>
      </div>
    </div>

    <ProductList
      :products="productosFiltrados"
      @view="abrirDetalle"
      @edit="abrirModalEditar"
      @delete="confirmarEliminar"
    />

    <div class="mt-2 text-secondary" style="font-size:0.8rem;">
      Mostrando {{ productosFiltrados.length }} de {{ productos.length }} libros
    </div>

    <div ref="formModalEl" id="productFormModal" class="modal fade" tabindex="-1" aria-hidden="true">
      <ProductForm
        :form="formulario"
        :is-editing="modoEdicion"
        :saving="guardando"
         :error="errorFormulario" :errors="fieldErrors"
        @submit="guardarProducto"
      />
    </div>

    <div ref="detailModalEl" id="productDetailModal" class="modal fade" tabindex="-1" aria-hidden="true">
      <ProductDetailModal :product="productoDetalle" />
    </div>

    <div ref="deleteModalEl" id="productDeleteModal" class="modal fade" tabindex="-1" aria-hidden="true">
      <ProductDeleteConfirm :product="productoAEliminar" @confirm="eliminarProductoConfirmado" />
    </div>
  </div>
</template>

<script>
import { Modal } from 'bootstrap'
import ProductList from '../components/ProductList.vue'
import ProductForm from '../components/ProductForm.vue'
import ProductDetailModal from '../components/ProductDetailModal.vue'
import ProductDeleteConfirm from '../components/ProductDeleteConfirm.vue'
import { useAlert } from '../composables/useAlert.js'
import {
  cargarProductosIniciales,
  obtenerProductos,
  agregarProducto,
  editarProducto,
  eliminarProducto,
  reiniciarProductos
} from '../services/productService.js'

function createEmptyProduct() {
  return {
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

export default {
  name: 'ProductView',
  components: {
    ProductList,
    ProductForm,
    ProductDetailModal,
    ProductDeleteConfirm
  },
  setup() {
    const { alert: alerta, showAlert, clearAlert } = useAlert(3200)
    return { alerta, showAlert, clearAlert }
  },
  data() {
    return {
      productos: [],
      busqueda: '',
      filtroCategoria: '',
      formulario: createEmptyProduct(),
      modoEdicion: false,
      guardando: false,
      errorFormulario: '',
      fieldErrors: {},
      productoDetalle: null,
      productoAEliminar: null,
      formModal: null,
      detailModal: null,
      deleteModal: null,
      _modalHandlers: []
    }
  },
  computed: {
    categoriasDisponibles() {
      return [...new Set(this.productos.map(producto => producto.category).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'es'))
    },
    productosFiltrados() {
      const texto = String(this.busqueda || '').trim().toLowerCase()
      return this.productos.filter(producto => {
        const coincideTexto = !texto ||
          producto.name.toLowerCase().includes(texto) ||
          producto.author.toLowerCase().includes(texto) ||
          producto.category.toLowerCase().includes(texto)

        const coincideCategoria = !this.filtroCategoria || producto.category === this.filtroCategoria
        return coincideTexto && coincideCategoria
      })
    }
  },
  async mounted() {
    try {
      await this.cargarDatos()
    } catch (error) {
      this.showAlert(error?.message || 'No fue posible cargar los datos.', 'danger')
    }
    this.initModals()
  },
  beforeUnmount() {
    this.disposeModals()
    this.clearAlert()
  },
  methods: {
    createEmptyProduct,
    async cargarDatos() {
      await cargarProductosIniciales()
      this.productos = obtenerProductos()
    },
    initModals() {
      this.formModal = Modal.getOrCreateInstance(this.$refs.formModalEl, { backdrop: 'static', keyboard: true })
      this.detailModal = Modal.getOrCreateInstance(this.$refs.detailModalEl, { backdrop: true, keyboard: true })
      this.deleteModal = Modal.getOrCreateInstance(this.$refs.deleteModalEl, { backdrop: 'static', keyboard: true })

      this.attachHiddenHandler(this.$refs.formModalEl, this.resetForm)
      this.attachHiddenHandler(this.$refs.detailModalEl, this.resetDetail)
      this.attachHiddenHandler(this.$refs.deleteModalEl, this.resetDelete)
    },
    attachHiddenHandler(el, handler) {
      if (!el) return
      const bound = () => handler()
      el.addEventListener('hidden.bs.modal', bound)
      this._modalHandlers.push({ el, bound })
    },
    disposeModals() {
      this._modalHandlers.forEach(({ el, bound }) => el.removeEventListener('hidden.bs.modal', bound))
      this._modalHandlers = []
      this.formModal?.dispose?.()
      this.detailModal?.dispose?.()
      this.deleteModal?.dispose?.()
    },
    resetForm() {
      this.formulario = createEmptyProduct()
      this.modoEdicion = false
      this.errorFormulario = ''
      this.guardando = false
    },
    resetDetail() {
      this.productoDetalle = null
    },
    resetDelete() {
      this.productoAEliminar = null
    },
    abrirModalCrear() {
      this.resetForm()
      this.formModal?.show()
    },
    abrirModalEditar(producto) {
      this.errorFormulario = ''
      this.modoEdicion = true
      this.formulario = {
        ...createEmptyProduct(),
        ...producto,
        price: Number(producto.price || 0),
        stock: Number(producto.stock || 0)
      }
      this.formModal?.show()
    },
    validarFormulario() {
      this.fieldErrors = {}
      this.errorFormulario = ''
      if (!this.formulario.name?.trim()) this.fieldErrors.name = 'Nombre requerido.'
      if (!this.formulario.author?.trim()) this.fieldErrors.author = 'Autor requerido.'
      if (!this.formulario.category) this.fieldErrors.category = 'Seleccione una categoría.'
      if (Number(this.formulario.price) <= 0) this.fieldErrors.price = 'Precio mayor a 0.'
      if (Number(this.formulario.stock) < 0) this.fieldErrors.stock = 'Stock inválido.'
      return Object.keys(this.fieldErrors).length === 0
    },
    async guardarProducto() {
      if (!this.validarFormulario()) return

      this.guardando = true
      try {
        const payload = {
          ...this.formulario,
          price: Number(this.formulario.price),
          stock: Number(this.formulario.stock)
        }

        if (this.modoEdicion) {
          await editarProducto(payload)
          this.showAlert('Libro actualizado correctamente', 'success')
        } else {
          await agregarProducto(payload)
          this.showAlert('Libro creado correctamente', 'success')
        }

        this.productos = obtenerProductos()
        this.formModal?.hide()
      } catch (error) {
        this.errorFormulario = error?.message || 'No fue posible guardar el libro.'
      } finally {
        this.guardando = false
      }
    },
    abrirDetalle(producto) {
      this.productoDetalle = { ...producto }
      this.detailModal?.show()
    },
    confirmarEliminar(producto) {
      this.productoAEliminar = { ...producto }
      this.deleteModal?.show()
    },
    async eliminarProductoConfirmado() {
      if (!this.productoAEliminar) return

      try {
        await eliminarProducto(this.productoAEliminar.id)
        this.productos = obtenerProductos()
        this.showAlert('Libro eliminado correctamente', 'success')
        this.deleteModal?.hide()
      } catch (error) {
        this.showAlert(error?.message || 'No fue posible eliminar el libro.', 'danger')
      }
    },
    async reiniciarDatos() {
      if (!window.confirm('¿Reiniciar todos los libros desde el archivo original?')) return

      const restaurado = reiniciarProductos()
      if (!restaurado) {
        await cargarProductosIniciales()
      }

      this.productos = obtenerProductos()
      this.busqueda = ''
      this.filtroCategoria = ''
      this.showAlert('Libros restaurados correctamente', 'success')
    }
  }
}
</script>

