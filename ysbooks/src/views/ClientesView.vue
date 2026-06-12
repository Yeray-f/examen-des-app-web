<template>
  <div>
    <!-- Encabezado -->
    <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
      <div>
        <h2 class="page-title">
          <i class="bi bi-people-fill me-2"></i>Clientes
        </h2>
        <p class="text-secondary mb-0">Listado de clientes registrados en YS Books.</p>
      </div>
      <div class="d-flex gap-2 flex-wrap">
        <div class="btn-group" role="group">
          <button type="button" :class="['btn btn-sm filter-btn', filtroEstado === 'todos' ? 'filter-btn--active' : '']" @click="filtroEstado = 'todos'">Todos ({{ clientes.length }})</button>
          <button type="button" :class="['btn btn-sm filter-btn', filtroEstado === 'activo' ? 'filter-btn--active' : '']" @click="filtroEstado = 'activo'">Activos ({{ clientesActivos }})</button>
          <button type="button" :class="['btn btn-sm filter-btn', filtroEstado === 'inactivo' ? 'filter-btn--active' : '']" @click="filtroEstado = 'inactivo'">Inactivos ({{ clientesInactivos }})</button>
        </div>
      </div>
    </div>

    <!-- Stats rápidas -->
    <div class="row g-3 mb-4">
      <div class="col-6 col-sm-3">
        <div class="mini-stat">
          <span class="mini-stat__val text-violet">{{ clientes.length }}</span>
          <span class="mini-stat__lbl">Total</span>
        </div>
      </div>
      <div class="col-6 col-sm-3">
        <div class="mini-stat">
          <span class="mini-stat__val text-success">{{ clientesActivos }}</span>
          <span class="mini-stat__lbl">Activos</span>
        </div>
      </div>
      <div class="col-6 col-sm-3">
        <div class="mini-stat">
          <span class="mini-stat__val text-danger">{{ clientesInactivos }}</span>
          <span class="mini-stat__lbl">Inactivos</span>
        </div>
      </div>
      <div class="col-6 col-sm-3">
        <div class="mini-stat">
          <span class="mini-stat__val text-accent">{{ totalLibros }}</span>
          <span class="mini-stat__lbl">Libros vendidos</span>
        </div>
      </div>
    </div>

    <!-- Tabla -->
    <div class="table-responsive rounded">
      <table class="table table-dark table-hover align-middle ys-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Cliente</th>
            <th>Correo</th>
            <th>Ciudad</th>
            <th>Libros</th>
            <th>Estado</th>
            <th class="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(cliente, i) in clientesFiltrados" :key="cliente.id">
            <td class="text-muted">{{ i + 1 }}</td>
            <td>
              <div class="d-flex align-items-center gap-2">
                <div class="cliente-avatar" :style="{ background: avatarColor(cliente.id) }">{{ cliente.nombre.charAt(0) }}</div>
                <span class="fw-500">{{ cliente.nombre }}</span>
              </div>
            </td>
            <td class="text-secondary">
              <div class="d-flex align-items-center gap-1">
                <span>{{ cliente.correo }}</span>
                <a :href="'mailto:' + cliente.correo + '?subject=YS Books - Información'" class="btn-icon-link" title="Enviar correo" @click.stop>
                  <i class="bi bi-envelope-fill"></i>
                </a>
              </div>
            </td>
            <td class="text-secondary"><i class="bi bi-geo-alt me-1 text-muted"></i>{{ cliente.ciudad }}</td>
            <td><span class="libros-badge">{{ cliente.librosComprados }}</span></td>
            <td>
              <span :class="cliente.activo ? 'badge-activo' : 'badge-inactivo'">
                <i :class="cliente.activo ? 'bi bi-circle-fill' : 'bi bi-circle'" class="me-1" style="font-size:0.55rem;"></i>
                {{ cliente.activo ? 'Activo' : 'Inactivo' }}
              </span>
            </td>
            <td class="text-center">
              <div class="d-flex align-items-center justify-content-center gap-2">
                <div class="toggle-wrap" @click="toggleEstado(cliente)" :title="cliente.activo ? 'Desactivar' : 'Activar'">
                  <div :class="['toggle-track', cliente.activo ? 'toggle-track--on' : '']">
                    <div :class="['toggle-thumb', cliente.activo ? 'toggle-thumb--on' : '']"></div>
                  </div>
                </div>
                <button class="btn-icon-notif" @click="enviarNotificacion(cliente)" title="Enviar notificación">
                  <i class="bi bi-bell-fill"></i>
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="clientesFiltrados.length === 0">
            <td colspan="7" class="text-center py-4 text-muted">
              <i class="bi bi-inbox fs-3 d-block mb-2"></i>No hay clientes con ese filtro.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <transition name="toast-fade">
      <div v-if="toast" class="ys-toast">
        <i :class="toastIcon" class="me-2"></i>{{ toast }}
      </div>
    </transition>

    <p class="text-muted mt-3" style="font-size:0.78rem;">
      <i class="bi bi-info-circle me-1"></i>
      Datos de ejemplo. Usa el toggle para activar o desactivar un cliente.
    </p>
  </div>
</template>

<script>
const AVATAR_COLORS = [
  'rgba(124,58,237,.5)','rgba(37,99,235,.5)','rgba(16,185,129,.5)',
  'rgba(245,158,11,.5)','rgba(239,68,68,.5)','rgba(236,72,153,.5)',
  'rgba(14,165,233,.5)','rgba(168,85,247,.5)','rgba(34,197,94,.5)'
]
export default {
  name: 'ClientesView',
  data() {
    return {
      filtroEstado: 'todos',
      toast: '',
      toastIcon: '',
      clientes: [
        { id:1, nombre:'Laura Martínez', correo:'laura@mail.com', ciudad:'Bogotá', librosComprados:8, activo:true },
        { id:2, nombre:'Andrés Ríos', correo:'andres@mail.com', ciudad:'Medellín', librosComprados:3, activo:true },
        { id:3, nombre:'Valentina Cruz', correo:'vale@mail.com', ciudad:'Cali', librosComprados:12, activo:true },
        { id:4, nombre:'Carlos Peña', correo:'carlos@mail.com', ciudad:'Cartagena', librosComprados:1, activo:false },
        { id:5, nombre:'Sofía Vargas', correo:'sofia@mail.com', ciudad:'Barranquilla', librosComprados:6, activo:true },
        { id:6, nombre:'Mateo López', correo:'mateo@mail.com', ciudad:'Bucaramanga', librosComprados:4, activo:true },
        { id:7, nombre:'Isabella Moreno', correo:'isa@mail.com', ciudad:'Pereira', librosComprados:9, activo:false },
        { id:8, nombre:'Sebastián Gómez', correo:'sebas@mail.com', ciudad:'Manizales', librosComprados:2, activo:true },
        { id:9, nombre:'Camila Torres', correo:'camila@mail.com', ciudad:'Santa Marta', librosComprados:15, activo:true },
      ]
    }
  },
  computed: {
    clientesActivos() { return this.clientes.filter(c => c.activo).length },
    clientesInactivos() { return this.clientes.filter(c => !c.activo).length },
    totalLibros() { return this.clientes.reduce((s,c) => s + c.librosComprados, 0) },
    clientesFiltrados() {
      if (this.filtroEstado === 'activo') return this.clientes.filter(c => c.activo)
      if (this.filtroEstado === 'inactivo') return this.clientes.filter(c => !c.activo)
      return this.clientes
    }
  },
  methods: {
    toggleEstado(cliente) {
      cliente.activo = !cliente.activo
      const nombre = cliente.nombre.split(' ')[0]
      this.toast = cliente.activo ? `${nombre} activado correctamente` : `${nombre} desactivado`
      this.toastIcon = cliente.activo ? 'bi bi-check-circle-fill text-success' : 'bi bi-x-circle-fill text-danger'
      clearTimeout(this._toastTimer)
      this._toastTimer = setTimeout(() => { this.toast = '' }, 2500)
    },
    enviarNotificacion(cliente) {
      const nombre = cliente.nombre.split(' ')[0]
      // Usar la API de Notificaciones del navegador si está disponible
      if ('Notification' in window) {
        if (Notification.permission === 'granted') {
          new Notification('YS Books', {
            body: `Notificación enviada a ${cliente.nombre} (${cliente.correo})`,
            icon: '/favicon.ico'
          })
          this.toast = `Notificación enviada a ${nombre}`
          this.toastIcon = 'bi bi-bell-fill text-warning'
        } else if (Notification.permission !== 'denied') {
          Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
              new Notification('YS Books', {
                body: `Notificación enviada a ${cliente.nombre} (${cliente.correo})`,
                icon: '/favicon.ico'
              })
              this.toast = `Notificación enviada a ${nombre}`
              this.toastIcon = 'bi bi-bell-fill text-warning'
            } else {
              this.toast = `Permiso denegado para notificaciones`
              this.toastIcon = 'bi bi-bell-slash-fill text-danger'
            }
          })
        } else {
          this.toast = `Notificación simulada para ${nombre}`
          this.toastIcon = 'bi bi-bell-fill text-warning'
        }
      } else {
        this.toast = `Notificación enviada a ${nombre}`
        this.toastIcon = 'bi bi-bell-fill text-warning'
      }
      clearTimeout(this._toastTimer)
      this._toastTimer = setTimeout(() => { this.toast = '' }, 2500)
    },
    avatarColor(id) { return AVATAR_COLORS[(id-1) % AVATAR_COLORS.length] }
  }
}
</script>

<style scoped>
.page-title { font-family:var(--font-d); color:var(--text-primary); font-size:1.5rem; margin-bottom:4px; }
.mini-stat { background:var(--bg-card); border:1px solid var(--border-color); border-radius:var(--r-md); padding:12px 16px; display:flex; flex-direction:column; gap:2px; }
.mini-stat__val { font-size:1.4rem; font-weight:800; }
.mini-stat__lbl { font-size:0.7rem; color:var(--text-muted); text-transform:uppercase; letter-spacing:.4px; }
.text-violet { color:var(--violet-lt) !important; }
.text-accent { color:var(--accent) !important; }
.filter-btn { background:var(--bg-card); border:1px solid var(--border-color); color:var(--text-secondary); font-size:0.75rem; font-weight:600; transition:all .2s; }
.filter-btn:hover { border-color:var(--violet); color:var(--violet-lt); }
.filter-btn--active { background:rgba(124,58,237,.2) !important; border-color:var(--violet) !important; color:var(--violet-lt) !important; }
.ys-table { background:var(--bg-card); border-color:var(--border-color); font-size:0.83rem; }
.ys-table thead th { color:var(--text-secondary); font-size:0.75rem; text-transform:uppercase; letter-spacing:0.5px; border-color:var(--border-color); padding:12px 10px; }
.ys-table tbody td { border-color:var(--border-color); padding:10px; }
.ys-table tbody tr:hover { background:rgba(124,58,237,.06); }
.fw-500 { font-weight:500; }
.cliente-avatar { width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:700; color:white; flex-shrink:0; }
.libros-badge { background:rgba(124,58,237,.15); color:var(--violet-lt); border:1px solid rgba(124,58,237,.25); padding:2px 8px; border-radius:20px; font-size:0.75rem; font-weight:700; }
.badge-activo { background:rgba(16,185,129,.15); color:#34d399; border:1px solid rgba(16,185,129,.3); padding:3px 9px; border-radius:20px; font-size:0.72rem; font-weight:600; display:inline-flex; align-items:center; }
.badge-inactivo { background:rgba(239,68,68,.15); color:#f87171; border:1px solid rgba(239,68,68,.3); padding:3px 9px; border-radius:20px; font-size:0.72rem; font-weight:600; display:inline-flex; align-items:center; }
.toggle-wrap { cursor:pointer; display:inline-flex; align-items:center; justify-content:center; }
.btn-icon-link { background:rgba(37,99,235,.15); border:1px solid rgba(37,99,235,.3); color:#60a5fa; width:24px; height:24px; border-radius:6px; display:inline-flex; align-items:center; justify-content:center; font-size:0.7rem; text-decoration:none; transition:all .2s; flex-shrink:0; }
.btn-icon-link:hover { background:rgba(37,99,235,.35); color:white; }
.btn-icon-notif { background:rgba(245,158,11,.15); border:1px solid rgba(245,158,11,.3); color:#fbbf24; width:28px; height:28px; border-radius:6px; display:inline-flex; align-items:center; justify-content:center; font-size:0.75rem; cursor:pointer; transition:all .2s; }
.btn-icon-notif:hover { background:rgba(245,158,11,.35); color:white; }
.toggle-track { width:40px; height:22px; border-radius:11px; background:rgba(239,68,68,.25); border:1px solid rgba(239,68,68,.4); position:relative; transition:all .25s; }
.toggle-track--on { background:rgba(16,185,129,.25); border-color:rgba(16,185,129,.5); }
.toggle-thumb { position:absolute; top:3px; left:3px; width:14px; height:14px; border-radius:50%; background:#f87171; transition:all .25s cubic-bezier(.34,1.56,.64,1); }
.toggle-thumb--on { transform:translateX(18px); background:#34d399; }
.ys-toast { position:fixed; bottom:24px; left:50%; transform:translateX(-50%); background:var(--bg-elevated); border:1px solid var(--border-color); color:var(--text-primary); padding:10px 22px; border-radius:30px; font-size:13px; font-weight:500; box-shadow:0 4px 24px rgba(0,0,0,.4); z-index:9999; white-space:nowrap; display:flex; align-items:center; }
.toast-fade-enter-active,.toast-fade-leave-active { transition:opacity .3s,transform .3s; }
.toast-fade-enter-from,.toast-fade-leave-to { opacity:0; transform:translateX(-50%) translateY(10px); }
</style>
