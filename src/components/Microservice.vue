<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>系统设置</b></el-breadcrumb-item>
        <el-breadcrumb-item>微服务</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <!-- 微服务列表-->
    <el-table :data="list" highlight-current-row @selection-change="selsChange"
              style="width: 100%;" class="warp-main">
      <el-table-column type="index" width="60"></el-table-column>
      <el-table-column prop="name" label="微服务名称" width="160"></el-table-column>
      <el-table-column prop="state" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" @click="save(scope.$index,scope.row)">微服务快照保存</el-button>
        </template>
      </el-table-column>
    </el-table>

  </el-row>
</template>

<script>
  import axios from 'axios'

  export default {
    name: "Microservice",
    data() {
      return {
        list: [
          {name: '会员中心'},
          {name: '游戏大厅'},
          {name: '任务中心'}
        ],
        sels: [], //列表选中列
      }
    },
    methods: {
      selsChange: function (sels) {
        this.sels = sels;
      },
      //微服务快照保存
      save: function (index, row) {
        let that = this;
        this.$confirm('确认保存吗?', '提示', {type: 'warning'}).then(() => {
          that.$message.success({showClose: true, message: '保存成功' + this.list[index].name, duration: 1500});


          /*that.loading = true;
          axios({
            method: 'post',
            url: this.global.mPath + '/',
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
                  that.$message.success({showClose: true, message: '保存成功', duration: 1500});
                } else {
                  that.$message.error({showClose: true, message: res.toString(), duration: 2000});
                }
              },
            ).catch((e) => {
            that.loading = false;
            console.log(error);
            that.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
          });*/
        });
      },
    }
  }
</script>

<style scoped>
  .warp-main {
    margin-top: 30px;
  }
</style>
