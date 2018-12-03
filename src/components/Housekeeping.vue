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
          <el-input v-model="filters.memberId" @keyup.enter.native="handleSearch()" style="width:220px;"></el-input>
        </el-form-item>
        <el-form-item label="房间号" label-width="68px">
          <el-input v-model="filters.nickname" @keyup.enter.native="handleSearch()" style="width:220px;"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="handleSearch()">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!-- 列表-->
    <el-table :data="users" highlight-current-row
              style="width: 100%;" id="out-table">
      <el-table-column type="index" width="60"></el-table-column>
      <el-table-column prop="id" label="房间号" width="120"></el-table-column>
      <el-table-column prop="transaction_id" label="房间类型" width="120"></el-table-column>
      <el-table-column prop="payerId" label="房间盘数" width="90"></el-table-column>
      <el-table-column prop="payerName" label="参与人数" width="120"></el-table-column>
      <el-table-column prop="productId" label="参与玩家ID" width="120"></el-table-column>
      <el-table-column prop="productName" label="创建时间" width="100"></el-table-column>
      <el-table-column prop="systemMail.createtime" label="操作" width="auto">
        <template slot-scope="scope">
          <el-button type="text" @click.native="particulars(scope.$index,scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--详情-->
    <el-dialog title="对局详情" :visible.sync="GameDetailsDialogVisible" :close-on-click-modal="false" class="see">
      <el-table
        :data="users"
        border
        style="width: 100%">
        <el-table-column
          prop="id"
          label=""
          width="180">
        </el-table-column>
        <el-table-column
          prop="amount2"
          label="">
        </el-table-column>
      </el-table>
      <el-table
        :data="users"
        border
        style="width: 100%;margin-top:5px;">
        <el-table-column
          prop="id"
          label=""
          width="180">
        </el-table-column>
        <el-table-column
          prop="amount2"
          label="">
        </el-table-column>
        <el-table-column
          prop="amount3"
          label="">
        </el-table-column>
      </el-table>
    </el-dialog>
  </el-row>
</template>

<script>
      export default {
          name: "Housekeeping",
          data(){
            return{
              filters:{},
              users:[],
              GameDetailsDialogVisible:false
            }
          }
      }
</script>

<style lang="scss">
  .see{
    .el-table{
      thead{
        display:none;
        th,td{
          border-right:none;
        }
      }
    }
  }
</style>
