<template>
  <div>
    父子应用通信
    <el-button @click="sendMessage">给子应用发送消息</el-button>
    <el-button @click="consoleState">当前全局状态</el-button>
    <component :is="childCom"></component>
    <el-divider></el-divider>
    <div
      style="
        width: 100px;
        height: 100px;
        background-color: red;
        margin-left: 50px;
      "
    ></div>
  </div>
</template>
<script>
import actions from '@/action.js';
// import workflow from './test.vue'
export default {
  data() {
    return {
      state: null,
      // childCom: workflow
    };
  },
  methods: {
    sendMessage() {
      actions.setGlobalState({
        component: {
          path: 'temp.vue',
        },
      });
    },
    consoleState() {
      console.log(actions);
    },
    mounted() {
      actions.onGlobalStateChange((state, prevState) => {
        this.childCom = state.component.com;
      });
    },
  },
};
</script>
