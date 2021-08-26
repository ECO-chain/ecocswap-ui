import { CurrencyStyle } from './types'

export const ECOC = 'ECOC'
export const ETH = 'ETH'
export const EFG = 'EFG'
export const GPT = 'GPT'

export const TYPE_ECOC = 'ECOC'
export const TYPE_ECRC20 = 'ECRC-20'
export const TYPE_ETH = 'ETH'
export const TYPE_ERC20 = 'ERC-20'
export const TYPE_RECEIVED = 'Received'
export const TYPE_SENT = 'Sent'

export const STATUS_SYNCED = 'Synced'
export const STATUS_PENDING = 'Pending'
export const STATUS_CONFIRMED = 'Confirmed'
export const STATUS_SUCCEED = 'Succeed'
export const STATUS_FAILED = 'Failed'

export const KNOWN_CURRENCY = {
  ECOC: {
    icon: require('@/assets/img/currencies/ecoc.svg'),
    color: '#7f4ab2',
  },
  EFG: {
    icon: require('@/assets/img/currencies/efg.svg'),
    color: '#7f4ab2',
  },
  GPT: {
    icon: require('@/assets/img/currencies/gpt.svg'),
    color: '#7f4ab2',
  },
  WECOC: {
    icon: require('@/assets/img/currencies/ecoc.svg'),
    color: '#7f4ab2',
  },
  WEFG: {
    icon: require('@/assets/img/currencies/efg.svg'),
    color: '#7f4ab2',
  },
  WGPT: {
    icon: require('@/assets/img/currencies/gpt.svg'),
    color: '#7f4ab2',
  },
  USDT: {
    icon: require('@/assets/img/currencies/usdt.svg'),
    color: '#7f4ab2',
  },
  ETH: {
    icon: require('@/assets/img/currencies/eth.svg'),
    color: '#7f4ab2',
  },
  DEFAULT: {
    icon: require('@/assets/img/currencies/default.svg'),
    color: '#7f4ab2',
  },
} as CurrencyStyle
