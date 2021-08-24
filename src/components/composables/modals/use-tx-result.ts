import { reactive } from 'vue'

export default function useTxResult() {
  const state = reactive({
    isOpen: false,
    txid: '',
    loadingMsg: '',
    errorMsg: '',
  })

  const open = () => {
    state.isOpen = true
  }

  const close = () => {
    state.isOpen = false
  }

  const error = (errorMsg: string) => {
    state.errorMsg = errorMsg
  }

  const setLoading = (loadingMsg: string) => {
    state.loadingMsg = loadingMsg
  }

  const success = (txid: string) => {
    state.txid = txid
  }

  const clear = () => {
    state.txid = ''
    state.loadingMsg = ''
    state.errorMsg = ''
  }

  return {
    state,
    open,
    close,
    error,
    setLoading,
    success,
    clear,
  }
}
