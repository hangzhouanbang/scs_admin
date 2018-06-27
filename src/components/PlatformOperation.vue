<!--平台运营日报-->
<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>报表统计</b></el-breadcrumb-item>
        <el-breadcrumb-item>平台运营日报</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main" v-loading="loading" element-loading-text="拼命加载中">
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="filters">
          <el-form-item label="开始时间">
            <el-date-picker
              v-model="value1"
              type="date"
              placeholder="开始时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间">
            <el-date-picker
              v-model="value2"
              type="date"
              placeholder="结束时间">
            </el-date-picker>
          </el-form-item>
          <el-button type="primary" @click="seek">搜索</el-button>
        </el-form>
      </el-col>

      <!-- 运营日报列表-->
      <el-table :data="data" highlight-current-row @selection-change="selsChange"
                style="width: 100%;">
        <el-table-column prop="date" label="日期" width="100" sortable></el-table-column>
        <el-table-column prop="newMember" label="新增注册量" width="140" sortable></el-table-column>
        <el-table-column prop="currentMember" label="当日会员人数" width="140" sortable></el-table-column>
        <el-table-column prop="cost" label="消费金额" width="100" sortable></el-table-column>
        <el-table-column prop="gameNum" label="游戏总局数" width="140" sortable></el-table-column>
        <el-table-column prop="loginMember" label="独立玩家" width="100" sortable></el-table-column>
        <el-table-column prop="remainSecond" label="次日留存" width="100" sortable></el-table-column>
        <el-table-column prop="remainThird" label="三日留存" width="100" sortable></el-table-column>
        <el-table-column prop="remainSeventh" label="七日留存" width="100" sortable></el-table-column>
        <el-table-column prop="remainMonth" label="三十日以外留存"></el-table-column>
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
    name: "PlatformOperation",
    data() {
      return {
        loading: false,//隐藏加载条
        filters: {
          name: ''
        },
        data: [],
        total: 0,
        value1: '',//开始时间
        value2: '',//结束时间
      }
    },
    methods: {
      handleCurrentChange(val) {
        this.page = val;
        this.handleSearch(this.page);
      },
      //搜索
      seek() {
        axios({
          method: 'post',
          url: '/api/datareport/platform',
          headers: {
            'Content-type': 'application/x-www-form-urlencoded'
          },
          params: {
            'startTime': '',
            'endTime': ''
          }
        })
          .then((res) => {
              this.loading = false;//隐藏加载条
              this.data = res.data.data;
              //console.log(res.data.data.items)
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
    mounted() {
      this.seek();
    }
  }
</script>

<style scoped>
  .warp-main {
    margin-top: 20px;
  }
</style>
