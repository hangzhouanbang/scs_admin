<!--系统维护-->
<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>系统设置</b></el-breadcrumb-item>
        <el-breadcrumb-item>系统维护</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-form :model="normalForm" label-width="100px" :rules="rules" class="demo-ruleForm">
      <el-form-item label="标题" prop="title">
        <el-input v-model="normalForm.title" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="图片" prop="file">
        <el-input type="file" name="file" accept="image/png,image/gif,image/jpeg" v-model="normalForm.image"
                  auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="issue">发布</el-button>
        <el-button type="primary" @click="cancel ">取消</el-button>
      </el-form-item>
    </el-form>

  </el-row>
</template>

<script>
  import axios from 'axios'
  export default {
    name: "SystemMaintenance",
    data() {
      return {
        normalForm: {},
        rules: {
          title: [
            {required: true, message: '请输入标题', trigger: 'blur'}
          ],
          file: [
            {required: true, message: '请选择图片', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      //发布
      issue() {
        if (this.normalForm.title == undefined || this.normalForm.title == "") {
          this.$message({
            showClose: true,
            message: '标题和图片不能为空',
            type: 'warning'
          });
        } else {
          axios({
            method: 'post',
            url: '/api/mailctrl/addmail',
            headers: {
              'Content-type': 'application/x-www-form-urlencoded'
            },
            params: {
              'title': this.normalForm.title,
              'file': 'http://img.sccnn.com/bimg/338/27244.jpg'
            }
          })
            .then((res) => {
                this.$message({
                  showClose: true,
                  message: '发布成功',
                  type: 'success'
                });
                this.normalForm.title = ''
                this.normalForm.file = ''
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
        }
      },
      //取消
      cancel() {
        this.normalForm.title = ''
        this.normalForm.file = ''
      }
    }
  }
</script>

<style scoped>
  .demo-ruleForm {
    margin-top: 50px;
  }
</style>
