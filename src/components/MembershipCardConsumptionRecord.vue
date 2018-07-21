<!--会员卡兑换记录-->
<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>推广员中心</b></el-breadcrumb-item>
        <el-breadcrumb-item>会员卡兑换记录</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main" v-loading="loading" element-loading-text="拼命加载中">
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="filters">
          <el-form-item label="推广员ID">
            <el-input v-model="filters.id" placeholder="请输入推广员ID"></el-input>
          </el-form-item>
          <el-form-item label="推广员昵称">
            <el-input v-model="filters.agent" placeholder="请输入推广员昵称"></el-input>
          </el-form-item>
          <el-form-item label="兑换时间">
            <el-date-picker
              v-model="value1"
              type="date"
              placeholder="时间选择">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="至">
            <el-date-picker
              v-model="value2"
              type="date"
              placeholder="时间选择">
            </el-date-picker>
          </el-form-item>
          <el-button type="primary" @click="seek">搜索</el-button>
        </el-form>
      </el-col>

      <!-- 积分流水列表-->
      <el-table :data="items" highlight-current-row @selection-change="selsChange"
                style="width: 100%;" v-show="po">
        <el-table-column type="index" width="60"></el-table-column>
        <el-table-column prop="agentId" label="推广员ID" width="120" sortable></el-table-column>
        <el-table-column prop="agent" label="推广员昵称" width="120" sortable></el-table-column>
        <el-table-column prop="product" label="商品名称" width="100" sortable></el-table-column>
        <el-table-column prop="number" label="数量" width="100" sortable></el-table-column>
        <el-table-column prop="accountingAmount" label="兑换消耗" width="100" sortable></el-table-column>
        <el-table-column prop="accountingTime" label="兑换时间" width="160" sortable></el-table-column>
        <el-table-column prop="balanceAfter" label="剩余积分" width="100" sortable></el-table-column>
      </el-table>
      <!--工具条-->
      <el-col :span="24" class="toolbar" v-show="po">
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
    name: "MembershipCardConsumptionRecord",

    data() {
      return {
        loading: false,//隐藏加载条
        filters: {
          name: ''
        },
        items: [],
        total: 0,
        value1: '',//开始时间
        value2: '',//结束时间
        po: false,//隐藏表单
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

      handleCurrentChange(val) {
        this.page = val;
        this.seek(this.page);
      },
      //搜索
      seek() {
        if (this.value1 == 'NaN' || this.value1 == '' || this.value2 == 'NaN' || this.value2 == '') {
          this.$message({
            showClose: true,
            message: '请选择购买时间段',
            type: 'warning'
          });
        } else if (new Date(this.value2).getTime() - new Date(this.value1).getTime() <= 0) {
          this.$message({
            showClose: true,
            message: '时间段选择有误',
            type: 'warning'
          });
        } else {
          axios({
            method: 'post',
            url: '/api/agent/queryscorerecord',
            headers: {
              'Content-type': 'application/x-www-form-urlencoded'
            },
            params: {
              'size': '15',//每页数量
              'page': this.page,//当前页
              'agentId': this.filters.id,
              'agent': this.filters.agent,
              'startTime': new Date(this.value1).getTime(), /*日期转换为时间戳（毫秒数）发送到后台*/
              'endTime': new Date(this.value2).getTime(),
            }
          })
            .then((res) => {
                this.po = true;//显示表单
                this.loading = false;//隐藏加载条
                this.items = res.data.data.items;
                this.total = res.data.data.pageCount;
                //console.log(res.data.data.items)
                for (let i = 0; i < this.items.length; i++) {
                  this.items[i].accountingTime = this.dateTimeFormat(this.items[i].accountingTime);
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
        }
      },
      selsChange: function (sels) {
        this.sels = sels;
      },
    },
    mounted() {
    }
  }
</script>

<style scoped>
  .warp-main {
    margin-top: 30px;
  }
</style>
