import { ref, reactive, computed, watch } from 'vue'
import useWeb3 from './use-web3'

const wallet = {
  METAMASK: 1,
  WALLETCONNECT: 2,
  COINBASE: 3,
  FORMATIC: 4,
  PORTIS: 5,
}

const supportedWallet = ref([
  {
    name: 'MetaMask',
    icon: require('@/assets/img/wallets/metamask.png'),
    walletId: 1,
  },
  {
    name: 'WalletConnect',
    icon: require('@/assets/img/wallets/wallet-connect.png'),
    walletId: 2,
  },
  {
    name: 'Coinbase Wallet',
    icon: require('@/assets/img/wallets/coinbase-wallet.png'),
    walletId: 3,
  },
  {
    name: 'Formatic',
    icon: require('@/assets/img/wallets/formatic.png'),
    walletId: 4,
  },
  {
    name: 'Portis',
    icon: require('@/assets/img/wallets/portis.png'),
    walletId: 5,
  },
])

const state = reactive({
  address: '',
  chainId: '',
  lastUpdate: 0,
  lastBlock: 0,
  walletId: 0,
})

export default function useEthWallet() {
  const { web3, chainId, account, activateWallet } = useWeb3()

  const isLogedIn = computed(() => !!state.address)
  const lastBlock = computed(() => state.lastBlock)
  const address = computed(() => state.address)
  const walletIcon = computed(() => {
    const wallet = supportedWallet.value.find((wallet) => wallet.walletId === state.walletId)
    if (!wallet) {
      return null
    }

    return wallet.icon
  })

  watch(account, (newAccount) => {
    if (state.address !== newAccount) {
      state.address = newAccount
    }
  })

  watch(chainId, (newChainId) => {
    if (state.chainId !== newChainId) {
      state.chainId = newChainId
    }
  })

  const connect = async (walletid: number) => {
    switch (walletid) {
      case wallet.METAMASK:
        await activateWallet()
        state.walletId = wallet.METAMASK
        break
    }
  }

  const updateLastBlock = async () => {
    const lastBlock = await web3.eth.getBlockNumber().catch(() => {
      //
    })

    if (lastBlock) {
      state.lastBlock = lastBlock
    }
  }

  return {
    supportedWallet,
    state,
    address,
    isLogedIn,
    lastBlock,
    connect,
    updateLastBlock,
    walletIcon,
  }
}
