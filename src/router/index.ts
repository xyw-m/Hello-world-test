import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'
import Test from '../views/Test.vue'

// 如果在一个模块化工程中使用它，必须要通过 Vue.use() 明确地安装路由功能：
Vue.use(VueRouter)

// 定义路由，每个路由应该对应一个组件
const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/playground',
    name: 'Playground',
    component: () => import('../views/playground.vue')
  },
  {
    path: '/collapse',
    name: 'collapse',
    component: () => import('../views/collapse.vue')
  },
  {
    path: '/xywui',
    name: 'xywui',
    component: () => import('../views/xywuiTest.vue')
  },
  {
    path: '/zoom',
    name: 'zoom',
    component: () => import('../views/zoom.vue')
  },
  {
    path: '/test',
    name: 'test',
    component: () => import('../views/test.vue')
  },
  {
    path: '/list',
    name: 'list',
    component: () => import('../views/list.vue')
  },
  {
    path: '/datepicker',
    name: 'datepicker',
    component: () => import('../views/datepicker.vue')
  },
  {
    path: '/fileUpload',
    name: 'fileUpload',
    component: () => import('../views/fileUpload.vue')
  }
]

// 创建 router 实例，然后传 `routes` 配置
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  // (缩写) 相当于 routes: routes
  routes
})

export default router
