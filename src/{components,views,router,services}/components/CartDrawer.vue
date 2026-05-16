<template>
  <!-- CartDrawer: panel lateral deslizante del carrito de compras -->
  <transition name="drawer">
    <div v-if="cart.isOpen" class="cart-overlay" @click.self="cart.cerrarCarrito()">
      <div class="cart-drawer">
        <!-- Header -->
        <div class="cart-header">
          <div class="cart-header-left">
            <i class="bi bi-bag-fill cart-icon"></i>
            <div>
              <h3>Mi Carrito</h3>
              <span class="cart-count-badge">{{ cart.totalItems }} {{ cart.totalItems === 1 ? 'libro' : 'libros' }}</span>
            </div>
          </div>
          <button class="cart-close-btn" @click="cart.cerrarCarrito()">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <!-- Vacío -->
        <div v-if="cart.items.length === 0" class="cart-empty">
          <div class="cart-empty-icon">
            <i class="bi bi-bag-x"></i>
          </div>
          <h4>Tu carrito está vacío</h4>
          <p>Agrega algunos libros para comenzar tu pedido</p>
          <button class="btn-explorar" @click="irACatalogo">
            <i class="bi bi-grid-fill me-2"></i>Explorar libros
          </button>
        </div>

        <!-- Lista de items -->
        <div v-else class="cart-items">
          <transition-group name="item-list" tag="div">
            <div v-for="item in cart.items" :key="item.id" class="cart-item">
              <div class="item-cover">
                <img v-if="item.image" :src="item.image" :alt="item.name" @error="e => e.target.style.display='none'" />
                <div class="item-cover-fb" :style="{ background: colorOf(item.id) }">
                  <i class="bi bi-book-fill text-white"></i>
                </div>
              </div>
              <div class="item-details">
                <p class="item-name">{{ item.name }}</p>
                <p class="item-author">{{ item.author }}</p>
                <div class="item-price-row">
                  <span class="item-price">${{ formatPrecio(item.precioOferta || item.price) }}</span>
                  <span v-if="item.precioOferta" class="item-old-price">${{ formatPrecio(item.price) }}</span>
                </div>
              </div>
              <div class="item-controls">
                <div class="qty-control">
                  <button class="qty-btn" @click="cart.quitar(item.id)">
                    <i class="bi bi-dash"></i>
                  </button>
                  <span class="qty-num">{{ item.cantidad }}</span>
                  <button class="qty-btn" @click="cart.agregar(item)">
                    <i class="bi bi-plus"></i>
                  </button>
                </div>
                <button class="item-remove-btn" @click="cart.eliminar(item.id)" title="Eliminar">
                  <i class="bi bi-trash3"></i>
                </button>
              </div>
            </div>
          </transition-group>
        </div>

        <!-- Footer con totales -->
        <div v-if="cart.items.length > 0" class="cart-footer">
          <!-- Resumen de precios -->
          <div class="cart-summary">
            <div class="summary-row">
              <span>Subtotal ({{ cart.totalItems }} libros)</span>
              <span>${{ formatPrecio(cart.subtotal) }}</span>
            </div>
            <div v-if="cart.totalDescuento > 0" class="summary-row summary-discount">
              <span><i class="bi bi-tag-fill me-1"></i>Descuentos</span>
              <span>-${{ formatPrecio(cart.totalDescuento) }}</span>
            </div>
            <div class="summary-row summary-shipping">
              <span><i class="bi bi-truck me-1"></i>Envío</span>
              <span class="text-success">Gratis</span>
            </div>
            <div class="summary-divider"></div>
            <div class="summary-row summary-total">
              <span>Total</span>
              <span class="total-amount">${{ formatPrecio(cart.total) }}</span>
            </div>
          </div>

          <!-- Ahorro badge -->
          <div v-if="cart.totalDescuento > 0" class="ahorro-pill">
            <i class="bi bi-lightning-fill me-1"></i>
            ¡Ahorras ${{ formatPrecio(cart.totalDescuento) }} en esta compra!
          </div>

          <!-- Botones de acción -->
          <div class="cart-actions">
            <button class="btn-checkout" @click="realizarPedido">
              <i class="bi bi-credit-card-fill me-2"></i>
              Finalizar compra
            </button>
            <button class="btn-vaciar" @click="confirmarVaciar">
              <i class="bi bi-trash3 me-1"></i>Vaciar carrito
            </button>
          </div>
        </div>

        <!-- Modal confirmación vaciar -->
        <div v-if="showConfirmVaciar" class="confirm-overlay" @click.self="showConfirmVaciar = false">
          <div class="confirm-modal">
            <i class="bi bi-exclamation-circle confirm-icon"></i>
            <h4>¿Vaciar carrito?</h4>
            <p>Esto eliminará todos los libros del carrito.</p>
            <div class="confirm-btns">
              <button class="confirm-yes" @click="vaciarCarrito">Sí, vaciar</button>
              <button class="confirm-no" @click="showConfirmVaciar = false">Cancelar</button>
            </div>
          </div>
        </div>

        <!-- Toast de checkout -->
        <div v-if="toastMsg" class="cart-toast">
          <i class="bi bi-check-circle-fill me-2 text-success"></i>
          {{ toastMsg }}
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { cartStore } from '../services/cartService.js'

const PALETA = ['#1e2d47','#2a1a5e','#0f2a50','#1e3a3a','#3a1a1a','#1a3a1a']

export default {
  name: 'CartDrawer',
  data() {
    return {
      cart: cartStore,
      showConfirmVaciar: false,
      toastMsg: ''
    }
  },
  methods: {
    formatPrecio(price) {
      return Number(price).toLocaleString('es-CO')
    },
    colorOf(id) {
      return PALETA[(id || 0) % PALETA.length]
    },
    irACatalogo() {
      this.cart.cerrarCarrito()
      this.$router.push('/dashboard/catalogo')
    },
    confirmarVaciar() {
      this.showConfirmVaciar = true
    },
    vaciarCarrito() {
      this.cart.vaciar()
      this.showConfirmVaciar = false
    },
    realizarPedido() {
      const total = this.formatPrecio(this.cart.total)
      const items = this.cart.totalItems
      this.cart.vaciar()
      this.toastMsg = `¡Pedido realizado! ${items} libro${items > 1 ? 's' : ''} — $${total}`
      setTimeout(() => {
        this.toastMsg = ''
        this.cart.cerrarCarrito()
      }, 3000)
    }
  }
}
</script>

<style scoped>
/* ─── Overlay ─── */
.cart-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  justify-content: flex-end;
}

/* ─── Drawer ─── */
.cart-drawer {
  width: 420px;
  max-width: 95vw;
  height: 100%;
  background: var(--bg-dark);
  border-left: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

/* ─── Transitions ─── */
.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.25s ease;
}
.drawer-enter-active .cart-drawer,
.drawer-leave-active .cart-drawer {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}
.drawer-enter-from .cart-drawer,
.drawer-leave-to .cart-drawer {
  transform: translateX(100%);
}

.item-list-enter-active,
.item-list-leave-active {
  transition: all 0.3s ease;
}
.item-list-enter-from,
.item-list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
.item-list-leave-active {
  position: absolute;
  width: 100%;
}

/* ─── Header ─── */
.cart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 20px 16px;
  border-bottom: 1px solid var(--border-color);
  background: linear-gradient(160deg, #1e2d47 0%, #131d30 100%);
  flex-shrink: 0;
}

.cart-header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.cart-icon {
  font-size: 1.4rem;
  color: var(--violet-lt);
  background: rgba(124,58,237,.2);
  width: 44px;
  height: 44px;
  border-radius: var(--r-sm);
  display: flex;
  align-items: center;
  justify-content: center;
}

.cart-header h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
  font-family: var(--font-d);
}

.cart-count-badge {
  font-size: 11px;
  color: var(--text-secondary);
}

.cart-close-btn {
  width: 36px;
  height: 36px;
  border-radius: var(--r-sm);
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
}
.cart-close-btn:hover { border-color: var(--danger); color: var(--danger); }

/* ─── Empty state ─── */
.cart-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
  text-align: center;
}

.cart-empty-icon {
  font-size: 3.5rem;
  color: var(--text-muted);
  margin-bottom: 16px;
  opacity: 0.5;
}

.cart-empty h4 {
  color: var(--text-primary);
  font-size: 1rem;
  margin-bottom: 8px;
}

.cart-empty p {
  color: var(--text-secondary);
  font-size: 13px;
  margin-bottom: 24px;
}

.btn-explorar {
  background: var(--grad-main);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: var(--r-sm);
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  font-family: inherit;
  transition: opacity 0.2s;
}
.btn-explorar:hover { opacity: 0.9; }

/* ─── Items list ─── */
.cart-items {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: relative;
}

.cart-items::-webkit-scrollbar { width: 4px; }
.cart-items::-webkit-scrollbar-track { background: transparent; }
.cart-items::-webkit-scrollbar-thumb { background: var(--violet); border-radius: 9px; }

.cart-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--r-md);
  padding: 12px;
  transition: border-color 0.2s;
}

.cart-item:hover { border-color: rgba(124,58,237,.3); }

/* Cover */
.item-cover {
  width: 56px;
  height: 72px;
  border-radius: var(--r-sm);
  overflow: hidden;
  flex-shrink: 0;
  position: relative;
  background: var(--bg-elevated);
}

.item-cover img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-cover-fb {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

/* Details */
.item-details {
  flex: 1;
  min-width: 0;
}

.item-name {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 3px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
}

.item-author {
  font-size: 11px;
  color: var(--text-secondary);
  margin-bottom: 6px;
}

.item-price-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.item-price {
  font-size: 13px;
  font-weight: 700;
  color: var(--violet-lt);
}

.item-old-price {
  font-size: 10px;
  color: var(--text-muted);
  text-decoration: line-through;
}

/* Controls */
.item-controls {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  flex-shrink: 0;
}

.qty-control {
  display: flex;
  align-items: center;
  gap: 4px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: var(--r-sm);
  padding: 2px;
}

.qty-btn {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 11px;
  transition: all 0.2s;
}

.qty-btn:hover {
  background: rgba(124,58,237,.2);
  color: var(--violet-lt);
}

.qty-num {
  min-width: 20px;
  text-align: center;
  font-size: 12px;
  font-weight: 700;
  color: var(--text-primary);
}

.item-remove-btn {
  width: 26px;
  height: 26px;
  border-radius: var(--r-sm);
  background: rgba(239,68,68,.1);
  border: 1px solid rgba(239,68,68,.2);
  color: #f87171;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 11px;
  transition: all 0.2s;
}

.item-remove-btn:hover {
  background: rgba(239,68,68,.3);
  border-color: rgba(239,68,68,.5);
}

/* ─── Footer ─── */
.cart-footer {
  border-top: 1px solid var(--border-color);
  padding: 16px 20px 20px;
  background: linear-gradient(0deg, var(--bg-dark) 0%, transparent 100%);
  flex-shrink: 0;
}

.cart-summary {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: var(--text-secondary);
}

.summary-discount { color: #4ade80; }
.summary-shipping .text-success { color: #4ade80; font-size: 12px; }

.summary-divider {
  height: 1px;
  background: var(--border-color);
  margin: 4px 0;
}

.summary-total {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-primary);
}

.total-amount {
  font-size: 18px;
  font-weight: 800;
  color: var(--violet-lt);
}

.ahorro-pill {
  background: rgba(16,185,129,.12);
  border: 1px solid rgba(16,185,129,.25);
  color: #4ade80;
  font-size: 11px;
  font-weight: 600;
  padding: 7px 12px;
  border-radius: var(--r-sm);
  text-align: center;
  margin-bottom: 12px;
}

.cart-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.btn-checkout {
  background: var(--grad-main);
  color: white;
  border: none;
  padding: 12px;
  border-radius: var(--r-sm);
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  font-family: inherit;
  transition: opacity 0.2s, transform 0.2s;
  box-shadow: 0 4px 15px rgba(124,58,237,.4);
}
.btn-checkout:hover { opacity: 0.9; transform: translateY(-1px); }

.btn-vaciar {
  background: transparent;
  color: var(--text-muted);
  border: 1px solid var(--border-color);
  padding: 8px;
  border-radius: var(--r-sm);
  font-size: 12px;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s;
  text-align: center;
}
.btn-vaciar:hover { border-color: rgba(239,68,68,.4); color: #f87171; }

/* ─── Confirm modal ─── */
.confirm-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  padding: 20px;
}

.confirm-modal {
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: var(--r-lg);
  padding: 28px 24px;
  text-align: center;
  max-width: 300px;
  width: 100%;
}

.confirm-icon {
  font-size: 2.5rem;
  color: var(--accent);
  display: block;
  margin-bottom: 12px;
}

.confirm-modal h4 {
  color: var(--text-primary);
  margin-bottom: 8px;
  font-size: 1rem;
}

.confirm-modal p {
  color: var(--text-secondary);
  font-size: 12px;
  margin-bottom: 20px;
}

.confirm-btns {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.confirm-yes {
  background: rgba(239,68,68,.2);
  border: 1px solid rgba(239,68,68,.4);
  color: #f87171;
  padding: 8px 20px;
  border-radius: var(--r-sm);
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s;
}
.confirm-yes:hover { background: rgba(239,68,68,.35); }

.confirm-no {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  padding: 8px 20px;
  border-radius: var(--r-sm);
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s;
}
.confirm-no:hover { border-color: var(--violet); color: var(--text-primary); }

/* ─── Toast ─── */
.cart-toast {
  position: absolute;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--bg-elevated);
  border: 1px solid rgba(16,185,129,.3);
  color: var(--text-primary);
  padding: 10px 20px;
  border-radius: 30px;
  font-size: 13px;
  font-weight: 500;
  box-shadow: var(--shadow-md);
  z-index: 20;
  white-space: nowrap;
  display: flex;
  align-items: center;
  animation: toastIn 0.3s ease;
}

@keyframes toastIn {
  from { opacity: 0; transform: translateX(-50%) translateY(10px); }
  to { opacity: 1; transform: translateX(-50%) translateY(0); }
}
</style>