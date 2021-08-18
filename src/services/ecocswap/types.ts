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
  beneficiar: number
  asset: string
  amount: number
  gasCosts: number
  txid: number
  pending: boolean
  completed: boolean
}
