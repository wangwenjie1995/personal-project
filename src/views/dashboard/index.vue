<template>
  <div class="dashboard-container">
    <iframe src="/pdf/web/viewer.html?file=wangwenjie.pdf" style="width: 100%;height:100%;" scrolling="no">
      您的浏览器不支持PDF阅读
    </iframe>
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
