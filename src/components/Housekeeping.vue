<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>会员中心</b></el-breadcrumb-item>
        <el-breadcrumb-item>房间管理</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="toolbar" style="margin-top:30px;">
      <el-form :inline="true" :model="filters">
        <el-form-item label="玩家ID" label-width="68px">
          <el-input v-model.trim="filters.playerId" @keyup.enter.native="handleSearch(1)" style="width:220px;"></el-input>
        </el-form-item>
        <el-form-item label="房间号" label-width="68px">
          <el-input v-model.trim="filters.roomNo" @keyup.enter.native="handleSearch(1)" style="width:220px;"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="handleSearch(1)">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!-- 列表-->
    <el-table :data="list" highlight-current-row
              style="width: 100%;" id="out-table">
      <el-table-column type="index" width="60"></el-table-column>
      <el-table-column prop="roomNo" label="房间号" width="120"></el-table-column>
      <el-table-column prop="roomType" label="房间类型" width="120"></el-table-column>
      <el-table-column prop="countPan" label="房间盘数" width="90"></el-table-column>
      <el-table-column prop="playersCount" label="参与人数" width="120"></el-table-column>
      <el-table-column prop="playerIds" label="参与玩家ID" width="160"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="100"></el-table-column>
      <el-table-column prop="systemMail.createtime" label="操作" width="auto">
        <template slot-scope="scope">
          <el-button type="text" @click.native="particulars(scope.$index,scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--详情-->
    <el-dialog title="对局详情" :visible.sync="GameDetailsDialogVisible" :close-on-click-modal="false" class="game">
      <ul>
        <li>
          <span>总分</span>
          <span v-for="data in totalScore">{{data.nickname}}：{{data.totalScore}} |</span>
        </li>
        <li>
          <div v-for="data1 in List">
             <span>
              第{{data1.no}}盘
              <br>{{data1.finishTime}}
            </span>
            <span v-for="data2 in data1.playerResultList">
              <i>{{data2.nickname}}</i><br>
              <i>{{data2.score}}</i>
            </span>
            <span v-if="data1.codeStatus = 1">回放码：{{data1.code}}</span>
            <span v-if="data1.codeStatus = 0" @click.native="playbackyards">回放码：<i>生成</i></span>
          </div>
        </li>
      </ul>
    </el-dialog>
  </el-row>
</template>

<script>
      import axios from 'axios'
      export default {
          name: "Housekeeping",
          data(){
            return{
              filters:{},
              list:[],
              GameDetailsDialogVisible:false,
              totalScore:[],
              List:[],
              info:{}
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
            handleSearch(page){
              axios({
                method: 'post',
                url: this.global.mPath + '/game/queryroom',
                headers: {
                  'Content-type': 'application/x-www-form-urlencoded'
                },
                params: {
                  'playerId':this.filters.playerId,
                  'roomNo':this.filters.roomNo,
                  'token':sessionStorage.getItem('token'),
                  'page':page,
                  'size':10
                }
              })
                .then((res) => {
                    this.loading = false;//隐藏加载条
                    this.list = res.data.data.items;
                    this.total = res.data.data.pageCount;
                    for(let i = 0;i < this.list.length;i++){
                      this.list[i].createTime = this.dateTimeFormat(this.list[i].createTime)
                    }
                  },
                ).catch((e) => {
                if (e && e.response) {
                  switch (e.response.status) {
                    case 504:
                      this.$message({showClose: true, message: '服务器异常', type: 'warning'});
                      this.loading = false;//隐藏加载条
                      break
                    case 500:
                      this.$message({showClose: true, message: '服务器异常', type: 'warning'});
                      this.loading = false;//隐藏加载条
                      break
                    case 405:
                      this.$message({showClose: true, message: '请先登录', type: 'warning'});
                      break
                  }
                }
              })
            },
            particulars(index,row){
              this.GameDetailsDialogVisible = true
              this.info = row
              axios({
                method: 'post',
                url: this.global.mPath + '/game/queryroomdetail',
                headers: {
                  'Content-type': 'application/x-www-form-urlencoded'
                },
                params: {
                  'gameId':row.gameId,
                  'token':sessionStorage.getItem('token')
                }
              })
                .then((res) => {
                  // console.log(res.data.data)
                  this.totalScore = res.data.data.totalScore
                  this.List = res.data.data.list
                  // console.log(this.List)
                  for(let i = 0;i < this.List.length;i++){
                    this.List[i].finishTime = this.dateTimeFormat(this.List[i].finishTime)
                    // console.log(this.List[i].finishTime)
                  }
                })
            },
            playbackyards(){
              axios({
                method: 'post',
                url: this.global.mPath + '/game/get_backcode',
                headers: {
                  'Content-type': 'application/x-www-form-urlencoded'
                },
                params: {
                  'game':this.info.roomType,
                  'panNo':this.info.countPan,
                  'gameId':this.info.gameId,
                  'token':sessionStorage.getItem('token')
                }
              })
                .then((res) => {
                  // console.log(res.data)
                  if(res.data.success){
                    this.particulars()
                  }
                })
            }
          },
          mounted(){
            this.handleSearch(1)
          }
      }
</script>

<style lang="scss">
  .game{
    ul{
      list-style: none;
      border:1px solid #606266;
      padding:0;
      margin:0;
      li{
        border-bottom:1px solid #606266;
        position: relative;
        span:nth-child(1){
          width:96px;
          height:45px;
          display:inline-block;
          text-align: center;
        }
        span:nth-child(2){
          margin-left:25px;
        }
        span:not(:first-child){
          display:inline-block;
          margin-left:10px;
          text-align: center;
          i:nth-child(1){
            border-bottom:1px solid #606266;
          }
          i{
            font-style:normal;
            color:#409EFF;
          }
        }
      }
      li:nth-child(1){
        span:nth-child(1){
          line-height: 45px;
        }
      }
    }
  }
</style>
