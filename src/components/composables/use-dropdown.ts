import { ref, computed } from 'vue'

interface DataList {
  id: number
  name: string
  discription: string
  handler: () => void
  subdata?: {
    id: number
    name: string
    handler: () => void
  }[]
}

export default function useDropdown() {
  const show = ref(false)
  const selectedSub = ref(-1)
  const dataList = ref<DataList[]>([])

  const addData = (name: string, discription: string, handler: () => void) => {
    const id = dataList.value.length <= 0 ? 1 : dataList.value[dataList.value.length - 1].id + 1
    dataList.value.push({
      id,
      name,
      discription,
      handler,
    })
  }

  const addSubData = (parentName: string, name: string, handler: () => void) => {
    const parent = dataList.value.find((data) => data.name === parentName)
    if (parent) {
      if (parent.subdata) {
        const id = parent.subdata.length <= 0 ? 1 : parent.subdata[parent.subdata.length - 1].id + 1
        parent.subdata?.push({
          id,
          name,
          handler,
        })
      } else {
        parent.subdata = [
          {
            id: 1,
            name,
            handler,
          },
        ]
      }

      parent.handler = () => {
        const menuIndex = parent.id
        if (selectedSub.value != menuIndex) selectedSub.value = menuIndex
        else selectedSub.value = -1
      }
    }
  }

  const close = () => {
    show.value = false
  }

  const open = () => {
    show.value = true
  }

  return {
    show: computed(() => show.value),
    dataList: computed(() => dataList.value),
    selectedSub: computed(() => selectedSub.value),
    addData,
    addSubData,
    close,
    open,
  }
}
