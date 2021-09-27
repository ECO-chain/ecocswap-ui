import { AbiItem } from 'web3-utils'
import { web3 } from '@/services/eth/web3'
import { Erc20 as IErc20 } from './types'
import { fromDecimals, toDecimals } from '@/services/utils'
import erc20Abi from './abi.json'

export class Erc20 {
  contract
  tokenInfo = {} as IErc20

  constructor(tokenInfo: IErc20) {
    this.contract = new web3.eth.Contract(erc20Abi as AbiItem[], tokenInfo.address)
    this.tokenInfo = tokenInfo
  }

  async name() {
    const result = await this.contract.methods.name.call()
    return result
  }

  async totalSupply() {
    const result = await this.contract.methods.totalSupply().call()
    const decimals = Number(this.tokenInfo.decimals)
    const amount = toDecimals(Number(result), decimals).toNumber()
    return amount
  }

  async decimals() {
    const result = await this.contract.methods.decimals().call()
    const amount = Number(result)
    return amount
  }

  async balanceOf(address: string) {
    const result = await this.contract.methods.balanceOf(address).call()
    const decimals = Number(this.tokenInfo.decimals)
    const amount = toDecimals(Number(result), decimals).toNumber()
    return amount
  }

  async symbol() {
    const result = await this.contract.methods.symbol().call()
    return result
  }

  async allowance(owner: string, spender: string) {
    const result = await this.contract.methods.allowance(owner, spender).call()
    const decimals = Number(this.tokenInfo.decimals)
    const amount = toDecimals(Number(result), decimals).toNumber()
    return amount
  }

  async transfer(from: string, to: string, amount: number) {
    const decimals = Number(this.tokenInfo.decimals)
    const fullAmount = fromDecimals(amount, decimals)
    const rawTx = {
      from: from,
      to: this.tokenInfo.address,
      data: this.contract.methods.transfer(to, fullAmount.toFixed()).encodeABI(),
    }
    return rawTx
  }

  async approve(owner: string, spender: string, amount: number) {
    const decimals = Number(this.tokenInfo.decimals)
    const fullAmount = fromDecimals(amount, decimals)

    const rawTx = {
      from: owner,
      to: this.tokenInfo.address,
      data: this.contract.methods.approve(spender, fullAmount.toFixed()).encodeABI(),
    }
    return rawTx
  }

  async burn(owner: string, destination: string, amount: number) {
    const decimals = Number(this.tokenInfo.decimals)
    const fullAmount = fromDecimals(amount, decimals)
    const rawTx = {
      from: owner,
      to: this.tokenInfo.address,
      data: this.contract.methods.burn(destination, fullAmount.toFixed()).encodeABI(),
    }
    return rawTx
  }
}
