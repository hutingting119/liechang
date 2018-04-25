<template>
<div>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>职位发布历史</span>
    </div>
    <el-alert
      title="暂无内容，敬请期待"
      type="info"
      center
      show-icon>
    </el-alert>
  </el-card>
</div>
</template>

<script>
    export default {
        name: "poshistory"
    }
</script>

<style scoped>
  .box-card {
    width: 83%;
    margin-left: 16%;
    min-height:768px;
    border: 0;
    margin-top: 70px;
  }
</style>
