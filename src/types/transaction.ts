import BigNumber from 'bignumber.js'

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
}

export interface PendingTransaction {
  type: string
  txid: string
  status: string
  actionType?: string
  tableId?: string
}
