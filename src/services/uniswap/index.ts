import { chainId } from '@/services/eth/constants'

const contractAddress = {
  [chainId.ETHEREUM_MAINNET]: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
  [chainId.ETHEREUM_GOR]: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
}

export namespace uniswap {
  export const getAddress = (chainId: string) => {
    return contractAddress[chainId]
  }
}
