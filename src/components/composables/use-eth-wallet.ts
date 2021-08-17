import { reactive } from 'vue'

export default function useEthWallet() {
  const wallet = reactive({
    address: '',
    network: '',
    assets: [],
  })

  return {
    wallet,
  }
}
