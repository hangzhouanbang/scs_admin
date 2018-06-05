<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>游戏大厅</b></el-breadcrumb-item>
        <el-breadcrumb-item>查询公告</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
  </el-row>
</template>

<script>
    export default {
        name: "SelectNotice"
    }
</script>

<style scoped>

</style>
