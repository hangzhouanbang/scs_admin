<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>数据统计</b></el-breadcrumb-item>
        <el-breadcrumb-item>沉默玩家统计</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="toolbar" style="margin-top:30px;">
      <div class="leftData">
        <div class="type" style="margin:10px 0;">当前沉默玩家</div>
        <div class="num">{{amount}}人</div>
      </div>
      <el-form :inline="true" :model="filters" style="margin-top:10px;">
        <el-form-item label="用户ID">
          <el-input v-model="filters.agentId" @keyup.enter.native="handleSearch"></el-input>
        </el-form-item>
        <el-form-item label="用户昵称">
          <el-input v-model="filters.agentId" @keyup.enter.native="handleSearch"></el-input>
        </el-form-item>
        <el-form-item label="在线状态">
          <el-select v-model="filters.upgrade" placeholder="请选择">
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
    <el-table :data="list" highlight-current-row style="width:100%;" id="out-table">
      <el-table-column type="index" width="60"></el-table-column>
      <el-table-column prop="agentId" label="用户ID" width="100"></el-table-column>
      <el-table-column prop="agentHeadimgurl" label="用户头像" width="100">
        <template slot-scope="scope">
          <img :src="scope.row.agentHeadimgurl" alt="" style="width: 50px;height: 50px;">
        </template>
      </el-table-column>
      <el-table-column prop="agentName" label="用户昵称" width="120"></el-table-column>
      <el-table-column prop="agentName" label="玉石剩余量" width="120" sortable></el-table-column>
      <el-table-column prop="agentName" label="礼券剩余量" width="120" sortable></el-table-column>
      <el-table-column prop="accountingTime" label="注册时间" width="120" sortable></el-table-column>
      <el-table-column prop="accountingTime" label="最后登录时间" width="150" sortable></el-table-column>
      <el-table-column prop="accountingTime" label="总消费" width="120" sortable></el-table-column>
      <el-table-column prop="agentType" label="会员等级" width="120" sortable></el-table-column>
      <el-table-column prop="agentType" label="会员积分" width="120" sortable></el-table-column>
      <el-table-column prop="state" label="在线状态" width="auto" sortable></el-table-column>
    </el-table>
  </el-row>
</template>

<script>
    export default {
      name: "SilentPlayerStatistics",
      data(){
        return{
          filters:{},
          options:[
            {value:'在线'},
            {value:'离线'},
          ],
          list:[],
          amount:''
        }
      },
      methods:{
        handleSearch(){

        }
      },
      mounted(){

      }
    }
</script>

<style scoped>
  .leftData{
    width:200px;
    height:80px;
    background-color: #ccc;
    text-align: center;
    font-size:20px;
    float:left;
    margin:-10px 30px 0 0;
    cursor: pointer;
  }
</style>
