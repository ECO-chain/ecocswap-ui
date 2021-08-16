<template>
  <div class="home noselect">
    <SwapPanel class="swap-panel" />
    <EcocWallet class="ecoc-wallet" />
    <EthWallet class="alt-wallet" />

    <div class="ecoc-side">
      <img class="watetmark" src="@/assets/img/ecoc-watermark.svg" />
    </div>
    <div class="alt-side">
      <img class="watetmark" src="@/assets/img/eth-watermark.svg" />
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import EcocWallet from '@/components/Wallets/EcocWallet.vue'
import EthWallet from '@/components/Wallets/EthWallet.vue'
import SwapPanel from '@/components/Swap/SwapPanel.vue'

@Options({
  components: {
    EcocWallet,
    EthWallet,
    SwapPanel,
  },
})
export default class Home extends Vue {
  ecocWalletShow = true
  altWalletShow = false

  onEcocToggle(show: boolean) {
    console.log(show)
    this.ecocWalletShow = show
  }
}
</script>

<style scoped lang="scss">
.home {
  display: flex;
  align-items: stretch;
  z-index: 100;

  .ecoc-side {
    flex: 50%;
    background: #211733 0% 0% no-repeat padding-box;
    opacity: 1;

    text-align: right;
    padding-top: 100px;
    padding-right: 100px;
    color: #691c80;

    .watetmark {
      position: fixed;
      z-index: 0;
      top: 40%;
      left: 25%;
      opacity: 0.2;
    }
  }

  .alt-side {
    flex: 50%;
    background: transparent linear-gradient(180deg, #184f90 0%, #0c2848 100%) 0% 0% no-repeat
      padding-box;
    opacity: 1;

    text-align: left;
    padding-top: 100px;
    padding-left: 100px;
    color: #ff43c7;

    .watetmark {
      position: fixed;
      z-index: 0;
      top: 40%;
      right: 25%;
      opacity: 0.2;
      transform: translate(0%, -25%);
    }
  }

  .swap-panel {
    position: fixed;
    top: 311px;
    z-index: 102;
  }

  .ecoc-wallet {
    position: fixed;
    z-index: 102;
    top: 235px;
    left: -550px;
  }

  .alt-wallet {
    position: fixed;
    z-index: 102;
    top: 235px;
    right: -466px;
  }
}
</style>
