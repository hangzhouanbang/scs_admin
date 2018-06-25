<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>会员中心</b></el-breadcrumb-item>
        <el-breadcrumb-item>充值记录</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <!--<el-col :span="24" class="warp-main" v-loading="loading" element-loading-text="拼命加载中">-->
      <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="filters">
          <el-form-item label="用户ID" label-width="68px">
            <el-input v-model="filters.memberId" @keyup.enter.native="handleSearch" style="width:220px;"></el-input>
          </el-form-item>
          <el-form-item label="昵称" label-width="68px">
            <el-input v-model="filters.nickname" @keyup.enter.native="handleSearch" style="width:220px;"></el-input>
          </el-form-item>
          <el-form-item label="支付方式" label-width="68px">
            <el-select v-model="filters.pay_type" placeholder="请选择"  clearable>
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
          <el-form-item label="订单状态" label-width="68px">
            <el-select v-model="filters.status" placeholder="所有状态" clearable>
              <el-option
                v-for="item in status"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" v-on:click="handleSearch">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="exportExcel">导出</el-button>
            <!--<a href="#" @click="exportExcel">导出</a>-->
          </el-form-item>
        </el-form>
      </el-col>

    <!-- 充值记录列表-->
    <el-table :data="users" highlight-current-row
              style="width: 100%;" id="out-table">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column type="index" width="60"></el-table-column>
      <el-table-column prop="out_trade_no" label="订单编号" width="120" sortable></el-table-column>
      <el-table-column prop="transaction_id" label="支付流水" width="120" sortable></el-table-column>
      <el-table-column prop="memberId" label="游戏ID" width="120" sortable></el-table-column>
      <el-table-column prop="nickname" label="玩家昵称" width="120" sortable></el-table-column>
      <el-table-column prop="clubCardPrice" label="商品售价" width="120" sortable></el-table-column>
      <el-table-column prop="totalamount" label="订单金额" width="120" sortable></el-table-column>
      <el-table-column prop="clubCardName" label="购买类别" width="120" sortable></el-table-column>
      <el-table-column prop="createTime" label="下单时间" width="110" sortable></el-table-column>
      <el-table-column prop="status" label="订单状态" width="120" sortable></el-table-column>
      <el-table-column prop="createTime" label="到账时间" width="110" sortable></el-table-column>
      <el-table-column prop="pay_type" label="支付方式" width="120" sortable></el-table-column>
      <el-table-column prop="reqIP" label="下单地址" width="auto" sortable></el-table-column>
    </el-table>

    <!--下载文件-->
    <el-dialog title="下载文件" :visible.sync="addFormVisible" :close-on-click-modal="false">
      是否确定下载文件？
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">否</el-button>
        <a href="#" id="download">是</a>
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
            filters:{},
            users:[],
            state:[],
            total:0,
            down:[],
            addFormVisible:false,
            options:[
              {value:'支付宝'},
              {value:'微信'},
            ],
            status:[
              {value:'已付款'},
              {value:'未付款'},
              {value:'支付失败'}
            ]
          }
        },
      methods:{
        handleCurrentChange(val) {
          this.page = val;
          this.handleSearch(this.page);
        },
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
        //导出Excel表
        exportExcel () {
          this.addFormVisible = true;
          axios({
            method: 'post',
            url: '/api/order/download',
            headers: {
              'Content-type': 'application/x-www-form-urlencoded'
            },
            params: {}
          }).then(
            function(res){
              // console.log(res)
              let download = document.getElementById('download');
              download.href = '/api'+res.data.data;
            }
          )
        },
        handleSearch() {
          if(this.filters.status == '未付款'){
            this.state.status = 0;
          }
          if(this.filters.status == '支付失败'){
            this.state.status = -1;
          }
          if(this.filters.status == '已付款'){
            this.state.status = 1;
          }
          if(this.filters.pay_type == '支付宝'){
            this.state.pay_type = 'alipay';
          }
          if(this.filters.pay_type == '微信'){
            this.state.pay_type = 'wxpay';
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
          axios({
            method: 'post',
            url: '/api/order/queryorder',
            headers: {
              'Content-type': 'application/x-www-form-urlencoded'
            },
            params: {
              'page': this.page,
              'size': '10',
              'memberId': this.filters.memberId,
              'nickname': this.filters.nickname,
              'out_trade_no':'',
              'pay_type':this.state.pay_type,
              'startTime':this.state.startTime,
              'endTime':this.state.endTime,
              'status':this.state.status
            }
          })
            .then((res) => {
                this.users = res.data.data.items;
                this.total = res.data.data.pageCount;
                for(let i = 0;i < this.users.length;i++){
                  this.users[i].createTime = this.dateTimeFormat(this.users[i].createTime);
                }
              },
            ).catch((e) => {
            if(e && e.response){
              switch (e.response.status) {
                case 504:
                  this.$message({
                    showClose: true,
                    message: '服务器异常',
                    type: 'warning'
                  });
                  break;
                case 405:
                  this.$message({
                    showClose: true,
                    message: '请先登录',
                    type: 'warning'
                  });
                  break;
              }
            }
          });
        }
      },
      mounted() {
        this.handleSearch(1)
      }
    }
</script>

<style scoped>
  .toolbar{
    margin-top:30px;
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
