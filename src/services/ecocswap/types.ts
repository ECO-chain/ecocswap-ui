export interface AssetInfo {
  lockedAmount: number
  pendingAmount: number
  totalLocked: number
  totalUnlocked: number
  totalFees: number
}

export interface RequestInfo {
  networkId: number
  requester: string
  beneficiar: string
  asset: string
  amount: number
  gasCosts: number
  txid: string
  pending: boolean
  completed: boolean
}
