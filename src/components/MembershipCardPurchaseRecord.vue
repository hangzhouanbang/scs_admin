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
            <el-input v-model="filters.id" placeholder="请输入推广员ID"></el-input>
          </el-form-item>
          <el-form-item label="推广员昵称">
            <el-input v-model="filters.agent" placeholder="请输入推广员昵称"></el-input>
          </el-form-item>
          <el-form-item label="购买时间">
            <el-date-picker
              v-model="filters.startTime"
              type="date"
              placeholder="时间选择">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="至">
            <el-date-picker
              v-model="filters.endTime"
              type="date"
              placeholder="时间选择">
            </el-date-picker>
          </el-form-item>
          <el-button type="primary" @click="seek">搜索</el-button>
        </el-form>
      </el-col>

      <!-- 会员卡流水列表-->
      <el-table :data="items" highlight-current-row @selection-change="selsChange"
                style="width: 100%;">
        <el-table-column type="index" width="60"></el-table-column>
        <el-table-column prop="agentId" label="推广员ID" width="140" sortable></el-table-column>
        <el-table-column prop="agent" label="推广员昵称" width="140" sortable></el-table-column>
        <el-table-column prop="product" label="会员卡名称" width="120" sortable></el-table-column>
        <el-table-column prop="number" label="数量" width="100" sortable></el-table-column>
        <el-table-column prop="accountingAmount" label="购买金额" width="120" sortable></el-table-column>
        <el-table-column prop="accountingTime" label="购买时间" width="160" sortable></el-table-column>
        <el-table-column prop="summary.text" label="说明" width="100" sortable></el-table-column>
        <el-table-column prop="cost" label="累积消费" width="100" sortable></el-table-column>
        <el-table-column prop="remainSecond" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" @click="publishDialog(scope.$index,scope.row)">会员卡调整</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--工具条-->
      <el-col :span="24" class="toolbar">
        <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="1" :total="total"
                       style="float:right;">
        </el-pagination>
      </el-col>

      <!--会员卡调整弹窗-->
      <el-dialog title="会员卡调整" :visible.sync="publishVisible" :close-on-click-modal="false">
        <el-form :model="publishForm" label-width="220px">
          <el-form-item label="推广员ID">
            <el-input class="memberInput" v-model="publishForm.agentId" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="会员卡类型">
            <el-select v-model="publishForm.product" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="当前数量">
            <el-input class="memberInput" v-model="publishForm.number" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="调整数量为">
            <el-input class="memberInput" v-model="publishForm.afternumber"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="notarizeVisible = true,publishVisible =false">确认调整</el-button>
            <el-button type="primary" @click.native="publishVisible = false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>

      <!--确认调整弹窗-->
      <el-dialog title="会员卡调整" :visible.sync="notarizeVisible" :close-on-click-modal="false">
        <el-form>
          <div align="center">
            推广员{{publishForm.agentId}}拥有的<br/>{{publishForm.product}}：由{{publishForm.number}}调整至{{this.publishForm.afternumber}}<br/>是否确认调整？
          </div>
          <br/>
          <div align="center">
            <el-button type="primary" @click="sure">确认调整</el-button>
            <el-button type="primary" @click.native="notarizeVisible = false,publishVisible = true">返回修改</el-button>
          </div>
        </el-form>
      </el-dialog>

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
        notarize: {},
        options: [
          {value: '周卡'},
          {value: '月卡'},
          {value: '季卡'},
        ],
        publishVisible: false,
        publishForm: {},
        notarizeVisible: false,
        normalForm: {},
        state: []
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
        if (this.filters.startTime) {
          let date = new Date(this.filters.startTime);
          this.state.startTime = date.getTime();
        }
        if (this.filters.endTime) {
          let date = new Date(this.filters.endTime);
          this.state.endTime = date.getTime();
        }
        if (this.filters.startTime &&
          this.filters.endTime &&
          this.state.endTime - this.state.startTime <= 0) {
          this.$message({
            showClose: true,
            message: '时间段选择有误',
            type: 'warning'
          });
          return;
        }
        axios({
          method: 'post',
          url: '/api/agent/queryclubcardrecord',
          headers: {
            'Content-type': 'application/x-www-form-urlencoded'
          },
          params: {
            'size': '15',//每页数量
            'page': this.page,//当前页
            'agentId': this.filters.id,
            'agent': this.filters.agent,
            'startTime': this.state.startTime, /*日期转换为时间戳（毫秒数）发送到后台*/
            'endTime': this.state.endTime,
          }
        })
          .then((res) => {
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
      },
      selsChange: function (sels) {
        this.sels = sels;
      },

      publishDialog: function (index, row) {
        this.publishVisible = true;
        this.publishForm = Object.assign({}, row);
      },

      //确认调整会员卡
      sure() {
        axios({
          method: 'post',
          url: '/api/agent/clubcardmanager',
          headers: {
            'Content-type': 'application/x-www-form-urlencoded'
          },
          params: {
            'agentId': this.publishForm.agentId,
            'card': this.publishForm.product,
            'cardAmount': this.publishForm.afternumber,
          }
        })
          .then((res) => {
              //console.log(res.data.success)
              if (res.data.success == false) {
                this.$message({
                  showClose: true,
                  message: '调整失败',
                  type: 'warning'
                });
              } else if (res.data.success == true) {
                this.$message({
                  showClose: true,
                  message: '调整成功',
                  type: 'success'
                });
                this.notarizeVisible = false;
                this.seek();
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
    mounted() {
      this.seek();
    }
  }
</script>

<style scoped>
  .warp-main {
    margin-top: 30px;
  }

  .memberInput {
    width: 220px;
  }
</style>
