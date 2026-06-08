<template>
  <div class="modal-dialog modal-dialog-centered modal-lg">
    <div class="modal-content modal-box">
      <div class="modal-box__header">
        <h5 class="mb-0">
          <i :class="isEditing ? 'bi bi-pencil-square' : 'bi bi-plus-circle'" class="me-2"></i>
          {{ isEditing ? 'Editar libro' : 'Agregar libro' }}
        </h5>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Cerrar"></button>
      </div>

      <form @submit.prevent="$emit('submit')" novalidate>
        <div class="modal-box__body">
          <div class="row g-3">
            <div class="col-12">
              <label class="form-label form-label-ys">Nombre del libro</label>
              <input v-model.trim="form.name" type="text" class="form-control" :class="{ 'is-invalid': errors.name }" placeholder="Ej: El alquimista" />
            <div v-if="errors.name" class="invalid-feedback d-block">{{ errors.name }}</div>
            </div>

            <div class="col-12 col-md-6">
              <label class="form-label form-label-ys">Autor</label>
              <input v-model.trim="form.author" type="text" class="form-control" placeholder="Ej: Paulo Coelho" :class="{ 'is-invalid': errors.author }" />
              <div v-if="errors.author" class="invalid-feedback d-block">{{ errors.author }}</div>
            </div>

            <div class="col-12 col-md-6">
              <label class="form-label form-label-ys">Categoría</label>
              <select v-model="form.category" class="form-select" :class="{ 'is-invalid': errors.category }">
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
              <div v-if="errors.category" class="invalid-feedback d-block">{{ errors.category }}</div>
            </div>

            <div class="col-12 col-md-6">
              <label class="form-label form-label-ys">Precio (COP)</label>
              <input v-model.number="form.price" type="number" min="0" class="form-control" placeholder="Ej: 45000" :class="{ 'is-invalid': errors.price }" />
              <div v-if="errors.price" class="invalid-feedback d-block">{{ errors.price }}</div>
            </div>

            <div class="col-12 col-md-6">
              <label class="form-label form-label-ys">Stock</label>
              <input v-model.number="form.stock" type="number" min="0" class="form-control" placeholder="Ej: 10" :class="{ 'is-invalid': errors.stock }" />
              <div v-if="errors.stock" class="invalid-feedback d-block">{{ errors.stock }}</div>
            </div>

            <div class="col-12">
              <label class="form-label form-label-ys">URL de portada</label>
              <input v-model.trim="form.image" type="url" class="form-control" placeholder="https://..." />
            </div>

            <div class="col-12">
              <label class="form-label form-label-ys">Descripción</label>
              <textarea v-model.trim="form.description" class="form-control" rows="3" placeholder="Breve descripción del libro..."></textarea>
            </div>
          </div>

          <div v-if="error" class="alert alert-danger mt-3 mb-0 py-2" role="alert">
            <i class="bi bi-exclamation-triangle me-1"></i>{{ error }}
          </div>
        </div>

        <div class="modal-box__footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
          <button type="submit" class="btn btn-primary" :disabled="saving">
            <span v-if="saving" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            {{ isEditing ? 'Guardar cambios' : 'Agregar libro' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductForm',
  props: {
    form: { type: Object, required: true },
    isEditing: { type: Boolean, default: false },
    saving: { type: Boolean, default: false },
    error: { type: String, default: '' },
    errors: { type: Object, default: () => ({}) }
  },
  emits: ['submit']
}
</script>
