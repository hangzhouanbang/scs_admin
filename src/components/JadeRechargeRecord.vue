<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>茶馆管理</b></el-breadcrumb-item>
        <el-breadcrumb-item>玉石充值记录</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item label="推广员ID">
          <el-input v-model.trim="filters.id" @keyup.enter.native="handleSearch(1)"></el-input>
        </el-form-item>
        <el-form-item label="推广员昵称">
          <el-input v-model.trim="filters.nickname" @keyup.enter.native="handleSearch(1)"></el-input>
        </el-form-item>
        <el-form-item label="购买时间" label-width="68px">
          <el-date-picker
            v-model="filters.startTime"
            type="date"
            placeholder="选择日期" style="width:202px;">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="至" label-width="68px" style="margin-left:-44px;">
          <el-date-picker
            v-model="filters.endTime"
            type="date"
            placeholder="选择日期" style="width:202px;">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="handleSearch(1)">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table :data="list" highlight-current-row style="width: 100%;" @sort-change="sort">
      <el-table-column type="index" width="60"></el-table-column>
      <el-table-column prop="id" label="推广员ID" width="120"></el-table-column>
      <el-table-column prop="nickname" label="推广员昵称" width="150"></el-table-column>
      <el-table-column prop="createTime" label="商品名称" width="160"  sortable="custom"></el-table-column>
      <el-table-column prop="inviteMemberNum" label="数量" width="120"  sortable="custom"></el-table-column>
      <el-table-column prop="juniorNum" label="使用时间" width="120"  sortable="custom"></el-table-column>
      <el-table-column prop="juniorNum" label="使用对象" width="120"  sortable="custom"></el-table-column>
      <el-table-column prop="juniorNum" label="剩余茶馆玉石" width="auto"  sortable="custom"></el-table-column>
    </el-table>
  </el-row>
</template>

<script>
    import axios from 'axios'
    export default {
      name: "JadeRechargeRecord",
      data(){
          return{
            list:[],
            filters:{}
          }
      }
    }
</script>

<style scoped lang="scss">
  .toolbar{
    margin-top:30px;
  }
</style>
