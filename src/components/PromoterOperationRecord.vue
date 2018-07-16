<!--推广员操作记录-->
<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>推广员管理</b></el-breadcrumb-item>
        <el-breadcrumb-item>推广员操作记录</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main" v-loading="loading" element-loading-text="拼命加载中">
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="filters">
          <el-form-item label="推广员" label-width="68px">
            <el-select v-model="filters.type" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-button type="primary" @click="memberCardBuy">查询</el-button>
        </el-form>
      </el-col>

      <!-- 推广员操作记录列表-->
      <el-table :data="items" highlight-current-row @selection-change="selsChange"
                style="width: 100%;">
        <el-table-column prop="date" label="推广员ID" width="120" sortable></el-table-column>
        <el-table-column prop="newMember" label="昵称" width="100" sortable></el-table-column>
        <el-table-column prop="currentMember" label="推广员等级" width="120" sortable></el-table-column>
        <el-table-column prop="cost" label="注册时间" width="100" sortable></el-table-column>
        <el-table-column prop="gameNum" label="当前推广员等级" width="160" sortable></el-table-column>
        <el-table-column prop="loginMember" label="状态" width="100" sortable></el-table-column>
        <el-table-column prop="remainSecond" label="操作">
          <template slot-scope="scope">
            <el-button size="small" @click="publishDialog(scope.$index,scope.row)">操作</el-button>
            <el-button size="small">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--工具条-->
      <el-col :span="24" class="toolbar">
        <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="1" :total="total"
                       style="float:right;">
        </el-pagination>
      </el-col>
    </el-col>

    <!-- 操作-->
    <el-dialog title="" :visible.sync="publishVisible" :close-on-click-modal="false">
      <el-form :model="publishForm" label-width="120px" ref="addForm">
        <el-tabs :tab-position="tabPosition" style="height: 200px;">
          <el-tab-pane label="绑定">绑定</el-tab-pane>
          <el-tab-pane label="调整等级">调整等级</el-tab-pane>
        </el-tabs>
      </el-form>
    </el-dialog>

  </el-row>
</template>

<script>
  import axios from 'axios'

  export default {
    name: "PromoterOperationRecord",
    data() {
      return {
        loading: false,//隐藏加载条
        filters: {
          name: ''
        },
        items: ["1", "2"],
        total: 0,
        options: [
          {value: '一级推广员'},
          {value: '二级推广员'},
        ],
        publishVisible: false,
        publishForm: {},
        addForm: {},
        tabPosition: 'left'
      }
    },
    methods: {
      handleCurrentChange(val) {
        this.page = val;
        this.seek(this.page);
      },
      //查询会员卡购买记录
      memberCardBuy() {
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
      publishDialog: function (index, row) {
        this.publishVisible = true;
        this.publishForm = Object.assign({}, row);
      },
    }
  }
</script>

<style scoped>
  .warp-main {
    margin-top: 30px;
  }
</style>
