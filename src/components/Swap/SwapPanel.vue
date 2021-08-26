<template>
  <div class="swap-panel">
    <div class="ecoc-side">
      <div :class="wallet.isECOCLogedIn ? 'wraper' : 'wraper'">
        <SwapSelection
          :assets="swap.ecocSupportedAssets"
          :selectedIndex="swap.ecocSelectedIndex"
          @onSelect="swap.selectEcocIndex"
        />
        <SwapInput class="input ecoc" key="ecoc-input" v-model:amount="swap.ecocAmount" />
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
          <SwapInput class="input alt" key="wrap-ecoc-input" v-model:amount="swap.wrapAmount" />
        </div>

        <div class="alt-swap">
          <div :class="swap.canAltSwap ? 'btn-icon' : 'btn-icon disable'" @click="swap.altSwap">
            <img class="icon" src="@/assets/img/swap-unavailable.svg" alt="alt-swap" />
          </div>
        </div>

        <div class="alt-assets">
          <AssetsSelection bg="bg-white" :assets="wallet.altAssets" />
          <SwapInput class="input alt" key="alt-input" v-model:amount="swap.altAmount" />
        </div>
      </div>

      <div class="cross-swap">
        <div :class="swap.canConvert ? 'btn-icon' : 'btn-icon disable'" @click="swap.convert">
          <img class="icon" src="@/assets/img/swap-unavailable.svg" alt="cross-swap" />
        </div>
      </div>
    </div>

    <ConvertConfirmation
      v-model:isOpen="swap.conversion.isOpen"
      :fromAsset="swap.fromAsset"
      :toAsset="swap.toAsset"
      v-model:toAddress="swap.toAddress"
      :amount="swap.amount"
      @onConfirm="swap.convertConfirm"
    />

    <SwapConfirmation
      v-model:isOpen="swap.altSwapping.isOpen"
      :fromAsset="swap.fromAsset"
      :toAsset="swap.toAsset"
      :toAddress="swap.toAddress"
      :amount="swap.amount"
      @onConfirm="swap.swapConfirm"
    />
  </div>
</template>

<script lang="ts">
import { Options, Vue, setup } from 'vue-class-component'
import { ref, computed, watch, provide } from 'vue'
import { Asset } from '@/services/currency/types'
import useEcocWallet from '@/components/composables/use-ecoc-wallet'
import useEthWallet from '@/components/composables/use-eth-wallet'
import useCrossSwap from '@/components/composables/use-cross-swap'
import useModal from '@/components/composables/modals/use-modal'
import AssetsSelection from '@/components/Wallets/AssetsSelection.vue'
import ConvertConfirmation from '@/components/Modals/ConvertConfirmation.vue'
import SwapConfirmation from '@/components/Modals/SwapConfirmation.vue'
import SwapSelection from './SwapSelection.vue'
import SwapInput from './SwapInput.vue'

@Options({
  components: { AssetsSelection, SwapSelection, SwapInput, ConvertConfirmation, SwapConfirmation },
})
export default class SwapPanel extends Vue {
  wallet = setup(() => {
    const { isLogedIn: isECOCLogedIn } = useEcocWallet()
    const { isLogedIn: isAltLogedIn, assets: ethAssets } = useEthWallet()

    return {
      isECOCLogedIn,
      isAltLogedIn,
      altAssets: ethAssets,
    }
  })

  swap = setup(() => {
    const { address: ecocAddress } = useEcocWallet()
    const { address: ethAddress } = useEthWallet()
    const { supportedAssets, swapPairs, fromAsset, toAsset, toAddress, amount } = useCrossSwap()
    const { amount: ecocAmount } = useCrossSwap()
    const { amount: wrapAmount } = useCrossSwap()
    const { amount: altAmount } = useCrossSwap()
    const conversion = useModal()
    const altSwapping = useModal()

    const ecocSupportedAssets = ref<Asset[]>(supportedAssets.ECOC)
    const altSupportedAssets = ref<Asset[]>(supportedAssets.ETH)
    const ecocSelectedIndex = ref(0)
    const altSelectedIndex = ref(0)

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
    provide(
      'toAddress',
      computed(() => toAddress.value)
    )

    watch(ecocAmount, (_amount) => {
      if (_amount > 0) {
        fromAsset.value = ecocAsset.value
        toAsset.value = altAsset.value
        toAddress.value = ethAddress.value
        amount.value = ecocAmount.value
      }
    })

    watch(wrapAmount, (_amount) => {
      if (_amount > 0) {
        fromAsset.value = altAsset.value
        toAsset.value = ecocAsset.value
        toAddress.value = ecocAddress.value
        amount.value = wrapAmount.value
      }
    })

    const selectEcocIndex = (index: number) => {
      ecocSelectedIndex.value = index

      const pairedSymbol = swapPairs[ecocAsset.value.symbol]
      const pairedIndex = altSupportedAssets.value.findIndex(
        (asset) => asset.symbol === pairedSymbol
      )

      if (pairedIndex >= 0) {
        altSelectedIndex.value = pairedIndex
        console.log('altSelectedIndex', altSelectedIndex.value)
      }
    }

    const selectAltIndex = (index: number) => {
      altSelectedIndex.value = index

      const pairedSymbol = Object.keys(swapPairs).find(
        (key) => swapPairs[key] === altAsset.value.symbol
      )
      const pairedIndex = altSupportedAssets.value.findIndex(
        (asset) => asset.symbol === pairedSymbol
      )

      if (pairedIndex >= 0) {
        ecocSelectedIndex.value = pairedIndex
        console.log('ecocSelectedIndex', ecocSelectedIndex.value)
      }
    }

    const convert = () => {
      conversion.open()
    }

    const altSwap = () => {
      altSwapping.open()
    }

    const convertConfirm = () => {
      console.log(
        `Convertion ${fromAsset.value.symbol} to ${toAsset.value.symbol} to ${toAddress.value}`
      )
    }

    const swapConfirm = () => {
      console.log(`Swapping ${fromAsset.value.symbol} to ${toAsset.value.symbol}`)
    }

    return {
      altSwapping: altSwapping.state,
      conversion: conversion.state,
      ecocSupportedAssets,
      altSupportedAssets,
      fromAsset,
      toAsset,
      amount,
      ecocAmount,
      wrapAmount,
      altAmount,
      ecocSelectedIndex,
      altSelectedIndex,
      canConvert,
      canAltSwap,
      selectEcocIndex,
      selectAltIndex,
      convertConfirm,
      swapConfirm,
      convert,
      altSwap,
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
