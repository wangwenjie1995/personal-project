<template>
  <section class="app-main">
    <transition name="fade-transform hasTagsView" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="key" />
      </keep-alive>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.path
    }
  }
}
</script>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  height: 100%;
  min-height: calc(100vh - 0px);
  width: 100%;
  position: relative;
  // overflow: hidden;
  padding-top: 84px;
}
// .fixed-header+.app-main {
  // padding-top: 0;
// }
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
