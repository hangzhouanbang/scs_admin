<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>系统设置</b></el-breadcrumb-item>
        <el-breadcrumb-item>系统公告</el-breadcrumb-item>
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
          <el-form-item>
            <el-button type="primary" @click="showAddDialog">发公告</el-button>
          </el-form-item>
        </el-form>
      </el-col>

      <!-- 历史公告列表-->
      <el-table :data="list" highlight-current-row @selection-change="selsChange"
                style="width: 100%;">
        <el-table-column type="index" width="60"></el-table-column>
        <el-table-column prop="adminname" label="管理员名称" width="160" sortable></el-table-column>
        <el-table-column prop="notice" label="公告内容" width="300" sortable></el-table-column>
        <el-table-column prop="place" label="发布地方" width="160" sortable>
          <template slot-scope="scope">
            <el-button type="text" v-if="scope.row.place === '0'">游戏大厅</el-button>
            <el-button type="text" v-if="scope.row.place === '1'">游戏房间</el-button>
            <el-button type="text" v-if="scope.row.place === '2'">游戏大厅和房间</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="state" label="状态">
          <template slot-scope="scope">
            <el-button type="primary" v-if="scope.row.state === 1" :disabled="false" @click="off">启用</el-button>
            <el-button type="info" disabled v-if="scope.row.state === 0">禁用</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--工具条-->
      <el-col :span="24" class="toolbar">
        <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="1" :total="total"
                       style="float:right;">
        </el-pagination>
      </el-col>

      <!--发公告弹窗-->
      <el-dialog title="发公告" :visible.sync="addFormVisible" :close-on-click-modal="false">
        <el-form :model="normalForm" label-width="100px" :rules="rules" class="demo-ruleForm">
          <el-form-item label="内容" prop="notice">
            <el-input
              type="textarea"
              autosize
              placeholder="请输入公告内容"
              v-model="normalForm.notice">
            </el-input>
          </el-form-item>
          <el-form-item label="发布位置" prop="place">
            <template>
              <el-radio v-model="place" label="0">游戏大厅</el-radio>
              <el-radio v-model="place" label="1">游戏房间</el-radio>
              <el-radio v-model="place" label="2">游戏大厅和房间</el-radio>
            </template>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="issue">发布</el-button>
            <el-button type="primary" @click.native="addFormVisible = false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>

    </el-col>
  </el-row>
</template>

<script>
  import axios from 'axios'

  export default {
    name: "History",
    data() {
      return {
        place: '1',
        normalForm: {},
        rules: {
          notice: [
            {required: true, message: '请输入公告内容', trigger: 'blur'}
          ]
        },
        list: [],
        sels: [], //列表选中列
        filters: {
          name: ''
        },
        total: 0,
        loading: false,
        addFormVisible: false,//发公告页面是否显示
      }
    },
    methods: {
      //禁用按钮
      off() {
        axios({
          method: 'post',
          url: '/api/noticectrl/updatenotice',
          headers: {
            'Content-type': 'application/x-www-form-urlencoded'
          },
        })
          .then((res) => {
            this.handleSearch()
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

      //发布公告
      issue() {
        if (this.normalForm.notice == undefined || this.normalForm.notice == "") {
          this.$message({
            showClose: true,
            message: '公告内容不能为空',
            type: 'warning'
          });
        } else {
          axios({
            method: 'post',
            url: '/api/noticectrl/addnotice',
            headers: {
              'Content-type': 'application/x-www-form-urlencoded'
            },
            params: {
              'status': '0',
              'notice': this.normalForm.notice,
              'place': this.place
            }
          })
            .then((res) => {
                this.$message({
                  showClose: true,
                  message: '发布成功',
                  type: 'success'
                });
                this.normalForm.notice = ''
                this.addFormVisible = false;//关闭弹窗
                this.handleSearch();
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

      handleCurrentChange(val) {
        this.page = val;
        this.handleSearch(this.page);
      },
      handleSearch() {
        this.loading = true;//显示加载条
        axios({//根据管理员昵称查询
          method: 'post',
          url: '/api/noticectrl/querynotice',
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
      showAddDialog: function () {
        this.addFormVisible = true;
        this.addForm = {
          name: '',
          author: '',
          publishAt: '',
          description: ''
        };
      }
    },
    mounted() { //初始化页面
      this.handleSearch()
    }
  }
</script>

<style scoped>
  .warp-main {
    margin-top: 20px;
  }
</style>
