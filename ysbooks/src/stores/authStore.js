import { computed, reactive } from 'vue'

const SESSION_KEY = 'ysbooks_session'

function readSession() {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY)
  if (!raw) return null

  try {
    const parsed = JSON.parse(raw)
    return parsed?.user ? parsed : null
  } catch {
    return null
  }
}

function persistSession(session) {
  if (typeof window === 'undefined') return

  const serialized = JSON.stringify(session)
  localStorage.setItem(SESSION_KEY, serialized)
  sessionStorage.setItem(SESSION_KEY, serialized)
}

function clearSessionStorage() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(SESSION_KEY)
  sessionStorage.removeItem(SESSION_KEY)
}

const state = reactive({
  session: readSession()
})

export function useAuthStore() {
  const session = computed(() => state.session)
  const user = computed(() => state.session?.user || null)
  const isAuthenticated = computed(() => Boolean(state.session))

  function syncFromStorage() {
    state.session = readSession()
    return state.session
  }

  function setSession(newSession) {
    state.session = newSession
    persistSession(newSession)
  }

  function clearSession() {
    state.session = null
    clearSessionStorage()
  }

  return {
    state,
    session,
    user,
    isAuthenticated,
    syncFromStorage,
    setSession,
    clearSession
  }
}
