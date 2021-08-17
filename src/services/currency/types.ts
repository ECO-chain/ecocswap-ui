// currencies types
export interface Asset {
  symbol: string
  type: string
  amount: number
  price: number
  style: Style
  tokenInfo?: TokenInfo
}

export interface TokenInfo {
  name: string
  symbol: string
  address: string
  decimals: string
  totalSupply: string
}

export interface Style {
  icon: string
  color: string
}
