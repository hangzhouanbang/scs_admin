<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>签到管理</b></el-breadcrumb-item>
        <el-breadcrumb-item>奖励管理</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <!--<el-form-item>-->
          <!--<el-button type="primary" v-on:click="viewPreview">查看预览</el-button>-->
        <!--</el-form-item>-->
        <el-form-item>
          <el-button type="primary" @click="showAddDialog">发布</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="AddDialog">添加</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!-- 奖品设置列表-->
    <el-table :data="lottery" highlight-current-row
              style="width:100%;" id="out-table">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column type="index" width="60" label="序号"></el-table-column>
      <el-table-column prop="name" label="奖励备注" width="160" sortable></el-table-column>
      <el-table-column prop="type" label="类型" width="120" sortable></el-table-column>
      <el-table-column prop="singleNum" label="单奖数量" width="120" sortable></el-table-column>
      <el-table-column prop="lotteryNum" label="已抽取数量" width="120" sortable></el-table-column>
      <el-table-column prop="storeNum" label="库存数量" width="120" sortable></el-table-column>
      <el-table-column prop="iconUrl" label="icon图" width="120" sortable>
        <template slot-scope="scope">
          <img :src="scope.row.iconUrl" alt="" style="width: 50px;height: 50px">
        </template>
      </el-table-column>
      <el-table-column prop="prizeProb" label="中奖概率" width="120" sortable></el-table-column>
      <el-table-column prop="firstPrizeProb" label="首次中奖概率" width="160" sortable></el-table-column>
      <el-table-column prop="overstep" label="超额奖池" width="160" sortable></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="small" @click="adjustmentDialog(scope.$index,scope.row)">调整</el-button>
          <el-button type="danger" @click="delBook(scope.$index,scope.row)" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--调整-->
    <el-dialog title="" :visible.sync="adjustmentVisible" :close-on-click-modal="false">
      <el-form :model="adjustForm" label-width="120px" :rules="addFormRules" ref="adjustForm">
        <el-form-item label="奖励备注" prop="name" required>
          <el-input v-model="adjustForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="奖励类别" prop="type" required>
          <el-select v-model="adjustForm.type" placeholder="请选择">
            <el-option
              v-for="item in types"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单奖数量" prop="singleNum" required>
          <el-input v-model="adjustForm.singleNum" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="库存数量" prop="storeNum" required>
          <el-input v-model="adjustForm.storeNum" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="icon图" prop="iconUrl" required>
          <div class="upload">
            <el-upload
              class="avatar-uploader"
              :action=domain
              :http-request=upqiniu
              :show-file-list="false"
              :before-upload="beforeUpload">
              <img v-if="imageUrl1" :src="imageUrl1" class="avatar">
              <el-button v-else class="el-icon-plus avatar-uploader-icon"></el-button>
            </el-upload>
          </div>
        </el-form-item>
        <el-form-item label="中奖概率" prop="prizeProb" required>
          <el-input v-model="adjustForm.prizeProb" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="首次中奖概率" prop="firstPrizeProb" required>
          <el-input v-model="adjustForm.firstPrizeProb" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="加入超额奖池" prop="overstep" required>
          <el-select v-model="adjustForm.overstep" placeholder="请选择">
            <el-option
              v-for="item in jackpot"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="publishVisible = false">取消</el-button>
        <el-button type="primary" @click.native="adjustSubmit">确认</el-button>
      </div>
    </el-dialog>

    <!--添加商品-->
    <el-dialog title="添加商品" :visible.sync="addVisible" :close-on-click-modal="false">
      <el-form :model="addForm" label-width="120px" :rules="addFormRules" ref="addForm">
        <el-form-item label="奖励备注" prop="name" required>
          <el-input v-model="addForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="奖励类别" prop="type" required>
          <el-select v-model="addForm.type" placeholder="请选择">
            <el-option
              v-for="item in types"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数量" prop="singleNum" required>
          <el-input v-model="addForm.singleNum" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="库存数量" prop="storeNum" required>
          <el-input v-model="addForm.storeNum" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="icon图" prop="iconUrl" required>
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
        <el-form-item label="中奖概率" prop="prizeProb" required>
          <el-input v-model="addForm.prizeProb" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="首次中奖概率" prop="firstPrizeProb" required>
          <el-input v-model="addForm.firstPrizeProb" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="超额奖池" prop="overstep" required>
          <el-select v-model="addForm.overstep" placeholder="请选择">
            <el-option
              v-for="item in jackpot"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="publishVisible = false">取消</el-button>
        <el-button type="primary" @click.native="publishSubmit">确认</el-button>
      </div>
    </el-dialog>

    <!--奖励个数添加不足-->
    <el-dialog title="" :visible.sync="tipVisible" :close-on-click-modal="false" width="400px" class="tip">
      <div class="title">提示</div>
      <div class="content">奖励个数添加不足! <br>请确保已设置10个奖励后再发布!</div>
      <div class="footer">
        <el-button @click.native="tipVisible = false" style="margin:30px 0 0 80px;">取消</el-button>
        <el-button type="primary" @click.native="tipVisible = false" style="margin:30px 0 0 55px;">确认</el-button>
      </div>
    </el-dialog>

    <!--当前中奖概率设置-->
    <el-dialog title="" :visible.sync="tip1Visible" :close-on-click-modal="false" width="400px" class="tip">
      <div class="title">提示</div>
      <div class="content1">概率设置异常，发布失败！<br>当前中奖概率设置超过100%，请重设！</div>
      <div class="footer">
        <el-button @click.native="tip1Visible = false" style="margin:30px 0 0 80px;">取消</el-button>
        <el-button type="primary" @click.native="tip1Visible = false" style="margin:30px 0 0 55px;">确认</el-button>
      </div>
    </el-dialog>

    <!--当前首重概率设置-->
    <el-dialog title="" :visible.sync="tip2Visible" :close-on-click-modal="false" width="400px" class="tip">
      <div class="title">提示</div>
      <div class="content1">概率设置异常，发布失败！<br>当前首重概率设置超过100%，请重设！</div>
      <div class="footer">
        <el-button @click.native="tip2Visible = false" style="margin:30px 0 0 80px;">取消</el-button>
        <el-button type="primary" @click.native="tip2Visible = false" style="margin:30px 0 0 55px;">确认</el-button>
      </div>
    </el-dialog>

    <!--发布成功-->
    <el-dialog title="" :visible.sync="tip3Visible" :close-on-click-modal="false" width="400px" class="tip">
      <div class="title">提示</div>
      <div class="content1" style="text-align: center;">奖励信息发布成功！</div>
      <div class="footer">
        <el-button @click.native="tip3Visible = false" style="margin:30px 0 0 80px;">取消</el-button>
        <el-button type="primary" @click.native="tip3Visible = false" style="margin:30px 0 0 55px;">确认</el-button>
      </div>
    </el-dialog>

    <!--个数超10个-->
    <el-dialog title="" :visible.sync="tip4Visible" :close-on-click-modal="false" width="400px" class="tip">
      <div class="title">提示</div>
      <div class="content1" style="text-align: center;">添加商品总个数超过10个!</div>
      <div class="footer">
        <el-button @click.native="tip4Visible = false" style="margin:30px 0 0 80px;">取消</el-button>
        <el-button type="primary" @click.native="tip4Visible = false" style="margin:30px 0 0 55px;">确认</el-button>
      </div>
    </el-dialog>

  </el-row>

</template>

<script>
    import axios from 'axios'
    export default {
        name: "Lottery",
        data(){
          return{
            adjustmentVisible:false,
            addVisible:false,
            imageUrl: '',
            imageUrl1: '',
            addFormRules: {
              name: [
                {required: true, message: '请输入奖励备注', trigger: 'blur'}
              ],
              type:[
                {required: true, message: '请选择奖励类别', trigger: 'change'}
              ],
              singleNum: [
                {required: true, message: '请输入数量', trigger: 'blur'}
              ],
              storeNum: [
                {required: true, message: '请输入库存数量', trigger: 'blur'}
              ],
              prizeProb: [
                {required: true, message: '请输入中奖概率', trigger: 'blur'}
              ],
              firstPrizeProb: [
                {required: true, message: '请输入首次中奖概率', trigger: 'blur'}
              ],
              overstep:[
                {required: true, message: '请选择超额奖池', trigger: 'change'}
              ]
            },
            adjustForm:{},
            addForm:{},
            items:[
              {value:'玉石'},
              {value:'会员周卡'},
              {value:'会员月卡'},
              {value:'会员季卡'},
              {value:'红包点'},
              {value:'实物'},
            ],
            types:[
              {value:'红包'},
              {value:'会员卡'},
              {value:'玉石'},
              {value:'实物'},
              {value:'话费'},
            ],
            jackpot:[
              {value:'是'},
              {value:'否'},
            ],
            lottery:[],
            filters:{},
            // 七牛云的上传地址，根据自己所在地区选择，这里是华东区
            domain: 'http://up.qiniu.com',
            // 这是七牛云空间的外链默认域名
            qiniuaddr: 'qiniu.3cscy.com',
            tipVisible:false,
            tip1Visible:false,
            tip2Visible:false,
            tip3Visible:false,
            tip4Visible:false,
            previewVisible:false,
          }
        },
      methods:{
        // 上传文件到七牛云
        upqiniu(req) {
          console.log(req)
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
              this.imageUrl1 = 'http://' + this.qiniuaddr + '/' + res.data.key
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
        handleSearch:function(){
          axios({
            method: 'post',
            url: this.global.mPath + '/signin/querysigninprize',
            headers: {
              'Content-type': 'application/x-www-form-urlencoded'
            },
            params: {
            }
          })
            .then((res) => {
                this.loading = false;//隐藏加载条
                this.lottery = res.data.data;
                //console.log(res.data.data)
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
        adjustmentDialog:function(index,row){
          this.adjustmentVisible = true;
          this.adjustForm = Object.assign({}, row);
          this.imageUrl1 = this.adjustForm.iconUrl
        },
        adjustSubmit:function(){
          axios({
            method: 'post',
            url: this.global.mPath + '/signin/updatesigninprize',
            headers: {
              'Content-type': 'application/x-www-form-urlencoded'
            },
            params: {
              id:this.adjustForm.id,
              name:this.adjustForm.name,
              type:this.adjustForm.name,
              singleNum:this.adjustForm.singleNum,
              storeNum:this.adjustForm.storeNum,
              iconUrl:this.imageUrl1,
              prizeProb:this.adjustForm.prizeProb,
              firstPrizeProb:this.adjustForm.firstPrizeProb,
              overstep:this.adjustForm.overstep,
              token:sessionStorage.getItem('token')
            }
          })
            .then((res) => {
              if (res.data.success == true) {
                this.adjustmentVisible = false;
                this.$message.success({showClose: true, message: '调整成功', duration: 1500});
                this.handleSearch(1);
              } else {
                this.$message.error({showClose: true, message: err.toString(), duration: 2000});
              }
              },
            ).catch((e) => {
            this.loading = false;
            console.log(error);
            this.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
          });
        },
        showAddDialog:function(){
          this.$confirm('确认发布吗？', '提示', {
            type: 'warning'
          }).then(() => {
            axios({
              method: 'post',
              url: this.global.mPath + '/signin/releasesigninprize ',
              headers: {
                'Content-type': 'application/x-www-form-urlencoded'
              },
              params: {
              }
            })
              .then((res) => {
                  if (res.data.success == true) {
                    this.tip3Visible = true;
                    this.$message.success({showClose: true, message: '发布成功', duration: 1500});
                    this.handleSearch(1);
                  } else {
                    if(res.data.msg == 'notEnough'){
                      this.tipVisible = true;
                    }else if(res.data.msg == 'PrizeProbOverstep'){
                      this.tip1Visible = true;
                    }else if(res.data.msg == 'FirstPrizeProbOverstep'){
                      this.tip2Visible = true;
                    }
                  }
                },
              ).catch((e) => {
              this.loading = false;
              this.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
            });
          })
        },
        AddDialog:function(){
          this.addVisible = true;
        },
        publishSubmit:function(){
          axios({
            method: 'post',
            url: this.global.mPath + '/signin/addsigninprize',
            headers: {
              'Content-type': 'application/x-www-form-urlencoded'
            },
            params: {
              name:this.addForm.name,
              type:this.value,
              singleNum:this.addForm.singleNum,
              storeNum:this.addForm.storeNum,
              iconUrl:this.imageUrl,
              prizeProb:this.addForm.prizeProb,
              firstPrizeProb:this.addForm.firstPrizeProb,
              overstep:this.value1,
              token:sessionStorage.getItem('token')
            }
          })
            .then((res) => {
                if (res.data.success == true) {
                  this.addVisible = false;
                  this.$message.success({showClose: true, message: '添加成功', duration: 1500});
                  this.handleSearch(1);
                } else {
                  if(res.data.msg == 'overstep'){
                    this.tip4Visible = true;
                  }else{
                    this.$message.error({showClose: true, message: err.toString(), duration: 2000});
                  }
                }
              },
            ).catch((e) => {
            this.loading = false;
            this.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
          });
        },
        delBook:function(index,row){
          this.$confirm('确认删除选中记录吗？', '提示', {
            type: 'warning'
          }).then(() => {
            axios({
              method: 'post',
              url: this.global.mPath + '/signin/deletesigninprizebyid',
              headers: {
                'Content-type': 'application/x-www-form-urlencoded'
              },
              params: {
                id: row.id
              }
            })
              .then((res) => {
                  if (res.data.success == true) {
                    this.addVisible = false;
                    this.$message.success({showClose: true, message: '删除成功', duration: 1500});
                    this.handleSearch(1);
                  } else {
                    this.$message.error({showClose: true, message: err.toString(), duration: 2000});
                  }
                },
              ).catch((e) => {
              this.loading = false;
              console.log(error);
              this.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
            });
          })
        }
      },
      mounted(){
       this.handleSearch();
      },

    }
</script>

<style scoped>
  .toolbar{
    margin-top:30px;
  }
  .el-input{
    width:300px;
  }
 .avatar-uploader img{
   width:150px;
   height:100px;
 }
  .title{
    width: 400px;
    height: 43px;
    text-align: center;
    border-bottom: 1px solid #eee;
    margin: -50px 0 0 -20px;
    line-height:43px;
    font-size:20px;
  }
  .content{
    width: 290px;
    padding:55px;
    margin: 0 0 0 -20px;
    font-size:20px;
    border-bottom: 1px solid #eee;
  }
  .content1{
    width: 360px;
    padding: 55px 20px;
    margin: 0 0 0 -20px;
    font-size: 20px;
    border-bottom: 1px solid #eee;
  }

</style>
