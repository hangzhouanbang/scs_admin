<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>会员中心</b></el-breadcrumb-item>
        <el-breadcrumb-item>会员卡</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <!-- 会员卡列表-->
    <el-table :data="users" highlight-current-row @selection-change="selsChange"
              style="width: 100%;margin-top:30px;">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column type="index" width="60"></el-table-column>
      <el-table-column prop="name" label="会员卡名称" width="auto" sortable></el-table-column>
      <el-table-column prop="price" label="会员卡价格" width="auto" sortable></el-table-column>
      <el-table-column prop="score" label="购买获得积分数" width="auto" sortable></el-table-column>
      <el-table-column prop="gold" label="购买获得金币数" width="auto" sortable></el-table-column>
      <el-table-column prop="time" label="延长的会员时间" width="auto" sortable></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="small" @click="showEditCard(scope.$index,scope.row)">编辑</el-button>
          <el-button type="danger" @click="delCard(scope.$index,scope.row)" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--新增会员卡界面-->
    <el-dialog title="新增会员卡" :visible.sync="addCardVisible" :close-on-click-modal="false">
      <el-form :model="addCard" label-width="150px" :rules="editFormRules" ref="addCard">
        <el-form-item label="会员卡名称" prop="name">
          <el-input v-model="addCard.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="会员卡价格" prop="price">
          <el-input v-model="addCard.price" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="购买赠送的金币数" prop="gold">
          <el-input v-model="addCard.gold" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="购买赠送的积分数" prop="score">
          <el-input v-model="addCard.score" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="延长的会员时间" prop="time">
          <el-input v-model="addCard.time" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>

    <!--编辑会员卡-->
    <el-dialog title="编辑会员卡" :visible.sync="editCardVisible" :close-on-click-modal="false">
      <el-form :model="editCard" label-width="150px" :rules="editFormRules" ref="editCard">
        <el-form-item label="会员卡名称" prop="name">
          <el-input v-model="editCard.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="会员卡价格" prop="price">
          <el-input v-model="editCard.price" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="购买赠送金币数" prop="gold">
          <el-input v-model="editCard.gold" :rows="8"></el-input>
        </el-form-item>
        <el-form-item label="购买赠送积分数" prop="score">
          <el-input v-model="editCard.score" :rows="8"></el-input>
        </el-form-item>
        <el-form-item label="延长的会员时间" prop="time">
          <el-input v-model="editCard.time" :rows="8"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editCardVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit">提交</el-button>
      </div>
    </el-dialog>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-button type="danger" @click="batchDeleteCard" :disabled="this.sels.length===0">批量删除</el-button>
      <el-button type="primary" @click="addCards">新增</el-button>
    </el-col>


  </el-row>
</template>

<script>
  import axios from 'axios'

  export default {
    name: "MemberCard",
    data() {
      return {
        users: [],
        loading: false,
        sels: [], //列表选中列
        //编辑相关数据
        editCardVisible: false,//编辑界面是否显示
        editFormRules: {
          name: [
            {required: true, message: '请输入会员卡名称', trigger: 'blur'}
          ],
          price: [
            {required: true, message: '请输入会员卡价格', trigger: 'blur'}
          ],
          gold: [
            {required: true, message: '请输入金币数', trigger: 'blur'}
          ],
          score: [
            {required: true, message: '请输入积分数', trigger: 'blur'}
          ],
          time: [
            {required: true, message: '请输入会员时间', trigger: 'blur'}
          ]
        },
        editCard: {},
        addCard: {},
        //新增相关数据
        addCardVisible: false,//新增界面是否显示
        addLoading: false,
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
          url: '/api/clubcard/showclubcard',
          headers: {
            'Content-type': 'application/x-www-form-urlencoded'
          },
          params: {}
        })
          .then((res) => {
            console.log(res)
              this.users = res.data.data;
              this.total = res.data.pageNumber;
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
      delCard: function (index, row) {
        let that = this;
        this.$confirm('确认删除该记录吗?', '提示', {type: 'warning'}).then(() => {
          that.loading = true;
          axios({
            method: 'post',
            url: '/api/clubcard/deleteclubcard',
            headers: {
              'Content-type': 'application/x-www-form-urlencoded'
            },
            params: {
              'id':row.id
            }
          })
            .then((res) => {
                console.log(res)
                that.loading = false;
                if(res.data.success == true){
                  that.$message.success({showClose: true, message: '删除成功', duration: 1500});
                  that.handleSearch();
                }else{
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
      batchDeleteCard: function () {
        let ids = this.sels.map(item => item.id).toString();
        let that = this;
        this.$confirm('确认删除选中记录吗？', '提示', {
          type: 'warning'
        }).then(() => {
          that.loading = true;
          axios({
            method: 'post',
            url: '/api/clubcard/deleteclubcard',
            headers: {
              'Content-type': 'application/x-www-form-urlencoded'
            },
            params: {
              'id':ids
            }
          })
            .then((res) => {
                that.loading = false;
                if(res.data.success == true){
                  that.$message.success({showClose: true, message: '删除成功', duration: 1500});
                  that.handleSearch();
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
      //显示新增界面
      addCards: function () {
        this.addCardVisible = true;
        this.addCard = {};
      },
      //新增
      addSubmit: function () {
        axios({
          method: 'post',
          url: '/api/clubcard/addclubcard',
          headers: {
            'Content-type': 'application/x-www-form-urlencoded'
          },
          params:{
            'name':this.addCard.name,
            'price':this.addCard.price,
            'gold':this.addCard.gold,
            'score':this.addCard.score,
            'time':this.addCard.time
          }
        })
          .then((res) => {
            console.log(res.data)
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
                this.addCardVisible = false;//关闭弹窗
                this.handleSearch();
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
      //编辑界面显示
      showEditCard: function(index,row){
        this.editCardVisible = true;
        this.editCard = Object.assign({}, row);
      },
      //编辑
      editSubmit: function () {
        this.$refs.editCard.validate((valid) => {
          if (valid) {
            this.loading = true;
            axios({
              method: 'post',
              url: '/api/clubcard/updateclubcard',
              headers: {
                'Content-type': 'application/x-www-form-urlencoded'
              },
              params: {
                'id':this.editCard.id,
                'name':this.editCard.name,
                'price':this.editCard.price,
                'gold':this.editCard.gold,
                'score':this.editCard.score,
                'time':this.editCard.time
              }
            })
              .then((res) => {
                  this.loading = false;
                  if (res.data.success == true) {
                    this.editCardVisible = false;
                    this.$message.success({showClose: true, message: '修改成功', duration: 1500});
                    this.handleSearch();
                  } else {
                    this.$message.error({showClose: true, message: err.toString(), duration: 2000});
                  }
                },
              ).catch((e) => {
              this.loading = false;
              // console.log(e);
              this.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
            });
          }
        });
      },
    },
    mounted() {
      this.handleSearch()
    }
  }
</script>

<style scoped>
  .toolbar{
    margin-top:30px;
  }
</style>
