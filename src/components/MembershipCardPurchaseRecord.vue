<!--会员卡购买记录-->
<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>推广员中心</b></el-breadcrumb-item>
        <el-breadcrumb-item>会员卡购买记录</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main" v-loading="loading" element-loading-text="拼命加载中">
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="filters">
          <el-form-item label="推广员ID">
            <el-input v-model="filters.game" placeholder="单行输入"></el-input>
          </el-form-item>
          <el-form-item label="注册时间">
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
          <el-button type="primary" @click="seek">查询</el-button>
        </el-form>
      </el-col>

      <!-- 会员卡购买记录列表-->
      <el-table :data="items" highlight-current-row @selection-change="selsChange"
                style="width: 100%;">
        <el-table-column prop="date" label="昵称" width="100" sortable></el-table-column>
        <el-table-column prop="newMember" label="ID" width="100" sortable></el-table-column>
        <el-table-column prop="currentMember" label="商品名称" width="100" sortable></el-table-column>
        <el-table-column prop="cost" label="数量" width="100" sortable></el-table-column>
        <el-table-column prop="gameNum" label="说明" width="120" sortable></el-table-column>
        <el-table-column prop="loginMember" label="购买时间" width="100" sortable></el-table-column>
        <el-table-column prop="remainSecond" label="累积购买金额"></el-table-column>
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
    name: "MembershipCardPurchaseRecord",
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
      }
    },
    methods: {
      handleCurrentChange(val) {
        this.page = val;
        this.seek(this.page);
      },
      //搜索
      seek() {
        axios({
          method: 'post',
          url: '/api/',
          headers: {
            'Content-type': 'application/x-www-form-urlencoded'
          },
          params: {
            'size': '15',//每页数量
            'page': this.page,//当前页
            'startTime': new Date(this.value1).getTime(), /*日期转换为时间戳（毫秒数）发送到后台*/
            'endTime': new Date(this.value2).getTime()
          }
        })
          .then((res) => {
              this.po = true;//显示表单
              this.loading = false;//隐藏加载条
              this.items = res.data.data.items;
              this.total = res.data.data.pageCount;
              //console.log(res.data.data.items)
              for (let i = 0; i < this.items.length; i++) {
                this.items[i].date = this.dateTimeFormat(this.items[i].date);
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
      selsChange: function (sels) {
        this.sels = sels;
      },
    }
  }
</script>

<style scoped>
  .warp-main {
    margin-top: 30px;
  }
</style>
