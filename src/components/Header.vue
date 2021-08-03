<template>
  <div class="header shadow" flat dark>
    <div class="logo" @click="gotoHome">
      <img src="@/assets/logo.svg" alt="logo" />
    </div>
    <Nav class="nav" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import Nav from './Nav.vue'

@Options({
  components: {
    Nav,
  },
})
export default class Header extends Vue {
  gotoHome() {
    this.$router.push('/').catch(() => {
      //
    })
  }
}
</script>

<style scoped lang="scss">
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 84px;
  background: #ffffff 0% 0% no-repeat padding-box;
  opacity: 1;
  z-index: 10;

  .logo {
    float: left;
    margin-top: 20px;
    margin-left: 140px;
    width: 162px;
    height: 43px;

    background: transparent 0% 0% no-repeat padding-box;
    opacity: 1;

    cursor: pointer;
  }

  .nav {
    float: right;
    margin-top: 20px;
    margin-right: 140px;

    opacity: 1;
    text-align: center;
  }
}

.header.shadow {
  -webkit-box-shadow: 0px 3px 6px #00000029;
  -moz-box-shadow: 0px 3px 6px #00000029;
  box-shadow: 0px 3px 6px #00000029;
}
</style>
