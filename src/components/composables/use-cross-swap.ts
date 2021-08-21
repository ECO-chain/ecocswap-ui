import { reactive } from 'vue'
import * as constants from '@/constants'
import { Eth as EthAsset, Ecoc as EcocAsset } from '@/services/currency'

const supportedAssets = reactive({
  [constants.TYPE_ECOC]: EcocAsset.assetInit(),
  [constants.TYPE_ETH]: EthAsset.assetInit().filter((asset) => !(asset.symbol === constants.ETH)),
})

export default function useCrossSwap() {
  return {
    supportedAssets,
  }
}
