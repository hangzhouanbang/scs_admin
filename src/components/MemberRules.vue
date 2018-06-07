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
    <el-form :model="normalForm" :rules="rules" ref="normalForm" label-width="150px" class="demo-ruleForm" v-show="normalshow">
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
      <el-form-item label="加入房间的金币价格" prop="price">
        <el-input v-model="normalForm.price"></el-input>
      </el-form-item>
      <el-form-item label="保存房间数量" prop="rooms">
        <el-input v-model="normalForm.rooms"></el-input>
      </el-form-item>
      <el-form-item label="经验值" prop="exp">
        <el-input v-model="normalForm.exp"></el-input>
      </el-form-item>
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
      <el-form-item label="等级增长速度" prop="speed">
        <el-input v-model="memberForm.speed"></el-input>
      </el-form-item>
      <el-form-item label="加入房间的金币价格" prop="price">
        <el-input v-model="memberForm.price"></el-input>
      </el-form-item>
      <el-form-item label="保存房间数量" prop="rooms">
        <el-input v-model="memberForm.rooms"></el-input>
      </el-form-item>
      <el-form-item label="经验值" prop="exp">
        <el-input v-model="memberForm.exp"></el-input>
      </el-form-item>
      <el-form-item label="会员卡" prop="memberCard">
        <el-select v-model="value" filterable placeholder="请选择" @change="memberchange">
          <el-option
            v-for="item in card"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-form-item label="购买金额" prop="money" class="memberCard" v-show="memberDisplay">
          <el-input v-model="memberForm.money" class="memberInput"></el-input>
        </el-form-item>
        <el-form-item label="购买获得积分数" prop="integral" class="memberCard" v-show="memberDisplay">
          <el-input v-model="memberForm.integral" class="memberInput"></el-input>
        </el-form-item>
        <el-form-item label="购买获得金币数" prop="gold" class="memberCard" v-show="memberDisplay">
          <el-input v-model="memberForm.gold" class="memberInput"></el-input>
        </el-form-item>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('memberForm')">立即设置</el-button>
        <el-button @click="resetForm('memberForm')">重置</el-button>
      </el-form-item>
    </el-form>
   </el-row>
</template>

<script>
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
            price: [
              { required: true, message: '请输入增长速度', trigger: 'blur' }
            ],
            rooms: [
              { required: true, message: '请输入房间数量', trigger: 'blur' }
            ],
            exp: [
              { required: true, message: '请输入经验值', trigger: 'blur' }
            ],
            memberCard: [
              { required: true, message: '请选择会员卡', trigger: 'change' }
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
</style>
