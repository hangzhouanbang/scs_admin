<template>
  <el-form ref="AccountFrom" :model="account" :rules="rules" label-position="left" label-width="0px"
           class="demo-ruleForm login-container">
    <h3 class="title">管理员登录</h3>
    <el-form-item prop="nickname">
      <el-input type="text" v-model="account.nickname" auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item prop="pass">
      <el-input type="password" v-model="account.pass" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <!--<el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>-->
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:100%;" @click.native.prevent="handleLogin" :loading="loading">
        登录
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>

  import axios from 'axios'

  export default {
    data() {
      return {
        loading: false,
        account: {
          nickname: this.nickname,
          pass: this.pass
        },
        rules: {
          nickname: [
            {required: true, message: '请输入账号', trigger: 'blur'},
          ],
          pass: [
            {required: true, message: '请输入密码', trigger: 'blur'},
          ]
        },
        checked: true
      };
    },
    methods: {
      handleLogin() {
        axios({//登录
          method: 'post',
          url: '/api/loginCtrl/login',
          headers: {
            'Content-type': 'application/x-www-form-urlencoded'
          },
          params: {
            'nickname': this.account.nickname,
            'pass': this.account.pass,
          }
        })
          .then((res) => {
              if (res.data.user == null) {
                alert("账号或密码错误");
              } else {
                this.$router.replace('/home');
                sessionStorage.setItem('nickname',res.data.user.admin.nickname);
              }
            },
          ).catch((e) => {
        });
      }
    }
  }
</script>

<style scoped>
  .login-container {
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 160px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    background: -ms-linear-gradient(top, #ace, #00C1DE); /* IE 10 */
    background: -moz-linear-gradient(top, #ace, #00C1DE); /*火狐*/
    background: -webkit-gradient(linear, 0% 0%, 0% 100%, from(#ace), to(#00C1DE)); /*谷歌*/
    background: -webkit-linear-gradient(top, #ace, #00C1DE); /*Safari5.1 Chrome 10+*/
    background: -o-linear-gradient(top, #ace, #00C1DE); /*Opera 11.10+*/
  }

  .title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
  }
</style>


