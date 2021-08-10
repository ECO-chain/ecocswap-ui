<template>
  <div class="ecoc-wallet">
    <transition name="panel">
      <div :class="{ active: showWallet }">
        <div class="ecoc-wallet-panel">
          <div class="header">
            <div class="header-pin" @click="walletToggle">
              <img class="logo" src="@/assets/img/ecoc-wallet.svg" />
            </div>
          </div>
          <div class="panel">
            <div class="wraper">
              <div class="wallet-management" v-if="isLogedIn">
                <AssetsSelection />
                <div class="wallet-info">
                  <div class="wallet-tabs">
                    <div class="tab-header"></div>
                    <div class="tab-content">
                      <div class="total-balance">
                        <div class="left">Total Balance:</div>
                        <a class="right">
                          <div class="link">2000000 ECOC</div>
                        </a>
                      </div>
                      <input class="textbox" placeholder="To address" />
                      <input class="textbox" placeholder="Amount" />
                      <div class="btn btn-bg-puple">
                        <div class="name">Send</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="bottom">
                  <div class="link">Disconnect</div>
                </div>
              </div>

              <div class="connect-wallet" v-else>
                <EcocConnectWallet />
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
import AssetsSelection from './AssetsSelection.vue'
import EcocConnectWallet from './EcocConnectWallet.vue'

@Options({
  components: { AssetsSelection, EcocConnectWallet },
})
export default class EcocWallet extends Vue {
  showWallet = false
  isLogedIn = false

  walletToggle() {
    this.showWallet = !this.showWallet
  }
}
</script>

<style scoped lang="scss">
input {
  height: 52px;
  background: #f8f4ff 0% 0% no-repeat padding-box;
  box-shadow: inset 0px 3px 6px #00000029;
  border-radius: 16px;
}

.ecoc-wallet {
  top: 0;
  left: 0;
}

.ecoc-wallet-panel {
  transform: translate(-550px);
  transition: 1s;
  width: 660px;

  .header {
    height: 70px;
    background: #ffffff 0% 0% no-repeat padding-box;
    box-shadow: 0px 3px 6px #00000029;
    border-radius: 0px 35px 35px 0px;
    opacity: 1;

    &-pin {
      float: right;
      width: 100px;
      height: 70px;
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

      .wallet-management {
        .wallet-info {
          margin-top: 10px;
          height: 400px;
          background: #ffffff 0% 0% no-repeat padding-box;
          box-shadow: inset 0px 3px 6px #00000029;
          border-radius: 16px;

          .tab-header {
            height: 72px;
            background: #f9f5ff;
          }

          .tab-content {
            height: 100%;
            padding: 25px;

            .total-balance {
              margin: 10px 5px;
              .left {
                float: left;
              }
              .right {
                float: right;
              }
            }

            .textbox {
              margin: 5px 0px;
            }

            .btn {
              margin-top: 30px;
              bottom: 0;
            }
          }
        }

        .bottom {
          margin-top: 20px;
        }
      }

      .connect-wallet {
        width: 374px;
        height: 300px;
        margin: auto;
      }
    }
  }
}

.active .ecoc-wallet-panel {
  transform: initial;
  transition: 0.5s;
}

.link {
  color: #691c80;
  cursor: pointer;
  text-decoration: underline;
}
</style>
