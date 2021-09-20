<template>
  <div class="info">
    <div class="menu-layout">
      <div class="menu">
        <ul class="menu-list">
          <li class="menu-item" @click="showIt('intro')">Introduction</li>
          <li class="menu-item" @click="showIt('whatIs')">What is cross-chaining</li>
          <li class="menu-item" @click="showIt('ccTypes')">Types of cross-chain</li>
          <li class="menu-item" @click="showIt('how')">How it works</li>
          <li class="menu-item" @click="showIt('example')">Example</li>
          <li class="menu-item" @click="showIt('prosCons')">Pros and Cons</li>
          <li class="menu-item" @click="showIt('future')">Future Plans</li>
        </ul>
      </div>
    </div>

    <div class="content-layout">
      <div class="content show" ref="intro">
        <div class="content-title">{{ introContent.title }}</div>
        <div class="content-body">{{ introContent.body }}</div>
      </div>
      <div class="content hide" ref="whatIs">
        <div class="content-title">{{ whatIsContent.title }}</div>
        <div class="content-body">{{ whatIsContent.body }}</div>
      </div>
      <div class="content hide" ref="ccTypes">
        <div class="content-title">{{ cctypes.title }}</div>
        <div class="content-body">{{ cctypes.body }}</div>
      </div>
      <div class="content hide" ref="how">
        <div class="content-title">{{ howItWorks.title }}</div>
        <div class="content-body">{{ howItWorks.body }}</div>
      </div>
      <div class="content hide" ref="example">
        <div class="content-title">{{ exampleOfUse.title }}</div>
        <div class="content-body">{{ exampleOfUse.body }}</div>
      </div>
      <div class="content hide" ref="prosCons">
        <div class="content-title">{{ proscons.title }}</div>
        <div class="content-body">{{ proscons.body }}</div>
      </div>
      <div class="content hide" ref="future">
        <div class="content-title">{{ futurePlans.title }}</div>
        <div class="content-body">{{ futurePlans.body }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'

@Options({
  components: {},
})
export default class Info extends Vue {
  showIt(element: string) {
    /* hide all*/
    let shown = document.querySelectorAll('.show')
    for (var i = 0; i < shown.length; i++) {
      shown[i].classList.remove('show')
      shown[i].classList.add('hide')
    }

    /* display current element*/
    const el: any = this.$refs[element]
    el.classList.remove('hide')
    el.classList.add('show')
  }

  introContent = {
    title: 'Introduction',
    body: "The value of a blockchain is not based only on technology but also on the number of its users. As actual users number increase the value of the system increases. The increase is not just linear but exponential. This  is called “the network effect” or “Metcalfe's Law”.  This is the reason why adoption is so important and why blockachains like Ethereum has a much greater value than others. The richer the ecosystem, the more usability (utility) it brings, which attracts more users.  The more users, the more demand for its use and services, so the greater the value of the blockchain (or any system in general). One of the problem is that blockchains, because of their nature, are suffering from diseconomies of scale: the more users at any time, the higher the congestion for the current block. That brings high operation costs for the users and applications alike (aka “gas cost” per transaction). After a point the use of decentralized applications become prohibitive, which bring further adoption to a halt. This is true for Ethereum and Binance chains at least. On the other hand, blockchains which have a small number of users suffer from low usage. Low demand has a very low cost which stays unexploited. New users and developers are not attracted to them because of their small ecosystems. The solution to above, which can benefit both users, decentralized app creators and also the blockchains (including the congested ones), and finally the whole blockchain industry as total adoption will increase, is cross-chaining.",
  }

  whatIsContent = {
    title: 'What is cross-chaining',
    body: 'Cross chaining is the capability of connecting different blockchains. It can include the ability for assets to transfer from blockchain to blockchain. Cross chaining can also be a decentralized application that can be operating on two or more chains.',
  }

  cctypes = {
    title: 'Types of cross-chain',
    body: 'There are different cross chain strategies. There are completely different  schemes. There is cross-chaining architecture which is completely decentralized. There are also centralized cross chaining schemes or schemes using custodians. Decentralized solutions are much slower and costly, but also completely trustless. Solution which include custodians can be much faster and cost effective. As a drawback, some trust is involved.',
  }

  howItWorks = {
    title: 'How it works',
    body: 'This application follows a custodian cross-chain strategy. It bridges Ecochain with ethereum and can also bridge Ecochain with any chain that hosts an EVM (Ethereum Virtual Machine). The logic is the following: Users which hold ECOC or any ECRC20 asset on Ecochain can transfer them to other chains, use any application they want on other chains or transfer them to other users. Whenever (or if) they want they can bring them back to ecochain. The steps are the following: - The user locks ECOC or a ECRC20 token on Ecochain. The user declares the public address on target chain that he wishes to receive the asset. The gas fee of target chain is paid in ECOC. - Oracles see the transaction on ecochain and issue a wrapped token of equal amount on the target chain. For ECOC a wrapped token exists on target chain (WECOC). - The user cant use the original ECOC or ECRC20 token on Ecochain because it is locked. - The user can freely use the wrapped tokens to join the ecosystem on target chain. They can also transfer them to other users (public addresses). - New owners, if they wish, can destroy (burn) the wrapped token, declaring the Ecochain address they want to receive to the locked assets. - When oracles witness the burning of wrapped tokens they unlock an equal amount of tokens to the declared Ecochain address. This step is free (no gas costs) for the receiver. The above system secures the fact that the total circulation supply in all chains (original chain and target chains) never excide the total supply of the asset. Wrapped tokens are starting with a total supply of zero. While the wrapped tokens are circulating the original tokens are staying locked , and they are unlocked after the wrapped tokens are destroyed. No inflation occurs during the whole process. Of course, all the above are invisible to the normal user. For user friendliness, the user can just use this UI. He chooses the tokens he wants to transfer and the amount. The above is only an explanation of what happens under the hood. As a side note, admin fees can be imposed on any asset except ECOC. ECOC admin fees are always zero. ECRC20 admin fees can be zero or up to 1% (this upper limit is hard-coded inside the smart contract and cant be altered by anyone). If admin fee is set to a non zero value then it affects only the “entering” , meaning the conversion from the original asset to the wrapped on target chain. The unlocking (conversion to original token) is always free from gas or admin costs.',
  }

  exampleOfUse = {
    title: 'Example of Use',
    body: 'User holds 100 EFG tokens (an ECRC20 token).  He wishes to transfer the asset to Ethereum. He locks them in the bridge smart contract, also sending ECOC  in the transaction to cover gas cost for target chain (Ethereum gas cost). He declares his Ethereum public address to receive the wrapped assets. The exchange ratio between ECOC/ETH is taken from a reputable decentralized source (swap application). For Ethereum chain the Uniswap pool of WETH/WECOC is used. 	Let’s say that the admin fee is 0.5%. An oracle issues 100X99.5%=99.5 WEFG on ethereum chain. WEFG is an ERC20 token. The user can join any DeFi application he wishes on Ethereum, using its ecosystem. For example Uniswap , SushiSwap, Aave, Compound, Synthetix etc. New owners of the tokens can transfer WEFG back to Ecochain, if they so wish. For example someone can burn 50 WEFG, declaring an ecochain public address. After burning the oracle will notice and unlock an equal amount (50 EFG) on ecochain, sending them to the above address. This step is costless, no ECOC gas or admin fees exist for the user.',
  }

  proscons = {
    title: 'Pros and Cons',
    body: 'The advantage of the above solution is fast transfer between chains and low gas costs because the transfer completes in one step. The only drawback is that it is not completely trustless (not fully decentralized).',
  }

  futurePlans = {
    title: 'Future Plans',
    body: 'The bridging will involve all major chains. Technically all chains that run a VM (they have smart contracts) can be bridged to Ecochain. We prioritize the chains which have the highest users, starting with Ethereum. This is the fastest way to achieve a large size for the total ecosystem for Ecochain assets.',
  }
}
</script>

<style scoped lang="scss">
.hide {
  display: none;
}

.show {
  display: block;
}

.info {
  background: #ffffff;
  display: flex;

  .menu-layout {
    margin-top: 84px;
    background: #211733 0% 0% no-repeat padding-box;
    border-radius: 5px;
    float: left;
    width: 33%;
    color: #ffffff;

    .menu {
      text-align: left;
      padding-top: 100px;
      min-width: 200px;

      &-list {
        margin-left: 40%;
      }

      &-item {
        cursor: pointer;

        &:active {
          font-weight: bold;
        }

        &:hover {
          font-weight: bold;
        }
      }
    }
  }

  .content-layout {
    margin-top: 84px;
    background-color: #ffffff;
    float: right;
    width: 67%;
    height: 100%;
    min-width: 200px;

    .content {
      text-align: left;
      padding-top: 100px;
      padding-left: 100px;
      width: 80%;

      &-title {
        font-size: 25px;
        font-weight: bold;
      }

      &-body {
        color: #929292;
        margin-top: 20px;
      }
    }
  }
}
</style>
