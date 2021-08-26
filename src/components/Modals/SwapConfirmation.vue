<template>
  <transition name="modal">
    <div class="mask" v-if="isOpen">
      <div class="modal">
        <div class="modal-header">
          <div class="actions actions-item" @click="conversion.close">
            <img class="icon" src="@/assets/img/cancel.png" alt="close" />
          </div>
        </div>

        <div class="conversion-wraper">
          <div class="text-title">Swapping Confirmation</div>

          <div class="conversion-details">
            <div class="conversion-asset">
              <img class="logo" :src="fromAsset.style.icon" />
              <div class="name">{{ fromAsset.symbol }}</div>
              <div class="amount">{{ numberWithCommas(amount, { fixed: [0, 8] }) }}</div>
            </div>

            <img class="arrow" src="@/assets/img/ios-arrow-down.svg" />

            <div class="conversion-asset">
              <img class="logo" :src="toAsset.style.icon" />
              <div class="name">{{ toAsset.symbol }}</div>
              <div class="amount">{{ numberWithCommas(amount, { fixed: [0, 8] }) }}</div>
            </div>
          </div>

          <div class="estimation-panel">
            <div class="estimation-panel-wraper" v-if="conversion.isLoading">
              <easy-spinner class="spinner" size="150" type="dots" />
            </div>
            <div class="estimation-panel-wraper" v-else>
              <div class="field-name">Fee charge</div>
              <div class="field-data">
                {{ numberWithCommas(conversion.estimationFee, { fixed: [0, 8] }) }}
                {{ toAsset.symbol }}
              </div>

              <div class="field-name">You will receive</div>
              <div class="field-data">
                {{
                  numberWithCommas(Number(amount) - conversion.estimationFee, {
                    fixed: [0, 8],
                  })
                }}
                {{ toAsset.symbol }}
              </div>
            </div>
          </div>

          <div class="destination">
            <div class="text">Receipants Address</div>
            <input
              class="address-textbox"
              placeholder="Destination Address"
              v-model="conversion.password"
            />
          </div>

          <div class="conversion-actions">
            <div class="btn btn-bg-puple btn-right" @click="conversion.confirm">
              <div class="name">Confirm</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { Options, Vue, setup, prop } from 'vue-class-component'
import { ref, computed, inject } from 'vue'
import { Asset } from '@/services/currency/types'
import { numberWithCommas } from '@/utils'

class Props {
  isOpen = prop<boolean>({ default: false })
  fromAsset = prop<Asset>({ required: true })
  toAsset = prop<Asset>({ required: true })
  toAddress = prop<string>({ required: true })
  amount = prop<string | number>({ required: true })
}

@Options({
  emits: ['update:isOpen', 'onConfirm'],
})
export default class ConvertConfirmation extends Vue.with(Props) {
  numberWithCommas = numberWithCommas
  conversion = setup(() => {
    const fromAsset = ref<Asset>(inject('fromAsset', this.fromAsset))
    const toAsset = ref<Asset>(inject('toAsset', this.toAsset))
    const isLoading = ref(true)
    const estimationFee = ref(0)

    const calculate = () => {
      setTimeout(() => {
        isLoading.value = false
      }, 2000)
    }

    const close = () => {
      this.$emit('update:isOpen', false)
    }

    const confirm = () => {
      this.$emit('update:onConfirm')
    }

    calculate()

    return {
      fromAsset: computed(() => fromAsset.value),
      toAsset: computed(() => toAsset.value),
      isLoading: computed(() => isLoading.value),
      estimationFee,
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

  .conversion-wraper {
    padding: 30px;
    padding-top: 20px;
    .text-title {
      color: #691c80;
      font-weight: bold;
      font-size: 20px;
    }

    .conversion-actions {
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

  .modal .conversion-wraper .text-title {
    font-size: 90%;
  }
}
</style>
