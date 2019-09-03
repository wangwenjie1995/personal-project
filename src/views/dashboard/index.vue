<template>
  <div class="dashboard-container">
    <!-- <iframe src="https://github.com" style="width: 100%;height:100%;" scrolling="no">
      您的浏览器不支持PDF阅读
    </iframe> -->
    <embed src="https://wangwenjie1995.github.io/wangwenjie.github.io/wangwenjie.pdf" width="100%" height="100%">
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    height: 100%;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
