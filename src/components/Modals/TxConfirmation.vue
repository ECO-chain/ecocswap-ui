<template>
  <transition name="modal"> </transition>
</template>

<script lang="ts">
import { Options, Vue, setup, prop } from 'vue-class-component'
import { Asset } from '@/services/currency/types'

class Props {
  asset = prop<Asset>({})
  fromAddress = prop<string>({})
  toAddress = prop<string>({})
  amount = prop<string>({})
}

@Options({})
export default class TxConfirmation extends Vue.with(Props) {
  transaction = setup(() => {
    return {}
  })
}
</script>

<style scoped lang="scss"></style>
