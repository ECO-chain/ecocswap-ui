<template>
  <div class="info">
    <div class="menu-layout">
      <div class="menu">
        <ul class="menu-list">
          <li class="menu-item">Introduction</li>
          <li class="menu-item">Guides</li>
        </ul>
      </div>
    </div>

    <div class="content-layout">
      <div class="content">
        <div class="content-title">{{ introContent.title }}</div>
        <div class="content-body">{{ introContent.body }}</div>
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
  introContent = {
    title: 'Introduction',
    body: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.',
  }
}
</script>

<style scoped lang="scss">
.info {
  background: #ffffff;
  display: flex;

  .menu-layout {
    background-color: #fcfaff;
    float: left;
    width: 33%;

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
