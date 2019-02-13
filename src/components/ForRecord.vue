<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>任务管理</b></el-breadcrumb-item>
        <el-breadcrumb-item>兑换记录</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main" v-loading="loading" element-loading-text="拼命加载中">
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="margin-top:30px;">
        <el-form :inline="true" :model="filters">
          <el-form-item label="玩家ID">
            <el-input v-model.trim="filters.playerId" placeholder="请输入玩家ID"></el-input>
          </el-form-item>
          <el-form-item label="登陆IP">
            <el-input v-model.trim="filters.loginIP" placeholder="请输入登陆IP"></el-input>
          </el-form-item>
          <el-form-item label="开始时间">
            <el-date-picker
              v-model="filters.startTime"
              type="date"
              placeholder="时间选择">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间">
            <el-date-picker
              v-model="filters.endTime"
              type="date"
              placeholder="时间选择">
            </el-date-picker>
          </el-form-item>
          <el-button type="primary" @click="seek(1)">查询</el-button>
        </el-form>
      </el-col>

      <!-- 会员卡流水列表-->
      <el-table :data="items" highlight-current-row @selection-change="selsChange"
                style="width: 100%;" ref="table" :height="tableHeight">
        <el-table-column type="index" width="60"></el-table-column>
        <el-table-column prop="playerId" label="玩家ID" width="100"></el-table-column>
        <el-table-column prop="nickName" label="玩家昵称" width="120"></el-table-column>
        <el-table-column prop="loginIP" label="登陆IP" width="120"></el-table-column>
        <el-table-column prop="exchangeTime" label="兑换时间" width="160"></el-table-column>
        <el-table-column prop="exchangeType" label="兑换类型" width="120"></el-table-column>
        <el-table-column prop="exchangeAmount" label="数量" width="100"></el-table-column>
        <el-table-column prop="itemName" label="物品名称" width="auto"></el-table-column>
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
      name: "ForRecord",
      data(){
        return{
          filters:{},
          items:[],
          total:0,
          state:{},
          loading:false,
          tableHeight:0
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
        seek(page){
          if (this.filters.startTime) {
            let date = new Date(this.filters.startTime);
            this.state.startTime = date.getTime();
          }else{
            this.state.startTime = ''
          }
          if (this.filters.endTime) {
            let date = new Date(this.filters.endTime);
            this.state.endTime = date.getTime();
          }else{
            this.state.endTime = ''
          }
          if (this.filters.startTime &&
            this.filters.endTime &&
            this.state.endTime - this.state.startTime <= 0) {
            this.$message({showClose: true, message: '时间段选择有误', type: 'warning'});
            return;
          }
          axios({
            method: 'post',
            url: this.global.mPath + '/task/query_exchangerecords',
            headers: {
              'Content-type': 'application/x-www-form-urlencoded'
            },
            params: {
              'size': '50',//每页数量
              'page': page,//当前页
              'playerId':this.filters.playerId,
              'loginIP': this.filters.loginIP,
              'startTime': this.state.startTime, /*日期转换为时间戳（毫秒数）发送到后台*/
              'endTime': this.state.endTime,
              'token':sessionStorage.getItem('token')
            }
          }).then((res) => {
            // this.loading = false;//隐藏加载条
            this.items = res.data.data.items;
            this.total = res.data.data.pageCount;
            // console.log(res.data.data.items)
            for (let i = 0; i < this.items.length; i++) {
              this.items[i].exchangeTime = this.dateTimeFormat(this.items[i].exchangeTime);
            }

            setTimeout(() => {
              this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 100;
            },100)
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
        selsChange (sels) {
          this.sels = sels;
        },
        handleCurrentChange(val){
          this.seek(val)
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
            this.seek(1)
          }else{
            this.$router.replace('/');
          }
        })
      }
    }
</script>

<style scoped>

</style>
