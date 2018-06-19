<!--会员管理-->
<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>会员中心</b></el-breadcrumb-item>
        <el-breadcrumb-item>会员管理</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main" v-loading="loading" element-loading-text="拼命加载中">
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="filters">
          <el-form-item>
            <el-input v-model="filters.nickname" placeholder="会员名" @keyup.enter.native="handleSearch"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" v-on:click="handleSearch">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>

      <!-- 会员列表-->
      <el-table :data="vip" highlight-current-row @selection-change="selsChange"
                style="width: 100%;">
        <el-table-column type="index" width="60"></el-table-column>
        <el-table-column prop="headimgurl" label="会员头像" width="100" sortable>
          <template slot-scope="scope">
            <img :src="scope.row.headimgurl" alt="" style="width: 50px;height: 50px">
          </template>
        </el-table-column>
        <el-table-column prop="nickname" label="会员名称" width="100" sortable></el-table-column>
        <el-table-column prop="gender" label="会员性别" width="100" sortable></el-table-column>
        <el-table-column prop="phone" label="手机号" width="140" sortable></el-table-column>
        <el-table-column prop="createTime" label="注册时间" width="180" sortable></el-table-column>
        <el-table-column prop="vipEndTime" label="会员到期时间" width="180" sortable></el-table-column>
        <el-table-column prop="billsRunningWater" label="账单流水" sortable>
          <template slot-scope="scope">
            <el-button type="primary" @click="showRunningWater(scope.$index,scope.row)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--工具条-->
      <el-col :span="24" class="toolbar">
        <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="1" :total="total"
                       style="float:right;">
        </el-pagination>
      </el-col>

      <!--账单流水-->
      <el-dialog title="流水" :visible.sync="addFormVisible" :close-on-click-modal="false">
        <el-table :data="items" highlight-current-row @selection-change="selsChange"
                  style="width: 100%;">
          <el-table-column type="index" width="60"></el-table-column>
          <el-table-column prop="accountingNo" label="流水号" width="100" sortable></el-table-column>
          <el-table-column prop="accountingAmount" label="变化数量" width="100" sortable></el-table-column>
          <el-table-column prop="balanceAfter" label="剩余量" width="100" sortable></el-table-column>
          <el-table-column prop="summary.text" label="操作原因" sortable></el-table-column>
          <el-table-column prop="accountingTime" label="操作时间" width="160" sortable></el-table-column>
        </el-table>
        <!--工具条-->
        <el-col :span="24" class="toolbar">
          <el-pagination layout="prev, pager, next" @current-change="ChangePage" :page-size="1" :total="page"
                         style="float:right;">
          </el-pagination>
        </el-col>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" v-on:click="gold">金币</el-button>
          <el-button type="primary" @click="integral">积分</el-button>
        </div>
      </el-dialog>

    </el-col>
  </el-row>
</template>

<script>
  import axios from 'axios'

  export default {
    name: "NewVip",
    data() {
      return {
        items: [],
        vip: [],
        filters: {
          name: ''
        },
        total: 0,
        page: 0,
        limit: 10,
        loading: false,
        addFormVisible: false,//新增界面是否显示
        addLoading: false,
        addFormRules: {
          nickname: [
            {required: true, message: '请输入用户名', trigger: 'blur'}
          ],
          pass: [
            {required: true, message: '请输入密码', trigger: 'blur'}
          ],
          user: [
            {required: true, message: '请输入真实姓名', trigger: 'blur'}
          ],
          idCard: [
            {required: true, message: '请输入身份证号', trigger: 'blur'}
          ]
        },
        addForm: {
          name: '',
          author: '',
          publishAt: '',
          description: ''
        }
      }
    },
    methods: {
      ChangePage(val) {
        this.page = val;
        this.gold(this.page);
      },

      //按金币筛选
      gold() {
        axios({
          method: 'post',
          url: '/api/memberCtrl/querygoldrecord',
          headers: {
            'Content-type': 'application/x-www-form-urlencoded'
          },
          params: {
            'size': '15',//每页数量
            'page': this.page,//当前页
            'memberId':sessionStorage.getItem('id')  //0023
          }
        })
          .then((res) => {
              this.loading = false;//隐藏加载条
              this.items = res.data.data.items;
              this.page = res.data.data.pageNum;//总页数
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

      //按积分筛选
      integral() {
        axios({
          method: 'post',
          url: '/api/memberCtrl/queryscorerecord',
          headers: {
            'Content-type': 'application/x-www-form-urlencoded'
          },
          params: {
            'size': '15',//每页数量
            'page': this.page,//当前页
            'memberId':sessionStorage.getItem('id')//0023
          }
        })
          .then((res) => {
              this.loading = false;//隐藏加载条
              this.items = res.data.data.items;
              this.page = res.data.data.pageNum;//总页数
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

      //账单流水
      showRunningWater: function (index, row) {
        sessionStorage.setItem('id',this.vip[index].id);//保存id
        console.log(this.vip[index].id)
        this.addFormVisible = true;
        this.addForm = {
          name: '',
          author: '',
          publishAt: '',
          description: ''
        };
        this.gold(1);//弹出框默认显示金币流水
      },

      handleCurrentChange(val) {
        this.page = val;
        this.handleSearch(this.page);
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
      handleSearch() {
        this.loading = true;//显示加载条
        axios({//根据会员昵称查询
          method: 'post',
          url: '/api/memberCtrl/queryMember',
          headers: {
            'Content-type': 'application/x-www-form-urlencoded'
          },
          params: {
            'size': '15',//每页数量
            'page': this.page,//当前页
            'nickname': this.filters.nickname
          }
        })
          .then((res) => {
              this.loading = false;//隐藏加载条
              this.vip = res.data.memberList;
              this.total = res.data.pageNumber;//总页数
              for (let i = 0; i < this.vip.length; i++) {
                this.vip[i].vipEndTime = this.dateTimeFormat(this.vip[i].vipEndTime);
                this.vip[i].createTime = this.dateTimeFormat(this.vip[i].createTime);
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
    },
    mounted() { //初始化页面
      this.handleSearch()
    }
  }
</script>

<style>
  .demo-table-expand label {
    font-weight: bold;
  }

  .toolbar {
    margin-top: 30px;
  }

  .dialog-footer {
    margin-top: 50px;
  }
</style>

