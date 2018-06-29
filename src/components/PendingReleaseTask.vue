<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>任务管理</b></el-breadcrumb-item>
        <el-breadcrumb-item>待发布任务</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.nickname" placeholder="任务名" @keyup.enter.native="handleSearch"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="handleSearch">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="showAddDialog">添加</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!-- 任务列表-->
    <el-table :data="task" highlight-current-row
              style="width:100%;" id="out-table">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column type="index" width="60"></el-table-column>
      <el-table-column prop="out_trade_no" label="任务名称" width="120" sortable></el-table-column>
      <el-table-column prop="transaction_id" label="详细描述" width="120" sortable></el-table-column>
      <el-table-column prop="memberId" label="任务类型" width="120" sortable></el-table-column>
      <el-table-column prop="nickname" label="奖励类型" width="120" sortable></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="small" @click="publishDialog(scope.$index,scope.row)">发布</el-button>
          <el-button type="danger" @click="delBook(scope.$index,scope.row)" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--添加-->
    <el-dialog title="新增任务" :visible.sync="addFormVisible" :close-on-click-modal="false">
      <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
        <el-form-item label="任务名称" prop="name">
          <el-input v-model="addForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="详细描述" prop="description">
          <el-input v-model="addForm.description" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="任务类型" prop="taskType">
          <el-select v-model="addForm.taskType" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="奖励类型" prop="rewardType">
          <el-select v-model="addForm.rewardType" placeholder="请选择">
            <el-option
              v-for="item in type"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">保存</el-button>
      </div>
    </el-dialog>

    <!--发布-->
    <el-dialog title="发布任务" :visible.sync="addFormVisible" :close-on-click-modal="false">
      <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
        <el-form-item label="任务名称" prop="name">
          <el-input v-model="addForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="详细描述" prop="description">
          <el-input v-model="addForm.description" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="任务类型" prop="taskType">
          <el-select v-model="addForm.taskType" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="奖励类型" prop="rewardType">
          <el-select v-model="addForm.rewardType" placeholder="请选择">
            <el-option
              v-for="item in type"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="完成次数" prop="completionTimes">
          <el-input type='number' v-model="addForm.completionTimes" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="奖励次数" prop="numberOfReward">
          <el-input type='number' v-model="addForm.numberOfReward" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">确认</el-button>
      </div>
    </el-dialog>
  </el-row>
</template>

<script>
    export default {
        name: "PendingReleaseTask",
        data(){
          return{
            task:[],
            filters:{},
            addFormVisible:false,
            addLoading:false,
            addForm:{},
            options:[
              {value:'每日任务'}
            ],
            type:[
              {value:'金币'},
              {value:'积分'}
            ],
            addFormRules:{
              name: [
                {required: true, message: '请输入任务名称', trigger: 'blur'}
              ],
              description: [
                {required: true, message: '请输入详细描述', trigger: 'blur'}
              ],
              taskType: [
                {required: true, message: '请选择任务类型', trigger: 'change'}
              ],
              rewardType: [
                {required: true, message: '请选择奖励类型', trigger: 'change'}
              ],
              completionTimes: [
                {required: true, message: '请输入完成次数', trigger: 'blur'}
              ],
              numberOfReward: [
                {required: true, message: '请输入奖励次数', trigger: 'blur'}
              ]
            }
          }
        },
        methods:{
          showAddDialog:function(){
            this.addFormVisible = true;
          },
          publishDialog:function(){
            this.addFormVisible = true;
          },
          handleSearch(){

          }
        }
    }
</script>

<style scoped>
  .toolbar{
    margin-top:30px;
  }
</style>
