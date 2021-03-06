import { Ecrc20 as IEcrc20 } from './types'
import { TxReceipt } from '@/services/ecoc/types'
import { ecocw3 } from '@/services/ecoc/ecocw3'
import { ECOC_MAINNET } from '@/services/ecoc/constants'
import { SmartContract } from '@/services/contract'
import { Params, ExecutionResult } from '@/services/contract/types'
import { WalletParams, TokenInfo } from '@/services/ecoc/types'
import { fromDecimals } from '@/services/utils'
import ecrc20Abi from './abi.json'
import knownTokensInfo from './tokens-info.json'
import knownTokensInfoTestnet from './tokens-info-testnet.json'

export class Ecrc20 {
  contract = {} as SmartContract
  tokenInfo = {} as IEcrc20

  constructor(tokenInfo: IEcrc20) {
    this.contract = new SmartContract(tokenInfo.address, ecrc20Abi)
    this.tokenInfo = tokenInfo
  }

  async name() {
    const params = {
      methodArgs: [],
    } as Params

    const result = await this.contract.call('name', params)
    const executionResult = result.executionResult as ExecutionResult
    const data = executionResult.formattedOutput['0'] as string
    return data
  }

  async totalSupply() {
    const params = {
      methodArgs: [],
    } as Params

    const result = await this.contract.call('totalSupply', params)
    const executionResult = result.executionResult as ExecutionResult
    const data = executionResult.formattedOutput['0']
    return data.toNumber() as number
  }

  async decimals() {
    const params = {
      methodArgs: [],
    } as Params

    const result = await this.contract.call('decimals', params)
    const executionResult = result.executionResult as ExecutionResult
    const data = executionResult.formattedOutput['0']
    return data.toNumber() as number
  }

  async balanceOf(address: string) {
    const params = {
      methodArgs: [address],
    } as Params

    const result = await this.contract.call('balanceOf', params)
    const executionResult = result.executionResult as ExecutionResult
    const data = executionResult.formattedOutput['0']
    return data.toNumber() as number
  }

  async symbol() {
    const params = {
      methodArgs: [],
    } as Params

    const result = await this.contract.call('symbol', params)
    const executionResult = result.executionResult as ExecutionResult
    const data = executionResult.formattedOutput['0'] as string
    return data
  }

  async allowance(owner: string, spender: string) {
    const params = {
      methodArgs: [owner, spender],
    } as Params

    const result = await this.contract.call('allowance', params)
    const executionResult = result.executionResult as ExecutionResult
    const data = executionResult.formattedOutput['0']
    return data.toNumber() as number
  }

  async transfer(to: string, amount: number, walletParams: WalletParams) {
    const decimals = Number(this.tokenInfo.decimals)
    const fullAmount = fromDecimals(amount, decimals).toNumber()
    const params = {
      methodArgs: [to, fullAmount],
      senderAddress: walletParams.address,
      amount: 0,
      fee: walletParams.fee,
      gasLimit: walletParams.gasLimit,
      gasPrice: walletParams.gasPrice,
    } as Params

    const keypair = walletParams.keypair
    const utxoList = walletParams.utxoList

    const rawTx = await this.contract.getSendToTx('transfer', params, keypair, utxoList)
    return rawTx as string
  }

  async approve(spender: string, amount: number, walletParams: WalletParams) {
    const decimals = Number(this.tokenInfo.decimals)
    const fullAmount = fromDecimals(amount, decimals).toNumber()
    const params = {
      methodArgs: [spender, fullAmount],
      senderAddress: walletParams.address,
      amount: 0,
      fee: walletParams.fee,
      gasLimit: walletParams.gasLimit,
      gasPrice: walletParams.gasPrice,
    } as Params

    const keypair = walletParams.keypair
    const utxoList = walletParams.utxoList

    const rawTx = await this.contract.getSendToTx('approve', params, keypair, utxoList)
    return rawTx as string
  }

  static async getEcrc20Info(contractAddress: string): Promise<TokenInfo> {
    return await ecocw3.api.getTokenInfo(contractAddress)
  }

  static decode(rawOutput: TxReceipt[]) {
    const contractMetadata = { Ecrc: { abi: ecrc20Abi } }
    return SmartContract.decodeSearchLog(rawOutput, contractMetadata)
  }

  static getKnownTokensInfo(contractAddress: string, networkStr = ECOC_MAINNET) {
    if (networkStr === ECOC_MAINNET) {
      return knownTokensInfo.find((token) => token.address === contractAddress)
    }

    return knownTokensInfoTestnet.find((token) => token.address === contractAddress)
  }
}
