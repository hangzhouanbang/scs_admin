<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>游戏大厅</b></el-breadcrumb-item>
        <el-breadcrumb-item>发布公告</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
  </el-row>
</template>

<script>
  export default {
    name: "Set",
  }
</script>

<style scoped>

</style>
