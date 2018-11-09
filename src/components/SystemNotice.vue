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
        <el-table-column prop="adminName" label="管理员名称" width="160"></el-table-column>
        <el-table-column prop="content" label="公告内容" width="300"></el-table-column>
        <el-table-column prop="place" label="发布地方" width="160"></el-table-column>
        <el-table-column prop="state" label="状态" width="100">
          <template slot-scope="scope">
            <el-button type="text" v-if="scope.row.state === 'START'">启用</el-button>
            <el-button type="text" v-if="scope.row.state === 'STOP'">禁用</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" v-if="scope.row.state === 'STOP'" @click="open(scope.$index,scope.row)">启用</el-button>
            <el-button type="info" v-if="scope.row.state === 'START'" @click="off(scope.$index,scope.row)">禁用</el-button>
            <el-button type="danger" v-if="scope.row.state === 'STOP'" @click="del(scope.$index,scope.row)">删除</el-button>
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
              <el-checkbox v-for="place in places" :label="place" :key="place" @change="handleCheckedChange(place)" :checked="false">{{place}}</el-checkbox>
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
        place:[],
        places:['游戏大厅', '游戏房间'],
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
      trim(str) {
        if(str != null){
          return str.replace(/(^\s+)|(\s+$)/g, "");
        }
      },
      //数组去重
      uniq(array){
        let temp = []; //一个新的临时数组
        for(let i = 0; i < array.length; i++){
          if(temp.indexOf(array[i]) == -1){
            temp.push(array[i]);
          }
        }
        return temp;
      },
      //点击启用按钮
      open(index, row) {
        axios({
          method: 'post',
          url: this.global.mPath + '/sysnotice/startnotice',
          headers: {
            'Content-type': 'application/x-www-form-urlencoded'
          },
          params: {
            'id': row.id,
            'token':sessionStorage.getItem('token')
          }
        }).then((res) => {
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
      //点击禁用按钮
      off(index, row) {
        axios({
          method: 'post',
          url: this.global.mPath + '/sysnotice/stopnotice',
          headers: {
            'Content-type': 'application/x-www-form-urlencoded'
          },
          params: {
            'id': row.id,
            'token':sessionStorage.getItem('token'),
          }
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
      //删除
      del(index,row){
        axios({
          method: 'post',
          url: this.global.mPath + '/sysnotice/removenotice',
          headers: {
            'Content-type': 'application/x-www-form-urlencoded'
          },
          params: {
            'id': row.id,
            'token':sessionStorage.getItem('token'),
          }
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
      handleCheckedChange(val){
        this.place.push(val)
      },
      showAddDialog: function () {
        this.addFormVisible = true;
      },
      //发布公告
      issue() {
        this.place = this.uniq(this.place);
        if (this.normalForm.notice == undefined || this.normalForm.notice == "") {
          this.$message({
            showClose: true,
            message: '公告内容不能为空',
            type: 'warning'
          });
        } else {
          axios({
            method: 'post',
            url: this.global.mPath + '/sysnotice/addnotice',
            headers: {
              'Content-type': 'application/x-www-form-urlencoded'
            },
            params: {
              'content': this.trim(this.normalForm.notice),
              'place': this.trim(this.place.toString()),
              'token':sessionStorage.getItem('token')
            }
          }).then((res) => {
                this.$message({
                  showClose: true,
                  message: '发布成功',
                  type: 'success'
                });
                this.normalForm.notice = ''
                this.place = []
                let checkbox = document.getElementsByClassName('el-checkbox__input');
                for(let i = 0;i < checkbox.length;i++){
                  checkbox[i].classList.remove("is-checked")
                }
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
                  break;
                case 500:
                  this.$message({
                    showClose: true,
                    message: '服务器异常',
                    type: 'warning'
                  });
                  this.loading = false;//隐藏加载条
                  break;
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
        // this.loading = true;//显示加载条
        axios({//根据管理员昵称查询
          method: 'post',
          url: this.global.mPath + '/sysnotice/querynotice',
          headers: {
            'Content-type': 'application/x-www-form-urlencoded'
          },
          params: {
            'size': '15',//每页数量
            'page': this.page,//当前页
            'adminName': this.trim(this.filters.adminname),
            'token':sessionStorage.getItem('token')
          }
        })
          .then((res) => {
              this.loading = false;//隐藏加载条
              this.list = res.data.data.listPage.items;
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
                break;
              case 500:
                this.$message({
                  showClose: true,
                  message: '服务器异常',
                  type: 'warning'
                });
                this.loading = false;//隐藏加载条
                break;
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
  .toolbar {
    margin-top: 20px;
  }
</style>
