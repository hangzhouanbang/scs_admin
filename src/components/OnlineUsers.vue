<!--在线用户-->
<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>会员中心</b></el-breadcrumb-item>
        <el-breadcrumb-item>在线用户</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main" v-loading="loading" element-loading-text="拼命加载中">
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="filters">
          <el-form-item>
            <el-input v-model="filters.id" placeholder="用户ID" @keyup.enter.native="handleSearch"></el-input>
          </el-form-item>
          <el-form-item>
            <el-select v-model="value" placeholder="请选择身份进行查询" @change="change">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-col>

      <!-- 在线用户列表-->
      <el-table :data="onlineUsers" highlight-current-row @selection-change="selsChange"
                style="width: 100%;">
        <el-table-column type="index" width="60"></el-table-column>
        <el-table-column prop="id" label="用户ID" width="100" sortable></el-table-column>
        <el-table-column prop="nickname" label="用户昵称" width="100" sortable></el-table-column>
        <el-table-column prop="gender" label="消费金额（元）" width="160" sortable></el-table-column>
        <el-table-column prop="phone" label="金币" width="100" sortable></el-table-column>
        <el-table-column prop="createTime" label="积分" width="100" sortable></el-table-column>
        <el-table-column prop="vipEndTime" label="会员级别" width="100" sortable></el-table-column>
        <el-table-column prop="vipEndTime" label="所在房间" width="100" sortable></el-table-column>
        <el-table-column prop="vipEndTime" label="房间号"></el-table-column>
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
  export default {
    name: "OnlineUsers",
    data() {
      return {
        onlineUsers: [],
        options: [{
          value: '选项1',
          label: '会员用户'
        }, {
          value: '选项2',
          label: '非会员用户'
        },],
        value: '',
        filters: {
          name: ''
        },
        total: 0,
        loading: false,
      }
    },
    methods: {
      change() {
        if (this.value == '选项1') {//查询会员用户

        } else if (this.value == '选项2') {//查询非会员用户

        }
      },
      selsChange: function (sels) {
        this.sels = sels;
      },
      handleCurrentChange(val) {//分页
        this.page = val;
        this.handleSearch(this.page);
      },
    }
  }
</script>

<style scoped>
  .warp-main {
    margin-top: 20px;
  }
</style>
