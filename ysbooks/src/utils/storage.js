export function readJsonStorage(key, fallback = null) {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function writeJsonStorage(key, value) {
  if (typeof window === 'undefined') return
  localStorage.setItem(key, JSON.stringify(value))
}

export function removeStorageKeys(keys = []) {
  if (typeof window === 'undefined') return
  keys.forEach(key => localStorage.removeItem(key))
}
