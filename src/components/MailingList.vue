<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>邮件管理</b></el-breadcrumb-item>
        <el-breadcrumb-item>邮件列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item label="用户ID" label-width="68px">
          <el-input v-model.trim="filters.nickname" placeholder="用户ID" @keyup.enter.native="handleSearch"></el-input>
        </el-form-item>
        <el-form-item label="类型" label-width="68px">
          <el-select v-model="filters.type" placeholder="请选择"  clearable>
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="handleSearch(1)">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!-- 邮件列表-->
    <el-table :data="email" highlight-current-row @selection-change="selsChange" style="width: 100%;">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column type="index" width="60"></el-table-column>
      <el-table-column prop="memberId" label="用户ID" width="auto"></el-table-column>
      <el-table-column prop="systemMail.file" label="邮件内容" width="auto">
        <template slot-scope="scope">
          <img :src="scope.row.systemMail.file" alt=""style="width:50px;height:50px;">
        </template>
      </el-table-column>
      <el-table-column prop="systemMail.mailType" label="类型" width="auto"></el-table-column>
      <el-table-column prop="systemMail.number" label="玉石" width="auto"></el-table-column>
      <el-table-column prop="systemMail.integral" label="礼券" width="auto"></el-table-column>
      <el-table-column prop="systemMail.vipcard" label="会员卡" width="auto"></el-table-column>
      <el-table-column prop="systemMail.validTime" label="有效时间" width="auto"></el-table-column>
      <el-table-column prop="systemMail.createtime" label="发送时间" width="auto"></el-table-column>
      <el-table-column prop="receive" label="是否领取" width="auto"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
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
  </el-row>
</template>

<script>
    import axios from 'axios'
    export default {
        name: "MailingList",
        data(){
          return{
            filters:{},
            email:[],
            sels: [],
            total:0,
            options:[
              {value:'活动奖励'},
              {value:'系统通知'},
              {value:'活动通知'}
            ],
            page:''
          }
        },
      methods:{
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
        handleSearch(page){
          axios({
            method: 'post',
            url: this.global.mPath + '/mailctrl/find_mail_record',
            headers: {
              'Content-type': 'application/x-www-form-urlencoded'
            },
            params: {
              memberId:this.filters.nickname,
              mailType:this.filters.type,
              page:page,
              size:'10',
              token:sessionStorage.getItem('token'),
            }
          })
            .then((res) => {
                // console.log(res.data.data)
                this.email = res.data.data.items;
                this.total = res.data.data.pageCount;
                for(let i = 0; i < this.email.length;i++){
                  // console.log(this.email[i])
                  if(this.email[i].receive == 1){
                    this.email[i].receive = '未领取';
                  }
                  if(this.email[i].receive == 0){
                    this.email[i].receive = '已领取';
                  }
                  this.email[i].systemMail.createtime = this.dateTimeFormat(this.email[i].systemMail.createtime);
                  this.email[i].systemMail.validTime = this.dateTimeFormat(this.email[i].systemMail.validTime);
                }
              },
            ).catch((e) => {
            if(e && e.response){
              switch (e.response.status) {
                case 504:
                  this.$message({showClose: true, message: '服务器异常', type: 'warning'});
                  break
                case 405:
                  this.$message({showClose: true, message: '请先登录', type: 'warning'});
                  break
              }
            }
          });
        },
        selsChange: function (sels) {
          this.sels = sels;
        },
        delBook:function(index,row){
          let that = this;
          this.$confirm('确认删除该记录吗?', '提示', {type: 'warning'}).then(() => {
            that.loading = true;
            axios({//根据昵称查询
              method: 'post',
              url: this.global.mPath + '/mailctrl/deleteMailStateAll',
              headers: {
                'Content-type': 'application/x-www-form-urlencoded'
              },
              params: {
                'ids':row.id,
                'token':sessionStorage.getItem('token')
              }
            })
              .then((res) => {
                // console.log(res.data.success)
                  that.loading = false;
                  if(res.data.success == true){
                    that.$message.success({showClose: true, message: '删除成功', duration: 1500});
                    that.handleSearch(1);
                  }else{
                    that.$message.error({showClose: true, message: err.toString(), duration: 2000});
                  }
                },
              ).catch((e) => {
              that.loading = false;
              that.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
            });
          });
        },
        batchDeleteBook:function(){
          let ids = this.sels.map(item => item.id).toString();
          let that = this;
          this.$confirm('确认删除该记录吗?', '提示', {type: 'warning'}).then(() => {
            that.loading = true;
            axios({//根据昵称查询
              method: 'post',
              url: this.global.mPath + '/mailctrl/deleteMailStateAll',
              headers: {
                'Content-type': 'application/x-www-form-urlencoded'
              },
              params: {
                'ids':ids,
                'token':sessionStorage.getItem('token')
              }
            })
              .then((res) => {
                  that.loading = false;
                  if(res.data.success == true){
                    that.$message.success({showClose: true, message: '删除成功', duration: 1500});
                    that.handleSearch(1);
                  }else{
                    that.$message.error({showClose: true, message: err.toString(), duration: 2000});
                  }
                },
              ).catch((error) => {
              that.loading = false;
              that.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
            });
          });
        }
      },
      mounted() {
        axios({
          url:this.global.mPath + '/login/admin_info',
          method:'post',
          params:{
            token:sessionStorage.getItem('token')
          }
        }).then((res) => {
          // console.log(res.data.success)
          if(res.data.success == false){
            this.$router.replace('/');
          }else{
            this.handleSearch(1);
          }
        })
      }
    }
</script>

<style scoped>
  .toolbar{
    margin-top:30px;
  }
</style>
