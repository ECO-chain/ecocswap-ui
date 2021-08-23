import { ref, computed } from 'vue'
import { WalletError } from '@/exceptions/wallet'
import { WalletParams } from '@/services/ecoc/types'
import { Asset } from '@/services/currency/types'
import { Ecoc as EcocWallet } from '@/services/wallet'
import { DEFAULT } from '@/services/contract'
import { getEcocTotalFee } from '@/services/utils'
import useEcocWallet from './use-ecoc-wallet'

export default function useEcocTransaction(asset: Asset) {
  const { isLogedIn, address, keystore } = useEcocWallet()
  const feeTierList = ref([0.004, 0.01, 0.1])
  const feeTier = ref(1)
  const gasLimit = ref(DEFAULT.DEFAULT_GAS_LIMIT)
  const gasPrice = ref(DEFAULT.DEFAULT_GAS_PRICE)

  const isNative = computed(() => asset.symbol === 'ECOC')
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

  const confirm = async (password: string) => {
    if (!isLogedIn) {
      Promise.reject(new WalletError('Please connect to ecoc wallet first'))
    }

    try {
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
    } catch (error) {
      Promise.reject(error)
    }
  }

  return {
    feeTierList: computed(() => feeTierList.value),
    feeTier: computed(() => feeTier.value),
    totalFee,
    gasLimit,
    gasPrice,
    confirm,
    changeFeeTier,
  }
}
