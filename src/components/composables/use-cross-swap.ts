import { reactive } from 'vue'
import * as constants from '@/constants'
import useEcocWallet from './use-ecoc-wallet'
import useEthWallet from './use-eth-wallet'

export default function useCrossSwap() {
  const { assets: ecocAssets } = useEcocWallet()
  const { assets: ethAssets } = useEthWallet()

  const supportedAssets = reactive({
    [constants.TYPE_ECOC]: ecocAssets,
    [constants.TYPE_ETH]: ethAssets.value.filter((asset) => !(asset.symbol === constants.ETH)),
  })

  return {
    supportedAssets,
  }
}
