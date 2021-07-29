import * as constants from '@/constants'
import EcocWallet from '@/services/ecoc/ecoc-wallet'
import { defaultNetwork } from '@/services/ecoc/config'
import { KeyStore, Currency } from '@/services/types'
import { createKeystore, getKeystoreContent, getKeystoreFromString } from '@/services/keystore'
import { WalletError } from '@/exceptions/wallet'
import { WalletParams, TxData, Utxo, Transaction } from './ecoc/types'

const sendRawTx = async (rawTransaction: string): Promise<string> => {
  const txid = await EcocWallet.sendRawTx(rawTransaction)
  return txid
}

const generateNewKeystore = async (password: string): Promise<string> => {
  // create new wallet default is testnet
  const wallet = await EcocWallet.createNewWallet(defaultNetwork)

  if (!wallet) {
    throw new WalletError('Could not generate new wallet')
  }

  const keystore = createKeystore(wallet.getPrivKey(), password)
  return keystore
}

const getKeystore = (keystore: string): KeyStore => {
  return getKeystoreFromString(keystore)
}

const generateWIF = async (): Promise<string> => {
  const wallet = await EcocWallet.createNewWallet(defaultNetwork)
  if (!wallet) {
    throw new WalletError('Could not generate new wallet')
  }
  return wallet.getPrivKey()
}

const importFromWif = (wif: string) => {
  // create new wallet default is mainnet
  const wallet = EcocWallet.restoreFromWif(wif)

  if (!wallet) {
    throw new WalletError('Could not import from WIF')
  }

  return wallet
}

const importFromKeystore = (keystore: string | KeyStore, password: string): EcocWallet => {
  const wif = getKeystoreContent(keystore, password)

  if (!wif) {
    throw new WalletError('Invalid keystore or password')
  }

  return importFromWif(wif)
}

const keystoreFromWiff = (wif: string, password: string): string => {
  let wallet
  try {
    wallet = EcocWallet.restoreFromWif(wif)
  } catch (error) {
    throw new WalletError('Wrong Private Key')
  }

  const keystore = createKeystore(wallet.getPrivKey(), password)
  return keystore
}

const createMnemonic = (): string => {
  const mnemonic = EcocWallet.generateMnemonic()
  return mnemonic
}

const importFromMnemonic = async (words: string[], password: string): Promise<string> => {
  let wallet: EcocWallet | boolean
  const mnemonic = words.join(' ')

  try {
    wallet = await EcocWallet.restoreFromMnemonic(mnemonic, password, defaultNetwork)
  } catch (error) {
    throw new WalletError('Wrong Mnemonic')
  }

  if (!wallet) {
    throw new WalletError('Wrong Mnemonic')
  }

  const keystore = createKeystore(wallet.getPrivKey(), '')
  return keystore
}

const getEcocBalance = async (address: string): Promise<Currency> => {
  const addressInfo = await EcocWallet.getAddressInfo(address)
  const balance = addressInfo.balance + addressInfo.unconfirmedBalance

  const currency = {
    name: constants.ECOC,
    type: constants.TYPE_ECOC,
    style: constants.KNOWN_CURRENCY.ECOC,
    balance: balance.toFixed(8),
    price: 0,
  } as Currency

  return currency
}

export const sendEcocBalance = async (
  to: string,
  amount: number,
  walletParams: WalletParams
): Promise<string> => {
  const { keypair, utxoList, fee } = walletParams

  const rawTransaction = await EcocWallet.generateTx(keypair, to, amount, fee, utxoList)
  const txid = await sendRawTx(rawTransaction)
  return txid
}

const getTxs = async (address: string, pageNum = 0): Promise<TxData> => {
  const txs = await EcocWallet.getTxList(address, pageNum)
  return txs
}

const getUtxos = async (address: string): Promise<Utxo[]> => {
  const utxos = await EcocWallet.getUtxoList(address)
  return utxos
}

const getTxInfo = async (txid: string): Promise<Transaction> => {
  return await EcocWallet.getTxInfo(txid)
}

const waitForConfirmation = (txid: string): Promise<unknown> => {
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

export {
  sendRawTx,
  generateNewKeystore,
  importFromKeystore,
  getKeystore,
  generateWIF,
  createMnemonic,
  importFromMnemonic,
  getEcocBalance,
  getTxs,
  getUtxos,
  getTxInfo,
  waitForConfirmation,
  keystoreFromWiff,
}
