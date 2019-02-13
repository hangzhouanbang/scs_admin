<!--活动管理-->
<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>活动管理</b></el-breadcrumb-item>
        <el-breadcrumb-item>活动配置</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main" v-loading="loading" element-loading-text="拼命加载中">
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="filters">
          <el-form-item label="标题">
            <el-input v-model.trim="filters.title" placeholder="请输入标题"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="showAddDialog">新建活动</el-button>
          </el-form-item>
        </el-form>
      </el-col>

      <!-- 活动列表-->
      <el-table :data="items" highlight-current-row @selection-change="selsChange"
                style="width: 100%;">
        <el-table-column prop="theme" label="活动标题" width="160"></el-table-column>
        <el-table-column prop="content" label="内容" width="100">
          <template slot-scope="scope">
            <img :src="scope.row.content" alt="" style="width: 50px;height: 50px">
          </template>
        </el-table-column>
        <el-table-column prop="url" label="活动地址" width="200"></el-table-column>
        <el-table-column prop="promulgator" label="发布者" width="100"></el-table-column>
        <el-table-column prop="remainSecond" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" v-if="scope.row.state === 'START'" :disabled="false"
                       @click="off(scope.$index,scope.row)">停用
            </el-button>
            <el-button type="primary" v-if="scope.row.state === 'STOP'" :disabled="false"
                       @click="open(scope.$index,scope.row)">启用</el-button>
            <el-button type="primary" v-if="scope.row.state === 'STOP'"
                       @click="del(scope.$index,scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--工具条-->
      <el-col :span="24" class="toolbar">
        <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="1" :total="total"
                       style="float:right;">
        </el-pagination>
      </el-col>

      <!--新建活动弹窗-->
      <el-dialog title="新建活动" :visible.sync="addFormVisible" :close-on-click-modal="false">
        <el-form :model="normalForm" label-width="100px" :rules="rules" class="demo-ruleForm">
          <el-form-item label="活动主题" prop="title">
            <el-input v-model.trim="normalForm.title" auto-complete="off" style="width:400px;"></el-input>
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
          <el-form-item label="活动地址" prop="address">
            <el-input v-model.trim="normalForm.address" auto-complete="off" style="width:400px;"></el-input>
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
    name: "Activity",
    data() {
      return {
        imageUrl: '',
        // 七牛云的上传地址，根据自己所在地区选择，这里是华东区
        domain: 'http://up.qiniu.com',
        // 这是七牛云空间的外链默认域名
        qiniuaddr: 'qiniu.3cscy.com',
        normalForm: {},
        rules: {
          title: [
            {required: true, message: '请输入标题', trigger: 'blur'}
          ],
          file: [
            {required: true, message: '请选择图片', trigger: 'blur'}
          ],
          address: [
            {required: false, message: '请输入活动地址', trigger: 'blur'}
          ]
        },
        items: [],
        filters: {},
        total: 0,
        loading: false,
        addFormVisible: false,//系统维护页面是否显示
        addForm:{}
      }
    },
    methods: {
      // 上传文件到七牛云
      upqiniu(req) {
        // console.log(req)
        const config = {
          headers: {'Content-Type': 'multipart/form-data'}
        };
        let filetype = '';
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
      //发布
      issue(req) {
        if (this.normalForm.title == undefined || this.normalForm.title == "") {
          this.$message({showClose: true, message: '标题和图片不能为空', type: 'warning'});
        } else {
          axios({
            method: 'post',
            url: this.global.mPath + '/activity/addactivity',
            headers: {
              'Content-type': 'application/x-www-form-urlencoded'
            },
            params: {
              'theme': this.normalForm.title,
              'content': this.imageUrl,
              'url': this.normalForm.address,
              'promulgator': sessionStorage.getItem('nickname'),
              'token':sessionStorage.getItem('token')
            }
          }).then((res) => {
            if(res.data.success){
              this.$message({showClose: true, message: '新建活动成功', type: 'success'});
              this.normalForm.title = '';
              this.imageUrl = '';
              this.normalForm.address = '';
              this.addFormVisible = false;//关闭弹窗
              this.handleSearch();
            }else{
              this.$message({showClose: true, message: '新建活动失败', type: 'warning'});
            }
          }).catch((e) => {
            if (e && e.response) {
              switch (e.response.status) {
                case 504:
                  this.$message({showClose: true, message: '服务器异常', type: 'warning'});
                  this.loading = false;//隐藏加载条
                  break;
                case 500:
                  this.$message({showClose: true, message: '服务器异常', type: 'warning'});
                  this.loading = false;//隐藏加载条
                  break;
                case 405:
                  this.$message({showClose: true, message: '请先登录', type: 'warning'});
                  break
              }
            }
          })
        }
      },
      showAddDialog: function () {
        this.addFormVisible = true;
      },
      handleCurrentChange(val) {
        this.page = val;
        this.handleSearch(this.page);
      },
      handleSearch() {
        axios({
          method: 'post',
          url: this.global.mPath + '/activity/queryactivity',
          headers: {
            'Content-type': 'application/x-www-form-urlencoded'
          },
          params: {
            'size': '15',//每页数量
            'page': this.page,//当前页
            'theme': this.filters.title,//标题
            'token':sessionStorage.getItem('token')
          }
        }).then((res) => {
          this.loading = false;//隐藏加载条
          this.items = res.data.data.items;
          this.total = res.data.data.pageCount;//总页数
        }).catch((e) => {
          if (e && e.response) {
            switch (e.response.status) {
              case 504:
                this.$message({showClose: true, message: '服务器异常', type: 'warning'});
                this.loading = false;//隐藏加载条
                break;
              case 500:
                this.$message({showClose: true, message: '服务器异常', type: 'warning'});
                this.loading = false;//隐藏加载条
                break;
              case 405:
                this.$message({showClose: true, message: '请先登录', type: 'warning'});
                break
            }
          }
        })
      },
      selsChange: function (sels) {
        this.sels = sels;
      },
      //停用活动
      off(index, row) {
        sessionStorage.setItem('id', this.items[index].id);//保存id
        this.$confirm('确认停用吗?', '提示', {type: 'warning'}).then(() => {
          axios({
            method: 'post',
            url: this.global.mPath + '/activity/stopactivity',
            headers: {
              'Content-type': 'application/x-www-form-urlencoded'
            },
            params: {
              'activityId': sessionStorage.getItem('id'),
              'token': sessionStorage.getItem('token')
            }
          }).then((res) => {
            if (res.data.success) {
              this.$message.success({showClose: true, message: '停用成功', duration: 1500});
              this.handleSearch();
            } else {
              this.$message.error({showClose: true, message: err.toString(), duration: 2000});
            }
          }
          ).catch((e) => {
            if (e && e.response) {
              switch (e.response.status) {
                case 504:
                  this.$message({showClose: true, message: '服务器异常', type: 'warning'});
                  this.loading = false;//隐藏加载条
                  break;
                case 500:
                  this.$message({showClose: true, message: '服务器异常', type: 'warning'});
                  this.loading = false;//隐藏加载条
                  break;
                case 405:
                  this.$message({showClose: true, message: '请先登录', type: 'warning'});
                  break
              }
            }
          })
        })
      },
     //启用
      open(index,row){
        sessionStorage.setItem('id', this.items[index].id);//保存id
        this.$confirm('确认启用吗?', '提示', {type: 'warning'}).then(() => {
          axios({
            method: 'post',
            url: this.global.mPath + '/activity/startactivity',
            headers: {
              'Content-type': 'application/x-www-form-urlencoded'
            },
            params: {
              'activityId': sessionStorage.getItem('id'),
              'token': sessionStorage.getItem('token')
            }
          }).then((res) => {
            if (res.data.success) {
              this.$message.success({showClose: true, message: '启用成功', duration: 1500});
              this.handleSearch();
            } else {
              this.$message.error({showClose: true, message: err.toString(), duration: 2000});
            }
          }).catch((e) => {
            if (e && e.response) {
              switch (e.response.status) {
                case 504:
                  this.$message({showClose: true, message: '服务器异常', type: 'warning'});
                  this.loading = false;//隐藏加载条
                  break;
                case 500:
                  this.$message({showClose: true, message: '服务器异常', type: 'warning'});
                  this.loading = false;//隐藏加载条
                  break;
                case 405:
                  this.$message({showClose: true, message: '请先登录', type: 'warning'});
                  break
              }
            }
          })
        })
      },
      //删除
      del:function(index,row){
        this.$confirm('确认删除该记录吗?', '提示', {type: 'warning'}).then(() => {
          axios({
            method: 'post',
            url: this.global.mPath + '/activity/deleteactivity',
            headers: {
              'Content-type': 'application/x-www-form-urlencoded'
            },
            params: {
              'activityId': row.id,
              'token':sessionStorage.getItem('token')
            }
          }).then((res) => {
            if(res.data.success){
              this.$message.success({showClose: true, message: '删除成功', duration: 1500});
              this.handleSearch();
            }else{
              this.$message.error({showClose: true, message: err.toString(), duration: 2000});
            }
          }).catch((e) => {
            if (e && e.response) {
              switch (e.response.status) {
                case 504:
                  this.$message({showClose: true, message: '服务器异常', type: 'warning'});
                  this.loading = false;//隐藏加载条
                  break;
                case 500:
                  this.$message({showClose: true, message: '服务器异常', type: 'warning'});
                  this.loading = false;//隐藏加载条
                  break;
                case 405:
                  this.$message({showClose: true, message: '请先登录', type: 'warning'});
                  break
              }
            }
          })
        })
      }
    },
    mounted() { //初始化页面
      axios({
        url:this.global.mPath + '/login/admin_info',
        method:'post',
        params:{
          token:sessionStorage.getItem('token')
        }
      }).then((res) => {
        // console.log(res.data.success)
        if(res.data.success){
          this.handleSearch()
        }else{
          this.$router.replace('/');
        }
      })
    }
  }
</script>

<style scoped>
  .toolbar {
    margin-top: 20px;
  }

  img {
    width: 180px;
    height: 120px;
    margin:0;
  }
</style>
