import Vue from 'vue'
import VueRouter from 'vue-router'
import login from './../pages/login'
import register from './../pages/register'
import positionlist from './../pages/positionlist'
import progressdetail from './../pages/progressdetail'
import admin from './../pages/administrators'
import usercenter from './../pages/usercenter'
import codereset from './../pages/codereset'
Vue.use(VueRouter)
export default new VueRouter({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/register',
      name: 'register',
      component: register
    },
    {
      path: '/posList',
      name: 'positionList',
      component: positionlist,
     },
    {
      path:'/prodetail',
      name:'prodetail',
      component:progressdetail
    },
    {
      path: '/admin',
      name: 'admin',
      component: admin
    },
    {
      path:'/usercenter',
      name:'usercenter',
      component:usercenter
    },
    {
      path:'/codereset',
      name:'codereset',
      component:codereset
    }
  ]
})
