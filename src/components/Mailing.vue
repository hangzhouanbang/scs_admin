<!--邮件发送-->
<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>邮件管理</b></el-breadcrumb-item>
        <el-breadcrumb-item>邮件发送</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">

        <el-form :model="filters" label-width="120px" :rules="rules">
          <el-form-item label="标题" prop="title">
            <el-input type="text" min="0" v-model="filters.title"></el-input>
          </el-form-item>
          <el-form-item label="类型">
            <el-select v-model="value">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="邮件内容" prop="file">
            <div class="upload">
              <el-upload
                class="avatar-uploader"
                :action=domain
                :http-request=upqiniu
                :show-file-list="false"
                :before-upload="beforeUpload">
                <img v-if="imageUrl" :src="imageUrl" class="avatar">
                <el-button v-else class="el-icon-plus avatar-uploader-icon"></el-button>
              </el-upload>
            </div>
          </el-form-item>
          <el-form-item label="用户对象" prop="ids">
            <el-radio v-model="radio" label="0" @change="changeInput()">单个用户</el-radio>
            <el-input
              type="textarea"
              autosize
              placeholder="多个以上ID，用“，”分隔开来。"
              v-model="filters.ids" v-if="visible">
            </el-input>
            <el-radio v-model="radio" label="1" @change="changeInput()">会员用户</el-radio>
            <el-radio v-model="radio" label="2" @change="changeInput()">非会员用户</el-radio>
            <el-radio v-model="radio" label="3" @change="changeInput()">所有</el-radio>
          </el-form-item>

          <el-form-item label="玉石" prop="number">
            <el-input type="number" min="0" placeholder="数目" v-model="filters.number"></el-input>
          </el-form-item>
          <el-form-item label="礼券" prop="integral">
            <el-input type="number" min="0" placeholder="数目" v-model="filters.integral"></el-input>
          </el-form-item>
          <el-form-item label="物品" prop="number">
            <el-select v-model="id" placeholder="请选择" clearable>
              <el-option
                v-for="item in this.data"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="邮件有效期">
            <el-select v-model="value2" placeholder="请选择" clearable>
              <el-option
                v-for="item in day"
                :key="item.value2"
                :label="item.label"
                :value="item.value2">
              </el-option>
            </el-select>&nbsp;天
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="send">确认发送</el-button>
            <el-button type="primary" @click="reset">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-col>

  </el-row>
</template>

<script>
  import axios from 'axios'

  export default {
    name: "Mailing",
    data() {
      return {
        options: [{
          value: '活动奖励',
        }, {
          value: '系统通知',
        }, {
          value: '活动通知',
        }],
        value: '活动奖励',
        day: [{
          value2: '1',
        }, {
          value2: '3',
        }, {
          value2: '7',
        }, {
          value2: '30',
        }],
        value2: '1',
        data: [],
        id: this.data,
        filters: {},
        imageUrl: '',
        // 七牛云的上传地址，根据自己所在地区选择，这里是华东区
        domain: 'http://up.qiniu.com',
        // 这是七牛云空间的外链默认域名
        qiniuaddr: 'qiniu.3cscy.com',
        rules: {
          ids: [
            {required: true, message: '请输入ID', trigger: 'blur'}
          ]
        },
        radio:'',
        visible:false
      }
    },
    methods: {
      trim(str) {
        if(str != null){
          return str.replace(/(^\s+)|(\s+$)/g, "");
        }
      },
      // 上传文件到七牛云
      upqiniu(req) {
        //console.log(req)
        const config = {
          headers: {'Content-Type': 'multipart/form-data'}
        }
        let filetype = ''
        if (req.file.type === 'image/png') {
          filetype = 'png'
        } else {
          filetype = 'jpg'
        }
        // 重命名要上传的文件
        const keyname = 'anbang' + Math.random() + '.' + filetype
        // 从后端获取上传凭证token
        axios({
          method: 'post',
          url: this.global.mPath + '/mailctrl/uptoken',
          headers: {
            'Content-type': 'application/x-www-form-urlencoded'
          },
          params:{
            token:sessionStorage.getItem('token')
          }
        }).then(res => {
          const formdata = new FormData()
          formdata.append('file', req.file)
          formdata.append('token', res.data.data)
          formdata.append('key', keyname)
          // 获取到凭证之后再将文件上传到七牛云空间
          axios.post(this.domain, formdata, config).then(res => {
            this.imageUrl = 'http://' + this.qiniuaddr + '/' + res.data.key
            //console.log(this.imageUrl)
          })
        })
      },
      // 验证文件合法性
      beforeUpload(file) {
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!')
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!')
        }
        return isJPG && isLt2M
      },
      //重置
      reset() {
        this.filters.ids = ''
        this.filters.number = ''
        this.filters.integral = ''
        this.id = ''
      },
      changeInput(){
        if(this.radio == 0){
          this.visible = true;
        }else{
          this.visible = false;
        }
      },
      //发送
      send() {
        console.log(this.radio)
        if (this.filters.number < 0 || this.filters.integral < 0) {
          this.$message({
            showClose: true,
            message: '金币或积分为正整数',
            type: 'warning'
          });
        } else if(this.radio == 0){
          axios({
            method: 'post',
            url: this.global.mPath + '/mailctrl/addmailbyid',
            headers: {
              'Content-type': 'application/x-www-form-urlencoded'
            },
            params: {
              'title':this.trim(this.filters.title),
              'mailType': this.value,
              'file': this.imageUrl,
              'ids': this.trim(this.filters.ids),
              'number': this.trim(this.filters.number),
              'integral': this.trim(this.filters.integral),
              'vipCardId': this.id,
              'validDay': this.value2,
              'token':sessionStorage.getItem('token')
            }
          })
            .then((res) => {
                if (res.data.success == false) {
                  this.$message({
                    showClose: true,
                    message: '发布失败',
                    type: 'warning'
                  });
                } else if (res.data.success == true) {
                  this.$message({
                    showClose: true,
                    message: '发布成功',
                    type: 'success'
                  });
                  this.filters.ids = ''
                  this.filters.number = ''
                  this.filters.integral = ''
                  this.id = ''
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
        }else{
          axios({
            method: 'post',
            url: this.global.mPath + '/mailctrl/addmailbytype',
            headers: {
              'Content-type': 'application/x-www-form-urlencoded'
            },
            params: {
              'title':this.trim(this.filters.title),
              'mailType': this.value,
              'file': this.imageUrl,
              'number': this.trim(this.filters.number),
              'integral': this.trim(this.filters.integral),
              'vipCardId': this.id,
              'validDay': this.value2,
              'sendType': this.radio,
              'token':sessionStorage.getItem('token')
            }
          })
            .then((res) => {
                if (res.data.success == false) {
                  this.$message({
                    showClose: true,
                    message: '发布失败',
                    type: 'warning'
                  });
                } else if (res.data.success == true) {
                  this.$message({
                    showClose: true,
                    message: '发布成功',
                    type: 'success'
                  });
                  this.filters.ids = ''
                  this.filters.number = ''
                  this.filters.integral = ''
                  this.id = ''
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
        }
      }
    },
    mounted() { //初始化页面
      axios({//查出所有会员卡
        method: 'post',
        url: this.global.mPath + '/mailctrl/find_vipcard',
        headers: {
          'Content-type': 'application/x-www-form-urlencoded'
        },
        params:{
          'token':sessionStorage.getItem('token')
        }
      })
        .then((res) => {
            this.data = res.data.data;
            //console.log(this.data)
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
  }
</script>

<style scoped>
  .toolbar {
    margin-top: 30px;
  }

  .el-select,
  .el-input,
  .el-textarea{
    width: 300px;
  }

  img {
    width: 180px;
    height: 120px;
  }
</style>
