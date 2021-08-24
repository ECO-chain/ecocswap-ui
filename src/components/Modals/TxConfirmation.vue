<template>
  <transition name="modal">
    <div class="mask" v-if="isOpen">
      <div class="modal">
        <div class="modal-header">
          <div class="actions actions-item" @click="transaction.close">
            <img class="icon" src="@/assets/img/cancel.png" alt="close" />
          </div>
        </div>

        <div class="transaction-wraper">
          <div class="text-title">Transaction Confirmation</div>
          <div class="text-data">Please confirm the transaction</div>

          <div class="text-field" v-if="transaction.isToken">
            <div class="name">Asset</div>
            <div class="data">
              <div class="tooltip">
                {{ transaction.tokenName }}
                <span class="tooltiptext">{{ transaction.tokenAddress }}</span>
              </div>
            </div>
          </div>

          <div class="text-field">
            <div class="name">Send to</div>
            <div class="data">{{ toAddress }}</div>
          </div>

          <div class="text-field">
            <div class="name">Amount</div>
            <div class="data">
              {{ numberWithCommas(amount, { fixed: [0, 8] }) }} {{ transaction.assetSymbol }}
            </div>
          </div>

          <div class="text-field">
            <div class="name">Fee</div>
            <div class="data">
              <div class="data-wraper">
                <div>{{ transaction.totalFee }} ECOC</div>
                <a class="options link">Fee Setting</a>
                <div class="fee-settings" v-show="transaction.feeSettings">
                  <div class="settings-fee"></div>
                  <div class="settings-gas">
                    <input
                      class="gas-textbox"
                      placeholder="Gas Price"
                      type="number"
                      v-model="transaction.gasPrice"
                    />
                    <input
                      class="gas-textbox"
                      placeholder="Gas Limit"
                      type="number"
                      v-model="transaction.gasLimit"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="text-field" v-if="transaction.isNative">
            <div class="name">Total</div>
            <div class="data">
              {{
                numberWithCommas(Number(amount) + transaction.totalFee, {
                  fixed: [0, 8],
                })
              }}
              {{ transaction.assetSymbol }}
            </div>
          </div>

          <input
            class="password-textbox"
            placeholder="Keystore password"
            type="password"
            v-model="transaction.password"
          />

          <div class="transaction-actions">
            <div class="error-message" v-show="transaction.errorMsg">
              {{ transaction.errorMsg }}
            </div>
            <div class="btn btn-bg-puple btn-right" @click="transaction.confirm">
              <div class="name" v-if="transaction.isLoading">
                <easy-spinner size="20" type="circular" />
              </div>
              <div class="name" v-else>Confirm</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { Options, Vue, setup, prop } from 'vue-class-component'
import { ref, computed, watchEffect, inject } from 'vue'
import { Asset } from '@/services/currency/types'
import useEcocTransaction from '@/components/composables/use-ecoc-transaction'
import { numberWithCommas } from '@/utils'

class Props {
  isOpen = prop<boolean>({ default: false })
  isContract = prop<boolean>({ default: false })
  asset = prop<Asset>({ required: true })
  toAddress = prop<string>({ required: true })
  amount = prop<number>({ required: true })
}

@Options({
  emits: ['update:isOpen', 'onConfirm'],
})
export default class TxConfirmation extends Vue.with(Props) {
  numberWithCommas = numberWithCommas
  transaction = setup(() => {
    const asset = ref<Asset>(inject('asset', this.asset))
    const {
      assetSymbol,
      tokenAddress,
      tokenName,
      feeTierList,
      isNative,
      isToken,
      totalFee,
      gasLimit,
      gasPrice,
      txConfirm,
      changeFeeTier,
      changeAsset,
    } = useEcocTransaction(asset.value)

    const errorMsg = ref('')
    const isLoading = ref(false)
    const password = ref('')
    const feeSettings = ref(false)

    watchEffect(() => {
      changeAsset(asset.value)
    })

    const clear = () => {
      isLoading.value = false
      password.value = ''
      errorMsg.value = ''
    }

    const close = () => {
      clear()
      this.$emit('update:isOpen', false)
    }

    const onError = (msg: string) => {
      clear()
      errorMsg.value = msg
    }

    const confirm = () => {
      isLoading.value = true
      errorMsg.value = ''

      txConfirm(password.value)
        .then((walletParams) => {
          setTimeout(() => {
            clear()
            this.$emit('onConfirm', walletParams)
          }, 1500)
        })
        .catch((error) => {
          const msg = error.message ? error.message : error
          onError(msg)
        })
    }

    return {
      isLoading: computed(() => isLoading.value),
      feeSettings,
      errorMsg,
      password,
      totalFee,
      gasLimit,
      gasPrice,
      feeTierList,
      isNative,
      isToken,
      assetSymbol,
      tokenAddress,
      tokenName,
      changeFeeTier,
      confirm,
      close,
    }
  })
}
</script>

<style scoped lang="scss">
input {
  height: 52px;
  background: #f5f5f5 0% 0% no-repeat padding-box;
  border-radius: 16px;
}

input:focus {
  border: 1px solid rgba(105, 28, 128, 0.5);
}

.modal {
  position: absolute;
  top: 50%;
  right: 50%;
  max-width: 550px;
  min-width: 500px;
  max-height: 650px;
  min-height: 400px;
  background: #ffffff 0% 0% no-repeat padding-box;
  box-shadow: 0px 3px 6px #acabab29;
  border-radius: 32px;
  opacity: 1;
  transform: translate(50%, -50%);
  z-index: 10;

  &-header {
    height: auto;
    padding: 35px 30px;
    .actions {
      float: right;
      &-item {
        cursor: pointer;
        font-size: 24px;
      }

      &:hover {
        opacity: 0.5;
      }

      .icon {
        width: 21px;
        height: 21px;
      }
    }
  }

  .transaction-wraper {
    padding: 30px;
    padding-top: 20px;
    .text-title {
      color: #691c80;
      font-weight: bold;
      font-size: 20px;
    }

    .text-data {
      font-size: 14px;
      color: #878787;
      margin-bottom: 20px;
    }

    .text-field {
      display: block;
      border-bottom: 1px solid rgba(135, 135, 135, 0.3);
      margin-top: 20px;
      .name {
        font-size: 14px;
        color: #878787;
        text-align: left;
        margin-left: 10px;
      }

      .data {
        font-size: 18px;
        text-align: right;
        margin-right: 10px;

        .data-wraper {
          display: block;
          line-height: 1;
          margin-bottom: 10px;
        }

        .options {
          font-size: 12px;
          letter-spacing: 0px;
        }
      }
    }

    .password-textbox {
      margin-top: 20px;
    }

    .transaction-actions {
      margin-top: 20px;
    }
  }
}

.link {
  color: #691c80;
  cursor: pointer;
  text-decoration: underline;
}

@media only screen and (max-width: 400px) {
  input {
    font-size: 90%;
  }
  .modal {
    max-width: 350px;
    min-width: 340px;
    max-height: 564px;
    min-height: 500px;
    font-size: 90%;
  }

  .modal .transaction-wraper .text-title {
    font-size: 90%;
  }

  .modal .transaction-wraper .text-data {
    font-size: 90%;
  }

  .modal .transaction-wraper .text-field .name {
    font-size: 90%;
  }

  .modal .transaction-wraper .text-field .data {
    font-size: 80%;
  }

  .modal .transaction-wraper .text-field .data .options {
    font-size: 90%;
  }
}
</style>
