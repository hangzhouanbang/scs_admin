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
import OrderManagement from '@/components/OrderManagement.vue'
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
import MallManagement from '@/components/MallManagement.vue'
import CodeUsageRecord from '@/components/CodeUsageRecord.vue'
import IntegralRecord from '@/components/IntegralRecord.vue'
import GamePlay from '@/components/GamePlay.vue'
import PlayTheMutex from '@/components/PlayTheMutex.vue'
import Lottery from '@/components/Lottery.vue'
import Record from '@/components/Record.vue'
import Winning from '@/components/Winning.vue'
import ReCharge from '@/components/ReCharge.vue'
import LimitLogin from '@/components/LimitLogin.vue'
import MapManagement from '@/components/MapManagement.vue'
import Index from '@/components/Index.vue'
import PromotionOfEarnings from '@/components/PromotionOfEarnings.vue'
import DestoonFinanceCash from '@/components/DestoonFinanceCash.vue'
import ProxyLevelManagement from '@/components/ProxyLevelManagement.vue'
import OperatingRecord from '@/components/OperatingRecord.vue'
import BasicStatistic from '@/components/BasicStatistic.vue'
import PaidStatistic from '@/components/PaidStatistic.vue'
import SilentPlayerStatistics from '@/components/SilentPlayerStatistics.vue'
import PersonalInfo from '@/components/PersonalInfo.vue'
import Housekeeping from '@/components/Housekeeping.vue'
import ReviewTheOpeningOfTeahouse from '@/components/ReviewTheOpeningOfTeahouse.vue'
import TeahouseMallManagement from '@/components/TeahouseMallManagement.vue'
import DetailsOfTheTeahouse from '@/components/DetailsOfTheTeahouse.vue'
import ShoppingMallPurchaseRecord from '@/components/ShoppingMallPurchaseRecord.vue'
import JadeRechargeRecord from '@/components/JadeRechargeRecord.vue'
import VersionManagement from '@/components/VersionManagement.vue'
import RedEnvelopeTaskRecord from '@/components/RedEnvelopeTaskRecord.vue'
import CashManagement from '@/components/CashManagement.vue'
import ForRecord from '@/components/ForRecord.vue'
import WhitelistManagement from '@/components/WhitelistManagement.vue'
import ProxyConsumptionRecord from '@/components/ProxyConsumptionRecord.vue'
import AgentIncomeQuery from '@/components/AgentIncomeQuery.vue'

Vue.config.devtools = true;
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
      iconCls: 'iconfont icon-shouye', // 图标样式class
      children: [
        {path: '/index', component: Index, name: '首页', menuShow: true}
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
        {path: '/limitLogin', component: LimitLogin, name: '限制登录', menuShow: true},
        {path: '/operatingRecord', component: OperatingRecord, name: '操作纪录', menuShow: true},
        {path: '/housekeeping', component: Housekeeping, name: '房间管理', menuShow: true},
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
        {
          path: '/promoterApplicationRecord',
          component: PromoterApplicationRecord,
          name: '推广员申请记录',
          menuShow: true,
          iconCls: 'iconfont icon-home',
        },
        {path: '/membershipCardPurchaseRecord', component: MembershipCardPurchaseRecord, name: '充值购买记录', menuShow: true},
        {path: '/promoterOperationRecord', component: PromoterOperationRecord, name: '消费使用记录', menuShow: true},
        {path: '/membershipCardConsumptionRecord', component: MembershipCardConsumptionRecord, name: '积分兑换记录', menuShow: true},
        {path: '/integralRecord', component: IntegralRecord, name: '积分获取记录', menuShow: true},
        {path: '/mallManagement', component: MallManagement, name: '代理商城管理', menuShow: true},
        {path: '/codeUsageRecord', component: CodeUsageRecord, name: '邀请玩家查询', menuShow: true},
        {path: '/mapManagement', component: MapManagement, name: '推广图管理', menuShow: true},
        {path: '/promotionOfEarnings', component: PromotionOfEarnings, name: '推广收益查询', menuShow: true},
        {
          path: '/destoonFinanceCash',
          component: DestoonFinanceCash,
          name: '提现申请',
          menuShow: true,
          iconCls: 'iconfont icon-home1'},
        {path: '/proxyLevelManagement', component: ProxyLevelManagement, name: '代理级别管理', menuShow: true},
      ]
    },
    {
      path: '/home',
      component: Home,
      name: '茶馆管理',
      menuShow: true,
      iconCls: 'iconfont icon-chahu',
      children: [
        {path: '/reviewTheOpeningOfTeahouse', component: ReviewTheOpeningOfTeahouse, name: '茶馆开通审核', menuShow: true},
        {path: '/teahouseMallManagement', component: TeahouseMallManagement, name: '茶馆商城管理', menuShow: true},
        {path: '/detailsOfTheTeahouse', component: DetailsOfTheTeahouse, name: '茶馆详情查询', menuShow: true},
        {path: '/shoppingMallPurchaseRecord', component: ShoppingMallPurchaseRecord, name: '茶馆购买记录', menuShow: true},
        {path: '/jadeRechargeRecord', component: JadeRechargeRecord, name: '玉石充值记录', menuShow: true},
      ]
    },
    {
      path: '/home',
      component: Home,
      name: '财务系统',
      menuShow: true,
      iconCls: 'iconfont icon-chongzhi',
      children: [
        {path: '/orderManagement', component: OrderManagement, name: '订单管理', menuShow: true},
        {path: '/reCharge', component: ReCharge, name: '游戏充值记录', menuShow: true},
        {path: '/proxyConsumptionRecord', component: ProxyConsumptionRecord, name: '代理消费记录', menuShow: true},
        {path: '/agentIncomeQuery', component: AgentIncomeQuery, name: '代理收益查询', menuShow: true},
      ]
    },
    {
      path: '/home',
      component: Home,
      name: '报表统计',
      menuShow: true,
      iconCls: 'iconfont icon-baobiaotongji',
      children: [
        {path: '/basicStatistic', component: BasicStatistic, name: '基础数据统计', menuShow: true},
        {path: '/paidStatistic', component: PaidStatistic, name: '付费数据统计', menuShow: true},
        {path: '/silentPlayerStatistics', component: SilentPlayerStatistics, name: '沉默玩家统计', menuShow: true},
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
        {path: '/redEnvelopeTaskRecord', component: RedEnvelopeTaskRecord, name: '红包任务记录', menuShow: true},
        {path: '/cashManagement', component: CashManagement, name: '兑换管理', menuShow: true},
        {path: '/forRecord', component: ForRecord, name: '兑换记录', menuShow: true},
        {path: '/whitelistManagement', component: WhitelistManagement, name: '白名单管理', menuShow: true},
      ]
    },
    {
      path: '/home',
      component: Home,
      name: '活动管理',
      menuShow: true,
      iconCls: 'iconfont icon-huodongguanli',
      children: [
        {path: '/activity', component: Activity, name: '活动配置', menuShow: true},
      ]
    },
    {
      path: '/home',
      component: Home,
      name: '签到管理',
      menuShow: true,
      iconCls: 'iconfont icon-ziyuan',
      children: [
        {path: '/Lottery', component: Lottery, name: '奖励管理', menuShow: true},
        {path: '/winning', component: Winning, name: '中奖记录', menuShow: true},
        {path: '/record', component: Record, name: '兑换记录', menuShow: true},
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
      name: '系统设置',
      menuShow: true,
      iconCls: 'iconfont icon-xitongshezhi',
      children: [
        {path: '/systemMaintenance', component: SystemMaintenance, name: '系统维护', menuShow: true},
        {path: '/systemRecovery', component: SystemRecovery, name: '系统恢复', menuShow: true},
        {path: '/systemNotice', component: SystemNotice, name: '系统公告', menuShow: true},
        {path: '/microservice', component: Microservice, name: '微服务', menuShow: true},
        {path: '/versionManagement', component: VersionManagement , name: '版本管理', menuShow: true}
      ]
    },
    {
      path: '/home',
      component: Home,
      name: '玩法管理',
      menuShow: true,
      iconCls: 'iconfont icon-wanfa',
      children: [
        {path: '/gamePlay', component: GamePlay, name: '玩法', menuShow: true},
        {path: '/playTheMutex', component: PlayTheMutex, name: '玩法互斥', menuShow: true},
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
      redirect: '/personalInfo',
      menuShow: true,
      leaf: true, // 只有一个节点
      iconCls: 'iconfont', // 图标样式class
      children: [
        {path: '/personalInfo', component: PersonalInfo, name: '', menuShow: true}
      ]
    },
  ]
})
