<template>
  <div class="table-responsive rounded">
    <table class="table table-dark table-hover align-middle ys-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Usuario</th>
          <th>Correo</th>
          <th>Rol</th>
          <th>Estado</th>
          <th class="text-center">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(usuario, index) in users" :key="usuario.id">
          <td class="text-muted">{{ index + 1 }}</td>
          <td>
            <div class="d-flex align-items-center gap-2">
              <div class="usuario-avatar">{{ initials(usuario.nombre) }}</div>
              <div>
                <div class="fw-500">{{ usuario.nombre }}</div>
                <small class="text-muted">@{{ usuario.usuario }}</small>
              </div>
            </div>
          </td>
          <td class="text-secondary">{{ usuario.email || '—' }}</td>
          <td>
            <span class="badge ys-badge" :class="usuario.role === 'admin' ? 'ys-badge--admin' : 'ys-badge--cliente'">
              {{ usuario.role === 'admin' ? 'Administrador' : 'Cliente' }}
            </span>
          </td>
          <td>
            <span :class="usuario.activo ? 'badge-activo' : 'badge-inactivo'">
              <i :class="usuario.activo ? 'bi bi-check-circle-fill' : 'bi bi-x-circle-fill'" class="me-1"></i>
              {{ usuario.activo ? 'Activo' : 'Inactivo' }}
            </span>
          </td>
          <td class="text-center">
            <div class="d-flex justify-content-center gap-1 flex-wrap">
              <button class="btn btn-sm btn-action btn-action--edit" type="button" @click="$emit('edit', usuario)" title="Editar">
                <i class="bi bi-pencil-square"></i>
              </button>
              <button class="btn btn-sm btn-action btn-action--delete" type="button" @click="$emit('delete', usuario)" title="Eliminar">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'UserList',
  props: {
    users: { type: Array, default: () => [] }
  },
  emits: ['edit', 'delete'],
  methods: {
    initials(name) {
      const value = String(name || '').trim()
      if (!value) return '?'
      return value.split(/\s+/).slice(0, 2).map(part => part.charAt(0).toUpperCase()).join('')
    }
  }
}
</script>
