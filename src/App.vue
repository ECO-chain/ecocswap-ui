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
  margin: 0;
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

.btn {
  height: 55px;
  border-radius: 16px;
  opacity: 1;
  color: white;
  cursor: pointer;
  z-index: 10 !important;

  .name {
    position: relative;
    top: 50%;
    transform: translate(0, -50%);
  }

  &-puple {
    background: #691c80 0% 0% no-repeat padding-box;
  }

  &-blue {
    background: #15bacf 0% 0% no-repeat padding-box;
  }

  &-blue2 {
    background: #baf7ff 0% 0% no-repeat padding-box;
  }

  &:hover {
    opacity: 0.8;
  }
}

.mask {
  position: fixed;
  z-index: 10000;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
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

// Dropdown Menu Animation

.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.5s;
}
.dropdown-enter,
.dropdown-leave-to {
  opacity: 0;
  transition: visibility 0s 0.2s, opacity 0.2s linear;
}

// Modals Menu Animation
.modal-enter-active,
.modal-leave-active {
  transition: all 0.5s;
}
.modal-enter,
.modal-leave-to {
  opacity: 0;
  transition: visibility 0s 0.2s, opacity 0.2s linear;
}
</style>
