<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>服务器管理</b></el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main" v-loading="loading" element-loading-text="拼命加载中">
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="filters">
          <el-form-item label="游戏名称">
            <el-input v-model.trim="filters.game" placeholder="请输入游戏名称" @keyup.enter.native="handleSearch"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" v-on:click="handleSearch">查询</el-button>
            <el-button type="primary" v-on:click="online">上线</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-col>

    <!-- 服务器列表-->
    <el-table :data="server" highlight-current-row @selection-change="selsChange"
              style="width: 100%;">
      <el-table-column type="index" width="auto"></el-table-column>
      <el-table-column prop="game" label="游戏名称" width="auto"></el-table-column>
      <el-table-column prop="name" label="服务器名称" width="auto"></el-table-column>
      <el-table-column prop="httpUrl" label="httpUrl" width="auto"></el-table-column>
      <el-table-column prop="wsUrl" label="websocket URL" width="auto"></el-table-column>
      <el-table-column prop="onlineTime" label="上线时间" width="auto"></el-table-column>
      <el-table-column label="操作" width="auto">
        <template slot-scope="scope">
          <el-button type="danger" @click="offline(scope.$index,scope.row)" size="small">下线</el-button>
          <el-button type="danger" @click.native="pause(scope.$index,scope.row)" size="small" v-if="scope.row.state === 0">暂停</el-button>
          <el-button type="danger" @click.native="recover(scope.$index,scope.row)" size="small" v-if="scope.row.state === 1">恢复</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--上线-->
    <el-dialog title="上线" :visible.sync="onlineVisible" :close-on-click-modal="false">
      <el-form :model="addonline" label-width="150px" :rules="addFormRules" ref="addonline" id="cc">
        <el-form-item label="游戏名称" prop="game">
          <el-input v-model.trim="addonline.game" auto-complete="off" style="width:400px;"></el-input>
        </el-form-item>
        <el-form-item label="服务器名称" prop="name">
          <el-input v-model.trim="addonline.name" auto-complete="off" style="width:400px;"></el-input>
        </el-form-item>
        <el-form-item label="httpURL" prop="httpUrl">
          <el-input v-model.trim="addonline.httpUrl" auto-complete="off" style="width:400px;"></el-input>
        </el-form-item>
        <el-form-item label="websocket URL" prop="wsUrl">
          <el-input v-model.trim="addonline.wsUrl" auto-complete="off" style="width:400px;"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="onlineVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>

  </el-row>
</template>

<script>
  import axios from 'axios'

  export default {
    name: "Server",
    data() {
      return {
        server: [],
        filters: {},
        total: 0,
        page: 1,
        number:1,
        limit: 10,
        loading: false,
        sels: [], //列表选中列
        addonline: {},
        onlineVisible: false,
        addLoading: false,
        addFormRules: {
          game: [
            {required: true, message: '请输入游戏名称', trigger: 'blur'}
          ],
          name: [
            {required: true, message: '请输入服务器名称', trigger: 'blur'}
          ],
          httpUrl: [
            {required: true, message: '请输入httpUrl', trigger: 'blur'}
          ],
          wsUrl: [
            {required: true, message: '请输入websocket URL', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      handleCurrentChange(val) {
        this.page = val;
        this.handleSearch(this.page);
      },
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
      handleSearch() {
        axios({//根据昵称查询
          method: 'post',
          url: this.global.mPath + '/game/servers_for_game',
          headers: {
            'Content-type': 'application/x-www-form-urlencoded'
          },
          params: {
            'game':this.filters.game,
            'token':sessionStorage.getItem('token')
          }
        }).then((res) => {
          this.server = res.data.data.servers;
          for(let i = 0; i < this.server.length;i++){
            // console.log(this.server[i])
            this.server[i].onlineTime = this.dateTimeFormat(this.server[i].onlineTime);
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
      //下线
      offline: function (index, row) {
        let that = this;
        this.$confirm('确认下线吗?', '提示', {type: 'warning'}).then(() => {
          that.loading = true;
          axios({
            method: 'post',
            url: this.global.mPath + '/game/game_server_offline',
            headers: {
              'Content-type': 'application/x-www-form-urlencoded'
            },
            params: {
              'gameServerId':row.id,
              'token':sessionStorage.getItem('token')
            }
          }).then((res) => {
            that.loading = false;
            if(res.data.success){
              that.$message.success({showClose: true, message: '您已下线', duration: 1500});
              that.handleSearch();
            }else{
              that.$message.error({showClose: true, message: err.toString(), duration: 2000});
            }
          }).catch((e) => {
            that.loading = false;
            that.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
          })
        })
      },
      //显示上线界面
      online: function () {
        this.onlineVisible = true;
        this.addonline = {};
      },
      //上线
      addSubmit: function () {
        axios({
          method: 'post',
          url: this.global.mPath + '/game/game_server_online',
          headers: {
            'Content-type': 'application/x-www-form-urlencoded'
          },
          params:{
            'game':this.addonline.game, //游戏
            'name':this.addonline.name, //服务器名称
            'httpUrl':this.addonline.httpUrl, //http接口域名
            'wsUrl':this.addonline.wsUrl, //websocket URL
            'token':sessionStorage.getItem('token')
          }
        }).then((res) => {
          if (res.data.success) {
            this.$message({showClose: true, message: '上线成功', type: 'success'});
            this.onlineVisible = false;//关闭弹窗
            this.handleSearch(1);
          } else {
            this.$message({showClose: true, message: '上线失败', type: 'warning'});
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
    //  暂停
      pause:function(index,row){
        this.$confirm('确认暂停服务器吗？', '提示', {
          type: 'warning'
        }).then(() => {
          axios({
            method: 'post',
            url: this.global.mPath + '/game/stop',
            headers: {
              'Content-type': 'application/x-www-form-urlencoded'
            },
            params: {
              'ids[]': row.id,
            }
          }).then((res) => {
            if (res.data.success) {
               this.$message({showClose: true, message: '暂停成功', type: 'success'});
              this.onlineVisible = false;//关闭弹窗
              this.handleSearch(1);
            } else {
              this.$message({showClose: true, message: '暂停失败', type: 'warning'});
            }
          }).catch((e) => {
            if (e && e.response) {
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
        })
      },
    //  恢复
      recover:function(index,row){
        this.$confirm('确认恢复服务器吗？', '提示', {
          type: 'warning'
        }).then(() => {
          axios({
            method: 'post',
            url: this.global.mPath + '/game/recover',
            headers: {
              'Content-type': 'application/x-www-form-urlencoded'
            },
            params: {
              'ids[]': row.id,
            }
          }).then((res) => {
            if (res.data.success) {
              this.$message({showClose: true, message: '恢复成功', type: 'success'});
              this.onlineVisible = false;//关闭弹窗
              this.handleSearch(1);
            } else {
              this.$message({showClose: true, message: '恢复失败', type: 'warning'});
            }
          }).catch((e) => {
            if (e && e.response) {
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
        })
      }
    },
    mounted() {
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
  .toolbar {
    margin-top: 30px;
  }
</style>
