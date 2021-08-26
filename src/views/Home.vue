<template>
  <div class="home noselect">
    <SwapPanel class="swap-panel" />
    <EcocWallet class="ecoc-wallet" />
    <EthWallet class="alt-wallet" />

    <div class="ecoc-lastblock">
      <span class="dot"></span>
      <span>{{ home.ecocLastBlock }}</span>
    </div>
    <div class="alt-lastblock">
      <span>{{ home.ethLastBlock }}</span>
      <span class="dot"></span>
    </div>

    <div class="ecoc-side">
      <img class="watetmark" src="@/assets/img/ecoc-watermark.svg" />
    </div>
    <div class="alt-side">
      <img class="watetmark" src="@/assets/img/eth-watermark.svg" />
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue, setup } from 'vue-class-component'
import EcocWallet from '@/components/Wallets/EcocWallet.vue'
import EthWallet from '@/components/Wallets/EthWallet.vue'
import SwapPanel from '@/components/Swap/SwapPanel.vue'
import useEcocWallet from '@/components/composables/use-ecoc-wallet'
import useEthWallet from '@/components/composables/use-eth-wallet'

@Options({
  components: {
    EcocWallet,
    EthWallet,
    SwapPanel,
  },
})
export default class Home extends Vue {
  home = setup(() => {
    const { lastBlock: ecocLastBlock } = useEcocWallet()
    const { lastBlock: ethLastBlock } = useEthWallet()

    return {
      ecocLastBlock,
      ethLastBlock,
    }
  })
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
    z-index: 103;
    top: 235px;
  }

  .alt-wallet {
    position: fixed;
    z-index: 102;
    top: 235px;
  }

  .ecoc-lastblock {
    position: fixed;
    top: 95%;
    left: 0;
    margin-left: 20px;
    color: #ff43c7;

    .dot {
      background-color: #ff43c7;
      margin-right: 5px;
    }
  }

  .alt-lastblock {
    position: fixed;
    top: 95%;
    right: 0;
    margin-right: 20px;
    color: #15bacf;

    .dot {
      background-color: #15bacf;
      margin-left: 5px;
    }
  }
}

.dot {
  height: 10px;
  width: 10px;
  border-radius: 50%;
  display: inline-block;
}
</style>
