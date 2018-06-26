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
            <el-input v-model="filters.nickname" placeholder="用户名" @keyup.enter.native="handleSearch"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" v-on:click="handleSearch">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="showAddDialog">新增</el-button>
          </el-form-item>
        </el-form>
      </el-col>

      <!-- 管理员列表-->
      <el-table :data="users" highlight-current-row @selection-change="selsChange"
                style="width: 100%;">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type="index" width="60"></el-table-column>
        <el-table-column prop="nickname" label="用户名" width="100" sortable></el-table-column>
        <el-table-column prop="user" label="姓名" width="100" sortable></el-table-column>
        <el-table-column prop="idCard" label="身份证号" width="170" sortable></el-table-column>
        <el-table-column prop="roleList[0].role" label="角色" width="100" sortable></el-table-column>
        <el-table-column prop="createTime" label="添加时间" width="160" sortable></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="small" @click="showEditDialog(scope.$index,scope.row)">修改密码</el-button>
            <el-button size="small" @click="showEditRole(scope.$index,scope.row)">编辑角色</el-button>
            <el-button type="danger" @click="delBook(scope.$index,scope.row)" size="small">删除</el-button>
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

      <el-dialog title="修改密码" :visible.sync="editFormVisible" :close-on-click-modal="false">
        <el-form :model="editForm" label-width="100px" :rules="editFormRules" ref="editForm">
          <el-form-item label="用户名" prop="nickname">
            <el-input v-model="editForm.nickname" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="user">
            <el-input v-model="editForm.user" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="身份证号" prop="idCard">
            <el-input v-model="editForm.idCard" :rows="8"></el-input>
          </el-form-item>
          <el-form-item label="添加时间" prop="createTime">
            <el-input v-model="editForm.createTime" :rows="8"></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="editForm.password" type='password' :rows="8"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="editFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="editSubmit">提交</el-button>
        </div>
      </el-dialog>
      <!--编辑角色-->
      <el-dialog title="编辑角色" :visible.sync="editRoleVisible" :close-on-click-modal="false">
        <el-table :data="roles" highlight-current-row @selection-change="selsChange"
                  style="width: 100%;">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="角色名称" prop="role"></el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="editRoleVisible = false">取消</el-button>
          <el-button type="primary" @click.native="roleSubmit">提交</el-button>
        </div>
      </el-dialog>
      <!--新增界面-->
      <el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false">
        <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
          <el-form-item label="用户名" prop="nickname">
            <el-input v-model="addForm.nickname" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="pass">
            <el-input type="password" v-model="addForm.pass" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="user">
            <el-input v-model="addForm.user" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="身份证号" prop="idCard">
            <el-input v-model="addForm.idCard" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="addFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
        </div>
      </el-dialog>

    </el-col>
  </el-row>
</template>

<script>

  import axios from 'axios'

  export default {
    name: "Admin",
    data() {
      return {
        radio: '',//默认性别选择
        users: [],
        roles: [],
        filters: {
          name: ''
        },
        books: [],
        total: 0,
        page: 1,
        limit: 10,
        loading: false,
        sels: [], //列表选中列
        //编辑相关数据
        editFormVisible: false,//编辑界面是否显示
        checked: true,
        editFormRules: {
          name: [
            {required: true, message: '请输入书名', trigger: 'blur'}
          ],
          author: [
            {required: true, message: '请输入作者', trigger: 'blur'}
          ],
          description: [
            {required: true, message: '请输入简介', trigger: 'blur'}
          ]
        },
        editForm: {},
        editRole: {},
        addForm: {},
        //新增相关数据
        addFormVisible: false,//新增界面是否显示
        editRoleVisible: false,//新增界面是否显示
        addLoading: false,
        addFormRules: {
          nickname: [
            {required: true, message: '请输入用户名', trigger: 'blur'}
          ],
          pass: [
            {required: true, message: '请输入密码', trigger: 'blur'}
          ],
          user: [
            {required: true, message: '请输入真实姓名', trigger: 'blur'}
          ],
          idCard: [
            {required: true, message: '请输入身份证号', trigger: 'blur'}
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
          url: '/api/adminCtrl/queryAdmin',
          headers: {
            'Content-type': 'application/x-www-form-urlencoded'
          },
          params: {
            'page': this.page,
            'size': '10',
            'nickname':this.filters.nickname
          }
        })
          .then((res) => {
              this.users = res.data.adminList;
              this.total = res.data.pageNumber;
              for(let i = 0;i < this.users.length;i++){
                this.users[i].createTime = this.dateTimeFormat(this.users[i].createTime);
              }
            },
          ).catch((e) => {
          if(e && e.response){
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
      delBook: function (index,row) {
        let that = this;
        this.$confirm('确认删除该记录吗?', '提示', {type: 'warning'}).then(() => {
          that.loading = true;
          axios({//根据昵称查询
            method: 'post',
            url: '/api/adminCtrl/deleteAdmin',
            headers: {
              'Content-type': 'application/x-www-form-urlencoded'
            },
            params: {
              'id':row.id
            }
          })
            .then((res) => {
                that.loading = false;
                if(res.data == 'success'){
                  that.$message.success({showClose: true, message: '删除成功', duration: 1500});
                  that.handleSearch(1);
                }else{
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
      //显示修改密码界面
      showEditDialog: function (index, row) {
        this.editFormVisible = true;
        this.editForm = Object.assign({}, row);
      },
      //修改密码
      editSubmit: function () {
        this.editForm.createTime = this.dateTimeFormat(this.editForm.createTime);
        this.$refs.editForm.validate((valid) => {
          if (valid) {
            this.loading = true;
            axios({
              method: 'post',
              url: '/api/adminCtrl/editAdmin',
              headers: {
                'Content-type': 'application/x-www-form-urlencoded'
              },
              params: {
                'id': this.editForm.id,
                'pass': this.editForm.password,
              }
            })
              .then((res) => {
                  this.loading = false;
                  if (res.data == 'success') {
                    this.editFormVisible = false;
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
      //编辑角色界面显示
      showEditRole: function(index,row){
        this.editRoleVisible = true;
        this.editRole = Object.assign({}, row);
        axios({
          method: 'post',
          url: '/api/roleCtrl/queryAllRole',
          headers: {
            'Content-type': 'application/x-www-form-urlencoded'
          },
          params: {}
        })
          .then((res) => {
              this.roles = res.data;
            },
          ).catch((e) => {
        });
      },
      //编辑角色
      roleSubmit: function () {
        let roleids = this.sels.map(item => item.id).toString();
        console.log(roleids)
        console.log(this.editRole)
        axios({
          method: 'post',
          url: '/api/adminCtrl/editRole',
          headers: {
            'Content-type': 'application/x-www-form-urlencoded'
          },
          params: {
            adminId:this.editRole.id,
            roleId:roleids
          }
        })
          .then((res) => {
              console.log(res.data)
            if (res.data == "fail") {
              this.$message({
                showClose: true,
                message: '编辑失败',
                type: 'warning'
              });
            } else if (res.data == "success") {
              this.$message({
                showClose: true,
                message: '编辑成功',
                type: 'success'
              });
              this.editRoleVisible = false;//关闭弹窗
              this.handleSearch(1);
            }
            },
          ).catch((e) => {
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
      //新增
      addSubmit: function () {
        axios({
          method: 'post',
          url: '/api/adminCtrl/addAdmin',
          headers: {
            'Content-type': 'application/x-www-form-urlencoded'
          },
          params: {
            'nickname': this.addForm.nickname,
            'pass': this.addForm.pass,
            'user': this.addForm.user,
            'idCard': this.addForm.idCard,
            // 'sex':this.radio
          }
        })
          .then((res) => {
              if (res.data == "fail") {
                this.$message({
                  showClose: true,
                  message: '添加失败',
                  type: 'warning'
                });
              } else if (res.data == "success") {
                this.$message({
                  showClose: true,
                  message: '添加成功',
                  type: 'success'
                });
                this.addFormVisible = false;//关闭弹窗
                this.handleSearch(1);
              }
            },
          ).catch((e) => {
          if(e && e.response){
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
          axios({//根据昵称查询
            method: 'post',
            url: '/api/adminCtrl/deleteAdmin',
            headers: {
              'Content-type': 'application/x-www-form-urlencoded'
            },
            params: {
              'id':ids
            }
          })
            .then((res) => {
                that.loading = false;
                if(res.data == 'success'){
                  that.$message.success({showClose: true, message: '删除成功', duration: 1500});
                  that.handleSearch(1);
                }else{
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
      this.handleSearch(1)
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
