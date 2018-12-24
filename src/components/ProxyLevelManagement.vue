<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>推广员中心</b></el-breadcrumb-item>
        <el-breadcrumb-item>代理类型管理</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main" v-loading="loading" element-loading-text="拼命加载中">
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="filters">
          <el-form-item>
            <el-button type="primary" @click="showAddDialog">添加类型</el-button>
          </el-form-item>
        </el-form>
      </el-col>

      <el-table :data="list" highlight-current-row @selection-change="selsChange"
                style="width: 100%;">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type="index" width="60"></el-table-column>
        <el-table-column prop="type" label="代理类型名称" width="160"></el-table-column>
        <el-table-column prop="memberReward" label="玩家充值返利（一级）" width="200" sortable></el-table-column>
        <el-table-column prop="juniorReward" label="下级返利（二级）" width="200" sortable></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="small" @click="adjustDialog(scope.$index,scope.row)">编辑</el-button>
            <el-button size="small" @click="deleteDialog(scope.$index,scope.row)">删除</el-button>
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

      <!--添加代理类型-->
      <el-dialog title="添加代理类型" :visible.sync="addFormVisible" :close-on-click-modal="false">
        <el-form :model="normalForm" label-width="160px" :rules="rules" class="demo-ruleForm">
          <el-form-item label="代理名称" prop="type" style="width:317px;">
            <el-input v-model="normalForm.type" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="充值返利（%）" prop="memberReward" style="width:317px;">
            <el-input v-model="normalForm.memberReward" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="下级返利（%）" prop="juniorReward" style="width:317px;">
            <el-input v-model="normalForm.juniorReward" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="issue()">确定</el-button>
            <el-button @click.native="addFormVisible = false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>

      <!--调整-->
      <el-dialog title="调整代理类型" :visible.sync="adjustmentVisible" :close-on-click-modal="false">
        <el-form :model="adjustForm" label-width="160px" :rules="rules" class="demo-ruleForm">
          <el-form-item label="代理名称" prop="type" style="width:317px;">
            <el-input v-model="adjustForm.type" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="充值返利（%）" prop="memberReward" style="width:317px;">
            <el-input v-model="adjustForm.memberReward" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="下级返利（%）" prop="juniorReward" style="width:317px;">
            <el-input v-model="adjustForm.juniorReward" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="Adjust()">确认调整</el-button>
            <el-button @click.native="adjustmentVisible = false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>

    </el-col>
  </el-row>
</template>

<script>
  import axios from 'axios'
  export default {
    name: "ProxyLevelManagement",
    data(){
      return{
        addFormVisible:false,
        loading:false,
        adjustmentVisible:false,
        total:0,
        list:[],
        img:true,
        normalForm:{},
        normalForm1:{},
        adjustForm:{},
        adjustForm1:{},
        filters: {},
        radioData:'',
        rules: {
          type: [
            {required: true, message: '请输入代理名称', trigger: 'blur'}
          ],
          memberReward: [
            {required: true, message: '请输入充值返利', trigger: 'blur'}
          ],
          juniorReward: [
            {required: true, message: '请输入下级返利', trigger: 'blur'}
          ]
        },
        sels: [],
      }
    },
    methods:{
      trim(str) {
        if(str != null){
          return str.replace(/(^\s+)|(\s+$)/g, "");
        }
      },
      handleSearch(page){
        axios({
          url:this.global.mPath + '/agent/queryagenttype',
          method:'post',
          params:{
            token:sessionStorage.getItem('token')
          }
        }).then((res) => {
          this.list = res.data.data.listPage.items;
          this.total = res.data.data.listPage.pageCount;
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
        this.imageUrl = '';
        this.addFormVisible = true;
      },
      issue:function() {
        axios({
          method: 'post',
          url: this.global.mPath + '/agent/addagenttype',
          headers: {
            'Content-type': 'application/x-www-form-urlencoded'
          },
          params: {
            type:this.normalForm.type,
            memberReward:this.normalForm.memberReward,
            juniorReward:this.normalForm.juniorReward,
            token:sessionStorage.getItem('token')
          }
        }).then((res) => {
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
        this.adjustmentVisible = true;
        this.adjustForm = Object.assign({}, row);
      },
      Adjust:function(){
        this.loading = true;
        axios({
          method: 'post',
          url: this.global.mPath + '/agent/updateagenttype',
          headers: {
            'Content-type': 'application/x-www-form-urlencoded'
          },
          params: {
            id:this.adjustForm.id,
            type:this.adjustForm.type,
            memberReward:this.adjustForm.memberReward,
            juniorReward:this.adjustForm.juniorReward,
            token:sessionStorage.getItem('token')
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
          this.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
        });
      },
      deleteDialog:function(index,row){
        this.loading = true;
        axios({
          method: 'post',
          url: this.global.mPath + '/agent/removeagenttype',
          headers: {
            'Content-type': 'application/x-www-form-urlencoded'
          },
          params: {
            'id': row.id,
            'token':sessionStorage.getItem('token')
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
          this.loading = false;
          this.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
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
            url: this.global.mPath + '/agent/removeagenttype',
            headers: {
              'Content-type': 'application/x-www-form-urlencoded'
            },
            params: {
              'id': ids,
              'token':sessionStorage.getItem('token')
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
