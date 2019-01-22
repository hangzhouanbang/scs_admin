<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>财务系统</b></el-breadcrumb-item>
        <el-breadcrumb-item>游戏充值记录</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-row :gutter="20" style="margin-top:30px;" class="order">
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <div class="left-hand">
            <img src="../assets/images/order_total.png" alt="">
          </div>
          <div class="right">
            <div class="type">订单总金额</div>
            <div class="num">{{totalCost}}</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <div class="left-hand">
            <img src="../assets/images/order_number.png" alt="">
          </div>
          <div class="right">
            <div class="type">订单总数量</div>
            <div class="num">{{totalRecord}}</div>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-col :span="24" class="toolbar" style="padding-bottom:0;margin-top:30px;">
      <el-form :inline="true" :model="filters">
        <el-form-item label="玩家ID" label-width="68px">
          <el-input v-model.trim="filters.payerId" @keyup.enter.native="handleSearch()" style="width:220px;"></el-input>
        </el-form-item>
        <el-form-item label="玩家昵称" label-width="68px">
          <el-input v-model.trim="filters.payerName" @keyup.enter.native="handleSearch()" style="width:220px;"></el-input>
        </el-form-item>
        <el-form-item label="支付方式" label-width="68px">
          <el-select v-model="filters.pay_type" placeholder="请选择"  clearable>
            <el-option
              v-for="item in options.agentPayType"
              :key="item"
              :label="item.label"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间" label-width="68px">
          <el-date-picker
            v-model="filters.startTime"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" label-width="68px">
          <el-date-picker
            v-model="filters.endTime"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="handleSearch()">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="exportExcel">导出</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!-- 充值记录列表-->
    <el-table :data="users" highlight-current-row
              style="width: 100%;" id="out-table" @sort-change="sort" ref="table" :height="tableHeight">
      <el-table-column type="index" width="60"></el-table-column>
      <el-table-column prop="id" label="订单编号" width="120"></el-table-column>
      <el-table-column prop="transaction_id" label="支付流水" width="120"></el-table-column>
      <el-table-column prop="pay_type" label="充值类型" width="120"></el-table-column>
      <el-table-column prop="payerId" label="玩家ID" width="120"></el-table-column>
      <el-table-column prop="payerName" label="玩家昵称" width="120"></el-table-column>
      <el-table-column prop="productPrice" label="订单金额" width="120" sortable="custom"></el-table-column>
      <el-table-column prop="productName" label="购买道具" width="120"></el-table-column>
      <el-table-column prop="reqIP" label="充值地址IP" width="150"></el-table-column>
      <el-table-column prop="createTime" label="充值时间" width="auto" sortable="custom"></el-table-column>
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
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="1" :total="total"
                     style="float:right;">
      </el-pagination>
    </el-col>

  </el-row>
</template>

<script>
  import axios from 'axios'
  export default {
      name: "ReCharge",
      data() {
          return {
            filters:{
              payerId:'',
              payerName:''
            },
            users:[],
            options:[],
            sorting:{},
            page:1,
            total:0,
            state:{
              status:'',
              pay_type:'',
              startTime:'',
              endTime:''
            },
            totalCost:0,
            addFormVisible:false,
            tableHeight:0,
            totalRecord:0
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
        agentPayType(){
          axios({
            method: 'post',
            url: this.global.mPath + '/order/adminmapping',
            headers: {
              'Content-type': 'application/x-www-form-urlencoded'
            },
            params: {
              'token':sessionStorage.getItem('token')
            }
          }).then((res) => {
            this.options = res.data.data
          })
        },
        handleCurrentChange(val) {
          this.page = val;
          this.sort(this.sorting);
        },
        handleSearch(totalamountSort,createTimeSort) {
          if(this.filters.pay_type === '支付宝'){
            this.state.pay_type = 'alipay';
          }else if(this.filters.pay_type === '微信'){
            this.state.pay_type = 'wxpay';
          }else{
            this.state.pay_type = ''
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
            url: this.global.mPath + '/order/queryrechargerecord',
            headers: {
              'Content-type': 'application/x-www-form-urlencoded'
            },
            params: {
              'page':this.page,
              'size': '50',
              'payerId': this.filters.payerId,
              'payerName': this.filters.payerName,
              'pay_type':this.state.pay_type,
              'startTime':this.state.startTime,
              'endTime':this.state.endTime,
              'token':sessionStorage.getItem('token'),
              'totalamountSort':totalamountSort,
              'createTimeSort':createTimeSort,
            }
          }).then((res) => {
            this.totalCost =  res.data.data.totalCost;
            this.totalRecord =  res.data.data.totalRecord;
            this.users = res.data.data.listPage.items;
            this.total = res.data.data.listPage.pageCount;
            for(let i = 0;i < this.users.length;i++){
              this.users[i].createTime = this.dateTimeFormat(this.users[i].createTime);
              this.users[i].vipTime = this.users[i].vipTime / 1000 / 60 / 60 / 24;
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
        sort(a){
          this.sorting = a;
          if(this.sorting.prop === 'productPrice'){
            if(this.sorting.order === 'ascending'){
              this.sorting.totalamount = 'ASC'
            }
            if(this.sorting.order === 'descending'){
              this.sorting.totalamount = 'DESC'
            }
          }
          if(this.sorting.prop === 'createTime'){
            if(this.sorting.order === 'ascending'){
              this.sorting.createTime = 'ASC'
            }
            if(this.sorting.order === 'descending'){
              this.sorting.createTime = 'DESC'
            }
          }
          this.handleSearch(this.sorting.totalamount,this.sorting.createTime)
        },
        //导出Excel表
        exportExcel () {
          if(this.filters.pay_type === '支付宝'){
            this.state.pay_type = 'alipay';
          }else if(this.filters.pay_type === '微信'){
            this.state.pay_type = 'wxpay';
          }else{
            this.state.pay_type = ''
          }
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
          this.addFormVisible = true;
          let download = document.getElementById('download');
          download.href = this.global.mPath + '/order/rechargedownload?&pay_type='+this.state.pay_type
            +'&payerId='+this.filters.payerId
            +'&payerName='+this.filters.payerName
            +'&startTime='+this.state.startTime
            +'&endTime='+this.state.endTime
            +'&token='+sessionStorage.getItem('token');
        },
        addSubmit(){
          this.addFormVisible = false;
        }
      },
      mounted() {
        axios({
          url:this.global.mPath + '/login/admin_info',
          method:'post',
          params:{
            token:sessionStorage.getItem('token')
          }
        }).then((res) => {
          // console.log(res.data.success)
          if(res.data.success){
            this.handleSearch();
            this.agentPayType()
          }else{
            this.$router.replace('/');
          }
        })
      }
    }
</script>

<style lang="scss">
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
        margin: 15px 0 0 5px;
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
