<template>
  <div v-if="selectedData" :class="'noselect selection ' + bg" @click="open">
    <img class="logo" :src="selectedData.logo" />
    <div class="name">{{ selectedData.name }}</div>
    <div class="amount">
      <div class="balance">{{ numberWithCommas(selectedData.balance, { fixed: [0, 5] }) }}</div>
      <div class="value">~ ${{ numberWithCommas(selectedData.value, { fixed: [0, 4] }) }}</div>
    </div>

    <img class="arrow" src="@/assets/img/ios-arrow-down.svg" />
  </div>

  <transition name="modal">
    <div v-if="showSelection" class="mask">
      <div class="noselect selection-modal shadow" :class="{ active: showSelection }">
        <div class="selection-modal-header">
          <div class="title">Select Asset</div>
          <div class="actions actions-item" @click="close">
            <img class="icon" src="@/assets/img/cancel.png" alt="close" />
          </div>
        </div>

        <ul class="selection-modal-list">
          <li
            v-for="(item, index) in dataList"
            :key="'menu' + item.name"
            class="selection-modal-item"
          >
            <a class="dropdown-link" :title="item.name" @click="select(index)">
              <div :class="'selection'">
                <img class="logo" :src="item.logo" />
                <div class="name">{{ item.name }}</div>
                <div class="amount">
                  <div class="balance">{{ numberWithCommas(item.balance, { fixed: [0, 8] }) }}</div>
                  <div class="value">~ ${{ numberWithCommas(item.value, { fixed: [0, 4] }) }}</div>
                </div>
              </div>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { watchEffect, watch, PropType } from 'vue'
import { Asset } from '@/services/currency/types'
import { getEstimatedValue } from '@/services/utils'
import useSelection from '@/components/composables/use-selection'
import { numberWithCommas } from '@/utils'

const props = defineProps({
  bg: {
    type: String,
    default: 'bg-purple',
  },
  selectedIndex: {
    type: Number,
    default: 0,
  },
  assets: {
    type: Object as PropType<Asset[]>,
    default: function () {
      return []
    },
  },
})

const emit = defineEmits(['onSelect'])
const { showSelection, selectedIndex, selectedData, dataList, open, close, select } = useSelection(
  props.selectedIndex
)

watch(selectedIndex, (index) => {
  emit('onSelect', index)
})

watch(
  () => props.selectedIndex,
  (index) => {
    if (index !== selectedIndex.value) {
      select(index)
    }
  }
)

watchEffect(() => {
  dataList.value = props.assets.map((asset) => {
    const value = getEstimatedValue(asset.amount, asset.price)
    return {
      logo: asset.style.icon,
      name: asset.symbol,
      balance: asset.amount,
      value: Number(value),
    }
  })
})
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
    padding-bottom: 15px;
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
