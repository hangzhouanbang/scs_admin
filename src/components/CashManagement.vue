<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>任务管理</b></el-breadcrumb-item>
        <el-breadcrumb-item>红包点兑换管理</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <!-- 列表-->
    <el-table :data="list" highlight-current-row @selection-change="selsChange"
              style="width:100%;" id="out-table">
      <el-table-column type="selection" width="60"></el-table-column>
      <el-table-column type="index" width="60"></el-table-column>
      <el-table-column prop="rewardType" label="兑换类型" width="120"></el-table-column>
      <el-table-column prop="rewardNum" label="兑换数量" width="100"></el-table-column>
      <el-table-column prop="price" label="兑换消耗" width="120"></el-table-column>
      <el-table-column prop="name" label="物品名称" width="120"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="small" @click="publishDialog(scope.$index,scope.row)">编辑</el-button>
          <el-button type="danger" @click="delBook(scope.$index,scope.row)" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--添加-->
    <el-dialog title="新增红包点兑换" :visible.sync="addFormVisible" :close-on-click-modal="false">
      <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
        <el-form-item label="兑换类型" prop="exchangeType" required>
          <el-select v-model="addForm.exchangeType" placeholder="请选择">
            <el-option
              v-for="(item,index) in type"
              :key="index"
              :label="item.label"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="兑换数量" prop="exchangeCount" required>
          <el-input v-model.trim="addForm.exchangeCount" auto-complete="off" style="width:217px;" type="number"></el-input>
        </el-form-item>
        <el-form-item label="兑换消耗" prop="exchangeConsumption" required>
          <el-input v-model.trim="addForm.exchangeConsumption" auto-complete="off" style="width:217px;"></el-input>
        </el-form-item>
        <el-form-item label="物品名称" prop="itemName" required>
          <el-input v-model.trim="addForm.itemName" auto-complete="off" style="width:217px;"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>

    <!--编辑-->
    <el-dialog title="编辑红包点兑换" :visible.sync="editFormVisible" :close-on-click-modal="false">
      <el-form :model="editForm" label-width="80px" :rules="addFormRules" ref="editForm">
        <el-form-item label="兑换类型" prop="rewardType" required>
          <el-select v-model="editForm.rewardType" placeholder="请选择">
            <el-option
              v-for="(item,index) in type"
              :key="index"
              :label="item.label"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="兑换数量" prop="rewardNum" required>
          <el-input v-model.trim="editForm.rewardNum" auto-complete="off" style="width:217px;" type="number"></el-input>
        </el-form-item>
        <el-form-item label="兑换消耗" prop="price" required>
          <el-input v-model.trim="editForm.price" auto-complete="off" style="width:217px;"></el-input>
        </el-form-item>
        <el-form-item label="物品名称" prop="name" required>
          <el-input v-model.trim="editForm.name" auto-complete="off" style="width:217px;"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-button type="danger" @click="batchDeleteBook" :disabled="this.sels.length===0">批量删除</el-button>
      <el-button type="primary" @click="showAddDialog">新增</el-button>
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="1" :total="total"
                     style="float:right;">
      </el-pagination>
    </el-col>
  </el-row>
</template>

<script>
    import axios from 'axios'
    export default {
      name: "CashManagement",
      data(){
          return{
            list:[],
            sels:[],
            options:[
              {value:'现金'}
            ],
            addForm:{},
            editForm:{},
            addFormVisible:false,
            editFormVisible:false,
            type:[],
            addLoading:false,
            addFormRules:{
              exchangeCount: [
                {required: true, message: '请输入兑换数量', trigger: 'blur'}
              ],
              exchangeConsumption: [
                {required: true, message: '请输入兑换消耗', trigger: 'blur'}
              ],
              itemName: [
                {required: true, message: '请输入物品名称', trigger: 'blur'}
              ],
            },
            total:0
          }
      },
      methods:{
        selsChange (sels) {
          this.sels = sels;
        },
        seek(page){
          axios({
            method: 'post',
            url: this.global.mPath + '/task/query_exchangemanage',
            headers: {
              'Content-type': 'application/x-www-form-urlencoded'
            },
            params: {
              'token':sessionStorage.getItem('token'),
              'page':page,
              'size':10
            }
          }).then((res) => {
            // this.loading = false;//隐藏加载条
            this.list = res.data.data.items;
            this.total = res.data.data.pageCount;
          }).catch((e) => {
            if (e && e.response) {
              switch (e.response.status) {
                case 504:
                  this.$message({showClose: true, message: '服务器异常', type: 'warning'});
                  this.loading = false;//隐藏加载条
                  break;
                case 500:
                  this.$message({showClose: true, message: '服务器异常', type: 'warning'});
                  this.loading = false;//隐藏加载条
                  break;
                case 405:
                  this.$message({showClose: true, message: '请先登录', type: 'warning'});
                  break
              }
            }
          })
        },
        handleCurrentChange(val){
          this.seek(val)
        },
        //兑换类型
        form(){
          axios({
            method: 'post',
            url: this.global.mPath + '/task/query_exchangetype',
            headers: {
              'Content-type': 'application/x-www-form-urlencoded'
            },
            params: {
              'token':sessionStorage.getItem('token'),
            }
          }).then((res) => {
            this.type = res.data.data
          }).catch((e) => {
            if (e && e.response) {
              switch (e.response.status) {
                case 504:
                  this.$message({showClose: true, message: '服务器异常', type: 'warning'});
                  this.loading = false;//隐藏加载条
                  break;
                case 500:
                  this.$message({showClose: true, message: '服务器异常', type: 'warning'});
                  this.loading = false;//隐藏加载条
                  break;
                case 405:
                  this.$message({showClose: true, message: '请先登录', type: 'warning'});
                  break
              }
            }
          })
        },
        showAddDialog(){
          this.addFormVisible = true;
          this.form()
        },
        addSubmit(){
          if(this.addForm.exchangeType === '玉石'){
            this.addForm.exchangeTypes = 'YUSHI'
          }
          if(this.addForm.exchangeType === '礼券'){
            this.addForm.exchangeTypes = 'LIQUAN'
          }
          if(this.addForm.exchangeType === '现金'){
            this.addForm.exchangeTypes = 'HONGBAORMB'
          }
          if(this.addForm.exchangeType === '红包点'){
            this.addForm.exchangeTypes = 'HONGBAODIAN'
          }
          if(this.addForm.exchangeType === 'VIP时间'){
            this.addForm.exchangeTypes = 'VIPTIME'
          }
          axios({
            method: 'post',
            url: this.global.mPath + '/task/add_exchangmanage',
            headers: {
              'Content-type': 'application/x-www-form-urlencoded'
            },
            params: {
              'token':sessionStorage.getItem('token'),
              'rewardType':this.addForm.exchangeTypes,
              'rewardNum':	this.addForm.exchangeCount,
              'name':this.addForm.itemName,
              'price':this.addForm.exchangeConsumption
            }
          }).then((res) => {
            // console.log(res.data)
            if(res.data.success){
              this.$message.success({showClose: true, message: '添加成功', duration: 2000});
              this.addFormVisible = false;
              this.seek(1)
            }else{
              this.$message.error({showClose: true, message: err.toString(), duration: 2000});
            }
          }).catch((e) => {
            if (e && e.response) {
              switch (e.response.status) {
                case 504:
                  this.$message({showClose: true, message: '服务器异常', type: 'warning'});
                  this.loading = false;//隐藏加载条
                  break;
                case 500:
                  this.$message({showClose: true, message: '服务器异常', type: 'warning'});
                  this.loading = false;//隐藏加载条
                  break;
                case 405:
                  this.$message({showClose: true, message: '请先登录', type: 'warning'});
                  break
              }
            }
          })
        },
        publishDialog(index,row){
          this.editFormVisible = true;
          this.editForm = row;
          this.form()
        },
        editSubmit(){
          if(this.editForm.rewardType === '玉石'){
            this.editForm.exchangeTypes = 'YUSHI'
          }
          if(this.editForm.rewardType === '礼券'){
            this.editForm.exchangeTypes = 'LIQUAN'
          }
          if(this.editForm.rewardType === '现金'){
            this.editForm.exchangeTypes = 'HONGBAORMB'
          }
          if(this.editForm.rewardType === '红包点'){
            this.editForm.exchangeTypes = 'HONGBAODIAN'
          }
          if(this.editForm.rewardType === 'VIP时间'){
            this.editForm.exchangeTypes = 'VIPTIME'
          }
          axios({
            method: 'post',
            url: this.global.mPath + '/task/update_exchangmanage',
            headers: {
              'Content-type': 'application/x-www-form-urlencoded'
            },
            params: {
              'token':sessionStorage.getItem('token'),
              'rewardType':this.editForm.exchangeTypes,
              'rewardNum':	this.editForm.rewardNum,
              'name':this.editForm.name,
              'price':this.editForm.price,
              'id':this.editForm.id
            }
          }).then((res) => {
            // console.log(res.data)
            if(res.data.success){
              this.$message.success({showClose: true, message: '编辑成功', duration: 2000});
              this.editFormVisible = false;
              this.seek(1)
            }else{
              this.$message.error({showClose: true, message: err.toString(), duration: 2000});
            }
          }).catch((e) => {
            if (e && e.response) {
              switch (e.response.status) {
                case 504:
                  this.$message({showClose: true, message: '服务器异常', type: 'warning'});
                  this.loading = false;//隐藏加载条
                  break;
                case 500:
                  this.$message({showClose: true, message: '服务器异常', type: 'warning'});
                  this.loading = false;//隐藏加载条
                  break;
                case 405:
                  this.$message({showClose: true, message: '请先登录', type: 'warning'});
                  break
              }
            }
          })
        },
        delBook(index,row){
          let that = this;
          this.$confirm('确认删除选中记录吗？', '提示', {
            type: 'warning'
          }).then(() => {
            that.loading = true;
            axios({
              method: 'post',
              url: this.global.mPath + '/task/delete_exchangmanage',
              headers: {
                'Content-type': 'application/x-www-form-urlencoded'
              },
              params: {
                'ids': row.id,
                'token': sessionStorage.getItem('token')
              }
            }).then((res) => {
              that.loading = false;
              if (res.data.success) {
                that.$message.success({showClose: true, message: '删除成功', duration: 1500});
                that.seek(1);
              } else {
                that.$message.error({showClose: true, message: err.toString(), duration: 2000});
              }
            }).catch((e) => {
              that.loading = false;
              that.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
            })
          })
        },
        batchDeleteBook(){
          let ids = this.sels.map(item => item.id).toString();
          // console.log(ids)
          let that = this;
          this.$confirm('确认删除选中记录吗？', '提示', {
            type: 'warning'
          }).then(() => {
            that.loading = true;
            axios({
              method: 'post',
              url: this.global.mPath + '/task/delete_exchangmanage',
              headers: {
                'Content-type': 'application/x-www-form-urlencoded'
              },
              params: {
                'ids': ids,
                'token': sessionStorage.getItem('token')
              }
            }).then((res) => {
              that.loading = false;
              if (res.data.success) {
                that.$message.success({showClose: true, message: '删除成功', duration: 1500});
                that.seek(1);
              } else {
                that.$message.error({showClose: true, message: err.toString(), duration: 2000});
              }
            }).catch((e) => {
              that.loading = false;
              that.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
            })
          })
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
            this.seek(1)
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
</style>
