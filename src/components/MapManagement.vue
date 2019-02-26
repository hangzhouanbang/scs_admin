  <template>
    <el-row class="warp">
      <el-col :span="24" class="warp-breadcrum">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }"><b>推广员中心</b></el-breadcrumb-item>
          <el-breadcrumb-item>推广图管理</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
      <el-form :model="adjustForm" label-width="100px" class="demo-ruleForm" style="margin-top:30px;">
        <el-form-item>
        <span>提示：背景图大小550*960px; 二维码留白大小160*160px,位置x:30px  y:500px</span>
        </el-form-item>
        <el-form-item prop="productPic" class="IMG">
          <div class="upload" @click="getImageTypeIndex(1)">
            <el-upload
              class="avatar-uploader"
              id="1"
              :action=domain
              :http-request=upqiniu
              :show-file-list="false"
              :before-upload="beforeUpload">
              <div class="btn sc">上传</div>
            </el-upload>
          </div>
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <el-button type="primary" v-if="imageUrl" class="btn" @click.native="del(id)">删除</el-button>
        </el-form-item>
        <el-form-item prop="productPic" class="IMG">
          <div class="upload" @click="getImageTypeIndex(2)">
            <el-upload
              class="avatar-uploader"
              id="2"
              :action=domain
              :http-request=upqiniu
              :show-file-list="false"
              :before-upload="beforeUpload">
              <div class="btn sc">上传</div>
            </el-upload>
          </div>
          <img v-if="imageUrl1" :src="imageUrl1" class="avatar">
          <el-button type="primary" v-if="imageUrl1" class="btn" @click.native="del(id1)">删除</el-button>
        </el-form-item>
        <el-form-item prop="productPic" class="IMG">
          <div class="upload" @click="getImageTypeIndex(3)">
            <el-upload
              class="avatar-uploader"
              id="3"
              :action=domain
              :http-request=upqiniu
              :show-file-list="false"
              :before-upload="beforeUpload">
              <div class="btn sc">上传</div>
            </el-upload>
          </div>
          <img v-if="imageUrl2" :src="imageUrl2" class="avatar">
          <el-button type="primary" v-if="imageUrl2" class="btn" @click.native="del(id2)">删除</el-button>
        </el-form-item>
      </el-form>
    </el-row>
  </template>

  <script>
    import axios from 'axios'
      export default {
        name: "MapManagement",
        data(){
          return{
            // 七牛云的上传地址，根据自己所在地区选择，这里是华东区
            domain: 'http://up.qiniu.com',
            // 这是七牛云空间的外链默认域名
            qiniuaddr: 'qiniu.3cscy.com',
            imageUrl: '',
            imageUrl1: '',
            imageUrl2: '',
            order:'',
            adjustForm:{},
            id:'',
            id1:'',
            id2:'',
            imageList:[],
          }
        },
        methods:{
          getImageTypeIndex(index){
            this.order = index;
            // console.log(index)
          },
          // 上传文件到七牛云
          upqiniu(req) {
            // console.log(req)
            this.dialogVisible = true;
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
            const keyname = 'anbang' + Math.random() + '.' + filetype;
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
              const formdata = new FormData();
              console.log(req.file)
              formdata.append('file', req.file);
              formdata.append('token', res.data.data);
              formdata.append('key', keyname);
              // 获取到凭证之后再将文件上传到七牛云空间
              axios.post(this.domain, formdata, config).then(res => {
                // this.imageUrl = 'http://' + this.qiniuaddr + '/' + res.data.key
                axios({
                  method: 'post',
                  url: this.global.mPath + '/agent/addimage',
                  headers: {
                    'Content-type': 'application/x-www-form-urlencoded'
                  },
                  params:{
                    token:sessionStorage.getItem('token'),
                    fileName:res.data.key,
                    ordinal:this.order
                  }
                }).then(res => {
                  // console.log(res.data)
                  if(res.data.success){
                    this.$message({showClose: true, message: '上传成功', type: 'success'});
                    this.handleSearch()
                  }else{
                    this.$message({showClose: true, message: '上传失败', type: 'warning'});
                  }
                })
              })
            })
          },
          // 验证文件合法性
          beforeUpload(file) {
            const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isJPG) {
              this.$message.error('上传头像图片只能是 JPG 格式!')
            }
            if (!isLt2M) {
              this.$message.error('上传头像图片大小不能超过 2MB!')
            }
            return isJPG && isLt2M
          },
          handleSearch(){
            axios({
              method: 'post',
              url: this.global.mPath + '/agent/queryimage',
              headers: {
                'Content-type': 'application/x-www-form-urlencoded'
              },
              params:{
                token:sessionStorage.getItem('token'),
              }
            }).then(res => {
              // console.log(res.data)
              this.imageList = res.data.data.imageList;
              for(let i = 0;i <  this.imageList.length;i++){
                if(this.imageList[i].ordinal === 1){
                  this.imageUrl = res.data.data.imageList[i].downloadUrl;
                  this.id = res.data.data.imageList[i].id
                }
                if(this.imageList[i].ordinal === 2){
                  this.imageUrl1 = res.data.data.imageList[i].downloadUrl;
                  this.id1 = res.data.data.imageList[i].id
                }
                if(this.imageList[i].ordinal === 3){
                  this.imageUrl2 = res.data.data.imageList[i].downloadUrl;
                  this.id2 = res.data.data.imageList[i].id
                }
              }
            })
          },
          del(imageId){
            // console.log(imageId)
            this.$confirm('确认删除吗？', '提示', {
              type: 'warning'
            }).then(() => {
              axios({
                method: 'post',
                url: this.global.mPath + '/agent/deleteimage',
                headers: {
                  'Content-type': 'application/x-www-form-urlencoded'
                },
                params: {
                  token: sessionStorage.getItem('token'),
                  imageId: imageId
                }
              }).then(res => {
                // console.log(res.data)
                if(res.data.success){
                  this.$message({showClose: true, message: '删除成功', type: 'success'});
                  this.handleSearch()
                }else{
                  this.$message({showClose: true, message: '删除失败', type: 'warning'});
                }
              })
            })
          }
        },
        mounted(){
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

  <style lang="scss">
    .IMG{
      width:200px;
      height:300px;
      border:1px solid #000;
      float:left;
      margin-left:20px;
    }
    .IMG:nth-child(2){
      margin-left:100px;
    }
    .upload{
      position: relative;
    }
    .btn{
      position: absolute;
      top:325px;
      left:-40px;
    }
    .avatar{
      width: 190px;
      height: 290px;
      margin: -36px 0 0 -95px;
    }
    .sc{
      color: #fff;
      background-color: #409EFF;
      border-color: #409EFF;
      cursor: pointer;
      width:70px;
      height:40px;
      text-align: center;
      line-height: 40px;
      font-size: 14px;
      border-radius: 4px;
    }
  </style>
