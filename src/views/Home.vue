<template>
  <div class="home">
    <div class="ecoc-side">ECOCHAIN</div>
    <div class="alt-side">ETHEREUM</div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'

@Options({
  components: {},
})
export default class Home extends Vue {}
</script>

<style scoped lang="scss">
.home {
  display: flex;
  align-items: stretch;
  height: 100%;

  .ecoc-side {
    flex: 50%;
    background: transparent linear-gradient(180deg, #f8f3ff 0%, #ffffff 100%) 0% 0% padding-box;
    opacity: 1;

    text-align: right;
    padding-top: 100px;
    padding-right: 100px;
    color: #691c80;
  }

  .alt-side {
    flex: 50%;
    background: transparent linear-gradient(180deg, #ffe5fb 0%, #ffffff 100%) 0% 0% padding-box;
    opacity: 1;

    text-align: left;
    padding-top: 100px;
    padding-left: 100px;

    color: #ff43c7;
  }
}
</style>
