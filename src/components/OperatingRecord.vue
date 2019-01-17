<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>会员中心</b></el-breadcrumb-item>
        <el-breadcrumb-item>操作记录</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main" v-loading="loading" element-loading-text="拼命加载中">
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="margin-top:30px;">
        <el-form :inline="true" :model="filters">
          <el-form-item label="用户ID">
            <el-input v-model.trim="filters.memberId" @keyup.enter.native="handleSearch"></el-input>
          </el-form-item>
          <el-form-item label="类型">
            <el-select v-model="filters.type" clearable placeholder="请选择">
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
    </el-col>

    <!-- 操作记录列表-->
    <el-table :data="list" highlight-current-row @selection-change="selsChange"
              style="width: 100%;">
      <el-table-column type="index" width="60"></el-table-column>
      <el-table-column prop="memberId" label="用户ID" width="120"></el-table-column>
      <el-table-column prop="memberName" label="用户昵称" width="200"></el-table-column>
      <el-table-column prop="desc" label="操作类型" width="160"></el-table-column>
      <el-table-column prop="param" label="赠送数量" width="100"></el-table-column>
      <el-table-column prop="operationTime" label="操作时间" width="160"></el-table-column>
      <el-table-column prop="operator" label="操作人"></el-table-column>
    </el-table>

    <el-col :span="24" class="toolbars">
      <el-pagination layout="prev, pager, next" @current-change="ChangePage" :page-size="1" :total="total"
                     style="float:right;">
      </el-pagination>
    </el-col>
  </el-row>
</template>

<script>
    import axios from 'axios'
    export default {
        name: "OperatingRecord",
        data(){
          return{
            filters:{},
            options:[
              {value:'赠送玉石'},
              {value:'赠送礼券'},
              {value:'赠送会员卡'},
            ],
            list:[],
            total:0,
            page:1,
            sels:[],
            loading:false
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
            this.loading = true;//显示加载条
            axios({//根据会员昵称查询
              method: 'post',
              url: this.global.mPath + '/member/queryoperation',
              headers: {
                'Content-type': 'application/x-www-form-urlencoded'
              },
              params: {
                'size': '15',//每页数量
                'page':this.page,//当前页
                'token':sessionStorage.getItem('token'),
                'memberId':this.filters.memberId,
                'desc':this.filters.type,
              }
            })
              .then((res) => {
                  this.loading = false;//隐藏加载条
                  this.list = res.data.data.items;
                  this.total = res.data.data.pageCount;
                  for(let i = 0;i < this.list.length;i++){
                    this.list[i].operationTime = this.dateTimeFormat(this.list[i].operationTime)
                  }
                },
              ).catch((e) => {
              if (e && e.response) {
                switch (e.response.status) {
                  case 504:
                    this.$message({showClose: true, message: '服务器异常', type: 'warning'});
                    this.loading = false;//隐藏加载条
                    break;
                  case 500:
                    this.$message({showClose: true, message: '服务器异常', type: 'warning'});
                    this.loading = false;//隐藏加载条
                    break;
                  case 405:
                    this.$message({showClose: true, message: '请先登录', type: 'warning'});
                    break
                }
              }
            });
          },
          ChangePage(val){
            this.page = val;
            this.handleSearch(this.page)
          },
          selsChange(sels){
            this.sels = sels;
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
