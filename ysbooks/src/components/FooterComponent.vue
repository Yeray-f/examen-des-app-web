<template>
  <footer class="ys-footer">
    <div class="footer-grid">
      <div class="footer-brand">
        <div class="footer-logo">
          <svg viewBox="0 0 40 40" fill="none" width="28" aria-hidden="true">
            <rect width="40" height="40" rx="10" fill="url(#ftGrad)" />
            <path d="M10 28V14a2 2 0 012-2h6v18H12a2 2 0 01-2-2z" fill="white" opacity=".92" />
            <path d="M20 12h8a2 2 0 012 2v14a2 2 0 01-2 2h-8V12z" fill="white" opacity=".62" />
            <defs>
              <linearGradient id="ftGrad" x1="0" y1="0" x2="40" y2="40">
                <stop stop-color="#7C3AED" />
                <stop offset="1" stop-color="#2563EB" />
              </linearGradient>
            </defs>
          </svg>
          <span>YS <span style="color:var(--violet-lt)">Books</span></span>
        </div>
        <p>Tu universo de libros. Descubre, lee y comparte las mejores historias del mundo literario.</p>
        <div class="social-links">
          <span class="social-link" title="Instagram"><i class="bi bi-instagram"></i></span>
          <span class="social-link" title="Facebook"><i class="bi bi-facebook"></i></span>
          <span class="social-link" title="Twitter/X"><i class="bi bi-twitter-x"></i></span>
          <span class="social-link" title="YouTube"><i class="bi bi-youtube"></i></span>
        </div>
      </div>

      <div class="footer-col">
        <h4>Tienda</h4>
        <router-link to="/dashboard/catalogo">Catálogo</router-link>
        <router-link to="/dashboard/ofertas">Ofertas especiales</router-link>
        <router-link to="/dashboard/productos">Nuevos lanzamientos</router-link>
        <router-link to="/dashboard">Libros populares</router-link>
      </div>

      <div class="footer-col">
        <h4>Cuenta</h4>
        <router-link to="/dashboard/perfil">Mi perfil</router-link>
        <router-link :to="{ path: '/dashboard/perfil', query: { tab: 'pedidos' } }">Mis pedidos</router-link>
        <router-link :to="{ path: '/dashboard/perfil', query: { tab: 'deseos' } }">Lista de deseos</router-link>
        <router-link :to="{ path: '/dashboard/perfil', query: { tab: 'configuracion' } }">Configuración</router-link>
      </div>

      <div class="footer-col">
        <h4>Ayuda</h4>
        <button type="button" class="footer-action" @click="mostrarMensaje('Preguntas frecuentes: estamos preparando una guía con las dudas más comunes.')">Preguntas frecuentes</button>
        <button type="button" class="footer-action" @click="mostrarMensaje('Soporte: escríbenos desde el formulario de contacto o revisa los mensajes del panel.')">Soporte</button>
        <button type="button" class="footer-action" @click="mostrarMensaje('Política de privacidad: esta versión es una demo académica y no almacena datos sensibles.')">Política de privacidad</button>
        <button type="button" class="footer-action" @click="mostrarMensaje('Términos de uso: el contenido mostrado es solo para fines académicos.')">Términos de uso</button>
      </div>
    </div>

    <div class="footer-bottom">
      <span>
        <i class="bi bi-book me-1"></i>
        YS Books &copy; {{ anio }} — Todos los derechos reservados
      </span>
      <div class="footer-links">
        <button type="button" class="footer-action footer-action--inline" @click="mostrarMensaje('Privacidad: tu información de sesión se mantiene solo en este navegador.')">Privacidad</button>
        <button type="button" class="footer-action footer-action--inline" @click="mostrarMensaje('Términos: esta plataforma es una demostración educativa.')">Términos</button>
        <span style="color:var(--text-muted)">Desarrollado por Yeray Álvarez &amp; Skarik Barbosa</span>
      </div>
    </div>

    <transition name="toast-fade">
      <div v-if="toast" class="footer-toast">
        <i class="bi bi-info-circle-fill me-2"></i>{{ toast }}
      </div>
    </transition>
  </footer>
</template>

<script>
export default {
  name: 'FooterComponent',
  data() {
    return {
      toast: '',
      _timer: null
    }
  },
  computed: {
    anio() {
      return new Date().getFullYear()
    }
  },
  methods: {
    mostrarMensaje(mensaje) {
      this.toast = mensaje
      clearTimeout(this._timer)
      this._timer = setTimeout(() => {
        this.toast = ''
      }, 2600)
    }
  }
}
</script>

<style scoped>
.ys-footer {
  background: var(--bg-dark);
  border-top: 1px solid var(--border-color);
  border-radius: 20px 20px 0 0;
  padding: 40px 28px 20px;
  margin-top: 20px;
  position: relative;
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 32px;
  margin-bottom: 32px;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-d);
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 12px;
  color: var(--text-primary);
}

.footer-brand p {
  color: var(--text-secondary);
  font-size: 12px;
  line-height: 1.7;
  margin-bottom: 16px;
}

.social-links { display: flex; gap: 8px; flex-wrap: wrap; }

.social-link {
  width: 34px;
  height: 34px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--r-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--text-secondary);
  font-size: 15px;
  transition: all .2s;
}

.social-link:hover {
  border-color: var(--violet);
  color: var(--violet-lt);
  transform: translateY(-1px);
}

.footer-col h4 {
  font-size: 12px;
  font-weight: 700;
  color: var(--text-primary);
  text-transform: uppercase;
  letter-spacing: .5px;
  margin-bottom: 14px;
}

.footer-col a,
.footer-action {
  display: block;
  color: var(--text-secondary);
  font-size: 12px;
  padding: 4px 0;
  text-decoration: none;
  transition: color .2s;
  cursor: pointer;
  background: none;
  border: none;
  text-align: left;
  width: fit-content;
}

.footer-col a:hover,
.footer-action:hover { color: var(--violet-lt); }

.footer-action--inline {
  padding: 0;
  width: auto;
}

.footer-bottom {
  border-top: 1px solid var(--border-color);
  padding-top: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
  color: var(--text-muted);
  font-size: 11px;
}

.footer-links { display: flex; gap: 18px; flex-wrap: wrap; align-items: center; }

.footer-toast {
  position: absolute;
  left: 50%;
  bottom: 16px;
  transform: translateX(-50%);
  background: rgba(17,24,39,.96);
  border: 1px solid rgba(124,58,237,.35);
  color: var(--text-primary);
  box-shadow: var(--shadow-md);
  border-radius: 999px;
  padding: 10px 18px;
  font-size: 12px;
  max-width: min(640px, calc(100% - 24px));
  text-align: center;
  z-index: 10;
}

@media (max-width: 768px) {
  .ys-footer { padding: 28px 18px 16px; }
  .footer-grid { grid-template-columns: 1fr 1fr; gap: 20px; }
}
@media (max-width: 480px) {
  .footer-grid { grid-template-columns: 1fr; }
}
</style>
