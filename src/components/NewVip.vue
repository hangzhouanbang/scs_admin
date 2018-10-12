<!--会员管理-->
<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>会员中心</b></el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-row :gutter="20" style="margin-top:30px;">
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <div class="type">所有用户</div>
          <div class="num">{{amount}}人</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <div class="type">会员用户</div>
          <div class="num">{{vipAmount}}人</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <div class="type">非会员用户</div>
          <div class="num">{{noVipAmount}}人</div>
        </div>
      </el-col>
    </el-row>

    <el-col :span="24" class="warp-main" v-loading="loading" element-loading-text="拼命加载中">
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="filters">
          <el-form-item>
            <el-input v-model="filters.id" placeholder="用户ID" @keyup.enter.native="handleSearch()"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.nickname" placeholder="用户昵称" @keyup.enter.native="handleSearch()"></el-input>
          </el-form-item>
          <el-form-item>
            <el-select v-model="identity" placeholder="请选择身份进行查询" @change="handleSearch()">
              <el-option
                v-for="item in options"
                :key="item.value"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="state" placeholder="请选择在线状态" @change="handleSearch()">
              <el-option
                v-for="item in states"
                :key="item.value"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-button type="primary" @click="showgold">赠送玉石</el-button>
          <el-button type="primary" @click="showintegral">赠送礼券</el-button>
        </el-form>
      </el-col>

      <!-- 会员列表-->
      <el-table :data="vip" highlight-current-row @selection-change="selsChange"
                style="width: 100%;" @sort-change="sort">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type="index" width="40"></el-table-column>
        <el-table-column prop="id" label="用户ID" width="90"></el-table-column>
        <el-table-column prop="headimgurl" label="用户头像" width="100">
          <template slot-scope="scope">
            <img :src="scope.row.headimgurl" alt="" style="width: 50px;height: 50px">
          </template>
        </el-table-column>
        <el-table-column prop="nickname" label="用户名称" width="100"></el-table-column>
        <el-table-column prop="gold" label="玉石剩余量" width="120" sortable="custom"></el-table-column>
        <el-table-column prop="score" label="礼券剩余量" width="120" sortable="custom"></el-table-column>
        <el-table-column prop="createTime" label="注册时间" width="100" sortable="custom"></el-table-column>
        <el-table-column prop="vip" label="是否会员" width="100" sortable="custom"></el-table-column>
        <el-table-column prop="vipEndTime" label="到期时间" width="100" sortable="custom"></el-table-column>
        <el-table-column prop="vipLevel" label="会员等级" width="100" sortable="custom"></el-table-column>
        <el-table-column prop="vipScore" label="会员积分" width="100" sortable="custom"></el-table-column>
        <el-table-column prop="onlineState" label="在线状态" width="100" sortable="custom"></el-table-column>
        <el-table-column prop="verifyUser" label="是否通过实名认证" width="160" sortable="custom"></el-table-column>
        <el-table-column label="流水" width="80">
          <template slot-scope="scope">
            <el-button type="primary" @click="goldwathercourse(scope.row.id)" style="margin:0;">玉石</el-button>
            <el-button type="primary" @click="integral(scope.row.id)" style="margin:10px 0 0 0;">礼券</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="other" label="其他信息">
          <template slot-scope="scope">
            <el-button type="text" @click="showother(scope.$index,scope.row)">详细信息</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--工具条-->
      <el-col :span="24" class="toolbar">
        <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="1" :total="total"
                       style="float:right;">
        </el-pagination>
      </el-col>

      <!--赠送玉石弹窗-->
      <el-dialog title="赠送玉石" :visible.sync="giveFormVisible" :close-on-click-modal="false">
        <el-form :model="normalForm" label-width="100px" :rules="rules" class="demo-ruleForm">
          <el-form-item label="玉石数量" prop="gold">
            <el-input type="number" min="0" placeholder="请输入正整数" v-model="normalForm.gold"
                      auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="givegold">赠送</el-button>
            <el-button type="primary" @click.native="giveFormVisible = false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>

      <!--赠送礼券弹窗-->
      <el-dialog title="赠送礼券" :visible.sync="givefromintegral" :close-on-click-modal="false">
        <el-form :model="normalForm" label-width="100px" :rules="rules" class="demo-ruleForm">
          <el-form-item label="礼券数量" prop="score">
            <el-input type="number" min="0" placeholder="请输入正整数" v-model="normalForm.score"
                      auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="giveintegral">赠送</el-button>
            <el-button type="primary" @click.native="givefromintegral = false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>

      <!--玉石流水-->
      <el-dialog title="流水" :visible.sync="watercourse" :close-on-click-modal="false" style="padding-bottom:20px;">
          <el-table :data="items" highlight-current-row @selection-change="selsChange"
                    style="width: 100%;">
            <el-table-column prop="accountingNo" label="流水号" width="90"></el-table-column>
            <el-table-column prop="accountingAmount" label="变化数量" width="100"></el-table-column>
            <el-table-column prop="balanceAfter" label="剩余量" width="90"></el-table-column>
            <el-table-column prop="summary.text" label="操作原因" width="150"></el-table-column>
            <el-table-column prop="accountingTime" label="操作时间" width="auto"></el-table-column>
          </el-table>
          <!--工具条-->
          <el-col :span="24" class="toolbars">
            <el-pagination layout="prev, pager, next" @current-change="ChangePage" :page-size="1" :total="page"
                           style="float:right;">
            </el-pagination>
          </el-col>
      </el-dialog>

      <!--礼券流水-->
      <el-dialog title="流水" :visible.sync="giftcourse" :close-on-click-modal="false" style="padding-bottom:20px;">
        <el-table :data="items" highlight-current-row @selection-change="selsChange"
                  style="width: 100%;">
          <el-table-column prop="accountingNo" label="流水号" width="90"></el-table-column>
          <el-table-column prop="accountingAmount" label="变化数量" width="100"></el-table-column>
          <el-table-column prop="balanceAfter" label="剩余量" width="90"></el-table-column>
          <el-table-column prop="summary.text" label="操作原因" width="150"></el-table-column>
          <el-table-column prop="accountingTime" label="操作时间" width="auto"></el-table-column>
        </el-table>
        <!--工具条-->
        <el-col :span="24" class="toolbars">
          <el-pagination layout="prev, pager, next" @current-change="ChangePage1" :page-size="1" :total="page1"
                         style="float:right;">
          </el-pagination>
        </el-col>
      </el-dialog>

      <!--其他信息弹窗-->
      <el-dialog title="详情" :visible.sync="other" :close-on-click-modal="false" class="other">
          <!-- 其他信息-->
        <el-form ref="details" :model="details" label-width="150px">
          <el-form-item label="真实姓名：">
            <el-button type="text" style="color:#000;">{{details.realName}}</el-button>
          </el-form-item>
          <el-form-item label="性别：">
            <el-button type="text" style="color:#000;">{{details.gender}}</el-button>
          </el-form-item>
          <el-form-item label="手机号码：">
            <el-button type="text" style="color:#000;">{{details.phone}}</el-button>
          </el-form-item>
          <el-form-item label="身份证号：">
            <el-button type="text" style="color:#000;">{{details.verifyUser}}</el-button>
          </el-form-item>
          <el-form-item label="会员总消费：">
            <el-button type="text" style="color:#000;">{{details.cost}}元</el-button>
          </el-form-item>
          <el-form-item label="登录时间：">
            <el-button type="text" style="color:#000;">{{details.loginTime}}</el-button>
          </el-form-item>
          <el-form-item label="登录ip：">
            <el-button type="text" style="color:#000;">{{details.loginIp}}</el-button>
          </el-form-item>
          <el-form-item label="在线时间：">
            <el-button type="text" style="color:#000;">{{details.onlineTime}}</el-button>
          </el-form-item>
          <el-form-item label="正在游戏的房间：">
            <el-table
              :data="tableData"
              style="width: 100%;">
              <el-table-column
                prop="no"
                label="游戏房间号"
                width="180">
              </el-table-column>
              <el-table-column
                prop="game"
                label="游戏名称"
                width="180">
              </el-table-column>
              <el-table-column
                prop="vip"
                label="是否VIP房间">
              </el-table-column>
              <el-table-column
                prop="playersCount"
                label="玩家人数">
              </el-table-column>
              <el-table-column
                prop="panCountPerJu"
                label="每局盘数">
              </el-table-column>
              <el-table-column
                prop="currentPanNum"
                label="当前盘数">
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-form>
      </el-dialog>

    </el-col>
  </el-row>
</template>

<script>
  import axios from 'axios'

  export default {
    name: "NewVip",
    data() {
      return {
        sels: [], //列表选中列
        activeName: 'first',//选项卡默认显示第一页
        giveFormVisible: false,//隐藏金币弹窗
        givefromintegral: false,//隐藏积分弹窗
        other: false,//隐藏其他信息弹窗
        rules: {
          gold: [
            {required: true, message: '请输入金币数量', trigger: 'blur'}
          ],
          score: [
            {required: true, message: '请输入积分数量', trigger: 'blur'}
          ],
        },
        normalForm: {},
        options: [{
          value: '会员用户'
        }, {
          value: '非会员用户'
        },{
          value:'所有用户'
        }],
        states:[{
          value:'在线'
        },{
          value:'下线'
        }],
        identity: '',
        identity1: '',
        state:'',
        state1:'',
        items: [],
        tableData:[],
        details:{},
        vip: [],
        filters: {
          name: ''
        },
        total: 0,
        page: 1,
        page1: 0,
        limit: 10,
        loading: false,
        addLoading: false,
        watercourse:false,
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
        },
        addForm: {
          name: '',
          author: '',
          publishAt: '',
          description: ''
        },
        giftcourse:false,
        noVipAmount:'',
        vipAmount:'',
        amount:'',
        sorting:{}
      }
    },
    methods: {
      trim(str) {
        if(str != null){
          return str.replace(/(^\s+)|(\s+$)/g, "");
        }
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
      //弹窗显示其他信息
      showother: function (index, row) {
        sessionStorage.setItem('id', this.vip[index].id);//保存id
        //console.log(this.vip[index].id)
        axios({
          method: 'post',
          url: this.global.mPath + '/member/querymemberdetail',
          headers: {
            'Content-type': 'application/x-www-form-urlencoded'
          },
          params: {
            'memberId': row.id,
            'token':sessionStorage.getItem('token'),
          }
        })
          .then((res) => {
              this.loading = false;//隐藏加载条
              this.details = res.data.data;
              this.tableData = res.data.data.roomList;
              for(var i = 0;i < this.tableData.length;i++){
                if(this.tableData[i].vip == true){
                  this.tableData[i].vip = '是'
                }else{
                  this.tableData[i].vip = '否'
                }
              }
            },
          ).catch((e) => {
          if (e && e.response) {
            switch (e.response.status) {
              case 504:
                this.$message({
                  showClose: true,
                  message: '服务器异常',
                  type: 'warning'
                });
                this.loading = false;//隐藏加载条
                break
              case 500:
                this.$message({
                  showClose: true,
                  message: '服务器异常',
                  type: 'warning'
                });
                this.loading = false;//隐藏加载条
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
        this.other = true;
        this.addForm = {
          name: '',
          author: '',
          publishAt: '',
          description: ''
        };
      },
      //赠送金币
      givegold() {
        let ids = this.sels.map(item => item.id).toString();
        let that = this;
        this.$confirm('确认赠送金币吗？', '提示', {
          type: 'warning'
        }).then(() => {
          if (this.normalForm.gold == undefined || this.normalForm.gold == "") {
            this.$message({
              showClose: true,
              message: '不能为空',
              type: 'warning'
            });
          } else if (this.normalForm.gold < 0) {
            this.$message({
              showClose: true,
              message: '请输入正整数',
              type: 'warning'
            });
          } else {
            that.loading = true;
            axios({
              method: 'post',
              url: this.global.mPath + '/member/give_reward',
              headers: {
                'Content-type': 'application/x-www-form-urlencoded'
              },
              params: {
                'gold': this.trim(this.normalForm.gold),
                'id': ids,
                'token':sessionStorage.getItem('token')
              }
            })
              .then((res) => {
                  that.loading = false;
                  if (res.data.success == true) {
                    that.$message.success({showClose: true, message: '赠送成功', duration: 1500});
                    this.normalForm.gold = '';//清空内容
                    this.giveFormVisible = false;//关闭弹窗
                  } else {
                    that.$message.error({showClose: true, message: err.toString(), duration: 2000});
                  }
                },
              ).catch((e) => {
              if (e && e.response) {
                switch (e.response.status) {
                  case 504:
                    this.$message({
                      showClose: true,
                      message: '服务器异常',
                      type: 'warning'
                    });
                    this.loading = false;//隐藏加载条
                    break;
                  case 500:
                    this.$message({
                      showClose: true,
                      message: '服务器异常',
                      type: 'warning'
                    });
                    this.loading = false;//隐藏加载条
                    break;
                  case 405:
                    this.$message({
                      showClose: true,
                      message: '请先登录',
                      type: 'warning'
                    });
                    break;
                  case 400:
                    this.$message({
                      showClose: true,
                      message: '请按要求输入',
                      type: 'warning'
                    });
                    that.loading = false;
                    break;
                }
              }
            });
          }
        });
      },
      //赠送金币弹窗
      showgold: function (index, row) {
        this.giveFormVisible = true;
        this.addForm = {
          name: '',
          author: '',
          publishAt: '',
          description: ''
        };
      },
      //赠送金币
      giveintegral() {
        let ids = this.sels.map(item => item.id).toString();
        let that = this;
        this.$confirm('确认赠送金币吗？', '提示', {
          type: 'warning'
        }).then(() => {
          if (this.normalForm.score == undefined || this.normalForm.score == "") {
            this.$message({
              showClose: true,
              message: '不能为空',
              type: 'warning'
            });
          } else if (this.normalForm.score < 0) {
            this.$message({
              showClose: true,
              message: '请输入正整数',
              type: 'warning'
            });
          } else {
            that.loading = true;
            axios({
              method: 'post',
              url: this.global.mPath + '/member/give_reward',
              headers: {
                'Content-type': 'application/x-www-form-urlencoded'
              },
              params: {
                'score': this.trim(this.normalForm.score),
                'id': ids,
                'token':sessionStorage.getItem('token')
              }
            })
              .then((res) => {
                  that.loading = false;
                  if (res.data.success == true) {
                    that.$message.success({showClose: true, message: '赠送成功', duration: 1500});
                    this.normalForm.score = '';//清空内容
                    this.givefromintegral = false;//关闭弹窗
                  } else {
                    that.$message.error({showClose: true, message: err.toString(), duration: 2000});
                  }
                },
              ).catch((e) => {
              if (e && e.response) {
                switch (e.response.status) {
                  case 504:
                    this.$message({
                      showClose: true,
                      message: '服务器异常',
                      type: 'warning'
                    });
                    this.loading = false;//隐藏加载条
                    break;
                  case 500:
                    this.$message({
                      showClose: true,
                      message: '服务器异常',
                      type: 'warning'
                    });
                    this.loading = false;//隐藏加载条
                    break;
                  case 405:
                    this.$message({
                      showClose: true,
                      message: '请先登录',
                      type: 'warning'
                    });
                    break;
                  case 400:
                    this.$message({
                      showClose: true,
                      message: '请按要求输入',
                      type: 'warning'
                    });
                    break;
                }
              }
            });
          }
        });
      },
      //赠送积分弹窗
      showintegral: function (index, row) {
        this.givefromintegral = true;
        this.addForm = {
          name: '',
          author: '',
          publishAt: '',
          description: ''
        };
      },
      ChangePage(val) {
        this.page = val;
        this.jade(sessionStorage.getItem('id'),this.page)
      },
      ChangePage1(val) {
        this.page1 = val;
        this.certificate(sessionStorage.getItem('ID'),this.page1);
      },
      //按金币筛选
      goldwathercourse(id) {
        sessionStorage.setItem('id',id)
        this.watercourse = true;
        this.jade(id,1)
        this.page = 1;
      },
      jade(memberId,page){
        axios({
          method: 'post',
          url: this.global.mPath + '/member/querygoldrecord',
          headers: {
            'Content-type': 'application/x-www-form-urlencoded'
          },
          params: {
            'size': '15',//每页数量
            'page': page,//当前页
            'memberId':memberId,  //0023
            'token':sessionStorage.getItem('token')
          }
        })
          .then((res) => {
              this.loading = false;//隐藏加载条
              this.items = res.data.data.items;
              this.page = res.data.data.pageCount;//总页数
              for (let i = 0; i < this.items.length; i++) {
                this.items[i].accountingTime = this.dateTimeFormat(this.items[i].accountingTime);
              }
            },
          ).catch((e) => {
          if (e && e.response) {
            switch (e.response.status) {
              case 504:
                this.$message({
                  showClose: true,
                  message: '服务器异常',
                  type: 'warning'
                });
                this.loading = false;//隐藏加载条
                break
              case 500:
                this.$message({
                  showClose: true,
                  message: '服务器异常',
                  type: 'warning'
                });
                this.loading = false;//隐藏加载条
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
      //按积分筛选
      integral(id) {
        sessionStorage.setItem('ID',id)
        this.giftcourse = true;
        this.certificate(id,1);
        this.page1 = 1;
      },
      certificate(memberId,page){
        axios({
          method: 'post',
          url: this.global.mPath + '/member/queryscorerecord',
          headers: {
            'Content-type': 'application/x-www-form-urlencoded'
          },
          params: {
            'size': '15',//每页数量
            'page': page,//当前页
            'memberId': memberId,//0023
            'token':sessionStorage.getItem('token')
          }
        })
          .then((res) => {
              this.loading = false;//隐藏加载条
              this.items = res.data.data.items;
              this.page1 = res.data.data.pageCount;//总页数
              for (let i = 0; i < this.items.length; i++) {
                this.items[i].accountingTime = this.dateTimeFormat(this.items[i].accountingTime);
              }
            },
          ).catch((e) => {
          if (e && e.response) {
            switch (e.response.status) {
              case 504:
                this.$message({
                  showClose: true,
                  message: '服务器异常',
                  type: 'warning'
                });
                this.loading = false;//隐藏加载条
                break
              case 500:
                this.$message({
                  showClose: true,
                  message: '服务器异常',
                  type: 'warning'
                });
                this.loading = false;//隐藏加载条
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
      handleCurrentChange(val) {
        this.page = val;
        this.sort(this.sorting);
      },
      selsChange: function (sels) {
        this.sels = sels;
      },
      handleSearch(goldSort,scoreSort,createTimeSort,vipSort,vipEndTimeSort,vipLevelSort,vipScoreSort,onlineStateSort,verifyUserSort){
        if (this.identity == '会员用户') {//查询会员用户
          this.identity1 = true;
        }else if(this.identity == '非会员用户') {
          this.identity1 = false;
        }else{
          this.identity1 = '';
        }
        if(this.state == '在线'){
          this.state1 = 'online'
        }else if(this.state == '下线'){
          this.state1 = 'offline'
        }
        this.loading = true;//显示加载条
        axios({//根据会员昵称查询
          method: 'post',
          url: this.global.mPath + '/member/querymember',
          headers: {
            'Content-type': 'application/x-www-form-urlencoded'
          },
          params: {
            'size': '10',//每页数量
            'page':this.page,//当前页
            'token':sessionStorage.getItem('token'),
            'id':this.filters.id,
            'nickname':this.filters.nickname,
            'isVip':this.identity1,
            'onlineState':this.state1,
            'goldSort':goldSort,
            'scoreSort':scoreSort,
            'createTimeSort':createTimeSort,
            'vipSort':vipSort,
            'vipEndTimeSort':vipEndTimeSort,
            'vipLevelSort':vipLevelSort,
            'vipScoreSort':vipScoreSort,
            'onlineStateSort':onlineStateSort,
            'verifyUserSort':verifyUserSort
          }
        })
          .then((res) => {
              this.loading = false;//隐藏加载条
              this.amount = res.data.data.amount;
              this.vipAmount = res.data.data.vipAmount;
              this.noVipAmount = res.data.data.noVipAmount;
              this.vip = res.data.data.memberList.items;
              this.total = res.data.data.memberList.pageCount;//总页数
              for (let i = 0; i < this.vip.length; i++) {
                this.vip[i].vipEndTime = this.dateTimeFormat(this.vip[i].vipEndTime);
                this.vip[i].createTime = this.dateTimeFormat(this.vip[i].createTime);
                if(this.vip[i].vip == true){
                  this.vip[i].vip = '是'
                }else{
                  this.vip[i].vip = '否'
                }
                if(this.vip[i].verifyUser == true){
                  this.vip[i].verifyUser = '是'
                }else{
                  this.vip[i].verifyUser = '否'
                }
              }
            },
          ).catch((e) => {
          if (e && e.response) {
            switch (e.response.status) {
              case 504:
                this.$message({
                  showClose: true,
                  message: '服务器异常',
                  type: 'warning'
                });
                this.loading = false;//隐藏加载条
                break
              case 500:
                this.$message({
                  showClose: true,
                  message: '服务器异常',
                  type: 'warning'
                });
                this.loading = false;//隐藏加载条
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
      sort(a){
        this.sorting = a;
        if(this.sorting.prop == 'gold'){
          if(this.sorting.order == 'ascending'){
            this.sorting.gold = 'ASC'
          }
          if(this.sorting.order == 'descending'){
            this.sorting.gold = 'DESC'
          }
        }
        if(this.sorting.prop == 'score'){
          if(this.sorting.order == 'ascending'){
            this.sorting.score = 'ASC'
          }
          if(this.sorting.order == 'descending'){
            this.sorting.score = 'DESC'
          }
        }
        if(this.sorting.prop == 'createTime'){
          if(this.sorting.order == 'ascending'){
            this.sorting.createTime = 'ASC'
          }
          if(this.sorting.order == 'descending'){
            this.sorting.createTime = 'DESC'
          }
        }
        if(this.sorting.prop == 'vip'){
          if(this.sorting.order == 'ascending'){
            this.sorting.vip = 'ASC'
          }
          if(this.sorting.order == 'descending'){
            this.sorting.vip = 'DESC'
          }
        }
        if(this.sorting.prop == 'vipEndTime'){
          if(this.sorting.order == 'ascending'){
            this.sorting.vipEndTime = 'ASC'
          }
          if(this.sorting.order == 'descending'){
            this.sorting.vipEndTime = 'DESC'
          }
        }
        if(this.sorting.prop == 'vipLevel'){
          if(this.sorting.order == 'ascending'){
            this.sorting.vipLevel = 'ASC'
          }
          if(this.sorting.order == 'descending'){
            this.sorting.vipLevel = 'DESC'
          }
        }
        if(this.sorting.prop == 'vipScore'){
          if(this.sorting.order == 'ascending'){
            this.sorting.vipScore = 'ASC'
          }
          if(this.sorting.order == 'descending'){
            this.sorting.vipScore = 'DESC'
          }
        }
        if(this.sorting.prop == 'onlineState'){
          if(this.sorting.order == 'ascending'){
            this.sorting.onlineState = 'ASC'
          }
          if(this.sorting.order == 'descending'){
            this.sorting.onlineState = 'DESC'
          }
        }
        if(this.sorting.prop == 'verifyUser'){
          if(this.sorting.order == 'ascending'){
            this.sorting.verifyUser = 'ASC'
          }
          if(this.sorting.order == 'descending'){
            this.sorting.verifyUser = 'DESC'
          }
        }
        this.handleSearch(this.sorting.gold,this.sorting.score,this.sorting.createTime,this.sorting.vip,this.sorting.vipEndTime,this.sorting.vipLevel,this.sorting.vipScore,this.sorting.onlineState,this.sorting.verifyUser)
      }
    },
    mounted() { //初始化页面
      this.handleSearch()
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
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 100%;
  }
  .el-dialog__body{
   padding-bottom:60px;
  }
  .el-dialog__wrapper:nth-child(8){
    left:10%;
  }
  .other .el-dialog{
    width:90%;
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
</style>

