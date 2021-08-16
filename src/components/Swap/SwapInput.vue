<template>
  <div class="swap-input">
    <div class="max">Max</div>
    <div class="input-wraper">
      <input class="input" type="number" placeholder="0" v-model="amount" />
      <div class="value">~ ${{ value }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'

@Options({
  components: {},
})
export default class SwapInput extends Vue {
  amount = ''

  get value() {
    const rate = 1.24

    if (!this.amount) {
      return 0
    }

    return Number(this.amount) * rate
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
      text-align: right;
      font-size: 11px;
    }
  }
}
</style>
