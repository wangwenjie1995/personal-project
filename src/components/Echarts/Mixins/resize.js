// import Echarts from 'echarts'
import _ from 'lodash'

export default {
  data() {
    return {
      $_sidebarEle: null
    }
  },
  computed: {
    /* 图表DOM */
    // $_chartMixin_chartWrapperDom() {
    //   const dom = document.getElementById(this.id)
    //   return dom && Echarts.init(dom)
    // },
    // 图表resize节流，这里使用了lodash,也可以使用setTimeout实现节流
    $_chartMixin_chartResize() {
      return _.throttle(() => {
        if (this.chart) {
          this.chart.resize()
        }
      }, 200)
    },
    sidebar() {
      return this.$store.state.app.sidebar.opened
    }
  },
  watch: {
    sidebar(val) {
      setTimeout(() => {
        this.chart.resize()
      }, 280)
    }
  },
  methods: {
    $_chartMixin_initResizeEvent() {
      window.addEventListener('resize', this.$_chartMixin_chartResize)
    },
    $_chartMixin_destroyResizeEvent() {
      window.removeEventListener('resize', this.$_chartMixin_chartResize)
    }
  },

  mounted() {
    // this.$_chartMixin_chartWrapperDom.setOption({ /* options */ })
    this.$_chartMixin_initResizeEvent()
  },

  beforDestroy() {
    this.$_chartMixin_destroyResizeEvent()
  },

  activated() {
    this.chart.resize() // 解决移动端问题：keep-alive下，切换到其他页面，在切换回来，echart大小会变化
    this.$_chartMixin_initResizeEvent()
  },
  deactivated() {
    this.$_chartMixin_destroyResizeEvent()
  }
}
