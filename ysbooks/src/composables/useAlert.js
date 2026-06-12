import { ref } from 'vue'

const ICONS = {
  success: 'bi bi-check-circle-fill',
  danger: 'bi bi-exclamation-triangle-fill',
  warning: 'bi bi-exclamation-circle-fill',
  info: 'bi bi-info-circle-fill'
}

export function useAlert(timeout = 3000) {
  const alert = ref(null)
  let timer = null

  function clearAlert() {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    alert.value = null
  }

  function showAlert(message, type = 'success') {
    clearAlert()
    alert.value = {
      message,
      type,
      icon: ICONS[type] || ICONS.info
    }

    if (timeout > 0) {
      timer = setTimeout(() => {
        alert.value = null
        timer = null
      }, timeout)
    }
  }

  return { alert, showAlert, clearAlert }
}