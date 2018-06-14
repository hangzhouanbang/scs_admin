<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>会员中心</b></el-breadcrumb-item>
        <el-breadcrumb-item>会员权益</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
    <el-select v-model="value8" filterable placeholder="请选择" class="choice" @change="change">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    <!--普通用户-->
    <el-form :model="normalForm" :rules="rules" ref="normalForm" label-width="250px" class="demo-ruleForm" v-show="normalshow">
      <el-form-item label="新用户注册赠送的金币数量" prop="newnumber">
        <el-input v-model="normalForm.newnumber"></el-input>
      </el-form-item>
      <el-form-item label="签到得金币数量" prop="number1">
        <el-input v-model="normalForm.number1"></el-input>
      </el-form-item>
      <el-form-item label="分享得积分数量" prop="number2">
        <el-input v-model="normalForm.number2"></el-input>
      </el-form-item>
      <el-form-item label="分享得金币数量" prop="number3">
        <el-input v-model="normalForm.number3"></el-input>
      </el-form-item>
      <el-form-item label="邀请得积分数量" prop="number4">
        <el-input v-model="normalForm.number4"></el-input>
      </el-form-item>
      <el-form-item label="积分增长速度" prop="speed">
        <el-input v-model="normalForm.speed"></el-input>
      </el-form-item>
      <el-form-item label="创建会员玩法房间的金币价格" prop="createprice">
        <el-input v-model="normalForm.createprice"></el-input>
      </el-form-item>
      <el-form-item label="加入会员玩法房间的金币价格" prop="price">
        <el-input v-model="normalForm.price"></el-input>
      </el-form-item>
      <el-form-item label="加入会员玩法每天可开的房间数量" prop="number">
        <el-input v-model="normalForm.number"></el-input>
      </el-form-item>
      <el-form-item label="保存房间数量" prop="rooms">
        <el-input v-model="normalForm.rooms"></el-input>
      </el-form-item>
      <el-form-item label="房间存活小时数" prop="hours">
        <el-input v-model="normalForm.hours"></el-input>
      </el-form-item>
      <!--<el-form-item label="经验值" prop="exp">-->
        <!--<el-input v-model="normalForm.exp"></el-input>-->
      <!--</el-form-item>-->
      <el-form-item>
        <el-button type="primary" @click="submitForm('normalForm')">立即设置</el-button>
        <el-button @click="resetForm('normalForm')">重置</el-button>
      </el-form-item>
    </el-form>
    <!--会员用户-->
    <el-form :model="memberForm" :rules="rules" ref="memberForm" label-width="150px" class="demo-ruleForm" v-show="membershow">
      <el-form-item label="签到得金币数量" prop="number1">
        <el-input v-model="memberForm.number1"></el-input>
      </el-form-item>
      <el-form-item label="分享得积分数量" prop="number2">
        <el-input v-model="memberForm.number2"></el-input>
      </el-form-item>
      <el-form-item label="分享得金币数量" prop="number3">
        <el-input v-model="memberForm.number3"></el-input>
      </el-form-item>
      <el-form-item label="邀请得积分数量" prop="number4">
        <el-input v-model="memberForm.number4"></el-input>
      </el-form-item>
      <el-form-item label="积分增长速度" prop="speed">
        <el-input v-model="memberForm.speed"></el-input>
      </el-form-item>
      <el-form-item label="等级增长速度" prop="speed1">
        <el-input v-model="memberForm.speed1"></el-input>
      </el-form-item>
      <el-form-item label="保存房间数量" prop="rooms">
        <el-input v-model="memberForm.rooms"></el-input>
      </el-form-item>
      <el-form-item label="房间存活小时数" prop="hours">
        <el-input v-model="memberForm.hours"></el-input>
      </el-form-item>
      <!--<el-form-item label="经验值" prop="exp">-->
        <!--<el-input v-model="memberForm.exp"></el-input>-->
      <!--</el-form-item>-->
      <el-form-item>
        <el-button type="primary" @click="submitmemberForm('memberForm')">立即设置</el-button>
        <el-button @click="resetForm('memberForm')">重置</el-button>
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
              {required: true, message: '请输入金币数量', trigger: 'blur'}
            ],
            number1: [
              { required: true, message: '请输入金币数量', trigger: 'blur' }
            ],
            number2: [
              { required: true, message: '请输入积分数量', trigger: 'blur' }
            ],
            number3: [
              { required: true, message: '请输入金币数量', trigger: 'blur' }
            ],
            number4: [
              { required: true, message: '请输入积分数量', trigger: 'blur' }
            ],
            speed: [
              { required: true, message: '请输入增长速度', trigger: 'blur' }
            ],
            createprice: [
              { required: true, message: '请输入金币价格', trigger: 'blur' }
            ],
            price: [
              { required: true, message: '请输入金币价格', trigger: 'blur' }
            ],
            rooms: [
              { required: true, message: '请输入房间数量', trigger: 'blur' }
            ],
            // exp: [
            //   { required: true, message: '请输入经验值', trigger: 'blur' }
            // ],
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
              { required: true, message: '请输入积分数量', trigger: 'blur' }
            ],
            gold: [
              { required: true, message: '请输入金币数量', trigger: 'blur' }
            ]
          },
        }
      },
      methods: {
          change(){
            if(this.value8 == '普通用户'){
              this.normalshow = true;
              this.membershow = false;
            }else{
              this.normalshow = false;
              this.membershow = true;
            }
          },
          memberchange(){
            this.memberDisplay = true;
        },
        //普通用户
        submitForm:function(){
          axios({
            method: 'post',
            url: '/api/rights/commonuser',
            headers: {
              'Content-type': 'application/x-www-form-urlencoded'
            },
            params:{
              signGoldNumber:this.normalForm.number1,
              shareIntegralNumber:this.normalForm.number2,
              goldForNewNember:this.normalForm.newnumber,
              shareGoldNumber:this.normalForm.number3,
              inviteIntegralNumber:this.normalForm.number4,
              planGrowIntegralSpeed:this.normalForm.speed,
              planMemberCreateRoomDailyGoldPrice:this.normalForm.createprice,
              planMemberaddRoomDailyGoldPrice:this.normalForm.price,
              planMemberRoomsCount:this.normalForm.rooms,
              planMemberMaxCreateRoomDaily:this.normalForm.number,
              planMemberRoomsAliveHours:this.normalForm.hours
            }
          })
            .then((res) => {
              console.log(res)
                if (res.data == "fail") {
                  this.$message({
                    showClose: true,
                    message: '设置失败',
                    type: 'warning'
                  });
                } else if (res.data == "success") {
                  this.$message({
                    showClose: true,
                    message: '设置成功',
                    type: 'success'
                  });
                  this.addprivilegeVisible = false;//关闭弹窗
                  this.handleSearch(1);
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
          })
        },
        //会员用户
        submitmemberForm:function(){
          axios({
            method: 'post',
            url: '/api/rights/vipuser',
            headers: {
              'Content-type': 'application/x-www-form-urlencoded'
            },
            params:{
              signGoldNumber:this.memberForm.number1,
              shareIntegralNumber:this.memberForm.number2,
              shareGoldNumber:this.memberForm.number3,
              inviteIntegralNumber:this.memberForm.number4,
              vipGrowIntegralSpeed:this.memberForm.speed,
              vipGrowGradeSpeed:this.memberForm.speed1,
              vipMemberRoomsCount:this.memberForm.rooms,
              vipMemberRoomsAliveHours:this.memberForm.hours
            }
          })
            .then((res) => {
                console.log(res)
                if (res.data == "fail") {
                  this.$message({
                    showClose: true,
                    message: '设置失败',
                    type: 'warning'
                  });
                } else if (res.data == "success") {
                  this.$message({
                    showClose: true,
                    message: '设置成功',
                    type: 'success'
                  });
                  this.addprivilegeVisible = false;//关闭弹窗
                  this.handleSearch(1);
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
          })
        }
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
