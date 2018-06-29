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
          <el-form-item label="用户ID" prop="id">
            <el-input
              type="textarea"
              autosize
              placeholder="多个以上ID，用“，”分隔开来。"
              v-model="filters.id">
            </el-input>
          </el-form-item>
          <el-form-item label="金币" prop="number">
            <el-input type="number" min="0" placeholder="数目" v-model="filters.gold"></el-input>
          </el-form-item>
          <el-form-item label="积分" prop="number">
            <el-input type="number" min="0" placeholder="数目" v-model="filters.score"></el-input>
          </el-form-item>
          <el-form-item label="物品" prop="number">
            <el-input placeholder="会员卡编号" v-model="filters.uid"></el-input>
          </el-form-item>
          <el-form-item label="邮件有效期">
            <el-select v-model="value2" placeholder="请选择">
              <el-option
                v-for="item in day"
                :key="item.value2"
                :label="item.label"
                :value="item.value2">
              </el-option>
            </el-select>
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
          value: '选项1',
          label: '奖励发送'
        }, {
          value: '选项2',
          label: '系统通知'
        }, {
          value: '选项3',
          label: '活动通知'
        }],
        value: '奖励发送',
        day: [{
          value2: '选项1',
          label: '1天'
        }, {
          value2: '选项2',
          label: '3天'
        }, {
          value2: '选项3',
          label: '7天'
        }, {
          value2: '选项4',
          label: '30天'
        }],
        value2: '1天',
        filters: {
          name: ''
        },
        imageUrl: '',
        // 七牛云的上传地址，根据自己所在地区选择，这里是华东区
        domain: 'http://up.qiniu.com',
        // 这是七牛云空间的外链默认域名
        qiniuaddr: 'paly4iump.bkt.clouddn.com',
        rules: {
          id: [
            {required: true, message: '请输入ID', trigger: 'blur'}
          ]
        },
      }
    },
    methods: {
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
          url: '/api/mailctrl/uptoken',
          headers: {
            'Content-type': 'application/x-www-form-urlencoded'
          },
          params: {
            'accessKey': 'qQj7mRKyvE7dOOjObMC8W58i6Yn3penfr7-_fg4d',
            'secretKey': '9f70kmAddF1maP1U0jy0vRNAhwWNv_huR1xDSH_s',
            'bucket': 'anbang'
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
        this.filters.id = ''
        this.filters.gold = ''
        this.filters.score = ''
        this.filters.uid = ''
      },

      //发送
      send() {
        if (this.filters.id == undefined || this.filters.id == "") {
          this.$message({
            showClose: true,
            message: '用户ID不能为空',
            type: 'warning'
          });
        } else {
          axios({
            method: 'post',
            url: '/api/',
            headers: {
              'Content-type': 'application/x-www-form-urlencoded'
            },
            params: {
              'status': '0',
              'file': this.imageUrl
            }
          })
            .then((res) => {
                this.$message({
                  showClose: true,
                  message: '发布成功',
                  type: 'success'
                });
                this.filters.id = ''
                this.filters.gold = ''
                this.filters.score = ''
                this.filters.uid = ''
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

    }
  }
</script>

<style scoped>
  .warp-main {
    margin-top: 30px;
  }

  .el-form-item {
    width: 500px;
  }
</style>
