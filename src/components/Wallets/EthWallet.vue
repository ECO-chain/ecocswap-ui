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
            <div class="wraper">
              <div class="wallet-management" v-if="isLogedIn">
                <div class="wallet-address-text">Wallet Address:</div>
                <div class="wallet-address">{{ address }}</div>
                <div class="wallet-actions">
                  <div class="btn btn-bg-blue left" @click="gotoExplorer">
                    <div class="name">Etherscan</div>
                  </div>
                  <div class="btn btn-bg-blue2 right">
                    <div class="name">Copy Address</div>
                  </div>
                </div>

                <div class="bottom">
                  <a class="link" @click="logout">Disconnect</a>
                </div>
              </div>
              <div class="connect-wallet" v-else>
                <EthConnectWallet />
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import EthConnectWallet from './EthConnectWallet.vue'

@Options({
  components: { EthConnectWallet },
})
export default class EthWallet extends Vue {
  showWallet = false
  isLogedIn = true

  address = '0x51F998d36Df6C5bD1F2f16c9E33ac10F6080cFa2'
  ethExplorer = 'https://etherscan.io'

  walletToggle() {
    this.showWallet = !this.showWallet
  }

  login() {
    this.isLogedIn = true
  }

  logout() {
    this.isLogedIn = false
  }

  gotoExplorer() {
    const fullurl = this.ethExplorer + '/address/' + this.address
    window.open(`${fullurl}`)
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
    height: auto;
    background: #ffffff 0% 0% no-repeat padding-box;
    border-radius: 0px 0px 0px 16px;
    box-shadow: 0px 3px 0px #00000029;
    opacity: 1;

    .wraper {
      width: 466px;

      .wallet-management {
        padding: 20px;
        padding-top: 0px;
        .wallet-address-text {
          margin-top: 13px;
          margin-bottom: 13px;
          text-align: left;
          color: #707070;
        }

        .wallet-address {
          padding: 15px 20px;
          background: #f6f6f6 0% 0% no-repeat padding-box;
          box-shadow: inset 0px 3px 6px #00000029;
          border-radius: 16px;
          color: rgba(0, 0, 0, 0.8);
        }

        .wallet-actions {
          margin-top: 20px;
          display: flex;
          .left {
            width: 50%;
            margin-right: 10px;
          }

          .right {
            width: 50%;
            margin-left: 10px;
          }
        }

        .bottom {
          text-align: right;
          margin-top: 15px;
        }
      }

      .connect-wallet {
        padding: 72px 55px;
      }
    }
  }
}

.active .eth-wallet-panel {
  transform: initial;
  transition: 0.5s;
}

.link {
  color: #15bacf;
  cursor: pointer;
  text-decoration: underline;
}

.btn {
  font-weight: bold;
}
</style>
