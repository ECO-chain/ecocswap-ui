import BigNumber from 'bignumber.js'
import { Decoder } from 'ecoweb3'
import { ECOC_MAINNET } from './ecoc/constants'
import { ecocw3 } from '@/services/ecoc/ecocw3'
import { defaultNetwork } from '@/services/ecoc/config'
import { defaultChainID } from '@/services/eth/config'
import * as EthConst from '@/services/eth/constants'

const isMainnet = defaultNetwork === ECOC_MAINNET

export const toDecimals = (value: number | string, decimals: number | string): BigNumber => {
  const expo = new BigNumber(10).pow(new BigNumber(decimals))
  const res = new BigNumber(value).dividedBy(expo)

  return res
}

export const fromDecimals = (value: number | string, decimals: number | string): BigNumber => {
  const expo = new BigNumber(10).pow(new BigNumber(decimals))
  const res = new BigNumber(value).multipliedBy(expo)

  return res
}

export const toNumber = (value: number | string): BigNumber => {
  return new BigNumber(value)
}

export const getEcocTotalFee = (
  fee: number | string,
  gasPrice: number | string,
  gasLimit: number | string
): number => {
  const satoshi = new BigNumber(100000000)
  const totalFee = new BigNumber(fee)
  const totalGas = new BigNumber(gasPrice).dividedBy(satoshi).multipliedBy(gasLimit)

  return totalFee.plus(totalGas).toNumber()
}

export const getEstimatedValue = (
  amount: number | string,
  price: number | string
): BigNumber | number => {
  if (!price) return 0
  return new BigNumber(amount).multipliedBy(new BigNumber(price))
}

export const truncate = (msg: string, charsToShow = 20): string => {
  if (msg.length <= charsToShow) return msg

  const separator = '...'
  const frontChars = Math.ceil(charsToShow / 2)
  const backChars = Math.floor(charsToShow / 2)

  return msg.substr(0, frontChars) + separator + msg.substr(msg.length - backChars)
}

export const addressFilter = (address: string): string => {
  return address
}

export const getEcocExplorerUrl = (networkStr = ECOC_MAINNET): string => {
  if (networkStr === ECOC_MAINNET) return 'https://explorer.ecoc.io'
  return 'https://testnet.explorer.ecoc.io'
}

export const getEthExplorerUrl = (chainId = defaultChainID): string => {
  switch (chainId) {
    case EthConst.chainId.ETHEREUM_MAINNET:
      return 'https://etherscan.io'
    case EthConst.chainId.ETHEREUM_GOR:
      return 'https://goerli.etherscan.io'
  }

  return 'https://etherscan.io'
}

export const getBlockNumber = async (): Promise<number> => {
  const status = await ecocw3.api.getBlockStatus()
  return status.height as number
}

export const toEcocAddress = (addressHex: string): string => {
  try {
    return Decoder.toEcoAddress(addressHex, isMainnet)
  } catch (error) {
    return addressHex
  }
}
