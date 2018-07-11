<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>权限管理</b></el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main" v-loading="loading" element-loading-text="拼命加载中">
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="filters">
          <el-form-item>
            <el-input v-model="filters.privilege" placeholder="权限名称" @keyup.enter.native="handleSearch"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" v-on:click="handleSearch">查询</el-button>
            <el-button type='primary' @click="addPrivilegeDialog">新增</el-button>
          </el-form-item>
        </el-form>
      </el-col>

      <!-- 权限列表-->
      <el-table :data="users" highlight-current-row @selection-change="selsChange"
                style="width: 100%;">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type="index" width="60"></el-table-column>
        <el-table-column prop="privilege" label="权限名称" width="auto" sortable></el-table-column>
        <el-table-column prop="uri" label="URI" width="auto" sortable></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="small" @click="showEditPrivilege(scope.$index,scope.row)">编辑</el-button>
            <el-button type="danger" @click="delprivilege(scope.$index,scope.row)" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>

    <!--新增权限界面-->
    <el-dialog title="新增权限" :visible.sync="addprivilegeVisible" :close-on-click-modal="false">
      <el-form :model="addprivilege" label-width="80px" :rules="addFormRules" ref="addprivilege" id="cc">
        <el-form-item label="权限名称" prop="privilege">
          <el-input v-model="addprivilege.privilege" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="URI" prop="uri">
          <el-input v-model="addprivilege.uri" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <!--<i class="el-icon-circle-plus" @click="add"></i>-->
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addprivilegeVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>

    <!--编辑权限页面-->
    <el-dialog title="编辑权限" :visible.sync="editprivilegeVisible" :close-on-click-modal="false">
      <el-form :model="editPrivilege" label-width="100px" :rules="editFormRules" ref="editPrivilege">
        <el-form-item label="权限名称" prop="privilege">
          <el-input v-model="editPrivilege.privilege" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="URI" prop="uri">
          <el-input v-model="editPrivilege.uri" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editprivilegeVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit">提交</el-button>
      </div>
    </el-dialog>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-button type="danger" @click="batchDeleteprivilege" :disabled="this.sels.length===0">批量删除</el-button>
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="1" :total="total"
                     style="float:right;">
      </el-pagination>
    </el-col>
  </el-row>
</template>

<script>
  import axios from 'axios'

  export default {
    name: "Jurisdiction",
    data() {
      return {
        users: [],
        filters: {
          name: ''
        },
        total: 0,
        page: 1,
        number: 1,
        limit: 10,
        loading: false,
        sels: [], //列表选中列
        //编辑相关数据
        editprivilegeVisible: false,//编辑界面是否显示
        editFormRules: {
          privileges: [
            {required: true, message: '请输入权限名称', trigger: 'blur'}
          ],
          uris: [
            {required: true, message: '请输入URI', trigger: 'blur'}
          ]
        },
        editPrivilege: {},
        addprivilege: {},
        //新增相关数据
        addprivilegeVisible: false,//新增界面是否显示
        addLoading: false,
        addFormRules: {
          privilege: [
            {required: true, message: '请输入权限名称', trigger: 'blur'}
          ],
          uri: [
            {required: true, message: '请输入URI', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      handleCurrentChange(val) {
        this.page = val;
        this.handleSearch(this.page);
      },
      handleSearch() {
        axios({
          method: 'post',
          url: '/api/privilege/queryprivilege',
          headers: {
            'Content-type': 'application/x-www-form-urlencoded'
          },
          params: {
            'page': this.page,
            'size': '10',
            'privilege': this.filters.privilege
          }
        })
          .then((res) => {
              this.users = res.data.data.items;
              this.total = res.data.data.pageCount;
            },
          ).catch((e) => {
          if (e && e.response) {
            switch (e.response.status) {
              case 504:
                this.$message({
                  showClose: true,
                  message: '服务器异常',
                  type: 'warning'
                });
                break
              case 405:
                this.$message({
                  showClose: true,
                  message: '请先登录',
                  type: 'warning'
                });
                break
            }
          }
        });
      },
      selsChange: function (sels) {
        this.sels = sels;
      },
      //删除
      delprivilege: function (index, row) {
        let that = this;
        this.$confirm('确认删除该记录吗?', '提示', {type: 'warning'}).then(() => {
          that.loading = true;
          axios({
            method: 'post',
            url: '/api/privilege/deleteprivilege',
            headers: {
              'Content-type': 'application/x-www-form-urlencoded'
            },
            params: {
              'id': row.id
            }
          })
            .then((res) => {
                console.log(res)
                that.loading = false;
                if (res.data.success == true) {
                  that.$message.success({showClose: true, message: '删除成功', duration: 1500});
                  that.handleSearch();
                } else {
                  that.$message.error({showClose: true, message: err.toString(), duration: 2000});
                }
              }
            ).catch((e) => {
            that.loading = false;
            console.log(error);
            that.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
          });
        });
      },
      //批量删除
      batchDeleteprivilege: function () {
        let ids = this.sels.map(item => item.id).toString();
        let that = this;
        this.$confirm('确认删除选中记录吗？', '提示', {
          type: 'warning'
        }).then(() => {
          that.loading = true;
          axios({
            method: 'post',
            url: '/api/privilege/deleteprivilege',
            headers: {
              'Content-type': 'application/x-www-form-urlencoded'
            },
            params: {
              'id': ids
            }
          })
            .then((res) => {
                that.loading = false;
                if (res.data.success == true) {
                  that.$message.success({showClose: true, message: '删除成功', duration: 1500});
                  that.handleSearch();
                } else {
                  that.$message.error({showClose: true, message: err.toString(), duration: 2000});
                }
              },
            ).catch((e) => {
            that.loading = false;
            console.log(error);
            that.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
          });
        });
      },
      //显示新增界面
      addPrivilegeDialog: function (index, row) {
        this.addprivilegeVisible = true;
        this.addprivilege = {};
      },
      //新增
      addSubmit: function () {
        let privileges = [
          {
            'privilege': this.addprivilege.privilege,
            'uri': this.addprivilege.uri
          }
        ]
        let params = JSON.stringify(privileges)
        axios({
          method: 'post',
          url: '/api/privilege/deployprivilege',
          headers: {
            'Content-type': 'application/x-www-form-urlencoded'
          },
          params: {
            'privileges': params
          }
        })
          .then((res) => {
              if (res.data.success == false) {
                this.$message({
                  showClose: true,
                  message: '添加失败',
                  type: 'warning'
                });
              } else if (res.data.success == true) {
                this.$message({
                  showClose: true,
                  message: '添加成功',
                  type: 'success'
                });
                this.addprivilegeVisible = false;//关闭弹窗
                this.handleSearch(1);
              }
            },
          ).catch((e) => {
          if (e && e.response) {
            switch (e.response.status) {
              case 504:
                this.$message({
                  showClose: true,
                  message: '服务器异常',
                  type: 'warning'
                });
                break
              case 405:
                this.$message({
                  showClose: true,
                  message: '请先登录',
                  type: 'warning'
                });
                break
            }
          }
        });
      },
      //编辑界面显示
      showEditPrivilege: function (index, row) {
        this.editprivilegeVisible = true;
        this.editPrivilege = Object.assign({}, row);
      },
      //编辑
      editSubmit: function () {
        this.$refs.editPrivilege.validate((valid) => {
          if (valid) {
            this.loading = true;
            axios({
              method: 'post',
              url: '/api/privilege/updateprivilege',
              headers: {
                'Content-type': 'application/x-www-form-urlencoded'
              },
              params: {
                'id': this.editPrivilege.id,
                'privilege': this.editPrivilege.privilege,
                'uri': this.editPrivilege.uri
              }
            })
              .then((res) => {
                  this.loading = false;
                  if (res.data.success == true) {
                    this.editprivilegeVisible = false;
                    this.$message.success({showClose: true, message: '修改成功', duration: 1500});
                    this.handleSearch(1);
                  } else {
                    this.$message.error({showClose: true, message: err.toString(), duration: 2000});
                  }
                },
              ).catch((e) => {
              this.loading = false;
              console.log(error);
              this.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
            });
          }
        });
      },
    },
    mounted() {
      this.handleSearch(1)
    }
  }

</script>

<style scoped>
  .demo-table-expand label {
    font-weight: bold;
  }

  .toolbar {
    margin-top: 30px;
  }

  .el-icon-circle-plus {
    width: 30px !important;
    height: 30px !important;
    display: block;
    margin-left: 30px;
    cursor: pointer;
  }

  .el-icon-circle-plus::before {
    width: 30px !important;
    height: 30px !important;
    display: block;
  }
</style>
