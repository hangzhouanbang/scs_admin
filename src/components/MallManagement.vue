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
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type="index" width="60"></el-table-column>
        <el-table-column prop="product" label="商品类型" width="100" sortable></el-table-column>
        <el-table-column prop="number" label="数量" width="100" sortable></el-table-column>
        <el-table-column prop="repertory" label="库存数量" width="100" sortable></el-table-column>
        <el-table-column prop="remain" label="剩余数量" width="100" sortable></el-table-column>
        <el-table-column prop="price" label="价格" width="100" sortable></el-table-column>
        <el-table-column prop="productPic" label="ICON图" width="100" sortable>
          <template slot-scope="scope">
            <img :src="scope.row.productPic" alt="" style="width: 50px;height: 50px;">
          </template>
        </el-table-column>
        <el-table-column prop="payType" label="支付方式" width="100" sortable></el-table-column>
        <el-table-column prop="sale" label="是否可用" width="100" sortable></el-table-column>
        <el-table-column prop="weight" label="排序" width="100" sortable></el-table-column>
        <el-table-column prop="remainSecond" label="操作">
          <template slot-scope="scope">
            <el-button size="small" @click="deleteDialog(scope.$index,scope.row)">删除</el-button>
            <el-button size="small" @click="adjustDialog(scope.$index,scope.row)">调整</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--工具条-->
      <el-col :span="24" class="toolbar">
        <el-button type="danger" @click="batchDeleteBook" :disabled="this.sels.length===0">批量删除</el-button>
        <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="1" :total="total"
                       style="float:right;">
        </el-pagination>
      </el-col>

      <!--添加商品-->
      <el-dialog title="添加商品" :visible.sync="addFormVisible" :close-on-click-modal="false">
      <el-form :model="normalForm" label-width="100px" :rules="rules" class="demo-ruleForm">
        <el-form-item label="商品类型" prop="product">
          <el-select v-model="normalForm.product" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品数量" prop="number" style="width:317px;">
          <el-input v-model="normalForm.number" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="库存数量" prop="repertory" style="width:317px;">
          <el-input v-model="normalForm.repertory" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="支付方式" prop="payType">
          <el-select v-model="normalForm.payType" placeholder="请选择">
            <el-option
              v-for="item in payment"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input v-model="normalForm.price" auto-complete="off" style="width:217px;"></el-input> 元/积分
        </el-form-item>
        <el-form-item label="ICON图" prop="productPic">
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
          <el-button type="primary" @click="issue()">确认添加</el-button>
          <el-button type="primary" @click.native="addFormVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

      <!--调整-->
      <el-dialog title="调整商品" :visible.sync="adjustmentVisible" :close-on-click-modal="false">
        <el-form :model="adjustForm" label-width="100px" :rules="rules" class="demo-ruleForm">
          <el-form-item label="商品类型" prop="product">
            <el-select v-model="adjustForm.product" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商品数量" prop="number" style="width:317px;">
            <el-input v-model="adjustForm.number" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="库存数量" prop="repertory" style="width:317px;">
            <el-input v-model="adjustForm.repertory" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="支付方式" prop="payType">
            <el-select v-model="adjustForm.payType" placeholder="请选择">
              <el-option
                v-for="item in payment"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="价格" prop="price">
            <el-input v-model="adjustForm.price" auto-complete="off" style="width:217px;"></el-input> 元/积分
          </el-form-item>
          <el-form-item label="是否可用">
            <el-radio v-model="radioData" label="true">是</el-radio>
            <el-radio v-model="radioData" label="false">否</el-radio>
          </el-form-item>
          <el-form-item label="ICON图" prop="productPic">
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
            <el-button type="primary" @click="Adjust()">确认添加</el-button>
            <el-button type="primary" @click.native="adjustmentVisible = false">取消</el-button>
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
            img:true,
            normalForm:{},
            adjustForm:{},
            filters: {},
            radioData:'',
            // 七牛云的上传地址，根据自己所在地区选择，这里是华东区
            domain: 'http://up.qiniu.com',
            // 这是七牛云空间的外链默认域名
            qiniuaddr: 'qiniu.3cscy.com',
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
            ],
            sels: [],
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
          }).then(res => {
            const formdata = new FormData()
            formdata.append('file', req.file)
            formdata.append('token', res.data.data)
            formdata.append('key', keyname)
            // 获取到凭证之后再将文件上传到七牛云空间
            axios.post(this.domain, formdata, config).then(res => {
              this.imageUrl = 'http://' + this.qiniuaddr + '/' + res.data.key
              this.img = false;
              console.log(this.imageUrl)
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
        handleSearch(page){
          axios({
            url:'/api/agent/queryagentclubcard',
            method:'post',
            params:{
              page:page,
              size:10
            }
          }).then((res) => {
            console.log(res.data.data.items)
            this.list = res.data.data.items;
            this.total = res.data.data.pageCount;
            for(let i = 0;i < this.list.length;i++){
              if(this.list[i].sale == true){
                this.list[i].sale = '是'
              }else{
                this.list[i].sale = '否'
              }
            }
          }).catch((e) => {
            if (e && e.response) {
              switch (e.response.status) {
                case 504:
                  this.$message({
                    showClose: true,
                    message: '服务器异常',
                    type: 'warning'
                  });
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
          })
        },
        showAddDialog:function(){
          this.addFormVisible = true;
        },
        issue:function() {
          axios({
            method: 'post',
            url: '/api/agent/addagentclubcard',
            headers: {
              'Content-type': 'application/x-www-form-urlencoded'
            },
            params: {
              product:this.normalForm.product,
              number:this.normalForm.number,
              price:this.normalForm.price,
              repertory:this.normalForm.repertory,
              payType:this.normalForm.payType,
              productPic:this.imageUrl,
              weight:Math.floor(Math.random()*10)
            }
          })
            .then((res) => {
                if (res.data.success == false) {
                  this.$message({
                    showClose: true,
                    message: '添加失败',
                    type: 'warning'
                  });
                } else if (res.data.success == true) {
                  this.$message({
                    showClose: true,
                    message: '添加成功',
                    type: 'success'
                  });
                  this.addFormVisible = false;//关闭弹窗
                  this.handleSearch(1);
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
        handleCurrentChange(val) {
          this.page = val;
          this.handleSearch(this.page);
        },
        adjustDialog:function(index,row){
          this.imageUrl = '';
          this.adjustmentVisible = true;
          this.adjustForm = Object.assign({}, row);
          console.log(this.adjustForm)
          if(this.adjustForm.sale == '是'){
            this.radioData = 'true';
          }
          if(this.adjustForm.sale == '否'){
            this.radioData = 'false';
          }
          if(this.imageUrl == ''){
            this.imageUrl = this.adjustForm.productPic;
          }
        },
        Adjust:function(){
            this.loading = true;
            axios({
              method: 'post',
              url: '/api/agent/updateagentclubcard',
              headers: {
                'Content-type': 'application/x-www-form-urlencoded'
              },
              params: {
                id:this.adjustForm.id,
                product:this.adjustForm.product,
                number:this.adjustForm.number,
                price:this.adjustForm.price,
                repertory:this.adjustForm.repertory,
                payType:this.adjustForm.payType,
                productPic:this.imageUrl,
                sale:this.radioData,
                weight:Math.floor(Math.random()*10)
              }
            })
              .then((res) => {
                  this.loading = false;
                  if (res.data.success == true) {
                    this.adjustmentVisible = false;
                    this.$message.success({showClose: true, message: '修改成功', duration: 1500});
                    this.handleSearch(1);
                  } else {
                    this.$message.error({showClose: true, message: err.toString(), duration: 2000});
                  }
                },
              ).catch((e) => {
              this.loading = false;
              console.log(e);
              this.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
            });
          },
        deleteDialog:function(index,row){
          this.loading = true;
          axios({
            method: 'post',
            url: '/api/agent/deleteagentclubcard',
            headers: {
              'Content-type': 'application/x-www-form-urlencoded'
            },
            params: {
              'cardId': row.id
            }
          }).then((res) => {
              this.loading = false;
              if (res.data.success == true) {
                this.$message.success({showClose: true, message: '删除成功', duration: 1500});
                this.handleSearch(1);
              } else {
                this.$message.error({showClose: true, message: err.toString(), duration: 2000});
              }
            },
          ).catch((e) => {
            that.loading = false;
            console.log(error);
            that.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
          });
        },
        batchDeleteBook:function(){
          let ids = this.sels.map(item => item.id).toString();
          let that = this;
          this.$confirm('确认删除选中记录吗？', '提示', {
            type: 'warning'
          }).then(() => {
            that.loading = true;
            axios({
              method: 'post',
              url: '/api/agent/deleteagentclubcard',
              headers: {
                'Content-type': 'application/x-www-form-urlencoded'
              },
              params: {
                'cardId': ids
              }
            })
              .then((res) => {
                  that.loading = false;
                  if (res.data.success == true) {
                    that.$message.success({showClose: true, message: '删除成功', duration: 1500});
                    that.handleSearch(1);
                  } else {
                    that.$message.error({showClose: true, message: err.toString(), duration: 2000});
                  }
                },
              ).catch((e) => {
              that.loading = false;
              console.log(error);
              that.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
            });
          });
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
  .avatar{
    width:100px;
    height:100px;
  }
</style>
