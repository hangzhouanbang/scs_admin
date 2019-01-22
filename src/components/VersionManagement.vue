<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>系统设置</b></el-breadcrumb-item>
        <el-breadcrumb-item>版本管理</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main" v-loading="loading" element-loading-text="拼命加载中">
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="filters">
          <el-form-item>
            <el-button type="primary" @click="showAddDialog">新增版本</el-button>
          </el-form-item>
        </el-form>
      </el-col>

      <el-table :data="list" highlight-current-row @selection-change="selsChange"
                style="width: 100%;">
        <el-table-column type="index" width="60"></el-table-column>
        <el-table-column prop="gameType" label="游戏类型" width="100"></el-table-column>
        <el-table-column prop="versionNo" label="版本号" width="100" sortable></el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="160" sortable></el-table-column>
        <el-table-column prop="remark" label="备注" width="auto"></el-table-column>
      </el-table>

      <!--工具条-->
      <el-col :span="24" class="toolbar">
        <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="1" :total="total"
                       style="float:right;">
        </el-pagination>
      </el-col>

      <!--新增版本-->
      <el-dialog title="新增版本" :visible.sync="addFormVisible" :close-on-click-modal="false">
        <el-form :model="normalForm" label-width="100px" :rules="rules" class="demo-ruleForm">
          <el-form-item label="版本号" prop="versionNo" style="width:317px;">
            <el-input v-model.trim="normalForm.versionNo" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model.trim="normalForm.remark" auto-complete="off" style="width:217px;"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="issue()">确认添加</el-button>
            <el-button type="primary" @click.native="addFormVisible = false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>

    </el-col>
  </el-row>
</template>

<script>
  import axios from 'axios'
  export default {
    name: "VersionManagement",
    data(){
      return{
        addFormVisible:false,
        loading:false,
        total:0,
        list:[],
        img:true,
        normalForm:{},
        normalForm1:{},
        filters: {},
        radioData:'',
        imageUrl: '',
        sels: [],
        rules: {
          versionNo: [
            {required: true, message: '请输入版本号', trigger: 'blur'}
          ],
          remark: [
            {required: true, message: '请输入备注', trigger: 'blur'}
          ]
        }
      }
    },
    methods:{
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
          url:this.global.mPath + '/game/querygameversion',
          method:'post',
          params:{
            page:page,
            size:10,
            token:sessionStorage.getItem('token')
          }
        }).then((res) => {
          // console.log(res.data.data)
          this.list = res.data.data.items;
          this.total = res.data.data.pageCount;
          for(let i = 0;i < this.list.length;i++){
            this.list[i].createTime = this.dateTimeFormat(this.list[i].createTime)
          }
        }).catch((e) => {
          if (e && e.response) {
            switch (e.response.status) {
              case 504:
                this.$message({showClose: true, message: '服务器异常', type: 'warning'});
                break;
              case 405:
                this.$message({showClose: true, message: '请先登录', type: 'warning'});
                break
            }
          }
        })
      },
      showAddDialog:function(){
        this.addFormVisible = true;
      },
      issue:function() {
        axios({
          method: 'post',
          url: this.global.mPath + '/game/addgameversion',
          headers: {
            'Content-type': 'application/x-www-form-urlencoded'
          },
          params: {
            versionNo:this.normalForm.versionNo,
            remark:this.normalForm.remark,
            token:sessionStorage.getItem('token')
          }
        }).then((res) => {
          if (res.data.success) {
            this.$message({showClose: true, message: '添加成功', type: 'success'});
            this.addFormVisible = false;//关闭弹窗
            this.handleSearch(1);
          } else {
            this.$message({showClose: true, message: '添加失败', type: 'warning'});
          }
        }).catch((e) => {
          if (e && e.response) {
            switch (e.response.status) {
              case 504:
                this.$message({showClose: true, message: '服务器异常', type: 'warning'});
                break;
              case 405:
                this.$message({showClose: true, message: '请先登录', type: 'warning'});
                break
            }
          }
        })
      },
      selsChange: function (sels) {
        this.sels = sels;
      },
      handleCurrentChange(val) {
        this.page = val;
        this.handleSearch(this.page);
      }
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
        if(res.data.success){
          this.handleSearch(1)
        }else{
          this.$router.replace('/');
        }
      })
    }
  }
</script>

<style scoped lang="scss">
  .toolbar{
    margin-top:30px;
  }
  p{
    text-align: center;
    font-size:18px;
  }
  .avatar{
    width:100px;
    height:100px;
    margin:0;
  }
</style>
