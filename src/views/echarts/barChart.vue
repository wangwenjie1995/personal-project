<template>
  <div class="chart-container">
    <bar-chart height="100%" width="100%" :data="data" :title="title" :y-max="yMax" :data-axis="dataAxis" />
  </div>
</template>

<script>
import BarChart from '@/components/Echarts/BarChart'

export default {
  name: 'BarChartDemo',
  components: { BarChart },
  data() {
    return {
      data: [220, 182, 191, 234, 290, 330, 310, 123, 442, 321, 90, 149, 210, 122, 133, 334, 198, 123, 125, 220],
      dataAxis: ['点', '击', '柱', '子', '或', '者', '两', '指', '在', '触', '屏', '上', '滑', '动', '能', '够', '自', '动', '缩', '放'],
      title: '柱状图：渐变色 阴影 点击缩放',
      yMax: 1000
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
