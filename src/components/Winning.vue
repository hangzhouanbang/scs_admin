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
          <el-input v-model.trim="filters.memberId" @keyup.enter.native="handleSearch(1)" placeholder="请输入游戏ID"></el-input>
        </el-form-item>
        <el-form-item label="游戏昵称">
          <el-input v-model.trim="filters.nickname" @keyup.enter.native="handleSearch(1)" placeholder="请输入游戏昵称"></el-input>
        </el-form-item>
        <el-form-item label="手机号码">
          <el-input v-model.trim="filters.nickname" @keyup.enter.native="handleSearch(1)" placeholder="请输入手机号码"></el-input>
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
          <el-select v-model="filters.type" placeholder="请选择类型" clearable style="width:202px;">
            <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="handleSearch(1)">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!-- 列表-->
    <el-table :data="list" highlight-current-row style="width:100%;" id="out-table" ref="table" :height="tableHeight">
      <el-table-column type="index" width="60"></el-table-column>
      <el-table-column prop="memberId" label="游戏ID" width="160"></el-table-column>
      <el-table-column prop="nickname" label="昵称" width="120"></el-table-column>
      <el-table-column prop="" label="手机号码" width="120"></el-table-column>
      <el-table-column prop="name" label="奖励备注" width="120"></el-table-column>
      <el-table-column prop="type" label="奖励类型" width="120"></el-table-column>
      <el-table-column prop="singleNum" label="奖励数量" width="120"></el-table-column>
      <el-table-column prop="createTime" label="中奖时间" width="auto" sortable></el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24">
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="1" :total="total"
                     style="float:right;">
      </el-pagination>
    </el-col>
  </el-row>
</template>

<script>
  import axios from 'axios'
  import Clipboard from 'clipboard'
    export default {
      name: "Address",
      data(){
        return{
          filters:{},
          list:[],
          options:[
            {value:'红包'},
            {value:'日卡'},
            {value:'周卡'},
            {value:'月卡'},
            {value:'季卡'},
            {value:'玉石'},
            {value:'实物'},
            {value:'话费'},
          ],
          state:{},
          total:0,
          tableHeight: 50
        }
      },
      methods:{
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
        handleSearch(page){
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
          axios({
            url:this.global.mPath + '/signin/querysigninprizelog',
            method:'post',
            params:{
              page:page,
              size:50,
              token:sessionStorage.getItem('token'),
              memberId:this.filters.memberId,
              nickname:this.filters.nickname,
              type:this.filters.type,
              startTime:this.state.startTime,
              endTime:this.state.endTime,
            }
          }).then((res) => {
              // console.log(res.data)
              // this.amount = res.data.data.amount
              this.list = res.data.data.list;
              this.total = res.data.data.count / 50;
              for(let i = 0;i < this.list.length;i++){
                this.list[i].createTime = this.dateTimeFormat(this.list[i].createTime)
              }
              // if(res.data.data.count > 15){
                setTimeout(() => {
                  this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 100;
                },100)
              // }
            }
          ).catch((e) => {
            this.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
          })
        },
        handleCurrentChange(val){
          this.page = val;
          this.handleSearch(this.page);
        },
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
            this.handleSearch(1)
          }else{
            this.$router.replace('/');
          }
        })

      }
    }
</script>

<style scoped>
  .toolbar{
    margin-top:30px;
  }
</style>
