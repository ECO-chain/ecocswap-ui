<template>
  <div class="eth-connect-wallet">
    <div class="title">Connect Supported Ethereum Wallet</div>
    <div class="menu">
      <div class="item" v-for="(item, index) in menuList" :key="item.name + index">
        <div class="left">
          <div class="text">{{ item.name }}</div>
        </div>
        <div class="right">
          <img class="icon" :src="item.icon" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'

@Options({
  components: {},
})
export default class EcocConnectWallet extends Vue {
  menuList = [
    {
      name: 'MetaMask',
      icon: require('@/assets/img/wallets/metamask.png'),
    },
    {
      name: 'WalletConnect',
      icon: require('@/assets/img/wallets/wallet-connect.png'),
    },
    {
      name: 'Coinbase Wallet',
      icon: require('@/assets/img/wallets/coinbase-wallet.png'),
    },
    {
      name: 'Formatic',
      icon: require('@/assets/img/wallets/formatic.png'),
    },
    {
      name: 'Portis',
      icon: require('@/assets/img/wallets/portis.png'),
    },
  ]
}
</script>

<style scoped lang="scss">
.eth-connect-wallet {
  width: auto;
  .title {
    text-align: center;
    color: #737373;
  }

  .menu {
    margin-top: 54px;
    width: auto;
    .item {
      cursor: pointer;
      display: flex;
      align-items: center;
      background: #ffffff 0% 0% no-repeat padding-box;
      box-shadow: 0px 3px 8px #00000021;
      border-radius: 16px;

      margin-top: 10px;
      width: 370px;
      height: 52px;

      .left {
        text-align: left;
        width: 50%;
        margin-left: 42px;
      }

      .right {
        text-align: right;
        width: 50%;
        margin-right: 42px;
      }

      .text {
        color: #000000;
        font-weight: bold;
      }

      .icon {
        width: 29px;
        height: 29px;
      }

      &:hover {
        background: #baf7ff 0% 0% no-repeat padding-box;
      }
    }
  }
}
</style>
