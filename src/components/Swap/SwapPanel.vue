<template>
  <div class="swap-panel">
    <div class="ecoc-side">
      <AssetsSelection class="asset-selection" />
      <SwapInput class="input" key="ecoc-input" />
    </div>

    <div class="alt-side">
      <div class="ecoc-assets">
        <AssetsSelection class="asset-selection" />
        <SwapInput class="input" key="wrap-ecoc-input" />
      </div>

      <div class="alt-swap">
        <div class="btn-button">
          <img class="icon" src="@/assets/img/swap-unavailable.svg" alt="alt-swap" />
        </div>
      </div>

      <div class="alt-assets">
        <AssetsSelection />
        <SwapInput class="input" key="alt-input" />
      </div>
    </div>

    <div class="cross-swap">
      <div class="btn-button">
        <img class="icon" src="@/assets/img/swap-unavailable.svg" alt="cross-swap" />
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

  .ecoc-side {
    flex: 50%;
    width: 500px;
    min-width: 300px;
    margin-right: 60px;

    .assets-selection {
    }

    .input {
      margin-top: 20px;
    }
  }

  .alt-side {
    flex: 50%;
    display: flex;
    width: 500px;
    min-width: 300px;
    margin-left: 60px;

    .ecoc-assets {
      flex: 50%;
    }

    .alt-assets {
      flex: 50%;
    }

    .alt-swap {
      position: relative;
      top: 25%;
      margin: 15px;

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

.btn-button {
  cursor: pointer;
  background: #ffffff 0% 0% no-repeat padding-box;
  box-shadow: 0px 3px 6px #00000029;
  padding: 14px;
  border-radius: 50%;
  height: auto;
  width: auto;

  .icon {
    transform: translate(0, 10%);
  }

  &:hover {
    opacity: 0.8;
  }
}
</style>
