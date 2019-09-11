<template>
  <div class="dashboard-container">
    <iframe src="https://wangwenjie1995.github.io/wangwenjie.github.io/wangwenjie.pdf">
      您的浏览器不支持PDF阅读
    </iframe>
    <!-- <iframe src="https://wangwenjie1995.github.io/wangwenjie.github.io/wangwenjie.pdf" style="width: 100%;height:60px;" scrolling="no" type="application/pdf">
      您的浏览器不支持PDF阅读
      <a href="https://wangwenjie1995.github.io/wangwenjie.github.io/wangwenjie.pdf">Download PDF</a>
    </iframe> -->

    <!-- <object data="https://wangwenjie1995.github.io/wangwenjie.github.io/wangwenjie.pdf" type="application/pdf" width="100%" height="20%">
      This browser does not support PDFs. Please download the PDF to view it: <a href="https://wangwenjie1995.github.io/wangwenjie.github.io/wangwenjie.pdf">Download PDF</a>
    </object> -->
    <!-- why bottom: 3px; 使用embed打开pdf,设置height:100%; 高度多了3px bug -->
    <!-- 移动端不支持embed显示pdf -->
    <!-- <div style="position: absolute; top: 60px; right: 0; bottom: 3px; left: 0;">
      <embed src="https://wangwenjie1995.github.io/wangwenjie.github.io/wangwenjie.pdf" name="plugin" width="100%" height="100%" type="application/pdf">
    </div> -->
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
