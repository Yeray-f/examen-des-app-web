<template>
  <!-- LoginView: vista de inicio de sesión que valida desde usuarios.json -->
  <div class="login-wrapper">

    <!-- Fondo decorativo con libros (mantenemos el estilo visual de YS Books) -->
    <div class="login-bg" aria-hidden="true">
      <svg viewBox="0 0 1440 810" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="roomBg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#050818"/>
            <stop offset="60%" stop-color="#080c2e"/>
            <stop offset="100%" stop-color="#04060f"/>
          </linearGradient>
          <radialGradient id="luzVioleta" cx="65%" cy="40%" r="35%">
            <stop offset="0%" stop-color="#3d1a8c" stop-opacity="0.55"/>
            <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
          </radialGradient>
          <radialGradient id="luzAzul" cx="20%" cy="55%" r="32%">
            <stop offset="0%" stop-color="#0d2a6e" stop-opacity="0.5"/>
            <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <rect width="1440" height="810" fill="url(#roomBg)"/>
        <rect width="1440" height="810" fill="url(#luzVioleta)"/>
        <rect width="1440" height="810" fill="url(#luzAzul)"/>
        <!-- Estantes decorativos -->
        <rect x="0" y="542" width="430" height="16" fill="#0d1240" rx="2"/>
        <rect x="0" y="402" width="385" height="14" fill="#0d1240" rx="2"/>
        <rect x="10"  y="480" width="48" height="62" fill="#0a0e30" rx="2"/>
        <rect x="60"  y="470" width="38" height="72" fill="#111845" rx="2"/>
        <rect x="100" y="478" width="52" height="64" fill="#0d1240" rx="2"/>
        <rect x="154" y="465" width="44" height="77" fill="#1a237e" rx="2"/>
        <rect x="200" y="472" width="36" height="70" fill="#0f1660" rx="2"/>
        <rect x="238" y="468" width="50" height="74" fill="#151c6e" rx="2"/>
        <rect x="290" y="476" width="42" height="66" fill="#283593" rx="2"/>
        <rect x="334" y="462" width="46" height="80" fill="#0a0e30" rx="2"/>
        <!-- Libros derecha -->
        <rect x="1010" y="475" width="44" height="67" fill="#1a237e" rx="2"/>
        <rect x="1056" y="463" width="36" height="79" fill="#0d1240" rx="2"/>
        <rect x="1094" y="471" width="50" height="71" fill="#111845" rx="2"/>
        <rect x="1146" y="467" width="42" height="75" fill="#283593" rx="2"/>
        <rect x="1190" y="474" width="38" height="68" fill="#0a0e30" rx="2"/>
        <rect x="1230" y="460" width="48" height="82" fill="#1a237e" rx="2"/>
        <rect x="1280" y="472" width="40" height="70" fill="#0f1660" rx="2"/>
        <rect x="1322" y="464" width="46" height="78" fill="#111845" rx="2"/>
        <rect x="1370" y="476" width="52" height="66" fill="#0d1240" rx="2"/>
      </svg>
    </div>

    <!-- Tarjeta del formulario de login -->
    <div class="login-card">
      <!-- Logo y nombre -->
      <div class="text-center mb-4">
        <svg viewBox="0 0 40 40" fill="none" width="48" class="mb-2">
          <rect width="40" height="40" rx="10" fill="url(#lgLogin)"/>
          <path d="M10 28V14a2 2 0 012-2h6v18H12a2 2 0 01-2-2z" fill="white" opacity=".9"/>
          <path d="M20 12h8a2 2 0 012 2v14a2 2 0 01-2 2h-8V12z" fill="white" opacity=".6"/>
          <defs>
            <linearGradient id="lgLogin" x1="0" y1="0" x2="40" y2="40">
              <stop stop-color="#7C3AED"/>
              <stop offset="1" stop-color="#2563EB"/>
            </linearGradient>
          </defs>
        </svg>
        <h1 class="login-title">YS <span class="login-title--highlight">Books</span></h1>
        <p class="login-subtitle">Tu universo de libros</p>
      </div>

      <!-- Alerta de error Bootstrap (se muestra si hay error de login) -->
      <div
        v-if="errorMsg"
        class="alert alert-danger d-flex align-items-center gap-2 py-2"
        role="alert"
      >
        <i class="bi bi-exclamation-triangle-fill"></i>
        <span>{{ errorMsg }}</span>
      </div>

      <!-- Alerta de éxito -->
      <div
        v-if="exitoMsg"
        class="alert alert-success d-flex align-items-center gap-2 py-2"
        role="alert"
      >
        <i class="bi bi-check-circle-fill"></i>
        <span>{{ exitoMsg }}</span>
      </div>

      <!-- Formulario de login -->
      <form @submit.prevent="iniciarSesion" novalidate>
        <!-- Campo usuario -->
        <div class="mb-3">
          <label for="usuario" class="form-label login-label">
            <i class="bi bi-person me-1"></i>Usuario
          </label>
          <input
            id="usuario"
            v-model="formulario.usuario"
            type="text"
            class="form-control login-input"
            placeholder="Ingresa tu usuario"
            autocomplete="username"
          />
        </div>

        <!-- Campo contraseña -->
        <div class="mb-4">
          <label for="password" class="form-label login-label">
            <i class="bi bi-lock me-1"></i>Contraseña
          </label>
          <div class="input-group">
            <input
              id="password"
              v-model="formulario.password"
              :type="mostrarPassword ? 'text' : 'password'"
              class="form-control login-input"
              placeholder="Ingresa tu contraseña"
              autocomplete="current-password"
            />
            <button
              type="button"
              class="btn login-eye-btn"
              @click="mostrarPassword = !mostrarPassword"
              :title="mostrarPassword ? 'Ocultar' : 'Mostrar'"
            >
              <i :class="mostrarPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
            </button>
          </div>
        </div>

        <!-- Botón submit -->
        <button
          type="submit"
          class="btn btn-primary w-100 login-btn"
          :disabled="cargando"
        >
          <span v-if="cargando">
            <span class="spinner-border spinner-border-sm me-2" role="status"></span>
            Verificando...
          </span>
          <span v-else>
            <i class="bi bi-box-arrow-in-right me-2"></i>Ingresar
          </span>
        </button>
      </form>

      <!-- Nota educativa importante -->
      <p class="login-nota mt-3">
        <i class="bi bi-info-circle me-1"></i>
        <strong>Nota educativa:</strong> Esta validación es solo con fines académicos.
        No representa un sistema de autenticación real.
      </p>

      <!-- Credenciales de prueba para facilitar la evaluación -->
      <div class="login-hint mt-2">
        <small>Usuario: <code>admin</code> · Contraseña: <code>libreria2026</code></small>
      </div>
    </div>
  </div>
</template>

<script>
import { cargarUsuarios, validarCredenciales, guardarSesion } from '../services/authService.js'

export default {
  name: 'LoginView',
  data() {
    return {
      formulario: {
        usuario: '',
        password: ''
      },
      errorMsg: '',
      exitoMsg: '',
      cargando: false,
      mostrarPassword: false,
      usuarios: [] // Se carga desde usuarios.json
    }
  },
  async created() {
    // Si ya hay sesión activa, redirigir al dashboard directamente
    if (sessionStorage.getItem('ysbooks_auth') === 'true') {
      this.$router.push('/dashboard')
      return
    }
    // Cargamos los usuarios desde el archivo JSON
    try {
      this.usuarios = await cargarUsuarios()
    } catch (e) {
      console.error('Error cargando usuarios:', e)
    }
  },
  methods: {
    async iniciarSesion() {
      // Validar que los campos no estén vacíos
      if (!this.formulario.usuario || !this.formulario.password) {
        this.errorMsg = 'Por favor completa todos los campos.'
        return
      }

      this.cargando = true
      this.errorMsg = ''

      // Pequeño delay para simular validación
      await new Promise(r => setTimeout(r, 600))

      // Validamos contra el JSON de usuarios
      const usuarioEncontrado = validarCredenciales(
        this.formulario.usuario,
        this.formulario.password,
        this.usuarios
      )

      if (usuarioEncontrado) {
        // Guardamos sesión y redirigimos al dashboard
        guardarSesion(usuarioEncontrado)
        this.exitoMsg = `¡Bienvenido/a, ${usuarioEncontrado.nombre}!`
        setTimeout(() => {
          this.$router.push('/dashboard')
        }, 700)
      } else {
        this.errorMsg = 'Usuario o contraseña incorrectos. Inténtalo de nuevo.'
        this.formulario.password = ''
      }

      this.cargando = false
    }
  }
}
</script>

<style scoped>
.login-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: #080c2e;
}

.login-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.login-bg svg {
  width: 100%;
  height: 100%;
}

.login-card {
  position: relative;
  z-index: 10;
  background: rgba(17, 24, 39, 0.92);
  border: 1px solid rgba(99, 120, 180, 0.2);
  border-radius: var(--r-lg);
  padding: 2.5rem 2rem;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.6), 0 0 40px rgba(124, 58, 237, 0.15);
  backdrop-filter: blur(12px);
}

.login-title {
  font-family: var(--font-d);
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.login-title--highlight {
  color: var(--violet-lt);
}

.login-subtitle {
  color: var(--text-secondary);
  font-size: 0.85rem;
  margin: 4px 0 0;
}

.login-label {
  color: var(--text-secondary);
  font-size: 0.82rem;
  font-weight: 500;
  margin-bottom: 6px;
}

.login-input {
  background: rgba(30, 45, 71, 0.8) !important;
  border: 1px solid rgba(99, 120, 180, 0.25) !important;
  color: var(--text-primary) !important;
  border-radius: var(--r-sm) !important;
  padding: 10px 14px;
}

.login-input:focus {
  border-color: var(--violet) !important;
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.25) !important;
}

.login-input::placeholder {
  color: var(--text-muted) !important;
}

.login-eye-btn {
  background: rgba(30, 45, 71, 0.8);
  border: 1px solid rgba(99, 120, 180, 0.25);
  border-left: none;
  color: var(--text-secondary);
  border-radius: 0 var(--r-sm) var(--r-sm) 0 !important;
}

.login-eye-btn:hover {
  color: var(--violet-lt);
}

.login-btn {
  padding: 11px;
  font-weight: 600;
  font-size: 0.95rem;
  letter-spacing: 0.3px;
  border-radius: var(--r-sm) !important;
  transition: all 0.2s;
}

.login-nota {
  color: var(--text-muted);
  font-size: 0.75rem;
  text-align: center;
  line-height: 1.5;
  border-top: 1px solid var(--border-color);
  padding-top: 12px;
  margin-bottom: 0;
}

.login-hint {
  text-align: center;
  color: var(--text-secondary);
  font-size: 0.78rem;
}

.login-hint code {
  background: rgba(124, 58, 237, 0.15);
  color: var(--violet-lt);
  padding: 1px 5px;
  border-radius: 4px;
  font-size: 0.8rem;
}

/* Sobrescribir alertas Bootstrap para el tema oscuro */
.alert-danger {
  background: rgba(239, 68, 68, 0.15) !important;
  border-color: rgba(239, 68, 68, 0.3) !important;
  color: #fca5a5 !important;
  font-size: 0.83rem;
}

.alert-success {
  background: rgba(16, 185, 129, 0.15) !important;
  border-color: rgba(16, 185, 129, 0.3) !important;
  color: #6ee7b7 !important;
  font-size: 0.83rem;
}
</style>