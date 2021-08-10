<template>
  <div class="home">
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

@Options({
  components: {
    EcocWallet,
    EthWallet,
  },
})
export default class Home extends Vue {}
</script>

<style scoped lang="scss">
.home {
  display: flex;
  align-items: stretch;
  height: 100%;

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
      top: 40%;
      left: 25%;
      opacity: 0.2;
      z-index: 0;
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
      top: 40%;
      right: 25%;
      opacity: 0.2;
      z-index: 10;
      transform: translate(0%, -25%);
    }
  }

  .ecoc-wallet {
    position: fixed;
    top: 235px;
    left: 0;
    z-index: 100;
  }

  .alt-wallet {
    position: fixed;
    top: 235px;
    right: 0;
    z-index: 100;
  }
}
</style>
