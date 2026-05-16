// services/authService.js — YS Books
// Servicio de autenticación: valida usuarios desde usuarios.json
// NOTA EDUCATIVA: Esta validación es solo con fines académicos.
// En una aplicación real se usaría un backend con contraseñas encriptadas y tokens.

/**
 * Carga los usuarios desde el archivo JSON local.
 * @returns {Promise<Array>} Lista de usuarios
 */
export async function cargarUsuarios() {
  const response = await fetch('/usuarios.json')
  const usuarios = await response.json()
  return usuarios
}

/**
 * Valida las credenciales contra la lista de usuarios.
 * @param {string} usuario
 * @param {string} password
 * @param {Array} usuarios - Lista cargada desde JSON
 * @returns {Object|null} El usuario encontrado o null si no existe
 */
export function validarCredenciales(usuario, password, usuarios) {
  return usuarios.find(u => u.usuario === usuario && u.password === password) || null
}

/**
 * Guarda la sesión del usuario en sessionStorage.
 * @param {Object} usuario
 */
export function guardarSesion(usuario) {
  sessionStorage.setItem('ysbooks_auth', 'true')
  sessionStorage.setItem('ysbooks_usuario', usuario.nombre)
}

/**
 * Cierra la sesión eliminando los datos de sessionStorage.
 */
export function cerrarSesion() {
  sessionStorage.removeItem('ysbooks_auth')
  sessionStorage.removeItem('ysbooks_usuario')
}

/**
 * Retorna el nombre del usuario en sesión.
 * @returns {string}
 */
export function obtenerNombreUsuario() {
  return sessionStorage.getItem('ysbooks_usuario') || 'Usuario'
}
