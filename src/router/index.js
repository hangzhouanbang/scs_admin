import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login.vue'
import Home from '@/components/Home.vue'
import Admin from '@/components/Admin.vue'
import NewVip from '@/components/NewVip.vue'
import MemberRules from '@/components/MemberRules.vue'
import SystemMaintenance from '@/components/SystemMaintenance.vue'
import SystemRecovery from '@/components/SystemRecovery.vue'

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
        {path: '/newVip', component: NewVip, name: '会员管理', menuShow: true},
        {path: '/memberRules', component: MemberRules, name: '会员权益', menuShow: true},
      ]
    },
    {
      path: '/home',
      component: Home,
      name: '系统设置',
      menuShow: true,
      iconCls: 'iconfont icon-setting1',
      children: [
        {path: '/systemMaintenance', component: SystemMaintenance, name: '系统维护', menuShow: true},
        {path: '/systemRecovery', component: SystemRecovery, name: '系统恢复', menuShow: true}
      ]
    }
  ]
})
