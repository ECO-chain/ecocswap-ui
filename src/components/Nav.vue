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
          <li class="dropdown__menu-item" v-for="item in dropdown.dataList" :key="item.id">
            <a @click="item.handler" class="dropdown__menu-link" :title="item.name">
              <div class="dropdown__menu-text">
                {{ item.name }}
                <span class="dropdown__menu-desc">
                  {{ item.discription }}
                </span>
              </div>
            </a>
            <div class="dropdown__menu-submenu" v-if="dropdown.submenu == item.id">
              <li
                class="dropdown__menu-item"
                v-for="submenuItem in item.submenu"
                :key="submenuItem.id"
              >
                <a
                  @click="$i18n.locale = 'zh'"
                  class="dropdown__menu-link"
                  :title="submenuItem.name"
                >
                  <div class="dropdown__menu-text">{{ submenuItem.name }}</div>
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
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import vClickOutside from 'click-outside-vue3'
import { supportedLanguages } from '@/i18n'

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
    const show = ref(false)
    const submenu = ref(-1)
    const dataList = ref([
      {
        id: 0,
        name: 'Languages',
        discription: currentLocale.value,
        submenu: supportedLanguages.map((lan, index) => {
          return {
            id: index,
            name: lan.localizedName,
            handler: () => {
              i18n.locale.value = lan.key
              console.log(lan.key)
              console.log(currentLocale)
              console.log(i18n.locale)
            },
          }
        }),
        handler: () => {
          const menuIndex = 0
          if (submenu.value != menuIndex) submenu.value = menuIndex
          else submenu.value = -1
        },
      },
      {
        id: 1,
        name: 'Docs/info',
        discription: '',
        handler: () => {
          router.push('/info')
        },
      },
      {
        id: 2,
        name: 'Statistics',
        discription: '',
        handler: () => {
          router.push('/stat')
        },
      },
    ])

    const close = () => {
      show.value = false
    }

    const open = () => {
      show.value = true
    }

    return {
      dataList: computed(() => dataList.value),
      submenu: computed(() => submenu.value),
      show: computed(() => show.value),
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

  &-submenu {
    padding: 2px;
    background-color: #f8f4ff;
    font-size: 80%;

    &:hover {
      font-weight: bold;
      color: #f8f4ff;
    }
  }

  &-link {
    display: flex;
    justify-content: flex-start;
    text-decoration: none;
    color: rgba(0, 0, 0, 0.6);
    padding: 10px;
    margin-top: 0.2rem;
    margin-bottom: 0.2rem;
    background-clip: padding-box;

    &:hover {
      color: rgba(0, 0, 0, 0.6);
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
</style>
