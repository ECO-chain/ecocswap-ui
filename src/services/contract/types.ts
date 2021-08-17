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
