<template>
  <transition name="modal">
    <div class="mask" v-if="isOpen">
      <div :class="'modal ' + txType">
        <div class="modal-header">
          <div class="actions actions-item" @click="modal.close">
            <img class="icon" src="@/assets/img/cancel.png" alt="close" />
          </div>
        </div>
        <div class="modal-wraper">
          <div v-if="errorMsg" class="modal-error">
            <div class="error-wraper">
              <img class="icon" src="@/assets/img/failed.png" />
              <div class="text-title">Transaction Failed</div>
              <div class="text-data">{{ errorMsg }}</div>
            </div>
          </div>

          <div v-else-if="txid" class="modal-result">
            <div class="result-wraper">
              <img class="icon" src="@/assets/img/arrow-up-circle.svg" />
              <div class="text-title">Transaction Submiitted</div>
              <a class="text-data link" @click="modal.gotoExplorer">View on Explorer</a>
            </div>
          </div>

          <div v-else class="modal-loading">
            <div v-if="modal.isEcocType">
              <easy-spinner size="150" type="dots" />
              <div class="loading-wraper">
                <div class="text-title">Waiting For Transaction ID</div>
                <div class="text-data">{{ loadingMsg }}</div>
              </div>
            </div>

            <div v-else-if="modal.isEthType">
              <easy-spinner size="150" type="dots" />
              <div class="loading-wraper">
                <div class="text-title">Waiting For Confirmation</div>
                <div class="text-data">{{ loadingMsg }}</div>
                <div class="text-bottom">Confirm this transaction in your wallet</div>
              </div>
            </div>
            <div v-else>
              <easy-spinner size="150" type="dots" color="#691C80" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { Options, Vue, setup, prop } from 'vue-class-component'
import { ref, computed, watchEffect } from 'vue'
import { getEcocExplorerUrl, getEthExplorerUrl } from '@/services/utils'

class Props {
  isOpen = prop<boolean>({ default: false })
  txType = prop<string>({ default: 'ecoc' })
  txid = prop<string>({ default: '' })
  loadingMsg = prop<string>({ default: '' })
  errorMsg = prop<string>({ default: '' })
}

@Options({ emits: ['update:isOpen'] })
export default class TxSend extends Vue.with(Props) {
  modal = setup(() => {
    const txid = ref(this.txid)
    const isEcocType = computed(() => this.txType === 'ecoc')
    const isEthType = computed(() => this.txType === 'eth')

    watchEffect(() => (txid.value = this.txid))

    const close = () => {
      this.$emit('update:isOpen', false)
    }

    const gotoExplorer = () => {
      let fullurl

      switch (this.txType) {
        case 'ecoc':
          fullurl = getEcocExplorerUrl() + '/tx/' + txid.value
          window.open(`${fullurl}`)
          break
        case 'eth':
          fullurl = getEthExplorerUrl() + '/tx/' + txid.value
          window.open(`${fullurl}`)
          break
      }
    }

    return {
      isEcocType,
      isEthType,
      gotoExplorer,
      close,
    }
  })
}
</script>

<style scoped lang="scss">
.ecoc {
  color: #691c80;
}

.eth {
  color: #15bacf;
  .icon {
    filter: brightness(1) sepia(1) hue-rotate(140deg) saturate(6);
  }
}
.modal {
  position: absolute;
  top: 50%;
  right: 50%;
  max-width: 455px;
  min-width: 400px;
  max-height: 464px;
  min-height: 400px;
  background: #ffffff 0% 0% no-repeat padding-box;
  box-shadow: 0px 3px 6px #00000029;
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

  &-error {
    .error-wraper {
      margin-top: 40px;
      .icon {
        width: 120px;
        height: 120px;
      }

      .text-title {
        color: #ff1a1a;
        margin-top: 40px;
        font-weight: bold;
        font-size: 20px;
      }

      .text-data {
        font-size: 14px;
        color: #878787;
      }
    }
  }

  &-result {
    .result-wraper {
      margin-top: 40px;
      .icon {
        width: 120px;
        height: 120px;
      }

      .text-title {
        margin-top: 40px;
        font-weight: bold;
        font-size: 20px;
      }

      .text-data {
        font-size: 14px;
        color: #878787;
      }
    }
  }

  &-loading {
    .loading-wraper {
      margin-top: 45px;
      .text-title {
        font-weight: bold;
        font-size: 20px;
      }

      .text-data {
        margin-top: 6px;
        font-size: 14px;
        color: #878787;
      }

      .text-bottom {
        margin-top: 70px;
        margin-bottom: 30px;
        font-size: 14px;
        color: #878787;
      }
    }
  }
}

.link {
  cursor: pointer;
  text-decoration: underline;
}

@media only screen and (max-width: 400px) {
  .modal {
    width: 350px;
    height: 364px;
  }
}
</style>
