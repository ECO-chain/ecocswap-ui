<template>
  <div id="app">
    <Header />
    <router-view class="container" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import Header from '@/components/Header.vue'

@Options({
  components: {
    Header,
  },
})
export default class Home extends Vue {}
</script>

<style lang="scss">
@font-face {
  font-family: 'Poppins';
  src: url('assets/fonts/Poppins-Regular.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}

@font-face {
  font-family: 'Poppins';
  src: url('assets/fonts/Poppins-Bold.ttf') format('truetype');
  font-weight: bold;
  font-style: normal;
}

@font-face {
  font-family: 'Poppins';
  src: url('assets/fonts/Poppins-Light.ttf') format('truetype');
  font-weight: lighter;
  font-style: normal;
}

@font-face {
  font-family: 'Poppins';
  src: url('assets/fonts/Poppins-ExtraBold.ttf') format('truetype');
  font-weight: 800;
  font-style: normal;
}

#app {
  background-color: #f5f6f8;
  font-family: 'Poppins', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

html,
body {
  font-family: 'Poppins', sans-serif;
  overflow: -moz-scrollbars-none;
  -ms-overflow-style: none;
}

body::-webkit-scrollbar {
  width: 0 !important;
}

ul {
  list-style-type: none;
}

.container {
  margin-top: 84px;
  font-size: 16px;
  width: 100%;
  text-align: center;
  min-height: 100vh;
  overflow-y: auto;
}
</style>
