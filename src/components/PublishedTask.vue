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
            <el-input v-model="filters.id" placeholder="任务ID"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.nickname" placeholder="管理员名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-select v-model="value" placeholder="请选择身份">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-button type="primary" @click="showtask">查询</el-button>
        </el-form>
      </el-col>
    </el-col>

    <!-- 任务列表-->
    <el-table :data="task" highlight-current-row @selection-change="selsChange"
              style="width: 100%;">
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="id" label="管理员名称" width="140" sortable></el-table-column>
      <el-table-column prop="nickname" label="任务名称" width="100" sortable></el-table-column>
      <el-table-column prop="gender" label="详细描述" width="160" sortable></el-table-column>
      <el-table-column prop="phone" label="任务类型" width="100" sortable></el-table-column>
      <el-table-column prop="createTime" label="奖励类型" width="100" sortable></el-table-column>
      <el-table-column prop="createTime" label="奖励数量" width="100" sortable></el-table-column>
      <el-table-column prop="createTime" label="完成次数" width="100" sortable></el-table-column>
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
          value: '选项1',
          label: '所有任务'
        }, {
          value: '选项2',
          label: '会员任务'
        }, {
          value: '选项3',
          label: '非会员任务'
        }],
        value: '',
        filters: {
          name: ''
        },
        loading: false,
        task: [],
        sels: [], //列表选中列
        total: 0,
      }
    },
    methods: {
      selsChange: function (sels) {
        this.sels = sels;
      },
      handleCurrentChange(val) {
        this.page = val;
        this.handleSearch(this.page);
      },
      //查询
      showtask() {

      },

      //删除
      deletetask: function (index, row) {
        let that = this;
        this.$confirm('确认删除该记录吗?', '提示', {type: 'warning'}).then(() => {
          that.loading = true;
          axios({
            method: 'post',
            url: '/api/',
            headers: {
              'Content-type': 'application/x-www-form-urlencoded'
            },
            params: {
              'id': row.id
            }
          })
            .then((res) => {
                that.loading = false;
                if (res.data == 'success') {
                  that.$message.success({showClose: true, message: '删除成功', duration: 1500});
                  that.showtask();
                } else {
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
            url: '/api/',
            headers: {
              'Content-type': 'application/x-www-form-urlencoded'
            },
            params: {
              'id': ids
            }
          })
            .then((res) => {
                that.loading = false;
                if (res.data == 'success') {
                  that.$message.success({showClose: true, message: '删除成功', duration: 1500});
                  that.showtask();
                } else {
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
    }
  }
</script>

<style scoped>
  .warp-main {
    margin-top: 20px;
  }
  .toolbar {
    margin-top: 20px;
  }
</style>
