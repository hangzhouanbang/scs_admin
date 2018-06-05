<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum" :loading="loading">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>游戏大厅</b></el-breadcrumb-item>
        <el-breadcrumb-item>设置金币</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
  </el-row>
</template>

<script>
  export default {
    name: "User",
  }
</script>

<style scoped>

</style>
