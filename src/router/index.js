import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login.vue'
import Home from '@/components/Home.vue'
import Admin from '@/components/Admin.vue'
import NewVip from '@/components/NewVip.vue'
import MemberRules from '@/components/MemberRules.vue'
import SystemMaintenance from '@/components/SystemMaintenance.vue'
import SystemRecovery from '@/components/SystemRecovery.vue'
import Role from '@/components/Role.vue'
import Jurisdiction from '@/components/Jurisdiction.vue'
import Server from '@/components/Server.vue'
import SystemNotice from '@/components/SystemNotice.vue'
import MemberCard from '@/components/MemberCard.vue'
import Microservice from '@/components/Microservice.vue'
import MemberLevel from '@/components/MemberLevel.vue'
import ReCharge from '@/components/ReCharge.vue'
import OnlineUsers from '@/components/OnlineUsers.vue'
import PlatformOperation from '@/components/PlatformOperation.vue'
import Progression from '@/components/Progression.vue'
import PendingReleaseTask from '@/components/PendingReleaseTask.vue'
import PublishedTask from '@/components/PublishedTask.vue'
import MailingList from '@/components/MailingList.vue'
import Mailing from '@/components/Mailing.vue'
import MailRecord from '@/components/MailRecord.vue'
import PromoterManagement from '@/components/PromoterManagement.vue'
import PromoterApplicationRecord from '@/components/PromoterApplicationRecord.vue'
import MembershipCardPurchaseRecord from '@/components/MembershipCardPurchaseRecord.vue'
import MembershipCardConsumptionRecord from '@/components/MembershipCardConsumptionRecord.vue'
import PromoterOperationRecord from '@/components/PromoterOperationRecord.vue'
import Activity from '@/components/Activity.vue'

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
      redirect: '/admin',
      menuShow: true,
      leaf: true, // 只有一个节点
      iconCls: 'iconfont icon-guanliyuan', // 图标样式class
      children: [
        {path: '/admin', component: Admin, name: '管理员管理', menuShow: true}
      ]
    },
    {
      path: '/home',
      component: Home,
      redirect: '/role',
      menuShow: true,
      leaf: true, // 只有一个节点
      iconCls: 'iconfont icon-navicon-jsgl', // 图标样式class
      children: [
        {path: '/role', component: Role, name: '角色管理', menuShow: true}
      ]
    },
    {
      path: '/home',
      component: Home,
      name: '会员中心',
      menuShow: true,
      iconCls: 'iconfont icon-huiyuanzhongxin',
      children: [
        {path: '/newVip', component: NewVip, name: '用户管理', menuShow: true},
        {path: '/memberRules', component: MemberRules, name: '会员权益', menuShow: true},
        {path: '/memberCard', component: MemberCard, name: '会员卡', menuShow: true},
        {path: '/memberLevel', component: MemberLevel, name: 'vip等级', menuShow: true},
        {path: '/reCharge', component: ReCharge, name: '充值记录', menuShow: true},
        {path: '/onlineUsers', component: OnlineUsers, name: '在线用户', menuShow: true},
      ]
    },
    {
      path: '/home',
      component: Home,
      name: '系统设置',
      menuShow: true,
      iconCls: 'iconfont icon-xitongshezhi',
      children: [
        {path: '/systemMaintenance', component: SystemMaintenance, name: '系统维护', menuShow: true},
        {path: '/systemRecovery', component: SystemRecovery, name: '系统恢复', menuShow: true},
        {path: '/systemNotice', component: SystemNotice, name: '系统公告', menuShow: true},
        {path: '/Microservice', component: Microservice, name: '微服务', menuShow: true}
      ]
    },
    {
      path: '/home',
      component: Home,
      redirect: '/jurisdiction',
      menuShow: true,
      leaf: true, // 只有一个节点
      iconCls: 'iconfont icon-ic_opt_feature', // 图标样式class
      children: [
        {path: '/jurisdiction', component: Jurisdiction, name: '权限管理', menuShow: true}
      ]
    },
    {
      path: '/home',
      component: Home,
      redirect: '/server',
      menuShow: true,
      leaf: true, // 只有一个节点
      iconCls: 'iconfont icon-server', // 图标样式class
      children: [
        {path: '/server', component: Server, name: '服务器管理', menuShow: true}
      ]
    },
    {
      path: '/home',
      component: Home,
      name: '报表统计',
      menuShow: true,
      iconCls: 'iconfont icon-baobiaotongji',
      children: [
        {path: '/platformOperation', component: PlatformOperation, name: '平台运营日报', menuShow: true},
        {path: '/progression', component: Progression, name: '游戏数据日报', menuShow: true},
      ]
    },
    {
      path: '/home',
      component: Home,
      name: '任务管理',
      menuShow: true,
      iconCls: 'iconfont icon-renwuguanli',
      children: [
        {path: '/pendingReleaseTask', component: PendingReleaseTask, name: '待发布任务', menuShow: true},
        {path: '/publishedTask', component: PublishedTask, name: '已发布任务', menuShow: true},
      ]
    },
    {
      path: '/home',
      component: Home,
      name: '邮件管理',
      menuShow: true,
      iconCls: 'iconfont icon-mailmanagement',
      children: [
        {path: '/mailingList', component: MailingList, name: '邮件列表', menuShow: true},
        {path: '/mailing', component: Mailing, name: '邮件发送', menuShow: true},
        {path: '/mailRecord', component: MailRecord, name: '邮件记录', menuShow: true},
      ]
    },
    {
      path: '/home',
      component: Home,
      name: '推广员中心',
      menuShow: true,
      iconCls: 'iconfont icon-yewurenyuanxinxiguanli',
      children: [
        {path: '/promoterManagement', component: PromoterManagement, name: '推广员管理', menuShow: true},
        {path: '/promoterApplicationRecord', component: PromoterApplicationRecord, name: '推广员申请记录', menuShow: true},
        {
          path: '/membershipCardPurchaseRecord',
          component: MembershipCardPurchaseRecord,
          name: '会员卡购买记录',
          menuShow: true
        },
        {
          path: '/membershipCardConsumptionRecord',
          component: MembershipCardConsumptionRecord,
          name: '会员卡兑换记录',
          menuShow: true
        },
        {path: '/promoterOperationRecord', component: PromoterOperationRecord, name: '推广员操作记录', menuShow: true},
      ]
    },
    {
      path: '/home',
      component: Home,
      menuShow: true,
      leaf: true,
      iconCls: 'iconfont icon-yewurenyuanxinxiguanli',
      children: [
        {path: '/activity', component: Activity, name: '活动管理', menuShow: true}
      ]
    }
  ]
})
