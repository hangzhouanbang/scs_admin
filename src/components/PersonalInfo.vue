<template>
  <el-row class="warp" style="margin:30px 0 0 50px;">
    <!-- 列表-->
    <el-table :data="items" highlight-current-row
              style="width: 30%;" id="out-table">
      <el-table-column prop="nickname" label="账号" width="120"></el-table-column>
      <el-table-column label="当前角色" width="auto">
        <template slot-scope="scope">
          <ul style="margin-left:-26px;">
            <li v-for="roles in scope.row.roleList">{{roles.role}}</li>
          </ul>
        </template>
      </el-table-column>
      <!--<el-table-column prop="transaction_id" label="当前角色" width="auto"></el-table-column>-->
    </el-table>

    <el-form :inline="true" :model="filters" style="margin-top:50px;">
      <el-form-item label="原密码" label-width="68px">
        <el-input v-model.trim="filters.oldPass" @keyup.enter.native="handleSearch()" style="width:220px;" placeholder="请输入原密码" type="password"></el-input>
      </el-form-item>
      <br>
      <el-form-item label="新密码" label-width="68px">
        <el-input v-model.trim="filters.newPass" @keyup.enter.native="handleSearch()" style="width:220px;" placeholder="请输入新密码" type="password"></el-input>
      </el-form-item>
      <br>
      <br>
      <el-form-item>
        <el-button type="primary" v-on:click="handleSearch()" style="margin-left:80px;">提交</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="">取消</el-button>
      </el-form-item>
    </el-form>
  </el-row>
</template>

<script>
  import axios from 'axios'
    export default {
        name: "PersonalInfo",
        data(){
          return{
            filters:{},
            items:[]
          }
        },
      methods:{
        handleSearch() {
          axios({//根据昵称查询
            method: 'post',
            url: this.global.mPath + '/login/admin_info',
            headers: {
              'Content-type': 'application/x-www-form-urlencoded'
            },
            params: {
              'token':sessionStorage.getItem('token')
            }
          })
            .then((res) => {
                this.items = res.data.data.admin;
              },
            ).catch((e) => {
            if (e && e.response) {
              switch (e.response.status) {
                case 504:
                  this.$message({showClose: true, message: '服务器异常', type: 'warning'});
                  break
                case 405:
                  this.$message({showClose: true, message: '请先登录', type: 'warning'});
                  break
              }
            }
          });
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
          if(res.data.success == false){
            this.$router.replace('/');
          }else{
            this.handleSearch()
          }
        })
      }
    }
</script>

<style scoped>

</style>
