<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>任务管理</b></el-breadcrumb-item>
        <el-breadcrumb-item>待发布任务</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item label="任务名">
          <el-input v-model.trim="filters.nickname" placeholder="请输入任务名" @keyup.enter.native="handleSearch(1)"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="handleSearch(1)">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="showAddDialog">添加</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!-- 任务列表-->
    <el-table :data="task" highlight-current-row @selection-change="selsChange"
              style="width:100%;" id="out-table">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column type="index" width="60"></el-table-column>
      <el-table-column prop="name" label="任务名称" width="160"></el-table-column>
      <el-table-column prop="desc" label="详细描述" width="200"></el-table-column>
      <el-table-column prop="type" label="任务类型" width="120"></el-table-column>
      <el-table-column prop="taskName" label="任务种类" width="120"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="small" @click="publishDialog(scope.$index,scope.row)">发布</el-button>
          <el-button type="danger" @click="delBook(scope.$index,scope.row)" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--添加-->
    <el-dialog title="新增任务" :visible.sync="addFormVisible" :close-on-click-modal="false">
      <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
        <el-form-item label="任务名称" prop="name" required>
          <el-input v-model.trim="addForm.name" auto-complete="off" style="width:400px;"></el-input>
        </el-form-item>
        <el-form-item label="详细描述" prop="description" required>
          <el-input v-model.trim="addForm.description" auto-complete="off" style="width:400px;"></el-input>
        </el-form-item>
        <el-form-item label="任务类型" prop="taskType" required>
          <el-select v-model="addForm.taskType" placeholder="请选择">
            <el-option
              v-for="(item,index) in options"
              :key="index"
              :label="item.label"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务种类" prop="Typetask" required>
          <el-select v-model="addForm.Typetask" placeholder="请选择">
            <el-option
              v-for="item in typeTask"
              :key="item.taskType"
              :label="item.label"
              :value="item.taskName">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">保存</el-button>
      </div>
    </el-dialog>

    <!--发布-->
    <el-dialog title="发布任务" :visible.sync="publishVisible" :close-on-click-modal="false">
      <el-form :model="publishForm" label-width="120px" :rules="addFormRules" ref="addForm">
        <el-form-item label="发布对象" prop="releaseObject" required>
          <el-select v-model="publishForm.releaseObject" placeholder="请选择">
            <el-option
              v-for="(item,index) in userType"
              :key="index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务名称" prop="name" required>
          <el-input v-model.trim="publishForm.name" auto-complete="off" style="width:400px;"></el-input>
        </el-form-item>
        <el-form-item label="详细描述" prop="desc" required>
          <el-input v-model.trim="publishForm.desc" auto-complete="off" style="width:400px;"></el-input>
        </el-form-item>
        <el-form-item label="任务类型" prop="type" required>
          <el-input v-model.trim="publishForm.type" auto-complete="off" style="width:400px;"></el-input>
        </el-form-item>
        <el-form-item label="任务种类" prop="taskName" required>
          <el-input v-model.trim="publishForm.taskName" auto-complete="off" style="width:400px;"></el-input>
        </el-form-item>
        <el-form-item label="奖励类型" prop="rewardTypes" required>
          <el-select v-model="publishForm.rewardTypes" placeholder="请选择">
            <el-option
              v-for="(item,index) in rewardTypes"
              :key="index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="奖励数量" prop="rewardNum">
          <el-input v-model.trim="publishForm.rewardNum" auto-complete="off" style="width:220px;"></el-input>
        </el-form-item>
        <el-form-item label="完成次数" prop="targetNum" required>
          <el-input type='number' v-model.trim="publishForm.targetNum" auto-complete="off" style="width:220px;"></el-input>
        </el-form-item>
        <el-form-item label="设置任务时限" prop="limitTime">
          <el-input type='number' v-model.trim="publishForm.limitTime" auto-complete="off" style="width:220px;"></el-input> 天
        </el-form-item>
        <el-form-item label="权重" prop="weight">
          <el-input type='number' v-model.trim="publishForm.weight" auto-complete="off" style="width:220px;"></el-input>
        </el-form-item>
        <el-radio v-model="radio" label="EVERYDAY" class="radio">每日</el-radio>
        <el-radio v-model="radio" label="ONE">单次</el-radio>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="publishVisible = false">取消</el-button>
        <el-button type="primary" @click.native="publishSubmit" :loading="addLoading">确认</el-button>
      </div>
    </el-dialog>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-button type="danger" @click="batchDeleteBook" :disabled="this.sels.length===0">批量删除</el-button>
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="1" :total="total"
                     style="float:right;">
      </el-pagination>
    </el-col>
  </el-row>
</template>

<script>
    import axios from 'axios'
    export default {
      name: "PendingReleaseTask",
      data(){
        return{
          task:[],
          filters:{},
          addFormVisible:false,
          addLoading:false,
          publishVisible:false,
          addForm:{},
          publishForm:{},
          total:0,
          index:'',
          radio:'',
          options:[],
          typeTask:[],
          sels: [],
          userTypes:'',
          show:true,
          hide:false,
          type:[
            {value:'金币'},
            {value:'积分'},
            {value:'会员卡'}
          ],
          userType:[
            {value:'普通用户'},
            {value:'会员用户'},
            {value:'所有用户'}
          ],
          addFormRules:{
            releaseObject:[
              {required: true, message: '请选择发布对象', trigger: 'change'}
            ],
            name: [
              {required: true, message: '请输入任务名称', trigger: 'blur'}
            ],
            description: [
              {required: true, message: '请输入详细描述', trigger: 'blur'}
            ],
            taskType: [
              {required: true, message: '请选择任务类型', trigger: 'change'}
            ],
            rewardType: [
              {required: true, message: '请选择奖励类型', trigger: 'change'}
            ],
            completionTimes: [
              {required: true, message: '请输入完成次数', trigger: 'blur'}
            ],
            numberOfReward: [
              {required: true, message: '请输入奖励数', trigger: 'blur'}
            ],
            weight:[
              {required: true, message: '请输入权重 ', trigger: 'blur'}
            ]
          },
          rewardTypes:[
            {value:'玉石'},
            {value:'礼券'},
            {value:'会员卡'},
            {value:'红包点'},
            {value:'现金红包'},
          ],
          types:[
            {value:'每日任务'},
            {value:'邀请豪礼'},
          ],
          taskNames:[
            {value:'邀请新玩家'},
            {value:'赢得游戏'},
            {value:'分享好友'},
            {value:'分享朋友圈'},
            {value:'成为会员'},
            {value:'红包点福利'},
            {value:'完成小盘游戏'},
            {value:'俏皮话'},
            {value:'对局任务'},
          ]
        }
      },
      methods:{
        selsChange: function (sels) {
          this.sels = sels;
        },
        handleCurrentChange(val) {
          this.page = val;
          this.handleSearch(this.page);
        },
        showAddDialog:function(){
          this.addFormVisible = true;
          axios({
            method: 'post',
            url: this.global.mPath + '/task/querytaskconfig',
            headers: {
              'Content-type': 'application/x-www-form-urlencoded'
            },
            params: {
              'token':sessionStorage.getItem('token')
            }
          }).then((res) => {
            this.options = res.data.data.typeList;
            this.typeTask = res.data.data.templates;
          }).catch((e) => {
            if(e && e.response){
              switch (e.response.status) {
                case 504:
                  this.$message({showClose: true, message: '服务器异常', type: 'warning'});
                  break;
                case 405:
                  this.$message({showClose: true, message: '请先登录', type: 'warning'});
                  break
              }
            }
          })
        },
        publishDialog:function(index, row){
          this.publishVisible = true;
          this.publishForm = Object.assign({}, row);
          if(this.publishForm.rewardType === '会员卡'){
            this.show = false;
            this.hide = true;
          }else{
            this.show = true;
            this.hide = false;
          }
        },
        handleSearch(page){
          axios({
            method: 'post',
            url: this.global.mPath + '/task/querytaskdocument',
            headers: {
              'Content-type': 'application/x-www-form-urlencoded'
            },
            params: {
              page:page,
              size:15,
              name:this.filters.nickname,
              type:'',
              token:sessionStorage.getItem('token')
            }
          }).then((res) => {
            // console.log(res.data.data)
            this.task = res.data.data.items;
            this.total = res.data.data.pageCount;
          }).catch((e) => {
            if(e && e.response){
              switch (e.response.status) {
                case 504:
                  this.$message({showClose: true, message: '服务器异常', type: 'warning'});
                  break;
                case 405:
                  this.$message({showClose: true, message: '请先登录', type: 'warning'});
                  break
              }
            }
          })
        },
        addSubmit:function(){
          axios({
            method: 'post',
            url: this.global.mPath + '/task/addtaskdocument',
            headers: {
              'Content-type': 'application/x-www-form-urlencoded'
            },
            params: {
              name:this.addForm.name,
              type:this.addForm.taskType,
              desc:this.addForm.description,
              taskName:this.addForm.Typetask,
              token:sessionStorage.getItem('token')
            }
          }).then((res) => {
            // console.log(res)
            if(res.data.success){
              this.$message.success({showClose: true, message: '添加成功', duration: 1500});
              this.handleSearch(1);
              this.addFormVisible = false;
            }else{
              this.$message.error({showClose: true, message: err.toString(), duration: 2000});
            }
          }).catch((e) => {
            this.loading = false;
            this.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
          })
        },
        publishSubmit:function(){
          if(this.publishForm.releaseObject === '普通用户'){
            this.publishForm.userTypes = 'false';
          }
          if(this.publishForm.releaseObject === '会员用户'){
            this.publishForm.userTypes = 'true';
          }
          if(this.publishForm.releaseObject === '所有用户'){
            this.publishForm.userTypes = 'null';
          }
          if(this.publishForm.rewardTypes === '玉石'){
            this.publishForm.rewardType = 'YUSHI'
          }
          if(this.publishForm.rewardTypes === '礼券'){
            this.publishForm.rewardType = 'LIQUAN'
          }
          if(this.publishForm.rewardTypes === '会员卡'){
            this.publishForm.rewardType = 'VIPTIME'
          }
          if(this.publishForm.rewardTypes === '红包点'){
            this.publishForm.rewardType = 'HONGBAODIAN'
          }
          if(this.publishForm.rewardTypes === '现金红包'){
            this.publishForm.rewardType = 'HONGBAORMB'
          }
          this.publishForm.promulgator = sessionStorage.getItem('nickname');
          this.loading = true;
          axios({
            method: 'post',
            url: this.global.mPath + '/task/release',
            headers: {
              'Content-type': 'application/x-www-form-urlencoded'
            },
            params: {
              token:sessionStorage.getItem('token'),
              taskDocId:this.publishForm.id,
              name:this.publishForm.name,
              desc:this.publishForm.desc,
              type:this.publishForm.type,
              taskName:this.publishForm.taskName,
              rewardType:this.publishForm.rewardType,
              rewardNum:this.publishForm.rewardNum,
              vip:this.publishForm.userTypes,
              targetNum:this.publishForm.targetNum,
              limitTime:this.publishForm.limitTime,
              taskType:this.radio,
              promulgator:this.publishForm.promulgator,
              weight:this.publishForm.weight
            }
          }).then((res) => {
          // console.log(res)
            this.loading = false;
            if (res.data.success) {
              this.publishVisible = false;
              this.$message.success({showClose: true, message: '发布成功', duration: 1500});
              this.handleSearch(1);
            } else {
              this.$message.error({showClose: true, message: err.toString(), duration: 2000});
            }
          }).catch((e) => {
            this.loading = false;
            this.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
          })
        },
        delBook: function (index,row) {
          let that = this;
          this.$confirm('确认删除该记录吗?', '提示', {type: 'warning'}).then(() => {
            that.loading = true;
            axios({
              method: 'post',
              url: this.global.mPath + '/task/deletetaskdocuments',
              headers: {
                'Content-type': 'application/x-www-form-urlencoded'
              },
              params: {
                'taskDocId':row.id,
                'token':sessionStorage.getItem('token')
              }
            }).then((res) => {
              that.loading = false;
              if(res.data.success){
                that.$message.success({showClose: true, message: '删除成功', duration: 1500});
                that.handleSearch(1);
              }else{
                that.$message.error({showClose: true, message: err.toString(), duration: 2000});
              }
            }).catch((e) => {
              that.loading = false;
              that.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
            })
          })
        },
        batchDeleteBook:function() {
          let ids = this.sels.map(item => item.id).toString();
          let that = this;
          this.$confirm('确认删除选中记录吗？', '提示', {
            type: 'warning'
          }).then(() => {
            that.loading = true;
            axios({
              method: 'post',
              url: this.global.mPath + '/task/deletetaskdocuments',
              headers: {
                'Content-type': 'application/x-www-form-urlencoded'
              },
              params: {
                'taskDocId':ids,
                'token':sessionStorage.getItem('token')
              }
            }).then((res) => {
              that.loading = false;
              if(res.data.success){
                that.$message.success({showClose: true, message: '删除成功', duration: 1500});
                that.handleSearch(1);
              }else{
                that.$message.error({showClose: true, message: err.toString(), duration: 2000});
              }
            }).catch((e) => {
              that.loading = false;
              that.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
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
            this.handleSearch(1);
          }else{
            this.$router.replace('/');
          }
        })
      }
    }
</script>

<style scoped>
  .toolbar{
    margin-top:30px;
  }
  .radio{
    margin-left:80px;
  }
</style>
