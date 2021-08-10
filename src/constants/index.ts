import { CurrencyStyle } from './types'

export const ECOC = 'ECOC'
export const ETH = 'ETH'

export const TYPE_ECOC = 'ECOC'
export const TYPE_ECRC20 = 'ECRC-20'
export const TYPE_ETH = 'ETH'
export const TYPE_ERC20 = 'ERC-20'

export const KNOWN_CURRENCY = {
  ECOC: {
    icon: require('@/assets/img/currencies/ecoc.svg'),
    mark: require('@/assets/img/currencies/ecoc.svg'),
  },
  EFG: {
    icon: require('@/assets/img/currencies/efg.svg'),
    mark: require('@/assets/img/currencies/efg.svg'),
  },
  GPT: {
    icon: require('@/assets/img/currencies/gpt.svg'),
    mark: require('@/assets/img/currencies/gpt.svg'),
  },
  USDT: {
    icon: require('@/assets/img/currencies/usdt.svg'),
    mark: require('@/assets/img/currencies/usdt.svg'),
  },
  ETH: {
    icon: require('@/assets/img/currencies/eth.svg'),
    mark: require('@/assets/img/currencies/eth.svg'),
  },
  DEFAULT: {
    icon: require('@/assets/img/currencies/default.svg'),
    mark: require('@/assets/img/currencies/default.svg'),
  },
} as CurrencyStyle
