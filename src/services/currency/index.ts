import * as constants from '@/constants'
import { Asset } from './types'
import { defaultNetwork } from '@/services/ecoc/config'
import { ECOC_MAINNET } from '@/services/ecoc/constants'
import { defaultChainID } from '@/services/eth/config'
import * as ethConst from '@/services/eth/constants'
import knownEcrc20Info from '@/services/ecrc20/tokens-info.json'
import knownEcrc20InfoTestnet from '@/services/ecrc20/tokens-info-testnet.json'
import knownErc20Info from '@/services/erc20/tokens-info.json'
import knownErc20InfoGor from '@/services/erc20/tokens-info-gor.json'

export namespace Ecoc {
  export const ECOC = {
    symbol: constants.ECOC,
    type: constants.TYPE_ECOC,
    style: constants.KNOWN_CURRENCY.ECOC,
    amount: 0,
    price: 0,
  } as Asset

  export const Ecrc20Assets = knownEcrc20Info.map((asset) => {
    return {
      symbol: asset.symbol,
      type: constants.TYPE_ECRC20,
      style: Object.prototype.hasOwnProperty.call(constants.KNOWN_CURRENCY, asset.symbol)
        ? constants.KNOWN_CURRENCY[asset.symbol]
        : constants.KNOWN_CURRENCY['DEFAULT'],
      amount: 0,
      price: 0,
      tokenInfo: asset,
    } as Asset
  })

  export const Ecrc20AssetsTestnet = knownEcrc20InfoTestnet.map((asset) => {
    return {
      symbol: asset.symbol,
      type: constants.TYPE_ECRC20,
      style: Object.prototype.hasOwnProperty.call(constants.KNOWN_CURRENCY, asset.symbol)
        ? constants.KNOWN_CURRENCY[asset.symbol]
        : constants.KNOWN_CURRENCY['DEFAULT'],
      amount: 0,
      price: 0,
      tokenInfo: asset,
    } as Asset
  })

  export const assetInit = () => {
    if (defaultNetwork === ECOC_MAINNET) {
      return [ECOC, ...Ecrc20Assets] as Asset[]
    }

    return [ECOC, ...Ecrc20AssetsTestnet] as Asset[]
  }
}

export namespace Eth {
  export const ETH = {
    symbol: constants.ETH,
    type: constants.TYPE_ETH,
    style: constants.KNOWN_CURRENCY.ETH,
    amount: 0,
    price: 0,
  } as Asset

  export const Erc20Assets = knownErc20Info.map((asset) => {
    return {
      symbol: asset.symbol,
      type: constants.TYPE_ERC20,
      style: Object.prototype.hasOwnProperty.call(constants.KNOWN_CURRENCY, asset.symbol)
        ? constants.KNOWN_CURRENCY[asset.symbol]
        : constants.KNOWN_CURRENCY['DEFAULT'],
      amount: 0,
      price: 0,
      tokenInfo: asset,
    } as Asset
  })

  export const Erc20AssetsGor = knownErc20InfoGor.map((asset) => {
    return {
      symbol: asset.symbol,
      type: constants.TYPE_ERC20,
      style: Object.prototype.hasOwnProperty.call(constants.KNOWN_CURRENCY, asset.symbol)
        ? constants.KNOWN_CURRENCY[asset.symbol]
        : constants.KNOWN_CURRENCY['DEFAULT'],
      amount: 0,
      price: 0,
      tokenInfo: asset,
    } as Asset
  })

  export const assetInit = () => {
    switch (defaultChainID) {
      case ethConst.chainId.ETHEREUM_MAINNET:
        return [ETH, ...Erc20Assets] as Asset[]

      case ethConst.chainId.ETHEREUM_GOR:
        return [ETH, ...Erc20AssetsGor] as Asset[]

      default:
        return [ETH, ...Erc20Assets] as Asset[]
    }
  }
}
