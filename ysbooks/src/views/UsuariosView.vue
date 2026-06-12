<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
      <div>
        <h2 class="page-title">
          <i class="bi bi-people-fill me-2"></i>Gestión de Usuarios
        </h2>
        <p class="text-secondary mb-0">Administración de acceso y roles con MockAPI y hashes de contraseña.</p>
      </div>

      <button class="btn btn-primary" type="button" @click="abrirModalCrear">
        <i class="bi bi-plus-circle me-1"></i> Agregar usuario
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
          <input v-model.trim="busqueda" type="text" class="form-control" placeholder="Buscar por nombre o usuario..." />
        </div>
      </div>
      <div class="col-12 col-md-3">
        <select v-model="filtroRol" class="form-select">
          <option value="">Todos los roles</option>
          <option value="admin">Administrador</option>
          <option value="cliente">Cliente</option>
        </select>
      </div>
      <div class="col-12 col-md-3">
        <button class="btn btn-outline-secondary w-100" type="button" @click="reiniciarDatos">
          <i class="bi bi-arrow-counterclockwise me-1"></i> Reiniciar usuarios
        </button>
      </div>
    </div>

    <div class="row g-3 mb-4">
      <div class="col-6 col-lg-3">
        <div class="mini-stat">
          <span class="mini-stat__val text-violet">{{ usuarios.length }}</span>
          <span class="mini-stat__lbl">Usuarios</span>
        </div>
      </div>
      <div class="col-6 col-lg-3">
        <div class="mini-stat">
          <span class="mini-stat__val text-success">{{ adminCount }}</span>
          <span class="mini-stat__lbl">Admins</span>
        </div>
      </div>
      <div class="col-6 col-lg-3">
        <div class="mini-stat">
          <span class="mini-stat__val text-accent">{{ clienteCount }}</span>
          <span class="mini-stat__lbl">Clientes</span>
        </div>
      </div>
      <div class="col-6 col-lg-3">
        <div class="mini-stat">
          <span class="mini-stat__val">{{ usuariosActivos }}</span>
          <span class="mini-stat__lbl">Activos</span>
        </div>
      </div>
    </div>

    <div v-if="usuariosFiltrados.length === 0" class="alert-empty">
      <i class="bi bi-person-x fs-1 mb-2 d-block"></i>
      <p class="mb-0">No se encontraron usuarios.</p>
    </div>

    <UserList v-else :users="usuariosFiltrados" @edit="abrirModalEditar" @delete="confirmarEliminar" />

    <div ref="formModalEl" id="userModal" class="modal fade" tabindex="-1" aria-hidden="true">
      <UserForm
        :form="formulario"
        :is-editing="modoEdicion"
        :saving="guardando"
         :error="errorFormulario" :errors="fieldErrors"
        @submit="guardarUsuario"
      />
    </div>

    <div ref="deleteModalEl" id="userDeleteModal" class="modal fade" tabindex="-1" aria-hidden="true">
      <UserDeleteConfirm :user="usuarioAEliminar" @confirm="eliminarUsuarioConfirmado" />
    </div>
  </div>
</template>

<script>
import { Modal } from 'bootstrap'
import UserForm from '../components/UserForm.vue'
import UserList from '../components/UserList.vue'
import UserDeleteConfirm from '../components/UserDeleteConfirm.vue'
import { useAlert } from '../composables/useAlert.js'
import {
  cargarUsuariosIniciales,
  obtenerUsuarios,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  reiniciarUsuarios
} from '../services/userService.js'

function createEmptyUser() {
  return {
    id: null,
    nombre: '',
    usuario: '',
    password: '',
    role: 'cliente',
    email: '',
    activo: true
  }
}

export default {
  name: 'UsuariosView',
  components: {
    UserForm,
    UserList,
    UserDeleteConfirm
  },
  setup() {
    const { alert: alerta, showAlert, clearAlert } = useAlert(3200)
    return { alerta, showAlert, clearAlert }
  },
  data() {
    return {
      usuarios: [],
      busqueda: '',
      filtroRol: '',
      formulario: createEmptyUser(),
      modoEdicion: false,
      guardando: false,
      errorFormulario: '',
      fieldErrors: {},
      usuarioAEliminar: null,
      formModal: null,
      deleteModal: null,
      _modalHandlers: []
    }
  },
  computed: {
    usuariosFiltrados() {
      const texto = String(this.busqueda || '').trim().toLowerCase()
      return this.usuarios.filter(usuario => {
        const coincideTexto = !texto ||
          usuario.nombre.toLowerCase().includes(texto) ||
          usuario.usuario.toLowerCase().includes(texto) ||
          (usuario.email || '').toLowerCase().includes(texto)

        const coincideRol = !this.filtroRol || usuario.role === this.filtroRol
        return coincideTexto && coincideRol
      })
    },
    adminCount() {
      return this.usuarios.filter(usuario => usuario.role === 'admin').length
    },
    clienteCount() {
      return this.usuarios.filter(usuario => usuario.role === 'cliente').length
    },
    usuariosActivos() {
      return this.usuarios.filter(usuario => usuario.activo).length
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
    createEmptyUser,
    async cargarDatos() {
      await cargarUsuariosIniciales()
      this.usuarios = obtenerUsuarios()
    },
    initModals() {
      this.formModal = Modal.getOrCreateInstance(this.$refs.formModalEl, { backdrop: 'static', keyboard: true })
      this.deleteModal = Modal.getOrCreateInstance(this.$refs.deleteModalEl, { backdrop: 'static', keyboard: true })

      this.attachHiddenHandler(this.$refs.formModalEl, this.resetForm)
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
      this.deleteModal?.dispose?.()
    },
    resetForm() {
      this.formulario = createEmptyUser()
      this.modoEdicion = false
      this.errorFormulario = ''
      this.guardando = false
    },
    resetDelete() {
      this.usuarioAEliminar = null
    },
    abrirModalCrear() {
      this.resetForm()
      this.formModal?.show()
    },
    abrirModalEditar(usuario) {
      this.errorFormulario = ''
      this.modoEdicion = true
      this.formulario = {
        ...createEmptyUser(),
        ...usuario,
        password: '',
        activo: Boolean(usuario.activo)
      }
      this.formModal?.show()
    },
    validarFormulario() {
      this.fieldErrors = {}
      this.errorFormulario = ''
      if (!this.formulario.nombre?.trim()) this.fieldErrors.nombre = 'El nombre es obligatorio.'
      if (!this.formulario.usuario?.trim()) this.fieldErrors.usuario = 'El usuario es obligatorio.'
      if (!this.formulario.role) this.fieldErrors.role = 'Seleccione un rol.'
      if (this.formulario.email && !/^[^@]+@[^@]+\.[^@]+$/.test(this.formulario.email)) this.fieldErrors.email = 'Correo inválido.'
      const usuarioDuplicado = this.usuarios.find(user => user.usuario.toLowerCase() === String(this.formulario.usuario || '').toLowerCase() && Number(user.id) !== Number(this.formulario.id))
      if (usuarioDuplicado) this.fieldErrors.usuario = 'Ya existe un usuario con ese nombre.'
      if (!this.modoEdicion && String(this.formulario.password || '').trim().length < 4) this.fieldErrors.password = 'Mínimo 4 caracteres.'
      return Object.keys(this.fieldErrors).length === 0
    },
    async guardarUsuario() {
      if (!this.validarFormulario()) return

      this.guardando = true
      try {
        const payload = { ...this.formulario }

        if (this.modoEdicion) {
          await actualizarUsuario(payload)
          this.showAlert('Usuario actualizado correctamente', 'success')
        } else {
          await crearUsuario(payload)
          this.showAlert('Usuario creado correctamente', 'success')
        }

        this.usuarios = obtenerUsuarios()
        this.formModal?.hide()
      } catch (error) {
        this.errorFormulario = error?.message || 'No fue posible guardar el usuario.'
      } finally {
        this.guardando = false
      }
    },
    confirmarEliminar(usuario) {
      this.usuarioAEliminar = { ...usuario }
      this.deleteModal?.show()
    },
    async eliminarUsuarioConfirmado() {
      if (!this.usuarioAEliminar) return

      try {
        await eliminarUsuario(this.usuarioAEliminar.id)
        this.usuarios = obtenerUsuarios()
        this.showAlert('Usuario eliminado correctamente', 'success')
        this.deleteModal?.hide()
      } catch (error) {
        this.showAlert(error?.message || 'No fue posible eliminar el usuario.', 'danger')
      }
    },
    async reiniciarDatos() {
      if (!window.confirm('¿Reiniciar todos los usuarios desde el archivo original?')) return

      const restaurado = reiniciarUsuarios()
      if (!restaurado) {
        await cargarUsuariosIniciales()
      }

      this.usuarios = obtenerUsuarios()
      this.busqueda = ''
      this.filtroRol = ''
      this.showAlert('Usuarios restaurados correctamente', 'success')
    }
  }
}
</script>

<style scoped>
.page-title { font-family: var(--font-d); color: var(--text-primary); font-size: 1.5rem; margin-bottom: 4px; }
.ys-alert { font-size: 0.88rem; }
.usuario-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  color: white;
  flex-shrink: 0;
  background: var(--grad-main);
}
.ys-badge--admin { background: rgba(37,99,235,.2); color: #93c5fd; border-color: rgba(37,99,235,.3); }
.ys-badge--cliente { background: rgba(124,58,237,.2); color: var(--violet-lt); border-color: rgba(124,58,237,.3); }
.ys-table { background: var(--bg-card); border-color: var(--border-color); font-size: 0.83rem; }
.ys-table thead th {
  color: var(--text-secondary);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-color: var(--border-color);
  padding: 12px 10px;
}
.ys-table tbody td { border-color: var(--border-color); padding: 10px; vertical-align: middle; }
.ys-table tbody tr:hover { background: rgba(124,58,237,.06); }
.ys-badge { background: rgba(124,58,237,.2); color: var(--violet-lt); border: 1px solid rgba(124,58,237,.3); font-size: 0.68rem; font-weight: 600; }
.badge-activo { background:rgba(16,185,129,.15); color:#34d399; border:1px solid rgba(16,185,129,.3); padding:3px 9px; border-radius:20px; font-size:0.72rem; font-weight:600; display:inline-flex; align-items:center; }
.badge-inactivo { background:rgba(239,68,68,.15); color:#f87171; border:1px solid rgba(239,68,68,.3); padding:3px 9px; border-radius:20px; font-size:0.72rem; font-weight:600; display:inline-flex; align-items:center; }
.alert-empty {
  text-align: center;
  padding: 3rem 1.5rem;
  color: var(--text-muted);
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--r-md);
}
.mini-stat {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--r-md);
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.mini-stat__val { font-size: 1.4rem; font-weight: 800; }
.mini-stat__lbl { font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: .4px; }
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
.modal-box--sm { max-width: 420px; }
.modal-box__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--border-color);
  color: var(--text-primary);
}
.modal-box__body { padding: 1.25rem; }
.modal-box__footer {
  padding: 1rem 1.25rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: flex-end;
  gap: .5rem;
}
.form-label-ys {
  color: var(--text-secondary);
  font-size: .82rem;
  font-weight: 500;
  margin-bottom: 5px;
}
.btn-secondary {
  background: rgba(99,120,180,.15) !important;
  border: 1px solid var(--border-color) !important;
  color: var(--text-secondary) !important;
}
</style>
