<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>签到管理</b></el-breadcrumb-item>
        <el-breadcrumb-item>兑换记录</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <div class="stay_out">待发放（{{amount}}）</div>
      <el-form :inline="true" :model="filters">
        <el-form-item label="游戏ID">
          <el-input v-model.trim="filters.memberId" @keyup.enter.native="handleSearch(1)"></el-input>
        </el-form-item>
        <el-form-item label="游戏昵称">
          <el-input v-model.trim="filters.nickname" @keyup.enter.native="handleSearch(1)"></el-input>
        </el-form-item>
        <el-form-item label="手机号码">
          <el-input v-model.trim="filters.telephone" @keyup.enter.native="handleSearch(1)"></el-input>
        </el-form-item>
        <br>
        <el-form-item label="时间">
          <el-date-picker
            v-model="filters.startTime"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="至" label-width="68px" style="margin-left:-44px;">
          <el-date-picker
            v-model="filters.endTime"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="handleSearch(1)">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!-- 中奖记录列表-->
    <el-table :data="list" highlight-current-row style="width:100%;" id="out-table">
      <el-table-column type="index" width="60" label="序号"></el-table-column>
      <el-table-column prop="memberId" label="游戏ID" width="160"></el-table-column>
      <el-table-column prop="nickName" label="昵称" width="120"></el-table-column>
      <el-table-column prop="lotteryName" label="兑换物品" width="120"></el-table-column>
      <el-table-column prop="singleNum" label="兑换数量" width="120" sortable></el-table-column>
      <el-table-column prop="singleNum" label="联系人" width="120" sortable></el-table-column>
      <el-table-column prop="telephone" label="联系电话" width="120" sortable></el-table-column>
      <el-table-column prop="address" label="收件地址" width="160" sortable></el-table-column>
      <el-table-column prop="exchangeTime" label="兑奖时间" width="120" sortable></el-table-column>
      <el-table-column prop="distributeTime" label="发放时间" width="120" sortable></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="small" @click="grant(scope.$index,scope.row)" v-if="scope.row.hasExchange == false">发放</el-button>
          <el-button size="small" type='text' v-if="scope.row.hasExchange == true">已发放</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--发放-->
    <el-dialog title="" :visible.sync="passVisible" :close-on-click-modal="false" class="tip">
      <div class="content">
        <div class="title">提示</div>
        <div class="matter">是否确认发放？</div>
        <el-button size="small" class="anniu cancel"  @click.native="passVisible = false">取消</el-button>
        <el-button size="small" type="primary" class="anniu" @click.native="through">确定</el-button>
      </div>
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
      name: "Record",
      data(){
        return{
          options:[
            {value:'红包'},
            {value:'会员'},
            {value:'玉石'},
          ],
          filters:{},
          list:[],
          state:{},
          total:0,
          amount:0,
          passVisible:false,
          id:''
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
          if(this.filters.startTime){
            let date = new Date(this.filters.startTime);
            this.state.startTime = date.getTime();
          }else{
            this.state.startTime = ''
          }
          if(this.filters.endTime){
            let date = new Date(this.filters.endTime);
            this.state.endTime = date.getTime();
          }else{
            this.state.endTime = ''
          }
          if(this.filters.startTime &&
            this.filters.endTime &&
            this.state.endTime - this.state.startTime < 0){
            return;
          }
          axios({
            url:this.global.mPath + '/signin/queryexchangeentity',
            method:'post',
            params:{
              page:page,
              size:10,
              token:sessionStorage.getItem('token'),
              memberId:this.filters.memberId,
              nickname:this.filters.nickname,
              telephone :this.filters.telephone ,
              startTime:this.state.startTime,
              endTime:this.state.endTime,
            }
          }).then((res) => {
            // console.log(res.data.data.list)
            this.list = res.data.data.list;
            this.total = res.data.data.count / 10;
            for(let i = 0;i < this.list.length;i++){
              this.list[i].exchangeTime = this.dateTimeFormat(this.list[i].exchangeTime);
              this.list[i].distributeTime = this.dateTimeFormat(this.list[i].distributeTime)
            }
          }).catch((e) => {
            this.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
          })
        },
        grant(index,row){
          this.passVisible = true;
          this.id = row.id
        },
        through(){
          axios({
            url:this.global.mPath + '/signin/sendoutgood',
            method:'post',
            params:{
              id:this.id,
              send:true,
              token:sessionStorage.getItem('token')
            }
          }).then((res) => {
            // console.log(res.data)
            if(res.data.success){
              this.passVisible = false;
              this.handleSearch(1)
            }
          })
        },
        handleCurrentChange(val){
          this.page = val;
          this.handleSearch(this.page)
        },
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
            this.handleSearch(1);
            axios({
              url:this.global.mPath + '/signin/querypendingreward',
              method:'post',
              params:{
                token:sessionStorage.getItem('token')
              }
            }).then((res) => {
              // console.log(res.data.data)
              this.amount = res.data.data
            })
          }else{
            this.$router.replace('/');
          }
        })
      }
    }
</script>

<style scoped lang="scss">
  .toolbar{
    margin-top:30px;
    float:left;
  }
  .stay_out{
    width:200px;
    height:80px;
    background-color: #ccc;
    text-align: center;
    line-height:80px;
    font-size:30px;
    float:left;
    margin:11px 30px 0 0;
    cursor: pointer;
  }
  .tip{
    .el-dialog{
      width:25%;
    }
  }
  .content{
    width:300px;
    height:200px;
    border:1px solid #000;
    border-radius: 5px;
    margin:0 auto;
    .title{
      text-align: center;
      height:50px;
      line-height: 50px;
      border-bottom:1px solid #000;
      font-weight:bold;
      font-size:20px;
    }
    .matter{
      height: 50px;
      border-bottom: 1px solid #000;
      text-align: center;
      font-size: 18px;
      padding: 25px;
    }
    .anniu{
      margin-top:8px;
    }
    .cancel{
      margin-left:90px;
    }
    .result{
      height:50px;
      line-height:50px;
      font-size:18px;
      margin-left:20px;
    }
    .through{
      margin:10px 0 0 120px;
    }
  }
</style>
