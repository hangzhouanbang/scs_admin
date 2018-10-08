<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>推广员中心</b></el-breadcrumb-item>
        <el-breadcrumb-item>推广员管理</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item label="推广员ID">
          <el-input v-model="filters.nickname" @keyup.enter.native="handleSearch"></el-input>
        </el-form-item>
        <el-form-item label="推广员昵称">
          <el-input v-model="filters.nickname" @keyup.enter.native="handleSearch"></el-input>
        </el-form-item>
        <el-form-item label="手机号码">
          <el-input v-model="filters.nickname" @keyup.enter.native="handleSearch"></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="filters.nickname" @keyup.enter.native="handleSearch"></el-input>
        </el-form-item>
        <el-form-item label="注册时间" label-width="68px">
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
        <el-form-item label="推广员等级" label-width="83px">
          <el-select v-model="filters.mailType" placeholder="请选择">
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

    <!-- 推广员管理列表-->
    <el-table :data="record" highlight-current-row style="width: 100%;">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column type="index" width="60"></el-table-column>
      <el-table-column prop="id" label="推广员ID" width="auto" sortable></el-table-column>
      <el-table-column prop="nickname" label="推广员昵称" width="auto" sortable></el-table-column>
      <el-table-column prop="level" label="推广员等级" width="auto" sortable></el-table-column>
      <el-table-column prop="createTime" label="注册时间" width="auto" sortable></el-table-column>
      <el-table-column prop="bossId" label="上级推广员ID" width="auto" sortable></el-table-column>
      <el-table-column prop="bossName" label="上级推广员昵称" width="auto" sortable></el-table-column>
      <el-table-column prop="phone" label="手机号码" width="auto" sortable></el-table-column>
      <el-table-column prop="userName" label="姓名" width="auto" sortable></el-table-column>
      <el-table-column label="状态" prop="state" sortable></el-table-column>
      <el-table-column prop="systemMail.createtime" label="操作" width="auto" sortable>
        <template slot-scope="scope">
          <el-button type="text" @click="particulars(scope.$index,scope.row)">详情</el-button>
          <el-button type="text" @click="operation(scope.$index,scope.row)">操作</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--详情-->
    <el-dialog title="" :visible.sync="centerDialogVisible" :close-on-click-modal="false">
      <el-table :data="roles" style="width: 100%;">
        <el-table-column label="头像">
          <template slot-scope="scope">
            <img :src="scope.row.headimgurl" alt="" class="pic">
          </template>
        </el-table-column>
        <el-table-column label="昵称" prop="nickname" sortable></el-table-column>
        <el-table-column label="ID" prop="id" sortable></el-table-column>
        <el-table-column label="性别" prop="gender" sortable></el-table-column>
        <el-table-column label="状态" prop="state" sortable></el-table-column>
        <el-table-column label="注册时间" prop="createTime" sortable></el-table-column>
      </el-table>
      <el-table :data="roles" style="width: 100%;">
        <el-table-column label="推广员等级" prop="level" sortable></el-table-column>
        <el-table-column label="周卡剩余" prop="clubCardZhou" sortable></el-table-column>
        <el-table-column label="月卡剩余" prop="clubCardYue" sortable></el-table-column>
        <el-table-column label="季卡剩余" prop="clubCardJi" sortable></el-table-column>
        <el-table-column label="充值金额" prop="cost" sortable></el-table-column>
        <el-table-column label="邀请码" prop="invitationCode" sortable></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <router-link :to="{path:'/membershipCardPurchaseRecord'}">
          <el-button>会员卡购买记录</el-button>
        </router-link>
        <router-link :to="{path:'/membershipCardConsumptionRecord'}">
          <el-button>会员卡兑换记录</el-button>
        </router-link>
        <el-button @click.native="CancelSubmit">取消推广员资格</el-button>
        <el-button @click.native="relieveSubmit" v-if="state === '封禁'">解除封停状态</el-button>
      </div>
    </el-dialog>
    <!--操作-->
    <el-dialog title="" :visible.sync="operateVisible" :close-on-click-modal="false">
      <div class="left">
        <el-button class="bound" type="primary" @click="pinless()">绑定</el-button><br>
        <el-button class="levelup" @click="levelup()">调整等级</el-button>
      </div>
      <el-form ref="form" :model="form" label-width="100px" class="form" v-if="boundVisible">
        <el-form-item label="上级推广员ID">
          <el-input v-model="form.bossId1"></el-input>
        </el-form-item>
        <el-form-item label="推广员ID">
          <el-input v-model="form.id"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="bound()">绑定</el-button>
          <el-button @click="unbound()">解除绑定</el-button>
        </el-form-item>
      </el-form>
      <el-form ref="form" :model="form" label-width="100px" class="form" v-if="LevelUpVisible">
        <el-form-item label="推广员ID">
          <el-input v-model="form.id"></el-input>
        </el-form-item>
        <el-form-item label="当前等级">
          <el-input v-model="form.level"></el-input>
        </el-form-item>
        <el-form-item label="调整等级">
          <el-select v-model="form.upgrade" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="makeSure()">确认修改</el-button>
        </el-form-item>
      </el-form>
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
        name: "PromoterManagement",
        data(){
          return{
            filters:{},
            record:[],
            form:{},
            roles:[],
            total:0,
            upgrade:'',
            options: [
              {value: '一级推广员'},
              {value: '二级推广员'}
            ],
            centerDialogVisible:false,
            relieveDialogVisible:false,
            LevelUpVisible:false,
            boundVisible:false,
            operateVisible:false,
            disqualifyDialogVisible:true,
            unlockingDialogVisible:false,
            state:''
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
            url:this.global.mPath + '/agent/queryagent',
            method:'post',
            params:{
              nickname:this.filters.mailType,
              page:page,
              size:10,
              token:sessionStorage.getItem('token')
            }
          }).then((res) => {
              console.log(res.data)
              this.record = res.data.data.items;
              this.total = res.data.data.pageCount;
              for(let i = 0;i < this.record.length;i++){
                this.record[i].createTime = this.dateTimeFormat(this.record[i].createTime)
                if(this.record[i].level == 1){
                  this.record[i].level = '一级推广员';
                  this.record[i].bossId1 = this.record[i].id;
                }
                if(this.record[i].level == 2){
                  this.record[i].level = '二级推广员';
                  this.record[i].bossId1 = this.record[i].bossId;
                }
              }
            }
          ).catch((e) => {
            this.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
          })
        },
        //详情
        particulars:function(index,row){
          this.centerDialogVisible = true;
          // console.log(row)
          axios({
            url:this.global.mPath + '/agent/agentdetail',
            method:'post',
            params:{
              agentId:row.id,
              token:sessionStorage.getItem('token')
            }
          }).then((res) => {
              console.log(res.data)
              row.clubCardYue = res.data.data.clubCardYue;
              row.clubCardJi = res.data.data.clubCardJi;
              row.clubCardZhou = res.data.data.clubCardZhou;
              row.score = res.data.data.score;
              this.roles = [Object.assign({}, row)];
              this.state = res.data.data.agent.state;
          }).catch((e) => {
              this.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
          })
        },
        //操作
        operation:function(index,row){
          this.operateVisible = true;
          this.boundVisible = true;
          this.LevelUpVisible = false;
          this.form = Object.assign({}, row);
        },
        //绑定
        bound:function(){
          axios({
            url:this.global.mPath + '/agent/setboss',
            method:'post',
            params:{
              agentId:this.form.id,
              bossId:this.form.bossId,
              token:sessionStorage.getItem('token')
            }
          }).then((res) => {
            console.log(res.data)
            if(res.data.success){
              this.$message.success({showClose: true, message: '绑定成功', duration: 1500});
              this.operateVisible = false;
              this.handleSearch(1)
            }else{
              this.$message.error({showClose: true, message: err.toString(), duration: 2000});
            }
          }).catch((e) => {
            this.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
          })
        },
        //解除绑定
        unbound:function(){
          axios({
            url:this.global.mPath + '/agent/removeboss',
            method:'post',
            params:{
              agentId:this.form.id,
              token:sessionStorage.getItem('token')
            }
          }).then((res) => {
            console.log(res.data)
            if(res.data.success){
              this.$message.success({showClose: true, message: '解除绑定成功', duration: 1500});
              this.operateVisible = false;
              this.handleSearch(1)
            }else{
              this.$message.error({showClose: true, message: err.toString(), duration: 2000});
            }
          }).catch((e) => {
            this.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
          })
        },
        //绑定按钮
        pinless:function(){
          this.LevelUpVisible = false;
          this.boundVisible = true;
        },
        //调整等级
        levelup:function(){
          this.LevelUpVisible = true;
          this.boundVisible = false;
        },
        //确认修改
        makeSure:function(){
          if(this.form.upgrade == '一级推广员'){
            this.upgrade = 1;
          }
          if(this.form.upgrade == '二级推广员'){
            this.upgrade = 2;
          }
          axios({
            url:this.global.mPath + '/agent/setlevel',
            method:'post',
            params:{
              agentId:this.form.id,
              level:this.upgrade,
              token:sessionStorage.getItem('token')
            }
          }).then((res) => {
            console.log(res.data)
            if(res.data.success){
              this.$message.success({showClose: true, message: '等级修改成功', duration: 1500});
              this.operateVisible = false;
              // this.relieveDialogVisible = false;
              this.handleSearch(1)
            }else{
              this.$message.error({showClose: true, message: err.toString(), duration: 2000});
            }
          }).catch((e) => {
            this.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
          })
        },
        CancelSubmit:function(){
          axios({
            url:this.global.mPath + '/agent/ban',
            method:'post',
            params:{
              agentId:this.roles[0].id,
              token:sessionStorage.getItem('token')
            }
          }).then((res) => {
            console.log(res.data)
            if(res.data.success){
              this.unlockingDialogVisible = true;
              this.disqualifyDialogVisible = false;
              this.roles[0].state = res.data.data
              this.state = '封禁'
              this.handleSearch(1)
            }else{
              this.$message.error({showClose: true, message: err.toString(), duration: 2000});
            }
          }).catch((e) => {
            this.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
          })
        },
        relieveSubmit:function(){
          axios({
            url:this.global.mPath + '/agent/liberate',
            method:'post',
            params:{
              agentId:this.roles[0].id,
              token:sessionStorage.getItem('token')
            }
          }).then((res) => {
            console.log(res.data)
            if(res.data.success){
              this.unlockingDialogVisible = false;
              this.disqualifyDialogVisible = true;
              this.roles[0].state = res.data.data
              this.state = '正常'
              this.handleSearch(1)
            }else{
              this.$message.error({showClose: true, message: err.toString(), duration: 2000});
            }
          }).catch((e) => {
            this.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
          })
        },
        handleCurrentChange:function(){}
      },
      mounted(){
          this.handleSearch(1);
      }
    }
</script>

<style scoped>
  .toolbar{
    margin-top:30px;
  }
  .img{
    float:left;
    margin-right:60px;
  }
  .left,
  .form{
    display:inline-block;
  }
  .left{
    position: absolute;
    top:60px;
  }
  .form{
    margin-left:140px;
  }
  .bound,
  .levelup{
    width:100px;
  }
  .levelup{
    margin-top:20px;
  }
  a{
    text-decoration: none;
    color:#fff;
  }
  .pic{
    width:50px;
    height:50px;
  }
</style>
