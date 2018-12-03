<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>推广员中心</b></el-breadcrumb-item>
        <el-breadcrumb-item>提现申请</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <div class="stay_out">待处理（{{amount}}）</div>
      <el-form :inline="true" :model="filters" style="margin-top:10px;">
        <el-form-item label="推广员ID">
          <el-input v-model="filters.agentId" @keyup.enter.native="handleSearch"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="filters.upgrade" placeholder="请选择">
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
      <el-table-column type="index" width="60"></el-table-column>
      <el-table-column prop="agentId" label="推广员ID" width="160"></el-table-column>
      <el-table-column prop="agentName" label="昵称" width="120"></el-table-column>
      <el-table-column prop="agentHeadimgurl" label="头像" width="100">
        <template slot-scope="scope">
          <img :src="scope.row.agentHeadimgurl" alt="" style="width: 50px;height: 50px;">
        </template>
      </el-table-column>
      <el-table-column prop="agentType" label="等级" width="120"></el-table-column>
      <el-table-column prop="accountingAmount" label="申请金额" width="120" sortable></el-table-column>
      <el-table-column prop="accountingTime" label="申请时间" width="120" sortable></el-table-column>
      <el-table-column prop="state" label="状态" width="160" sortable></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="small" @click="pass(scope.$index,scope.row)" v-if="scope.row.state == '待处理'">通过</el-button>
          <el-button size="small" @click="unpass(scope.$index,scope.row)" v-if="scope.row.state == '待处理'">驳回</el-button>
          <el-button size="small" @click="reason(scope.$index,scope.row)" v-if="scope.row.state == '已驳回'">查看理由</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="1" :total="total"
                     style="float:right;">
      </el-pagination>
    </el-col>

    <!--点击通过后提示-->
    <el-dialog title="" :visible.sync="passVisible" :close-on-click-modal="false" class="tip">
      <div class="content">
        <div class="title">提示</div>
        <div class="matter">是否通过提现申请？</div>
        <el-button size="small" class="anniu cancel"  @click.native="passVisible = false">取消</el-button>
        <el-button size="small" type="primary" class="anniu" @click.native="through">通过</el-button>
      </div>
    </el-dialog>

    <!--点击驳回后提示-->
    <el-dialog title="" :visible.sync="rejectVisible" :close-on-click-modal="false" class="tip">
      <div class="content">
        <div class="result">驳回理由</div>
        <el-input type="textarea" class="textarea" v-model="textarea" style="height:100px;width:258px"></el-input>
        <el-button size="small" class="anniu cancel" @click.native="rejectVisible = false">取消</el-button>
        <el-button size="small" type="primary" class="anniu" @click.native="reject">驳回</el-button>
      </div>
    </el-dialog>

    <!--查看理由-->
    <el-dialog title="" :visible.sync="checkVisible" :close-on-click-modal="false" class="tip">
      <div class="content">
        <div class="result">驳回理由</div>
        <el-input type="textarea" class="textarea" style="height:100px;" v-model="desc"></el-input>
        <el-button size="small" type="primary" class="through" @click.native="checkVisible = false">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="" :visible.sync="unpassVisible" :close-on-click-modal="false" class="tip">
      <div class="content">
        <div class="title">提示</div>
        <div class="matter">{{msg}}</div>
        <el-button size="small" type="primary" class="anniu" @click.native="unpassVisible = true" style="margin-left:123px;">确定</el-button>
      </div>
    </el-dialog>
  </el-row>
</template>

<script>
  import axios from 'axios'
  export default {
    name: "DestoonFinanceCard",
    data(){
      return{
        options:[
          {value:'待处理'},
          {value:'已通过'},
          {value:'已驳回'},
        ],
        filters:{},
        filters1:{},
        list:[],
        passVisible:false,
        rejectVisible:false,
        checkVisible:false,
        unpassVisible:false,
        amount:'',
        id:'',
        textarea:'',
        desc:'',
        msg:'',
        total:0,
        page:''
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
        if(this.filters.upgrade == '待处理'){
          this.filters1.upgrade = 'APPLYING'
        }
        if(this.filters.upgrade == '已通过'){
          this.filters1.upgrade = 'SUCCESS'
        }
        if(this.filters.upgrade == '已驳回'){
          this.filters1.upgrade = 'FAIL'
        }
        axios({
          method: 'post',
          url: this.global.mPath + '/agent/queryagentrewardapply',
          headers: {
            'Content-type': 'application/x-www-form-urlencoded'
          },
          params: {
            'agentId':this.filters.agentId,
            'state':this.filters1.upgrade,
            'token':sessionStorage.getItem('token'),
            'page':page,
            'size':10
          }
        })
          .then((res) => {
              this.loading = false;//隐藏加载条
              console.log(res.data.data)
              this.amount = res.data.data.amount;
              this.list = res.data.data.listPage.items;
              this.total = res.data.data.listPage.pageCount;
              for(let i = 0;i < this.list.length;i++){
                this.list[i].accountingTime = this.dateTimeFormat(this.list[i].accountingTime)
                if(this.list[i].state == 'APPLYING'){
                  this.list[i].state = '待处理'
                }
                if(this.list[i].state == 'SUCCESS'){
                  this.list[i].state = '已通过'
                }
                if(this.list[i].state == 'FAIL'){
                  this.list[i].state = '已驳回'
                }
              }
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
      handleCurrentChange(val){
        this.page = val
        this.handleSearch(this.page)
      },
      pass:function (index,row) {
        this.passVisible = true;
        this.id = row.id
      },
      through:function(){
        axios({
          method: 'post',
          url: this.global.mPath + '/agent/rewardapplypass',
          headers: {
            'Content-type': 'application/x-www-form-urlencoded'
          },
          params: {
            'recordId':this.id,
            'token': sessionStorage.getItem('token')
          }
        }).then((res) => {
          this.loading = false;
          this.msg = res.data.msg
          if (res.data.success == true) {
            this.passVisible = false;//关闭弹窗
            this.handleSearch(this.page)
          } else {
            this.unpassVisible = true;
            that.$message.error({showClose: true, message: err.toString(), duration: 2000});
          }
        }).catch((e) => {
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
                break;
              case 400:
                this.$message({
                  showClose: true,
                  message: '请按要求输入',
                  type: 'warning'
                });
                break;
            }
          }
        })
      },
      unpass:function(index,row){
        this.rejectVisible = true;
        this.id = row.id
      },
      reject:function(){
        axios({
          method: 'post',
          url: this.global.mPath + '/agent/rewardapplyrefuse',
          headers: {
            'Content-type': 'application/x-www-form-urlencoded'
          },
          params: {
            'recordId':this.id,
            'token': sessionStorage.getItem('token'),
            'desc':this.textarea
          }
        }).then((res) => {
          this.loading = false;
          console.log(res.data)
          if (res.data.success == true) {
            // that.$message.success({showClose: true, message: '赠送成功', duration: 1500});
            this.rejectVisible = false;//关闭弹窗
            this.handleSearch(this.page)
          } else {
            that.$message.error({showClose: true, message: err.toString(), duration: 2000});
          }
        }).catch((e) => {
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
                break;
              case 400:
                this.$message({
                  showClose: true,
                  message: '请按要求输入',
                  type: 'warning'
                });
                break;
            }
          }
        })
      },
      reason:function(index,row){
        this.checkVisible = true;
        this.desc = row.desc;
      }
    },
    mounted(){
      this.handleSearch(1)
    }
  }
</script>

<style lang="scss">
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
    margin:-10px 30px 0 0;
    cursor: pointer;
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
  .tip{
    .el-dialog{
      width:25%;
    }
  }
  .textarea{
    margin:0 20px;
    width:260px;
    height:100px;
    .el-textarea__inner {
      height: 100px;
      width:260px;
    }
  }

</style>
