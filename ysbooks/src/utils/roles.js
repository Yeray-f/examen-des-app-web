export const ROLES = Object.freeze({
  ADMIN: 'admin',
  CLIENTE: 'cliente'
})

export const DEFAULT_ROLE = ROLES.CLIENTE

export function normalizeRole(role) {
  const value = String(role || '').trim().toLowerCase()
  if (value === ROLES.ADMIN) return ROLES.ADMIN
  if (value === ROLES.CLIENTE) return ROLES.CLIENTE
  return DEFAULT_ROLE
}

export function roleLabel(role) {
  return normalizeRole(role) === ROLES.ADMIN ? 'Administrador' : 'Cliente'
}

export function canAccessRoute(role, allowedRoles = []) {
  if (!allowedRoles || allowedRoles.length === 0) return true
  const normalized = normalizeRole(role)
  return allowedRoles.map(normalizeRole).includes(normalized)
}
