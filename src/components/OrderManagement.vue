<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>充值系统</b></el-breadcrumb-item>
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-row :gutter="20" style="margin-top:30px;">
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <div class="type">已支付</div>
          <div class="num">{{payCost}}元 {{payAmount}}单</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <div class="type">未支付</div>
          <div class="num">{{notPayCost}}元 {{notPayAmount}}单</div>
        </div>
      </el-col>
    </el-row>

    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="filters">
          <el-form-item label="用户ID" label-width="68px">
            <el-input v-model="filters.memberId" @keyup.enter.native="handleSearch()" style="width:220px;"></el-input>
          </el-form-item>
          <el-form-item label="昵称" label-width="68px">
            <el-input v-model="filters.nickname" @keyup.enter.native="handleSearch()" style="width:220px;"></el-input>
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
            <el-button type="primary" v-on:click="handleSearch()">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="exportExcel">导出</el-button>
          </el-form-item>
        </el-form>
      </el-col>

    <!-- 充值记录列表-->
    <el-table :data="users" highlight-current-row
              style="width: 100%;" id="out-table" @sort-change="sort">
      <el-table-column type="index" width="60"></el-table-column>
      <el-table-column prop="id" label="订单编号" width="120"></el-table-column>
      <el-table-column prop="transaction_id" label="支付流水" width="120"></el-table-column>
      <el-table-column prop="payerId" label="付款人ID" width="120"></el-table-column>
      <el-table-column prop="payerName" label="付款人昵称" width="120"></el-table-column>
      <el-table-column prop="productId" label="会员卡ID" width="120"></el-table-column>
      <el-table-column prop="productName" label="会员卡名称" width="120"></el-table-column>
      <el-table-column prop="productPrice" label="会员卡价格" width="120"  sortable="custom"></el-table-column>
      <el-table-column prop="number" label="购买数量" width="120"  sortable="custom"></el-table-column>
      <el-table-column prop="gold" label="单张会员卡赠送玉石" width="120"></el-table-column>
      <el-table-column prop="score" label="单张会员卡赠送礼券" width="120"></el-table-column>
      <el-table-column prop="vipTime" label="单张会员卡赠送VIP时间" width="120"></el-table-column>
      <el-table-column prop="totalamount" label="总金额" width="120"  sortable="custom"></el-table-column>
      <el-table-column prop="createTime" label="下单时间" width="110"  sortable="custom"></el-table-column>
      <el-table-column prop="status" label="订单状态" width="120"  sortable="custom"></el-table-column>
      <el-table-column prop="pay_type" label="支付方式" width="120"  sortable="custom"></el-table-column>
      <el-table-column prop="reqIP" label="下单地址" width="auto"></el-table-column>
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
        name: "OrderManagement",
        data() {
          return {
            filters:{
              memberId:'',
              nickname:''
            },
            users:[],
            state:{
              status:'',
              pay_type:'',
              startTime:'',
              endTime:''
            },
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
            ],
            sorting:{},
            page:1,
            payCost:'',
            payAmount:'',
            notPayCost:'',
            notPayAmount:''
          }
        },
      methods:{
        handleCurrentChange(val) {
          this.page = val;
          this.sort(this.sorting);
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
        trim(str) {
          if(str != null){
            return str.replace(/(^\s+)|(\s+$)/g, "");
          }
        },
        //导出Excel表
        exportExcel () {
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
          this.addFormVisible = true;
          let download = document.getElementById('download');
          download.href = this.global.mPath + '/order/download?out_trade_no='
            +'&pay_type='+this.state.pay_type
            +'&payerId='+this.trim(this.filters.memberId)
            +'&payerName='+this.trim(this.filters.nickname)
            +'&status='+this.state.status
            +'&startTime='+this.state.startTime
            +'&endTime='+this.state.endTime
            +'&deliverTime='
            +'&token='+sessionStorage.getItem('token');
        },
        addSubmit(){
          this.addFormVisible = false;
        },
        handleSearch(productPriceSort,numberSort,totalamountSort,createTimeSort,statusSort,pay_typeSort) {
          if(this.filters.status == '未付款'){
            this.state.status = 'NOTPAY';
          }
          if(this.filters.status == '支付失败'){
            this.state.status = 'PAYFAIL';
          }
          if(this.filters.status == '已付款'){
            this.state.status = 'PAYSUCCESS';
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
            url: this.global.mPath + '/order/queryorder',
            headers: {
              'Content-type': 'application/x-www-form-urlencoded'
            },
            params: {
              'page':this.page,
              'size': '10',
              'payerId': this.trim(this.filters.memberId),
              'payerName': this.trim(this.filters.nickname),
              'out_trade_no':'',
              'pay_type':this.state.pay_type,
              'startTime':this.state.startTime,
              'endTime':this.state.endTime,
              'status':this.state.status,
              'token':sessionStorage.getItem('token'),
              'productPriceSort':productPriceSort,
              'numberSort':numberSort,
              'totalamountSort':totalamountSort,
              'createTimeSort':createTimeSort,
              'statusSort':statusSort,
              'pay_typeSort':pay_typeSort
            }
          })
            .then((res) => {
                this.payCost =  res.data.data.payCost
                this.payAmount =  res.data.data.payAmount
                this.notPayCost =  res.data.data.notPayCost
                this.notPayAmount =  res.data.data.notPayAmount
                this.users = res.data.data.listPage.items;
                this.total = res.data.data.listPage.pageCount;
                for(let i = 0;i < this.users.length;i++){
                  this.users[i].createTime = this.dateTimeFormat(this.users[i].createTime);
                  this.users[i].vipTime = this.users[i].vipTime / 1000 / 60 / 60 / 24;
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
        },
        sort(a){
          this.sorting = a;
          if(this.sorting.prop == 'productPrice'){
            if(this.sorting.order == 'ascending'){
              this.sorting.productPrice = 'ASC'
            }
            if(this.sorting.order == 'descending'){
              this.sorting.productPrice = 'DESC'
            }
          }
          if(this.sorting.prop == 'number'){
            if(this.sorting.order == 'ascending'){
              this.sorting.number = 'ASC'
            }
            if(this.sorting.order == 'descending'){
              this.sorting.number = 'DESC'
            }
          }
          if(this.sorting.prop == 'totalamount'){
            if(this.sorting.order == 'ascending'){
              this.sorting.totalamount = 'ASC'
            }
            if(this.sorting.order == 'descending'){
              this.sorting.totalamount = 'DESC'
            }
          }
          if(this.sorting.prop == 'createTime'){
            if(this.sorting.order == 'ascending'){
              this.sorting.createTime = 'ASC'
            }
            if(this.sorting.order == 'descending'){
              this.sorting.createTime = 'DESC'
            }
          }
          if(this.sorting.prop == 'status'){
            if(this.sorting.order == 'ascending'){
              this.sorting.status = 'ASC'
            }
            if(this.sorting.order == 'descending'){
              this.sorting.status = 'DESC'
            }
          }
          if(this.sorting.prop == 'pay_type'){
            if(this.sorting.order == 'ascending'){
              this.sorting.pay_type = 'ASC'
            }
            if(this.sorting.order == 'descending'){
              this.sorting.pay_type = 'DESC'
            }
          }
          this.handleSearch(this.sorting.productPrice,this.sorting.number,this.sorting.totalamount,this.sorting.createTime,this.sorting.status,this.sorting.pay_type)
        }
      },
      mounted() {
        this.handleSearch()
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
  .bg-purple{
    width:200px;
    height:100px;
    text-align: center;
    background-color: #eee;
    border-radius: 5px;
    border:1px solid #eee;
  }
  .bg-purple div:nth-child(1){
    margin-top:20px;
    font-size:20px;
  }
  .bg-purple div:nth-child(2){
    margin-top:10px;
  }
</style>
