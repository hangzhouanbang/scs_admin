<!--推广员操作记录-->
<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>推广员管理</b></el-breadcrumb-item>
        <el-breadcrumb-item>消费使用记录</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main" v-loading="loading" element-loading-text="拼命加载中">
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="filters">
          <el-form-item label="推广员ID" label-width="70px">
            <el-input v-model.trim="filters.id" @keyup.enter.native="handleSearch" placeholder="请输入推广员ID"></el-input>
          </el-form-item>
          <el-form-item label="推广员昵称" label-width="90px">
            <el-input v-model.trim="filters.nickname" @keyup.enter.native="handleSearch" placeholder="请输入推广员昵称"></el-input>
          </el-form-item>
          <el-form-item label="类型" label-width="50px">
            <el-select v-model="filters.mailType" placeholder="请选择类型" clearable style="width:202px;" @change="search()">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="注册时间" label-width="68px">
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
          <el-button type="primary" @click="chaxun()">查询</el-button>
        </el-form>
      </el-col>

      <!-- 推广员操作记录列表-->
      <el-table :data="items" highlight-current-row @selection-change="selsChange"
                style="width: 100%;" @sort-change="sort">
        <el-table-column type="index" width="60"></el-table-column>
        <el-table-column prop="agentId" label="推广员ID" width="auto"></el-table-column>
        <el-table-column prop="agent" label="推广员昵称" width="auto"></el-table-column>
        <el-table-column prop="product" label="商品名称" width="auto"></el-table-column>
        <el-table-column prop="accountingAmount" label="数量" width="auto"></el-table-column>
        <el-table-column prop="summary.text" label="类型" width="auto"></el-table-column>
        <el-table-column prop="accountingTime" label="使用时间" width="auto" sortable></el-table-column>
        <el-table-column prop="receiverId" label="使用对象" width="auto"></el-table-column>
        <el-table-column prop="balanceAfterRi" label="剩余日卡" width="auto" sortable></el-table-column>
        <el-table-column prop="balanceAfterZhou" label="剩余周卡" width="auto" sortable></el-table-column>
        <el-table-column prop="balanceAfterYue" label="剩余月卡" width="auto" sortable></el-table-column>
        <el-table-column prop="balanceAfterJi" label="剩余季卡" width="auto" sortable></el-table-column>
      </el-table>
      <!--工具条-->
      <el-col :span="24" class="toolbar">
        <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="1" :total="total"
                       style="float:right;" :current-page.sync = "page">
        </el-pagination>
      </el-col>
    </el-col>
  </el-row>
</template>

<script>
  import axios from 'axios'
  export default {
    name: "PromoterOperationRecord",
    data() {
      return {
        loading: false,//隐藏加载条
        filters: {
          name: ''
        },
        items: [],
        roles: [],
        total: 0,
        options: [
          {value: '充值'},
          {value: '购买'},
          {value: '转增下级'},
          {value: '上级转增'},
          {value: '积分兑换'},
        ],
        publishVisible: false,
        publishForm: {},
        addForm: {},
        centerDialogVisible: false,
        relieveDialogVisible: false,
        tabPosition: 'left',
        state:[],
        sorting:{},
        page:1,
        filters1:{}
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
      search(){
        this.page = 1;
        this.handleSearch()
      },
      chaxun(){
        this.search()
      },
      //查询会员卡购买记录
      handleSearch(accountingTimeSort,balanceAfterZhouSort,balanceAfterYueSort,balanceAfterJiSort) {
        if(this.filters.startTime){
          let date = new Date(this.filters.startTime);
          this.state.startTime = date.getTime();
        }else{
          this.state.startTime = ''
        }
        if(this.filters.endTime){
          let date = new Date(this.filters.endTime);
          this.state.endTime = date.getTime();
        }else{
          this.state.endTime = ''
        }
        if(this.filters.startTime &&
          this.filters.endTime &&
          this.state.endTime - this.state.startTime < 0){
          return;
        }
        if(this.filters.mailType === '充值'){
          this.filters1.mailType = 'recharge'
        }
        if(this.filters.mailType === '购买'){
          this.filters1.mailType = 'buy'
        }
        if(this.filters.mailType === '上级转增'){
          this.filters1.mailType = 'boss'
        }
        if(this.filters.mailType === '转增下级'){
          this.filters1.mailType = 'junior'
        }
        if(this.filters.mailType === '积分兑换'){
          this.filters1.mailType = 'score'
        }
        axios({
          method: 'post',
          url: this.global.mPath + '/agent/queryclubcardrecord',
          headers: {
            'Content-type': 'application/x-www-form-urlencoded'
          },
          params: {
            'size': '15',//每页数量
            'page': this.page,//当前页
            'agentId':this.filters.id,
            'agent':this.filters.nickname,
            'type':this.filters1.mailType,
            'startTime': this.state.startTime, /*日期转换为时间戳（毫秒数）发送到后台*/
            'endTime':this.state.endTime,
            'token':sessionStorage.getItem('token'),
            'accountingTimeSort':accountingTimeSort,
            'balanceAfterZhouSort':balanceAfterZhouSort,
            'balanceAfterYueSort':balanceAfterYueSort,
            'balanceAfterJiSort':balanceAfterJiSort
          }
        }).then((res) => {
          this.loading = false;//隐藏加载条
          this.items = res.data.data.items;
          this.total = res.data.data.pageCount;
          for (let i = 0; i < this.items.length; i++) {
            this.items[i].accountingTime = this.dateTimeFormat(this.items[i].accountingTime);
          }
        }).catch((e) => {
          if (e && e.response) {
            switch (e.response.status) {
              case 504:
                this.$message({showClose: true, message: '服务器异常', type: 'warning'});
                this.loading = false;//隐藏加载条
                break;
              case 500:
                this.$message({showClose: true, message: '服务器异常', type: 'warning'});
                this.loading = false;//隐藏加载条
                break;
              case 405:
                this.$message({showClose: true, message: '请先登录', type: 'warning'});
                break
            }
          }
        })
      },
      sort(a){
        // console.log(this.page)
        this.sorting = a;
        if(this.sorting.prop === 'accountingTime'){
          if(this.sorting.order === 'ascending'){
            this.sorting.accountingTime = 'ASC'
          }
          if(this.sorting.order === 'descending'){
            this.sorting.accountingTime = 'DESC'
          }
        }
        if(this.sorting.prop === 'balanceAfterZhou'){
          if(this.sorting.order === 'ascending'){
            this.sorting.balanceAfterZhou = 'ASC'
          }
          if(this.sorting.order === 'descending'){
            this.sorting.balanceAfterZhou = 'DESC'
          }
        }
        if(this.sorting.prop === 'balanceAfterYue'){
          if(this.sorting.order === 'ascending'){
            this.sorting.balanceAfterYue = 'ASC'
          }
          if(this.sorting.order === 'descending'){
            this.sorting.balanceAfterYue = 'DESC'
          }
        }
        if(this.sorting.prop === 'balanceAfterJi'){
          if(this.sorting.order === 'ascending'){
            this.sorting.balanceAfterJi = 'ASC'
          }
          if(this.sorting.order === 'descending'){
            this.sorting.balanceAfterJi = 'DESC'
          }
        }
        this.handleSearch(this.sorting.accountingTime,this.sorting.balanceAfterZhou,this.sorting.balanceAfterYue,this.sorting.balanceAfterJi)
      },
      handleCurrentChange(val){
        this.page = val;
        this.sort(this.sorting);
      },
      selsChange: function (sels) {
        this.sels = sels;
      }
    },
    mounted(){
      axios({
        url:this.global.mPath + '/login/admin_info',
        method:'post',
        params:{
          token:sessionStorage.getItem('token')
        }
      }).then((res) => {
        // console.log(res.data.success)
        if(res.data.success){
          this.handleSearch()
        }else{
          this.$router.replace('/');
        }
      })
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
