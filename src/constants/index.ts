import { CurrencyStyle } from './types'

export const ECOC = 'ECOC'
export const ETH = 'ETH'

export const TYPE_ECOC = 'ECOC'
export const TYPE_ECRC20 = 'ECRC-20'
export const TYPE_ETH = 'ETH'
export const TYPE_ERC20 = 'ERC-20'

export const KNOWN_CURRENCY = {
  ECOC: {
    icon: require('@/assets/icon/currency/ecoc.svg'),
    mark: require('@/assets/wallet-token/ecoc.svg'),
  },
  EFG: {
    icon: require('@/assets/icon/currency/efg.svg'),
    mark: require('@/assets/wallet-token/efg.svg'),
  },
  GPT: {
    icon: require('@/assets/icon/currency/gpt.svg'),
    mark: require('@/assets/wallet-token/gpt.svg'),
  },
  USDT: {
    icon: require('@/assets/icon/currency/usdt.svg'),
    mark: require('@/assets/wallet-token/usdt.svg'),
  },
  ETH: {
    icon: require('@/assets/icon/currency/eth.svg'),
    mark: require('@/assets/wallet-token/ether.svg'),
  },
  EWETH: {
    icon: require('@/assets/icon/currency/eth.svg'),
    mark: require('@/assets/wallet-token/ether.svg'),
  },
  EWUSDT: {
    icon: require('@/assets/icon/currency/usdt.svg'),
    mark: require('@/assets/wallet-token/usdt.svg'),
  },
  DEFAULT: {
    icon: require('@/assets/icon/currency/default.svg'),
    mark: require('@/assets/wallet-token/default.svg'),
  },
} as CurrencyStyle
