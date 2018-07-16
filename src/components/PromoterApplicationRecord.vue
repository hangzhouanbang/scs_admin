<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>推广员中心</b></el-breadcrumb-item>
        <el-breadcrumb-item>推广员申请记录</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item label="注册时间" label-width="68px">
          <el-date-picker
            v-model="filters.startTime"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="至" label-width="68px">
          <el-date-picker
            v-model="filters.endTime"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="handleSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!-- 申请记录列表-->
    <el-table :data="record" highlight-current-row style="width: 100%;">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column type="index" width="60"></el-table-column>
      <el-table-column prop="memberId" label="微信头像" width="auto" sortable></el-table-column>
      <el-table-column prop="systemMail.file" label="注册昵称" width="auto" sortable></el-table-column>
      <el-table-column prop="systemMail.mailType" label="申请时间" width="auto" sortable></el-table-column>
      <el-table-column prop="systemMail.number" label="手机号码" width="auto" sortable></el-table-column>
      <el-table-column prop="systemMail.integral" label="姓名" width="auto" sortable></el-table-column>
      <el-table-column prop="vipCardName" label="身份证号" width="auto" sortable></el-table-column>
      <el-table-column prop="systemMail.validTime" label="身份证正反照" width="auto" sortable>
        <template slot-scope="scope">
          <el-button type="text">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="systemMail.createtime" label="操作" width="auto" sortable>
        <template slot-scope="scope">
          <el-button type="text">通过</el-button>
          <el-button type="text">拒绝</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      title=""
      :visible.sync="centerDialogVisible"
      width="37%"
      center>
      <div class="IMG">
        <div class="leftImg">
          <p>图片1</p>
          <img src="../assets/images/girl.jpg" alt="">
        </div>
        <div class="rightImg">
          <p>图片2</p>
          <img src="../assets/images/girl.jpg" alt="">
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="centerDialogVisible = false" class="sure">确 定</el-button>
      </span>
    </el-dialog>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="1" :total="total"
                     style="float:right;">
      </el-pagination>
    </el-col>

  </el-row>
</template>

<script>
    import axios from 'axios'

    export default {
        name: "PromoterApplicationRecord",
        data(){
          return{
            filters:{},
            record:[],
            total:0,
            centerDialogVisible:false
          }
        },
      methods:{
        handleSearch(){

        },
        handleCurrentChange(){}
      },
      mounted(){

      }
    }
</script>

<style scoped>
  .toolbar{
    margin-top:30px;
  }
  .el-form--inline .el-form-item{
    margin-right:-32px;
  }
  .el-button--primary{
    margin-left:50px;
  }
  .leftImg,
  .rightImg{
    float:left;
  }
  .rightImg{
    margin-left:72px;
  }
  .leftImg img,
  .rightImg img{
    width:200px;
    height:120px;
  }
  p{
    text-align: center;
  }
  .sure{
    margin:52px;
  }
</style>
