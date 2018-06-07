<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>管理员管理</b></el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
   </el-row>
</template>

<script>
    export default {
        name: "MemberRules"
    }
</script>

<style scoped>

</style>
