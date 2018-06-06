import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login.vue'
import Home from '@/components/Home.vue'
import Admin from '@/components/Admin.vue'
import NewVip from '@/components/NewVip.vue'
import SetGold from '@/components/SetGold.vue'
import SetNotice from '@/components/SetNotice.vue'
import SelectNotice from '@/components/SelectNotice.vue'

Vue.use(Router)

export default new Router({
  routes: [

    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/home',
      component: Home,
      //name: '管理员管理',
      redirect: '/admin',
      menuShow: true,
      leaf: true, // 只有一个节点
      iconCls: 'iconfont icon-users', // 图标样式class
      children: [
        {path: '/admin', component: Admin, name: '管理员管理', menuShow: true}
      ]
    },
    {
      path: '/home',
      component: Home,
      name: '会员中心',
      menuShow: true,
      iconCls: 'iconfont icon-books',
      children: [
        {path: '/newvip', component: NewVip, name: '会员查询', menuShow: true}
      ]
    },
    {
      path: '/home',
      component: Home,
      name: '游戏大厅',
      menuShow: true,
      iconCls: 'iconfont icon-setting1',
      children: [
        {path: '/setGold', component: SetGold, name: '设置金币', menuShow: true},
        {path: '/setNotice', component: SetNotice, name: '发布公告', menuShow: true},
        {path: '/selectNotice', component: SelectNotice, name: '查询公告', menuShow: true}
      ]
    }
  ]
})
