<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>签到管理</b></el-breadcrumb-item>
        <el-breadcrumb-item>中奖记录</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item label="游戏ID">
          <el-input v-model="filters.nickname" @keyup.enter.native="handleSearch"></el-input>
        </el-form-item>
        <el-form-item label="游戏昵称">
          <el-input v-model="filters.nickname" @keyup.enter.native="handleSearch"></el-input>
        </el-form-item>
        <el-form-item label="手机号码">
          <el-input v-model="filters.nickname" @keyup.enter.native="handleSearch"></el-input>
        </el-form-item>
        <el-form-item label="时间">
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
        <el-form-item label="类型">
          <el-select v-model="filters.mailType" placeholder="请选择" clearable style="width:202px;">
            <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="handleSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!-- 列表-->
    <el-table :data="address" highlight-current-row style="width:100%;" id="out-table">
      <el-table-column prop="name" label="游戏ID" width="160"></el-table-column>
      <el-table-column prop="desc" label="昵称" width="120"></el-table-column>
      <el-table-column prop="taskName" label="手机号码" width="120"></el-table-column>
      <el-table-column prop="type" label="奖励备注" width="120"></el-table-column>
      <el-table-column prop="taskName" label="奖励类型" width="120"></el-table-column>
      <el-table-column prop="taskName" label="奖励数量" width="120"></el-table-column>
      <el-table-column prop="taskName" label="中奖时间" width="auto" sortable></el-table-column>
    </el-table>
  </el-row>
</template>

<script>
    export default {
      name: "Address",
      data(){
        return{
          filters:{},
          address:[],
          options:[
            {value:'红包'},
            {value:'会员'},
            {value:'玉石'},
          ],
        }
      },
      methods:{
        handleSearch(){

        }
      }
    }
</script>

<style scoped>
  .toolbar{
    margin-top:30px;
  }
</style>
