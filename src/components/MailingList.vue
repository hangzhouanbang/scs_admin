<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>邮件管理</b></el-breadcrumb-item>
        <el-breadcrumb-item>邮件列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item label="用户ID" label-width="68px">
          <el-input v-model="filters.nickname" placeholder="用户ID" @keyup.enter.native="handleSearch"></el-input>
        </el-form-item>
        <el-form-item label="类型" label-width="68px">
          <el-select v-model="filters.type" placeholder="请选择">
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

    <!-- 邮件列表-->
    <el-table :data="email" highlight-current-row style="width: 100%;">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column type="index" width="60"></el-table-column>
      <el-table-column prop="createTime" label="用户ID" width="auto" sortable></el-table-column>
      <el-table-column prop="idCard" label="邮件内容" width="auto" sortable></el-table-column>
      <el-table-column prop="roleList[0].role" label="类型" width="auto" sortable></el-table-column>
      <el-table-column prop="createTime" label="金币" width="auto" sortable></el-table-column>
      <el-table-column prop="createTime" label="积分" width="auto" sortable></el-table-column>
      <el-table-column prop="createTime" label="会员卡" width="auto" sortable></el-table-column>
      <el-table-column prop="nickname" label="有效时间" width="auto" sortable></el-table-column>
      <el-table-column prop="user" label="发送时间" width="auto" sortable></el-table-column>
      <el-table-column prop="createTime" label="是否领取" width="auto" sortable></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="danger" @click="delBook(scope.$index,scope.row)" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-row>
</template>

<script>
    export default {
        name: "MailingList",
        data(){
          return{
            filters:{},
            email:[],
            options:[
              {value:'活动奖励'},
              {value:'系统通知'},
              {value:'活动通知'}
            ]
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
