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
      <el-table-column prop="desc" label="类型" width="120" sortable></el-table-column>
      <el-table-column prop="desc" label="单奖数量" width="120" sortable></el-table-column>
      <el-table-column prop="type" label="已抽取数量" width="120" sortable></el-table-column>
      <el-table-column prop="taskName" label="库存数量" width="120" sortable></el-table-column>
      <el-table-column prop="taskName" label="icon图" width="120" sortable></el-table-column>
      <el-table-column prop="taskName" label="中奖概率" width="120" sortable></el-table-column>
      <el-table-column prop="taskName" label="首次中奖概率" width="160" sortable></el-table-column>
      <el-table-column prop="taskName" label="超额奖池" width="160" sortable></el-table-column>
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
        <el-form-item label="奖励类别" prop="name" required>
          <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in types"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单奖数量" prop="desc" required>
          <el-input v-model="adjustForm.desc" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="库存数量" prop="desc" required>
          <el-input v-model="adjustForm.desc" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="icon图" prop="type" required>
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
        <el-form-item label="中奖概率" prop="taskName" required>
          <el-input v-model="adjustForm.taskName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="首次中奖概率" prop="goldNumber" required>
          <el-input v-model="adjustForm.goldNumber" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="加入超额奖池" prop="name" required>
          <el-select v-model="value" placeholder="请选择">
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

    <!--添加商品-->
    <el-dialog title="添加商品" :visible.sync="addVisible" :close-on-click-modal="false">
      <el-form :model="addForm" label-width="120px" :rules="addFormRules" ref="addForm">
        <el-form-item label="奖励备注" prop="name" required>
          <el-input v-model="addForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="奖励类别" prop="name" required>
          <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in types"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数量" prop="desc" required>
          <el-input v-model="addForm.desc" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="库存数量" prop="desc" required>
          <el-input v-model="addForm.desc" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="icon图" prop="type" required>
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
        <el-form-item label="中奖概率" prop="taskName" required>
          <el-input v-model="addForm.taskName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="首次中奖概率" prop="goldNumber" required>
          <el-input v-model="addForm.goldNumber" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="publishVisible = false">取消</el-button>
        <el-button type="primary" @click.native="publishSubmit">确认</el-button>
      </div>
    </el-dialog>

    <!--提示-->
    <!--<el-dialog title="" :visible.sync="tipVisible" :close-on-click-modal="false">-->
      <!--<div class="title">提示</div>-->
      <!--<div class="content">奖励个数添加不足! <br>请确保已设置10个奖励后再发布!</div>-->
      <!--<div slot="footer" class="dialog-footer">-->
        <!--<el-button @click.native="publishVisible = false">取消</el-button>-->
        <!--<el-button type="primary" @click.native="publishSubmit">确认</el-button>-->
      <!--</div>-->
    <!--</el-dialog>-->

    <!--查看预览-->
    <!--<el-dialog title="签到转盘预览" :visible.sync="previewVisible" :close-on-click-modal="false" width="340px">-->
      <!--<canvas id="canvas" width="300px" height="300px"></canvas>-->
      <!--<img src="../assets/images/zhuanpan.png" alt="" style="width: 280px;height: 280px;position: absolute;top: 92px;left: 30px;">-->
    <!--</el-dialog>-->
  </el-row>

</template>

<script>
    import axios from 'axios'
    export default {
        name: "Cq_lottery",
        data(){
          return{
            adjustmentVisible:false,
            addVisible:false,
            imageUrl: '',
            addFormRules: {
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
            value:'',
            tipVisible:true,
            previewVisible:false
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
        adjustmentDialog:function(){
          this.adjustmentVisible = true;
        },
        showAddDialog:function(){

        },
        AddDialog:function(){
          this.addVisible = true;
        },
        // viewPreview:function(){
        //   this.previewVisible = true;
        // },

      },
      mounted(){
        // console.log()
        // this.$refs.aa.style.backgroundColor = 'red'
      },
      // updated(){
      //   let info = ['1','2','3','4','5','6','7','8','9','10']
      //   let color = ['#ffccff', '#ccffff', '#993366', '#FFEC8B', '#FFE4E1', '#FF83FA', '#FFF4D6', '#F08080', '#D15FEE', '#CAFF70']
      //   let canvas = document.getElementById('canvas');
      //   let ctx = canvas.getContext('2d');
      //   createCircle();
      //   createCirText(); // 绘制文字
      //
      //   //外圆
      //   function createCircle() {
      //     let startAngle = 0; //扇形的开始弧度
      //     let endAngle = 0; //扇形的终止弧度
      //     //画一个等份扇形组成的圆形
      //     for (let i = 0; i < info.length; i++) {
      //       startAngle = Math.PI * (i / (info.length / 2) - 2 / info.length);
      //       endAngle = startAngle + Math.PI * (1 / (info.length / 2));
      //       // console.log(endAngle)
      //       ctx.save(); // 保存备份
      //       ctx.beginPath(); // 绘制两条线
      //       ctx.arc(150, 150, 90, startAngle, endAngle, false); // 绘制圆
      //       ctx.lineWidth = 120;
      //       ctx.strokeStyle = color[i]
      //       ctx.stroke();
      //       ctx.restore();
      //
      //     }
      //   }
      //
      //   //各奖项
      //   function createCirText() {
      //     ctx.textAlign = 'center';
      //     ctx.textBaseline = 'middle';
      //     let step = 2 * Math.PI / info.length;
      //     for (let i = 0; i < 10; i++) {
      //       ctx.save();
      //       ctx.beginPath();
      //       ctx.translate(150, 150);
      //       ctx.rotate(i * step);
      //       ctx.font = " 20px Microsoft YaHei";
      //       ctx.fillStyle = '#000';
      //       ctx.fillText(info[i], -60, -100, 60); // 书写转盘文字
      //       ctx.closePath();
      //       ctx.restore();
      //     }
      //   }
      // }
    }
</script>

<style scoped>
  .toolbar{
    margin-top:30px;
  }
  .el-input{
    width:300px;
  }
  /*.img{*/
    /*position: absolute;*/
    /*top:50px;*/
    /*left:50%;*/
  /*}*/
</style>
