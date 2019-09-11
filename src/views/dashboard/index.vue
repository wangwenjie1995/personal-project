<template>
  <div class="dashboard-container">
    <div style="position: absolute; top: 0; right: 0; bottom: 0; left: 0;-webkit-overflow-scrolling: touch;overflow-y: scroll;">
      <iframe src="https://wangwenjie1995.github.io/wangwenjie.github.io/wangwenjie.pdf" width="100%" height="100%" scrolling="yes" type="application/pdf">
        您的浏览器不支持PDF阅读
        <a href="https://wangwenjie1995.github.io/wangwenjie.github.io/wangwenjie.pdf">Download PDF</a>
      </iframe>
    </div>
    <!-- <iframe src="https://wangwenjie1995.github.io/wangwenjie.github.io/wangwenjie.pdf" style="width: 100%;height:60px;" scrolling="no" type="application/pdf">
      您的浏览器不支持PDF阅读
      <a href="https://wangwenjie1995.github.io/wangwenjie.github.io/wangwenjie.pdf">Download PDF</a>
    </iframe> -->
    <!-- <iframe src="https://wangwenjie1995.github.io/wangwenjie.github.io/wangwenjie.pdf" style="width: 100%;height:100%;" scrolling="no" type="application/pdf">
      您的浏览器不支持PDF阅读
      <a href="https://docs.google.com/document/d/1vzGVIal25Rhc0ip5ywQfqznwPU-uaRtAwZr7PqCoHEA/edit?usp=sharing">Download PDF</a>
    </iframe> -->
    <!-- why bottom: 3px; 使用embed打开pdf,设置height:100%; 高度多了3px bug -->
    <!-- 移动端不支持embed显示pdf -->
    <!-- <div style="position: absolute; top: 60px; right: 0; bottom: 3px; left: 0;-webkit-overflow-scrolling: touch;overflow-y: scroll;">
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
