<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>任务管理</b></el-breadcrumb-item>
        <el-breadcrumb-item>白名单管理</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model.trim="filters.playerId" placeholder="玩家ID" @keyup.enter.native="handleSearch(1)"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model.trim="filters.loginIp" placeholder="登录IP" @keyup.enter.native="handleSearch(1)"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="handleSearch(1)">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="showAddDialog">添加ID</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!-- 列表-->
    <el-table :data="list" highlight-current-row @selection-change="selsChange"
              style="width:100%;" id="out-table">
      <el-table-column type="selection" width="60"></el-table-column>
      <el-table-column type="index" width="60"></el-table-column>
      <el-table-column prop="nickName" label="玩家昵称" width="120"></el-table-column>
      <el-table-column prop="playerId" label="玩家ID" width="120"></el-table-column>
      <el-table-column prop="loginIp" label="登录IP" width="150"></el-table-column>
      <el-table-column prop="addTime" label="添加时间" width="160"></el-table-column>
      <el-table-column prop="remark" label="备注" width="120"></el-table-column>
      <el-table-column prop="operator" label="操作人" width="120"></el-table-column>
      <el-table-column prop="" label="操作" width="auto">
        <template slot-scope="scope">
          <el-button size="small" @click="deleteDialog(scope.$index,scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-button type="danger" @click="batchDeleteBook" :disabled="this.sels.length===0">批量删除</el-button>
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="1" :total="total"
                     style="float:right;">
      </el-pagination>
    </el-col>

    <!--添加-->
    <el-dialog title="新增白名单" :visible.sync="addFormVisible" :close-on-click-modal="false"  class="add">
      <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
        <el-form-item label="玩家ID" prop="playerId" required>
          <el-input v-model.trim="addForm.playerId" auto-complete="off" style="width:200px;"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model.trim="addForm.remark" auto-complete="off" style="width:200px;" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">确认</el-button>
      </div>
    </el-dialog>
  </el-row>
</template>

<script>
    import axios from 'axios'
    export default {
      name: "WhitelistManagement",
      data(){
        return{
          filters:{},
          list:[],
          addFormVisible:false,
          addForm:{},
          addLoading:false,
          addFormRules:{
            playerId: [
              {required: true, message: '请输入玩家ID', trigger: 'blur'}
            ]
          },
          sels:[],
          total:0
        }
      },
      methods:{
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
        handleSearch(page){
          axios({
            url:this.global.mPath + '/task/query_whitelist',
            method:'post',
            params:{
              page:page,
              size:10,
              token:sessionStorage.getItem('token'),
              playerId:this.filters.playerId,
              loginIp:this.filters.loginIp
            }
          }).then((res) => {
            // console.log(res.data.data)
            this.list = res.data.data.items;
            this.total = res.data.data.pageCount;
            for(let i = 0;i < this.list.length;i++){
              this.list[i].addTime = this.dateTimeFormat(this.list[i].addTime)
            }
          }).catch((e) => {
            if (e && e.response) {
              switch (e.response.status) {
                case 504:
                  this.$message({showClose: true, message: '服务器异常', type: 'warning'});
                  break;
                case 405:
                  this.$message({showClose: true, message: '请先登录', type: 'warning'});
                  break
              }
            }
          })
        },
        showAddDialog(){
          this.addFormVisible = true
        },
        addSubmit(){
          axios({
            method: 'post',
            url: this.global.mPath + '/task/add_whitelist',
            headers: {
              'Content-type': 'application/x-www-form-urlencoded'
            },
            params: {
              playerId:this.addForm.playerId,
              remark:this.addForm.remark,
              token:sessionStorage.getItem('token')
            }
          }).then((res) => {
            if (res.data.success) {
              this.$message({showClose: true, message: '添加成功', type: 'success'});
              this.addFormVisible = false;//关闭弹窗
              this.handleSearch(1);
            } else {
              this.$message({showClose: true, message: '添加失败', type: 'warning'});
            }
          }).catch((e) => {
            if (e && e.response) {
              switch (e.response.status) {
                case 504:
                  this.$message({showClose: true, message: '服务器异常', type: 'warning'});
                  break;
                case 405:
                  this.$message({showClose: true, message: '请先登录', type: 'warning'});
                  break
              }
            }
          })
        },
        selsChange(sels){
          this.sels = sels;
        },
        handleCurrentChange(val){
          this.handleSearch(val)
        },
        deleteDialog(index,row){
          let that = this;
          this.$confirm('确认删除该记录吗?', '提示', {type: 'warning'}).then(() => {
            that.addLoading = true;
            axios({
              method: 'post',
              url: this.global.mPath + '/task/delete_whitelist',
              headers: {
                'Content-type': 'application/x-www-form-urlencoded'
              },
              params: {
                'ids': row.id,
                'token':sessionStorage.getItem('token')
              }
            }).then((res) => {
              that.loading = false;
              if (res.data.success) {
                that.$message.success({showClose: true, message: '删除成功', duration: 1500});
                that.handleSearch();
              } else {
                that.$message.error({showClose: true, message: err.toString(), duration: 2000});
              }
            }).catch((e) => {
              that.addLoading = false;
              that.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
            })
          })
        },
        batchDeleteBook(){
          let ids = this.sels.map(item => item.id).toString();
          let that = this;
          this.$confirm('确认删除选中记录吗？', '提示', {
            type: 'warning'
          }).then(() => {
            that.loading = true;
            axios({
              method: 'post',
              url: this.global.mPath + '/task/delete_whitelist',
              headers: {
                'Content-type': 'application/x-www-form-urlencoded'
              },
              params: {
                'ids': ids,
                'token': sessionStorage.getItem('token')
              }
            }).then((res) => {
              that.addLoading = false;
              if (res.data.success) {
                that.$message.success({showClose: true, message: '删除成功', duration: 1500});
                that.handleSearch(1);
              } else {
                that.$message.error({showClose: true, message: err.toString(), duration: 2000});
              }
            }).catch((e) => {
              that.addLoading = false;
              that.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
            })
          })
        }
      },
      mounted(){
        axios({
          url:this.global.mPath + '/login/admin_info',
          method:'post',
          params:{
            token:sessionStorage.getItem('token')
          }
        }).then((res) => {
          // console.log(res.data.success)
          if(res.data.success){
            this.handleSearch(1)
          }else{
            this.$router.replace('/');
          }
        })
      }
    }
</script>

<style lang="scss">
  .add{
    .el-dialog{
      width:25%;
      .el-dialog__body{
        padding:30px 20px 0;
      }
    }
  }
  .toolbar{
    margin-top: 30px
  ;
  }
</style>
