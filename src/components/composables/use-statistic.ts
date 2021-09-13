import { reactive, computed } from 'vue'
import { ecocswap } from '@/services/ecocswap'
import { Ecoc as EcocAsset } from '@/services/currency'
import { Eth as EthAsset } from '@/services/currency'
import { Erc20 } from '@/services/erc20'
import * as constants from '@/constants'
import { toDecimals } from '@/services/utils'
import useCrossSwap from '@/components/composables/use-cross-swap'

interface DataList {
  symbol: string
  price: number
  locked: number
  circulation: number
}

const state = reactive({
  dataList: [] as DataList[],
})

export default function useStatistic() {
  const { swapPairs } = useCrossSwap()

  const _init = () => {
    if (state.dataList.length <= 0) {
      state.dataList.push({
        symbol: constants.ECOC,
        price: 0,
        locked: 0,
        circulation: 0,
      })
      state.dataList.push({
        symbol: constants.EFG,
        price: 0,
        locked: 0,
        circulation: 0,
      })
      state.dataList.push({
        symbol: constants.GPT,
        price: 0,
        locked: 0,
        circulation: 0,
      })
    }
  }

  const _updatePrice = async (symbol: string) => {
    return await EcocAsset.getPrice(symbol)
  }

  const _updateLocked = async (symbol: string) => {
    if (symbol === constants.ECOC) {
      const decimals = 8
      const address = '0000000000000000000000000000000000000000'

      const swapAssetInfo = await ecocswap.getAssetInfo(address)
      const lockedAmount = toDecimals(swapAssetInfo.lockedAmount, decimals).toNumber()
      return lockedAmount
    }

    const assetInfo = EcocAsset.getKnownAssetInfo(symbol)
    if (assetInfo) {
      const swapAssetInfo = await ecocswap.getAssetInfo(assetInfo.address)

      const decimals = Number(assetInfo.decimals)
      const lockedAmount = toDecimals(swapAssetInfo.lockedAmount, decimals).toNumber()
      return lockedAmount
    }

    return 0
  }

  const _updateCirculation = async (symbol: string) => {
    const pairedSymbol = swapPairs[symbol]
    if (pairedSymbol) {
      const assetInfo = EthAsset.getKnownAssetInfo(pairedSymbol)
      if (assetInfo) {
        const erc20 = new Erc20(assetInfo)
        const circulation = await erc20.totalSupply()
        return circulation
      }
    }

    return 0
  }

  const updateData = () => {
    state.dataList.forEach(async (data) => {
      _updatePrice(data.symbol).then((price) => {
        data.price = price
      })
      _updateLocked(data.symbol).then((locked) => {
        data.locked = locked
      })
      _updateCirculation(data.symbol).then((circulation) => {
        data.circulation = circulation
      })
    })
  }

  _init()

  return {
    dataList: computed(() => state.dataList),
    updateData,
  }
}
