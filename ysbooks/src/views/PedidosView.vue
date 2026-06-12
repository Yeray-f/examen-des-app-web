<template>
  <div class="pedidos-wrap">
    <div class="section-header mb-4">
      <div>
        <h2 class="section-title"><i class="bi bi-receipt-cutoff me-2"></i>{{ titulo }}</h2>
        <p class="text-secondary mb-0" style="font-size:12px;">{{ subtitulo }}</p>
      </div>
      <div class="d-flex align-items-center gap-2 flex-wrap justify-content-end">
        <span class="ys-badge">{{ resumen.total }} pedidos</span>
        <span v-if="esAdmin" class="ys-badge">{{ resumen.pendientes }} pendientes</span>
        <button type="button" class="btn btn-sm btn-outline-light" @click="recargar">Actualizar</button>
      </div>
    </div>

    <div class="row g-3 mb-4">
      <div class="col-6 col-xl-3">
        <div class="stat-card stat-card--orders">
          <p class="stat-card__label">Pedidos</p>
          <h4 class="stat-card__value">{{ resumen.total }}</h4>
          <span class="stat-card__hint">Registrados</span>
        </div>
      </div>
      <div class="col-6 col-xl-3">
        <div class="stat-card stat-card--orders">
          <p class="stat-card__label">Pendientes</p>
          <h4 class="stat-card__value">{{ resumen.pendientes }}</h4>
          <span class="stat-card__hint">Por validar</span>
        </div>
      </div>
      <div class="col-6 col-xl-3">
        <div class="stat-card stat-card--orders">
          <p class="stat-card__label">Aprobados</p>
          <h4 class="stat-card__value">{{ resumen.aprobados }}</h4>
          <span class="stat-card__hint">En proceso</span>
        </div>
      </div>
      <div class="col-6 col-xl-3">
        <div class="stat-card stat-card--orders">
          <p class="stat-card__label">Ventas</p>
          <h4 class="stat-card__value">${{ formatPrecio(resumen.totalVentas) }}</h4>
          <span class="stat-card__hint">Acumuladas</span>
        </div>
      </div>
    </div>

    <div class="filtros-bar mb-4">
      <div class="search-box flex-grow-1">
        <i class="bi bi-search"></i>
        <input v-model="busqueda" type="text" :placeholder="esAdmin ? 'Buscar pedido o cliente...' : 'Buscar en mis pedidos...'" />
      </div>
      <div class="chips-row">
        <button class="chip" :class="{ 'chip--active': filtroEstado === '' }" @click="filtroEstado = ''">Todos</button>
        <button v-for="estado in estadosDisponibles" :key="estado.value" class="chip" :class="{ 'chip--active': filtroEstado === estado.value }" @click="filtroEstado = estado.value">
          {{ estado.label }}
        </button>
      </div>
    </div>

    <div v-if="mensaje" class="alert alert-success border-0 shadow-sm mb-4">
      <i class="bi bi-check-circle-fill me-2"></i>{{ mensaje }}
    </div>

    <div v-if="pedidosFiltrados.length" class="orders-grid">
      <article v-for="pedido in pedidosFiltrados" :key="pedido.id" class="order-card">
        <div class="order-card__head">
          <div>
            <p class="order-code mb-1">Pedido #{{ pedido.id }}</p>
            <p class="order-client mb-0">
              {{ pedido.usuarioNombre }}
              <span v-if="esAdmin && pedido.usuario" class="order-user">· @{{ pedido.usuario }}</span>
            </p>
          </div>
          <span class="order-status" :class="'order-status--' + pedido.estado">{{ etiquetaEstadoPedido(pedido.estado) }}</span>
        </div>

        <div class="order-brief">
          <span><i class="bi bi-calendar-event me-1"></i>{{ formatFecha(pedido.createdAt) }}</span>
          <span><i class="bi bi-credit-card me-1"></i>{{ pedido.metodoPago }}</span>
        </div>

        <div class="order-items">
          <div v-for="item in pedido.items.slice(0, 3)" :key="item.id + '-' + pedido.id" class="order-item-row">
            <img :src="$resolveCover(item.image, { title: item.name, id: item.id })" :alt="item.name" @error="e => { e.target.onerror = null; e.target.src = $resolveCover(null, { title: item.name, id: item.id }) }" />
            <div class="order-item-info">
              <p class="order-item-name">{{ item.name }}</p>
              <p class="order-item-author">{{ item.author }}</p>
            </div>
            <div class="order-item-price">
              <span>x{{ item.cantidad }}</span>
              <strong>${{ formatPrecio((item.precioOferta ?? item.price) * item.cantidad) }}</strong>
            </div>
          </div>
          <p v-if="pedido.items.length > 3" class="order-more">+{{ pedido.items.length - 3 }} libros más</p>
        </div>

        <div class="order-summary">
          <div>
            <span>Subtotal</span>
            <strong>${{ formatPrecio(pedido.subtotal) }}</strong>
          </div>
          <div v-if="pedido.descuento > 0">
            <span>Descuento</span>
            <strong>-${{ formatPrecio(pedido.descuento) }}</strong>
          </div>
          <div class="order-total-row">
            <span>Total</span>
            <strong>${{ formatPrecio(pedido.total) }}</strong>
          </div>
        </div>

        <div class="order-footer">
          <div class="order-notes">
            <span v-if="pedido.notas">{{ pedido.notas }}</span>
            <span v-else-if="pedido.observacion">{{ pedido.observacion }}</span>
            <span v-else>Pedido generado desde el carrito</span>
          </div>

          <div v-if="esAdmin" class="order-actions">
            <button v-if="pedido.estado === ESTADOS_PENDIENTE" type="button" class="btn-action btn-action--info" title="Aprobar" @click="cambiarEstado(pedido.id, ESTADOS_APROBADO)"><i class="bi bi-check2"></i></button>
            <button v-if="pedido.estado === ESTADOS_PENDIENTE" type="button" class="btn-action btn-action--delete" title="Rechazar" @click="cambiarEstado(pedido.id, ESTADOS_RECHAZADO)"><i class="bi bi-x-lg"></i></button>
            <button v-if="pedido.estado === ESTADOS_APROBADO" type="button" class="btn-action btn-action--edit" title="Preparar" @click="cambiarEstado(pedido.id, ESTADOS_PREPARANDO)"><i class="bi bi-box-seam"></i></button>
            <button v-if="pedido.estado === ESTADOS_PREPARANDO" type="button" class="btn-action btn-action--info" title="Entregar" @click="cambiarEstado(pedido.id, ESTADOS_ENTREGADO)"><i class="bi bi-truck"></i></button>
          </div>
        </div>
      </article>
    </div>

    <div v-else class="empty-state">
      <i class="bi bi-inboxes fs-1 mb-2 d-block" style="color:var(--text-muted)"></i>
      <p>{{ esAdmin ? 'No hay pedidos para mostrar.' : 'Aún no has realizado compras.' }}</p>
      <router-link v-if="!esAdmin" to="/dashboard/catalogo" class="btn btn-primary btn-sm mt-2">Ir al catálogo</router-link>
    </div>
  </div>
</template>

<script>
import { obtenerRolActual, obtenerUsuarioActual } from '../services/authService.js'
import {
  ESTADOS_PEDIDO,
  actualizarEstadoPedido,
  claseEstadoPedido,
  cargarPedidosIniciales,
  etiquetaEstadoPedido,
  obtenerPedidos,
  obtenerPedidosPorUsuario,
  resumenPedidos
} from '../services/orderService.js'

export default {
  name: 'PedidosView',
  data() {
    return {
      busqueda: '',
      filtroEstado: '',
      pedidos: [],
      mensaje: '',
      _timer: null,
      ESTADOS_PENDIENTE: ESTADOS_PEDIDO.PENDIENTE,
      ESTADOS_APROBADO: ESTADOS_PEDIDO.APROBADO,
      ESTADOS_RECHAZADO: ESTADOS_PEDIDO.RECHAZADO,
      ESTADOS_PREPARANDO: ESTADOS_PEDIDO.PREPARANDO,
      ESTADOS_ENTREGADO: ESTADOS_PEDIDO.ENTREGADO
    }
  },
  computed: {
    esAdmin() {
      return obtenerRolActual() === 'admin'
    },
    usuarioActual() {
      return obtenerUsuarioActual()
    },
    titulo() {
      return this.esAdmin ? 'Gestión de pedidos' : 'Mis pedidos'
    },
    subtitulo() {
      return this.esAdmin
        ? 'Valida, aprueba, rechaza y hace seguimiento a los pedidos recibidos.'
        : 'Revisa el estado de tus compras y el detalle de cada pedido.'
    },
    pedidosVisibles() {
      return this.esAdmin ? this.pedidos : obtenerPedidosPorUsuario(this.usuarioActual)
    },
    resumen() {
      const pedidos = this.pedidosVisibles
      return {
        total: pedidos.length,
        pendientes: pedidos.filter(p => p.estado === ESTADOS_PEDIDO.PENDIENTE).length,
        aprobados: pedidos.filter(p => [ESTADOS_PEDIDO.APROBADO, ESTADOS_PEDIDO.PREPARANDO, ESTADOS_PEDIDO.ENTREGADO].includes(p.estado)).length,
        rechazados: pedidos.filter(p => p.estado === ESTADOS_PEDIDO.RECHAZADO).length,
        totalVentas: pedidos.reduce((sum, pedido) => sum + Number(pedido.total || 0), 0)
      }
    },
    estadosDisponibles() {
      return [
        { value: ESTADOS_PEDIDO.PENDIENTE, label: 'Pendientes' },
        { value: ESTADOS_PEDIDO.APROBADO, label: 'Aprobados' },
        { value: ESTADOS_PEDIDO.PREPARANDO, label: 'Preparando' },
        { value: ESTADOS_PEDIDO.ENTREGADO, label: 'Entregados' },
        { value: ESTADOS_PEDIDO.RECHAZADO, label: 'Rechazados' }
      ]
    },
    pedidosFiltrados() {
      const q = this.busqueda.trim().toLowerCase()
      let lista = this.pedidosVisibles.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      if (this.filtroEstado) {
        lista = lista.filter(pedido => pedido.estado === this.filtroEstado)
      }
      if (q) {
        lista = lista.filter(pedido => {
          const texto = [pedido.usuarioNombre, pedido.usuario, pedido.id, pedido.metodoPago, pedido.observacion, pedido.notas]
            .join(' ')
            .toLowerCase()
          return texto.includes(q)
        })
      }
      return lista
    }
  },
  async created() {
    await this.cargarDatos()
  },
  mounted() {
    window.addEventListener('ysbooks-orders-updated', this.cargarDatos)
  },
  beforeUnmount() {
    window.removeEventListener('ysbooks-orders-updated', this.cargarDatos)
    clearTimeout(this._timer)
  },
  methods: {
    etiquetaEstadoPedido,
    claseEstadoPedido,
    formatPrecio(value) {
      return Number(value || 0).toLocaleString('es-CO')
    },
    formatFecha(value) {
      if (!value) return 'Sin fecha'
      try {
        return new Intl.DateTimeFormat('es-CO', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }).format(new Date(value))
      } catch {
        return value
      }
    },
    onImgError(e) {
      if (e?.target) {
        e.target.onerror = null
        e.target.src = this.$resolveCover(null, { title: 'Libro', id: 0 })
      }
    },
    async cargarDatos() {
      await cargarPedidosIniciales()
      this.pedidos = this.esAdmin ? obtenerPedidos() : obtenerPedidosPorUsuario(this.usuarioActual)
    },
    recargar() {
      this.cargarDatos()
      this.mensaje = 'Pedidos sincronizados correctamente.'
      clearTimeout(this._timer)
      this._timer = setTimeout(() => {
        this.mensaje = ''
      }, 2400)
    },
    cambiarEstado(id, estado) {
      const pedido = actualizarEstadoPedido(id, estado, `Estado actualizado a ${etiquetaEstadoPedido(estado).toLowerCase()}`)
      if (!pedido) return
      this.mensaje = `Pedido #${pedido.id} marcado como ${etiquetaEstadoPedido(estado).toLowerCase()}.`
      this.pedidos = this.esAdmin ? obtenerPedidos() : obtenerPedidosPorUsuario(this.usuarioActual)
      clearTimeout(this._timer)
      this._timer = setTimeout(() => {
        this.mensaje = ''
      }, 2400)
    }
  }
}
</script>

<style scoped>
.pedidos-wrap { display: flex; flex-direction: column; gap: 0; }
.section-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
.section-title { font-family: var(--font-d); font-size: 1.3rem; font-weight: 700; color: var(--text-primary); margin: 0; }
.stat-card--orders { min-height: 100%; }
.stat-card__hint { font-size: 10px; color: var(--text-muted); text-transform: uppercase; letter-spacing: .4px; }
.filtros-bar { display: flex; flex-direction: column; gap: 10px; }
.search-box { display: flex; align-items: center; gap: 10px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 30px; padding: 9px 16px; transition: border-color .2s; }
.search-box:focus-within { border-color: var(--violet); box-shadow: 0 0 0 3px rgba(124,58,237,.15); }
.search-box i { color: var(--text-muted); }
.search-box input { background: none; border: none; outline: none; color: var(--text-primary); font-size: 13px; width: 100%; font-family: inherit; }
.search-box input::placeholder { color: var(--text-muted); }
.chips-row { display: flex; gap: 6px; flex-wrap: wrap; }
.chip { padding: 4px 14px; border-radius: 20px; font-size: 11px; font-weight: 600; background: var(--bg-card); border: 1px solid var(--border-color); color: var(--text-secondary); cursor: pointer; transition: all .2s; font-family: inherit; }
.chip:hover, .chip--active { background: rgba(124,58,237,.15); border-color: var(--violet); color: var(--violet-lt); }
.orders-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 14px; }
.order-card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--r-lg); padding: 16px; box-shadow: 0 8px 28px rgba(0,0,0,.16); display: flex; flex-direction: column; gap: 12px; }
.order-card__head { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; }
.order-code { margin: 0; font-size: 13px; font-weight: 800; color: var(--text-primary); }
.order-client { margin: 0; font-size: 11px; color: var(--text-secondary); }
.order-user { color: var(--text-muted); }
.order-status { padding: 4px 10px; border-radius: 999px; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: .4px; }
.order-status--pendiente { background: rgba(245,158,11,.15); color: #fbbf24; }
.order-status--aprobado { background: rgba(37,99,235,.15); color: #93c5fd; }
.order-status--preparando { background: rgba(124,58,237,.15); color: #c4b5fd; }
.order-status--entregado { background: rgba(16,185,129,.15); color: #6ee7b7; }
.order-status--rechazado { background: rgba(239,68,68,.15); color: #fca5a5; }
.order-brief { display: flex; gap: 10px; flex-wrap: wrap; color: var(--text-muted); font-size: 11px; }
.order-brief span { display: inline-flex; align-items: center; }
.order-items { display: flex; flex-direction: column; gap: 8px; }
.order-item-row { display: grid; grid-template-columns: 42px 1fr auto; gap: 10px; align-items: center; background: rgba(255,255,255,.02); border: 1px solid rgba(124,58,237,.08); border-radius: 14px; padding: 8px; }
.order-item-row img { width: 42px; height: 56px; object-fit: cover; border-radius: 10px; }
.order-item-name { margin: 0; font-size: 12px; font-weight: 700; color: var(--text-primary); line-height: 1.3; }
.order-item-author { margin: 2px 0 0; font-size: 11px; color: var(--text-secondary); }
.order-item-price { display: flex; flex-direction: column; align-items: flex-end; gap: 2px; font-size: 10px; color: var(--text-secondary); }
.order-item-price strong { font-size: 12px; color: var(--text-primary); }
.order-more { margin: 0; font-size: 11px; color: var(--text-muted); }
.order-summary { display: grid; gap: 8px; padding-top: 4px; border-top: 1px solid rgba(255,255,255,.05); }
.order-summary div { display: flex; justify-content: space-between; gap: 10px; font-size: 11px; color: var(--text-secondary); }
.order-summary strong { color: var(--text-primary); }
.order-total-row { padding-top: 8px; margin-top: 2px; border-top: 1px dashed rgba(255,255,255,.08); }
.order-total-row span, .order-total-row strong { font-size: 12px; font-weight: 800; color: var(--text-primary); }
.order-footer { display: flex; align-items: flex-end; justify-content: space-between; gap: 10px; flex-wrap: wrap; }
.order-notes { flex: 1; min-width: 180px; font-size: 11px; color: var(--text-secondary); line-height: 1.45; }
.order-actions { display: flex; gap: 8px; flex-shrink: 0; }
.empty-state { text-align: center; padding: 60px 20px; color: var(--text-muted); }
</style>
