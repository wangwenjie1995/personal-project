<template>
  <div :id="id" :class="className" :style="{height:height,width:width}" :data="data" :title="title" :yMax="yMax" :data-axis="dataAxis" />
</template>

<script>
import echarts from 'echarts'
import chartResize from './Mixins/resize'

export default {
  name: 'BarChart',
  mixins: [chartResize],
  props: {
    data: {
      type: Array,
      default: () => {
        return []
      }
    },
    dataAxis: {
      type: Array,
      default: () => {
        return []
      }
    },
    yMax: {
      type: Number,
      default: 500
    },
    title: {
      type: String,
      default: '柱状图：渐变色 阴影 点击缩放'
    },
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '200px'
    },
    height: {
      type: String,
      default: '200px'
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    data() {
      this.initChart()
    }
  },
  mounted() {
    this.initChart()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id))
      const yMax = 500
      const dataShadow = this.data.map(item => {
        return yMax
      })
      this.chart.setOption({
        title: {
          text: this.title,
          subtext: 'Bar Chart: Gradient Color, Shadow, Click Zoom'
        },
        xAxis: {
          data: this.dataAxis,
          axisLabel: {
            inside: true,
            textStyle: {
              color: '#fff'
            }
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          z: 10
        },
        yAxis: {
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            textStyle: {
              color: '#999'
            }
          }
        },
        dataZoom: [
          {
            type: 'inside'
          }
        ],
        series: [
          { // For shadow
            type: 'bar',
            itemStyle: {
              normal: { color: 'rgba(0,0,0,0.05)' }
            },
            barGap: '-100%',
            barCategoryGap: '40%',
            data: dataShadow,
            animation: false
          },
          {
            type: 'bar',
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0, 0, 0, 1,
                  [
                    { offset: 0, color: '#83bff6' },
                    { offset: 0.5, color: '#188df0' },
                    { offset: 1, color: '#188df0' }
                  ]
                )
              },
              emphasis: {
                color: new echarts.graphic.LinearGradient(
                  0, 0, 0, 1,
                  [
                    { offset: 0, color: '#2378f7' },
                    { offset: 0.7, color: '#2378f7' },
                    { offset: 1, color: '#83bff6' }
                  ]
                )
              }
            },
            data: this.data
          }
        ]
      })
      // Enable data zoom when user click bar.
      const zoomSize = 6
      this.chart.on('click', (params) => {
        this.chart.dispatchAction({
          type: 'dataZoom',
          startValue: this.dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)],
          endValue: this.dataAxis[Math.min(params.dataIndex + zoomSize / 2, this.data.length - 1)]
        })
      })
    }
  }
}
</script>
