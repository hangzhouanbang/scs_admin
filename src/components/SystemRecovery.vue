<!--系统恢复-->
<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>系统设置</b></el-breadcrumb-item>
        <el-breadcrumb-item>系统恢复</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-form :model="normalForm" label-width="150px" :rules="rules" class="demo-ruleForm">
      <el-form-item label="标题" prop="title">
        <el-input v-model="normalForm.title" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="图片" prop="image">
        <el-input type="file" v-model="normalForm.image" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="补偿设置" prop="compensation">
        <el-select v-model="value" placeholder="请选择" @change="change">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-form-item label="金币数量" prop="gold" class="memberCard" v-show="memberDisplay">
          <el-input class="memberInput" v-model="normalForm.gold"></el-input>
        </el-form-item>
        <el-form-item label="积分数量" prop="integral" class="memberCard" v-show="memberDisplay">
          <el-input class="memberInput" v-model="normalForm.integral"></el-input>
        </el-form-item>
        <el-form-item label="会员卡体验时间" prop="vip" class="memberCard" v-show="memberDisplay">
          <el-input class="memberInput" v-model="normalForm.vip"></el-input>&nbsp;天
        </el-form-item>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="issue">发布</el-button>
        <el-button type="primary" @click="cancel ">取消</el-button>
      </el-form-item>
    </el-form>

  </el-row>
</template>

<script>
  export default {
    name: "SystemRecovery",
    data() {
      return {
        memberDisplay: false,
        options: [{
          value: '选项1',
          label: '不设置奖励'
        }, {
          value: '选项2',
          label: '设置奖励'
        }],
        value: '',
        normalForm: {},
        rules: {
          title: [
            {required: true, message: '请输入标题', trigger: 'blur'}
          ],
          image: [
            {required: true, message: '请选择图片', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      change() {
        if (this.value == '选项1') {
          this.memberDisplay = false;
        } else if (this.value == '选项2') {
          this.memberDisplay = true;
        }
      },
      //发布
      issue() {

      },
      //取消
      cancel() {
        this.normalForm.title = ''
        this.normalForm.image = ''
        this.normalForm.gold = ''
        this.normalForm.integral = ''
        this.normalForm.vip = ''
      }
    }
  }
</script>

<style scoped>
  .demo-ruleForm {
    margin-top: 50px;
  }

  .memberCard {
    margin-top: 20px;
  }

  .memberInput {
    width: 30%;
  }
</style>
