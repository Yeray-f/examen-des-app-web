<template>
  <div>
    <div v-if="products.length === 0" class="alert-empty">
      <i class="bi bi-inbox fs-1 mb-2 d-block"></i>
      <p class="mb-0">No se encontraron libros.</p>
    </div>

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
          <tr v-for="(producto, index) in products" :key="producto.id">
            <td class="text-muted">{{ index + 1 }}</td>
            <td>
              <img
                :src="$resolveCover(producto.image, { title: producto.name, id: producto.id })"
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
            <td class="text-warning fw-600">$ {{ formatPrice(producto.price) }}</td>
            <td>
              <span :class="producto.stock > 10 ? 'text-success' : 'text-warning'">
                {{ producto.stock }}
              </span>
            </td>
            <td class="text-center">
              <div class="d-flex justify-content-center gap-1 flex-wrap">
                <button class="btn btn-sm btn-action btn-action--info" type="button" @click="$emit('view', producto)" title="Ver detalles">
                  <i class="bi bi-eye"></i>
                </button>
                <button class="btn btn-sm btn-action btn-action--edit" type="button" @click="$emit('edit', producto)" title="Editar">
                  <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-action btn-action--delete" type="button" @click="$emit('delete', producto)" title="Eliminar">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductList',
  props: {
    products: { type: Array, default: () => [] }
  },
  emits: ['view', 'edit', 'delete'],
  methods: {
    formatPrice(value) {
      return Number(value || 0).toLocaleString('es-CO')
    },
    onImgError(event) {
      event.target.src = this.$resolveCover(null, { title: 'Libro', id: 0 })
    }
  }
}
</script>