import { CurrencyAmount, Percent, TradeType } from '@uniswap/sdk-core'
import { Route, Trade } from '@uniswap/v3-sdk'
import { computed } from 'vue'
import { Asset } from '@/services/currency/types'
import { Eth as EthWallet } from '@/services/wallet'
import { SwapPool, SwapQuoter } from '@/services/uniswap'
import useEthWallet from './use-eth-wallet'
import useWeb3 from './use-web3'

interface tradePayload {
  fromAsset: Asset
  toAsset: Asset
  amount: number
}

export default function useUniswap() {
  const { web3 } = useWeb3()
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

    const swapPool = await getSwapPool(fromAsset, toAsset)
    const pool = swapPool.pool
    const quoter = new SwapQuoter()
    const quotedAmountOut = await quoter.quoteExactInputSingle(swapPool.immutables, amount)
    let tokenA, tokenB

    console.log(quotedAmountOut)

    if (fromAsset.tokenInfo?.address === pool.token0.address) {
      tokenA = pool.token0
      tokenB = pool.token1
    } else {
      tokenA = pool.token1
      tokenB = pool.token0
    }

    const swapRoute = new Route([pool], tokenA, tokenB)

    // create an unchecked trade instance
    const uncheckedTrade = Trade.createUncheckedTrade({
      route: swapRoute,
      inputAmount: CurrencyAmount.fromRawAmount(tokenA, amount.toString()),
      outputAmount: CurrencyAmount.fromRawAmount(tokenB, quotedAmountOut.toString()),
      tradeType: TradeType.EXACT_INPUT,
    })

    return uncheckedTrade
  }

  const swapAsset = async (payload: tradePayload) => {
    // create an unchecked trade instance
    const uncheckedTrade = await getTrade(payload)

    console.log('The unchecked trade object is', uncheckedTrade)

    // const chainId = Number(ethState.chainId)
    // const pair = await getPair(asset)
    // const route = getRoute(pair)
    // const trade = getTrade(route, fullamount)

    // const amountOutMin = trade.minimumAmountOut(slippageTolerance).raw
    // const path = [WETH[chainId as ChainId].address, asset.tokenInfo.address]
    // const to = ethState.address
    // const deadline = Math.floor(Date.now() / 1000) + 60 * 20
    // const value = trade.inputAmount.raw
    // const data = contract.methods
    //   .swapExactETHForTokens(web3.utils.toHex(amountOutMin.toString()), path, to, deadline)
    //   .encodeABI()

    // const rawTx = {
    //   from: ethState.address,
    //   to: address,
    //   data: data,
    //   value: web3.utils.toHex(value.toString()),
    // }
    // const txid = await EthWallet.sendRawTx(rawTx)

    // return txid
  }

  return {
    slippageTolerance: computed(() => slippageTolerance.toFixed(2)),
    getSwapPool,
    getPrice,
    getTrade,
    swapAsset,
  }
}
