import { ref, computed } from 'vue'

interface DataList {
  logo: string
  name: string
  balance: number
  value: number
}

export default function useSelection(defalutIndex: number) {
  const showSelection = ref(false)
  const selectedIndex = ref(defalutIndex)
  const dataList = ref<DataList[]>([])

  const addData = (logo: string, name: string, balance: number, value: number) => {
    dataList.value.push({
      logo,
      name,
      balance,
      value,
    })
  }

  const open = () => {
    showSelection.value = true
  }

  const close = () => {
    showSelection.value = false
  }

  const select = (index: number) => {
    if (index >= 0 && index < dataList.value.length) selectedIndex.value = index

    close()
  }

  return {
    showSelection: computed(() => showSelection.value),
    selectedIndex: computed(() => selectedIndex.value),
    selectedData: computed(() => {
      if (typeof dataList.value[selectedIndex.value] != 'undefined') {
        return dataList.value[selectedIndex.value]
      } else {
        return false
      }
    }),
    dataList,
    addData,
    open,
    close,
    select,
  }
}
