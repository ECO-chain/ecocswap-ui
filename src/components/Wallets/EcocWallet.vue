<template>
  <div v-if="show" class="ecoc-wallet">
    <div class="header">
      <img class="logo" src="@/assets/img/ecoc-wallet.svg" />
    </div>
    <div class="panel">
      <div class="wraper">
        <WalletSelection />
        <div class="wallet-info"></div>
        <div class="bottom">
          <div class="link">Disconnect</div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="ecoc-wallet-pin" flat>
    <img class="logo" src="@/assets/img/ecoc-wallet.svg" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import WalletSelection from './WalletSelection.vue'

@Options({
  components: { WalletSelection },
})
export default class EcocWallet extends Vue {
  show = false
}
</script>

<style scoped lang="scss">
.ecoc-wallet {
  .header {
    width: 660px;
    height: 70px;
    background: #ffffff 0% 0% no-repeat padding-box;
    box-shadow: 0px 3px 6px #00000029;
    border-radius: 0px 35px 35px 0px;
    opacity: 1;

    .logo {
      position: relative;
      top: 50%;
      left: 40%;
      height: 27px;
      width: 30px;
      transform: translate(0, -50%);
    }
  }

  .panel {
    width: 550px;
    height: 525px;
    background: #ffffff 0% 0% no-repeat padding-box;
    border-radius: 0px 0px 16px 0px;
    box-shadow: 0px 3px 0px #00000029;
    opacity: 1;

    .wraper {
      width: 520px;
      margin: auto;

      .wallet-info {
        margin-top: 10px;
        height: 400px;
        background: #ffffff 0% 0% no-repeat padding-box;
        box-shadow: inset 0px 3px 6px #00000029;
        border-radius: 16px;
      }

      .bottom {
        margin-top: 20px;
        .link {
          color: #691c80;
          cursor: pointer;
          text-decoration: underline;
        }
      }
    }
  }
}

.ecoc-wallet-pin {
  width: 100px;
  height: 70px;
  background: #ffffff 0% 0% no-repeat padding-box;
  box-shadow: 0px 3px 6px #00000029;
  border-radius: 0px 35px 35px 0px;
  opacity: 1;
  cursor: pointer;

  .logo {
    position: relative;
    top: 50%;
    left: 0;
    height: 27px;
    width: 30px;
    transform: translate(0, -50%);
  }
}
</style>
