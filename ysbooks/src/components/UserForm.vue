<template>
  <div class="modal-dialog modal-dialog-centered modal-lg">
    <div class="modal-content modal-box">
      <div class="modal-box__header">
        <h5 class="mb-0">
          <i :class="isEditing ? 'bi bi-pencil-square' : 'bi bi-person-plus-fill'" class="me-2"></i>
          {{ isEditing ? 'Editar usuario' : 'Agregar usuario' }}
        </h5>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Cerrar"></button>
      </div>

      <form @submit.prevent="$emit('submit')" novalidate>
        <div class="modal-box__body">
          <div class="row g-3">
            <div class="col-12">
              <label class="form-label form-label-ys">Nombre completo</label>
              <input v-model.trim="form.nombre" type="text" class="form-control" :class="{ 'is-invalid': errors.nombre }" placeholder="Ej: María Pérez" />
            <div v-if="errors.nombre" class="invalid-feedback d-block">{{ errors.nombre }}</div>
            </div>

            <div class="col-12 col-md-6">
              <label class="form-label form-label-ys">Usuario</label>
              <input v-model.trim="form.usuario" type="text" class="form-control" placeholder="Ej: mperz" autocomplete="username" :class="{ 'is-invalid': errors.usuario }" />
              <div v-if="errors.usuario" class="invalid-feedback d-block">{{ errors.usuario }}</div>
            </div>

            <div class="col-12 col-md-6">
              <label class="form-label form-label-ys">{{ isEditing ? 'Nueva contraseña (opcional)' : 'Contraseña' }}</label>
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                class="form-control"
                :placeholder="isEditing ? 'Déjala vacía para conservar la actual' : 'Mínimo 4 caracteres'"
                autocomplete="new-password"
                :class="{ 'is-invalid': errors.password }"
              />
              <div v-if="errors.password" class="invalid-feedback d-block">{{ errors.password }}</div>
            </div>

            <div class="col-12 col-md-6">
              <label class="form-label form-label-ys">Correo electrónico</label>
              <input v-model.trim="form.email" type="email" class="form-control" placeholder="usuario@correo.com" :class="{ 'is-invalid': errors.email }" />
              <div v-if="errors.email" class="invalid-feedback d-block">{{ errors.email }}</div>
            </div>

            <div class="col-12 col-md-3">
              <label class="form-label form-label-ys">Rol</label>
              <select v-model="form.role" class="form-select">
                <option value="cliente">Cliente</option>
                <option value="admin">Administrador</option>
              </select>
            </div>

            <div class="col-12 col-md-3 d-flex align-items-end">
              <div class="form-check form-switch mb-1">
                <input id="userActive" v-model="form.activo" class="form-check-input" type="checkbox" />
                <label class="form-check-label" for="userActive">Activo</label>
              </div>
            </div>
          </div>

          <div v-if="error" class="alert alert-danger mt-3 mb-0 py-2" role="alert">
            <i class="bi bi-exclamation-triangle me-1"></i>{{ error }}
          </div>
        </div>

        <div class="modal-box__footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
          <button type="button" class="btn btn-outline-light" @click="showPassword = !showPassword">
            <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'" class="me-1"></i>
            {{ showPassword ? 'Ocultar' : 'Mostrar' }}
          </button>
          <button type="submit" class="btn btn-primary" :disabled="saving">
            <span v-if="saving" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            {{ isEditing ? 'Guardar cambios' : 'Crear usuario' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserForm',
  props: {
    form: { type: Object, required: true },
    isEditing: { type: Boolean, default: false },
    saving: { type: Boolean, default: false },
    error: { type: String, default: '' },
    errors: { type: Object, default: () => ({}) }
  },
  emits: ['submit'],
  data() {
    return {
      showPassword: false
    }
  }
}
</script>
