<template>
  <div class="modal-dialog modal-dialog-centered modal-sm">
    <div class="modal-content modal-box modal-box--sm">
      <div class="modal-box__header">
        <h5 class="mb-0 text-danger">
          <i class="bi bi-trash me-2"></i>Eliminar libro
        </h5>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Cerrar"></button>
      </div>

      <div class="modal-box__body">
        <p class="mb-0">
          ¿Estás seguro de que deseas eliminar <strong>{{ product?.name }}</strong>?
          Esta acción no se puede deshacer.
        </p>
      </div>

      <div class="modal-box__footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
        <button type="button" class="btn btn-danger" @click="$emit('confirm')">
          <i class="bi bi-trash me-1"></i> Sí, eliminar
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductDeleteConfirm',
  props: {
    product: { type: Object, default: null }
  },
  emits: ['confirm']
}
</script>
