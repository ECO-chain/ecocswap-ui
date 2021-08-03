// currencies types
export interface Currency {
  name: string
  type: string
  balance: string
  style?: Style
  price?: number
}

export interface CurrencyInfo {
  name: string
  contractAddress?: string
  style: Style
}

export interface Style {
  icon: string
  mark: string
}

// keystore types
export interface KeyStore {
  version: string
  address?: string
  content: string
  crypto: Crypto
}

export interface Crypto {
  cipher: string
  salt?: string
}

// contract type
export interface Contract {
  address: string
  abi: any
}

export interface Params {
  methodArgs: (string | number)[]
  amount?: number
  fee?: number
  gasLimit?: number
  gasPrice?: number
  senderAddress?: string
}

export interface ExecutionResult {
  codeDeposit: number
  depositSize: number
  excepted: string
  formattedOutput: Record<string, any>
  gasForDeposit: number
  gasRefunded: number
  gasUsed: number
  newAddress: string
  output: string
}
