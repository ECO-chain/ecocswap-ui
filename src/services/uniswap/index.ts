declare let window: any

import { ethers } from 'ethers'
import { Token } from '@uniswap/sdk-core'
import { Pool } from '@uniswap/v3-sdk'
import { abi as IUniswapV3PoolABI } from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json'
import { abi as QuoterABI } from '@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json'
import * as ethConst from '@/services/eth/constants'
import { Asset } from '@/services/currency/types'
import poolPairs from './pools.json'
import poolPairsGor from './pools-gor.json'

interface State {
  liquidity: ethers.BigNumber
  sqrtPriceX96: ethers.BigNumber
  tick: number
  observationIndex: number
  observationCardinality: number
  observationCardinalityNext: number
  feeProtocol: number
  unlocked: boolean
}

interface Immutables {
  factory: string
  token0: string
  token1: string
  fee: number
  tickSpacing: number
  maxLiquidityPerTick: ethers.BigNumber
}

export class SwapPool {
  chainId
  contract
  assetA: Asset
  assetB: Asset
  state: State
  immutables: Immutables
  pool: Pool

  constructor(chainId: string, assetA: Asset, assetB: Asset) {
    const pair = `${assetA.symbol}_${assetB.symbol}`
    const poolAddress = uniswap.getPool(pair)?.address
    const provider = new ethers.providers.Web3Provider(window.ethereum)

    if (!poolAddress) {
      throw new Error(`Invalid Asset`)
    }

    this.chainId = Number(chainId)
    this.contract = new ethers.Contract(poolAddress, IUniswapV3PoolABI, provider)
    this.state = {} as State
    this.immutables = {} as Immutables
    this.pool = {} as Pool
    this.assetA = assetA
    this.assetB = assetB
  }

  async updatePoolImmutables() {
    const [factory, token0, token1, fee, tickSpacing, maxLiquidityPerTick] = await Promise.all([
      this.contract.factory(),
      this.contract.token0(),
      this.contract.token1(),
      this.contract.fee(),
      this.contract.tickSpacing(),
      this.contract.maxLiquidityPerTick(),
    ])

    this.immutables = {
      factory,
      token0,
      token1,
      fee,
      tickSpacing,
      maxLiquidityPerTick,
    }

    return true
  }

  async updatePoolState() {
    const [liquidity, slot] = await Promise.all([this.contract.liquidity(), this.contract.slot0()])

    this.state = {
      liquidity,
      sqrtPriceX96: slot[0],
      tick: slot[1],
      observationIndex: slot[2],
      observationCardinality: slot[3],
      observationCardinalityNext: slot[4],
      feeProtocol: slot[5],
      unlocked: slot[6],
    }

    return true
  }

  async update() {
    await this.updatePoolImmutables()
    await this.updatePoolState()

    let asset0, asset1

    if (this.immutables.token0 === this.assetA.tokenInfo?.address) {
      asset0 = this.assetA
      asset1 = this.assetB
    } else {
      asset0 = this.assetB
      asset1 = this.assetA
    }

    const tokenA = new Token(
      this.chainId,
      this.immutables.token0,
      Number(asset0.tokenInfo?.decimals),
      asset0.symbol,
      asset0.tokenInfo?.name
    )
    const tokenB = new Token(
      this.chainId,
      this.immutables.token1,
      Number(asset1.tokenInfo?.decimals),
      asset1.symbol,
      asset1.tokenInfo?.name
    )

    this.pool = new Pool(
      tokenA,
      tokenB,
      this.immutables.fee,
      this.state.sqrtPriceX96.toString(),
      this.state.liquidity.toString(),
      this.state.tick
    )

    return true
  }
}

export class SwapQuoter {
  contract

  constructor() {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const address = uniswap.getQuoterAddress()
    this.contract = new ethers.Contract(address, QuoterABI, provider)
  }

  async quoteExactInputSingle(fromAsset: Asset, immutables: Immutables, amountIn: number) {
    let tokenIn, tokenOut
    if (fromAsset.tokenInfo?.address === immutables.token0) {
      tokenIn = immutables.token0
      tokenOut = immutables.token1
    } else {
      tokenIn = immutables.token1
      tokenOut = immutables.token0
    }

    const quotedAmountOut = await this.contract.callStatic.quoteExactInputSingle(
      tokenIn,
      tokenOut,
      immutables.fee,
      amountIn.toString(),
      0
    )
    return quotedAmountOut
  }
}

export namespace uniswap {
  export const getPool = (pair: string) => {
    switch (pair) {
      case ethConst.chainId.ETHEREUM_MAINNET:
        return poolPairs.find((pool) => pool.pair === pair)

      case ethConst.chainId.ETHEREUM_GOR:
        return poolPairsGor.find((pool) => pool.pair === pair)

      default:
        return poolPairs.find((pool) => pool.pair === pair)
    }
  }

  export const getQuoterAddress = () => {
    return '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6'
  }

  export const getSwapRouterAddress = () => {
    return '0xE592427A0AEce92De3Edee1F18E0157C05861564'
  }
}
