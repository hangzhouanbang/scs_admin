<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>推广员中心</b></el-breadcrumb-item>
        <el-breadcrumb-item>推广员管理</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-row :gutter="20" style="margin-top:30px;">
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <div class="type">推广员总数</div>
          <div class="num">{{amount}}人</div>
        </div>
      </el-col>
    </el-row>

    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item label="推广员ID">
          <el-input v-model.trim="filters.id" @keyup.enter.native="handleSearch(1)"></el-input>
        </el-form-item>
        <el-form-item label="推广员昵称">
          <el-input v-model.trim="filters.nickname" @keyup.enter.native="handleSearch(1)"></el-input>
        </el-form-item>
        <el-form-item label="上级推广员ID">
          <el-input v-model.trim="filters.bossId" @keyup.enter.native="handleSearch(1)"></el-input>
        </el-form-item>
        <el-form-item label="手机号码">
          <el-input v-model.trim="filters.phone" @keyup.enter.native="handleSearch(1)"></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model.trim="filters.userName" placeholder="姓名" @keyup.enter.native="handleSearch(1)"></el-input>
        </el-form-item>
        <el-form-item label="注册时间" label-width="68px">
          <el-date-picker
            v-model="filters.startTime"
            type="date"
            placeholder="选择日期" style="width:202px;">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="至" label-width="68px" style="margin-left:-44px;">
          <el-date-picker
            v-model="filters.endTime"
            type="date"
            placeholder="选择日期" style="width:202px;">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="推广员等级" label-width="83px">
          <el-select v-model="filters.mailType" placeholder="请选择" style="width:202px;" clearable>
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.label"
              :value="item.type">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="handleSearch(1)">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!-- 推广员管理列表-->
    <el-table :data="record" highlight-current-row style="width: 100%;" @sort-change="sort">
      <el-table-column type="index" width="60"></el-table-column>
      <el-table-column prop="headimgurl" label="推广员头像" width="120">
        <template slot-scope="scope">
          <img :src="scope.row.headimgurl" alt="" style="width: 50px;height: 50px">
        </template>
      </el-table-column>
      <el-table-column prop="id" label="推广员ID" width="120"></el-table-column>
      <el-table-column prop="nickname" label="推广员昵称" width="150"></el-table-column>
      <el-table-column prop="createTime" label="注册时间" width="160"  sortable="custom"></el-table-column>
      <el-table-column prop="inviteMemberNum" label="邀请玩家数" width="120"  sortable="custom"></el-table-column>
      <el-table-column prop="juniorNum" label="下级数量" width="120"  sortable="custom"></el-table-column>
      <el-table-column prop="agentType.type" label="当前级别" width="120"></el-table-column>
      <el-table-column prop="bossId" label="上级推广员ID" width="120"></el-table-column>
      <el-table-column prop="agentType.memberReward" label="充值返利" width="120"></el-table-column>
      <el-table-column prop="agentType.juniorReward" label="下级返利" width="120"></el-table-column>
      <el-table-column label="状态" prop="state"  sortable="custom" width="120"></el-table-column>
      <el-table-column prop="systemMail.createtime" label="操作" width="auto">
        <template slot-scope="scope">
          <el-button type="text" @click.native="particulars(scope.$index,scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--详情-->
    <el-dialog title="详情" :visible.sync="centerDialogVisible" :close-on-click-modal="false" class="xiangqing">
      <el-table :data="roles" style="width: 100%;">
        <el-table-column label="头像">
          <template slot-scope="scope">
            <img :src="scope.row.headimgurl" alt="" class="pic">
          </template>
        </el-table-column>
        <el-table-column label="昵称" prop="nickname"></el-table-column>
        <el-table-column label="ID" prop="id"></el-table-column>
        <el-table-column label="状态" prop="state"></el-table-column>
        <el-table-column label="手机号" prop="phone"></el-table-column>
        <el-table-column label="姓名" prop="userName"></el-table-column>
        <el-table-column label="地区" prop="area"></el-table-column>
        <el-table-column label="注册时间" prop="createTime"></el-table-column>
        <el-table-column label="邀请玩家数" prop="inviteMemberNum"></el-table-column>
        <el-table-column label="下级数" prop="juniorNum"></el-table-column>
      </el-table>
      <el-table :data="roles" style="width: 100%;">
        <el-table-column label="代理级别" prop="agentType.type"></el-table-column>
        <el-table-column label="上级ID" prop="bossId"></el-table-column>
        <el-table-column label="充值返利" prop="agentType.memberReward"></el-table-column>
        <el-table-column label="下级返利" prop="agentType.juniorReward"></el-table-column>
        <el-table-column label="日卡" prop="clubCardRi"></el-table-column>
        <el-table-column label="周卡" prop="clubCardZhou"></el-table-column>
        <el-table-column label="月卡" prop="clubCardYue"></el-table-column>
        <el-table-column label="季卡" prop="clubCardJi" sortabl></el-table-column>
        <el-table-column label="玉石" prop="coins" sortabl></el-table-column>
        <el-table-column label="茶馆玉石" prop="" sortabl></el-table-column>
        <el-table-column label="邀请码" prop="invitationCode"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="Code">查看二维码</el-button>
        <el-button @click.native="Players(1)">查看绑定玩家</el-button>
        <router-link :to="{path:'/membershipCardPurchaseRecord?id='+id}">
          <el-button>会员卡购买记录</el-button>
        </router-link>
        <router-link :to="{path:'/membershipCardConsumptionRecord?id='+id}">
          <el-button>会员卡兑换记录</el-button>
        </router-link>
        <el-button @click.native="CancelSubmit" v-if="state === '正常'">取消推广员资格</el-button>
        <el-button @click.native="relieveSubmit" v-if="state === '封禁'">解除封停状态</el-button>
        <br>
        <br>
        <el-button @click.native="LookLower">查看下级</el-button>
        <el-button @click.native="LevelAdjustment">代理等级调整</el-button>
        <el-button @click.native="BindingAdjustment">上级绑定调整</el-button>
        <el-button @click.native="MembershipAdjustment">会员卡调整</el-button>
        <el-button @click.native="IntegralAdjustment">积分调整</el-button>
        <el-button @click.native="GoldAdjustment">玉石调整</el-button>
      </div>
    </el-dialog>

    <!--会员卡调整弹窗-->
    <el-dialog title="会员卡调整" :visible.sync="publishVisible" :close-on-click-modal="false">
      <el-form :model="publishForm" label-width="220px">
        <el-form-item label="推广员ID">
          <el-input class="memberInput" v-model.trim="id" :disabled="true" style="width:217px;"></el-input>
        </el-form-item>
        <el-form-item label="会员卡类型">
          <el-select v-model="publishForm.product" placeholder="请选择">
            <el-option
              v-for="item in types"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="调整数量">
          <el-input class="memberInput" v-model.trim="publishForm.afternumber" style="width:217px;"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click.native="notarizeVisible = true,publishVisible =false">确认调整</el-button>
          <el-button type="primary" @click.native="publishVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--会员卡调整弹窗-->
    <el-dialog title="会员卡调整" :visible.sync="notarizeVisible" :close-on-click-modal="false">
      <el-form>
        <div align="center">
          推广员{{id}}拥有的{{publishForm.product}}：调整数量{{this.publishForm.afternumber}}<br/>是否确认调整？
        </div>
        <br/>
        <div align="center">
          <el-button type="primary" @click.native="sure">确认调整</el-button>
          <el-button @click.native="notarizeVisible = false,publishVisible = true">返回修改</el-button>
        </div>
      </el-form>
    </el-dialog>

    <!--积分操作弹窗-->
    <el-dialog title="积分操作" :visible.sync="integralVisible" :close-on-click-modal="false">
      <el-form :model="integralForm" label-width="220px">
        <el-form-item label="推广员ID">
          <el-input class="memberInput" v-model.trim="id" :disabled="true" style="width:217px;"></el-input>
        </el-form-item>
        <el-form-item label="当前积分">
          <el-input class="memberInput" v-model.trim="score" :disabled="true" style="width:217px;"></el-input>
        </el-form-item>
        <el-form-item label="调整积分">
          <el-input class="memberInput" v-model.trim="integralForm.afterAmount" style="width:217px;"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click.native="sureVisible = true,integralVisible =false">确认调整</el-button>
          <el-button @click.native="integralVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--积分调整弹窗-->
    <el-dialog title="确认操作" :visible.sync="sureVisible" :close-on-click-modal="false">
      <el-form>
        <div align="center">
          推广员{{id}}拥有的积分：由{{score}}调整到{{integralForm.afterAmount}}
        </div>
        <br/>
        <div align="center">
          <el-button type="primary" @click.native="Confirm">确认调整</el-button>
          <el-button @click.native="sureVisible = false,integralVisible = true">返回修改</el-button>
        </div>
      </el-form>
    </el-dialog>

    <!--查看二维码-->
    <el-dialog title="查看二维码" :visible.sync="codeVisible" :close-on-click-modal="false" class="code">
      <img :src="src" style="width:200px;height:200px;border:1px solid #000;margin-left:29%;">
    </el-dialog>

    <!--查看绑定玩家-->
    <el-dialog title="查看绑定玩家" :visible.sync="playersVisible" :close-on-click-modal="false">
      <el-table :data="player" style="width: 100%;">
        <el-table-column label="玩家ID" prop="memberId"></el-table-column>
        <el-table-column label="当前玉石" prop="gold"></el-table-column>
        <el-table-column label="玩家昵称" prop="nickname"></el-table-column>
        <el-table-column label="绑定时间" prop="createTime"></el-table-column>
        <el-table-column prop="systemMail.createtime" label="操作" width="auto">
          <template slot-scope="scope">
            <el-button type="text" @click.native="showother(scope.$index,scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-col :span="24" class="wanjia">
        <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange1" :page-size="1" :total="num"
                       style="float:right;">
        </el-pagination>
      </el-col>
    </el-dialog>

    <!--其他信息弹窗-->
    <el-dialog title="详情" :visible.sync="other" :close-on-click-modal="false" class="other">
      <div class="details">
          <span class="every">
            <label for="">绑定推广员:</label>
            <span style="color:#000;">{{details.agentId}}</span>
            <el-button type="text" style="color:#409EFF;" @click="Bindingadjust(details.agentId)">绑定调整</el-button>
          </span>
        <span class="every">
            <label for="">真实姓名:</label>
            <span style="color:#000;">{{details.realName}}</span>
          </span>
        <span class="every">
            <label for="">性别:</label>
            <span style="color:#000;">{{details.gender}}</span>
          </span>
        <span class="every">
            <label for="">手机号码:</label>
            <span style="color:#000;">{{details.phone}}</span>
          </span>
      </div>
      <div class="details">
          <span class="every">
            <label for="">身份证号:</label>
            <span style="color:#000;">{{details.IDcard}}</span>
          </span>
        <span class="every">
            <label for="">会员总消费:</label>
            <span style="color:#000;">{{details.cost}}</span>
          </span>
        <span class="every">
            <label for="">登录ip:</label>
             <span id="msg" style="color:#000;">{{details.loginIp}}</span>
             <el-button type="text" data-clipboard-target="#msg" class="copy" @click="copy">点击复制</el-button>
          </span>
      </div>
      <div class="details" style="margin-top:10px;">
          <span class="every">
            <label for="">登录时间:</label>
            <span style="color:#000;">{{details.loginTime}}</span>
          </span>
        <span class="every">
            <label for="">在线时间:</label>
             <span style="color:#000;">{{details.onlineTime}}</span>
          </span>
        <span class="every">
            <label for="">累计在线时长:</label>
             <span style="color:#000;"></span>
          </span>
      </div>
      <div class="details" style="margin-top:20px;">
          <span class="every">
            <label for="">正在游戏的房间:</label>
             <el-table :data="tableData" style="width: 100%;">
              <el-table-column prop="no" label="游戏房间号" width="150"></el-table-column>
              <el-table-column prop="game" label="游戏名称" width="180"></el-table-column>
              <el-table-column prop="vip" label="是否VIP房间"></el-table-column>
              <el-table-column prop="playersCount" label="玩家人数"></el-table-column>
              <el-table-column prop="panCountPerJu" label="每局盘数"></el-table-column>
              <el-table-column prop="currentPanNum" label="当前盘数"></el-table-column>
            </el-table>
          </span>
      </div>
      <div class="details" style="margin-top:20px;">
          <span class="every">
            <label for="">历史战绩:</label>
            <ul class="zj">
                <li v-for="data in recordList" :key="data.id">
                  <div class="top">
                    <span>{{data.game}}</span>
                    <span>房号：{{data.roomNo}}</span>
                    <span>局数：{{data.lastPanNo}}/{{data.panshu}}</span>
                    <span>{{data.finishTime}}</span>
                  </div>
                  <div class="bottom">
                    <span v-for="single in data.playerResultList" :key="single.playerId">
                      {{single.nickname}}：{{single.totalScore}}
                    </span>
                  </div>
                </li>
            </ul>
          </span>
      </div>
    </el-dialog>

    <!--代理等级调整-->
    <el-dialog title="代理等级调整" :visible.sync="levelVisible" :close-on-click-modal="false">
      <el-form ref="form" :model="form" label-width="100px" class="form">
        <el-form-item label="推广员ID">
          <el-input v-model.trim="form.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="当前等级">
          <el-input v-model.trim="type" disabled></el-input>
        </el-form-item>
        <el-form-item label="调整等级">
          <el-select v-model="form.upgrade" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.label"
              :value="item.type">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click.native="makeSure()">确认修改</el-button>
          <el-button @click.native="levelVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--上级绑定调整-->
    <el-dialog title="上级绑定调整" :visible.sync="bindingVisible" :close-on-click-modal="false">
      <el-form ref="form" :model="form" label-width="100px" class="form">
        <el-form-item label="上级推广员ID">
          <el-input v-model.trim="form.bossId"></el-input>
        </el-form-item>
        <el-form-item label="推广员ID">
          <el-input v-model.trim="form.id" disabled></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click.native="bound()">绑定</el-button>
          <el-button @click.native="unbound()">解除绑定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--绑定调整-->
    <el-dialog title="推广员绑定调整" :visible.sync="Bindingtoadjust" :close-on-click-modal="false" class="bdtz">
      <el-form :model="bindForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="当前绑定" prop="agentId" style="width:300px;">
          <el-input v-model.trim="bindForm.agentId" disabled></el-input>
        </el-form-item>
        <el-form-item label="调整绑定" prop="id" style="width:300px;">
          <el-input v-model.trim="bindForm.id"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="bindsure">确认</el-button>
          <el-button type="primary" @click.native="Bindingtoadjust = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--绑定调整-->
    <el-dialog title="玉石调整" :visible.sync="Goldtoadjust" :close-on-click-modal="false">
      <el-form :model="GoldForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="推广员ID" prop="id" style="width:300px;">
          <el-input v-model.trim="id" disabled></el-input>
        </el-form-item>
        <el-form-item label="玉石类型">
          <el-select v-model="query" placeholder="请选择" style="width:200px;">
            <el-option
              v-for="item in Golds"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发放数量" prop="goldAmount" style="width:300px;">
          <el-input v-model.trim="GoldForm.goldAmount"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="goldsure">确认调整</el-button>
          <el-button type="primary" @click.native="Goldtoadjust = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="1" :total="total"
                     style="float:right;">
      </el-pagination>
    </el-col>
  </el-row>
</template>

<script>
    import axios from 'axios'
    import Clipboard from 'clipboard'
    export default {
      name: "PromoterManagement",
      data(){
        return{
          filters: {},
          record:[],
          form:{},
          roles:[],
          total:0,
          upgrade:'',
          options: [],
          types:[
            {value:'日卡'},
            {value:'周卡'},
            {value:'月卡'},
            {value:'季卡'},
          ],
          centerDialogVisible:false,
          relieveDialogVisible:false,
          bindingVisible:false,
          levelVisible:false,
          disqualifyDialogVisible:true,
          unlockingDialogVisible:false,
          publishVisible:false,
          notarizeVisible:false,
          integralVisible:false,
          sureVisible:false,
          codeVisible:false,
          playersVisible:false,
          other:false,
          Goldtoadjust:false,
          state:'',
          seniorAmount:'',
          juniorAmount:'',
          sorting:{},
          page:1,
          state1:{},
          publishForm:{},
          number:'',
          id:'',
          integralForm:{},
          score:'',
          publishForm1:{},
          src:'',
          player:[],
          details:{},
          tableData:[],
          type:'',
          amount:'',
          num:0,
          Bindingtoadjust:false,
          bindForm:{},
          memberId:'',
          Golds:[
            {value:'玉石'},
            // {value:'茶馆玉石'}
          ],
          query: '玉石',
          GoldForm:{},
          recordList:[]
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
        handleSearch(page,inviteMemberNumSort,juniorNumSort,createTimeSort,stateSort){
          if(this.filters.startTime){
            let date = new Date(this.filters.startTime);
            this.state1.startTime = date.getTime();
          }else{
            this.state1.startTime = ''
          }
          if(this.filters.endTime){
            let date = new Date(this.filters.endTime);
            this.state1.endTime = date.getTime();
          }else{
            this.state1.endTime = ''
          }
          if(this.filters.startTime &&
            this.filters.endTime &&
            this.state1.endTime - this.state1.startTime < 0){
            return;
          }
          axios({
            url:this.global.mPath + '/agent/queryagent',
            method:'post',
            params:{
              page:page,
              size:10,
              token:sessionStorage.getItem('token'),
              id:this.filters.id,
              bossId:this.filters.bossId,
              nickname:this.filters.nickname,
              phone:this.filters.phone,
              userName:this.filters.userName,
              startTime:this.state1.startTime,
              endTime:this.state1.endTime,
              type:this.filters.mailType,
              inviteMemberNumSort:inviteMemberNumSort,
              juniorNumSort:juniorNumSort,
              createTimeSort:createTimeSort,
              stateSort:stateSort
            }
          }).then((res) => {
              // console.log(res.data)
              this.amount = res.data.data.amount;
              this.record = res.data.data.agentList.items;
              this.total = res.data.data.agentList.pageCount;
              for(let i = 0;i < this.record.length;i++){
                this.record[i].createTime = this.dateTimeFormat(this.record[i].createTime)
              }
            }
          ).catch((e) => {
            this.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
          })
        },
        sort(a,page){
          this.sorting = a;
          if(this.sorting.prop === 'inviteMemberNum'){
            if(this.sorting.order === 'ascending'){
              this.sorting.inviteMemberNum = 'ASC'
            }
            if(this.sorting.order === 'descending'){
              this.sorting.inviteMemberNum = 'DESC'
            }
          }
          if(this.sorting.prop === 'juniorNum'){
            if(this.sorting.order === 'ascending'){
              this.sorting.juniorNum = 'ASC'
            }
            if(this.sorting.order === 'descending'){
              this.sorting.juniorNum = 'DESC'
            }
          }
          if(this.sorting.prop === 'createTime'){
            if(this.sorting.order === 'ascending'){
              this.sorting.createTime = 'ASC'
            }
            if(this.sorting.order === 'descending'){
              this.sorting.createTime = 'DESC'
            }
          }
          if(this.sorting.prop === 'state'){
            if(this.sorting.order === 'ascending'){
              this.sorting.state = 'ASC'
            }
            if(this.sorting.order === 'descending'){
              this.sorting.state = 'DESC'
            }
          }
          this.handleSearch(page,this.sorting.inviteMemberNum,this.sorting.juniorNum,this.sorting.createTime,this.sorting.state)
        },
        handleCurrentChange(val){
          this.page = val;
          this.sort(this.sorting,this.page);
        },
        //详情
        particulars(index,row){
          this.centerDialogVisible = true;
          this.form = row;
          axios({
            url:this.global.mPath + '/agent/agentdetail',
            method:'post',
            params:{
              agentId:row.id,
              token:sessionStorage.getItem('token')
            }
          }).then((res) => {
              // console.log(res.data)
              row.clubCardYue = res.data.data.clubCardYue;
              row.clubCardJi = res.data.data.clubCardJi;
              row.clubCardZhou = res.data.data.clubCardZhou;
              row.clubCardRi = res.data.data.clubCardRi;
              row.score = res.data.data.score;
              row.coins = res.data.data.coins;
              this.roles = [Object.assign({}, row)];
              this.state = res.data.data.agent.state;
              this.id = res.data.data.agent.id;
              this.score = res.data.data.score;
          }).catch((e) => {
              this.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
          })
        },
        //代理等级调整
        LevelAdjustment(){
          // console.log(this.form)
          this.levelVisible = true;
          this.centerDialogVisible = false;
          if(this.form.agentType){
            this.type = this.form.agentType.type
          }
        },
        //确认修改
        makeSure(){
          axios({
            url:this.global.mPath + '/agent/settype',
            method:'post',
            params:{
              agentId:this.form.id,
              type:this.form.upgrade,
              token:sessionStorage.getItem('token')
            }
          }).then((res) => {
            // console.log(res.data)
            if(res.data.success){
              this.$message.success({showClose: true, message: '等级修改成功', duration: 1500});
              this.levelVisible = false;
              this.handleSearch(this.page)
            }else{
              this.$message.error({showClose: true, message: err.toString(), duration: 2000});
            }
          }).catch((e) => {
            this.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
          })
        },
        //上级绑定调整
        BindingAdjustment(){
          this.bindingVisible = true;
          this.centerDialogVisible = false;
        },
        //绑定
        bound(){
          axios({
            url:this.global.mPath + '/agent/setboss',
            method:'post',
            params:{
              agentId:this.form.id,
              bossId:this.form.bossId,
              token:sessionStorage.getItem('token')
            }
          }).then((res) => {
            // console.log(res.data)
            if(res.data.success){
              this.$message.success({showClose: true, message: '绑定成功', duration: 1500});
              this.bindingVisible = false;
              this.handleSearch(this.page)
            }else{
              this.$message.error({showClose: true, message: err.toString(), duration: 2000});
            }
          }).catch((e) => {
            this.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
          })
        },
        //解除绑定
        unbound(){
          axios({
            url:this.global.mPath + '/agent/removeboss',
            method:'post',
            params:{
              agentId:this.form.id,
              token:sessionStorage.getItem('token')
            }
          }).then((res) => {
            // console.log(res.data)
            if(res.data.success){
              this.$message.success({showClose: true, message: '解除绑定成功', duration: 1500});
              this.bindingVisible = false;
              this.handleSearch(this.page)
            }else{
              this.$message.error({showClose: true, message: err.toString(), duration: 2000});
            }
          }).catch((e) => {
            this.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
          })
        },
        //取消推广员资格
        CancelSubmit(){
          axios({
            url:this.global.mPath + '/agent/ban',
            method:'post',
            params:{
              agentId:this.roles[0].id,
              token:sessionStorage.getItem('token')
            }
          }).then((res) => {
            // console.log(res.data)
            if(res.data.success){
              this.unlockingDialogVisible = true;
              this.disqualifyDialogVisible = false;
              this.roles[0].state = res.data.data;
              this.state = '封禁';
              this.handleSearch(this.page)
            }else{
              this.$message.error({showClose: true, message: err.toString(), duration: 2000});
            }
          }).catch((e) => {
            this.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
          })
        },
        //解除封停状态
        relieveSubmit(){
          axios({
            url:this.global.mPath + '/agent/liberate',
            method:'post',
            params:{
              agentId:this.roles[0].id,
              token:sessionStorage.getItem('token')
            }
          }).then((res) => {
            // console.log(res.data)
            if(res.data.success){
              this.unlockingDialogVisible = false;
              this.disqualifyDialogVisible = true;
              this.roles[0].state = res.data.data;
              this.state = '正常';
              this.handleSearch(this.page)
            }else{
              this.$message.error({showClose: true, message: err.toString(), duration: 2000});
            }
          }).catch((e) => {
            this.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
          })
        },
        //会员卡调整
        MembershipAdjustment() {
          this.centerDialogVisible = false;
          this.publishVisible = true;
        },
        //确认调整会员卡
        sure() {
          if(this.publishForm.product === '日卡'){
            this.publishForm1.product = 'ri'
          }
          if(this.publishForm.product === '周卡'){
            this.publishForm1.product = 'zhou'
          }
          if(this.publishForm.product === '月卡'){
            this.publishForm1.product = 'yue'
          }
          if(this.publishForm.product === '季卡'){
            this.publishForm1.product = 'ji'
          }
          axios({
            method: 'post',
            url: this.global.mPath + '/agent/clubcardmanager',
            headers: {
              'Content-type': 'application/x-www-form-urlencoded'
            },
            params: {
              'agentId': this.id,
              'card':this.publishForm1.product,
              'cardAmount':this.publishForm.afternumber,
              'token':sessionStorage.getItem('token')
            }
          }).then((res) => {
            if (res.data.success) {
              this.$message({showClose: true, message: '调整成功', type: 'success'});
              this.centerDialogVisible = false;
              this.notarizeVisible = false;
              this.handleSearch(this.page)
            } else {
              this.$message({showClose: true, message: '调整失败', type: 'warning'});
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
        //积分调整
        IntegralAdjustment(){
          this.centerDialogVisible = false;
          this.integralVisible = true;
        },
        Confirm(){
          axios({
            method: 'post',
            url: this.global.mPath + '/agent/scoremanager',
            headers: {
              'Content-type': 'application/x-www-form-urlencoded'
            },
            params: {
              'agentId': this.id,
              'scoreAmount':this.integralForm.afterAmount,
              'token':sessionStorage.getItem('token')
            }
          }).then((res) => {
            if (res.data.success) {
              this.$message({showClose: true, message: '调整成功', type: 'success'});
              this.centerDialogVisible = false;
              this.sureVisible = false;
              this.handleSearch(this.page)
            } else {
              this.$message({showClose: true, message: '调整失败', type: 'warning'});
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
        //查看二维码
        Code(){
          this.centerDialogVisible = false;
          this.codeVisible = true;
          this.src = this.global.mPath + '/agent/qrcode?token='+sessionStorage.getItem('token')+'&agentId='+this.id
        },
        //查看玩家
        Players(page){
          this.playersVisible = true;
          this.centerDialogVisible = false;
          axios({
            url:this.global.mPath + '/agent/queryinvitatemember',
            method:'post',
            params:{
              page:page,
              size:'10',
              agentId:this.id,
              token:sessionStorage.getItem('token')
            }
          }).then((res) => {
            // console.log(res.data.data.listPage.items)
            this.player = res.data.data.listPage.items;
            this.num = res.data.data.listPage.pageCount;
            for(let i = 0;i < this.player.length;i++){
              this.player[i].createTime = this.dateTimeFormat(this.player[i].createTime)
            }
          }).catch((e) => {
            this.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
          })
        },
        handleCurrentChange1(val){
            this.Players(val)
        },
        //查看会员详情
        showother(index,row) {
          this.other = true;
          this.memberId = row.memberId;
          axios({
            method: 'post',
            url: this.global.mPath + '/member/querymemberdetail',
            headers: {
              'Content-type': 'application/x-www-form-urlencoded'
            },
            params: {
              'memberId': row.memberId,
              'token':sessionStorage.getItem('token'),
            }
          }).then((res) => {
            this.loading = false;//隐藏加载条
            this.details = res.data.data;
            this.tableData = res.data.data.roomList;
            this.recordList = res.data.data.recordList.items;
            for(let i = 0;i < this.tableData.length;i++){
              if(this.tableData[i].vip === true){
                this.tableData[i].vip = '是'
              }else{
                this.tableData[i].vip = '否'
              }
            }
            for(let j = 0;j < this.recordList.length;j++){
              this.recordList[j].finishTime = this.dateTimeFormat(this.recordList[j].finishTime);
              if(this.recordList[j].game === 'ruianMajiang'){
                this.recordList[j].game = '瑞安麻将'
              }
              if(this.recordList[j].game === 'wenzhouMajiang'){
                this.recordList[j].game = '温州麻将'
              }
              if(this.recordList[j].game === 'fangpaoMajiang'){
                this.recordList[j].game = '放炮麻将'
              }
              if(this.recordList[j].game === 'dianpaoMajiang'){
                this.recordList[j].game = '点炮麻将'
              }
              if(this.recordList[j].game === 'wenzhouShuangkou'){
                this.recordList[j].game = '温州双扣'
              }
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
                  this.$message({showClose: true, message: '请先登录', type: 'warning' });
                  break
              }
            }
          });
          this.addForm = {};
        },
        //  查看下级
        LookLower(){
          if(this.filters.id === this.id){
            this.filters.id = ''
          }
          this.centerDialogVisible = false;
          this.filters.bossId = this.id;
          this.handleSearch(1);
        },
        copy(){
          let clipboard = new Clipboard('.copy');
          clipboard.on('success', function(e) {
            alert('复制成功');
            clipboard.destroy()
          });

          clipboard.on('error', function(e) {
            alert('复制失败，请手动复制');
            clipboard.destroy()
          });
        },
        //绑定调整
        Bindingadjust(agentId){
          this.Bindingtoadjust = true;
          this.playersVisible = false;
          this.other = false;
          this.bindForm.agentId = agentId
        },
        bindsure() {
          axios({
            method: 'post',
            url: this.global.mPath + '/member/update_agent_bind',
            headers: {
              'Content-type': 'application/x-www-form-urlencoded'
            },
            params: {
              'memberId': this.memberId,
              'agentId': this.bindForm.id,//0023
              'token': sessionStorage.getItem('token')
            }
          }).then((res) => {
            // console.log(res.data)
            if (res.data.success) {
              this.$message.success({showClose: true, message: '修改成功', duration: 1500});
              this.Bindingtoadjust = false;
              this.handleSearch(this.page)
            } else {
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
        //  玉石调整
        GoldAdjustment(){
          this.Goldtoadjust = true;
          this.centerDialogVisible = false
        },
        goldsure(){
          axios({
            url:this.global.mPath + '/agent/goldmanager',
            method:'post',
            params:{
              token:sessionStorage.getItem('token'),
              agentId:this.id,
              goldAmount:this.GoldForm.goldAmount
            }
          }).then((res) => {
            if (res.data.success) {
              this.$message.success({showClose: true, message: '调整成功', duration: 1500});
              this.Goldtoadjust = false;
              this.handleSearch(this.page)
            } else {
              this.$message.error({showClose: true, message: err.toString(), duration: 2000});
            }
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
            this.handleSearch(1);
            axios({
              url:this.global.mPath + '/agent/queryagenttype',
              method:'post',
              params:{
                token:sessionStorage.getItem('token')
              }
            }).then((res) => {
              // console.log(res.data.data.listPage.items)
              this.options = res.data.data.listPage.items;
            })
          }else{
            this.$router.replace('/');
          }
        })
      }
    }
</script>

<style lang="scss">
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
  a{
    text-decoration: none;
    color:#fff;
  }
  .pic{
    width:50px;
    height:50px;
  }
  .bg-purple{
    width:200px;
    height:100px;
    text-align: center;
    background-color: #eee;
    border-radius: 5px;
    border:1px solid #eee;
  }
  .bg-purple div:nth-child(1){
    margin-top:20px;
    font-size:20px;
  }
  .bg-purple div:nth-child(2){
    margin-top:10px;
  }
  .el-button{
    padding:12px;
  }
  .code{
    .el-dialog{
      width:32%;
    }
  }
  .wanjia{
    margin-top:0;
  }
  .bg-purple{
    width:200px;
    height:100px;
    text-align: center;
    background-color: #eee;
    border-radius: 5px;
    border:1px solid #eee;
  }
  .bg-purple div:nth-child(1){
    margin-top:20px;
    font-size:20px;
  }
  .bg-purple div:nth-child(2){
    margin-top:10px;
  }
  .bdtz{
    width:53%;
    left:25%;
  }
  .every:not(:first-child){
    margin-left:10%;
  }
  .zj{
    list-style: none;
    width:93%;
    border:1px solid #000;
    height:130px;
    overflow-y: scroll;
  }
  .zj li{
    margin-left:-6.7%;
    background-color: #F5F5F5;
  }
  .zj li:not(:first-child){
    margin-top:5px;
  }
  .zj .top{
    border-bottom:1px solid #c9c9c9;
  }
  .zj .top span,
  .zj .bottom span{
    display:inline-block;
    width:24%;
    text-align: center;
  }
</style>
