import { CurrencyAmount, Percent, TradeType } from '@uniswap/sdk-core'
import { Route, Trade } from '@uniswap/v3-sdk'
import { computed } from 'vue'
import { Asset } from '@/services/currency/types'
import { Eth as EthWallet } from '@/services/wallet'
import { Erc20 } from '@/services/erc20'
import { SwapPool, SwapQuoter, SwapRouter, uniswap } from '@/services/uniswap'
import * as utils from '@/services/utils'
import useEthWallet from './use-eth-wallet'

interface tradePayload {
  fromAsset: Asset
  toAsset: Asset
  amount: number
}

export default function useUniswap() {
  const { state: ethState } = useEthWallet()
  const slippageTolerance = new Percent('50', '10000') // 50 bips, or 0.50%

  const getSwapPool = async (fromAsset: Asset, toAsset: Asset) => {
    const swapPool = new SwapPool(ethState.chainId, fromAsset, toAsset)
    await swapPool.update()

    return swapPool
  }

  const getPrice = async (poolData: SwapPool, fromAsset: Asset) => {
    const swapPool = poolData.pool

    if (fromAsset.tokenInfo?.address === swapPool.token0.address) {
      return swapPool.token1Price.toFixed(6)
    }

    return swapPool.token0Price.toFixed(6)
  }

  const getTrade = async (payload: tradePayload) => {
    const { fromAsset, toAsset, amount } = payload
    const decimals = fromAsset.tokenInfo?.decimals || 8
    const fullAmountIn = utils.fromDecimals(amount, decimals).toNumber()

    let tokenA, tokenB
    const swapPool = await getSwapPool(fromAsset, toAsset)
    const pool = swapPool.pool

    if (fromAsset.tokenInfo?.address === pool.token0.address) {
      tokenA = pool.token0
      tokenB = pool.token1
    } else {
      tokenA = pool.token1
      tokenB = pool.token0
    }

    const quoter = new SwapQuoter()
    const quotedAmountOut = await quoter.quoteExactInputSingle(
      tokenA.address,
      tokenB.address,
      swapPool.immutables.fee,
      fullAmountIn
    )

    const swapRoute = new Route([pool], tokenA, tokenB)

    // create an unchecked trade instance
    const uncheckedTrade = Trade.createUncheckedTrade({
      route: swapRoute,
      inputAmount: CurrencyAmount.fromRawAmount(tokenA, fullAmountIn.toString()),
      outputAmount: CurrencyAmount.fromRawAmount(tokenB, quotedAmountOut.toString()),
      tradeType: TradeType.EXACT_INPUT,
    })

    return uncheckedTrade
  }

  const swapAsset = async (payload: tradePayload) => {
    const uncheckedTrade = await getTrade(payload)
    const routerAddress = uniswap.getSwapRouterAddress()
    const router = new SwapRouter()
    const fee = uncheckedTrade.route.pools[0].fee

    const tradeEncoded = router.exactInputSingle(
      uncheckedTrade.inputAmount.currency.address,
      uncheckedTrade.outputAmount.currency.address,
      fee,
      uncheckedTrade.inputAmount.numerator.toString(),
      ethState.address
    )

    const rawTx = {
      from: ethState.address,
      to: routerAddress,
      data: tradeEncoded,
    }
    const txid = await EthWallet.sendRawTx(rawTx)

    return txid
  }

  const isAssetApproved = async (asset: Asset, amount: number | string) => {
    if (!asset.tokenInfo) {
      throw new Error(`Invalid Asset`)
    }

    const routerAddress = uniswap.getSwapRouterAddress()
    const erc20 = new Erc20(asset.tokenInfo)
    const allowance = await erc20.allowance(ethState.address, routerAddress)

    return allowance >= Number(amount)
  }

  const approveAsset = async (asset: Asset) => {
    if (!asset.tokenInfo) {
      throw new Error(`Invalid Asset`)
    }

    const routerAddress = uniswap.getSwapRouterAddress()
    const erc20 = new Erc20(asset.tokenInfo)
    const totalSupply = await erc20.totalSupply()
    const allowance = await erc20.allowance(ethState.address, routerAddress)

    if (allowance >= totalSupply) {
      throw new Error(`Asset Already approved`)
    }

    const rawTx = await erc20.approve(ethState.address, routerAddress, totalSupply)
    const txid = await EthWallet.sendRawTx(rawTx)

    await EthWallet.waitForConfirmation(txid)

    return txid
  }

  const computeRealizedLPFeePercent = uniswap.computeRealizedLPFeePercent

  return {
    slippageTolerance: computed(() => slippageTolerance.toFixed(2)),
    isAssetApproved,
    approveAsset,
    getSwapPool,
    getPrice,
    getTrade,
    swapAsset,
    computeRealizedLPFeePercent,
  }
}
