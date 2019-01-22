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
      <el-table-column prop="id" label="玩法ID" width="auto"></el-table-column>
      <el-table-column prop="game" label="游戏名称" width="auto"></el-table-column>
      <el-table-column prop="name" label="玩法" width="auto"></el-table-column>
      <el-table-column prop="desc" label="描述" width="auto"></el-table-column>
      <el-table-column prop="mutexGroupId" label="互斥组id" width="auto"></el-table-column>
      <el-table-column prop="vip" label="是否会员" width="auto"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" @click="adjust(scope.$index,scope.row)" size="small">调整</el-button>
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
        <el-form-item label="互斥组id" prop="mutexGroupId">
          <el-input v-model.trim="addGame.mutexGroupId" auto-complete="off" style="width:300px;"></el-input>
        </el-form-item>
        <el-form-item label="是否为vip" prop="vip">
          <el-radio v-model="addGame.vip" label="是">是</el-radio>
          <el-radio v-model="addGame.vip" label="否">否</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addGameVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit">提交</el-button>
      </div>
    </el-dialog>

    <!--调整玩法-->
    <el-dialog title="调整玩法" :visible.sync="adjustGameVisible" :close-on-click-modal="false">
      <el-form :model="adjustGame" label-width="150px" :rules="editFormRules" ref="addGame">
        <el-form-item label="游戏名称" prop="game">
          <el-input v-model.trim="adjustGame.game" auto-complete="off" style="width:300px;"></el-input>
        </el-form-item>
        <el-form-item label="玩法" prop="name">
          <el-input v-model.trim="adjustGame.name" auto-complete="off" style="width:300px;"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="desc">
          <el-input v-model.trim="adjustGame.desc" auto-complete="off" style="width:300px;"></el-input>
        </el-form-item>
        <el-form-item label="互斥组id" prop="mutexGroupId">
          <el-input v-model.trim="adjustGame.mutexGroupId" auto-complete="off" style="width:300px;"></el-input>
        </el-form-item>
        <el-form-item label="是否为vip" prop="vip">
          <el-radio v-model="adjustGame.vip" label="是">是</el-radio>
          <el-radio v-model="adjustGame.vip" label="否">否</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="adjustGameVisible = false">取消</el-button>
        <el-button type="primary" @click.native="referSubmit">提交</el-button>
      </div>
    </el-dialog>

    <!--工具条-->
    <el-col :span="24" class="toolbar" style="margin-bottom:30px;">
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
      name: "GamePlay",
      data(){
        return{
          filters:{},
          playmethod:[],
          sels:[],
          total:0,
          addGame:{},
          addGame1:{},
          adjustGame:{},
          adjustGame1:{},
          addGameVisible:false,
          adjustGameVisible:false,
          editFormRules:{
            game: [
              {required: true, message: '请输入游戏名称', trigger: 'blur'}
            ],
            name: [
              {required: true, message: '请输入玩法', trigger: 'blur'}
            ],
            desc: [
              {required: true, message: '请输入描述', trigger: 'blur'}
            ],
            mutexGroupId: [
              {required: true, message: '请输入互斥组id', trigger: 'blur'}
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
            url: this.global.mPath + '/game/query_gamelaw',
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
          }).then((res) => {
            this.playmethod = res.data.data.items;
            this.total = res.data.data.pageCount;
            for(let i = 0; i < this.playmethod.length;i++){
              // console.log(this.playmethod[i])
              if(this.playmethod[i].vip === true){
                this.playmethod[i].vip = '是';
              }else{
                this.playmethod[i].vip = '否';
              }
            }
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
        selsChange: function (sels) {
          this.sels = sels;
        },
        adjust:function(index,row){
          this.adjustGameVisible = true;
          this.adjustGame = Object.assign({}, row);
        },
        referSubmit:function(){
          // console.log(this.adjustGame.id)
          if(this.adjustGame.vip === '是'){
            this.adjustGame1.vip = true;
          }else{
            this.adjustGame1.vip = false;
          }
          axios({
            method: 'post',
            url: this.global.mPath + '/game/update_law',
            headers: {
              'Content-type': 'application/x-www-form-urlencoded'
            },
            params:{
              'id':this.adjustGame.id,
              'game':this.adjustGame.game,
              'name':this.adjustGame.name,
              'desc':this.adjustGame.desc,
              'mutexGroupId':this.adjustGame.mutexGroupId,
              'vip':this.adjustGame1.vip,
              'token':sessionStorage.getItem('token')
            }
          }).then((res) => {
            if (res.data.success) {
              this.$message({showClose: true, message: '调整成功', type: 'success'});
              this.adjustGameVisible = false;//关闭弹窗
              this.handleSearch(1);
            } else{
              this.$message({showClose: true, message: '调整失败', type: 'warning'});
            }
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
        delBook:function(index,row){
          let that = this;
          this.$confirm('确认删除该记录吗?', '提示', {type: 'warning'}).then(() => {
            that.loading = true;
            axios({//根据昵称查询
              method: 'post',
              url: this.global.mPath + '/game/remove_law',
              headers: {
                'Content-type': 'application/x-www-form-urlencoded'
              },
              params: {
                'lawId':row.id,
                'token':sessionStorage.getItem('token')
              }
            }).then((res) => {
              // console.log(res.data.success)
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
        batchDeleteBook:function(){
          let ids = this.sels.map(item => item.id).toString();
          let that = this;
          this.$confirm('确认删除该记录吗?', '提示', {type: 'warning'}).then(() => {
            that.loading = true;
            axios({//根据昵称查询
              method: 'post',
              url: this.global.mPath + '/game/remove_law',
              headers: {
                'Content-type': 'application/x-www-form-urlencoded'
              },
              params: {
                'lawId':ids,
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
            }).catch((error) => {
              that.loading = false;
              that.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
            })
          })
        },
        addplay:function(){
          this.addGameVisible = true;
        },
        addSubmit:function(){
          if(this.addGame.vip === '是'){
            this.addGame1.vip = true;
          }else{
            this.addGame1.vip = false;
          }
          axios({
            method: 'post',
            url: this.global.mPath + '/game/add_law',
            headers: {
              'Content-type': 'application/x-www-form-urlencoded'
            },
            params:{
              'game':this.addGame.game,
              'name':this.addGame.name,
              'desc':this.addGame.desc,
              'mutexGroupId':this.addGame.mutexGroupId,
              'vip':this.addGame1.vip,
              'token':sessionStorage.getItem('token')
            }
          }).then((res) => {
            if (res.data.success) {
              this.$message({showClose: true, message: '添加成功', type: 'success'});
              this.addGameVisible = false;//关闭弹窗
              this.handleSearch(1);
            } else if (res.data.success) {
              this.$message({showClose: true, message: '添加失败', type: 'warning'});
            }
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
            this.handleSearch(1)
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
</style>
