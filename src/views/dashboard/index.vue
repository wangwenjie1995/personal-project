<template>
  <div class="dashboard-container">
    <!-- <iframe src="https://wangwenjie1995.github.io/wangwenjie.github.io/wangwenjie.pdf" style="width: 100%;height:100%;" scrolling="no">
      您的浏览器不支持PDF阅读
    </iframe> -->
    <!-- why bottom: 3px; 使用embed打开pdf,设置height:100%; 高度多了3px bug -->
    <div style="position: absolute; top: 0; right: 0; bottom: 3px; left: 0;">
      <embed src="https://wangwenjie1995.github.io/wangwenjie.github.io/wangwenjie.pdf" width="100%" height="100%">
    </div>
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
    position: relative;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
