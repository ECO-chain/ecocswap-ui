<template>
  <div v-click-outside="dropdown.close">
    <div class="nav" @click="dropdown.open">
      <img class="img" src="@/assets/img/nav.svg" alt="nav" />
    </div>

    <transition name="dropdown">
      <div
        class="dropdown__menu shadow"
        v-bind:class="{ active: dropdown.show }"
        v-if="dropdown.show"
      >
        <ul class="dropdown__menu-nav">
          <li class="dropdown__menu-item" v-for="item in dropdown.dataList" :key="'menu' + item.id">
            <a @click="item.handler" class="dropdown__menu-link" :title="item.name">
              <div class="dropdown__menu-text">
                {{ item.name }}
                <span class="dropdown__menu-desc">
                  {{ item.discription }}
                </span>
              </div>
            </a>
            <div
              class="dropdown__menu-submenu inset-shadow"
              v-if="dropdown.selectedSub === item.id"
            >
              <li
                class="dropdown__menu-item"
                v-for="submItem in item.subdata"
                :key="'sub' + submItem.id"
              >
                <a
                  @click="submItem.handler"
                  class="dropdown__menu-submenu-link"
                  :title="submItem.name"
                >
                  <div class="dropdown__menu-text">{{ submItem.name }}</div>
                </a>
              </li>
            </div>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { Options, Vue, setup } from 'vue-class-component'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import vClickOutside from 'click-outside-vue3'
import { supportedLanguages } from '@/i18n'
import useDropdown from './composables/use-dropdown'

@Options({
  directives: {
    clickOutside: vClickOutside.directive,
  },
})
export default class Nav extends Vue {
  dropdown = setup(() => {
    const i18n = useI18n({ useScope: 'global' })
    const router = useRouter()
    const currentLocale = ref(i18n.locale.value)

    const { show, dataList, selectedSub, addData, addSubData, close, open } = useDropdown()

    addData('Languages', currentLocale.value, () => {
      // do nothing.
    })
    addData('Docs/info', '', () => {
      router.push('/info')
    })
    addData('Statistics', '', () => {
      router.push('/stat')
    })

    supportedLanguages.forEach((lan) => {
      addSubData('Languages', lan.localizedName, () => {
        i18n.locale.value = lan.key
      })
    })

    supportedLanguages.forEach((lan) => {
      addSubData('Languages2', lan.localizedName, () => {
        i18n.locale.value = lan.key
      })
    })

    return {
      dataList: dataList,
      selectedSub: selectedSub,
      show: show,
      close,
      open,
    }
  })
}
</script>

<style scoped lang="scss">
.nav {
  width: 36px;
  height: 36px;
  background: #f8f4ff 0% 0% no-repeat padding-box;
  border-radius: 50%;
  cursor: pointer;

  .img {
    margin-top: 50%;
    -ms-transform: translateY(-50%);
    transform: translateY(-50%);
  }

  &:hover {
    opacity: 0.5;
  }
}

.dropdown__menu {
  top: 100%;
  right: 140px;
  position: absolute;
  z-index: 10;
  height: auto;
  min-width: 200px;
  margin-top: 1rem;
  overflow-y: auto;
  padding: 28px 0px 28px 0px;
  border-radius: 32px;
  background-color: white;
  border: 1px solid var(--color-gray);

  &-nav {
    padding: 0;
  }

  &-link {
    display: flex;
    justify-content: flex-start;
    text-decoration: none;
    color: rgba(0, 0, 0, 0.6);
    padding: 10px;
    margin-top: 0rem;
    margin-bottom: 0rem;
    background-clip: padding-box;

    &:hover {
      color: #691c80;
      background-color: #f8f4ff;
    }
  }

  &-text {
    font-weight: 200;
    margin-left: 28px;
    margin-right: 0;
    padding: 0;
  }

  &-desc {
    text-transform: uppercase;
    margin-left: 28px;
    color: #691c80;
  }

  &-submenu {
    padding: 2px;
    background: #f8f4ff 0% 0% no-repeat padding-box;
    font-size: 80%;

    &-link {
      display: flex;
      justify-content: flex-start;
      text-decoration: none;
      color: rgba(0, 0, 0, 0.6);
      padding: 10px;
      margin-top: 0rem;
      margin-bottom: 0rem;
      background-clip: padding-box;

      &:hover {
        color: #691c80;
      }
    }
  }
}

// Dropdown Menu Animation

.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.5s;
}
.dropdown-enter,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.shadow {
  -webkit-box-shadow: 0px 3px 6px #00000029;
  -moz-box-shadow: 0px 3px 6px #00000029;
  box-shadow: 0px 3px 6px #00000029;
}

.inset-shadow {
  -webkit-box-shadow: inset 0px 3px 6px #00000029;
  -moz-box-shadow: inset 0px 3px 6px #00000029;
  box-shadow: inset 0px 3px 6px #00000029;
}
</style>
