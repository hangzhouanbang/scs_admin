<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>会员中心</b></el-breadcrumb-item>
        <el-breadcrumb-item>登陆限制</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0;margin-top:30px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.id" placeholder="用户ID" @keyup.enter.native="handleSearch()"></el-input>
        </el-form-item>
        <el-button type="primary" @click="handleSearch()">查询</el-button>
        <el-button type="primary" @click="addLimit()">新建限制</el-button>
      </el-form>
    </el-col>

    <!-- 会员列表-->
    <el-table :data="vip" highlight-current-row @selection-change="selsChange"
              style="width: 100%;">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column type="index" width="40"></el-table-column>
      <el-table-column prop="id" label="用户ID" width="90"></el-table-column>
      <el-table-column prop="nickname" label="用户昵称" width="100"></el-table-column>
      <el-table-column prop="gold" label="失效时间" width="120"></el-table-column>
      <el-table-column prop="score" label="录入时间" width="120"></el-table-column>
      <el-table-column prop="createTime" label="备注事项" width="100"></el-table-column>
      <el-table-column prop="other" label="操作">
        <template slot-scope="scope">
          <el-button type="danger" @click="del(scope.$index,scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="1" :total="total"
                     style="float:right;">
      </el-pagination>
    </el-col>

    <!--新建限制-->
    <el-dialog title="新建限制" :visible.sync="addLimitVisible" :close-on-click-modal="false">
      <el-form :model="addLimitForm" label-width="100px" :rules="rules" class="demo-ruleForm">
        <el-form-item label="用户ID" prop="gold">
          <el-input v-model="addLimitForm.gold" auto-complete="off" style="width:217px;"></el-input>
        </el-form-item>
        <el-form-item label="失效时间" required>
          <el-select v-model="time" placeholder="失效时间">
            <el-option
              v-for="item in options"
              :key="item.value"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="gold">
          <el-input v-model="addLimitForm.gold" auto-complete="off" style="width:217px;"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="sure">确定</el-button>
          <el-button type="primary" @click.native="addLimitVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </el-row>
</template>

<script>
    export default {
        name: "LimitLogin",
        data(){
          return{
            filters:{},
            total:0,
            addLimitVisible:false,
            addLimitForm:{},
            options:[
              {value:'1天'},
              {value:'7天'},
              {value:'30天'},
              {value:'半年'},
              {value:'1年'},
              {value:'永久'},
            ],
            time:'',
            rules: {
              gold: [
                {required: true, message: '请输入用户ID', trigger: 'blur'}
              ],
              score: [
                {required: true, message: '请输入备注', trigger: 'blur'}
              ],
            },
          }
        },
        methods:{
          handleSearch(){},
          addLimit(){
            this.addLimitVisible = true;
          },
          handleCurrentChange(val){},
          sure(){},
          selsChange(){}
        }
    }
</script>

<style scoped>

</style>
