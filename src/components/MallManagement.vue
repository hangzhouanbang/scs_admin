<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>推广员中心</b></el-breadcrumb-item>
        <el-breadcrumb-item>推广员商城管理</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main" v-loading="loading" element-loading-text="拼命加载中">
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="filters">
          <el-form-item>
            <el-button type="primary" @click="showAddDialog">添加商品</el-button>
          </el-form-item>
        </el-form>
      </el-col>

      <el-table :data="list" highlight-current-row @selection-change="selsChange"
                style="width: 100%;">
        <el-table-column prop="title" label="商品类型" width="100" sortable></el-table-column>
        <el-table-column prop="file" label="数量" width="100" sortable></el-table-column>
        <el-table-column prop="number" label="库存数量" width="100" sortable></el-table-column>
        <el-table-column prop="number" label="剩余数量" width="100" sortable></el-table-column>
        <el-table-column prop="number" label="价格" width="100" sortable></el-table-column>
        <el-table-column prop="number" label="ICON图" width="100" sortable></el-table-column>
        <el-table-column prop="number" label="支付方式" width="100" sortable></el-table-column>
        <el-table-column prop="number" label="是否可用" width="100" sortable></el-table-column>
        <el-table-column prop="number" label="排序" width="100" sortable></el-table-column>
        <el-table-column prop="remainSecond" label="操作">
          <template slot-scope="scope">
            <el-button size="small" @click="publishDialog(scope.$index,scope.row)">删除</el-button>
            <el-button size="small" @click="publishDialog(scope.$index,scope.row)">调整</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--工具条-->
      <el-col :span="24" class="toolbar">
        <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="1" :total="total"
                       style="float:right;">
        </el-pagination>
      </el-col>

      <!--添加商品-->
      <el-dialog title="添加商品" :visible.sync="addFormVisible" :close-on-click-modal="false">
      <el-form :model="normalForm" label-width="100px" :rules="rules" class="demo-ruleForm">
        <el-form-item label="商品类型" prop="title">
          <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品数量" prop="title" style="width:317px;">
          <el-input v-model="normalForm.title" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="库存数量" prop="title" style="width:317px;">
          <el-input v-model="normalForm.title" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="支付方式" prop="title">
          <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in payment"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="价格" prop="address">
          <el-input v-model="normalForm.address" auto-complete="off" style="width:217px;"></el-input> 元/积分
        </el-form-item>
        <el-form-item label="ICON图" prop="file">
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
        <el-form-item>
          <el-button type="primary" @click="issue">确认添加</el-button>
          <el-button type="primary" @click.native="addFormVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

      <!--调整-->
      <el-dialog title="调整商品" :visible.sync="adjustmentVisible" :close-on-click-modal="false">
        <el-form :model="normalForm" label-width="100px" :rules="rules" class="demo-ruleForm">
          <el-form-item label="商品类型" prop="title">
            <el-select v-model="value" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商品数量" prop="title" style="width:317px;">
            <el-input v-model="normalForm.title" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="库存数量" prop="title" style="width:317px;">
            <el-input v-model="normalForm.title" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="支付方式" prop="title">
            <el-select v-model="value" placeholder="请选择">
              <el-option
                v-for="item in payment"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="价格" prop="address">
            <el-input v-model="normalForm.address" auto-complete="off" style="width:217px;"></el-input> 元/积分
          </el-form-item>
          <el-form-item label="是否可用" prop="address">
            <el-radio v-model="radio" label="1">是</el-radio>
            <el-radio v-model="radio" label="2">否</el-radio>
          </el-form-item>
          <el-form-item label="ICON图" prop="file">
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
          <el-form-item>
            <el-button type="primary" @click="issue">确认添加</el-button>
            <el-button type="primary" @click.native="addFormVisible = false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>

      <!--删除-->
      <el-dialog title="删除商品" :visible.sync="RemoveItemVisible" width="37%" center >
        <p>是否确认删除以下商品？</p>
        <img src="../assets/images/girl.jpg" alt="">
        <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="centerDialogVisible = false" class="agree">确认删除</el-button>
        <el-button type="primary" @click="centerDialogVisible = false">取消</el-button>
      </span>
      </el-dialog>
    </el-col>
  </el-row>
</template>

<script>
    import axios from 'axios'
    export default {
        name: "MallManagement",
      data(){
          return{
            addFormVisible:false,
            loading:false,
            adjustmentVisible:false,
            RemoveItemVisible:false,
            total:0,
            list:[],
            normalForm:{},
            filters: {
              name: ''
            },
            // 七牛云的上传地址，根据自己所在地区选择，这里是华东区
            domain: 'http://up.qiniu.com',
            // 这是七牛云空间的外链默认域名
            qiniuaddr: 'paly4iump.bkt.clouddn.com',
            rules: {
              title: [
                {required: true, message: '请输入标题', trigger: 'blur'}
              ],
              file: [
                {required: true, message: '请选择图片', trigger: 'blur'}
              ],
              address: [
                {required: true, message: '请选择图片', trigger: 'blur'}
              ]
            },
            imageUrl: '',
            options:[
              {value:'周卡'},
              {value:'月卡'},
              {value:'季卡'}
            ],
            payment:[
              {value:'微信支付'},
              {value:'积分兑换'}
            ]
          }
      },
      methods:{
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
        handleSearch(){
          axios({
            url:'/api/'
          })
        },
        showAddDialog:function(){
          this.addFormVisible = true;
        }
      },
      mounted(){
        this.handleSearch()
      }
    }
</script>

<style scoped>
  .toolbar{
    margin-top:30px;
  }
  p{
    text-align: center;
    font-size:18px;
  }
  img{
    margin-left:160px;
  }
</style>
