<template>
  <div :class="'selection bg-purple'">
    <img class="logo" :src="selectedData.logo" />
    <div class="name">{{ selectedData.name }}</div>
    <div class="amount">
      <div class="balance">{{ selectedData.balance }}</div>
      <div class="value">~ ${{ selectedData.value }}</div>
    </div>

    <img class="arrow" src="@/assets/img/ios-arrow-down.svg" />
  </div>
</template>

<script lang="ts">
import { Options, Vue, setup } from 'vue-class-component'
import { ref, computed } from 'vue'

@Options({
  props: {
    bg: {
      type: String,
      default: 'bg-purple', //available bg-purple, bg-white
    },
    defalutIndex: {
      type: Number,
      default: 0,
    },
    selectionList: [],
  },
})
export default class Selection extends Vue {
  bg!: 'bg-purple'
  defalutIndex!: 0
  selectionList!: []

  selection = setup(() => {
    const showSelection = ref(false)
    const dataList = ref([
      {
        logo: require('@/assets/img/currencies/ecoc.svg'),
        name: 'ECOC',
        balance: 1000,
        value: 1200,
      },
      {
        logo: require('@/assets/img/currencies/efg.svg'),
        name: 'EFG',
        balance: 1000,
        value: 1200,
      },
    ])

    return {
      showSelection,
      dataList: computed(() => dataList.value),
    }
  })

  get selectedData() {
    if (this.selection.dataList.length < 1) return false

    return this.selection.dataList[this.defalutIndex]
  }
}
</script>

<style scoped lang="scss">
.selection {
  display: flex;
  overflow: auto;
  height: 55px;
  min-height: 55px;
  border-radius: 16px;
  cursor: pointer;
  font-size: 16px;
  align-items: center;
  margin: auto;
  padding: 0px 14px;
  box-shadow: 0px 3px 6px #00000029;

  &:hover {
    opacity: 0.8;
  }

  .logo {
    width: 29px;
    height: 29px;
  }

  .name {
    margin-left: 11px;
    font-size: 16px;
  }

  .amount {
    flex: 50%;
    right: 0;
    .balance {
      text-align: right;
      font-weight: bold;
    }

    .value {
      text-align: right;
      font-size: 11px;
    }
  }

  .arrow {
    right: 0;
    margin-left: 7px;
    width: 11px;
    height: 11px;
    filter: brightness(0) invert(1);
  }
}

.bg-purple {
  color: white;
  background: #691c80 0% 0% no-repeat padding-box;
}

.bg-white {
  color: block;
  background: white 0% 0% no-repeat padding-box;
}
</style>
