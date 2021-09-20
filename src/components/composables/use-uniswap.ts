import {
  ChainId,
  Token,
  WETH,
  Pair,
  Fetcher,
  Route,
  Trade,
  TradeType,
  TokenAmount,
  Percent,
} from '@uniswap/sdk'
import { AbiItem } from 'web3-utils'
import { computed } from 'vue'
import { Asset } from '@/services/currency/types'
import { Eth as EthWallet } from '@/services/wallet'
import { uniswap } from '@/services/uniswap'
import abi from '@/services/uniswap/abi.json'
import useEthWallet from './use-eth-wallet'
import useWeb3 from './use-web3'

interface tradePayload {
  asset: Asset
  amount: number
}

export default function useUniswap() {
  const { web3 } = useWeb3()
  const { state: ethState } = useEthWallet()
  const slippageTolerance = new Percent('50', '10000') // 50 bips, or 0.50%

  const getPair = async (asset: Asset): Promise<Pair> => {
    if (!asset.tokenInfo) {
      throw new Error(`Invalid Asset`)
    }
    const chainId = Number(ethState.chainId)
    const token = new Token(chainId, asset.tokenInfo.address, Number(asset.tokenInfo.decimals))
    const pair = await Fetcher.fetchPairData(token, WETH[chainId as ChainId])
    return pair
  }

  const getRoute = async (pair: Pair): Promise<Route> => {
    const chainId = Number(ethState.chainId)
    const route = new Route([pair], WETH[chainId as ChainId])
    return route
  }

  const getTrade = async (route: Route, amountIn: string): Promise<Trade> => {
    const chainId = Number(ethState.chainId)
    const trade = new Trade(
      route,
      new TokenAmount(WETH[chainId as ChainId], amountIn),
      TradeType.EXACT_INPUT
    )
    return trade
  }

  const swapExactETHForTokens = async (payload: tradePayload): Promise<string> => {
    const { asset, amount } = payload

    if (!asset.tokenInfo) {
      throw new Error(`Invalid Asset`)
    }

    const address = uniswap.getAddress(ethState.chainId)
    const contract = new web3.eth.Contract(abi as AbiItem[], address)
    const fullamount = web3.utils.toWei(amount.toString(10), 'ether')

    const chainId = Number(ethState.chainId)
    const pair = await getPair(asset)
    const route = await getRoute(pair)
    const trade = await getTrade(route, fullamount)

    const amountOutMin = trade.minimumAmountOut(slippageTolerance).raw
    const path = [WETH[chainId as ChainId].address, asset.tokenInfo.address]
    const to = ethState.address
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20
    const value = trade.inputAmount.raw
    const data = contract.methods
      .swapExactETHForTokens(web3.utils.toHex(amountOutMin.toString()), path, to, deadline)
      .encodeABI()

    const rawTx = {
      from: ethState.address,
      to: address,
      data: data,
      value: web3.utils.toHex(value.toString()),
    }
    const txid = await EthWallet.sendRawTx(rawTx)

    return txid
  }

  return {
    slippageTolerance: computed(() => slippageTolerance),
    getPair,
    getRoute,
    getTrade,
    swapExactETHForTokens,
  }
}
