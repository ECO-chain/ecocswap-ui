<template>
  <div class="wallet noselect" flat>
    <transition name="panel">
      <div :class="{ active: wallet.show }">
        <div class="eth-wallet-panel">
          <div class="header">
            <div class="header-pin" @click="wallet.walletToggle">
              <div class="text" v-if="!wallet.icon">ETHWallet</div>
              <img class="logo" v-else :src="wallet.icon" alt="ETHWallet" />
            </div>
          </div>
          <div class="panel">
            <div class="wraper">
              <div class="wallet-management" v-if="wallet.isLogedIn">
                <div class="wallet-address-text">Wallet Address:</div>
                <div class="wallet-address">{{ wallet.address }}</div>
                <div class="wallet-actions">
                  <div class="btn btn-bg-blue left" @click="wallet.gotoExplorer">
                    <div class="name">Etherscan</div>
                  </div>
                  <div class="btn btn-bg-blue2 right">
                    <div class="name">Copy Address</div>
                  </div>
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
import { Options, Vue, setup } from 'vue-class-component'
import { ref, computed, watch } from 'vue'
import EthConnectWallet from './EthConnectWallet.vue'
import useEthWallet from '@/components/composables/use-eth-wallet'

@Options({
  components: { EthConnectWallet },
})
export default class EthWallet extends Vue {
  wallet = setup(() => {
    const { address, isLogedIn, walletIcon } = useEthWallet()
    const explorerUrl = 'https://etherscan.io'
    const show = ref(false)
    const icon = ref(walletIcon.value)

    watch(walletIcon, (value: string) => {
      icon.value = value
    })

    const walletToggle = () => {
      show.value = !show.value
    }

    const gotoExplorer = () => {
      const fullurl = explorerUrl + '/address/' + address.value
      window.open(`${fullurl}`)
    }

    return {
      show: computed(() => show.value),
      icon,
      address,
      isLogedIn,
      walletToggle,
      gotoExplorer,
    }
  })
}
</script>

<style scoped lang="scss">
.wallet {
  top: 0;
  right: 0;
}

.eth-wallet-panel {
  position: absolute;
  right: 0;
  transform: translate(466px);
  transition: 1s;
  min-width: 580px;

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

      .logo {
        position: relative;
        top: 50%;
        left: 0;
        transform: translate(-50%, -50%);
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
