import { Decoder } from 'ecoweb3'
import { SmartContract } from '@/services/contract'
import { WalletParams } from '@/services/ecoc/types'
import { defaultNetwork } from '@/services/ecoc/config'
import { ECOC_MAINNET } from '@/services/ecoc/constants'
import { Params, ExecutionResult } from '@/services/contract/types'
import abi from './abi.json'
import { AssetInfo, RequestInfo } from './types'

const mainnetAddress = 'c4084f82019b0c36f89ccda5c68dd8e603b24981'
const testnetAddress = 'c4084f82019b0c36f89ccda5c68dd8e603b24981'

const defaultAddress = defaultNetwork === ECOC_MAINNET ? mainnetAddress : testnetAddress
const isMainnet = defaultNetwork === ECOC_MAINNET

const contract = new SmartContract(defaultAddress, abi)

export namespace ecocswap {
  export const address = contract.address

  export const getAssetInfo = async (assetAddress: string): Promise<AssetInfo> => {
    const tokenAddr = Decoder.toEcoAddress(Decoder.removeHexPrefix(assetAddress), isMainnet)
    const params = {
      methodArgs: [tokenAddr],
    } as Params

    const result = await contract.call('getAssetInfo', params)
    const executionResult = result.executionResult as ExecutionResult
    const output = executionResult.formattedOutput

    const lockedAmount = output.lockedAmount.toNumber()
    const pendingAmount = output.pendingAmount.toNumber()
    const totalLocked = output.totalLocked.toNumber()
    const totalUnlocked = output.totalUnlocked.toNumber()
    const totalFees = output.totalFees.toNumber()

    return {
      lockedAmount,
      pendingAmount,
      totalLocked,
      totalUnlocked,
      totalFees,
    }
  }

  export const getFeeRate = async (assetAddress: string, networkId: number): Promise<number> => {
    const params = {
      methodArgs: [assetAddress, networkId],
    } as Params

    const result = await contract.call('getFeeRate', params)
    const executionResult = result.executionResult as ExecutionResult
    const res = executionResult.formattedOutput.adminFee.toNumber()

    return res
  }

  export const getGasCost = async (networkId: number): Promise<number> => {
    const params = {
      methodArgs: [networkId],
    } as Params

    const result = await contract.call('getGasCost', params)
    const executionResult = result.executionResult as ExecutionResult
    const res = executionResult.formattedOutput.gasCost.toNumber()

    return res
  }

  export const getAllRequests = async (address: string, networkId: number): Promise<number[]> => {
    const params = {
      methodArgs: [address, networkId],
    } as Params

    const result = await contract.call('getAllRequests', params)
    const executionResult = result.executionResult as ExecutionResult
    const res = executionResult.formattedOutput.requestId.map((id: any) => id.toNumber())

    return res
  }

  export const getPendingRequests = async (
    address: string,
    networkId: number
  ): Promise<number[]> => {
    const params = {
      methodArgs: [address, networkId],
    } as Params

    const result = await contract.call('getPendingRequests', params)
    const executionResult = result.executionResult as ExecutionResult
    const res = executionResult.formattedOutput.requestId.map((id: any) => id.toNumber())

    return res
  }

  export const getRequestInfo = async (requestId: number): Promise<RequestInfo> => {
    const params = {
      methodArgs: [requestId],
    } as Params

    const result = await contract.call('getRequestInfo', params)
    const executionResult = result.executionResult as ExecutionResult
    const output = executionResult.formattedOutput

    const networkId = output.networkId
    const requester = Decoder.toEcoAddress(output.requester, isMainnet)
    const beneficiar = output.beneficiar.toString(16)
    const asset = output.asset
    const amount = output.amount.toNumber()
    const gasCosts = output.gasCosts.toNumber()
    const txid = output.txid.toString(16)
    const pending = output.pending
    const completed = output.completed

    return {
      networkId,
      requester,
      beneficiar,
      asset,
      amount,
      gasCosts,
      txid,
      pending,
      completed,
    }
  }

  export const getTransferStatus = async (requestId: number): Promise<boolean> => {
    const params = {
      methodArgs: [requestId],
    } as Params

    const result = await contract.call('getTransferStatus', params)
    const executionResult = result.executionResult as ExecutionResult
    const res = executionResult.formattedOutput.completed

    return res
  }

  //send to contract
  export const lockECOC = async (
    amount: number,
    gasCost: number,
    userAddress: string,
    networkId: number,
    walletParams: WalletParams
  ) => {
    const beneficiarAddr = Decoder.toEcoAddress(Decoder.removeHexPrefix(userAddress), isMainnet)
    const params = {
      methodArgs: [beneficiarAddr, networkId],
      senderAddress: walletParams.address,
      amount: amount + gasCost,
      fee: walletParams.fee,
      gasLimit: walletParams.gasLimit,
      gasPrice: walletParams.gasPrice,
    } as Params

    const keypair = walletParams.keypair
    const utxoList = walletParams.utxoList

    const rawTx = await contract.getSendToTx('lockECOC', params, keypair, utxoList)
    return rawTx
  }

  export const lockECRC20 = async (
    amount: number,
    gasCost: number,
    assetAddress: string,
    userAddress: string,
    networkId: number,
    walletParams: WalletParams
  ) => {
    const beneficiarAddr = Decoder.toEcoAddress(Decoder.removeHexPrefix(userAddress), isMainnet)
    const tokenAddr = Decoder.toEcoAddress(Decoder.removeHexPrefix(assetAddress), isMainnet)
    const params = {
      methodArgs: [tokenAddr, beneficiarAddr, networkId, amount],
      senderAddress: walletParams.address,
      amount: gasCost,
      fee: walletParams.fee,
      gasLimit: walletParams.gasLimit,
      gasPrice: walletParams.gasPrice,
    } as Params

    const keypair = walletParams.keypair
    const utxoList = walletParams.utxoList

    const rawTx = await contract.getSendToTx('lockECRC20', params, keypair, utxoList)
    return rawTx
  }
}
