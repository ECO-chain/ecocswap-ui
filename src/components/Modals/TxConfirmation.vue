<template>
  <transition name="modal">
    <div class="mask" v-if="isOpen">
      <div class="modal">
        <div class="modal-header">
          <div class="actions actions-item" @click="modal.close">
            <img class="icon" src="@/assets/img/cancel.png" alt="close" />
          </div>
        </div>

        <div class="transaction-wraper">
          <div class="text-title">Transaction Confirmation</div>
          <div class="text-data">Please confirm the transaction</div>

          <div class="text-field" v-if="asset.tokenInfo">
            <div class="name">Asset</div>
            <div class="data tooltip">
              {{ asset.tokenInfo.name }}
              <span class="tooltiptext">{{ asset.tokenInfo.address }}</span>
            </div>
          </div>

          <div class="text-field">
            <div class="name">Send to</div>
            <div class="data">{{ toAddress }}</div>
          </div>

          <div class="text-field">
            <div class="name">Amount</div>
            <div class="data">{{ amount }} {{ asset.symbol }}</div>
          </div>

          <div class="text-field">
            <div class="name">Gas fee</div>
            <div class="data">
              <div class="data-wraper">
                <div>{{ amount }} ECOC</div>
                <a class="options link">Gas Setting</a>
              </div>
            </div>
          </div>

          <input
            class="password-textbox"
            placeholder="Keystore password"
            type="password"
            v-model="modal.password"
          />

          <div class="transaction-actions">
            <div class="error-message" v-show="modal.errorMsg">
              {{ modal.errorMsg }}
            </div>
            <div class="btn btn-bg-puple btn-right" @click="modal.confirm">
              <div class="name" v-if="modal.isLoading">
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
import { ref, computed } from 'vue'
import { Asset } from '@/services/currency/types'

class Props {
  isOpen = prop<boolean>({ default: false })
  isContract = prop<boolean>({ default: false })
  asset = prop<Asset>({})
  toAddress = prop<string>({})
  amount = prop<number>({})
}

@Options({
  emits: ['update:isOpen', 'onConfirm'],
})
export default class TxConfirmation extends Vue.with(Props) {
  modal = setup(() => {
    const errorMsg = ref('')
    const isLoading = ref(false)
    const password = ref('')

    const close = () => {
      this.$emit('update:isOpen', false)
    }

    const confirm = () => {
      this.$emit('onConfirm', true)
    }

    return {
      isLoading: computed(() => isLoading.value),
      errorMsg,
      password,
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

  &-header {
    height: auto;
    padding: 39px 36px;

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
    padding: 35px;
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
        font-size: 16px;
        color: #878787;
        text-align: left;
        margin-left: 10px;
      }

      .data {
        font-size: 20px;
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
</style>
