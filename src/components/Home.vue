<template>
  <el-row class="container">
    <!--头部-->
    <el-col :span="24" class="topbar-wrap">
      <div class="topbar-logo topbar-btn">
        <router-link to="/"><img src="../assets/logo.png" style="padding-left:8px;"></router-link>
      </div>
      <div class="topbar-title">
        <span style="font-size: 18px;color: #fff;">后台管理系统</span>
      </div>
      <div class="topbar-account topbar-btn">
        <el-dropdown trigger="click">
          <span class="el-dropdown-link userinfo-inner"><i class="iconfont icon-guanliyuan"></i> {{nickname}}  <i
            class="iconfont icon-down"></i></span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <div @click="jumpTo('/personalInfo')"><span style="color: #555;font-size: 14px;">个人信息</span></div>
            </el-dropdown-item>
            <el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-col>

    <!--中间-->
    <el-col :span="24" class="main">
      <!--左侧导航-->
      <aside :class="{showSidebar:!collapsed}">
        <!--展开折叠开关-->
        <div class="menu-toggle" @click.prevent="collapse">
          <i class="iconfont icon-weibiaoti25" v-show="!collapsed"></i>
          <i class="iconfont icon-weibiaoti26" v-show="collapsed"></i>
        </div>
        <!--导航菜单-->
        <el-menu :default-active="defaultActiveIndex" router :collapse="collapsed" @select="handleSelect">
          <template v-for="(item,index) in $router.options.routes" v-if="item.menuShow">
            <el-submenu v-if="!item.leaf" :index="index+''">
              <template slot="title"><i :class="item.iconCls"></i><span slot="title">{{item.name}}</span></template>
              <el-menu-item v-for="term in item.children" :key="term.path" :index="term.path" v-if="term.menuShow"
                            :class="$route.path==term.path?'is-active':''">
                <i :class="term.iconCls"></i><span slot="title">{{term.name}}</span>
              </el-menu-item>
            </el-submenu>
            <el-menu-item v-else-if="item.leaf&&item.children&&item.children.length" :index="item.children[0].path"
                          :class="$route.path==item.children[0].path?'is-active':''">
              <i :class="item.iconCls"></i><span slot="title">{{item.children[0].name}}</span>
            </el-menu-item>
          </template>
        </el-menu>
      </aside>

      <!--右侧内容区-->
      <section class="content-container">
        <div class="grid-content bg-purple-light">
          <el-col :span="24" class="content-wrapper">
            <transition name="fade" mode="out-in">
              <router-view></router-view>
            </transition>
          </el-col>
        </div>
      </section>
    </el-col>

  </el-row>
</template>

<script>
  import axios from 'axios'

  export default {
    name: "Home",
    created() {
    },
    data() {
      return {
        defaultActiveIndex: "0",
        nickname: sessionStorage.getItem('nickname'),
        collapsed: false,
      }
    },
    methods: {
      handleSelect(index) {
        this.defaultActiveIndex = index;
        this.handleSearch()
        this.handleSearch1()
      },
      //折叠导航栏
      collapse: function () {
        this.collapsed = !this.collapsed;
      },
      jumpTo(url) {
        this.defaultActiveIndex = url;
        this.$router.push(url); //用go刷新
      },
      //退出登录
      logout() {
        axios({//
          method: 'post',
          url: this.global.mPath + '/login/logout',
          headers: {
            'Content-type': 'application/x-www-form-urlencoded'
          },
          params:{
            'token':sessionStorage.getItem('token')
          }
        })
          .then((res) => {
            this.$router.replace('/');
            },
          ).catch((e) => {
        });
      },
      css(t,s){
        s=document.createElement('style');
        s.innerText=t;
        document.body.appendChild(s);
      },
      handleSearch(){
        axios({
          url:this.global.mPath + '/agent/queryapplyrecord',
          method:'post',
          params:{
            startTime:'',
            endTime:'',
            token:sessionStorage.getItem('token')
          }
        }).then((res) => {
            let number = res.data.data.totalItemsCount;
            // console.log(number)
            if(number > 0){
              let aa = document.getElementsByClassName('icon-home')[0]
              aa.innerHTML = number;
              aa.style.backgroundColor='#f56c6c';
              aa.style.color='#fff';
              this.css('.icon-yewurenyuanxinxiguanli:after{display:block}');
            }
          }
        ).catch((e) => {
        })
      },
      handleSearch1(){
        axios({
          method: 'post',
          url: this.global.mPath + '/agent/queryagentrewardapply',
          headers: {
            'Content-type': 'application/x-www-form-urlencoded'
          },
          params: {
            'agentId':'',
            'state':'',
            'token':sessionStorage.getItem('token'),
            'page':1,
            'size':10
          }
        })
          .then((res) => {
              this.amount = res.data.data.amount;
              let aa = document.getElementsByClassName('icon-home1')[0]
              if(this.amount > 0){
                aa.innerHTML = this.amount;
                aa.style.backgroundColor='#f56c6c';
                aa.style.color='#fff';
                this.css('.icon-yewurenyuanxinxiguanli:after{display:block}');
              // }else{
              //   aa.innerHTML = '';
              //   aa.style.backgroundColor='#fff';
              //   aa.style.color='#fff';
              //   this.css('.icon-yewurenyuanxinxiguanli:after{display:none}');
              }
            },
          ).catch((e) => {

        });
      },
    },
    mounted() {
      let user = localStorage.getItem('access-user');
      if (user) {
        user = JSON.parse(user);
        this.nickname = user.nickname || '';
      }
      if(!sessionStorage.getItem('token')){
        this.$router.replace('/');
      }
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
          this.handleSearch()
          this.handleSearch1()
        }
      })
    }

  }
</script>

<style scoped lang="scss">
  .container {
    position: absolute;
    top: 0px;
    bottom: 0px;
    width: 100%;

    .topbar-wrap {
      height: 50px;
      line-height: 50px;
      background: #373d41;
      padding: 0px;

      .topbar-btn {
        color: #fff;
      }
      .topbar-logo {
        float: left;
        width: 59px;
        line-height: 26px;
      }
      .topbar-logos {
        float: left;
        width: 120px;
        line-height: 26px;
      }
      .topbar-logo img, .topbar-logos img {
        height: 40px;
        margin-top: 5px;
        margin-left: 2px;
      }
      .topbar-title {
        float: left;
        text-align: left;
        width: 200px;
        padding-left: 10px;
        border-left: 1px solid #000;
      }
      .topbar-account {
        float: right;
        padding-right: 12px;
      }
      .userinfo-inner {
        cursor: pointer;
        color: #fff;
        padding-left: 10px;
      }
    }
    .main {
      display: -webkit-box;
      display: -webkit-flex;
      display: -ms-flexbox;
      display: flex;
      position: absolute;
      top: 50px;
      bottom: 0px;
      overflow: hidden;
    }

    aside {
      min-width: 50px;
      background: #fff; /*导航栏底部背景*/
      &::-webkit-scrollbar {
        display: none;
      }

      &.showSidebar {
        overflow-x: hidden;
        overflow-y: auto;
      }

      .el-menu {
        height: 100%; /*写给不支持calc()的浏览器*/
        height: -moz-calc(100% - 80px);
        height: -webkit-calc(100% - 80px);
        height: calc(100% - 80px);
        border-radius: 0px;
        background-color: #fff; /*导航栏背景*/
        border-right: 0px;
      }

      .el-submenu .el-menu-item {
        min-width: 60px;
      }
      .el-menu {
        width: 180px;
      }
      .el-menu--collapse {
        width: 60px;
      }

      .el-menu .el-menu-item, .el-submenu .el-submenu__title {
        height: 46px;
        line-height: 46px;
      }

      .el-menu-item:hover, .el-submenu .el-menu-item:hover, .el-submenu__title:hover {
        background-color: #7ed2df;
      }
    }

    .menu-toggle {
      background: #4A5064; /*导航栏折叠背景*/
      text-align: center;
      color: white;
      height: 26px;
      line-height: 30px;
    }

    .content-container {
      background: #fff; /*右侧总背景*/
      flex: 1;
      overflow-y: auto;
      padding: 10px;
      padding-bottom: 1px;

      .content-wrapper {
        background-color: #fff; /*右侧内容背景*/
        box-sizing: border-box;
      }
    }
  }
</style>
