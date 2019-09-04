<template>
  <div class="chart-container">
    <el-button v-show="false" @click="addSource">添加数据</el-button>
    <mix-chart height="100%" width="100%" :data="data" />
  </div>
</template>

<script>
import MixChart from '@/components/Echarts/MixChart'

export default {
  name: 'KeyboardChart',
  components: { MixChart },
  data() {
    return {
      data: [
        ['product', '2012', '2013', '2014', '2015', '2016', '2017'],
        ['Matcha Latte', 41.1, 30.4, 65.1, 53.3, 83.8, 98.7],
        ['Milk Tea', 86.5, 92.1, 85.7, 83.1, 73.4, 55.1],
        ['Cheese Cocoa', 24.1, 67.2, 79.5, 86.4, 65.2, 82.5],
        ['Walnut Brownie', 55.2, 67.1, 69.2, 72.4, 53.9, 39.1]
      ]
    }
  },
  methods: {
    addSource() {
      this.data.push(['Matcha Latte1', 34.1, 37.4, 59.1, 89.3, 56.8, 88.7])
    }
  }
}
</script>

<style scoped>
.chart-container{
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
