// cartService.js — YS Books
// Servicio global de carrito usando reactive store pattern (sin Vuex/Pinia)
// Compatible con Vue 3 Options API

import { reactive } from 'vue'

export const cartStore = reactive({
  items: JSON.parse(localStorage.getItem('ysbooks_cart') || '[]'),
  isOpen: false,

  get totalItems() {
    return this.items.reduce((sum, item) => sum + item.cantidad, 0)
  },

  get subtotal() {
    return this.items.reduce((sum, item) => sum + item.price * item.cantidad, 0)
  },

  get totalDescuento() {
    return this.items.reduce((sum, item) => {
      const desc = item.precioOferta ? (item.price - item.precioOferta) * item.cantidad : 0
      return sum + desc
    }, 0)
  },

  get total() {
    return this.subtotal - this.totalDescuento
  },

  agregar(producto) {
    const existente = this.items.find(i => i.id === producto.id)
    if (existente) {
      existente.cantidad++
    } else {
      this.items.push({ ...producto, cantidad: 1 })
    }
    this._guardar()
  },

  quitar(id) {
    const idx = this.items.findIndex(i => i.id === id)
    if (idx !== -1) {
      if (this.items[idx].cantidad > 1) {
        this.items[idx].cantidad--
      } else {
        this.items.splice(idx, 1)
      }
      this._guardar()
    }
  },

  eliminar(id) {
    const idx = this.items.findIndex(i => i.id === id)
    if (idx !== -1) {
      this.items.splice(idx, 1)
      this._guardar()
    }
  },

  vaciar() {
    this.items.splice(0, this.items.length)
    this._guardar()
  },

  abrirCarrito() {
    this.isOpen = true
  },

  cerrarCarrito() {
    this.isOpen = false
  },

  _guardar() {
    localStorage.setItem('ysbooks_cart', JSON.stringify(this.items))
  }
})