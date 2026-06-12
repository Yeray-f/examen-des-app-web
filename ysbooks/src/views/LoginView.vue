<template>
  <div class="login-wrapper">
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

    <div class="login-card">
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

      <div v-if="errorMsg" class="alert alert-danger d-flex align-items-center gap-2 py-2" role="alert">
        <i class="bi bi-exclamation-triangle-fill"></i>
        <span>{{ errorMsg }}</span>
      </div>

      <div v-if="exitoMsg" class="alert alert-success d-flex align-items-center gap-2 py-2" role="alert">
        <i class="bi bi-check-circle-fill"></i>
        <span>{{ exitoMsg }}</span>
      </div>

      <form @submit.prevent="submitLogin" novalidate>
        <div class="mb-3">
          <label for="usuario" class="form-label login-label"><i class="bi bi-person me-1"></i>Usuario</label>
          <input
            id="usuario"
            v-model.trim="formulario.usuario"
            type="text"
            class="form-control login-input"
            placeholder="Ingresa tu usuario"
            autocomplete="username"
          />
        </div>

        <div class="mb-4">
          <label for="password" class="form-label login-label"><i class="bi bi-lock me-1"></i>Contraseña</label>
          <div class="input-group">
            <input
              id="password"
              v-model="formulario.password"
              :type="mostrarPassword ? 'text' : 'password'"
              class="form-control login-input"
              placeholder="Ingresa tu contraseña"
              autocomplete="current-password"
            />
            <button type="button" class="btn login-eye-btn" @click="mostrarPassword = !mostrarPassword" :title="mostrarPassword ? 'Ocultar' : 'Mostrar'">
              <i :class="mostrarPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
            </button>
          </div>
        </div>

        <button type="submit" class="btn btn-primary w-100 login-btn" :disabled="cargando">
          <span v-if="cargando">
            <span class="spinner-border spinner-border-sm me-2" role="status"></span>
            Verificando...
          </span>
          <span v-else>
            <i class="bi bi-box-arrow-in-right me-2"></i>Ingresar
          </span>
        </button>
      </form>

      <p class="login-nota mt-3">
        <i class="bi bi-shield-lock me-1"></i>
        La autenticación se valida exclusivamente contra MockAPI. Si el servicio no responde, el acceso se bloquea.
      </p>
    </div>
  </div>
</template>

<script>
import { iniciarSesion as authLogin, obtenerSesion, obtenerRolActual } from '../services/authService.js'
import { ROLES } from '../utils/roles.js'

function destinoPorRol(rol) {
  return rol === ROLES.ADMIN ? '/dashboard/inicio' : '/dashboard/catalogo'
}

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
      mostrarPassword: false
    }
  },
  created() {
    const sesion = obtenerSesion()
    if (sesion) {
      this.$router.replace(destinoPorRol(obtenerRolActual()))
    }
  },
  methods: {
    async submitLogin() {
      if (!this.formulario.usuario || !this.formulario.password) {
        this.errorMsg = 'Por favor completa todos los campos.'
        return
      }

      this.cargando = true
      this.errorMsg = ''
      this.exitoMsg = ''

      try {
        const sesion = await authLogin(this.formulario.usuario.trim(), this.formulario.password)
        this.exitoMsg = `¡Bienvenido/a, ${sesion.user.nombre}!`
        setTimeout(() => {
          this.$router.replace(destinoPorRol(sesion.user.role))
        }, 400)
      } catch (error) {
        this.errorMsg = error?.message || 'No se pudo iniciar sesión.'
        this.formulario.password = ''
      } finally {
        this.cargando = false
      }
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

.login-title--highlight { color: var(--violet-lt); }
.login-subtitle { color: var(--text-secondary); font-size: 0.88rem; margin-top: 2px; }

.login-label { color: var(--text-secondary); font-size: 0.84rem; font-weight: 500; }

.login-input {
  background: rgba(30, 45, 71, 0.88) !important;
  border: 1px solid rgba(99, 120, 180, 0.25) !important;
  color: var(--text-primary) !important;
  border-right: 0;
}

.login-input:focus {
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.25) !important;
  border-color: var(--violet) !important;
}

.login-eye-btn {
  background: rgba(30, 45, 71, 0.88) !important;
  border: 1px solid rgba(99, 120, 180, 0.25) !important;
  color: var(--text-secondary) !important;
}

.login-btn { font-weight: 700; padding: 0.85rem 1rem; }

.login-nota {
  color: var(--text-secondary);
  font-size: 0.82rem;
  line-height: 1.5;
  background: rgba(37, 99, 235, 0.08);
  border: 1px solid rgba(37, 99, 235, 0.18);
  border-radius: 12px;
  padding: 0.8rem 0.9rem;
}
</style>
