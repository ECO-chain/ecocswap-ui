import * as constants from '@/constants'
import EcocWallet from '@/services/ecoc/ecoc-wallet'
import { web3 } from '@/services/eth/web3'
import { defaultNetwork } from '@/services/ecoc/config'
import { createKeystore, getKeystoreContent, getKeystoreFromString } from '@/services/keystore'
import { Ecrc20 } from '@/services/ecrc20'
import { Erc20 } from '@/services/erc20'
import { WalletError } from '@/exceptions/wallet'
import { KeyStore } from '@/services/keystore/types'
import { Asset, TokenInfo } from '@/services/currency/types'
import { WalletParams } from '@/services/ecoc/types'
import * as utils from '@/services/utils'

async function* generateWallet(password: string) {
  const mnemonic = EcocWallet.generateMnemonic()
  const wallet = await EcocWallet.restoreFromMnemonic(mnemonic, password, defaultNetwork)

  if (!wallet) {
    throw new WalletError('Could not generate new wallet')
  }

  yield mnemonic as string
  yield wallet.address as string

  const keystore = createKeystore(wallet.getPrivKey(), password)
  return keystore
}

export namespace Ecoc {
  export const isEcrc20 = (asset: Asset) => {
    return asset.type === constants.TYPE_ECRC20
  }

  export const importFromWif = (wif: string) => {
    const wallet = EcocWallet.restoreFromWif(wif)

    if (!wallet) {
      throw new WalletError('Could not import from WIF')
    }

    return wallet
  }

  export const importFromKeystore = (keystore: string | KeyStore, password: string) => {
    const wif = getKeystoreContent(keystore, password)

    if (!wif) {
      throw new WalletError('Invalid keystore or password')
    }

    return importFromWif(wif)
  }

  export const generateNewWallet = generateWallet

  export const generateNewKeystore = async (password: string) => {
    const wallet = await EcocWallet.createNewWallet(defaultNetwork)

    if (!wallet) {
      throw new WalletError('Could not generate new wallet')
    }

    const keystore = createKeystore(wallet.getPrivKey(), password)
    return keystore
  }

  export const getKeystore = (keystore: string) => {
    return getKeystoreFromString(keystore)
  }

  export const keystoreFromWif = (wif: string, password: string) => {
    let wallet: EcocWallet
    try {
      wallet = EcocWallet.restoreFromWif(wif)
    } catch (error) {
      throw new WalletError('Wrong Private Key')
    }

    const keystore = createKeystore(wallet.getPrivKey(), password)
    return keystore
  }

  export const getTxs = async (address: string, pageNum = 0) => {
    const txs = await EcocWallet.getTxList(address, pageNum)
    return txs
  }

  export const getUtxos = async (address: string) => {
    const utxos = await EcocWallet.getUtxoList(address)
    return utxos
  }

  export const getTxInfo = async (txid: string) => {
    return await EcocWallet.getTxInfo(txid)
  }

  export const getAddressInfo = async (address: string) => {
    return await EcocWallet.getAddressInfo(address)
  }

  export const getEcocBalance = async (address: string) => {
    const addressInfo = await EcocWallet.getAddressInfo(address)
    const balance = addressInfo.balance + addressInfo.unconfirmedBalance

    const asset = {
      name: constants.ECOC,
      symbol: constants.ECOC,
      type: constants.TYPE_ECOC,
      amount: Number(balance.toFixed(8)),
      price: 0,
      style: constants.KNOWN_CURRENCY.ECOC,
    } as Asset

    return asset
  }

  export const getEcrc20Balance = async (address: string) => {
    const tokensInfo = await EcocWallet.getEcrc20(address)
    const assets = [] as Asset[]

    tokensInfo.forEach((token) => {
      assets.push({
        name: token.contract.name,
        symbol: token.contract.symbol,
        type: constants.TYPE_ECRC20,
        amount: utils.toDecimals(token.amount, token.contract.decimals).toNumber(),
        style: Object.prototype.hasOwnProperty.call(constants.KNOWN_CURRENCY, token.contract.symbol)
          ? constants.KNOWN_CURRENCY[token.contract.symbol]
          : constants.KNOWN_CURRENCY['DEFAULT'],
        tokenInfo: {
          name: token.contract.name,
          symbol: token.contract.symbol,
          address: token.contract.contract_address,
          decimals: token.contract.decimals,
          totalSupply: token.contract.total_supply,
        },
        price: 0,
      } as Asset)
    })

    return assets
  }

  export const sendRawTx = async (rawTransaction: string) => {
    const txid = await EcocWallet.sendRawTx(rawTransaction)
    return txid
  }

  export const sendEcocBalance = async (to: string, amount: number, walletParams: WalletParams) => {
    const { keypair, utxoList, fee } = walletParams

    const rawTransaction = await EcocWallet.generateTx(keypair, to, amount, fee, utxoList)
    const txid = await sendRawTx(rawTransaction)
    return txid
  }

  export const sendEcrc20Balance = async (
    asset: Asset,
    to: string,
    amount: number,
    walletParams: WalletParams
  ) => {
    if (!isEcrc20(asset)) {
      throw new WalletError('Wrong ECRC-20 currency')
    }

    const tokenInfo = asset.tokenInfo as TokenInfo
    const ecrc20 = new Ecrc20(tokenInfo)

    const rawTransaction = await ecrc20.transfer(to, amount, walletParams)
    const txid = await sendRawTx(rawTransaction)
    return txid
  }

  export const waitForConfirmation = (txid: string) => {
    return new Promise((resolve, reject) => {
      let txResult
      setInterval(async () => {
        try {
          txResult = await EcocWallet.getTxInfo(txid)
          if (txResult.confirmations > 0) {
            return resolve(true)
          }
        } catch (error) {
          reject(error)
        }
      }, 10000)
    })
  }
}

export namespace Eth {
  export const getBalance = async (address: string) => {
    const balance = await web3.eth.getBalance(address).then((balance) => {
      return web3.utils.fromWei(balance, 'ether')
    })

    const asset = {
      name: constants.ETH,
      symbol: constants.ETH,
      type: constants.TYPE_ETH,
      amount: Number(balance),
      price: 0,
      style: constants.KNOWN_CURRENCY.ETH,
    } as Asset

    return asset
  }

  export const getErc20Balance = async (address: string, tokenInfo: TokenInfo) => {
    const erc20 = new Erc20(tokenInfo)
    const balance = await erc20.balanceOf(address)

    const asset = {
      name: tokenInfo.name,
      symbol: tokenInfo.symbol,
      type: constants.TYPE_ERC20,
      amount: Number(balance),
      price: 0,
      style: Object.prototype.hasOwnProperty.call(constants.KNOWN_CURRENCY, tokenInfo.symbol)
        ? constants.KNOWN_CURRENCY[tokenInfo.symbol]
        : constants.KNOWN_CURRENCY['DEFAULT'],
    } as Asset

    return asset
  }
}
