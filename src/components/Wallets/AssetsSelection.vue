<template>
  <div :class="'noselect selection ' + bg" @click="selection.open">
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
      <div
        class="noselect selection-modal shadow"
        v-bind:class="{ active: selection.showSelection }"
      >
        <div class="selection-modal-header">
          <div class="title">Select Asset</div>
          <div class="actions actions-item" @click="selection.close">
            <img class="icon" src="@/assets/img/cancel.png" alt="close" />
          </div>
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
import { Options, Vue, setup, prop } from 'vue-class-component'
import { ref, watchEffect, watch } from 'vue'
import { Asset } from '@/services/currency/types'
import { getEstimatedValue } from '@/services/utils'
import useSelection from '@/components/composables/use-selection'

class Props {
  bg = prop<string>({ default: 'bg-purple' })
  selectedIndex = prop<number>({ default: 0 })
  assets = prop<Asset[]>({ default: [] })
}

@Options({
  emits: ['onSelect'],
})
export default class Selection extends Vue.with(Props) {
  selection = setup(() => {
    const { showSelection, selectedIndex, selectedData, dataList, open, close, select } =
      useSelection(this.selectedIndex)
    const selectedIndexProp = ref(this.selectedIndex)

    watch(selectedIndex, (index) => {
      this.$emit('onSelect', index)
    })

    watchEffect(() => {
      selectedIndexProp.value = this.selectedIndex
      selectedIndex.value = selectedIndexProp.value
    })
    watchEffect(() => {
      dataList.value = this.assets.map((asset) => {
        const value = getEstimatedValue(asset.amount, asset.price)
        return {
          logo: asset.style.icon,
          name: asset.symbol,
          balance: asset.amount,
          value: Number(value),
        }
      })
    })

    return {
      selectedIndexProp,
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

  .icon {
    filter: brightness(0) invert(1);
  }
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

      &:hover {
        opacity: 0.5;
      }

      .icon {
        width: 21px;
        height: 21px;
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
