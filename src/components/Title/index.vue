<template>
  <div class="title">
    <el-breadcrumb separator-class="el-icon-arrow-right" style="padding-top: 10px;font-weight: normal;">
      <el-breadcrumb-item>{{ titles.projName }}</el-breadcrumb-item>
      <el-breadcrumb-item>{{ titles.quotationName }}</el-breadcrumb-item>
      <el-breadcrumb-item>{{ titles.version }}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>
<script>
export default {
  name: 'ProjectDetail',
  props: {
    titles: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {}
  }
}
</script>
<style scoped>
.title {
  float: left;
  font-size: 30px;
  font-weight: 600;
  margin-top: 10px;
  margin-left: 10px;
}
</style>
