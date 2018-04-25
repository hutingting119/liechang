import 'babel-polyfill'
import Vue from 'vue'
import app from './App'
import router from './router/index'
import elementui from 'element-ui'
import EasyScroll from 'easyscroll'
import 'font-awesome/css/font-awesome.css'
import 'element-ui/lib/theme-chalk/index.css'
import common from './assets/common'
import store from './store/index'

Vue.use(common);
Vue.use(EasyScroll)
Vue.use(elementui)
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  render: h => h(app)
})
