// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
//cnpm下载element-ui并引入
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
/*cnpm下载axios并引入
先安装！
cnpm install axios
然后！
cnpm install --save axios vue-axios*/
import axios from 'axios'
//引入图标
import '@/assets/iconfont.css'
import '@/assets/js/jquery.min.js'

//echarts
import echarts from 'echarts'

Vue.prototype.$echarts = echarts

//全局注册
Vue.use(ElementUI)
Vue.config.productionTip = false
Vue.prototype.$axios = axios;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
