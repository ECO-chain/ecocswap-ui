<template>
  <transition name="modal">
    <div v-if="isOpen" class="mask">
      <div class="modal">
        <div class="modal-header">
          <div class="actions actions-item" @click="conversion.close">
            <img class="icon" src="@/assets/img/cancel.png" alt="close" />
          </div>
        </div>

        <div class="conversion-wraper ecoc">
          <div class="text-title">Conversion Confirmation</div>

          <div class="conversion-details">
            <div class="conversion-asset">
              <img class="logo" :src="fromAsset.style.icon" />
              <div class="name">{{ fromAsset.symbol }}</div>
              <div class="amount">{{ numberWithCommas(Number(amount), { fixed: [0, 8] }) }}</div>
            </div>

            <img class="arrow" src="@/assets/img/ios-arrow-down.svg" />

            <div class="conversion-asset">
              <img class="logo" :src="toAsset.style.icon" />
              <div class="name">{{ toAsset.symbol }}</div>
              <div class="amount">{{ numberWithCommas(Number(amount), { fixed: [0, 8] }) }}</div>
            </div>
          </div>

          <div class="estimation-panel">
            <div v-if="conversion.isLoading" class="estimation-panel-wraper">
              <easy-spinner class="spinner" size="50" type="dots" />
            </div>
            <div v-else class="estimation-panel-wraper">
              <div class="estimation-field">
                <div class="field-name">Extra Gas Cost</div>
                <div class="field-data">
                  {{ numberWithCommas(conversion.estimationFee, { fixed: [0, 8] }) }}
                  {{ conversion.feeUnit }}
                </div>
              </div>

              <div class="estimation-field">
                <div class="field-name">Admin Fee charge</div>
                <div class="field-data">
                  {{ numberWithCommas(conversion.adminFee, { fixed: [0, 8] }) }}
                  {{ toAsset.symbol }}
                </div>
              </div>

              <div class="estimation-field">
                <div class="field-name">You will receive</div>
                <div class="field-data">
                  {{
                    numberWithCommas(Number(amount) - conversion.adminFee, {
                      fixed: [0, 8],
                    })
                  }}
                  {{ toAsset.symbol }}
                </div>
              </div>
            </div>
          </div>

          <div class="destination">
            <div class="destination-header">
              <div class="text">Recipient's Address</div>
              <hr class="line" />
            </div>
            <div class="destination-wraper">
              <input
                ref="addressInput"
                class="address-textbox"
                placeholder="Destination Address"
                :value="toAddress"
                :disabled="conversion.readonlyAddress"
                @input="$emit('update:toAddress', $event.target?.value)"
              />

              <span class="change link" @click="conversion.changeAddress">Change</span>
            </div>
          </div>

          <div class="conversion-actions">
            <div
              :class="
                Number(amount) - conversion.adminFee > 0 && toAddress.length > 0 ? '' : 'disable'
              "
            >
              <div class="btn btn-bg-puple" @click="conversion.confirm">
                <div class="name">Confirm</div>
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
import { ref, computed, inject, onMounted } from 'vue'
import { Asset } from '@/services/currency/types'
import { numberWithCommas } from '@/utils'
import * as constants from '@/constants'
import useEthWallet from '@/components/composables/use-eth-wallet'
import useCrossSwap from '@/components/composables/use-cross-swap'

class Props {
  isOpen = prop<boolean>({ default: false })
  fromAsset = prop<Asset>({ required: true })
  toAsset = prop<Asset>({ required: true })
  toAddress = prop<string>({ required: true })
  amount = prop<string | number>({ required: true })
}

@Options({
  emits: ['update:isOpen', 'update:toAddress', 'onConfirm'],
})
export default class ConvertConfirmation extends Vue.with(Props) {
  numberWithCommas = numberWithCommas
  addressInput = ref(null as any)

  conversion = setup(() => {
    const { getEcocFee } = useCrossSwap()
    const { state: ethState } = useEthWallet()
    const fromAsset = ref<Asset>(inject('fromAsset', this.fromAsset))
    const toAsset = ref<Asset>(inject('toAsset', this.toAsset))
    const toAddress = ref<string>(inject('toAddress', this.toAddress))
    const isLoading = ref(true)
    const readonlyAddress = ref(true)
    const adminFee = ref(0)
    const estimationFee = ref(0)
    const feeUnit = ref('')

    const calculate = () => {
      setTimeout(async () => {
        if (
          toAsset.value.type === constants.TYPE_ETH ||
          toAsset.value.type === constants.TYPE_ERC20
        ) {
          const networkId = parseInt(ethState.chainId, 16)
          estimationFee.value = await getEcocFee(networkId)
          feeUnit.value = constants.TYPE_ECOC
        } else {
          feeUnit.value = constants.TYPE_ETH
        }
        isLoading.value = false
      }, 1000)
    }

    const close = () => {
      this.$emit('update:isOpen', false)
      readonlyAddress.value = true
    }

    const confirm = () => {
      this.$emit('onConfirm')
    }

    const changeAddress = () => {
      readonlyAddress.value = false
      setTimeout(() => {
        this.addressInput.focus()
      }, 200)
    }

    onMounted(() => {
      calculate()
    })

    return {
      fromAsset: computed(() => fromAsset.value),
      toAsset: computed(() => toAsset.value),
      isLoading: computed(() => isLoading.value),
      readonlyAddress: computed(() => readonlyAddress.value),
      toAddress,
      adminFee,
      estimationFee,
      feeUnit,
      confirm,
      close,
      changeAddress,
      calculate,
    }
  })
}
</script>

<style scoped lang="scss">
input {
  height: 52px;
  color: #878787;
  background: #f5f5f5 0% 0% no-repeat padding-box;
  border-radius: 16px;
}

input:focus {
  border: 1px solid rgba(105, 28, 128, 1);
}

.ecoc {
  color: #691c80;
  input:focus {
    border: 1px solid rgba(105, 28, 128, 1);
  }
}

.alt {
  color: #15bacf;

  input:focus {
    border: 1px solid rgba(21, 186, 207, 1);
  }
}

.modal {
  position: absolute;
  top: 50%;
  right: 50%;
  max-width: 508px;
  min-width: 450px;
  max-height: 650px;
  min-height: 400px;
  background: #ffffff 0% 0% no-repeat padding-box;
  box-shadow: 0px 3px 6px #acabab29;
  border-radius: 32px;
  opacity: 1;
  transform: translate(50%, -50%);
  z-index: 10;

  .conversion-wraper {
    padding: 30px;
    padding-top: 10px;

    .text-title {
      color: #691c80;
      font-weight: bold;
      font-size: 20px;
    }

    .conversion-details {
      margin-top: 20px;
      background: #f6f6f6 0% 0% no-repeat padding-box;
      border-radius: 16px;
      opacity: 1;
      .conversion-asset {
        display: flex;
        align-items: center;
        margin: auto;
        padding: 10px;
        .logo {
          margin-left: 15px;
          width: 29px;
          height: 29px;
        }

        .name {
          margin-left: 10px;
          font-size: 16px;
          color: #707070;
        }

        .amount {
          margin-right: 15px;
          flex: 50%;
          right: 0;
          text-align: right;
          font-weight: bold;
        }
      }
    }

    .estimation-panel {
      margin-top: 20px;
      background: #f6f6f6 0% 0% no-repeat padding-box;
      border-radius: 16px;

      .estimation-panel-wraper {
        padding: 10px;

        .estimation-field {
          display: flex;
          align-items: center;
          margin: auto;

          .field-name {
            float: left;
            margin-left: 15px;
            font-size: 14px;
            color: #878787;
          }

          .field-data {
            flex: 50%;
            float: right;
            text-align: right;
            margin-right: 15px;
            font-size: 18px;
            color: #000000;
          }
        }
      }
    }

    .destination {
      margin-top: 30px;
      .destination-header {
        display: flex;
        .text {
          text-align: left;
          color: #878787;
        }

        .line {
          flex: 50%;
          float: right;
          border: 0px;
          border-top: 1px solid #00000029;
          width: auto;
          margin: 12px;
          margin-left: 20px;
        }
      }

      .destination-wraper {
        padding-top: 15px;
        text-align: right;

        .change {
          font-size: 12px;
          letter-spacing: 0px;
        }
      }
    }

    .conversion-actions {
      margin-top: 20px;
    }

    .arrow {
      width: 25px;
      height: 25px;
    }
  }
}

.link {
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

  .modal .conversion-wraper .text-title {
    font-size: 90%;
  }
}
</style>
