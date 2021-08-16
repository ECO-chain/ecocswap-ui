<template>
  <div class="swap-panel">
    <div class="ecoc-side">
      <div class="wraper">
        <AssetsSelection class="asset-selection" />
        <SwapInput class="input" key="ecoc-input" />
      </div>
    </div>

    <div class="alt-side">
      <div class="wraper">
        <div class="ecoc-assets">
          <AssetsSelection class="asset-selection" />
          <SwapInput class="input" key="wrap-ecoc-input" />
        </div>

        <div class="alt-swap">
          <div class="btn-icon">
            <img class="icon" src="@/assets/img/swap-unavailable.svg" alt="alt-swap" />
          </div>
        </div>

        <div class="alt-assets">
          <AssetsSelection />
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
import { Options, Vue } from 'vue-class-component'
import AssetsSelection from '@/components/Wallets/AssetsSelection.vue'
import SwapInput from './SwapInput.vue'

@Options({
  components: { AssetsSelection, SwapInput },
})
export default class SwapPanel extends Vue {
  isECOCLogedIn = true
  isAltLogedIn = true
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
