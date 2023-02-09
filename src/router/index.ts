import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Home from '../views/Home.vue';
import Test from '../views/Test.vue';
import customMenu from '@/menuConfig/config.json';
import { FormItem } from 'element-ui';

// 如果在一个模块化工程中使用它，必须要通过 Vue.use() 明确地安装路由功能：
Vue.use(VueRouter);

// 添加侧边菜单路由
const sidebarMenu: any = [];
const appendRoute = function (arr: any[]) {
  arr.forEach((config) => {
    if (config.path) {
      sidebarMenu.push({
        path: config.path,
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        component: require(`../views/${config.module}.vue`).default,
      });
    } else if (config.groups) {
      appendRoute(config.groups);
    }
  });
};

appendRoute(customMenu);
// 定义路由，每个路由应该对应一个组件
const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  ...sidebarMenu,
];

// 创建 router 实例，然后传 `routes` 配置
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  // (缩写) 相当于 routes: routes
  routes,
});

export default router;
