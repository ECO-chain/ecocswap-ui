export interface EWallet {
  keypair: any
  network: any
  address: string
}

export interface AddressInfo {
  addrStr: string
  balance: number
  balanceSat: number
  totalReceived: number
  totalReceivedSat: number
  totalSent: number
  totalSentSat: number
  unconfirmedBalance: number
  unconfirmedBalanceSat: number
  unconfirmedTxApperances: number
  txApperances: number
  transactions: string[]
}

export interface TokenInfo {
  contract_address: string
  total_supply: string
  decimals: string
  name: string
  symbol: string
  version: string
  transfers_count: number
  holders_count: number
}

export interface SendPayload {
  to: string
  amount: number
}

export interface WalletParams {
  address: string
  keypair: any
  utxoList: Utxo[]
  fee: number
  gasLimit: number
  gasPrice: number
}

export interface TxData {
  pagesTotal: number
  txs: Transaction[]
}

export interface Transaction {
  txid: string
  version: number
  locktime: number
  vin: TxValueIn[]
  vout: TxValueOut[]
  blockhash: string
  blockheight: number
  confirmations: number
  time: number
  blocktime: number
  valueOut: number
  size: number
  valueIn: number
  fees: number
  receipt?: TxReceipt[]
}

export interface TxValueIn {
  coinbase?: string
  txid: string
  vout: number
  sequence: number
  n: number
  scriptSig?: {
    hex?: string
    asm?: string
  }
  addr?: string
  valueSat?: number
  value?: number
  doubleSpentTxID?: string
}

export interface TxValueOut {
  value: string
  n: number
  scriptPubKey: {
    hex: string
    asm: string
    addresses?: string[]
    type?: string
  }
  spentTxId: string | null
  spentIndex: number | null
  spentHeight: number | null
}

export interface SocketTx {
  isRBF: boolean
  txid: string
  valueOut: number
  vout: any[]
  loading: boolean
  time: number
}

export interface TxReceipt {
  blockHash: string
  blockNumber: number
  contractAddress: string
  cumulativeGasUsed: number
  excepted: string
  from: string
  gasUsed: number
  log: ReceiptLog[]
  to: string
  transactionHash: string
  transactionIndex: number
}

export interface ReceiptLog {
  address: string
  data: string
  topics: string[]
}

export interface Utxo {
  address: string
  txid: string
  vout: number
  scriptPubKey: string
  amount: number
  satoshis: number
  isStake: boolean
  height: number
  confirmations: number
}
