<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>推广员中心</b></el-breadcrumb-item>
        <el-breadcrumb-item>推广员申请记录</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item label="推广员ID">
          <el-input v-model.trim="filters.nickname" @keyup.enter.native="handleSearch"></el-input>
        </el-form-item>
        <el-form-item label="推广员昵称">
          <el-input v-model.trim="filters.nickname" @keyup.enter.native="handleSearch"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="handleSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!-- 申请记录列表-->
    <el-table :data="record" highlight-current-row style="width: 100%;">
      <el-table-column type="index" width="60"></el-table-column>
      <el-table-column prop="headimgurl" label="微信头像" width="auto">
        <template slot-scope="scope">
          <img :src="scope.row.headimgurl" alt="" style="width:50px;height:50px;">
        </template>
      </el-table-column>
      <el-table-column prop="nickname" label="注册昵称" width="auto"></el-table-column>
      <el-table-column prop="createTime" label="申请时间" width="auto"></el-table-column>
      <el-table-column prop="phone" label="手机号码" width="auto"></el-table-column>
      <el-table-column prop="userName" label="姓名" width="auto"></el-table-column>
      <el-table-column prop="area" label="地区" width="auto"></el-table-column>
      <el-table-column prop="bossId" label="推荐人邀请码" width="auto"></el-table-column>
      <el-table-column prop="desc" label="备注" width="auto"></el-table-column>
      <el-table-column prop="state" label="操作" width="auto">
        <template slot-scope="scope">
          <el-button type="button" @click="operation(scope.$index,scope.row)" v-if="scope.row.state3">操作</el-button>
          <el-button type="text" v-if="scope.row.state1">已同意</el-button>
          <el-button type="text" v-if="scope.row.state2">已拒绝</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="申请记录" :visible.sync="recordDialogVisible" width="37%" center v-model="applicationRecord">
      <p>申请人：{{nickname}}</p>
      <p>手机号码：{{phone}}</p>
      <span style="margin-left:140px;">选择代理级别：</span>
      <el-select v-model="level" placeholder="请选择" style="width:115px;height:30px;">
        <el-option
          v-for="item in options"
          :key="item.type"
          :label="item.label"
          :value="item.type">
        </el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="pass()" class="agree">同意</el-button>
        <el-button type="primary" @click="unpass()">拒绝</el-button>
      </span>
    </el-dialog>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="1" :total="total"
                     style="float:right;">
      </el-pagination>
    </el-col>

  </el-row>
</template>

<script>
    import axios from 'axios'

    export default {
        name: "PromoterApplicationRecord",
        data(){
          return{
            filters:{},
            record:[],
            total:0,
            tip:{},
            frontUrl:'',
            reverseUrl:'',
            nickname:'',
            phone:'',
            idCard:'',
            recordDialogVisible:false,
            applicationRecord:{},
            AGRDAgreed:false,
            operator:true,
            level:'',
            options:[],
            typeId:''
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
              url:this.global.mPath + '/agent/queryapplyrecord',
              method:'post',
              params:{
                startTime:'',
                endTime:'',
                token:sessionStorage.getItem('token')
              }
            }).then((res) => {
                // console.log(res.data)
                this.record = res.data.data.items;
                this.total = res.data.data.pageCount;
                let number = res.data.data.totalItemsCount;
                if(number > 0){
                  let aa = document.getElementsByClassName('icon-home')[0]
                  aa.innerHTML = number;
                  aa.style.backgroundColor='#f56c6c';
                  aa.style.color='#fff';
                }
                for(let i = 0;i < this.record.length;i++){
                  this.record[i].createTime = this.dateTimeFormat(this.record[i].createTime)
                  if(this.record[i].state == 'APPLYSUCCESS'){
                    this.record[i].state1 = true;
                  }
                  if(this.record[i].state == 'APPLYFAIL'){
                    this.record[i].state2 = true;
                  }
                  if(this.record[i].state == 'APPLYING'){
                    this.record[i].state3 = true;
                  }
                }
              }
            ).catch((e) => {
            })
          },
          handleCurrentChange(val){
            this.page = val;
            this.handleSearch(this.page);
          },
          operation:function(index, row){
            this.recordDialogVisible = true;
            this.applicationRecord = Object.assign({}, row);
            this.nickname = row.nickname;
            this.phone = row.phone;
            this.idCard = row.idCard;
            axios({
              url:this.global.mPath + '/agent/queryagenttype',
              method:'post',
              params:{
                token:sessionStorage.getItem('token')
              }
            }).then((res) => {
              // console.log(res.data.data)
              this.options = res.data.data.listPage.items;
            })
          },
          pass:function(){
            axios({
              url:this.global.mPath + '/agent/applypass',
              method:'post',
              params:{
                recordId:this.applicationRecord.id,
                type:this.level,
                token:sessionStorage.getItem('token')
              }
            }).then((res) => {
              if(res.data.success){
                this.recordDialogVisible = false;
                this.handleSearch(1)
              }
            })
          },
          unpass:function(){
            axios({
              url:this.global.mPath + '/agent/applyrefuse',
              method:'post',
              params:{
                recordId:this.applicationRecord.id,
                token:sessionStorage.getItem('token')
              }
            }).then((res) => {
              // console.log(res.data)
              if(res.data.success){
                this.recordDialogVisible = false;
                this.handleSearch(1)
              }
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
            if(res.data.success == false){
              this.$router.replace('/');
            }else{
              this.handleSearch(1)
            }
          })
        }
    }
</script>

<style scoped lang="scss">
  .toolbar{
    margin-top:30px;
  }
  .el-button--primary{
    margin-left:50px;
  }
  .leftImg,
  .rightImg{
    float:left;
  }
  .rightImg{
    margin-left:72px;
  }
  .leftImg img,
  .rightImg img{
    width:200px;
    height:200px;
  }
  p{
    text-align: center;
  }
  .sure{
    margin:52px;
  }
  .agree{
    margin-left:0;
  }
  .IMG{
    overflow: hidden;
  }
</style>
