<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>会员中心</b></el-breadcrumb-item>
        <el-breadcrumb-item>会员等级</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <!--设置-->
      <el-form :model="addCard" label-width="150px" ref="addCard" class="toolbar" :rules="editFormRules">
        <el-form-item label="充值" prop="vip1">
          <el-input v-model="addCard.vip1" auto-complete="off" type="number"></el-input>
          元，等级为v1
        </el-form-item>
        <el-form-item label="充值" prop="vip2">
          <el-input v-model="addCard.vip2" auto-complete="off" type="number"></el-input>
          元，等级为v2
        </el-form-item>
        <el-form-item label="充值" prop="vip3">
          <el-input v-model="addCard.vip3" auto-complete="off" type="number"></el-input>
          元，等级为v3
        </el-form-item>
        <el-form-item label="充值" prop="vip4">
          <el-input v-model="addCard.vip4" auto-complete="off" type="number"></el-input>
          元，等级为v4
        </el-form-item>
        <el-form-item label="充值" prop="vip5">
          <el-input v-model="addCard.vip5" auto-complete="off" type="number"></el-input>
          元，等级为v5
        </el-form-item>
        <el-button @click.native="addFormVisible = false" class="btn">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
      </el-form>
  </el-row>
</template>

<script>
  import axios from 'axios'

  export default {
        name: "MemberLevel",
        data() {
          return {
            setLevelVisible:false,
            addCard:{},
            users:[],
            addLoading: false,
            editFormRules:{
              vip1:[
                {required: true, message: '文本框不为空', trigger: 'blur'}
              ],
              vip2:[
                {required: true, message: '文本框不为空', trigger: 'blur'}
              ],
              vip3:[
                {required: true, message: '文本框不为空', trigger: 'blur'}
              ],
              vip4:[
                {required: true, message: '文本框不为空', trigger: 'blur'}
              ],
              vip5:[
                {required: true, message: '文本框不为空', trigger: 'blur'}
              ],
            }
          }
        },
      methods: {
        setLevel(){
          this.setLevelVisible = true;
          axios({
            method: 'post',
            url: '/api/grade/find_grade',
            headers: {
              'Content-type': 'application/x-www-form-urlencoded'
            },
            params: {}
          })
            .then((res) => {
                console.log(res)
                this.addCard = res.data.data;
              },
            ).catch((e) => {})
        },
        addSubmit(){
          axios({
            method: 'post',
            url: '/api/grade/insert_grade',
            headers: {
              'Content-type': 'application/x-www-form-urlencoded'
            },
            params: {
              vip1:this.addCard.vip1,
              vip2:this.addCard.vip2,
              vip3:this.addCard.vip3,
              vip4:this.addCard.vip4,
              vip5:this.addCard.vip5
            }
          })
            .then((res) => {
                console.log(res)
                if(res.data.success){
                  this.$message({
                    showClose: true,
                    message: '设置成功',
                    type: 'success'
                  });
                }else{
                  this.$message({
                    showClose: true,
                    message: '设置失败',
                    type: 'warning'
                  });
                }
              this.setLevelVisible = false;
              },
            ).catch((e) => {})
        }
      },
      mounted(){
        this.setLevel();
      }
    }
</script>

<style scoped>
  .toolbar{
    margin-top:50px;
  }
  .el-input{
    width:100px;
  }
  .btn{
    margin-left:130px;
  }
</style>
