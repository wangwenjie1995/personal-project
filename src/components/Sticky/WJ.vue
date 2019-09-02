<template>
  <div :style="{ height: height + 'px',zIndex: zIndex}">
    <div
      :class="className"
      :style="{top: (isSticky ? stickyTop + 'px' : ''), zIndex: zIndex,position: position,width: width,height: height + 'px'}"
    >
      <slot>
        <div>Sticky</div>
      </slot>
    </div>
  </div>
</template>
<script>
export default {
  name: 'WJSticky',
  props: {
    stickyTop: {
      type: Number,
      default: 0
    },
    zIndex: {
      type: Number,
      default: 1
    },
    className: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      active: false,
      position: '',
      width: undefined,
      height: undefined,
      isSticky: false // ??? 为什么不统一acitve和isSticky
    }
  },
  mounted() {
    this.height = this.$el.getBoundingClientRect.height
    window.addEventListener('scroll', this.handleScroll)
    window.addEventListener('resize', this.handleResize)
  },
  activated() {
    this.handleScroll()
  },
  methods: {
    sticky() {
      if (this.active) {
        return
      }
      this.position = 'fixed'
      this.active = true
      this.width = this.width + 'px'
      this.isSticky = true
    },
    handleReset() {
      if (!this.active) { // active表示是否在fixed状态
        return
      }
      this.reset()
    },
    reset() {
      this.position = ''
      this.width = 'auto'
      this.active = false
      this.isSticky = false
    },
    handleScroll() {
      const width = this.$el.getBoundingClientRect().width
      this.width = width || 'auto'
      const offsetTop = this.$el.getBoundingClientRect().top
      if (offsetTop < this.stickyTop) { // 固定高度大于dom位置高度（表示要fixed了）
        this.sticky()
        return
      }
      this.handleReset()
    },
    handleResize() {
      if (this.isSticky) {
        this.width = this.$el.getBoundingClientRect().width + 'px'
      }
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
