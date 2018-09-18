<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>签到管理</b></el-breadcrumb-item>
        <el-breadcrumb-item>兑换记录</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <div class="stay_out">待发放（0）</div>
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
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="至" label-width="68px" style="margin-left:-44px;">
          <el-date-picker
            v-model="filters.endTime"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="handleSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!-- 中奖记录列表-->
    <el-table :data="record" highlight-current-row style="width:100%;" id="out-table">
      <el-table-column prop="name" label="游戏ID" width="160" sortable></el-table-column>
      <el-table-column prop="desc" label="昵称" width="120" sortable></el-table-column>
      <el-table-column prop="type" label="兑换物品" width="120" sortable></el-table-column>
      <el-table-column prop="taskName" label="兑换数量" width="120" sortable></el-table-column>
      <el-table-column prop="taskName" label="联系电话" width="120" sortable></el-table-column>
      <el-table-column prop="taskName" label="收件地址" width="160" sortable></el-table-column>
      <el-table-column prop="taskName" label="兑奖时间" width="120" sortable></el-table-column>
      <el-table-column prop="taskName" label="发放时间" width="120" sortable></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="small" @click="adjustmentDialog(scope.$index,scope.row)">发放</el-button>
          <el-button size="small" type='text'>已发放</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-row>
</template>

<script>
    import axios from 'axios'
    export default {
        name: "Record",
        data(){
          return{
            options:[
              {value:'红包'},
              {value:'会员'},
              {value:'玉石'},
            ],
            filters:{},
            record:[],
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
    float:left;
  }
  .stay_out{
    width:200px;
    height:80px;
    background-color: #ccc;
    text-align: center;
    line-height:80px;
    font-size:30px;
    float:left;
    margin:11px 30px 0 0;
    cursor: pointer;
  }

</style>
