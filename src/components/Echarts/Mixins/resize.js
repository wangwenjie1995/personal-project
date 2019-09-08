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

  activeted() {
    this.$_chartMixin_initResizeEvent()
  },
  deactivated() {
    this.$_chartMixin_destroyResizeEvent()
  }
}
