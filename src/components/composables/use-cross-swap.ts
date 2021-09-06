import { reactive, ref, computed } from 'vue'
import * as constants from '@/constants'
import { Asset } from '@/services/currency/types'
import { WalletParams } from '@/services/ecoc/types'
import * as utils from '@/services/utils'
import { Ecoc as EcocWallet } from '@/services/wallet'
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

const ecocSwapSupported = ['ECOC', 'EFG']
const ethSwapSupported = ['WECOC', 'WEFG']

const swapPairs = {
  ['ECOC']: 'WECOC',
  ['EFG']: 'WEFG',
  ['GPT']: 'WGPT',
} as SwapPairs

export default function useCrossSwap() {
  const { assets: ecocAssets } = useEcocWallet()
  const { assets: ethAssets } = useEthWallet()
  const amount = ref<string | number>('')
  const toAddress = ref<string>('')
  const fromAsset = ref<Asset>({} as Asset)
  const toAsset = ref<Asset>({} as Asset)
  const supportedAssets = reactive<SupportedAssets>({
    [constants.TYPE_ECOC]: ecocAssets.value,
    [constants.TYPE_ETH]: ethAssets.value,
  })

  const ecocswapContract = computed(() => ecocswap.address)

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
        amount,
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
  }
}
