<template>
  <div class="stat">
    <div class="wraper">
      <div class="title">Token Statistic</div>
      <div class="content">
        <div class="table">
          <table class="styled-table">
            <thead>
              <tr>
                <th>No.</th>
                <th>Name</th>
                <th>Price</th>
                <th>Locked (Ecochain)</th>
                <th>Circulation (Ethereum)</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in statistic.dataList" :key="index + item.name">
                <td class="text-left">{{ index + 1 }}</td>
                <td class="text-left">${{ item.name }}</td>
                <td class="text-left">{{ item.price }}</td>
                <td>{{ item.locked }}</td>
                <td>{{ item.circulation }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="nav">
          <img class="page-direction disable" src="@/assets/img/arrow-left.png" />
          Page 1 of 1
          <img class="page-direction disable" src="@/assets/img/arrow-right.png" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue, setup } from 'vue-class-component'
import { ref, computed } from 'vue'

@Options({})
export default class Stat extends Vue {
  statistic = setup(() => {
    const dataList = ref([
      {
        name: 'ECOC',
        price: 0.09,
        locked: 296524,
        circulation: 126524,
      },

      {
        name: 'EFG',
        price: 125,
        locked: 124153,
        circulation: 24542,
      },

      {
        name: 'GPT',
        price: 958,
        locked: 4574,
        circulation: 1323,
      },
    ])

    return {
      dataList: computed(() => dataList.value),
    }
  })
}
</script>

<style scoped lang="scss">
.stat {
  background: #211733 0% 0% no-repeat padding-box;
}

.wraper {
  margin: auto;
  margin-top: 74px;
  min-width: 800px;
  max-width: 1088px;

  .title {
    text-align: left;
    color: #ffffff;
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

.disable {
  opacity: 0.5;
}
</style>
