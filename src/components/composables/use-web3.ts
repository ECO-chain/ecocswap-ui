import { reactive, computed } from 'vue'
import { WalletError } from '@/exceptions/wallet'
import { defaultChainID } from '@/services/eth/config'
import { web3, changeToChainId, tryWithGivenProvider } from '@/services/eth/web3'

declare let window: any

interface ProviderRpcError extends Error {
  message: string
  code: number
  data?: unknown
}

interface ConnectInfo {
  chainId: string
}

const state = reactive({
  web3: web3,
  ethereum: window.ethereum,
  chainId: defaultChainID,
  account: '',
})

export default function useWeb3() {
  const isWalletAvailable = computed(() => typeof window.ethereum !== 'undefined')

  const init = () => {
    if (!isWalletAvailable.value) {
      console.error('Ethereum wallet unavailable')
      return
    }

    state.ethereum.on('accountsChanged', (accounts: string[]) => {
      if (accounts.length === 0) {
        throw new WalletError('Please connect to ethereum wallet')
      } else if (accounts[0] !== state.account) {
        state.account = accounts[0]
      }
    })

    state.ethereum.on('chainChanged', (chainId: string) => {
      state.chainId = chainId
      changeToChainId(chainId)
      //window.location.reload()
    })

    state.ethereum.on('disconnect', () => {
      state.chainId = ''
      state.account = ''
    })

    state.ethereum.on('connect', (connectInfo: ConnectInfo) => {
      state.chainId = connectInfo.chainId
    })
  }

  const activateWallet = async () => {
    if (!isWalletAvailable.value) {
      throw new WalletError('Ethereum wallet unavailable')
    }

    const accounts = await state.ethereum
      .request({ method: 'eth_requestAccounts' })
      .catch((error: ProviderRpcError) => {
        if (error.code === 4001) {
          throw new WalletError('Please connect to ethereum wallet')
        } else {
          console.error(error)
        }
      })

    const chainId = await state.ethereum.request({ method: 'eth_chainId' })

    state.account = accounts[0]
    state.chainId = chainId
    tryWithGivenProvider()
  }

  init()

  return {
    web3: state.web3,
    ethereum: state.ethereum,
    chainId: computed(() => state.chainId),
    account: computed(() => state.account),
    activateWallet,
  }
}
