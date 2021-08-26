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
              <a class="text-data link" @click="modal.gotoExplorer(txid)">View on Explorer</a>
            </div>
          </div>

          <div v-else class="modal-loading">
            <div v-if="modal.isEcocType">
              <easy-spinner class="spinner" size="150" type="dots" />
              <div class="loading-wraper">
                <div class="text-title">Waiting For Transaction ID</div>
                <div class="text-data">{{ loadingMsg }}</div>
              </div>
            </div>

            <div v-else-if="modal.isEthType">
              <easy-spinner class="spinner" size="150" type="dots" />
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
import { computed } from 'vue'
import { getEcocExplorerUrl, getEthExplorerUrl } from '@/services/utils'

class Props {
  isOpen = prop<boolean>({ default: false })
  txType = prop<string>({ default: 'ecoc' })
  txid = prop<string>({ required: true })
  loadingMsg = prop<string>({ default: '' })
  errorMsg = prop<string>({ default: '' })
}

@Options({ emits: ['update:isOpen', 'update:txid', 'update:loadingMsg', 'update:errorMsg'] })
export default class TxSend extends Vue.with(Props) {
  modal = setup(() => {
    const isEcocType = computed(() => this.txType === 'ecoc')
    const isEthType = computed(() => this.txType === 'eth')

    const close = () => {
      this.$emit('update:isOpen', false)
      this.$emit('update:txid', '')
      this.$emit('update:loadingMsg', '')
      this.$emit('update:errorMsg', '')
    }

    const gotoExplorer = (txid: string) => {
      let fullurl

      switch (this.txType) {
        case 'ecoc':
          fullurl = getEcocExplorerUrl() + '/tx/' + txid
          window.open(`${fullurl}`)
          break
        case 'eth':
          fullurl = getEthExplorerUrl() + '/tx/' + txid
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
  z-index: 10;

  &-error {
    .error-wraper {
      margin-top: 30px;
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
      margin-top: 30px;
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
    padding: 10px;
    .loading-wraper {
      margin-top: 30px;
      .text-title {
        font-weight: bold;
        font-size: 20px;
      }

      .text-data {
        word-wrap: break-word;
        white-space: -moz-pre-wrap;
        white-space: pre-wrap;
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
    max-width: 350px;
    min-width: 340px;
    max-height: 464px;
    min-height: 400px;
  }
}
</style>
