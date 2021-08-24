import { reactive } from 'vue'

export default function useTxConfirmation() {
  const state = reactive({
    isOpen: false,
  })

  const open = () => {
    state.isOpen = true
  }

  const close = () => {
    state.isOpen = false
  }

  return {
    state,
    open,
    close,
  }
}
