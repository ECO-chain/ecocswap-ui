import BigNumber from 'bignumber.js'
import { KeyStore } from '@/services/keystore/types'
import { Asset } from '@/services/currency/types'
import { WalletParams, TxData } from '@/services/ecoc/types'

export interface TxHistory {
  id: string
  type: string
  subtype: string
  address: string
  value: number | BigNumber
  currency: string
  time: string | number
  confirmations: number
  status?: string
  txResult?: any[]
}

export interface PendingTransaction {
  type: string
  txid: string
  status: string
  actionType?: string
  tableId?: string
}

export interface Wallet {
  address: string
  network: string
  keystore: KeyStore
  assets: Asset[]
  txData: TxData
  selectedAssetIndex: number
  lastUpdate: number
  lastBlock: number
  status: string
  pendingTransactions: PendingTransaction[]
}

export interface SendPayload {
  asset: Asset
  to: string
  amount: number
  walletParams: WalletParams
}
