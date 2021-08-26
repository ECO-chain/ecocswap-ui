import { reactive, ref, watchEffect } from 'vue'
import * as constants from '@/constants'
import { Asset } from '@/services/currency/types'
import useEcocWallet from './use-ecoc-wallet'
import useEthWallet from './use-eth-wallet'

interface SupportedAssets {
  [type: string]: Asset[]
}

interface SwapPairs {
  [type: string]: string
}

const ecocSwapSupported = ['ECOC', 'EFG']
const ethSwapSupported = ['WECOC', 'WEFG']

const swapPairs = {
  ['ECOC']: 'WECOC',
  ['EFG']: 'WEFG',
  ['GPT']: 'WGPT',
} as SwapPairs

export default function useCrossSwap() {
  const { assets: ecocAssets } = useEcocWallet()
  const { assets: ethAssets } = useEthWallet()
  const amount = ref<string | number>('')
  const toAddress = ref<string>('')
  const fromAsset = ref<Asset>({} as Asset)
  const toAsset = ref<Asset>({} as Asset)

  const supportedAssets = reactive<SupportedAssets>({
    [constants.TYPE_ECOC]: ecocAssets.value.filter((asset) =>
      ecocSwapSupported.includes(asset.symbol)
    ),
    [constants.TYPE_ETH]: ethAssets.value.filter((asset) =>
      ethSwapSupported.includes(asset.symbol)
    ),
  })

  watchEffect(() => {
    supportedAssets[constants.TYPE_ECOC] = ecocAssets.value.filter((asset) =>
      ecocSwapSupported.includes(asset.symbol)
    )
    supportedAssets[constants.TYPE_ETH] = ethAssets.value.filter((asset) =>
      ethSwapSupported.includes(asset.symbol)
    )
  })

  return {
    fromAsset,
    toAsset,
    amount,
    toAddress,
    swapPairs,
    supportedAssets,
  }
}
