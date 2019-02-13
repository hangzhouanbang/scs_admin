<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>数据统计</b></el-breadcrumb-item>
        <el-breadcrumb-item>沉默玩家统计</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="toolbar" style="margin-top:30px;">
      <div class="leftData">
        <div class="type" style="margin:10px 0;">当前沉默玩家</div>
        <div class="num">{{totalSilence}}人</div>
      </div>
      <el-form :inline="true" :model="filters" style="margin-top:10px;">
        <el-form-item label="用户ID">
          <el-input v-model.trim="filters.payerId" @keyup.enter.native="handleSearch" placeholder="请输入用户ID"></el-input>
        </el-form-item>
        <el-form-item label="用户昵称">
          <el-input v-model.trim="filters.nickName" @keyup.enter.native="handleSearch" placeholder="请输入用户昵称"></el-input>
        </el-form-item>
        <el-form-item label="在线状态">
          <el-select v-model="filters.onlineState" placeholder="请选择在线状态">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="handleSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!-- 列表-->
    <el-table :data="list" highlight-current-row style="width:100%;" id="out-table">
      <el-table-column type="index" width="auto"></el-table-column>
      <el-table-column prop="id" label="用户ID" width="auto"></el-table-column>
      <el-table-column prop="headimgurl" label="用户头像" width="auto">
        <template slot-scope="scope">
          <img :src="scope.row.headimgurl" alt="" style="width: 50px;height: 50px;">
        </template>
      </el-table-column>
      <el-table-column prop="nickname" label="用户昵称" width="auto"></el-table-column>
      <el-table-column prop="gold" label="玉石剩余量" width="auto" sortable></el-table-column>
      <el-table-column prop="score" label="礼券剩余量" width="auto" sortable></el-table-column>
      <el-table-column prop="createTime" label="注册时间" width="auto" sortable></el-table-column>
      <el-table-column prop="lastLoginTime" label="最后登录时间" width="auto" sortable></el-table-column>
      <el-table-column prop="cost" label="总消费" width="auto" sortable></el-table-column>
      <el-table-column prop="vipLevel" label="会员等级" width="auto" sortable></el-table-column>
      <el-table-column prop="vipScore" label="会员积分" width="auto" sortable></el-table-column>
      <el-table-column prop="onlineState" label="在线状态" width="auto" sortable></el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar" style="margin-top:30px;">
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="1" :total="total"
                     style="float:right;">
      </el-pagination>
    </el-col>
  </el-row>
</template>

<script>
    import axios from 'axios'
    export default {
      name: "SilentPlayerStatistics",
      data(){
        return{
          filters:{},
          state:{},
          options:[
            {value:'在线'},
            {value:'下线'},
          ],
          list:[],
          amount:'',
          page:1,
          total:0,
          totalSilence:0
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
        handleSearch(){
          if(this.filters.onlineState === '在线'){
            this.state.onlineState = 'online'
          }
          if(this.filters.onlineState === '下线'){
            this.state.onlineState = 'offline'
          }
          axios({
            method: 'post',
            url: this.global.mPath + '/datareport/silencePlayer',
            headers: {
              'Content-type': 'application/x-www-form-urlencoded'
            },
            params: {
              'page':this.page,
              'size': '10',
              'id': this.filters.payerId,
              'nickName': this.filters.nickName,
              'onlineState':this.state.onlineState,
              'token':sessionStorage.getItem('token')
            }
          }).then((res) => {
            this.list = res.data.data.listPage.items;
            this.total = res.data.data.listPage.pageCount;
            this.totalSilence = res.data.data.totalSilence;
            for(let i = 0;i < this.list.length;i++){
              this.list[i].lastLoginTime = this.dateTimeFormat(this.list[i].lastLoginTime);
              this.list[i].createTime = this.dateTimeFormat(this.list[i].createTime);
            }
          }).catch((e) => {
            if(e && e.response){
              switch (e.response.status) {
                case 504:
                  this.$message({showClose: true, message: '服务器异常', type: 'warning'});
                  break;
                case 405:
                  this.$message({showClose: true, message: '请先登录', type: 'warning'});
                  break;
              }
            }
          })
        },
        handleCurrentChange(val){
          this.page = val;
          this.handleSearch(this.page)
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
            this.handleSearch()
          }else{
            this.$router.replace('/');
          }
        })
      }
    }
</script>

<style scoped>
  .leftData{
    width:200px;
    height:80px;
    background-color: #ccc;
    text-align: center;
    font-size:20px;
    float:left;
    margin:-10px 30px 0 0;
    cursor: pointer;
  }
</style>
