<!--推广员操作记录-->
<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>推广员管理</b></el-breadcrumb-item>
        <el-breadcrumb-item>推广码使用记录</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main" v-loading="loading" element-loading-text="拼命加载中">
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="filters">
          <el-form-item label="推广员ID" label-width="70px">
            <el-input v-model="filters.id" @keyup.enter.native="handleSearch"></el-input>
          </el-form-item>
          <el-form-item label="推广员昵称" label-width="90px">
            <el-input v-model="filters.nickname" @keyup.enter.native="handleSearch"></el-input>
          </el-form-item>
          <el-form-item label="注册时间" label-width="68px">
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
          <el-button type="primary" @click="handleSearch()">查询</el-button>
        </el-form>
      </el-col>

      <!-- 推广员操作记录列表-->
      <el-table :data="items" highlight-current-row @selection-change="selsChange"
                style="width: 100%;" @sort-change="sort">
        <el-table-column type="index" width="60"></el-table-column>
        <el-table-column prop="agentId" label="推广员ID" width="120"></el-table-column>
        <el-table-column prop="agent" label="推广员昵称" width="120"></el-table-column>
        <el-table-column prop="invitationCode" label="推广码" width="120"></el-table-column>
        <el-table-column prop="memberId" label="邀请玩家ID" width="100"></el-table-column>
        <el-table-column prop="nickname" label="邀请玩家昵称" width="150"></el-table-column>
        <el-table-column prop="createTime" label="绑定时间" width="160" sortable></el-table-column>
        <el-table-column prop="rewardScore" label="获得积分" width="100"></el-table-column>
        <el-table-column prop="inviteNum" label="邀请总人数" width="150" sortable></el-table-column>
        <el-table-column prop="score" label="当前积分" sortable></el-table-column>
      </el-table>
      <!--工具条-->
      <el-col :span="24" class="toolbar">
        <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="1" :total="total"
                       style="float:right;">
        </el-pagination>
      </el-col>
    </el-col>

  </el-row>
</template>

<script>
  import axios from 'axios'

  export default {
    name: "CodeUsageRecord",
    data() {
      return {
        loading: false,//隐藏加载条
        filters: {},
        items: [],
        total: 0,
        state:{},
        sorting:{},
        page:1
      }
    },
    methods: {
      dateTimeFormat(value) {
        let time = new Date(+value);
        let rightTwo = (v) => {
          v = '0' + v;
          return v.substring(v.length - 2, v.length)
        };
        if (time == null) return;
        let year = time.getFullYear();
        let month = time.getMonth() + 1;
        let date = time.getDate();
        let hours = time.getHours();
        let minutes = time.getMinutes();
        let seconds = time.getSeconds();
        return year + '-' + rightTwo(month) + '-' + rightTwo(date) + ' ' + rightTwo(hours) + ':' + rightTwo(minutes) + ':' + rightTwo(seconds);
      },
      trim(str) {
        if(str != null){
          return str.replace(/(^\s+)|(\s+$)/g, "");
        }
      },
      handleCurrentChange(val) {
        this.page = val;
        this.sort(this.sorting);
      },
      //查询会员卡购买记录
      handleSearch(createTimeSort,inviteNumSort,scoreSort) {
        if(this.filters.startTime){
          let date = new Date(this.filters.startTime);
          this.state.startTime = date.getTime();
        }
        if(this.filters.endTime){
          let date = new Date(this.filters.endTime);
          this.state.endTime = date.getTime();
        }
        if(this.filters.startTime &&
          this.filters.endTime &&
          this.state.endTime - this.state.startTime < 0){
          return;
        }
        axios({
          method: 'post',
          url: this.global.mPath + '/agent/queryagentinvitationrecord',
          headers: {
            'Content-type': 'application/x-www-form-urlencoded'
          },
          params: {
            'size': '15',//每页数量
            'page': this.page,//当前页
            'agentId':this.trim(this.filters.id),
            'agent':this.trim(this.filters.nickname),
            'startTime': this.state.startTime , /*日期转换为时间戳（毫秒数）发送到后台*/
            'endTime': this.state.endTime,
            'token':sessionStorage.getItem('token'),
            'createTimeSort':createTimeSort,
            'inviteNumSort':inviteNumSort,
            'scoreSort':scoreSort
          }
        })
          .then((res) => {
              this.loading = false;//隐藏加载条
              this.items = res.data.data.items;
              this.total = res.data.data.pageCount;
              for (let i = 0; i < this.items.length; i++) {
                this.items[i].createTime = this.dateTimeFormat(this.items[i].createTime);
              }
            },
          ).catch((e) => {
          if (e && e.response) {
            switch (e.response.status) {
              case 504:
                this.$message({
                  showClose: true,
                  message: '服务器异常',
                  type: 'warning'
                });
                this.loading = false;//隐藏加载条
                break
              case 500:
                this.$message({
                  showClose: true,
                  message: '服务器异常',
                  type: 'warning'
                });
                this.loading = false;//隐藏加载条
                break
              case 405:
                this.$message({
                  showClose: true,
                  message: '请先登录',
                  type: 'warning'
                });
                break
            }
          }
        });
      },
      sort(a){
        this.sorting = a;
        if(this.sorting.prop == 'createTime'){
          if(this.sorting.order == 'ascending'){
            this.sorting.createTime = 'ASC'
          }
          if(this.sorting.order == 'descending'){
            this.sorting.createTime = 'DESC'
          }
        }
        if(this.sorting.prop == 'inviteNum'){
          if(this.sorting.order == 'ascending'){
            this.sorting.inviteNum = 'ASC'
          }
          if(this.sorting.order == 'descending'){
            this.sorting.inviteNum = 'DESC'
          }
        }
        if(this.sorting.prop == 'score'){
          if(this.sorting.order == 'ascending'){
            this.sorting.score = 'ASC'
          }
          if(this.sorting.order == 'descending'){
            this.sorting.score = 'DESC'
          }
        }
        this.handleSearch(this.sorting.createTime,this.sorting.inviteNum,this.sorting.score)
      },
      selsChange: function (sels) {
        this.sels = sels;
      }
    },
    mounted(){
      this.handleSearch();
    }
  }
</script>

<style scoped>
  .toolbar {
    margin-top: 30px;
  }
  .img {
    float: left;
    margin-right: 40px;
  }
</style>

