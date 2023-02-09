import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'github-markdown-css/github-markdown.css';
import '../setting.js';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import xywui from 'xyw-ui';
import { registerMicroApps, start } from 'qiankun';
import './directives/index';
import actions from './action.js';

// 消息提示的环境配置，设置为FALSE时不会显示开发模式中的一些警告信息
Vue.config.productionTip = false;

Vue.use(ElementUI);
Vue.use(Antd);
Vue.use(xywui);

registerMicroApps([
  {
    name: 'store-app',
    entry: '//localhost:1010',
    container: '#child-container',
    activeRule: '/store-app',
    props: { actions, msg: 'w' }, // 向子应用传递创建的全局状态
  },
]);

// 启动qiankun
start();

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
