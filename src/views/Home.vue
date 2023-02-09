<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/> -->
    <el-button @click="handleClick">switch name</el-button>
    <p v-for="item in dealData" :key="item.prop">
      <span v-if="!item.hide">{{ item.prop }}</span>
    </p>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src

@Component({
  components: {
    HelloWorld,
  },
})
export default class Home extends Vue {
  tableData = [
    { show: true, hide: false, prop: 'name' },
    { show: false, hide: false, prop: 'gender' },
  ];

  handleClick() {
    this.tableData[0].hide = !this.tableData[0].hide;
  }

  get dealData() {
    const arr: any = [];
    this.tableData.forEach((ele: any) => {
      if (!ele.hide) {
        arr.push(ele);
      }
    });
    console.log(arr, 'arr');
    return arr;
  }
}
</script>
