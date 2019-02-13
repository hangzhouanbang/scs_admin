<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>财务系统</b></el-breadcrumb-item>
        <el-breadcrumb-item>代理收益查询</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-row :gutter="20" style="margin-top:30px;" class="order">
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <div class="left-hand">
            <img src="../assets/images/rebate.png" alt="">
          </div>
          <div class="right">
            <div class="type">返利总金额</div>
            <div class="num">{{totalReward}}</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <div class="left-hand">
            <img src="../assets/images/rebate_order.png" alt="">
          </div>
          <div class="right">
            <div class="type">返利订单数</div>
            <div class="num">{{totalOrder}}</div>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-col :span="24" class="toolbar" style="padding-bottom:0;margin-top:30px;">
      <el-form :inline="true" :model="filters">
        <el-form-item label="推广员ID" label-width="80px">
          <el-input v-model.trim="filters.agentId" @keyup.enter.native="handleSearch()" style="width:220px;" placeholder="请输入推广员ID"></el-input>
        </el-form-item>
        <el-form-item label="玩家ID" label-width="68px">
          <el-input v-model.trim="filters.memberId" @keyup.enter.native="handleSearch()" style="width:220px;" placeholder="请输入玩家ID"></el-input>
        </el-form-item>
        <el-form-item label="返利类型" label-width="68px">
          <el-select v-model="filters.rewardType" placeholder="请选择返利类型" @change="search()" clearable>
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间" label-width="68px">
          <el-date-picker
            v-model="filters.startTime"
            type="date"
            placeholder="选择日期" clearable>
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" label-width="68px">
          <el-date-picker
            v-model="filters.endTime"
            type="date"
            placeholder="选择日期" clearable>
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="chaxun()">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="exportExcel">导出</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!-- 充值记录列表-->
    <el-table :data="users" highlight-current-row
              style="width: 100%;" id="out-table" ref="table" :height="tableHeight">
      <el-table-column type="index" width="auto"></el-table-column>
      <el-table-column prop="agentId" label="收益代理" width="auto"></el-table-column>
      <el-table-column prop="agentName" label="代理昵称" width="auto"></el-table-column>
      <el-table-column prop="bossId" label="上级代理" width="auto"></el-table-column>
      <el-table-column prop="accountingAmount" label="返利金额" width="auto"></el-table-column>
      <el-table-column prop="rewardType" label="返利类型" width="auto"></el-table-column>
      <el-table-column prop="pruduct" label="返利商品" width="auto"></el-table-column>
      <el-table-column prop="totalamount" label="支付金额" width="auto"></el-table-column>
      <el-table-column prop="memberId" label="消费玩家" width="auto"></el-table-column>
      <el-table-column prop="memberName" label="玩家昵称" width="auto"></el-table-column>
      <el-table-column prop="memberHeadimgurl" label="玩家头像" width="auto">
        <template slot-scope="scope">
          <img :src="scope.row.memberHeadimgurl" alt="" class="pic">
        </template>
      </el-table-column>
      <el-table-column prop="accountingTime" label="收益时间" width="auto"></el-table-column>
    </el-table>

    <!--下载文件-->
    <el-dialog title="下载文件" :visible.sync="addFormVisible" :close-on-click-modal="false">
      是否确定下载文件？
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">否</el-button>
        <a href="#" id="download" @click="addSubmit">是</a>
      </div>
    </el-dialog>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange"
                     :page-size="1" :total="total" :current-page.sync = "page" style="float:right;">
      </el-pagination>
    </el-col>

  </el-row>
</template>

<script>
  import axios from 'axios'
  export default {
    name: "AgentIncomeQuery",
    data() {
      return {
        filters:{
          memberId:'',
          agentId:'',
          rewardType:''
        },
        users:[],
        options:[
          {value:'一级'},
          {value:'二级'},
        ],
        sorting:{},
        page:1,
        total:0,
        state:{
          status:'',
          pay_type:'',
          startTime:'',
          endTime:''
        },
        totalReward:0,
        totalOrder:0,
        addFormVisible:false,
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
      exportExcel(){
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
        this.addFormVisible = true;
        let download = document.getElementById('download');
        download.href = this.global.mPath + '/order/agentrewardexport?&agentId='+this.filters.agentId
          +'&memberId='+this.filters.memberId
          +'&rewardType='+this.filters.rewardType
          +'&startTime='+this.state.startTime
          +'&endTime='+this.state.endTime
          +'&token='+sessionStorage.getItem('token');
      },
      addSubmit(){
        this.addFormVisible = false;
      },
      search(){
        this.page = 1;
        this.handleSearch()
      },
      chaxun(){
        this.search()
      },
      handleSearch(){
        if(this.filters.rewardType === '全部'){
          this.filters.rewardType = ''
        }
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
          method: 'post',
          url: this.global.mPath + '/order/queryagentreward',
          headers: {
            'Content-type': 'application/x-www-form-urlencoded'
          },
          params: {
            'page':this.page,
            'size': '50',
            'agentId': this.filters.agentId,
            'memberId': this.filters.memberId,
            'rewardType':this.filters.rewardType,
            'startTime':this.state.startTime,
            'endTime':this.state.endTime,
            'token':sessionStorage.getItem('token')
          }
        }).then((res) => {
          this.totalReward =  res.data.data.totalReward;
          this.totalOrder =  res.data.data.totalOrder;
          this.users = res.data.data.listPage.items;
          this.total = res.data.data.listPage.pageCount;
          for(let i = 0;i < this.users.length;i++){
            this.users[i].accountingTime = this.dateTimeFormat(this.users[i].accountingTime);
          }
          setTimeout(() => {
            this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 100;
          },100)
        }).catch((e) => {
          if(e && e.response){
            switch (e.response.status) {
              case 504:
                this.$message({showClose: true, message: '服务器异常', type: 'warning'});
                break;
              case 405:
                this.$message({showClose: true, message: '请先登录', type: 'warning'});
                break;
            }
          }
        })
      },
      handleCurrentChange(val){
        this.page = val;
        this.handleSearch(this.page)
      }
    },
    mounted(){
      this.handleSearch()
    }
  }
</script>

<style lang="scss">
  /*.el-table{*/
    /*overflow: visible;*/
  /*}*/
  .pic{
    width:50px;
    height:50px;
  }
  .bg-purple{
    width:200px;
    height:100px;
    text-align: center;
    background-color: #eee;
    border-radius: 5px;
    border:1px solid #eee;
  }
  .order{
    .left-hand{
      float:left;
      img{
        width: 70px;
        height: 70px;
        margin: -4px 0 0 5px;
      }
    }
    .right{
      text-align: center;
      .type{
        margin-top:23px;
      }
      .num{
        margin-top:10px;
      }
    }
  }
  #download{
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    -webkit-appearance: none;
    text-align: center;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    outline: 0;
    margin: 0;
    -webkit-transition: .1s;
    transition: .1s;
    padding: 12px 20px;
    font-size: 14px;
    border-radius: 4px;
    text-decoration: none;
    color: #fff;
    background-color: #409EFF;
    border-color: #409EFF;
  }
  #download:hover{
    background: #66b1ff;
    border-color: #66b1ff;
    color: #fff;
  }
</style>
