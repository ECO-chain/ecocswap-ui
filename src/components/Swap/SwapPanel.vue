<template>
  <div class="swap-panel">
    <div class="ecoc-side">
      <div :class="swap.isECOCLogedIn ? 'wraper' : 'wraper'">
        <AssetsSelection
          :assets="swap.ecocSupportedAssets"
          :selectedIndex="swap.ecocSelectedIndex"
          @onSelect="swap.selectEcocIndex"
        />
        <SwapInput class="input" key="ecoc-input" />
      </div>
    </div>

    <div class="alt-side">
      <div :class="swap.isAltLogedIn ? 'wraper' : 'wraper'">
        <div class="ecoc-assets">
          <AssetsSelection
            :assets="swap.altSupportedAssets"
            :selectedIndex="swap.altSelectedIndex"
            @onSelect="swap.selectAltIndex"
          />
          <SwapInput class="input" key="wrap-ecoc-input" />
        </div>

        <div class="alt-swap">
          <div class="btn-icon">
            <img class="icon" src="@/assets/img/swap-unavailable.svg" alt="alt-swap" />
          </div>
        </div>

        <div class="alt-assets">
          <AssetsSelection bg="bg-white" :assets="swap.altAssets" />
          <SwapInput class="input" key="alt-input" />
        </div>
      </div>

      <div class="cross-swap">
        <div class="btn-icon">
          <img class="icon" src="@/assets/img/swap-unavailable.svg" alt="cross-swap" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue, setup } from 'vue-class-component'
import { ref, watchEffect, computed } from 'vue'
import { Asset } from '@/services/currency/types'
import useEcocWallet from '@/components/composables/use-ecoc-wallet'
import useEthWallet from '@/components/composables/use-eth-wallet'
import useCrossSwap from '@/components/composables/use-cross-swap'
import AssetsSelection from '@/components/Wallets/AssetsSelection.vue'
import SwapInput from './SwapInput.vue'

@Options({
  components: { AssetsSelection, SwapInput },
})
export default class SwapPanel extends Vue {
  swap = setup(() => {
    const { isLogedIn: isECOCLogedIn } = useEcocWallet()
    const { isLogedIn: isAltLogedIn, assets: ethAssets } = useEthWallet()
    const { supportedAssets, swapPairs } = useCrossSwap()

    const ecocSupportedAssets = ref<Asset[]>([])
    const altSupportedAssets = ref<Asset[]>([])
    const ecocSelectedIndex = ref(0)
    const altSelectedIndex = ref(0)

    watchEffect(() => {
      ecocSupportedAssets.value = supportedAssets.ECOC
      altSupportedAssets.value = supportedAssets.ETH
    })

    const selectEcocIndex = (index: number) => {
      const ecocAsset = ecocSupportedAssets.value[index]
      const pairedSymbol = swapPairs[ecocAsset.symbol]
      const pairedIndex = altSupportedAssets.value.findIndex(
        (asset) => asset.symbol === pairedSymbol
      )

      if (pairedIndex >= 0) {
        altSelectedIndex.value = pairedIndex
        console.log('altSelectedIndex', altSelectedIndex.value)
      }
    }

    const selectAltIndex = (index: number) => {
      const altAsset = altSupportedAssets.value[index]
      const pairedSymbol = Object.keys(swapPairs).find((key) => swapPairs[key] === altAsset.symbol)
      const pairedIndex = altSupportedAssets.value.findIndex(
        (asset) => asset.symbol === pairedSymbol
      )

      if (pairedIndex >= 0) {
        ecocSelectedIndex.value = pairedIndex
        console.log('ecocSelectedIndex', ecocSelectedIndex.value)
      }
    }

    return {
      isECOCLogedIn,
      isAltLogedIn,
      ecocSelectedIndex,
      altSelectedIndex,
      ecocSupportedAssets: computed(() => ecocSupportedAssets.value),
      altSupportedAssets: computed(() => altSupportedAssets.value),
      altAssets: ethAssets,
      selectEcocIndex,
      selectAltIndex,
    }
  })
}
</script>

<style scoped lang="scss">
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
