<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>玩法管理</b></el-breadcrumb-item>
        <el-breadcrumb-item>玩法</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item label="游戏名称" label-width="68px">
          <el-input v-model.trim="filters.gamename" @keyup.enter.native="handleSearch(1)"></el-input>
        </el-form-item>
        <el-form-item label="玩法" label-width="68px">
          <el-input v-model.trim="filters.play" @keyup.enter.native="handleSearch(1)"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="handleSearch(1)">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!-- 玩法列表-->
    <el-table :data="playmethod" highlight-current-row @selection-change="selsChange" style="width: 100%;">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column type="index" width="60"></el-table-column>
      <el-table-column prop="id" label="互斥组ID" width="auto"></el-table-column>
      <el-table-column prop="game" label="游戏名称" width="auto"></el-table-column>
      <el-table-column prop="name" label="玩法" width="auto"></el-table-column>
      <el-table-column prop="desc" label="描述" width="auto"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="danger" @click="delBook(scope.$index,scope.row)" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--新增玩法-->
    <el-dialog title="新增玩法" :visible.sync="addGameVisible" :close-on-click-modal="false">
      <el-form :model="addGame" label-width="150px" :rules="editFormRules" ref="addGame">
        <el-form-item label="游戏名称" prop="game">
          <el-input v-model.trim="addGame.game" auto-complete="off" style="width:300px;"></el-input>
        </el-form-item>
        <el-form-item label="玩法" prop="name">
          <el-input v-model.trim="addGame.name" auto-complete="off" style="width:300px;"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="desc">
          <el-input v-model.trim="addGame.desc" auto-complete="off" style="width:300px;"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addGameVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit">提交</el-button>
      </div>
    </el-dialog>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-button type="danger" @click="batchDeleteBook" :disabled="this.sels.length===0">批量删除</el-button>
      <el-button type="primary" @click="addplay">新增</el-button>
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="1" :total="total"
                     style="float:right;">
      </el-pagination>
    </el-col>
  </el-row>
</template>

<script>
  import axios from 'axios'
  export default {
    name: "PlayTheMutex",
    data(){
      return{
        filters:{},
        playmethod:[],
        sels:[],
        total:0,
        addGame:{},
        addGameVisible:false,
        content:'',
        content1:'',
        editFormRules:{
          game: [
            {required: true, message: '请输入游戏名称', trigger: 'blur'}
          ],
          name: [
            {required: true, message: '请输入玩法', trigger: 'blur'}
          ],
          desc: [
            {required: true, message: '请输入描述', trigger: 'blur'}
          ]
        }
      }
    },
    methods:{
      handleCurrentChange(val){
        this.page = val;
        this.handleSearch(this.page);
      },
      handleSearch(page){
        axios({
          method: 'post',
          url: this.global.mPath + '/game/query_lawsmutexgroup',
          headers: {
            'Content-type': 'application/x-www-form-urlencoded'
          },
          params: {
            game:this.filters.gamename,
            name:this.filters.play,
            page:page,
            size:'10',
            token:sessionStorage.getItem('token')
          }
        })
          .then((res) => {
              // console.log(res.data.data)
              this.playmethod = res.data.data.items;
              this.total = res.data.data.pageCount;
            },
          ).catch((e) => {
          if(e && e.response){
            switch (e.response.status) {
              case 504:
                this.$message({showClose: true, message: '服务器异常', type: 'warning'});
                break
              case 405:
                this.$message({showClose: true, message: '请先登录', type: 'warning'});
                break
            }
          }
        });
      },
      selsChange: function (sels) {
        this.sels = sels;
      },
      delBook:function(index,row){
        let that = this;
        this.$confirm('确认删除该记录吗?', '提示', {type: 'warning'}).then(() => {
          that.loading = true;
          axios({//根据昵称查询
            method: 'post',
            url: this.global.mPath + '/game/remove_mutexgroup',
            headers: {
              'Content-type': 'application/x-www-form-urlencoded'
            },
            params: {
              'groupId':row.id,
              'token':sessionStorage.getItem('token')
            }
          })
            .then((res) => {
                // console.log(res.data.success)
                that.loading = false;
                if(res.data.success == true){
                  that.$message.success({showClose: true, message: '删除成功', duration: 1500});
                  that.handleSearch(1);
                }else{
                  that.$message.error({showClose: true, message: err.toString(), duration: 2000});
                }
              },
            ).catch((e) => {
            that.loading = false;
            that.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
          });
        });
      },
      batchDeleteBook:function(){
        let ids = this.sels.map(item => item.id).toString();
        let that = this;
        this.$confirm('确认删除该记录吗?', '提示', {type: 'warning'}).then(() => {
          that.loading = true;
          axios({//根据昵称查询
            method: 'post',
            url: this.global.mPath + '/game/remove_mutexgroup',
            headers: {
              'Content-type': 'application/x-www-form-urlencoded'
            },
            params: {
              'groupId':ids,
              'token':sessionStorage.getItem('token')
            }
          })
            .then((res) => {
                that.loading = false;
                if(res.data.success == true){
                  that.$message.success({showClose: true, message: '删除成功', duration: 1500});
                  that.handleSearch(1);
                }else{
                  that.$message.error({showClose: true, message: err.toString(), duration: 2000});
                }
              },
            ).catch((error) => {
            that.loading = false;
            that.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
          });
        });
      },
      addplay:function(){
        this.addGameVisible = true;
      },
      addSubmit:function(){
        axios({
          method: 'post',
          url: this.global.mPath + '/game/add_mutexgroup',
          headers: {
            'Content-type': 'application/x-www-form-urlencoded'
          },
          params:{
            'game':this.addGame.game,
            'name':this.addGame.name,
            'desc':this.addGame.desc,
            'token':sessionStorage.getItem('token')
          }
        })
          .then((res) => {
              // console.log(res.data)
              if (res.data.success == false) {
                this.$message({showClose: true, message: '添加失败', type: 'warning'});
              } else if (res.data.success == true) {
                this.$message({showClose: true, message: '添加成功', type: 'success'});
                this.addGameVisible = false;//关闭弹窗
                this.handleSearch(1);
              }
            },
          ).catch((e) => {
          if(e && e.response){
            switch (e.response.status) {
              case 504:
                this.$message({showClose: true, message: '服务器异常', type: 'warning'});
                break
              case 405:
                this.$message({showClose: true, message: '请先登录', type: 'warning'});
                break
            }
          }
        });
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
          this.handleSearch(1)
        }
      })
    }
  }
</script>

<style scoped>
  .toolbar{
    margin-top:30px;
  }
</style>
