<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>会员中心</b></el-breadcrumb-item>
        <el-breadcrumb-item>登陆限制</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0;margin-top:30px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model.trim="filters.id" placeholder="用户ID" @keyup.enter.native="handleSearch()"></el-input>
        </el-form-item>
        <el-button type="primary" @click="handleSearch()">查询</el-button>
        <el-button type="primary" @click="addLimit()">新建限制</el-button>
      </el-form>
    </el-col>

    <!-- 登陆限制列表-->
    <el-table :data="limit" highlight-current-row @selection-change="selsChange"
              style="width: 100%;">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column type="index" width="40"></el-table-column>
      <el-table-column prop="memberId" label="用户ID" width="90"></el-table-column>
      <el-table-column prop="nickname" label="用户昵称" width="100"></el-table-column>
      <el-table-column prop="createTime" label="录入时间" width="180"></el-table-column>
      <el-table-column prop="desc" label="备注事项" width="180"></el-table-column>
      <el-table-column prop="other" label="操作">
        <template slot-scope="scope">
          <el-button type="danger" @click="del(scope.$index,scope.row)">删除</el-button>
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

    <!--新建限制-->
    <el-dialog title="新建限制" :visible.sync="addLimitVisible" :close-on-click-modal="false">
      <el-form :model="addLimitForm" label-width="100px" :rules="rules" class="demo-ruleForm">
        <el-form-item label="用户ID" prop="memberId">
          <el-input v-model.trim="addLimitForm.memberId" auto-complete="off" style="width:217px;"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="desc">
          <el-input v-model.trim="addLimitForm.desc" auto-complete="off" style="width:217px;"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="sure">确定</el-button>
          <el-button type="primary" @click.native="addLimitVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </el-row>
</template>

<script>
    import axios from 'axios'
    export default {
        name: "LimitLogin",
        data(){
          return{
            filters:{},
            total:0,
            addLimitVisible:false,
            addLimitForm:{},
            time:'',
            rules: {
              memberId: [
                {required: true, message: '请输入用户ID', trigger: 'blur'}
              ],
              desc: [
                {required: true, message: '请输入备注', trigger: 'blur'}
              ],
            },
            page:1,
            limit:[],
            sels:[]
          }
        },
        methods:{
          dateTimeFormat(value) {
            let time = new Date(+value);
            let rightTwo = (v) => {
              v = '0' + v;
              return v.substring(v.length - 2, v.length)
            };
            if (time == null) return;
            let year = time.getFullYear();
            let month = time.getMonth() + 1;
            let date = time.getDate();
            let hours = time.getHours();
            let minutes = time.getMinutes();
            let seconds = time.getSeconds();
            return year + '-' + rightTwo(month) + '-' + rightTwo(date) + ' ' + rightTwo(hours) + ':' + rightTwo(minutes) + ':' + rightTwo(seconds);
          },
          handleSearch(){
            axios({
              url:this.global.mPath + '/member/querylimit',
              method:'post',
              params:{
                page:this.page,
                size:10,
                token:sessionStorage.getItem('token'),
                memberId:this.filters.id
              }
            }).then((res) => {
                // console.log(res.data)
                this.limit = res.data.data.listPage.items;
                this.total = res.data.data.listPage.pageCount
                for(let i = 0;i < this.limit.length;i++){
                  this.limit[i].createTime = this.dateTimeFormat(this.limit[i].createTime)
                }
              }
            ).catch((e) => {
              this.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
            })
          },
          addLimit(){
            this.addLimitVisible = true;
          },
          sure(){
            axios({
              url:this.global.mPath + '/member/addlimit',
              method:'post',
              params:{
                desc:this.addLimitForm.desc,
                token:sessionStorage.getItem('token'),
                memberId:this.addLimitForm.memberId
              }
            }).then((res) => {
                // console.log(res.data)
                if(res.data.success){
                  this.$message({showClose: true, message: '请求出现异常', duration: 2000});
                }if(res.data.success == true){
                  this.$message({showClose: true, message: '添加成功', type: 'success'});
                  this.addLimitVisible = false;
                  this.handleSearch()
                }else{
                  this.$message({showClose: true, message: '添加失败', type: 'warning'});
                }
              }
            ).catch((e) => {
              this.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
            })
          },
          handleCurrentChange(val){
            this.page = val;
            this.handleSearch();
          },
          del(index,row){
            this.$confirm('确认删除吗？', '提示', {
              type: 'warning'
            }).then(() => {
              axios({
                method: 'post',
                url: this.global.mPath + '/member/deletelimits',
                headers: {
                  'Content-type': 'application/x-www-form-urlencoded'
                },
                params: {
                  token: sessionStorage.getItem('token'),
                  recordId: row.id
                }
              }).then(res => {
                // console.log(res.data)
                if (res.data.success) {
                  this.$message({showClose: true, message: '删除成功', type: 'success'});
                  this.handleSearch()
                } else {
                  this.$message({showClose: true, message: '删除失败', type: 'warning'});
                }
              })
            })
          },
          batchDeleteBook(){
            let ids = this.sels.map(item => item.id).toString();
            this.$confirm('确认删除吗？', '提示', {
              type: 'warning'
            }).then(() => {
              axios({
                method: 'post',
                url: this.global.mPath + '/member/deletelimits',
                headers: {
                  'Content-type': 'application/x-www-form-urlencoded'
                },
                params: {
                  token: sessionStorage.getItem('token'),
                  recordId: ids
                }
              }).then(res => {
                // console.log(res.data)
                if (res.data.success) {
                  this.$message({showClose: true, message: '删除成功', type: 'success'});
                  this.handleSearch()
                } else {
                  this.$message({showClose: true, message: '删除失败', type: 'warning'});
                }
              })
            })
          },
          selsChange(sels){
            this.sels = sels;
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
          if(res.data.success == false){
            this.$router.replace('/');
          }else{
            this.handleSearch()
          }
        })
      }
    }
</script>

<style scoped>

</style>
