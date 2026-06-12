const encoder = new TextEncoder()

function bytesToHex(buffer) {
  return Array.from(new Uint8Array(buffer), byte => byte.toString(16).padStart(2, '0')).join('')
}

export function generatePasswordSalt(length = 16) {
  const bytes = new Uint8Array(length)
  if (globalThis.crypto?.getRandomValues) {
    globalThis.crypto.getRandomValues(bytes)
    return bytesToHex(bytes)
  }

  return Array.from({ length }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')).join('')
}

async function sha256Hex(value) {
  const text = encoder.encode(String(value))
  if (globalThis.crypto?.subtle?.digest) {
    const digest = await globalThis.crypto.subtle.digest('SHA-256', text)
    return bytesToHex(digest)
  }

  try {
    const { createHash } = await import('node:crypto')
    return createHash('sha256').update(String(value)).digest('hex')
  } catch (error) {
    throw new Error('No fue posible generar el hash de la contraseña.')
  }
}

export async function hashPassword(password, salt = '') {
  const normalizedSalt = String(salt || '')
  const digest = await sha256Hex(`${normalizedSalt}::${String(password ?? '')}`)
  return `sha256:${normalizedSalt}:${digest}`
}

export async function createPasswordRecord(password) {
  const salt = generatePasswordSalt()
  const passwordHash = await hashPassword(password, salt)
  return { passwordSalt: salt, passwordHash }
}

export async function verifyPassword(password, passwordRecord = {}) {
  const { passwordHash, passwordSalt = '' } = passwordRecord || {}
  if (!passwordHash) return false

  const current = await hashPassword(password, passwordSalt)
  return current === passwordHash
}

export function isLegacyPasswordRecord(user = {}) {
  return Boolean(user?.password && !user?.passwordHash)
}
