<!--系统恢复-->
<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>系统设置</b></el-breadcrumb-item>
        <el-breadcrumb-item>系统恢复</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main" v-loading="loading" element-loading-text="拼命加载中">
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="filters">
          <el-form-item>
            <el-input v-model="filters.adminname" placeholder="管理员名称" @keyup.enter.native="handleSearch"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" v-on:click="handleSearch">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="showAddDialog">恢复系统</el-button>
          </el-form-item>
        </el-form>
      </el-col>

      <!-- 系统恢复列表-->
      <el-table :data="list" highlight-current-row @selection-change="selsChange"
                style="width: 100%;">
        <el-table-column type="index" width="60"></el-table-column>
        <el-table-column prop="adminname" label="管理员名称" width="160" sortable></el-table-column>
        <el-table-column prop="title" label="标题" width="180" sortable></el-table-column>
        <el-table-column prop="file" label="内容" width="100" sortable>
          <template slot-scope="scope">
            <img :src="scope.row.file" alt="" style="width: 50px;height: 50px">
          </template>
        </el-table-column>
        <el-table-column prop="number" label="玉石数量" width="140" sortable></el-table-column>
        <el-table-column prop="integral" label="礼券数量" width="140" sortable></el-table-column>
        <el-table-column prop="vipcard" label="会员卡体验时间(天)"></el-table-column>
      </el-table>

      <!--工具条-->
      <el-col :span="24" class="toolbar">
        <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="1" :total="total"
                       style="float:right;">
        </el-pagination>
      </el-col>

      <!--系统恢复弹窗-->
      <el-dialog title="系统恢复" :visible.sync="addFormVisible" :close-on-click-modal="false">
        <el-form :model="normalForm" label-width="150px" :rules="rules" class="demo-ruleForm">
          <el-form-item label="标题" prop="title">
            <el-input v-model="normalForm.title" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="图片" prop="file">
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
          <el-form-item label="补偿设置" prop="compensation">
            <el-select v-model="value" placeholder="请选择" @change="change">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-form-item label="玉石数量" prop="number" class="memberCard" v-show="memberDisplay">
              <el-input type="number" min="0" class="memberInput" v-model="normalForm.number"
                        placeholder="请输入正整数"></el-input>
            </el-form-item>
            <el-form-item label="礼券数量" prop="integral" class="memberCard" v-show="memberDisplay">
              <el-input type="number" min="0" class="memberInput" v-model="normalForm.integral"
                        placeholder="请输入正整数"></el-input>
            </el-form-item>
            <el-form-item label="会员卡体验时间" prop="vipcard" class="memberCard" v-show="memberDisplay">
              <el-input type="number" min="0" class="memberInput" v-model="normalForm.vipcard"
                        placeholder="请输入正整数"></el-input>&nbsp;天
            </el-form-item>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="issue">发布</el-button>
            <el-button type="primary" @click.native="addFormVisible = false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </el-col>
  </el-row>
</template>

<script>
  import axios from 'axios'

  export default {
    name: "SystemRecovery",
    data() {
      return {
        imageUrl: '',
        // 七牛云的上传地址，根据自己所在地区选择，这里是华东区
        domain: 'http://up.qiniu.com',
        // 这是七牛云空间的外链默认域名
        qiniuaddr: 'qiniu.3cscy.com',
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
          file: [
            {required: true, message: '请选择图片', trigger: 'blur'}
          ]
        },
        list: [],
        filters: {
          name: ''
        },
        total: 0,
        loading: false,
        addFormVisible: false,//系统维护页面是否显示
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

      change() {
        if (this.value == '选项1') {
          this.memberDisplay = false;
        } else if (this.value == '选项2') {
          this.memberDisplay = true;
        }
      },
      //发布
      issue() {
        if (this.normalForm.title == undefined || this.normalForm.title == "") {
          this.$message({
            showClose: true,
            message: '标题和图片不能为空',
            type: 'warning'
          });
        } else if (this.normalForm.number < 0 || this.normalForm.integral < 0 || this.normalForm.vipcard < 0) {
          this.$message({
            showClose: true,
            message: '请输入正整数',
            type: 'warning'
          });
        } else {
          axios({
            method: 'post',
            url: this.global.mPath + '/mailctrl/addmail',
            headers: {
              'Content-type': 'application/x-www-form-urlencoded'
            },
            params: {
              'status': 1,
              'title': this.trim(this.normalForm.title),
              'file': this.imageUrl,
              'number': this.trim(this.normalForm.number),
              'integral': this.trim(this.normalForm.integral),
              'vipcard': this.trim(this.normalForm.vipcard),
              'token':sessionStorage.getItem('token')
            }
          })
            .then((res) => {
                this.$message({
                  showClose: true,
                  message: '发布成功',
                  type: 'success'
                });
                this.normalForm.title = '';
                this.normalForm.file = '';
                this.normalForm.number = '';
                this.normalForm.integral = '';
                this.normalForm.vipcard = '';
                this.addFormVisible = false;//关闭弹窗
                this.handleSearch();
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
                  break;
                case 500:
                  this.$message({
                    showClose: true,
                    message: '服务器异常',
                    type: 'warning'
                  });
                  this.loading = false;//隐藏加载条
                  break;
                case 405:
                  this.$message({
                    showClose: true,
                    message: '请先登录',
                    type: 'warning'
                  });
                  break;
                case 400:
                  this.$message({
                    showClose: true,
                    message: '请按要求输入',
                    type: 'warning'
                  });
                  break;
              }
            }
          });
        }
      },
      showAddDialog: function () {
        this.addFormVisible = true;
        this.addForm = {
          name: '',
          author: '',
          publishAt: '',
          description: ''
        };
      },
      handleCurrentChange(val) {
        this.page = val;
        this.handleSearch(this.page);
      },
      handleSearch() {
        this.loading = true;//显示加载条
        axios({//根据管理员名称查询
          method: 'post',
          url: this.global.mPath + '/mailctrl/querymail',
          headers: {
            'Content-type': 'application/x-www-form-urlencoded'
          },
          params: {
            'status': 1,
            'size': '15',//每页数量
            'page': this.page,//当前页
            'adminname': this.trim(this.filters.adminname),
            'token':sessionStorage.getItem('token')
          }
        })
          .then((res) => {
              this.loading = false;//隐藏加载条
              this.list = res.data.list;
              this.total = res.data.count;//总页数
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
      },
      selsChange: function (sels) {
        this.sels = sels;
      },
    },
    mounted() { //初始化页面
      this.handleSearch()
    }
  }
</script>

<style scoped>
  .memberCard {
    margin-top: 20px;
  }

  .memberInput {
    width: 50%;
  }

  .warp-main {
    margin-top: 20px;
  }

  img {
    width: 180px;
    height: 120px;
  }
</style>
