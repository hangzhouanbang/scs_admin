<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>会员中心</b></el-breadcrumb-item>
        <el-breadcrumb-item>会员权益</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
    <el-select v-model="value8" filterable placeholder="请选择" class="choice" @change="change(value8)">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    <!--普通用户-->
    <el-form :model="normalForm" :rules="rules" ref="normalForm" label-width="250px" class="demo-ruleForm" v-show="normalshow">
      <el-form-item label="新用户注册赠送的玉石数量" prop="goldForNewNember ">
        <el-input v-model.trim="normalForm.goldForNewNember "></el-input>
      </el-form-item>
      <el-form-item label="签到得玉石数量" prop="signGoldNumber ">
        <el-input v-model.trim="normalForm.signGoldNumber "></el-input>
      </el-form-item>
      <el-form-item label="邀请得礼券数量" prop="inviteIntegralNumber">
        <el-input v-model.trim="normalForm.inviteIntegralNumber"></el-input>
      </el-form-item>
      <el-form-item label="礼券增长速度" prop="planGrowIntegralSpeed">
        <el-input v-model.trim="normalForm.planGrowIntegralSpeed"></el-input>
      </el-form-item>
      <el-form-item label="创建会员玩法房间的玉石价格" prop="planMemberCreateRoomDailyGoldPrice">
        <el-input v-model.trim="normalForm.planMemberCreateRoomDailyGoldPrice"></el-input>
      </el-form-item>
      <el-form-item label="加入会员玩法房间的玉石价格" prop="planMemberaddRoomDailyGoldPrice">
        <el-input v-model.trim="normalForm.planMemberaddRoomDailyGoldPrice"></el-input>
      </el-form-item>
      <el-form-item label="加入会员玩法每天可开的房间数量" prop="planMemberMaxCreateRoomDaily">
        <el-input v-model.trim="normalForm.planMemberMaxCreateRoomDaily"></el-input>
      </el-form-item>
      <el-form-item label="保存房间数量" prop="planMemberRoomsCount">
        <el-input v-model.trim="normalForm.planMemberRoomsCount"></el-input>
      </el-form-item>
      <el-form-item label="房间存活小时数" prop="planMemberRoomsAliveHours">
        <el-input v-model.trim="normalForm.planMemberRoomsAliveHours"></el-input>
      </el-form-item>
      <el-form-item label="绑定邀请码后赠送玉石数" prop="goldForAgentInvite">
        <el-input v-model.trim="normalForm.goldForAgentInvite"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('normalForm')">立即设置</el-button>
        <el-button @click="change('普通用户')">重置</el-button>
      </el-form-item>
    </el-form>
    <!--会员用户-->
    <el-form :model="memberForm" :rules="rules" ref="memberForm" label-width="150px" class="demo-ruleForm" v-show="membershow">
      <el-form-item label="签到得玉石数量" prop="signGoldNumber ">
        <el-input v-model.trim="memberForm.signGoldNumber "></el-input>
      </el-form-item>
      <el-form-item label="邀请得礼券数量" prop="inviteIntegralNumber">
        <el-input v-model.trim="memberForm.inviteIntegralNumber"></el-input>
      </el-form-item>
      <el-form-item label="礼券增长速度" prop="vipGrowIntegralSpeed">
        <el-input v-model.trim="memberForm.vipGrowIntegralSpeed"></el-input>
      </el-form-item>
      <el-form-item label="等级增长速度" prop="vipGrowGradeSpeed">
        <el-input v-model.trim="memberForm.vipGrowGradeSpeed"></el-input>
      </el-form-item>
      <el-form-item label="保存房间数量" prop="vipMemberRoomsCount">
        <el-input v-model.trim="memberForm.vipMemberRoomsCount"></el-input>
      </el-form-item>
      <el-form-item label="房间存活小时数" prop="vipMemberRoomsAliveHours">
        <el-input v-model.trim="memberForm.vipMemberRoomsAliveHours"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitmemberForm()">立即设置</el-button>
        <el-button @click="change('会员用户')">重置</el-button>
      </el-form-item>
    </el-form>
   </el-row>
</template>

<script>
  import axios from 'axios'
    export default {
        name: "MemberRules",
      data() {
        return {
          normalshow:false,
          membershow:false,
          memberDisplay:false,
          options: [{
            value: '普通用户',
            label: '普通用户'
          }, {
            value: '会员用户',
            label: '会员用户'
          }],
          card: [{
            value:'选项1',
            label:'周卡'
          },{
            value:'选项2',
            label:'月卡'
          },{
            value:'选项3',
            label:'季卡'
          }],
          value8: '',
          value:'',
          normalForm: {},
          memberForm: {},
          rules: {
            newnumber: [
              {required: true, message: '请输入玉石数量', trigger: 'blur'}
            ],
            number1: [
              { required: true, message: '请输入玉石数量', trigger: 'blur' }
            ],
            number4: [
              { required: true, message: '请输入礼券数量', trigger: 'blur' }
            ],
            speed: [
              { required: true, message: '请输入增长速度', trigger: 'blur' }
            ],
            createprice: [
              { required: true, message: '请输入玉石价格', trigger: 'blur' }
            ],
            price: [
              { required: true, message: '请输入玉石价格', trigger: 'blur' }
            ],
            rooms: [
              { required: true, message: '请输入房间数量', trigger: 'blur' }
            ],
            number: [
              { required: true, message: '请输入房间数量', trigger: 'blur' }
            ],
            hours: [
              { required: true, message: '请输入时间', trigger: 'blur' }
            ],
            memberCard: [
              { required: true, message: '请选择会员卡类型', trigger: 'blur' }
            ],
            money: [
              { required: true, message: '请输入金额', trigger: 'blur' }
            ],
            integral: [
              { required: true, message: '请输入礼券数量', trigger: 'blur' }
            ],
            gold: [
              { required: true, message: '请输入玉石数量', trigger: 'blur' }
            ]
          },
        }
      },
      methods: {
        change(value8){
          if(this.value8 == '普通用户'){
            this.normalshow = true;
            this.membershow = false;
            axios({
              method: 'post',
              url: this.global.mPath + '/rights/commonrights',
              headers: {
                'Content-type': 'application/x-www-form-urlencoded'
              },
              params:{
                'token':sessionStorage.getItem('token')
              }
            })
              .then((res) => {
                this.normalForm = res.data;
            })
          }else{
            this.normalshow = false;
            this.membershow = true;
            axios({
              method: 'post',
              url: this.global.mPath + '/rights/viprights',
              headers: {
                'Content-type': 'application/x-www-form-urlencoded'
              },
              params:{
                'token':sessionStorage.getItem('token')
              }
            })
              .then((res) => {
                this.memberForm = res.data;
              })
          }
        },
        //普通用户
        submitForm:function(){
          axios({
            method: 'post',
            url: this.global.mPath + '/rights/commonuser',
            headers: {
              'Content-type': 'application/x-www-form-urlencoded'
            },
            params:{
              signGoldNumber:this.normalForm.signGoldNumber,
              shareIntegralNumber:this.normalForm.shareIntegralNumber,
              goldForNewNember:this.normalForm.goldForNewNember,
              shareGoldNumber:this.normalForm.shareGoldNumber,
              inviteIntegralNumber:this.normalForm.inviteIntegralNumber,
              planGrowIntegralSpeed:this.normalForm.planGrowIntegralSpeed,
              planMemberCreateRoomDailyGoldPrice:this.normalForm.planMemberCreateRoomDailyGoldPrice,
              planMemberJoinRoomGoldPrice:this.normalForm.planMemberaddRoomDailyGoldPrice,
              planMemberRoomsCount:this.normalForm.planMemberRoomsCount,
              planMemberMaxCreateRoomDaily:this.normalForm.planMemberMaxCreateRoomDaily,
              planMemberRoomsAliveHours:this.normalForm.planMemberRoomsAliveHours,
              goldForAgentInvite:this.normalForm.goldForAgentInvite,
              token:sessionStorage.getItem('token')
            }
          })
            .then((res) => {
              // console.log(res)
                if (res.data == "fail") {
                  this.$message({showClose: true, message: '设置失败', type: 'warning'});
                } else if (res.data == "success") {
                  this.$message({showClose: true, message: '设置成功', type: 'success'});
                  this.change('普通用户');
                }
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
          })
        },
        //会员用户
        submitmemberForm:function(){
          // console.log(this.memberForm.vipMemberRoomsCount)
          axios({
            method: 'post',
            url: this.global.mPath + '/rights/vipuser',
            headers: {
              'Content-type': 'application/x-www-form-urlencoded'
            },
            params:{
              signGoldNumber:this.memberForm.signGoldNumber,
              shareIntegralNumber:this.memberForm.shareIntegralNumber,
              shareGoldNumber:this.memberForm.shareGoldNumber,
              inviteIntegralNumber:this.memberForm.inviteIntegralNumber,
              vipGrowIntegralSpeed:this.memberForm.vipGrowIntegralSpeed,
              vipGrowGradeSpeed:this.memberForm.vipGrowGradeSpeed,
              vipMemberRoomsCount:this.memberForm.vipMemberRoomsCount,
              vipMemberRoomsAliveHours:this.memberForm.vipMemberRoomsAliveHours,
              token:sessionStorage.getItem('token')
            }
          })
            .then((res) => {
                // console.log(res)
                if (res.data == "fail") {
                  this.$message({showClose: true, message: '设置失败', type: 'warning'});
                } else if (res.data == "success") {
                  this.$message({showClose: true, message: '设置成功', type: 'success'});
                  this.change('会员用户');
                }
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
          }
        })
      }
    }
</script>

<style scoped>
  .choice {
    margin-top:20px;
  }
  .demo-ruleForm {
    margin-top:50px;
  }
  .memberCard {
    margin-top:20px;
  }
  .memberInput {
    width:40%;
  }
  .el-input{
    width:500px;
  }
</style>
