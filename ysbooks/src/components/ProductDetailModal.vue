<template>
  <div class="modal-dialog modal-dialog-centered modal-lg">
    <div class="modal-content modal-box modal-box--detail">
      <div class="modal-box__header">
        <h5 class="mb-0"><i class="bi bi-info-circle me-2"></i>Detalle del libro</h5>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Cerrar"></button>
      </div>

      <div class="modal-box__body" v-if="product">
        <div class="d-flex gap-3 flex-wrap">
          <img
            :src="$resolveCover(product.image, { title: product.name, id: product.id })"
            :alt="product.name"
            class="detail-img"
            @error="onImgError"
          />
          <div class="flex-grow-1">
            <h5 class="detail-title">{{ product.name }}</h5>
            <p class="text-secondary mb-1"><i class="bi bi-person me-1"></i>{{ product.author }}</p>
            <span class="badge ys-badge mb-2">{{ product.category }}</span>
            <p class="detail-price">$ {{ formatPrice(product.price) }}</p>
            <p class="text-secondary mb-1" style="font-size:0.85rem;">
              <i class="bi bi-box-seam me-1"></i>Stock: {{ product.stock }} unidades
            </p>
            <p class="mt-2 mb-0" style="font-size:0.9rem; color: var(--text-secondary);">
              {{ product.description || 'Sin descripción disponible.' }}
            </p>
          </div>
        </div>
      </div>

      <div class="modal-box__footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductDetailModal',
  props: {
    product: { type: Object, default: null }
  },
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