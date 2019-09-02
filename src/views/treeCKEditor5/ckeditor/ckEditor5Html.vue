<template>
  <div style="max-height: 50px; overflow: hidden;cursor: pointer;">
    <div @mouseup="switchType" v-html="data" />
  </div>
</template>
<script>
export default {
  name: 'Chtml',
  props: {
    data: {
      type: String,
      default: ''
    }
  },
  data() {
    return {}
  },
  methods: {
    switchType() {
      this.$emit('switch', 'ckEditor')
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
