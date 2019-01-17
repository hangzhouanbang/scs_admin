<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>茶馆管理</b></el-breadcrumb-item>
        <el-breadcrumb-item>茶馆开通审核</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item label="推广员ID">
          <el-input v-model.trim="filters.id" @keyup.enter.native="handleSearch(1)"></el-input>
        </el-form-item>
        <el-form-item label="推广员昵称">
          <el-input v-model.trim="filters.nickname" @keyup.enter.native="handleSearch(1)"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="handleSearch(1)">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!-- 茶馆开通审核列表-->
    <el-table :data="record" highlight-current-row style="width: 100%;">
      <el-table-column type="index" width="60"></el-table-column>
      <el-table-column prop="headimgurl" label="推广员头像" width="120">
        <template slot-scope="scope">
          <img :src="scope.row.headimgurl" alt="" style="width: 50px;height: 50px">
        </template>
      </el-table-column>
      <el-table-column prop="id" label="推广员ID" width="120"></el-table-column>
      <el-table-column prop="nickname" label="推广员昵称" width="150"></el-table-column>
      <el-table-column prop="createTime" label="申请时间" width="160"  sortable="custom"></el-table-column>
      <el-table-column prop="inviteMemberNum" label="代理级别" width="120"  sortable="custom"></el-table-column>
      <el-table-column prop="juniorNum" label="绑定玩家数" width="120"  sortable="custom"></el-table-column>
      <el-table-column prop="systemMail.createtime" label="操作" width="auto">
        <template slot-scope="scope">
          <el-button type="text" @click.native="pass(scope.$index,scope.row)">通过</el-button>
          <el-button type="text" @click.native="unpass(scope.$index,scope.row)">拒绝</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--点击通过后提示-->
    <el-dialog title="" :visible.sync="passVisible" :close-on-click-modal="false" class="tip">
      <div class="content">
        <div class="title">提示</div>
        <div class="matter">是否通过该代理的茶馆开通申请？</div>
        <el-button size="small" class="anniu cancel"  @click.native="passVisible = false">取消</el-button>
        <el-button size="small" type="primary" class="anniu" @click.native="through">通过</el-button>
      </div>
    </el-dialog>

    <!--点击驳回后提示-->
    <el-dialog title="" :visible.sync="passVisible" :close-on-click-modal="false" class="tip">
      <div class="content">
        <div class="title">提示</div>
        <div class="matter">是否拒绝该代理的茶馆开通申请？</div>
        <el-button size="small" class="anniu cancel"  @click.native="passVisible = false">取消</el-button>
        <el-button size="small" type="primary" class="anniu" @click.native="reject">拒绝</el-button>
      </div>
    </el-dialog>
  </el-row>
</template>

<script>
    export default {
        name: "ReviewTheOpeningOfTeahouse",
        data(){
          return{
            filters:{},
            record:[]
          }
        }
    }
</script>

<style scoped lang="scss">
  .toolbar{
    margin-top:30px;
  }
  .content{
    width:300px;
    height:200px;
    border:1px solid #000;
    border-radius: 5px;
    margin:0 auto;
    .title{
      text-align: center;
      height:50px;
      line-height: 50px;
      border-bottom:1px solid #000;
      font-weight:bold;
      font-size:20px;
    }
    .matter{
      height: 50px;
      border-bottom: 1px solid #000;
      text-align: center;
      font-size: 18px;
      padding: 25px;
    }
    .anniu{
      margin-top:8px;
    }
    .cancel{
      margin-left:90px;
    }
    .result{
      height:50px;
      line-height:50px;
      font-size:18px;
      margin-left:20px;
    }
    .through{
      margin:10px 0 0 120px;
    }
  }
  .tip{
    .el-dialog{
      width:25%;
    }
  }
</style>
