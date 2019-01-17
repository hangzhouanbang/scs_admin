<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>推广员中心</b></el-breadcrumb-item>
        <el-breadcrumb-item>推广收益查询</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="toolbar" style="margin-top:30px;">
      <el-form :inline="true" :model="filters">
        <el-form-item label="玩家ID">
          <el-input v-model.trim="filters.memberId" @keyup.enter.native="handleSearch()"></el-input>
        </el-form-item>
        <el-form-item label="推广员ID">
          <el-input v-model.trim="filters.agentId" @keyup.enter.native="handleSearch()"></el-input>
        </el-form-item>
        <el-form-item label="上级推广员ID">
          <el-input v-model.trim="filters.bossId" @keyup.enter.native="handleSearch()"></el-input>
        </el-form-item>
        <el-form-item label="时间" label-width="68px">
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
          <el-button type="primary" v-on:click="handleSearch()">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <el-table :data="list" highlight-current-row @selection-change="selsChange"
              style="width: 100%;">
      <el-table-column type="index" width="60"></el-table-column>
      <el-table-column prop="memberId" label="玩家ID" width="100"></el-table-column>
      <el-table-column prop="memberName" label="玩家昵称" width="100" sortable></el-table-column>
      <el-table-column prop="memberHeadimgurl" label="头像" width="100">
        <template slot-scope="scope">
          <img :src="scope.row.memberHeadimgurl" alt="" style="width: 50px;height: 50px;">
        </template>
      </el-table-column>
      <el-table-column prop="pruduct" label="购买物品" width="100"></el-table-column>
      <el-table-column prop="totalamount" label="支付金额" width="100"></el-table-column>
      <el-table-column prop="agentId" label="推广员ID" width="120"></el-table-column>
      <el-table-column prop="accountingAmount" label="推广员收益" width="120"></el-table-column>
      <el-table-column prop="bossId" label="上级ID" width="100"></el-table-column>
      <el-table-column prop="seniorReward" label="上级收益" width="100"></el-table-column>
      <el-table-column prop="accountingTime" label="收益时间" width="auto"></el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="1" :total="total"
                     style="float:right;">
      </el-pagination>
    </el-col>
  </el-row>
</template>

<script>
  import axios from 'axios'
    export default {
      name: "PromotionOfEarnings",
      data(){
        return{
          filters:{},
          list:[],
          total:0,
          state:{},
          page:0
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
        handleCurrentChange(val){
          this.page = val
          this.handleSearch(this.page)
        },
        handleSearch(){
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
            url: this.global.mPath + '/agent/queryagentreward',
            headers: {
              'Content-type': 'application/x-www-form-urlencoded'
            },
            params: {
              'bossId': this.filters.bossId,
              'agentId':this.filters.agentId,
              'memberId':this.filters.memberId,
              'startTime':this.state.startTime,
              'endTime':this.state.endTime,
              'token':sessionStorage.getItem('token'),
              'page':this.page,
              'size':10
            }
          })
            .then((res) => {
                this.loading = false;//隐藏加载条
                // console.log(res.data.data)
                this.list = res.data.data.listPage.items
                this.total = res.data.data.listPage.pageCount
                for(let i = 0;i < this.list.length;i++){
                  this.list[i].accountingTime = this.dateTimeFormat(this.list[i].accountingTime)
                }
              },
            ).catch((e) => {
            if (e && e.response) {
              switch (e.response.status) {
                case 504:
                  this.$message({showClose: true, message: '服务器异常', type: 'warning'});
                  this.loading = false;//隐藏加载条
                  break
                case 500:
                  this.$message({showClose: true, message: '服务器异常', type: 'warning'});
                  this.loading = false;//隐藏加载条
                  break
                case 405:
                  this.$message({showClose: true, message: '请先登录', type: 'warning'});
                  break
              }
            }
          });
        },
        selsChange: function (sels) {
          this.sels = sels;
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
          if(res.data.success == false){
            this.$router.replace('/');
          }else{
            this.handleSearch()
          }
        })
      }
    }
</script>

<style scoped>

</style>
