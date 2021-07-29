import { PendingTransaction } from './transaction'
import { KeyStore, Currency } from '@/services/types'
import { WalletParams } from '@/services/ecoc/types'

export interface Wallet {
  address: string
  network: string
  keystore: KeyStore
  currencies: Currency[]
  selectedCurrencyIndex: number
  lastUpdate: number
  lastBlock: number
  status: string
  pendingTransactions: PendingTransaction[]
}

export interface SendPayload {
  currency: Currency
  to: string
  amount: number
  walletParams: WalletParams
}
