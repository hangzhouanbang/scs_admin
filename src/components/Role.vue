<!--角色管理-->
<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>角色管理</b></el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main" v-loading="loading" element-loading-text="拼命加载中">
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="filters">
          <el-form-item>
            <el-input v-model="filters.role" placeholder="角色名称" @keyup.enter.native="handleSearch"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" v-on:click="handleSearch">查询角色</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="showAddDialog">新增角色</el-button>
          </el-form-item>
        </el-form>
      </el-col>

      <!-- 角色列表-->
      <el-table :data="role" highlight-current-row @selection-change="selsChange"
                style="width: 100%;">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type="index" width="60"></el-table-column>
        <el-table-column prop="role" label="角色名称" width="100"></el-table-column>
        <el-table-column label="角色权限" width="200" height="300px">
          <template slot-scope="scope">
            <ul style="margin-left:-26px;height: 110px;overflow: auto;">
              <li v-for="privileges in scope.row.privilegeList">{{privileges.privilege}}</li>
            </ul>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="small" @click="showEditDialog(scope.$index,scope.row)">编辑角色</el-button>
            <el-button size="small" @click="showchoose(scope.$index,scope.row)">编辑角色权限</el-button>
            <el-button type="danger" @click="delBook(scope.$index,scope.row)" size="small">删除角色</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--工具条-->
      <el-col :span="24" class="toolbar">
        <el-button type="danger" @click="batchDeleteBook" :disabled="this.sels.length===0">批量删除</el-button>
        <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="1" :total="total"
                       style="float:right;">
        </el-pagination>
      </el-col>

      <!--编辑角色弹窗-->
      <el-dialog title="编辑角色" :visible.sync="editFormVisible" :close-on-click-modal="false">
        <el-form :model="editForm" label-width="100px" :rules="editFormRules" ref="editForm">
          <el-form-item label="角色名称" prop="role">
            <el-input v-model="editForm.role" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="editFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="editSubmit">提交</el-button>
        </div>
      </el-dialog>

      <!--新增角色弹窗-->
      <el-dialog title="新增角色" :visible.sync="addFormVisible" :close-on-click-modal="false">
        <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
          <el-form-item label="角色名称" prop="role">
            <el-input v-model="addForm.role" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="addFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
        </div>
      </el-dialog>

      <!--角色权限管理弹窗-->
      <el-dialog title="角色权限管理" :visible.sync="chooseFormVisible" :close-on-click-modal="false">
        <el-form :model="chooseForm" label-width="100px">
          <el-table :data="privilege" highlight-current-row @selection-change="selsChange1"
                    style="width: 100%;" ref="table">
            <el-table-column type="selection" width="55" :reserve-selection="true"></el-table-column>
            <el-table-column type="index" width="60"></el-table-column>
            <el-table-column prop="privilege" label="权限列表"></el-table-column>
          </el-table>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="chooseFormVisible = false">取消</el-button>
          <el-button type="danger" @click.native="chooseSubmit" :disabled="this.sels1.length===0">保存</el-button>
        </div>
      </el-dialog>

    </el-col>
  </el-row>
</template>

<script>
  import axios from 'axios'
  import vue from 'vue'

  export default {
    name: "Admin",
    inject:["reload"],
    data() {
      return {
        role: [],//角色
        privilege: [],//权限
        filters: {
          name: ''
        },
        total: 0,
        page: 1,
        limit: 10,
        loading: false,
        sels: [], //列表选中列
        sels1: [], //列表选中列

        //编辑相关数据
        editFormVisible: false,//编辑界面是否显示
        chooseFormVisible: false,//角色管理界面是否显示
        editFormRules: {
          role: [
            {required: true, message: '请输入角色名称', trigger: 'blur'}
          ],
        },
        editForm: {
          id: 0,
          name: '',
          author: '',
          publishAt: '',
          description: ''
        },
        chooseForm: {
          id: 0,
          name: '',
          author: '',
          publishAt: '',
          description: ''
        },
        //新增相关数据
        addFormVisible: false,//新增界面是否显示
        addLoading: false,
        addFormRules: {
          role: [
            {required: true, message: '请输入用户名', trigger: 'blur'}
          ]
        },
        addForm: {
          name: '',
          author: '',
          publishAt: '',
          description: ''
        },
      }
    },
    methods: {
      trim(str) {
        if(str != null){
          return str.replace(/(^\s+)|(\s+$)/g, "");
        }
      },
      handleCurrentChange(val) {
        this.page = val;
        this.handleSearch(this.page);
      },
      handleSearch() {
        axios({//根据角色名称查询
          method: 'post',
          url: this.global.mPath + '/role/queryrole',
          headers: {
            'Content-type': 'application/x-www-form-urlencoded'
          },
          params: {
            'page': this.page,
            'size': '15',
            'role': this.trim(this.filters.role),
            'token':sessionStorage.getItem('token')
          }
        })
          .then((res) => {
              //console.log(res)
              this.role = res.data.data.items;
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
      selsChange1: function (sels) {
        this.sels1 = sels;
      },
      //删除角色
      delBook: function (index, row) {
        let that = this;
        this.$confirm('确认删除该记录吗?', '提示', {type: 'warning'}).then(() => {
          that.loading = true;
          axios({
            method: 'post',
            url: this.global.mPath + '/role/deleterole',
            headers: {
              'Content-type': 'application/x-www-form-urlencoded'
            },
            params: {
              'id': row.id,
              'token':sessionStorage.getItem('token')
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
      //显示编辑角色界面
      showEditDialog: function (index, row) {
        this.editFormVisible = true;
        this.editForm = Object.assign({}, row);
      },
      //编辑角色
      editSubmit: function () {
        axios({
          method: 'post',
          url: this.global.mPath + '/role/updaterole',
          headers: {
            'Content-type': 'application/x-www-form-urlencoded'
          },
          params: {
            'id': this.trim(this.editForm.id),
            'role': this.trim(this.editForm.role),
            'token':sessionStorage.getItem('token')
          }
        })
          .then((res) => {
              if (res.data.success == false) {
                this.$message({
                  showClose: true,
                  message: '编辑失败',
                  type: 'warning'
                });
              } else if (res.data.success == true) {
                this.$message({
                  showClose: true,
                  message: '编辑成功',
                  type: 'success'
                });
                this.editFormVisible = false;//关闭编辑角色弹窗
                this.handleSearch();
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
      showAddDialog: function () {
        this.addFormVisible = true;
        this.addForm = {
          name: '',
          author: '',
          publishAt: '',
          description: ''
        };
      },
      //显示角色管理界面
      showchoose: function (index, row) {
        //查询所有权限
        axios({
          method: 'post',
          url: this.global.mPath + '/privilege/queryallprivilege',
          headers: {
            'Content-type': 'application/x-www-form-urlencoded'
          },
          params:{
            'roleId':row.id,
            'token':sessionStorage.getItem('token')
          }
        })
          .then((res) => {
              this.privilege = res.data.data;
              for(let i = 0;i < this.privilege.length;i++){
                if(this.privilege[i].selected == true){
                  this.$refs.table.toggleRowSelection(this.privilege[i],true)
                }
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
        this.chooseFormVisible = true;
        this.editForm = Object.assign({}, row);
      },
      //编辑角色权限
      chooseSubmit: function () {
        let ids = this.sels1.map(item => item.id).toString();
        // console.log(ids)
        let that = this;
        this.$confirm('确认保存选中记录吗？', '提示', {
          type: 'warning'
        }).then(() => {
          that.loading = true;
          axios({
            method: 'post',
            url: this.global.mPath + '/role/editprivilege',
            headers: {
              'Content-type': 'application/x-www-form-urlencoded'
            },
            params: {
              'roleId': this.trim(this.editForm.id),//角色id
              'privilegeId': ids,//权限id数组
              'token':sessionStorage.getItem('token')
            }
          })
            .then((res) => {
                that.loading = false;
                if (res.data.success == true) {
                  that.reload();
                  that.$message.success({showClose: true, message: '保存成功', duration: 1500});
                  this.chooseFormVisible = false;//关闭弹窗
                  this.handleSearch();
                } else {
                  this.$message({
                    showClose: true,
                    message: '保存失败',
                    type: 'warning'
                  });
                  this.chooseFormVisible = false;//关闭弹窗
                }
              },
            ).catch((e) => {
            that.loading = false;
            that.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
          });
        });
      },
      //新增角色
      addSubmit: function () {
        axios({
          method: 'post',
          url: this.global.mPath + '/role/addrole',
          headers: {
            'Content-type': 'application/x-www-form-urlencoded'
          },
          params: {
            'role': this.trim(this.addForm.role),//角色名称
            'token':sessionStorage.getItem('token')
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
                this.addFormVisible = false;//关闭弹窗
                this.handleSearch();
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
      //批量删除
      batchDeleteBook: function () {
        let ids = this.sels.map(item => item.id).toString();
        let that = this;
        this.$confirm('确认删除选中记录吗？', '提示', {
          type: 'warning'
        }).then(() => {
          that.loading = true;
          axios({
            method: 'post',
            url: this.global.mPath + '/role/deleterole',
            headers: {
              'Content-type': 'application/x-www-form-urlencoded'
            },
            params: {
              'id': ids,
              'token':sessionStorage.getItem('token')
            }
          })
            .then((res) => {
                that.loading = false;
                if (res.data.success == true) {
                  that.$message.success({showClose: true, message: '删除成功', duration: 1500});
                  that.handleSearch(1);
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
      }
    },
    mounted() {
      this.handleSearch()
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
