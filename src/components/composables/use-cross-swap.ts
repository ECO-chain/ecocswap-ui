import { reactive } from 'vue'
import * as constants from '@/constants'
import useEcocWallet from './use-ecoc-wallet'
import useEthWallet from './use-eth-wallet'

const ecocSwapSupported = ['ECOC', 'EFG']
const ethSwapSupported = ['ECOC', 'EFG']

export default function useCrossSwap() {
  const { assets: ecocAssets } = useEcocWallet()
  const { assets: ethAssets } = useEthWallet()

  const supportedAssets = reactive({
    [constants.TYPE_ECOC]: ecocAssets.value.filter((asset) =>
      ecocSwapSupported.includes(asset.symbol)
    ),
    [constants.TYPE_ETH]: ethAssets.value.filter((asset) =>
      ethSwapSupported.includes(asset.symbol)
    ),
  })

  return {
    supportedAssets,
  }
}
