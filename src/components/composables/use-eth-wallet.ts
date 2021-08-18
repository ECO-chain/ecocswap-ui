import { reactive, computed } from 'vue'

const state = reactive({
  address: '',
  lastUpdate: 0,
  lastBlock: 0,
})

export default function useEthWallet() {
  const lastBlock = computed(() => state.lastBlock)

  return {
    state,
    lastBlock,
  }
}
