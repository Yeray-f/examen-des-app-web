<template>
  <!-- FooterComponent: pie de página completo estilo YS Books Portada -->
  <footer class="ys-footer">
    <div class="footer-grid">
      <!-- Columna brand -->
      <div class="footer-brand">
        <div class="footer-logo">
          <svg viewBox="0 0 40 40" fill="none" width="28">
            <rect width="40" height="40" rx="10" fill="url(#ftGrad)" />
            <path d="M10 28V14a2 2 0 012-2h6v18H12a2 2 0 01-2-2z" fill="white" opacity=".9" />
            <path d="M20 12h8a2 2 0 012 2v14a2 2 0 01-2 2h-8V12z" fill="white" opacity=".6" />
            <defs>
              <linearGradient id="ftGrad" x1="0" y1="0" x2="40" y2="40">
                <stop stop-color="#7C3AED" /><stop offset="1" stop-color="#2563EB" />
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

      <!-- Columna Tienda -->
      <div class="footer-col">
        <h4>Tienda</h4>
        <router-link to="/dashboard/catalogo">Catálogo</router-link>
        <router-link to="/dashboard/ofertas">Ofertas especiales</router-link>
        <router-link to="/dashboard/productos">Nuevos lanzamientos</router-link>
        <router-link to="/dashboard">Libros populares</router-link>
      </div>

      <!-- Columna Cuenta -->
      <div class="footer-col">
        <h4>Cuenta</h4>
        <router-link to="/dashboard/clientes">Mi perfil</router-link>
        <a href="#">Mis pedidos</a>
        <a href="#">Lista de deseos</a>
        <a href="#">Configuración</a>
      </div>

      <!-- Columna Ayuda -->
      <div class="footer-col">
        <h4>Ayuda</h4>
        <a href="#">Preguntas frecuentes</a>
        <a href="#">Soporte</a>
        <a href="#">Política de privacidad</a>
        <a href="#">Términos de uso</a>
      </div>
    </div>

    <!-- Footer bottom -->
    <div class="footer-bottom">
      <span>
        <i class="bi bi-book me-1"></i>
        YS Books &copy; {{ anio }} — Todos los derechos reservados
      </span>
      <div class="footer-links">
        <a href="#">Privacidad</a>
        <a href="#">Términos</a>
        <span style="color:var(--text-muted)">Desarrollado por Yeray Álvarez &amp; Skarik Barbosa</span>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'FooterComponent',
  computed: { anio() { return new Date().getFullYear() } }
}
</script>

<style scoped>
.ys-footer {
  background: var(--bg-dark);
  border-top: 1px solid var(--border-color);
  border-radius: 20px 20px 0 0;
  padding: 40px 28px 20px;
  margin-top: 20px;
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 32px;
  margin-bottom: 32px;
}

@media (max-width: 768px) {
  .footer-grid { grid-template-columns: 1fr 1fr; gap: 20px; }
}

@media (max-width: 480px) {
  .footer-grid { grid-template-columns: 1fr; }
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

.social-links { display: flex; gap: 8px; }

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

.footer-col a {
  display: block;
  color: var(--text-secondary);
  font-size: 12px;
  padding: 4px 0;
  text-decoration: none;
  transition: color .2s;
  cursor: pointer;
}

.footer-col a:hover { color: var(--violet-lt); }

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

.footer-links { display: flex; gap: 18px; flex-wrap: wrap; }
.footer-links a { color: var(--text-muted); text-decoration: none; font-size: 11px; transition: color .2s; }
.footer-links a:hover { color: var(--violet-lt); }
</style>