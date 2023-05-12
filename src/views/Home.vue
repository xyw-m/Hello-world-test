<template>
  <div class="home">
    <el-input v-model="music" placeholder="请输入music"></el-input>
    <child @dance="handleDance" :music="music"></child>
    <el-button @click="goWithEng">路由跳转-参数英文</el-button>
    <el-button @click="goWithChi">路由跳转-参数中文</el-button>
    <el-button @click="goWithEng(true)">子应用路由跳转-参数英文</el-button>
    <el-button @click="goWithChi(true)">子应用路由跳转-参数英文</el-button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src
import child from '@/components/child.vue';

@Component({
  components: {
    HelloWorld,
    child,
  },
})
export default class Home extends Vue {
  music = '';

  handleDance() {
    console.log('Look! grandson is dancing!');
  }

  goWithEng(flag: boolean) {
    const path = flag ? '/store-app/about' : '/updateLog';
    this.$router.push({
      path,
      query: { params: 'English params' },
    });
  }

  goWithChi(flag: boolean) {
    const path = flag ? '/store-app/about' : '/updateLog';
    this.$router.push({
      path,
      query: {
        params: encodeURIComponent(
          '任务中心配置实例(超级管理员 2023-05-04 14:13:42)s'
        ),
      },
    });
  }
}
</script>
