import { Encoder, Decoder, Ecocjs } from 'ecoweb3'
import { ecocw3 } from '@/services/ecoc/ecocw3'
import { Utxo, TxReceipt } from '@/services/ecoc/types'
import { Contract, Params } from './types'

export const DEFAULT = {
  DEFAULT_AMOUNT: 0,
  DEFAULT_FEE: 0.01,
  DEFAULT_GAS_LIMIT: 300000,
  DEFAULT_GAS_PRICE: 40,
}

export class SmartContract implements Contract {
  address: string
  abi: []

  constructor(address: string, abi: any) {
    this.address = address
    this.abi = abi
  }

  generateCall(methodName: string, params: Params): string {
    const { methodArgs } = params
    const encodedData = Encoder.constructData(this.abi, methodName, methodArgs)

    return encodedData
  }

  generateSendData(methodName: string, params: Params): string {
    const { methodArgs } = params
    const encodedData = Encoder.constructData(this.abi, methodName, methodArgs)

    return encodedData
  }

  async call(methodName: string, params: Params): Promise<any> {
    const encodedData = this.generateCall(methodName, params)
    const result = await ecocw3.api.callContract(this.address, encodedData)

    const data = Decoder.decodeCall(result, this.abi, methodName, true)
    return data
  }

  async getSendToTx(
    methodName: string,
    params: Params,
    keypair: any,
    utxoList: Utxo[]
  ): Promise<string> {
    const encodedData = this.generateSendData(methodName, params)
    const contractAddress = this.address

    const fromAddress = Ecocjs.utils.getAddress(keypair)
    const network = keypair.network

    const tx = Ecocjs.utils.generateSendToTx(
      fromAddress,
      contractAddress,
      encodedData,
      network,
      params,
      utxoList
    )

    const unsignedTx = tx.buildIncomplete()
    const txInputLength = unsignedTx.ins.length

    for (let i = 0; i < txInputLength; i++) {
      tx.sign(i, keypair)
    }

    const singedTx = tx.build().toHex()

    return singedTx
  }

  static async send(singedTx: string): Promise<any> {
    const result = await ecocw3.api.sendRawTx(singedTx)
    return result
  }

  static decodeSearchLog(
    rawOutput: TxReceipt[],
    contractMetadata: any,
    removeHexPrefix = true
  ): Promise<any> {
    return Decoder.decodeSearchLog(rawOutput, contractMetadata, removeHexPrefix)
  }
}
