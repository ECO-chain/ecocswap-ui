<template>
  <transition name="modal">
    <div v-if="isOpen" class="mask">
      <div class="modal">
        <div class="modal-header">
          <div class="actions actions-item" @click="transaction.close">
            <img class="icon" src="@/assets/img/cancel.png" alt="close" />
          </div>
        </div>

        <div class="transaction-wraper">
          <div class="text-title">Transaction Confirmation</div>
          <div class="text-data">Please confirm the transaction</div>

          <div v-if="transaction.isToken" class="text-field">
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
                <div>
                  {{ transaction.totalFee }}
                  <span v-if="extraFee" class="extra">(+{{ extraFee }})</span> ECOC
                </div>
                <a class="options link">Fee Setting</a>
                <div v-show="transaction.feeSettings" class="fee-settings">
                  <div class="settings-fee"></div>
                  <div class="settings-gas">
                    <input
                      v-model="transaction.gasPrice"
                      class="gas-textbox"
                      placeholder="Gas Price"
                      type="number"
                    />
                    <input
                      v-model="transaction.gasLimit"
                      class="gas-textbox"
                      placeholder="Gas Limit"
                      type="number"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="transaction.isNative" class="text-field">
            <div class="name">Total</div>
            <div class="data">
              {{
                numberWithCommas(Number(amount) + Number(extraFee) + transaction.totalFee, {
                  fixed: [0, 8],
                })
              }}
              {{ transaction.assetSymbol }}
            </div>
          </div>

          <input
            v-model="transaction.password"
            class="password-textbox"
            placeholder="Keystore password"
            type="password"
          />

          <div class="transaction-actions">
            <div v-show="transaction.errorMsg" class="error-message">
              {{ transaction.errorMsg }}
            </div>
            <div :class="Number(amount) <= asset.amount ? '' : 'disable'">
              <div class="btn btn-bg-puple btn-right" @click="transaction.confirm">
                <div v-if="transaction.isLoading" class="name">
                  <easy-spinner size="20" type="circular" />
                </div>
                <div v-else class="name">Confirm</div>
              </div>
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
  extraFee = prop<number>({ default: 0 })
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

    watchEffect(() => {
      changeAsset(asset.value)
    })

    const _init = () => {
      if (this.isContract) {
        gasLimit.value *= 2
      }
    }

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

    _init()

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

.extra {
  color: #691c80;
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
