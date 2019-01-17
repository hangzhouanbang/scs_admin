<!--平台运营日报-->
<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>报表统计</b></el-breadcrumb-item>
        <el-breadcrumb-item>平台运营日报</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main" v-loading="loading" element-loading-text="拼命加载中">
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="filters">
          <el-form-item label="开始时间">
            <el-date-picker
              v-model="filters.startTime"
              type="date"
              placeholder="开始时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间">
            <el-date-picker
              v-model="filters.endTime"
              type="date"
              placeholder="结束时间" default-value>
            </el-date-picker>
          </el-form-item>
          <el-button type="primary" @click="seek">搜索</el-button>
        </el-form>
      </el-col>

      <!-- 运营日报列表-->
      <el-table :data="items" highlight-current-row @selection-change="selsChange"
                style="width: 100%;" v-show="po">
        <el-table-column type="index" width="60"></el-table-column>
        <el-table-column prop="date" label="日期" width="120"></el-table-column>
        <el-table-column prop="newMember" label="新增注册量" width="120"></el-table-column>
        <el-table-column prop="currentMember" label="当日会员人数" width="140"></el-table-column>
        <el-table-column prop="cost" label="消费金额（元）" width="160"></el-table-column>
        <el-table-column prop="gameNum" label="游戏总局数" width="120"></el-table-column>
        <el-table-column prop="loginMember" label="独立玩家" width="100"></el-table-column>
        <el-table-column prop="remainSecond" label="次日留存" width="100"></el-table-column>
        <el-table-column prop="remainThird" label="三日留存" width="100"></el-table-column>
        <el-table-column prop="remainSeventh" label="七日留存" width="100"></el-table-column>
        <el-table-column prop="remainMonth" label="30日以外留存"></el-table-column>
      </el-table>
      <!--工具条-->
      <el-col :span="24" class="toolbar">
        <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="1" :total="total"
                       style="float:right;">
        </el-pagination>
      </el-col>

    </el-col>
  </el-row>
</template>

<script>
  import axios from 'axios'

  export default {
    name: "PlatformOperation",
    data() {
      return {
        loading: false,//隐藏加载条
        filters: {
          startTime: new Date(),
          endTime:new Date()
        },
        items: [],
        total: 0,
        value1: '',//开始时间
        value2: '',//结束时间
        po: false,//隐藏表单
        state: [],
      }
    },
    methods: {
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
        return year + '-' + rightTwo(month) + '-' + rightTwo(date);
      },
      handleCurrentChange(val) {
        this.page = val;
        this.seek(this.page);
      },
      //搜索
      seek() {
        if (this.filters.startTime) {
          this.filters.startTime = new Date(this.filters.startTime) - 24*60*60*1000
          let date = new Date(this.filters.startTime);
          this.state.startTime = date.getTime();
        }else{
          this.state.startTime = new Date().getTime();
        }
        if (this.filters.endTime) {
          let date = new Date(this.filters.endTime);
          this.state.endTime = date.getTime();
        }else{
          this.state.endTime = new Date().getTime();
        }
        if (this.state.endTime - this.state.startTime < 0) {
          this.$message({showClose: true, message: '时间段选择有误', type: 'warning'});
          return;
        }
          axios({
            method: 'post',
            url: this.global.mPath + '/datareport/platformreport',
            headers: {
              'Content-type': 'application/x-www-form-urlencoded'
            },
            params: {
              'size': '15',//每页数量
              'page': this.page,//当前页
              'startTime': this.state.startTime, /*日期转换为时间戳（毫秒数）发送到后台*/
              'endTime': this.state.endTime,
              'token':sessionStorage.getItem('token')
            }
          })
            .then((res) => {
                this.po = true;//显示表单
                this.loading = false;//隐藏加载条
                this.items = res.data.data.items;
                this.total = res.data.data.pageCount;
                //console.log(res.data.data.items)
                for (let i = 0; i < this.items.length; i++) {
                  this.items[i].date = this.dateTimeFormat(this.items[i].date);
                }
              },
            ).catch((e) => {
            if (e && e.response) {
              switch (e.response.status) {
                case 504:
                  this.$message({showClose: true, message: '服务器异常', type: 'warning'});
                  this.loading = false;//隐藏加载条
                  break
                case 500:
                  this.$message({showClose: true, message: '服务器异常', type: 'warning'});
                  this.loading = false;//隐藏加载条
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
    },
    mounted(){
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
          this.seek();
        }
      })
    }
  }
</script>

<style scoped>
  .toolbar {
    margin-top: 20px;
  }

  .demo-table-expand {
    font-size: 0;
  }

  .demo-table-expand label {
    width: 200px;
    color: #99a9bf;
  }

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 25%;
  }
</style>
