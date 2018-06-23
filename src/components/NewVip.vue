<!--会员管理-->
<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>会员中心</b></el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main" v-loading="loading" element-loading-text="拼命加载中">
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="filters">
          <el-form-item>
            <el-input v-model="filters.id" placeholder="用户ID" @keyup.enter.native="handleSearch"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.nickname" placeholder="用户昵称" @keyup.enter.native="handleSearch"></el-input>
          </el-form-item>
          <el-form-item>
            <el-select v-model="value" placeholder="请选择身份进行查询" @change="change">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-button type="primary" @click="showgold">赠送金币</el-button>
          <el-button type="primary" @click="showintegral">赠送积分</el-button>
        </el-form>
      </el-col>

      <!-- 会员列表-->
      <el-table :data="vip" highlight-current-row @selection-change="selsChange"
                style="width: 100%;">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type="index" width="60"></el-table-column>
        <el-table-column prop="id" label="用户ID" width="100" sortable></el-table-column>
        <el-table-column prop="headimgurl" label="用户头像" width="100" sortable>
          <template slot-scope="scope">
            <img :src="scope.row.headimgurl" alt="" style="width: 50px;height: 50px">
          </template>
        </el-table-column>
        <el-table-column prop="nickname" label="用户名称" width="100" sortable></el-table-column>
        <el-table-column prop="gender" label="用户性别" width="100" sortable></el-table-column>
        <el-table-column prop="phone" label="手机号" width="140" sortable></el-table-column>
        <el-table-column prop="createTime" label="注册时间" width="180" sortable></el-table-column>
        <el-table-column prop="vipEndTime" label="会员到期时间" width="180" sortable></el-table-column>
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

      <!--赠送金币弹窗-->
      <el-dialog title="赠送金币" :visible.sync="giveFormVisible" :close-on-click-modal="false">
        <el-form :model="normalForm" label-width="100px" :rules="rules" class="demo-ruleForm">
          <el-form-item label="金币数量" prop="gold">
            <el-input type="number" min="0" placeholder="请输入正整数" v-model="normalForm.gold" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="givegold">赠送</el-button>
            <el-button type="primary" @click.native="giveFormVisible = false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>

      <!--赠送积分弹窗-->
      <el-dialog title="赠送积分" :visible.sync="givefromintegral" :close-on-click-modal="false">
        <el-form :model="normalForm" label-width="100px" :rules="rules" class="demo-ruleForm">
          <el-form-item label="积分数量" prop="score">
            <el-input type="number" min="0" placeholder="请输入正整数" v-model="normalForm.score" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="giveintegral">赠送</el-button>
            <el-button type="primary" @click.native="givefromintegral = false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>

      <!--其他信息弹窗-->
      <el-dialog title="详情" :visible.sync="other" :close-on-click-modal="false">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="等级经验" name="first">
            <!-- 其他信息-->
            <el-table :data="items" highlight-current-row @selection-change="selsChange"
                      style="width: 100%;">
              <el-table-column prop="vipLevel" label="会员级别" width="100" sortable></el-table-column>
              <el-table-column prop="vipScore" label="经验值" width="100" sortable></el-table-column>
              <el-table-column prop="score" label="积分" width="100" sortable></el-table-column>
              <el-table-column prop="gold" label="金币" width="100" sortable></el-table-column>
              <el-table-column prop="rmb" label="消费金额" width="100" sortable></el-table-column>
              <el-table-column prop="onlineTime" label="游戏时长" width="100" sortable></el-table-column>
              <el-table-column prop="loginIp" label="登录IP"></el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="金币积分流水" name="second">
            <el-table :data="items" highlight-current-row @selection-change="selsChange"
                      style="width: 100%;">
              <el-table-column type="index" width="60"></el-table-column>
              <el-table-column prop="accountingNo" label="流水号" width="100" sortable></el-table-column>
              <el-table-column prop="accountingAmount" label="变化数量" width="100" sortable></el-table-column>
              <el-table-column prop="balanceAfter" label="剩余量" width="100" sortable></el-table-column>
              <el-table-column prop="summary.text" label="操作原因" sortable></el-table-column>
              <el-table-column prop="accountingTime" label="操作时间" width="160" sortable></el-table-column>
            </el-table>
            <!--工具条-->
            <el-col :span="24" class="toolbar">
              <el-pagination layout="prev, pager, next" @current-change="ChangePage" :page-size="1" :total="page"
                             style="float:right;">
              </el-pagination>
            </el-col>
            <el-button type="primary" v-on:click="goldwathercourse">金币</el-button>
            <el-button type="primary" @click="integral">积分</el-button>
          </el-tab-pane>
        </el-tabs>
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
          value: '选项1',
          label: '会员用户'
        }, {
          value: '选项2',
          label: '非会员用户'
        },],
        value: '',
        items: [],
        vip: [],
        filters: {
          name: ''
        },
        total: 0,
        page: 0,
        limit: 10,
        loading: false,
        addLoading: false,
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
        }
      }
    },
    methods: {
      handleClick(tab, event) {
        if (tab.index == "0") {
          axios({
            method: 'post',
            url: '/api/member/querymember',
            headers: {
              'Content-type': 'application/x-www-form-urlencoded'
            },
            params: {
              'id': sessionStorage.getItem('id')
            }
          })
            .then((res) => {
                this.loading = false;//隐藏加载条
                this.items = res.data.data.items;
                //console.log(res.data.data.items)
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
        }
        if (tab.index == "1") {
          this.goldwathercourse(1);//显示金币流水
        }
      },
      //弹窗显示其他信息
      showother: function (index, row) {
        sessionStorage.setItem('id', this.vip[index].id);//保存id
        //console.log(this.vip[index].id)
        axios({
          method: 'post',
          url: '/api/member/querymember',
          headers: {
            'Content-type': 'application/x-www-form-urlencoded'
          },
          params: {
            'id': sessionStorage.getItem('id')
          }
        })
          .then((res) => {
              this.loading = false;//隐藏加载条
              this.items = res.data.data.items;
              //console.log(res.data.data.items)
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
              url: '/api/member/give_reward',
              headers: {
                'Content-type': 'application/x-www-form-urlencoded'
              },
              params: {
                'gold': this.normalForm.gold,
                'id': ids
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
              url: '/api/member/give_reward',
              headers: {
                'Content-type': 'application/x-www-form-urlencoded'
              },
              params: {
                'score': this.normalForm.score,
                'id': ids
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

      change() {
        if (this.value == '选项1') {//查询会员用户
          this.loading = true;//显示加载条
          axios({//根据会员昵称查询
            method: 'post',
            url: '/api/member/querymember',
            headers: {
              'Content-type': 'application/x-www-form-urlencoded'
            },
            params: {
              'size': '15',//每页数量
              'page': this.page,//当前页
              'id': this.filters.id,
              'nickname': this.filters.nickname,
              'vip': true
            }
          })
            .then((res) => {
                this.loading = false;//隐藏加载条
                this.vip = res.data.data.items;
                this.total = res.data.data.pageCount;//总页数
                for (let i = 0; i < this.vip.length; i++) {
                  this.vip[i].vipEndTime = this.dateTimeFormat(this.vip[i].vipEndTime);
                  this.vip[i].createTime = this.dateTimeFormat(this.vip[i].createTime);
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
        } else if (this.value == '选项2') {//查询非会员用户
          this.loading = true;//显示加载条
          axios({//根据会员昵称查询
            method: 'post',
            url: '/api/member/querymember',
            headers: {
              'Content-type': 'application/x-www-form-urlencoded'
            },
            params: {
              'size': '15',//每页数量
              'page': this.page,//当前页
              'id': this.filters.id,
              'nickname': this.filters.nickname,
              'vip': false
            }
          })
            .then((res) => {
                this.loading = false;//隐藏加载条
                this.vip = res.data.data.items;
                this.total = res.data.data.pageCount;//总页数
                for (let i = 0; i < this.vip.length; i++) {
                  this.vip[i].vipEndTime = this.dateTimeFormat(this.vip[i].vipEndTime);
                  this.vip[i].createTime = this.dateTimeFormat(this.vip[i].createTime);
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
        }
      },

      ChangePage(val) {
        this.page = val;
        this.gold(this.page);
      },

      //按金币筛选
      goldwathercourse() {
        axios({
          method: 'post',
          url: '/api/member/querygoldrecord',
          headers: {
            'Content-type': 'application/x-www-form-urlencoded'
          },
          params: {
            'size': '15',//每页数量
            'page': this.page,//当前页
            'memberId': sessionStorage.getItem('id')  //0023
          }
        })
          .then((res) => {
              this.loading = false;//隐藏加载条
              this.items = res.data.data.items;
              this.page = res.data.data.pageNum;//总页数
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
      integral() {
        axios({
          method: 'post',
          url: '/api/member/queryscorerecord',
          headers: {
            'Content-type': 'application/x-www-form-urlencoded'
          },
          params: {
            'size': '15',//每页数量
            'page': this.page,//当前页
            'memberId': sessionStorage.getItem('id')//0023
          }
        })
          .then((res) => {
              this.loading = false;//隐藏加载条
              this.items = res.data.data.items;
              this.page = res.data.data.pageNum;//总页数
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
      selsChange: function (sels) {
        this.sels = sels;
      },
    },
    mounted() { //初始化页面
      this.loading = true;//显示加载条
      axios({//根据会员昵称查询
        method: 'post',
        url: '/api/member/querymember',
        headers: {
          'Content-type': 'application/x-www-form-urlencoded'
        },
        params: {
          'size': '15',//每页数量
          'page': this.page,//当前页
        }
      })
        .then((res) => {
            this.loading = false;//隐藏加载条
            this.vip = res.data.data.items;
            this.total = res.data.data.pageCount;//总页数
            for (let i = 0; i < this.vip.length; i++) {
              this.vip[i].vipEndTime = this.dateTimeFormat(this.vip[i].vipEndTime);
              this.vip[i].createTime = this.dateTimeFormat(this.vip[i].createTime);
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

</style>

