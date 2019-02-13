<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>茶馆管理</b></el-breadcrumb-item>
        <el-breadcrumb-item>茶馆详情查询</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>


    <el-col :span="24" class="toolbar" style="margin-top: 30px;">
      <el-form :inline="true" :model="filters">
        <el-form-item label="推广员ID">
          <el-input v-model.trim="filters.id" @keyup.enter.native="handleSearch(1)" placeholder="请输入推广员ID"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="handleSearch(1)">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!-- 列表-->
    <el-table :data="list" highlight-current-row style="width: 100%;">
      <el-table-column type="index" width="60"></el-table-column>
      <el-table-column prop="headimgurl" label="茶馆编码" width="120"></el-table-column>
      <el-table-column prop="id" label="茶馆名称" width="120"></el-table-column>
      <el-table-column prop="nickname" label="茶馆人数" width="150"></el-table-column>
      <el-table-column prop="createTime" label="所属推广员" width="160"></el-table-column>
      <el-table-column prop="inviteMemberNum" label="创建时间" width="120"></el-table-column>
      <el-table-column prop="systemMail.createtime" label="操作" width="auto">
        <template slot-scope="scope">
          <el-button type="text" @click.native="manage(scope.$index,scope.row)">管理</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--详情-->
    <el-dialog title="茶馆详情" :visible.sync="details" :close-on-click-modal="false" class="other">
      <div class="details">
          <span class="every">
            <label for="">茶馆编码:</label>
            <span style="color:#000;">858585</span>
            <el-button type="text" style="color:#409EFF;" @click="Bindingadjust(details.agentId)">解散茶馆</el-button>
          </span>
        <span class="every">
            <label for="">创建时间:</label>
            <span style="color:#000;">2019-01-02 09:24:35</span>
          </span>
      </div>
      <div class="details">
         <span class="every">
            <label for="">茶馆名称:</label>
            <span style="color:#000;">
              <input type="text" class="name">的茶馆
            </span>
          </span>
        <span class="every">
            <label for="">茶馆描述:</label>
            <span style="color:#000;">
              <input type="text" class="desc">
            </span>
          </span>
      </div>
      <div class="details">
          <span class="every">
            <label for="">茶馆所属:</label>
            <span style="color:#000;">330515</span>
          </span>
          <span class="every">
              <label for="">代理昵称:</label>
              <span style="color:#000;">王大开</span>
          </span>
      </div>
      <div class="details">
         <span class="every">
            <label for="">茶馆玩家列表:</label>
            <span id="msg" style="color:#000;">85人</span>
         </span>
      </div>
      <div class="details" style="margin-top:20px;">
          <ul class="zj">
              <li>
                  <span>ID:313515</span>
                  <span>昵称：一川闲絮</span>
                  <span>剩余玉石：18000</span>
                  <span>移除</span>
              </li>
              <li>
                  <span>ID:313515</span>
                  <span>昵称：一川闲絮</span>
                  <span>剩余玉石：18000</span>
                  <span>移除</span>
              </li>
              <li>
                  <span>ID:313515</span>
                  <span>昵称：一川闲絮</span>
                  <span>剩余玉石：18000</span>
                  <span>移除</span>
              </li>
          </ul>
          <div class="button">
            <el-button type="primary" @click.native="manage(scope.$index,scope.row)">保存</el-button>
            <el-button @click.native="manage(scope.$index,scope.row)">取消</el-button>
          </div>
      </div>
    </el-dialog>
  </el-row>
</template>

<script>
    import axios from 'axios'
    export default {
      name: "DetailsOfTheTeahouse",
      data(){
        return{
          filters:{},
          details:false,
          list:[]
        }
      },
      methods:{
        manage(){
          this.details = true
        }
      }
    }
</script>

<style scoped lang="scss">
  .details:nth-child(3),
  .details:nth-child(4){
    margin-top:10px;
  }
  .every{
    width:49%;
    display:inline-block;
    input.name{
      width:20%;
    }
    input.desc{
      width:46%;
    }
  }
  .details{
    ul{
      list-style: none;
      width:99%;
      height:200px;
      border:1px solid #606266;
      padding:0;
      margin:0;
      overflow-y: auto;
      li{
        border-bottom:1px solid #606266;
        width:95%;
        margin:0 2.5%;
        padding:1.5% 0;
        span{
          display:inline-block;
          text-align: center;
        }
        span:nth-child(1){
          width:19%;
        }
        span:nth-child(2){
          width:23%;
        }
        span:nth-child(3){
          width:25%;
        }
        span:nth-child(4){
          width:30%;
          color:#409EFF;
          cursor: pointer;
        }
      }
    }
    .button{
      margin:30px 0 0 36%;
    }
  }
</style>
