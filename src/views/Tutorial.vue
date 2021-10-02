<template>
  <div class="tutorial">
    <div class="wraper">
      <div class="title">Tutorial</div>
      <div class="content">
        <div class="table">
          <iframe
            width="1136"
            height="639"
            src="https://www.youtube.com/embed/lsEGyJCD6zE"
            title="Video Tutorial"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue, setup } from 'vue-class-component'

@Options({})
export default class Tutorial extends Vue {
  tutorial = setup(() => {
    return {}
  })
}
</script>

<style scoped lang="scss">
.stat {
  background: #211733 0% 0% no-repeat padding-box;
}

.wraper {
  margin: auto;
  margin-top: 158px;
  min-width: 800px;
  max-width: 1088px;

  .title {
    text-align: center;
    color: purple;
  }

  .content {
    background: #ffffff 0% 0% no-repeat padding-box;
    box-shadow: 0px 3px 6px #00000029;
    border-radius: 16px;
  }

  .table {
    margin-top: 20px;
    min-height: 500px;
  }

  .nav {
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: center;

    .page-direction {
      cursor: pointer;
      margin: 0 10px;
      width: 20px;
      height: 20px;
    }
  }
}

.text-right {
  text-align: right;
}

.text-left {
  text-align: left;
}

.styled-table {
  width: 100%;
  padding: 20px;
}

.styled-table thead tr {
  color: #272727;
  text-align: left;
  font-size: 18px;
}

.styled-table td {
  color: #691c80;
}

.styled-table th,
.styled-table td {
  padding: 12px 31px;
}

.styled-table tbody tr:nth-of-type(even) {
  background: #fdfbff;
}

.styled-table tbody tr.active-row {
  font-weight: bold;
  background: #fdfbff;
}
</style>
