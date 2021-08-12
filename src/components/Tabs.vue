<template>
  <div class="tabs">
    <div :class="{ tabs__purple: color === 'purple', tabs__blue: color === 'blue' }">
      <ul class="tabs__header">
        <li
          v-for="(tab, index) in tabs.dataList"
          :key="tab.name"
          @click="tabs.selectTab(index)"
          :class="{ tab__selected: index == tabs.currentTab }"
        >
          <font-awesome-icon :icon="['far', tab.icon]" class="icon" />
          {{ tab.name }}
        </li>
      </ul>
    </div>
    <slot></slot>
  </div>
</template>

<script lang="ts">
/* eslint @typescript-eslint/no-var-requires: "off" */
import { Options, Vue, setup, prop } from 'vue-class-component'
import { provide, reactive } from 'vue'
import useTabs from '@/components/composables/use-tabs'

class Props {
  color = prop<string>({ default: 'purple' })
  defalutIndex = prop<number>({ default: 0 })
}

@Options({})
export default class Tab extends Vue.with(Props) {
  tabs = setup(() => {
    const { dataList, currentTab, selectTab, addData } = useTabs()
    provide('TabsProvider', reactive({ currentTab, addData }))

    return {
      currentTab,
      dataList,
      selectTab,
    }
  })
}
</script>

<style scoped lang="scss">
ul.tabs__header {
  font-size: 18px;
  display: flex;
  flex-flow: row wrap;
  margin: 0;
  padding: 0;
}

ul.tabs__header > li {
  flex-grow: 1;
  padding: 15px 30px;
  margin: 0;
  cursor: pointer;
}

ul.tabs__header > li.tab__selected {
  font-weight: bold;
}

.tabs__purple li {
  background: #f9f5ff;
  color: #691c80;
}

.tabs__purple li.tab__selected {
  font-weight: bold;
  border-bottom: 5px solid #691c80;
}

.tabs__blue li {
  background: #baf7ff;
  color: #15bacf;
}

.tabs__blue li.tab__selected {
  font-weight: bold;
  border-bottom: 5px solid #15bacf;
}

.icon {
  margin-right: 5px;
}
</style>
