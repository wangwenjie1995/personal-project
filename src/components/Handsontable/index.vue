<template>
  <div id="example" />
</template>
<script>
import basicSettings from './basicSettings'
import '../../../node_modules/handsontable/dist/handsontable.css'
import 'handsontable/languages/zh-CN' // 中文包
import Handsontable from 'handsontable'
export default {
  name: 'Handsontable',
  components: {},
  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    },
    id: {
      type: String,
      required: false,
      default() {
        return 'handsontable-' + new Date()
      }
    },
    settings: {
      type: Object,
      default() {
        return basicSettings
      }
    }
  },
  data() {
    return {
      root: 'handsontable-root',
      hotTable: null
    }
  },
  computed: {
    mergeSetting() {
      const settings = Object.assign({}, basicSettings, this.settings)
      return settings
    }
  },
  created() {},
  mounted() {
    this.initHandsontable()
  },
  destroyed() {
    this.destroyHandsontable()
  },
  methods: {
    initHandsontable() {
      const container = document.getElementById('example')
      this.hotTable = new Handsontable(container, {
        data: this.data,
        ...this.mergeSetting
      })
    },
    destroyHandsontable() {
      this.hotTable.destroy()
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
