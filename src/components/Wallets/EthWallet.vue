<template>
  <div class="eth-wallet" flat>
    <div class="text">ETHWallet</div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'

@Options({})
export default class EthWallet extends Vue {}
</script>

<style scoped lang="scss">
.eth-wallet {
  width: 134px;
  height: 70px;
  background: #ffffff 0% 0% no-repeat padding-box;
  box-shadow: 0px 3px 6px #00000029;
  border-radius: 35px 0px 0px 35px;
  opacity: 1;
  cursor: pointer;

  .text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #15bacf;
    font-weight: bold;
  }
}
</style>
