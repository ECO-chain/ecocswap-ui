import { ref, computed } from 'vue'

interface DataList {
  name: string
  icon: string
  isActive: boolean
}

export default function useTabs() {
  const defalutTab = 0
  const currentTab = ref(defalutTab)
  const dataList = ref<DataList[]>([])

  const selectTab = (tabIndex: number) => {
    if (tabIndex <= dataList.value.length && tabIndex >= 0) {
      currentTab.value = tabIndex

      dataList.value.forEach((tab, index) => {
        tab.isActive = index === tabIndex
      })
    }
  }

  // icon will use fas icon
  const addData = (name: string, icon: string) => {
    const isActive = dataList.value.length === 0
    dataList.value.push({
      name,
      icon,
      isActive,
    })

    return dataList.value.length - 1
  }

  return {
    dataList: computed(() => dataList.value),
    currentTab: computed(() => currentTab.value),
    selectTab,
    addData,
  }
}
