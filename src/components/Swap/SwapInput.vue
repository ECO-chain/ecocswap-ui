<template>
  <div class="swap-input">
    <div class="max link" @click="onMax">Max</div>
    <div class="input-wraper">
      <input
        class="input"
        type="number"
        placeholder="0"
        :value="amount"
        @input="$emit('update:amount', $event.target.value)"
      />
      <div class="value">~ ${{ value }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue, prop } from 'vue-class-component'

class Props {
  amount = prop<string | number>({ default: '' })
  price = prop<number>({ default: 0 })
}

@Options({
  emits: ['onMax', 'update:amount'],
})
export default class SwapInput extends Vue.with(Props) {
  get value() {
    if (!this.amount) {
      return 0
    }

    return Number(this.amount) * this.price
  }

  onMax() {
    this.$emit('onMax')
  }
}
</script>

<style scoped lang="scss">
input {
  padding: 5px 0px;
  margin: 0px;
  font-size: 20px;
}

.swap-input {
  display: flex;
  align-items: center;
  height: 72px;
  width: 100%;
  background: #ffffff 0% 0% no-repeat padding-box;
  box-shadow: inset 0px 3px 6px #00000029;
  border-radius: 16px;

  .max {
    margin-left: 32px;
  }

  .input-wraper {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-right: 20px;

    .input {
      text-align: right;
    }

    .value {
      color: #7a7a7a;
      text-align: right;
      font-size: 11px;
    }
  }
}

.link {
  color: inherit;
  cursor: pointer;
  text-decoration: underline;
  font-weight: bold;
}
</style>
