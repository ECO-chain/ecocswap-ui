import { chainId } from './constants'

const provider = {
  [chainId.ETHEREUM_MAINNET]: 'http://47.88.2.23:40001',
  [chainId.ETHEREUM_GOR]: 'http://47.88.2.23:40001',
}

const defaultChainID = chainId.ETHEREUM_GOR

const getProvider = (chainId: string) => {
  return provider[chainId]
}

export { getProvider, defaultChainID }
