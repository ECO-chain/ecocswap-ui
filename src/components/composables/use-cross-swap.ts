import { reactive, ref, computed, watch } from 'vue'
import * as constants from '@/constants'
import { Asset } from '@/services/currency/types'
import { WalletParams } from '@/services/ecoc/types'
import * as utils from '@/services/utils'
import { Ecoc as EcocWallet } from '@/services/wallet'
import { Eth as EthWallet } from '@/services/wallet'
import { Erc20 } from '@/services/erc20'
import { Ecrc20 } from '@/services/ecrc20'
import { ecocswap } from '@/services/ecocswap'
import useEcocWallet from './use-ecoc-wallet'
import useEthWallet from './use-eth-wallet'

interface SupportedAssets {
  [type: string]: Asset[]
}

interface SwapPairs {
  [type: string]: string
}

interface lockAssetPayload {
  asset: Asset
  networkId: number
  destination: string
  amount: number
  gasCost: number
  walletParams: WalletParams
}

interface burnAssetPayload {
  asset: Asset
  fromAddress: string
  destination: string
  amount: number
}

const ecocSwapSupported = ['ECOC', 'EFG', 'GPT', 'BCST']
const ethSwapSupported = ['WECOC', 'WEFG', 'WGPT', 'WBCST']

const swapPairs = {
  ['ECOC']: 'WECOC',
  ['EFG']: 'WEFG',
  ['GPT']: 'WGPT',
  ['BCST']: 'WBCST',
} as SwapPairs

export default function useCrossSwap() {
  const { state: ecocState } = useEcocWallet()
  const { state: ethState } = useEthWallet()

  const amount = ref<string | number>('')
  const toAddress = ref<string>('')
  const fromAsset = ref<Asset>({} as Asset)
  const toAsset = ref<Asset>({} as Asset)
  const supportedAssets = reactive<SupportedAssets>({
    [constants.TYPE_ECOC]: ecocState.assets.filter((asset) =>
      ecocSwapSupported.includes(asset.symbol)
    ),
    [constants.TYPE_ETH]: ethState.assets.filter((asset) =>
      ethSwapSupported.includes(asset.symbol)
    ),
  })

  const ecocswapContract = computed(() => ecocswap.address)

  watch(ecocState.assets, () => {
    supportedAssets[constants.TYPE_ECOC] = ecocState.assets.filter((asset) =>
      ecocSwapSupported.includes(asset.symbol)
    )
  })
  watch(ethState.assets, () => {
    supportedAssets[constants.TYPE_ETH] = ethState.assets.filter((asset) =>
      ethSwapSupported.includes(asset.symbol)
    )
  })

  const getEcocFee = async (networkId: number) => {
    const gasCost = await ecocswap.getGasCost(networkId)
    const decimals = 8 // fee will be always as ecoc
    return utils.toDecimals(gasCost, decimals).toNumber()
  }

  const lockEcocAsset = async (payload: lockAssetPayload) => {
    const { asset, networkId, destination, amount, gasCost, walletParams } = payload
    let rawTx: string

    if (asset.type === constants.TYPE_ECOC) {
      rawTx = await ecocswap.lockECOC(amount, gasCost, destination, networkId, walletParams)
    } else if (asset.tokenInfo) {
      const token = new Ecrc20(asset.tokenInfo)
      const decimals = asset.tokenInfo.decimals
      const fullAmount = utils.fromDecimals(amount, decimals).toNumber()

      const allowance = await token.allowance(walletParams.address, ecocswap.address)

      if (fullAmount > allowance) {
        // waiting for ecrc-20 approve
        const approveTx = await token.approve(ecocswap.address, amount, walletParams)
        const approveTxid = await EcocWallet.sendRawTx(approveTx)

        await EcocWallet.waitForConfirmation(approveTxid)

        const newUtxos = await EcocWallet.getUtxos(walletParams.address)
        walletParams.utxoList = newUtxos
      }

      rawTx = await ecocswap.lockECRC20(
        fullAmount,
        gasCost,
        asset.tokenInfo.address,
        destination,
        networkId,
        walletParams
      )
    } else {
      rawTx = ''
    }

    const txid = await EcocWallet.sendRawTx(rawTx)
    return txid
  }

  const burnErc20Asset = async (payload: burnAssetPayload) => {
    const { asset, fromAddress, destination, amount } = payload
    let rawTx
    const destinationHex = '0x' + utils.toHexAddress(destination)

    if (asset.tokenInfo) {
      const token = new Erc20(asset.tokenInfo)
      rawTx = await token.burn(fromAddress, destinationHex, amount)
    } else {
      throw new Error(`Invalid Asset`)
    }

    const txid = await EthWallet.sendRawTx(rawTx)

    return txid
  }

  return {
    fromAsset,
    toAsset,
    amount,
    toAddress,
    swapPairs,
    supportedAssets,
    ecocswapContract,
    ecocSwapSupported,
    ethSwapSupported,
    getEcocFee,
    lockEcocAsset,
    burnErc20Asset,
  }
}
