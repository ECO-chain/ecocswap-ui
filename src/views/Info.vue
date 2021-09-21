<template>
  <div class="info">
    <div class="menu-layout">
      <div class="menu">
        <ul class="menu-list">
          <li class="menu-item" @click="showIt('intro')">{{ $t('info.introduction') }}</li>
          <li class="menu-item" @click="showIt('whatIs')">{{ $t('info.whatIs') }}</li>
          <li class="menu-item" @click="showIt('ccTypes')">{{ $t('info.ccTypes') }}</li>
          <li class="menu-item" @click="showIt('how')">{{ $t('info.how') }}</li>
          <li class="menu-item" @click="showIt('example')">{{ $t('info.example') }}</li>
          <li class="menu-item" @click="showIt('prosCons')">{{ $t('info.prosCons') }}</li>
          <li class="menu-item" @click="showIt('future')">{{ $t('info.future') }}</li>
        </ul>
      </div>
    </div>

    <div class="content-layout">
      <div ref="intro" class="content show">
        <div class="content-title">{{ $t('info.title.introduction') }}</div>
        <div class="content-body">{{ $t('info.body.introduction') }}</div>
      </div>
      <div ref="whatIs" class="content hide">
        <div class="content-title">{{ $t('info.title.whatIs') }}</div>
        <div class="content-body">{{ $t('info.body.whatIs') }}</div>
      </div>
      <div ref="ccTypes" class="content hide">
        <div class="content-title">{{ $t('info.title.ccTypes') }}</div>
        <div class="content-body">{{ $t('info.body.ccTypes') }}</div>
      </div>
      <div ref="how" class="content hide">
        <div class="content-title">{{ $t('info.title.how') }}</div>
        <div class="content-body">{{ $t('info.body.how') }}</div>
      </div>
      <div ref="example" class="content hide">
        <div class="content-title">{{ $t('info.title.example') }}</div>
        <div class="content-body">{{ $t('info.body.example') }}</div>
      </div>
      <div ref="prosCons" class="content hide">
        <div class="content-title">{{ $t('info.title.prosCons') }}</div>
        <div class="content-body">{{ $t('info.body.prosCons') }}</div>
      </div>
      <div ref="future" class="content hide">
        <div class="content-title">{{ $t('info.title.future') }}</div>
        <div class="content-body">{{ $t('info.body.future') }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'

@Options({
  components: {},
})
export default class Info extends Vue {
  showIt(element: string) {
    /* hide all*/
    let shown = document.querySelectorAll('.show')
    for (var i = 0; i < shown.length; i++) {
      shown[i].classList.remove('show')
      shown[i].classList.add('hide')
    }

    /* display current element*/
    const el: any = this.$refs[element]
    el.classList.remove('hide')
    el.classList.add('show')
  }
}
</script>

<style scoped lang="scss">
.hide {
  display: none;
}

.show {
  display: block;
}

.info {
  background: #ffffff;
  display: flex;

  .menu-layout {
    margin-top: 84px;
    background: #211733 0% 0% no-repeat padding-box;
    border-radius: 5px;
    float: left;
    width: 33%;
    color: #ffffff;

    .menu {
      text-align: left;
      padding-top: 100px;
      min-width: 200px;

      &-list {
        margin-left: 40%;
      }

      &-item {
        cursor: pointer;

        &:active {
          font-weight: bold;
        }

        &:hover {
          font-weight: bold;
        }
      }
    }
  }

  .content-layout {
    margin-top: 84px;
    background-color: #ffffff;
    float: right;
    width: 67%;
    height: 100%;
    min-width: 200px;

    .content {
      text-align: left;
      padding-top: 100px;
      padding-left: 100px;
      width: 80%;

      &-title {
        font-size: 25px;
        font-weight: bold;
      }

      &-body {
        color: #929292;
        margin-top: 20px;
      }
    }
  }
}
</style>
