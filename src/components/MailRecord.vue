<!--邮件记录-->
<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>邮件管理</b></el-breadcrumb-item>
        <el-breadcrumb-item>邮件记录</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
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
        <el-form-item label="类型" label-width="68px">
          <el-select v-model="filters.mailType" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="操作人" label-width="68px">
          <el-select v-model="nickname" placeholder="请选择">
            <el-option
              v-for="item in this.adminList"
              :key="item.nickname"
              :label="item.nickname"
              :value="item.nickname">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="handleSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!-- 邮件列表-->
    <el-table :data="items" highlight-current-row style="width: 100%;">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column type="index" width="60"></el-table-column>
      <el-table-column prop="memberId" label="用户ID" width="auto" sortable></el-table-column>
      <el-table-column prop="systemMail.file" label="邮件内容" width="auto" sortable>
        <template slot-scope="scope">
          <img :src="scope.row.systemMail.file" alt="" style="width: 50px;height: 50px">
        </template>
      </el-table-column>
      <el-table-column prop="systemMail.mailType" label="类型" width="auto" sortable></el-table-column>
      <el-table-column prop="systemMail.number" label="玉石" width="auto" sortable></el-table-column>
      <el-table-column prop="systemMail.integral" label="礼券" width="auto" sortable></el-table-column>
      <el-table-column prop="vipCardName" label="会员卡" width="auto" sortable></el-table-column>
      <el-table-column prop="systemMail.validTime" label="有效时间" width="auto" sortable></el-table-column>
      <el-table-column prop="systemMail.createtime" label="发送时间" width="auto" sortable></el-table-column>
      <el-table-column prop="receive" label="是否领取" width="auto" sortable>
        <template slot-scope="scope">
          <el-button type="text" v-if="scope.row.receive === '0'">已领取</el-button>
          <el-button type="text" v-if="scope.row.receive === '1'">未领取</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="rewardTime" label="领取时间" width="auto" sortable>
        <template slot-scope="scope">
          <el-button type="text" v-if="scope.row.rewardTime === '1970-01-01 08:00:00'">未领取</el-button>
          <el-button type="text" v-if="scope.row.rewardTime !== '1970-01-01 08:00:00'">{{scope.row.rewardTime}}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="systemMail.adminname" label="发送人" width="auto" sortable></el-table-column>
    </el-table>

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
    name: "MailRecord",
    data() {
      return {
        filters: {},
        items: [],
        options: [
          {
            value: '',
            label: '所有'
          },
          {value: '活动奖励'},
          {value: '系统通知'},
          {value: '活动通知'}
        ],
        value: '',
        adminList: [],
        nickname: this.adminList,
        total: 0,
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
        this.handleSearch(this.page);
      },
      handleSearch() {
        axios({
          method: 'post',
          url: this.global.mPath + '/mailctrl/find_mail_record',
          headers: {
            'Content-type': 'application/x-www-form-urlencoded'
          },
          params: {
            'size': '15',//每页数量
            'page': this.page,//当前页
            'startTime': 'NaN' ? '0' : new Date(this.filters.startTime).getTime(), /*日期转换为时间戳（毫秒数）发送到后台*/
            'endTime': 'NaN' ? '0' : new Date(this.filters.endTime).getTime(),
            'mailType': this.filters.mailType,
            'adminName': this.nickname
          }
        })
          .then((res) => {
              if (res.data.success == false) {
                this.$message({
                  showClose: true,
                  message: '发布失败',
                  type: 'warning'
                });
              } else if (res.data.success == true) {
                this.items = res.data.data.items;
                this.total = res.data.data.pageCount;//总页数
                //console.log(this.data)
                for (let i = 0; i < this.items.length; i++) {
                  this.items[i].systemMail.validTime = this.dateTimeFormat(this.items[i].systemMail.validTime);
                  this.items[i].systemMail.createtime = this.dateTimeFormat(this.items[i].systemMail.createtime);
                  this.items[i].rewardTime = this.dateTimeFormat(this.items[i].rewardTime);
                }
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
    },
    mounted() {
      this.handleSearch();
      axios({//查出所有管理员名称
        method: 'post',
        url: this.global.mPath + '/adminCtrl/queryAdmin',
        headers: {
          'Content-type': 'application/x-www-form-urlencoded'
        },
      })
        .then((res) => {
            this.adminList = res.data.adminList;
            //console.log(this.data)
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
  }
</script>

<style scoped>
  .toolbar {
    margin-top: 30px;
  }
</style>

