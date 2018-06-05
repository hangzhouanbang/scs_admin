<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>管理员管理</b></el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main" v-loading="loading" element-loading-text="拼命加载中">
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="filters">
          <el-form-item>
            <el-input v-model="filters.name" placeholder="会员名" @keyup.enter.native="handleSearch"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" v-on:click="handleSearch">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-col>
  </el-row>
</template>

<script>
    export default {
        name: "NewVip",

      data() {
        return {
          filters: {
            name: ''
          },
          books: [],
          total: 0,
          page: 1,
          limit: 10,
          loading: false,
          sels: [], //列表选中列
          editForm: {
            id: 0,
            name: '',
            author: '',
            publishAt: '',
            description: ''
          },
          addForm: {
            name: '',
            author: '',
            publishAt: '',
            description: ''
          }
        }
      },
      methods: {
        handleCurrentChange(val) {
          this.page = val;
          this.search();
        },
        handleSearch() {
          this.total = 0;
          this.page = 1;
          this.search();
        },
        search() {
          let that = this;
          that.loading = false;
        },
        },
        showAddDialog: function () {
          this.addFormVisible = true;
          this.addForm = {
            name: '',
            author: '',
            publishAt: '',
            description: ''
          };
        }
    }
</script>

<style>
  .demo-table-expand label {
    font-weight: bold;
  }

  .toolbar {
    margin-top: 30px;
  }
</style>

