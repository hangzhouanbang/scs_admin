<template>
  <el-row class="warp" style="margin:30px 0 0 50px;">
    <!-- 列表-->
    <el-table :data="users" highlight-current-row
              style="width: 30%;" id="out-table">
      <el-table-column prop="id" label="账号" width="120"></el-table-column>
      <el-table-column prop="transaction_id" label="当前角色" width="auto"></el-table-column>
    </el-table>

    <el-form :inline="true" :model="filters" style="margin-top:50px;">
      <el-form-item label="原密码" label-width="68px">
        <el-input v-model="filters.oldPass" @keyup.enter.native="handleSearch()" style="width:220px;" placeholder="请输入原密码" type="password"></el-input>
      </el-form-item>
      <br>
      <el-form-item label="新密码" label-width="68px">
        <el-input v-model="filters.newPass" @keyup.enter.native="handleSearch()" style="width:220px;" placeholder="请输入新密码" type="password"></el-input>
      </el-form-item>
      <br>
      <br>
      <el-form-item>
        <el-button type="primary" v-on:click="handleSearch()" style="margin-left:80px;">提交</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="">取消</el-button>
      </el-form-item>
    </el-form>
  </el-row>
</template>

<script>
    export default {
        name: "PersonalInfo",
        data(){
          return{
            filters:{}
          }
        }
    }
</script>

<style scoped>

</style>
