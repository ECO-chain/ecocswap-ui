<template>
  <div class="eth-wallet" flat>
    <transition name="panel">
      <div :class="{ active: showWallet }">
        <div class="eth-wallet-panel">
          <div class="header">
            <div class="header-pin" @click="walletToggle">
              <div class="text">ETHWallet</div>
            </div>
          </div>
          <div class="panel">
            <div class="wraper"></div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'

@Options({})
export default class EthWallet extends Vue {
  showWallet = false

  walletToggle() {
    this.showWallet = !this.showWallet
  }
}
</script>

<style scoped lang="scss">
.eth-wallet {
  top: 0;
  right: 0;
}

.eth-wallet-panel {
  transform: translate(466px);
  transition: 1s;
  width: 600px;

  .header {
    height: 70px;
    background: #ffffff 0% 0% no-repeat padding-box;
    box-shadow: 0px 3px 6px #00000029;
    border-radius: 35px 0px 0px 35px;
    opacity: 1;

    &-pin {
      float: left;
      width: 134px;
      height: 70px;
      cursor: pointer;

      .text {
        position: relative;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: #15bacf;
        font-weight: bold;
      }
    }
  }

  .panel {
    float: right;
    width: 466px;
    height: 525px;
    background: #ffffff 0% 0% no-repeat padding-box;
    border-radius: 0px 0px 0px 16px;
    box-shadow: 0px 3px 0px #00000029;
    opacity: 1;

    .wraper {
      width: 520px;
      margin: auto;
    }
  }
}

.active .eth-wallet-panel {
  transform: initial;
  transition: 0.5s;
}
</style>
