<!--已发布任务-->
<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>任务管理</b></el-breadcrumb-item>
        <el-breadcrumb-item>已发布任务</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main" v-loading="loading" element-loading-text="拼命加载中">
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="filters">
          <el-form-item>
            <el-input v-model="filters.taskDocId" placeholder="任务ID"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.promulgator" placeholder="管理员名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-select v-model="filters.vip" placeholder="请选择发布对象" clearable>
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="filters.type" placeholder="请选择任务类型" clearable>
              <el-option
                v-for="(item,index) in data"
                :key="index"
                :label="item.label"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-button type="primary" @click="showtask">查询</el-button>
        </el-form>
      </el-col>
    </el-col>

    <!-- 任务列表-->
    <el-table :data="items" highlight-current-row @selection-change="selsChange"
              style="width: 100%;">
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="taskDocId" label="任务ID" width="120"></el-table-column>
      <el-table-column prop="promulgator" label="管理员名称" width="120"></el-table-column>
      <el-table-column prop="name" label="任务名称" width="100"></el-table-column>
      <el-table-column prop="desc" label="详细描述" width="100"></el-table-column>
      <el-table-column prop="type" label="任务类型" width="100"></el-table-column>
      <el-table-column prop="rewardGold" label="玉石（个）" width="120"></el-table-column>
      <el-table-column prop="rewardScore" label="礼券" width="100"></el-table-column>
      <el-table-column prop="rewardVip" label="会员卡（天）" width="140"></el-table-column>
      <el-table-column prop="targetNum" label="完成次数" width="100"></el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="danger" @click="deletetask(scope.$index,scope.row)" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-button type="danger" @click="deletechecktask" :disabled="this.sels.length===0">批量删除</el-button>
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="1" :total="total"
                     style="float:right;">
      </el-pagination>
    </el-col>

  </el-row>
</template>

<script>
  import axios from 'axios'

  export default {
    name: "PublishedTask",
    data() {
      return {
        options: [{
          value: null,
          label: '所有任务'
        }, {
          value: true,
          label: '会员任务'
        }, {
          value: false,
          label: '非会员任务'
        }],
        value: '',
        filters: {
          name: ''
        },
        loading: false,
        items: [],
        sels: [], //列表选中列
        total: 0,
        data: []
      }
    },
    methods: {
      trim(str) {
        if(str != null){
          return str.replace(/(^\s+)|(\s+$)/g, "");
        }
      },
      selsChange: function (sels) {
        this.sels = sels;
      },
      handleCurrentChange(val) {
        this.page = val;
        this.showtask(this.page);
      },
      //查询
      showtask() {
        axios({
          method: 'post',
          url: this.global.mPath + '/task/querytaskdocumenthistory',
          headers: {
            'Content-type': 'application/x-www-form-urlencoded'
          },
          params: {
            'size': '10',//每页数量
            'page': this.page,//当前页
            'taskDocId': this.trim(this.filters.taskDocId),
            'promulgator': this.trim(this.filters.promulgator),
            'vip': this.value,
            'token':sessionStorage.getItem('token')
          }
        })
          .then((res) => {
              this.items = res.data.data.items;
              this.total = res.data.data.pageCount;
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
      deletetask: function (index, row) {
        let that = this;
        this.$confirm('确认删除该记录吗?', '提示', {type: 'warning'}).then(() => {
          that.loading = true;
          axios({
            method: 'post',
            url: this.global.mPath + '/task/withdraw',
            headers: {
              'Content-type': 'application/x-www-form-urlencoded'
            },
            params: {
              'taskId': row.id,
              'token':sessionStorage.getItem('token')
            }
          })
            .then((res) => {
                that.loading = false;
                if (res.data.success == true) {
                  that.$message.success({showClose: true, message: '删除成功', duration: 1500});
                  that.showtask();
                } else if (res.data.success == false) {
                  that.$message.error({showClose: true, message: err.toString(), duration: 2000});
                }
              },
            ).catch((e) => {
            that.loading = false;
            console.log(error);
            that.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
          });
        });
      },

      //批量删除
      deletechecktask: function () {
        let ids = this.sels.map(item => item.id).toString();
        let that = this;
        this.$confirm('确认删除选中记录吗？', '提示', {
          type: 'warning'
        }).then(() => {
          that.loading = true;
          axios({
            method: 'post',
            url: this.global.mPath + '/task/withdraw',
            headers: {
              'Content-type': 'application/x-www-form-urlencoded'
            },
            params: {
              'taskId': ids,
              'token':sessionStorage.getItem('token')
            }
          })
            .then((res) => {
                that.loading = false;
                if (res.data.success == true) {
                  that.$message.success({showClose: true, message: '删除成功', duration: 1500});
                  this.showtask();
                } else if (res.data.success == false) {
                  that.$message.error({showClose: true, message: err.toString(), duration: 2000});
                }
              },
            ).catch((e) => {
            that.loading = false;
            console.log(error);
            that.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
          });
        });
      }
    },
    mounted() { //初始化页面
      this.showtask();
      axios({//查出所有任务类型
        method: 'post',
        url: this.global.mPath + '/task/querytasktype',
        headers: {
          'Content-type': 'application/x-www-form-urlencoded'
        },
        params:{
          'token':sessionStorage.getItem('token')
        }
      })
        .then((res) => {
            this.data = res.data.data;
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
    margin-top: 20px;
  }

  .toolbar {
    margin-top: 20px;
  }
</style>
