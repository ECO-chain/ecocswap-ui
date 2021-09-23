<template>
  <div v-show="tab.isActive" class="tab">
    <slot></slot>
  </div>
</template>

<script lang="ts">
/* eslint @typescript-eslint/no-var-requires: "off" */
import { Options, Vue, setup, prop } from 'vue-class-component'
import { inject, ref, computed, watch } from 'vue'

class Props {
  name = prop<string>({ default: 'Tab' })
  icon = prop<string>({ default: '@/assets/img/ios-arrow-down.svg' })
}

@Options({})
export default class Tab extends Vue.with(Props) {
  tab = setup(() => {
    const tabs = inject('TabsProvider') as any
    const index = ref(tabs.addData(this.name, this.icon))
    const isActive = ref(index.value === tabs.currentTab)

    watch(
      () => tabs.currentTab,
      () => {
        isActive.value = index.value === tabs.currentTab
      }
    )

    return {
      isActive: computed(() => isActive.value),
    }
  })
}
</script>

<style scoped lang="scss"></style>
