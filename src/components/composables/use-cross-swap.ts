import { reactive, watchEffect } from 'vue'
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
const ethSwapSupported = ['ECOC', 'EFG']

const swapPairs = {
  ['ECOC']: 'ECOC',
  ['EFG']: 'EFG',
  ['GPT']: 'GPT',
} as SwapPairs

export default function useCrossSwap() {
  const { assets: ecocAssets } = useEcocWallet()
  const { assets: ethAssets } = useEthWallet()

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
    swapPairs,
    supportedAssets,
  }
}
