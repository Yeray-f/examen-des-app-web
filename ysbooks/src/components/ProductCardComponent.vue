<template>
  <div class="book-card" @click="$emit('verDetalle', producto)">
    <div class="book-cover">
      <span v-if="producto.badge" class="book-badge">{{ producto.badge }}</span>
      <button class="wish-btn" :class="{ wished: esFavorito }" @click.stop="toggleFav" title="Favorito">
        <i :class="esFavorito ? 'bi bi-heart-fill text-danger' : 'bi bi-heart'"></i>
      </button>

      <img
        :src="coverSrc"
        :alt="producto.name"
        class="cover-real"
        loading="lazy"
        referrerpolicy="no-referrer"
        @error="onImgError"
      />

      <div class="cover-glow"></div>

      <button class="add-to-cart-btn" @click.stop="$emit('agregar', producto)">
        <i class="bi bi-bag-plus me-1"></i>Agregar al carrito
      </button>
    </div>

    <div class="book-info">
      <p class="book-title">{{ producto.name }}</p>
      <p class="book-author">{{ producto.author }}</p>
      <div class="book-meta">
        <span class="book-price">${{ formatPrecio(producto.price) }}</span>
        <span class="book-rating">
          <span>★</span> {{ producto.rating || '4.2' }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
const PALETA = ['#1e2d47','#2a1a5e','#0f2a50','#1e3a3a','#3a1a1a','#1a3a1a']

export default {
  name: 'ProductCardComponent',
  props: {
    producto: { type: Object, required: true }
  },
  emits: ['verDetalle', 'agregar'],
  data() {
    return {
      esFavorito: false,
      fallbackCover: '/assets/covers/cover-fallback.svg'
    }
  },
  computed: {
    colorFallback() {
      const idx = (this.producto.id || 0) % PALETA.length
      return PALETA[idx]
    },
    coverSrc() {
      return this.producto.image || this.fallbackCover
    }
  },
  methods: {
    toggleFav(e) {
      e.stopPropagation()
      this.esFavorito = !this.esFavorito
    },
    onImgError(e) {
      if (e?.target) {
        e.target.onerror = null
        e.target.src = this.fallbackCover
      }
    },
    formatPrecio(price) {
      return Number(price).toLocaleString('es-CO')
    }
  }
}
</script>

<style scoped>
.book-card {
  flex-shrink: 0;
  width: 100%;
  min-height: 100%;
  background: linear-gradient(180deg, rgba(15, 23, 42, .92), rgba(17, 24, 39, .96));
  border: 1px solid rgba(148, 163, 184, .14);
  border-radius: 22px;
  overflow: hidden;
  cursor: pointer;
  transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease;
  position: relative;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 30px rgba(0, 0, 0, .16);
}

.book-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 18px 38px rgba(124, 58, 237, .18);
  border-color: rgba(124,58,237,.38);
}

.book-cover {
  aspect-ratio: 3 / 4;
  position: relative;
  overflow: hidden;
  background: linear-gradient(160deg, rgba(30,45,71,.95), rgba(34,17,90,.95));
}

.book-cover::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(255,255,255,.06), transparent 42%),
    linear-gradient(135deg, rgba(255,255,255,.09), transparent 35%);
  pointer-events: none;
  z-index: 1;
}

.cover-real {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
}

.cover-glow {
  position: absolute;
  inset: auto 12px 12px 12px;
  height: 56px;
  border-radius: 999px;
  background: radial-gradient(circle, rgba(124,58,237,.25), transparent 70%);
  filter: blur(10px);
  pointer-events: none;
  z-index: 1;
}

.book-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(124,58,237,.95);
  color: white;
  font-size: 8.5px;
  font-weight: 800;
  padding: 4px 9px;
  border-radius: 999px;
  text-transform: uppercase;
  letter-spacing: .05em;
  z-index: 3;
}

.wish-btn {
  position: absolute;
  top: 9px;
  right: 9px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: rgba(10, 12, 24, .58);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  z-index: 3;
  transition: transform .2s, background .2s;
  cursor: pointer;
  border: 1px solid rgba(255,255,255,.08);
  color: white;
}

.wish-btn:hover { transform: scale(1.08); }
.wish-btn.wished { background: rgba(239,68,68,.35); }

.add-to-cart-btn {
  position: absolute;
  left: 12px;
  right: 12px;
  bottom: 12px;
  background: linear-gradient(135deg, #7c3aed, #2563eb);
  color: white;
  padding: 10px 12px;
  font-size: 11px;
  font-weight: 700;
  text-align: center;
  border-radius: 14px;
  border: none;
  cursor: pointer;
  width: auto;
  font-family: inherit;
  z-index: 3;
  opacity: 0;
  transform: translateY(10px);
  transition: opacity .22s ease, transform .22s ease, background .22s ease;
  box-shadow: 0 10px 25px rgba(37,99,235,.25);
}

.book-card:hover .add-to-cart-btn {
  opacity: 1;
  transform: translateY(0);
}

.book-info {
  padding: 14px 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.book-title {
  font-weight: 700;
  font-size: 13px;
  line-height: 1.35;
  margin: 0;
  color: var(--text-primary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.book-author {
  font-size: 11px;
  color: var(--text-secondary);
  margin: 0;
}

.book-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: 4px;
}

.book-price {
  font-size: 12px;
  font-weight: 800;
  color: #c4b5fd;
}

.book-rating {
  font-size: 10px;
  color: var(--text-muted);
  display: inline-flex;
  align-items: center;
  gap: 3px;
}
.book-rating span { color: var(--accent); }
</style>
