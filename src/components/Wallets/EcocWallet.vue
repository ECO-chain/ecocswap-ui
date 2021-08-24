<template>
  <div class="noselect">
    <transition name="panel">
      <div :class="{ active: wallet.show }">
        <div class="ecoc-wallet-panel">
          <div class="header">
            <div class="header-pin" @click="wallet.walletToggle">
              <img class="logo" src="@/assets/img/ecoc-wallet.svg" />
            </div>
          </div>

          <div class="panel">
            <div class="wraper">
              <div class="wallet-management" v-if="wallet.isLogedIn">
                <AssetsSelection
                  :assets="wallet.assets"
                  :selectedIndex="wallet.selectedAssetIndex"
                  @onSelect="wallet.selectAsset"
                />
                <div class="wallet-info">
                  <tabs color="purple" class="tabs">
                    <tab name="Receive" icon="arrow-alt-circle-down">
                      <div class="tab-content">
                        <QRCodeVue3
                          :width="220"
                          :height="220"
                          :value="wallet.address"
                          :dotsOptions="{
                            type: 'square',
                          }"
                          :cornersSquareOptions="{ type: 'extra-rounded' }"
                        />
                        <div class="wallet-address-text">ECOC Wallet Address:</div>
                        <div class="wallet-address" @click="wallet.copyAddress">
                          {{ wallet.address }}
                          <font-awesome-icon :icon="['far', 'clone']" class="icon" />
                        </div>
                      </div>
                    </tab>

                    <tab name="Send" icon="arrow-alt-circle-up">
                      <div class="tab-content">
                        <div class="total-balance">
                          <div class="left">Total Balance:</div>
                          <a class="right">
                            <div class="link" @click="transaction.setFullAmount">
                              {{ wallet.selectedAsset.amount }} {{ wallet.selectedAsset.symbol }}
                            </div>
                          </a>
                        </div>
                        <input
                          class="textbox"
                          placeholder="To address"
                          v-model="transaction.toAddress"
                          @change="transaction.onInputChanged"
                        />
                        <input
                          class="textbox"
                          placeholder="Amount"
                          type="number"
                          v-model="transaction.amount"
                        />
                        <div class="error-message" v-show="transaction.errorMsg">
                          {{ transaction.errorMsg }}
                        </div>
                        <div :class="transaction.isSendAble ? '' : 'disable'">
                          <div class="btn btn-bg-puple" @click="transaction.send">
                            <div class="name">Send</div>
                          </div>
                        </div>
                      </div>
                    </tab>
                  </tabs>
                </div>

                <div class="bottom">
                  <div class="link" @click="wallet.disconnect">Disconnect</div>
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

    <TxConfirmation
      v-model:isOpen="transaction.confirmation.isOpen"
      :asset="transaction.selectedAsset"
      :toAddress="transaction.toAddress"
      :amount="transaction.amount"
      @onConfirm="transaction.onConfirm"
    />

    <TxResult
      v-model:isOpen="transaction.result.isOpen"
      v-model:txid="transaction.result.txid"
      v-model:errorMsg="transaction.result.errorMsg"
      v-model:loadingMsg="transaction.result.loadingMsg"
      txType="ecoc"
    />
  </div>
</template>

<script lang="ts">
import { Options, Vue, setup } from 'vue-class-component'
import { ref, computed, provide } from 'vue'
import QRCodeVue3 from 'qrcode-vue3'
import useEcocWallet from '@/components/composables/use-ecoc-wallet'
import useTxResult from '@/components/composables/modals/use-tx-result'
import useTxConfirmation from '@/components/composables/modals/use-tx-confirmation'
import { WalletParams } from '@/services/ecoc/types'
import { SendPayload } from '@/services/wallet/types'
import { isEcocAddress } from '@/services/utils'
import Tabs from '@/components/Tabs.vue'
import Tab from '@/components/Tab.vue'
import TxResult from '@/components/Modals/TxResult.vue'
import TxConfirmation from '@/components/Modals/TxConfirmation.vue'
import { copyToClipboard } from '@/utils'
import AssetsSelection from './AssetsSelection.vue'
import EcocConnectWallet from './EcocConnectWallet.vue'

@Options({
  components: {
    AssetsSelection,
    EcocConnectWallet,
    Tabs,
    Tab,
    QRCodeVue3,
    TxResult,
    TxConfirmation,
  },
})
export default class EcocWallet extends Vue {
  transaction = setup(() => {
    const { selectedAsset, sendAsset, updateAssetsBalance } = useEcocWallet()
    const result = useTxResult()
    const confirmation = useTxConfirmation()
    const toAddress = ref('')
    const amount = ref<string | number>('')
    const errorMsg = ref('')

    provide(
      'asset',
      computed(() => selectedAsset.value)
    )

    const isSendAble = computed(() => {
      if (!toAddress.value) {
        return false
      }

      if (amount.value <= 0 || amount.value > selectedAsset.value.amount) {
        return false
      }

      return true
    })

    const setFullAmount = () => {
      amount.value = selectedAsset.value.amount
    }

    const clear = () => {
      errorMsg.value = ''
      toAddress.value = ''
      amount.value = ''
    }

    const send = () => {
      if (!isEcocAddress(toAddress.value)) {
        errorMsg.value = 'Invalid address format'
        return
      }

      confirmation.open()
    }

    const onInputChanged = () => {
      errorMsg.value = ''
    }

    const onConfirm = (walletParams: WalletParams) => {
      confirmation.close()
      result.setLoading(
        `Sending ${amount.value} ${selectedAsset.value.symbol} to\n ${toAddress.value}`
      )
      result.open()

      const payload = {
        asset: selectedAsset.value,
        to: toAddress.value,
        amount: Number(amount.value),
        walletParams: walletParams,
      } as SendPayload

      sendAsset(payload)
        .then((txid) => {
          setTimeout(() => {
            result.success(txid)
            clear()
            updateAssetsBalance()
          }, 10000)
        })
        .catch((error) => {
          result.error(error.message ? error.message : error)
        })
    }

    return {
      result: result.state,
      confirmation: confirmation.state,
      selectedAsset,
      toAddress,
      amount,
      isSendAble,
      errorMsg,
      send,
      onConfirm,
      onInputChanged,
      setFullAmount,
    }
  })

  wallet = setup(() => {
    const {
      address,
      assets,
      selectedAsset,
      selectedAssetIndex,
      isLogedIn,
      selectAsset,
      disconnect,
    } = useEcocWallet()
    const show = ref(false)

    const walletToggle = () => {
      show.value = !show.value
    }

    const copyAddress = () => {
      copyToClipboard(address.value)
    }

    return {
      show: computed(() => show.value),
      address,
      assets,
      selectedAsset,
      selectedAssetIndex,
      isLogedIn,
      selectAsset,
      walletToggle,
      disconnect,
      copyAddress,
    }
  })
}
</script>

<style scoped lang="scss">
input {
  height: 52px;
  background: #f8f4ff 0% 0% no-repeat padding-box;
  box-shadow: inset 0px 3px 6px #00000029;
  border-radius: 16px;
}

.ecoc-wallet-panel {
  position: absolute;
  left: 0;
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
    min-height: 500px;
    max-height: 650px;
    height: auto;
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
          height: auto;

          .tabs {
            box-shadow: inset 0px 0px 6px #00000029;
            border-radius: 16px;
            height: 100%;
          }

          .tab-content {
            height: 100%;
            padding: 40px;

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

            .qrcode {
              width: 226px;
              height: 226px;
            }

            .wallet-address-text {
              margin-top: 13px;
              margin-bottom: 13px;
              text-align: left;
              color: #691c80;
            }

            .wallet-address {
              padding: 15px 20px;
              background: #f6f6f6 0% 0% no-repeat padding-box;
              box-shadow: inset 0px 3px 6px #00000029;
              border-radius: 16px;
              color: rgba(0, 0, 0, 0.8);
              cursor: pointer;

              .icon {
                margin-left: 5px;
                color: rgba(105, 28, 128, 1);
              }

              &:hover {
                color: rgba(0, 0, 0, 0.5);
              }

              &:hover .icon {
                color: rgba(105, 28, 128, 0.5);
              }
            }
          }
        }

        .bottom {
          padding: 20px 0;
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
