<template>

  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>系统设置</b></el-breadcrumb-item>
        <el-breadcrumb-item>历史记录</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main" v-loading="loading" element-loading-text="拼命加载中">
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="filters">
          <el-form-item>
            <el-input v-model="filters.adminname" placeholder="管理员名称" @keyup.enter.native="handleSearch"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" v-on:click="handleSearch">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>

      <!-- 会员列表-->
      <el-table :data="list" highlight-current-row @selection-change="selsChange"
                style="width: 100%;">
        <el-table-column type="index" width="60"></el-table-column>
        <el-table-column prop="adminname" label="管理员名称" width="160" sortable></el-table-column>
        <el-table-column prop="title" label="标题" width="180" sortable></el-table-column>
        <el-table-column prop="file" label="图片" width="100" sortable>
          <template slot-scope="scope">
            <img :src="scope.row.file" alt="" style="width: 50px;height: 50px">
          </template>
        </el-table-column>
        <el-table-column prop="number" label="金币数量" width="140" sortable></el-table-column>
        <el-table-column prop="integral" label="积分数量" width="140" sortable></el-table-column>
        <el-table-column prop="vipcard" label="会员卡体验时间(天)"></el-table-column>
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
    name: "History",
    data() {
      return {
        list: [],
        filters: {
          name: ''
        },
        total: 0,
        loading: false,
      }
    },
    methods: {
      handleCurrentChange(val) {
        this.page = val;
        this.handleSearch(this.page);
      },
      handleSearch() {
        this.loading = true;//显示加载条
        axios({//根据会员昵称查询
          method: 'post',
          url: '/api/mailctrl/querymail',
          headers: {
            'Content-type': 'application/x-www-form-urlencoded'
          },
          params: {
            'size': '15',//每页数量
            'page': this.page,//当前页
            'adminname': this.filters.adminname
          }
        })
          .then((res) => {
              this.loading = false;//隐藏加载条
              this.list = res.data.list;
              this.total = res.data.count;//总页数
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
    },
    mounted() { //初始化页面
      this.handleSearch()
    }
  }
</script>

<style scoped>
  .warp-main {
    margin-top: 30px;
  }
</style>
