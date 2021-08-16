<template>
  <div :class="'selection ' + bg" @click="selection.open">
    <img class="logo" :src="selectedData.logo" />
    <div class="name">{{ selectedData.name }}</div>
    <div class="amount">
      <div class="balance">{{ selectedData.balance }}</div>
      <div class="value">~ ${{ selectedData.value }}</div>
    </div>

    <img class="arrow" src="@/assets/img/ios-arrow-down.svg" />
  </div>

  <transition name="modal">
    <div class="mask" v-if="selection.showSelection">
      <div class="selection-modal shadow" v-bind:class="{ active: selection.showSelection }">
        <div class="selection-modal-header">
          <div class="title">Select Token</div>
          <div class="actions actions-item" @click="selection.close">X</div>
        </div>

        <ul class="selection-modal-list">
          <li
            class="selection-modal-item"
            v-for="(item, index) in selection.dataList"
            :key="'menu' + item.name"
          >
            <a @click="selection.select(index)" class="dropdown-link" :title="item.name">
              <div :class="'selection'">
                <img class="logo" :src="item.logo" />
                <div class="name">{{ item.name }}</div>
                <div class="amount">
                  <div class="balance">{{ item.balance }}</div>
                  <div class="value">~ ${{ item.value }}</div>
                </div>
              </div>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
/* eslint @typescript-eslint/no-var-requires: "off" */
import { Options, Vue, setup, prop } from 'vue-class-component'
import useSelection from '@/components/composables/use-selection'
import { KNOWN_CURRENCY } from '@/constants'

class Props {
  bg = prop<string>({ default: 'bg-purple' })
  defalutIndex = prop<number>({ default: 0 })
}

@Options({})
export default class Selection extends Vue.with(Props) {
  selection = setup(() => {
    const { showSelection, selectedIndex, selectedData, dataList, addData, open, close, select } =
      useSelection(this.defalutIndex)

    addData(KNOWN_CURRENCY['ECOC'].icon, 'ECOC', 1000, 1200)
    addData(KNOWN_CURRENCY['EFG'].icon, 'EFG', 121, 211)
    addData(KNOWN_CURRENCY['GPT'].icon, 'GPT', 25, 4422)

    return {
      showSelection,
      selectedIndex,
      selectedData,
      dataList,
      open,
      close,
      select,
    }
  })

  get selectedData() {
    return this.selection.selectedData
  }
}
</script>

<style scoped lang="scss">
.selection {
  display: flex;
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

.selection-modal {
  position: absolute;
  top: 50%;
  right: 50%;
  z-index: 10000;
  height: auto;
  width: 508px;
  min-width: 508px;
  overflow-y: auto;
  border-radius: 32px;
  background-color: white;
  border: 1px solid var(--color-gray);
  transform: translate(50%, -50%);

  &-header {
    height: auto;
    padding: 39px 36px;
    .title {
      float: left;
      font-size: 20px;
    }
    .actions {
      float: right;
      &-item {
        cursor: pointer;
        font-size: 24px;
      }
    }
  }

  &-list {
    padding: 0;
  }

  &-item {
    padding-left: 25px;
    padding-right: 25px;

    .selection {
      box-shadow: 0px 0px 0px #00000029;
    }

    &:hover {
      background: #f9f5ff;
    }
  }
}
</style>
