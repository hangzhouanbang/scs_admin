<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>推广员中心</b></el-breadcrumb-item>
        <el-breadcrumb-item>推广员管理</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item label="推广员" label-width="68px">
          <el-select v-model="filters.mailType" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="handleSearch">推广员申请记录</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!-- 推广员管理列表-->
    <el-table :data="record" highlight-current-row style="width: 100%;">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column type="index" width="60"></el-table-column>
      <el-table-column prop="memberId" label="推广员ID" width="auto" sortable></el-table-column>
      <el-table-column prop="systemMail.file" label="昵称" width="auto" sortable></el-table-column>
      <el-table-column prop="systemMail.mailType" label="推广员等级" width="auto" sortable></el-table-column>
      <el-table-column prop="systemMail.number" label="注册时间" width="auto" sortable></el-table-column>
      <el-table-column prop="systemMail.integral" label="上级ID" width="auto" sortable></el-table-column>
      <el-table-column prop="vipCardName" label="上级昵称" width="auto" sortable></el-table-column>
      <el-table-column prop="systemMail.createtime" label="操作" width="auto" sortable>
        <template slot-scope="scope">
          <el-button type="text">详情</el-button>
          <el-button type="text">操作</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--详情-->
    <el-dialog title="" :visible.sync="centerDialogVisible" :close-on-click-modal="false">
      <div class="img">
        <img src="../assets/images/girl.jpg" alt="">
      </div>
      <el-table :data="roles" highlight-current-row
                style="width: 62%;">
        <el-table-column label="游戏昵称" width="55"></el-table-column>
        <el-table-column label="游戏ID" prop="role"></el-table-column>
        <el-table-column label="会员" prop="role"></el-table-column>
        <el-table-column label="会员时间" prop="role"></el-table-column>
        <el-table-column label="注册时间" prop="role"></el-table-column>
      </el-table>
      <el-table :data="roles" highlight-current-row
                style="width: 62%;">
        <el-table-column label="推广员等级" prop="role"></el-table-column>
        <el-table-column label="周卡剩余" prop="role"></el-table-column>
        <el-table-column label="月卡剩余" prop="role"></el-table-column>
        <el-table-column label="季卡剩余" prop="role"></el-table-column>
        <el-table-column label="充值金额" prop="role"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <router-link :to="{path:'/membershipCardPurchaseRecord'}">
          <el-button>会员卡购买记录</el-button>
        </router-link>
        <router-link :to="{path:'/membershipCardConsumptionRecord'}">
          <el-button>会员卡消费记录</el-button>
        </router-link>
        <el-button @click.native="CancelSubmit" :visible.sync="relieveDialogVisible">取消推广员资格</el-button>
        <el-button @click.native="relieveSubmit" :visible.sync="centerDialogVisible">解除封停状态</el-button>
      </div>
    </el-dialog>
    <!--操作-->
    <el-dialog title="" :visible.sync="relieveDialogVisible" :close-on-click-modal="false">
      <div class="left">
        <el-button class="bound">绑定</el-button><br>
        <el-button class="levelup">调整等级</el-button>
      </div>
      <el-form ref="form" :model="form" label-width="100px" class="form" v-if="relieveDialogVisible">
        <el-form-item label="一级推广员ID">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="二级推广员ID">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="form.desc"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">绑定</el-button>
          <el-button>解除绑定</el-button>
        </el-form-item>
      </el-form>
      <el-form ref="form" :model="form" label-width="100px" class="form" v-if="centerDialogVisible">
        <el-form-item label="一级推广员ID">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="当前等级">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="提升等级">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="form.desc"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button >确认修改</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-row>
</template>

<script>
    import axios from 'axios'
    export default {
        name: "PromoterManagement",
        data(){
          return{
            filters:{},
            record:[],
            form:{},
            roles:{},
            options: [
              {value: '一级推广员'},
              {value: '二级推广员'}
            ],
            centerDialogVisible:false,
            relieveDialogVisible:false
          }
        },
      methods:{
          handleSearch(){

          },
          CancelSubmit:function(){
            this.centerDialogVisible = true;
            this.relieveDialogVisible = false;
          },
          relieveSubmit:function(){
            this.centerDialogVisible = false;
            this.relieveDialogVisible = true;
          }
      }
    }
</script>

<style scoped>
  .toolbar{
    margin-top:30px;
  }
  .img{
    float:left;
    margin-right:60px;
  }
  .left,
  .form{
    display:inline-block;
  }
  .left{
    position: absolute;
    top:60px;
  }
  .form{
    margin-left:140px;
  }
  .bound,
  .levelup{
    width:100px;
  }
  .levelup{
    margin-top:20px;
  }
</style>
