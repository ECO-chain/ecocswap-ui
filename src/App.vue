<template>
  <div id="app">
    <Header class="header" />
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
  display: block;
  overflow: hidden;
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

input {
  border-top-style: hidden;
  border-right-style: hidden;
  border-left-style: hidden;
  border-bottom-style: hidden;
  width: 100%;
  padding: 5px 15px;
  margin: 0;

  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  -o-box-sizing: border-box;
  -ms-box-sizing: border-box;
  box-sizing: border-box;

  font-size: 16px;
}

/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type='number'] {
  -moz-appearance: textfield;
}

textarea {
  width: 100%;
  padding: 15px 15px;
  margin: 0;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  -o-box-sizing: border-box;
  -ms-box-sizing: border-box;
  box-sizing: border-box;

  font-size: 16px;
}

/* stylelint-disable-line */
img {
  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
}

*:focus {
  outline: none;
}

::placeholder {
  color: #7a7a7a;
  opacity: 0.8;
}

:-ms-input-placeholder {
  color: #7a7a7a;
  opacity: 0.8;
}

::-ms-input-placeholder {
  color: #7a7a7a;
  opacity: 0.8;
}

.header {
  z-index: 300;
}

.container {
  font-size: 16px;
  width: 100%;
  height: 100%;
  text-align: center;
  min-height: 100vh;
  overflow-y: auto;
}

.btn {
  height: 52px;
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

  .shadow {
    box-shadow: 0px 3px 8px #00000021;
  }

  &-bg-puple {
    background: #691c80 0% 0% no-repeat padding-box;
  }

  &-text-puple {
    color: #691c80;
    background: white;
    border: 1px solid #691c80;
  }

  &-bg-blue {
    background: #15bacf 0% 0% no-repeat padding-box;
  }

  &-text-blue {
    color: #15bacf;
    background: white;
    border: 1px solid #15bacf;
  }

  &-bg-blue2 {
    color: #15bacf;
    background: #baf7ff 0% 0% no-repeat padding-box;
  }

  &-text-blue2 {
    color: #15bacf;
    background: white;
    border: 1px solid #baf7ff;
  }

  &:hover {
    opacity: 0.8;
  }
}

.btn-icon {
  cursor: pointer;
  background: #ffffff 0% 0% no-repeat padding-box;
  box-shadow: 0px 3px 6px #00000029;
  padding: 14px;
  border-radius: 50%;
  height: auto;
  width: auto;

  .icon {
    transform: translate(0, 10%);
  }

  &:hover {
    opacity: 0.8;
  }
}

.mask {
  position: fixed;
  z-index: 1000;
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

.noselect {
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome, Edge, Opera and Firefox */
}

.mt-4 {
  margin-top: 4px;
}

.mt-8 {
  margin-top: 8px;
}

.mb-4 {
  margin-bottom: 4px;
}

.mb-8 {
  margin-bottom: 8px;
}

.error-message {
  text-align: right;
  margin-right: 5px;
  margin-top: 5px;
  color: #ff7878;
  font-size: 14px;
}
</style>
