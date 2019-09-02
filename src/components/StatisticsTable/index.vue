<template>
  <div id="statistics-table">
    <h3>工数统计</h3>
    <table border="1" width="500px">
      <tr>
        <th>大组</th>
        <th>小组</th>
        <th v-for="(optionKey, index) in optionList" :key="index">{{ optionKey }}</th>
      </tr>
      <template v-for="(item, statisticsIndex) in statisticsData">
        <template v-if="item.children.length == 0">
          <tr :key="statisticsIndex">
            <td colspan="2" style="text-align: left;">{{ item.group }}</td>
            <td v-for="(optionKey, index) in optionList" :key="index">{{ item[optionKey] }}</td>
          </tr>
        </template>
        <template v-else>
          <tr :key="statisticsIndex">
            <td colspan="2" style="text-align: left;">{{ item.group }}</td>
            <td v-for="(optionKey, index) in optionList" :key="index">{{ item[optionKey] }}</td>
          </tr>
          <tr v-for="(groupItem, index) in item.children" :key="index">
            <td />
            <td>{{ groupItem.group }}</td>
            <td v-for="(optionKey, optionIndex) in optionList" :key="optionIndex">{{ groupItem[optionKey] }}</td>
          </tr>
        </template>
      </template>
    </table>
  </div>
</template>
<script>
export default {
  name: 'StatisticsTable',
  props: {
    optionList: {
      type: Array,
      default: () => {
        return []
      }
    },
    statisticsData: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
    }
  }
}
</script>
<style scoped>
#statistics-table {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 10000;
  background-color: white;
  cursor: move;
  padding: 0 20px 30px 20px;
  border-radius: 2px;
  filter: drop-shadow(0 3px 5px black);
}
table {
  border-collapse: collapse;
}
td {
    height: 20px;
}
</style>
