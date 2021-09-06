import { ref, reactive, computed, watch } from 'vue'
import { Eth as EthAsset } from '@/services/currency'
import { Eth as EthWallet } from '@/services/wallet'
import { Asset } from '@/services/currency/types'
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
  assets: EthAsset.assetInit(),
  lastUpdate: 0,
  lastBlock: 0,
  walletId: 0,
})

export default function useEthWallet() {
  const { web3, chainId, account, activateWallet } = useWeb3()

  const isLogedIn = computed(() => !!state.address)
  const lastBlock = computed(() => state.lastBlock)
  const address = computed(() => state.address)
  const assets = computed(() => state.assets)
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

  const _init = () => {
    state.chainId = chainId.value
  }

  const _updateAsset = (assetData: Asset) => {
    const assetIndex = state.assets.findIndex((asset) => {
      if (asset.tokenInfo && assetData.tokenInfo) {
        return asset.tokenInfo.address === assetData.tokenInfo.address
      }

      return asset.symbol === assetData.symbol
    })

    if (assetIndex < 0) {
      state.assets.push(assetData)
    } else {
      assetData.price = state.assets[assetIndex].price
      state.assets.splice(assetIndex, 1, assetData)
    }
  }

  const _getAssetPrice = async (symbol: string) => {
    if (symbol) {
      return 0
    }

    return 1
  }

  const _updateTime = () => {
    state.lastUpdate = new Date().getTime()
  }

  const connect = async (walletid: number) => {
    switch (walletid) {
      case wallet.METAMASK:
        await activateWallet()
        state.walletId = wallet.METAMASK
        break
    }
  }

  const updateAssetsBalance = async () => {
    if (!isLogedIn.value) return

    try {
      const ethAsset = await EthWallet.getBalance(state.address)

      _updateAsset(ethAsset)
      _updateTime()
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const updateAssetsPrice = async () => {
    if (!isLogedIn.value) return

    try {
      state.assets.forEach(async (asset) => {
        const assetPrice = asset.price
        const newPrice = await _getAssetPrice(asset.symbol)

        if (newPrice !== assetPrice) {
          asset.price = newPrice
          _updateTime()
        }
      })
    } catch (error) {
      return Promise.reject(error)
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

  _init()

  return {
    supportedWallet,
    state,
    address,
    assets,
    isLogedIn,
    lastBlock,
    walletIcon,
    connect,
    updateLastBlock,
    updateAssetsBalance,
    updateAssetsPrice,
  }
}
