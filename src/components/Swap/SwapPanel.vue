<template>
  <div class="swap-panel">
    <div class="ecoc-side">
      <div :class="wallet.isECOCLogedIn ? 'wraper' : 'wraper'">
        <SwapSelection
          :assets="swap.ecocSupportedAssets"
          :selectedIndex="swap.ecocSelectedIndex"
          @onSelect="swap.selectEcocIndex"
        />
        <SwapInput
          v-model:amount="swap.ecocAmount"
          :decimal="swap.ecocAsset.tokenInfo?.decimals"
          :price="swap.ecocAsset.price"
          class="input ecoc"
          @onMax="swap.onEcocMax"
        />
      </div>
    </div>

    <div class="alt-side">
      <div :class="wallet.isAltLogedIn ? 'wraper' : 'wraper'">
        <div class="ecoc-assets">
          <SwapSelection
            :assets="swap.altSupportedAssets"
            :selectedIndex="swap.altSelectedIndex"
            @onSelect="swap.selectAltIndex"
          />
          <SwapInput
            v-model:amount="swap.wrapAmount"
            :decimal="swap.altAsset.tokenInfo?.decimals"
            :price="swap.altAsset.price"
            class="input alt"
            @onMax="swap.onWrapMax"
          />
        </div>

        <div class="alt-swap">
          <div :class="swap.canAltSwap ? 'btn-icon' : 'btn-icon disable'" @click="swap.altSwap">
            <img class="icon" src="@/assets/img/swap-unavailable.svg" alt="alt-swap" />
          </div>
        </div>

        <div class="alt-assets">
          <AssetsSelection
            bg="bg-white"
            :assets="wallet.altAssets"
            @onSelect="wallet.selectAltAssets"
          />
          <SwapInput
            v-model:amount="swap.altAmount"
            :decimal="wallet.altSelectedAsset.tokenInfo?.decimals"
            :price="wallet.altSelectedAsset.price"
            class="input alt"
            @onMax="swap.onAltMax"
          />
        </div>
      </div>

      <div class="cross-swap">
        <div :class="swap.canConvert ? 'btn-icon' : 'btn-icon disable'" @click="swap.convert">
          <img class="icon" src="@/assets/img/swap-unavailable.svg" alt="cross-swap" />
        </div>
      </div>
    </div>

    <ConvertConfirmation
      v-if="swap.conversion.isOpen"
      v-model:isOpen="swap.conversion.isOpen"
      v-model:toAddress="swap.toAddress"
      :fromAsset="swap.fromAsset"
      :toAsset="swap.toAsset"
      :amount="swap.amount"
      @onConfirm="swap.convertConfirm"
    />

    <SwapConfirmation
      v-if="swap.altSwapping.isOpen"
      v-model:isOpen="swap.altSwapping.isOpen"
      :fromAsset="swap.fromAsset"
      :toAsset="swap.toAsset"
      :toAddress="swap.toAddress"
      :amount="swap.amount"
      @onConfirm="swap.swapConfirm"
    />

    <TxConfirmation
      v-if="swap.confirmation.isOpen"
      v-model:isOpen="swap.confirmation.isOpen"
      :asset="swap.fromAsset"
      :toAddress="swap.ecocswapContract"
      :amount="swap.ecocNeeded"
      :isContract="true"
      :extraFee="swap.gasCost"
      @onConfirm="swap.onEcocConfirm"
    />

    <TxResult
      v-if="swap.result.isOpen"
      v-model:isOpen="swap.result.isOpen"
      v-model:txid="swap.result.txid"
      v-model:errorMsg="swap.result.errorMsg"
      v-model:loadingMsg="swap.result.loadingMsg"
      :txType="swap.result.txType"
    />
  </div>
</template>

<script lang="ts">
/* eslint-disable */
import { Options, Vue, setup } from 'vue-class-component'
import { ref, computed, watch, watchEffect, provide } from 'vue'
import { Asset } from '@/services/currency/types'
import { WalletParams } from '@/services/ecoc/types'
import * as constants from '@/constants'
import useEcocWallet from '@/components/composables/use-ecoc-wallet'
import useEthWallet from '@/components/composables/use-eth-wallet'
import useCrossSwap from '@/components/composables/use-cross-swap'
import useUniswap from '@/components/composables/use-uniswap'
import useTxResult from '@/components/composables/modals/use-tx-result'
import useModal from '@/components/composables/modals/use-modal'
import AssetsSelection from '@/components/Wallets/AssetsSelection.vue'
import ConvertConfirmation from '@/components/Modals/ConvertConfirmation.vue'
import SwapConfirmation from '@/components/Modals/SwapConfirmation.vue'
import TxResult from '@/components/Modals/TxResult.vue'
import TxConfirmation from '@/components/Modals/TxConfirmation.vue'
import SwapSelection from './SwapSelection.vue'
import SwapInput from './SwapInput.vue'

@Options({
  components: {
    AssetsSelection,
    SwapSelection,
    SwapInput,
    ConvertConfirmation,
    SwapConfirmation,
    TxResult,
    TxConfirmation,
  },
})
export default class SwapPanel extends Vue {
  wallet = setup(() => {
    const { isLogedIn: isECOCLogedIn } = useEcocWallet()
    const {
      isLogedIn: isAltLogedIn,
      assets: ethAssets,
      selectAsset: selectEthAsset,
      selectedAsset: ethSelectedAsset,
    } = useEthWallet()

    return {
      isECOCLogedIn,
      isAltLogedIn,
      altAssets: ethAssets,
      selectAltAssets: selectEthAsset,
      altSelectedAsset: ethSelectedAsset,
    }
  })

  swap = setup(() => {
    const { swapAsset } = useUniswap()
    const { address: ecocAddress } = useEcocWallet()
    const { address: ethAddress, state: ethState, selectedAsset: ethSelectedAsset } = useEthWallet()
    const {
      supportedAssets,
      swapPairs,
      fromAsset,
      toAsset,
      toAddress,
      amount,
      ecocswapContract,
      ecocSwapSupported,
      ethSwapSupported,
      getEcocFee,
      lockEcocAsset,
      burnErc20Asset,
    } = useCrossSwap()
    const { amount: ecocAmount } = useCrossSwap()
    const { amount: wrapAmount } = useCrossSwap()
    const { amount: altAmount } = useCrossSwap()
    const result = useTxResult()
    const confirmation = useModal()
    const conversion = useModal()
    const altSwapping = useModal()

    const ecocSupportedAssets = ref<Asset[]>(supportedAssets.ECOC)
    const altSupportedAssets = ref<Asset[]>(supportedAssets.ETH)
    const ecocSelectedIndex = ref(0)
    const altSelectedIndex = ref(0)
    const ecocNeeded = ref(0)
    const gasCost = ref(0)

    const ecocAsset = computed(() => ecocSupportedAssets.value[ecocSelectedIndex.value])
    const altAsset = computed(() => altSupportedAssets.value[altSelectedIndex.value])
    const canConvert = computed(() => Number(ecocAmount.value) > 0 || Number(wrapAmount.value) > 0)
    const canAltSwap = computed(() => Number(wrapAmount.value) > 0 || Number(altAmount.value) > 0)

    provide(
      'fromAsset',
      computed(() => fromAsset.value)
    )
    provide(
      'toAsset',
      computed(() => toAsset.value)
    )

    watch(ecocAmount, (_amount) => {
      if (_amount > 0) {
        wrapAmount.value = ''
      }
    })
    watch(wrapAmount, (_amount) => {
      if (_amount > 0) {
        ecocAmount.value = ''
        altAmount.value = ''
      }
    })

    watchEffect(() => {
      ecocSupportedAssets.value = supportedAssets.ECOC
      altSupportedAssets.value = supportedAssets.ETH
    })

    const selectEcocIndex = (index: number) => {
      ecocSelectedIndex.value = index

      const pairedSymbol = swapPairs[ecocAsset.value.symbol]
      const pairedIndex = altSupportedAssets.value.findIndex(
        (asset) => asset.symbol === pairedSymbol
      )

      if (pairedIndex >= 0) {
        altSelectedIndex.value = pairedIndex
      }
    }

    const selectAltIndex = (index: number) => {
      altSelectedIndex.value = index

      const pairedSymbol = Object.keys(swapPairs).find(
        (key) => swapPairs[key] === altAsset.value.symbol
      )

      const pairedIndex = ecocSupportedAssets.value.findIndex(
        (asset) => asset.symbol === pairedSymbol
      )

      if (pairedIndex >= 0) {
        ecocSelectedIndex.value = pairedIndex
      }
    }

    const convert = () => {
      if (wrapAmount.value > 0) {
        fromAsset.value = altAsset.value
        toAsset.value = ecocAsset.value
        toAddress.value = ecocAddress.value
        amount.value = wrapAmount.value
      } else if (ecocAmount.value > 0) {
        fromAsset.value = ecocAsset.value
        toAsset.value = altAsset.value
        toAddress.value = ethAddress.value
        amount.value = ecocAmount.value
      }

      conversion.open()
    }

    const altSwap = () => {
      if (wrapAmount.value > 0) {
        fromAsset.value = altAsset.value
        toAsset.value = ethSelectedAsset.value
        amount.value = wrapAmount.value
      } else if (altAmount.value > 0) {
        fromAsset.value = ethSelectedAsset.value
        toAsset.value = altAsset.value
        amount.value = altAmount.value
      }

      toAddress.value = ethAddress.value
      altSwapping.open()
    }

    const convertConfirm = async () => {
      conversion.close()
      if (
        fromAsset.value.type === constants.TYPE_ECOC ||
        fromAsset.value.type === constants.TYPE_ECRC20
      ) {
        const networkId = parseInt(ethState.chainId, 16)
        gasCost.value = await getEcocFee(networkId)

        if (fromAsset.value.symbol == constants.TYPE_ECOC) {
          ecocNeeded.value = Number(amount.value)
        } else {
          ecocNeeded.value = Number(amount.value)
        }

        confirmation.open()
      } else if (fromAsset.value.type === constants.TYPE_ERC20) {
        result.setLoading(`Converting from ${fromAsset.value.symbol} to\n ${toAsset.value.symbol}`)
        result.open('eth')

        const payload = {
          asset: fromAsset.value,
          fromAddress: ethAddress.value,
          destination: toAddress.value,
          amount: Number(amount.value),
        }

        burnErc20Asset(payload)
          .then((txid) => {
            setTimeout(() => {
              result.success(txid)
              wrapAmount.value = ''
            }, 2000)
          })
          .catch((error) => {
            result.error(error.message ? error.message : error)
          })
      } else {
        //
      }
    }

    const swapConfirm = () => {
      altSwapping.close()
      result.setLoading(`Converting from ${fromAsset.value.symbol} to\n ${toAsset.value.symbol}`)
      result.open('eth')

      const payload = {
        fromAsset: fromAsset.value,
        toAsset: toAsset.value,
        amount: Number(amount.value),
      }
      swapAsset(payload).then((txid) => {
          setTimeout(() => {
            result.success(txid)
            ecocAmount.value = ''
          }, 1000)
        })
        .catch((error) => {
          result.error(error.message ? error.message : error)
        })
    }

    const onEcocConfirm = (walletParams: WalletParams) => {
      confirmation.close()
      result.setLoading(`Converting from ${fromAsset.value.symbol} to\n ${toAsset.value.symbol}`)
      result.open()

      const networkId = parseInt(ethState.chainId, 16)

      const payload = {
        asset: fromAsset.value,
        networkId: networkId,
        destination: toAddress.value,
        amount: Number(amount.value),
        gasCost: gasCost.value,
        walletParams: walletParams,
      }

      lockEcocAsset(payload)
        .then((txid) => {
          setTimeout(() => {
            result.success(txid)
            ecocAmount.value = ''
          }, 2000)
        })
        .catch((error) => {
          result.error(error.message ? error.message : error)
        })
    }

    const onEcocMax = () => {
      ecocAmount.value = ecocAsset.value.amount
    }

    const onWrapMax = () => {
      wrapAmount.value = altAsset.value.amount
    }

    const onAltMax = () => {
      altAmount.value = ethSelectedAsset.value.amount
    }

    return {
      result: result.state,
      confirmation: confirmation.state,
      altSwapping: altSwapping.state,
      conversion: conversion.state,
      ecocSupportedAssets,
      ecocAsset,
      altSupportedAssets,
      altAsset,
      fromAsset,
      toAsset,
      amount,
      toAddress,
      ecocAmount,
      wrapAmount,
      altAmount,
      ecocSelectedIndex,
      altSelectedIndex,
      canConvert,
      canAltSwap,
      ecocswapContract,
      ecocNeeded,
      gasCost,
      ecocSwapSupported,
      ethSwapSupported,
      selectEcocIndex,
      selectAltIndex,
      convertConfirm,
      swapConfirm,
      convert,
      altSwap,
      onEcocConfirm,
      onEcocMax,
      onWrapMax,
      onAltMax,
    }
  })
}
</script>

<style scoped lang="scss">
.ecoc {
  color: #691c80;
}
.alt {
  color: #15bacf;
}
.swap-panel {
  display: flex;
  align-items: stretch;
  height: auto;
  width: 100%;

  .ecoc-side {
    flex: 50%;

    .wraper {
      margin: 0 auto;
      max-width: 500px;
      min-width: 200px;
      margin-right: 110px;
    }
    @media only screen and (max-width: 400px) {
      .wraper {
        margin: 0 auto;
      }
    }

    .input {
      margin-top: 20px;
    }
  }

  .alt-side {
    flex: 50%;

    .wraper {
      max-width: 500px;
      min-width: 200px;
      margin: 0 auto;
      margin-left: 110px;
      display: flex;
    }
    @media only screen and (max-width: 400px) {
      .wraper {
        margin: 0 auto;
      }
    }

    .ecoc-assets {
      flex: 50%;
    }

    .alt-assets {
      flex: 50%;
    }

    .alt-swap {
      position: relative;
      margin: auto 15px;

      .icon {
        width: 33px;
        height: 27px;
      }
    }

    .input {
      margin-top: 20px;
    }
  }

  .cross-swap {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    .icon {
      width: 33px;
      height: 27px;
    }
  }
}
</style>
