import { ref, computed } from 'vue'
import { WalletError } from '@/exceptions/wallet'
import { WalletParams } from '@/services/ecoc/types'
import { Asset } from '@/services/currency/types'
import { Ecoc as EcocWallet } from '@/services/wallet'
import { DEFAULT } from '@/services/contract'
import { getEcocTotalFee } from '@/services/utils'
import useEcocWallet from './use-ecoc-wallet'

export default function useEcocTransaction(_asset: Asset) {
  const { isLogedIn, address, keystore } = useEcocWallet()
  const asset = ref(_asset)
  const feeTierList = ref([0.004, 0.01, 0.1])
  const feeTier = ref(1)
  const gasLimit = ref(DEFAULT.DEFAULT_GAS_LIMIT)
  const gasPrice = ref(DEFAULT.DEFAULT_GAS_PRICE)

  const assetSymbol = computed(() => asset.value.symbol)
  const tokenAddress = computed(() => asset.value.tokenInfo?.address)
  const tokenName = computed(() => asset.value.tokenInfo?.name)
  const isNative = computed(() => asset.value.symbol === 'ECOC')
  const isToken = computed(() => typeof asset.value.tokenInfo !== 'undefined')
  const currentFee = computed(() => feeTierList.value[feeTier.value])
  const totalFee = computed(() => {
    if (isNative.value) return currentFee.value
    return getEcocTotalFee(currentFee.value, gasPrice.value, gasLimit.value)
  })

  const changeFeeTier = (tier: number) => {
    if (tier >= 0 && tier < feeTierList.value.length) {
      feeTier.value = tier
    }
  }

  const changeAsset = (_asset: Asset) => {
    asset.value = _asset
  }

  const txConfirm = async (password: string) => {
    if (!isLogedIn) {
      throw new WalletError('Please connect to ecoc wallet first')
    }

    const wallet = EcocWallet.importFromKeystore(keystore.value, password)
    const utxoList = await wallet.getUtxoList()

    const walletParams = {
      address: address.value,
      keypair: wallet.keypair,
      utxoList: utxoList,
      fee: currentFee.value,
      gasLimit: gasLimit.value,
      gasPrice: gasPrice.value,
    } as WalletParams

    return walletParams
  }

  return {
    feeTierList: computed(() => feeTierList.value),
    feeTier: computed(() => feeTier.value),
    assetSymbol,
    tokenAddress,
    tokenName,
    isNative,
    isToken,
    totalFee,
    gasLimit,
    gasPrice,
    txConfirm,
    changeFeeTier,
    changeAsset,
  }
}
