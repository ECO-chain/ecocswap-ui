import * as constants from '@/constants'
import { Asset } from './types'
import { defaultNetwork } from '@/services/ecoc/config'
import { ECOC_MAINNET } from '@/services/ecoc/constants'
import knownTokensInfo from '@/services/ecrc20/tokens-info.json'
import knownTokensInfoTestnet from '@/services/ecrc20/tokens-info-testnet.json'

export namespace Ecoc {
  const getKnownTokenInfo = (currencyName: string) => {
    if (defaultNetwork === ECOC_MAINNET) {
      return knownTokensInfo.find((token) => token.symbol === currencyName)
    }

    return knownTokensInfoTestnet.find((token) => token.symbol === currencyName)
  }

  export const ECOC = {
    symbol: constants.ECOC,
    type: constants.TYPE_ECOC,
    style: constants.KNOWN_CURRENCY.ECOC,
    amount: 0,
    price: 0,
  } as Asset

  export const EFG = {
    symbol: constants.EFG,
    type: constants.TYPE_ECRC20,
    style: constants.KNOWN_CURRENCY.EFG,
    amount: 0,
    price: 0,
    tokenInfo: getKnownTokenInfo(constants.EFG),
  } as Asset

  export const GPT = {
    symbol: constants.GPT,
    type: constants.TYPE_ECRC20,
    style: constants.KNOWN_CURRENCY.GPT,
    amount: 0,
    tokenInfo: getKnownTokenInfo(constants.GPT),
  } as Asset

  export const assetInit = () => {
    return [ECOC, EFG, GPT] as Asset[]
  }
}

export namespace Eth {}
