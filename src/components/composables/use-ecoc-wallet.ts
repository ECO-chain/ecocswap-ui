import { reactive, computed } from 'vue'
import { WalletError, InsufficientBalance } from '@/exceptions/wallet'
import { Wallet, SendPayload, PendingTransaction, TxHistory } from '@/services/wallet/types'
import { TxData, Transaction } from '@/services/ecoc/types'
import { KeyStore } from '@/services/keystore/types'
import { Asset } from '@/services/currency/types'
import { Ecoc as EcocWallet } from '@/services/wallet'
import * as utils from '@/services/utils'
import { Ecrc20 } from '@/services/ecrc20'
import * as constants from '@/constants'
import { Ecoc as EcocAsset } from '@/services/currency'

const state = reactive<Wallet>({
  address: '',
  network: '',
  keystore: {} as KeyStore,
  assets: EcocAsset.assetInit(),
  txData: { pagesTotal: 0, txs: [] } as TxData,
  selectedAssetIndex: 0,
  lastUpdate: 0,
  lastBlock: 0,
  status: constants.STATUS_SYNCED,
  pendingTransactions: [] as PendingTransaction[],
})

export default function useEcocWallet() {
  const isLogedIn = computed(() => !!state.address)

  const connect = async (payload: { keystore: string; password: string }) => {
    const wallet = EcocWallet.importFromKeystore(payload.keystore, payload.password)

    state.address = wallet.address
    state.network = wallet.networkName
    state.keystore = EcocWallet.getKeystore(payload.keystore)

    return wallet.address
  }

  const createWallet = async (payload: { password: string; privatekey?: string }) => {
    let keystore

    if (payload.privatekey) {
      keystore = EcocWallet.keystoreFromWif(payload.privatekey, payload.password)
    } else {
      keystore = await EcocWallet.generateNewKeystore(payload.password)
    }

    return keystore
  }

  const logout = async () => {
    state.address = ''
    state.network = ''
    state.keystore = {} as KeyStore
    state.assets = EcocAsset.assetInit()
    state.txData = { pagesTotal: 0, txs: [] } as TxData
    state.selectedAssetIndex = 0

    return true
  }

  return {
    state,
    isLogedIn,
    createWallet,
    connect,
    logout,
  }
}
