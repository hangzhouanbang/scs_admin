<!--推广员操作记录-->
<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>推广员管理</b></el-breadcrumb-item>
        <el-breadcrumb-item>推广码使用记录</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main" v-loading="loading" element-loading-text="拼命加载中">
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="filters">
          <el-form-item label="推广员ID" label-width="70px">
            <el-input v-model="filters.nickname" @keyup.enter.native="handleSearch"></el-input>
          </el-form-item>
          <el-form-item label="推广员昵称" label-width="90px">
            <el-input v-model="filters.nickname" @keyup.enter.native="handleSearch"></el-input>
          </el-form-item>
          <el-form-item label="注册时间" label-width="68px">
            <el-date-picker
              v-model="filters.startTime"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="至" label-width="68px" style="margin-left:-44px;">
            <el-date-picker
              v-model="filters.endTime"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-button type="primary" @click="memberCardBuy">查询</el-button>
        </el-form>
      </el-col>

      <!-- 推广员操作记录列表-->
      <el-table :data="items" highlight-current-row @selection-change="selsChange"
                style="width: 100%;">
        <el-table-column prop="date" label="推广员ID" width="120" sortable></el-table-column>
        <el-table-column prop="newMember" label="推广员昵称" width="120" sortable></el-table-column>
        <el-table-column prop="currentMember" label="推广码" width="120" sortable></el-table-column>
        <el-table-column prop="cost" label="邀请ID" width="100" sortable></el-table-column>
        <el-table-column prop="gameNum" label="绑定时间" width="100" sortable></el-table-column>
        <el-table-column prop="loginMember" label="获得积分" width="100" sortable></el-table-column>
        <el-table-column prop="loginMember" label="邀请总人数" width="150" sortable></el-table-column>
        <el-table-column prop="loginMember" label="累计得分" sortable></el-table-column>
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
        <el-tabs :tab-position="tabPosition" style="height: auto;">
          <el-tab-pane label="绑定">
            <el-col :span="24">
              <el-form :inline="true" label-width="150px">
                <el-form-item label="一级推广员ID">
                  <el-input placeholder="推广员ID"></el-input>
                </el-form-item>
                <el-form-item label="二级推广员ID">
                  <el-input placeholder="推广员ID"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="notice">
                  <el-input
                    type="textarea"
                    autosize
                    placeholder="请输入备注内容">
                  </el-input>
                </el-form-item>
                <table width="100%">
                  <tr>
                    <td align="center">
                      <el-button type="primary">绑定</el-button>
                    </td>
                    <td>
                      <el-button type="primary">解除绑定</el-button>
                    </td>
                  </tr>
                </table>
              </el-form>
            </el-col>
          </el-tab-pane>
          <el-tab-pane label="调整等级">
            <el-col :span="24">
              <el-form :inline="true" label-width="150px">
                <el-form-item label="一级推广员ID">
                  <el-input placeholder="推广员ID"></el-input>
                </el-form-item>
                <el-form-item label="当前等级">
                  <el-input></el-input>
                </el-form-item>
                <el-form-item label="提升等级">
                  <el-input></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="notice">
                  <el-input
                    type="textarea"
                    autosize
                    placeholder="请输入备注内容">
                  </el-input>
                </el-form-item>
                <table width="100%">
                  <tr>
                    <td align="center">
                      <el-button type="primary">确认修改</el-button>
                    </td>
                  </tr>
                </table>
              </el-form>
            </el-col>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-dialog>

    <!--详情-->
    <el-dialog title="" :visible.sync="centerDialogVisible" :close-on-click-modal="false">
      <div class="img">
        <img src="../assets/images/girl.jpg" alt="">
      </div>
      <el-table :data="roles" highlight-current-row
                style="width: auto">
        <el-table-column label="游戏昵称" width="100"></el-table-column>
        <el-table-column label="游戏ID" prop="role"></el-table-column>
        <el-table-column label="会员" prop="role"></el-table-column>
        <el-table-column label="会员时间" prop="role"></el-table-column>
        <el-table-column label="注册时间" prop="role"></el-table-column>
      </el-table>
      <el-table :data="roles" highlight-current-row
                style="width: auto">
        <el-table-column label="推广员等级" prop="role"></el-table-column>
        <el-table-column label="周卡剩余" prop="role"></el-table-column>
        <el-table-column label="月卡剩余" prop="role"></el-table-column>
        <el-table-column label="季卡剩余" prop="role"></el-table-column>
        <el-table-column label="充值金额" prop="role"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <router-link :to="{path:'/membershipCardPurchaseRecord'}">
          <el-button>会员卡购买记录</el-button>
        </router-link>
        <router-link :to="{path:'/membershipCardConsumptionRecord'}">
          <el-button>会员卡消费记录</el-button>
        </router-link>
        <el-button :visible.sync="relieveDialogVisible">取消推广员资格</el-button>
        <!--<el-button @click.native="relieveSubmit" :visible.sync="centerDialogVisible">解除封停状态</el-button>-->
      </div>
    </el-dialog>

  </el-row>
</template>

<script>
  import axios from 'axios'

  export default {
    name: "CodeUsageRecord",
    data() {
      return {
        loading: false,//隐藏加载条
        filters: {
          name: ''
        },
        items: [],
        roles: [],
        total: 0,
        options: [
          {value: '充值'},
          {value: '购买'},
          {value: '转增下级'},
          {value: '上级转增'},
          {value: '积分兑换'},
        ],
        publishVisible: false,
        publishForm: {},
        addForm: {},
        centerDialogVisible: false,
        centerDialogVisible: false,
        relieveDialogVisible: false,
        tabPosition: 'left'
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
        this.memberCardBuy(this.page);
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
      Dialog_particulars: function (index, row) {
        this.centerDialogVisible = true;
        this.publishForm = Object.assign({}, row);
      },
    }
  }
</script>

<style scoped>
  .warp-main {
    margin-top: 30px;
  }

  .img {
    float: left;
    margin-right: 40px;
  }
</style>

