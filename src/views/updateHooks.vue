<template>
  <div :style="affixStyle">
    <p :style="affixStyle">111111111111111111</p>
    <el-button @click="changeStyle">更改Style</el-button>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

@Component({
  name: 'About',
})
export default class updateHooks extends Vue {
  affixStyle = {
    width: '200px',
    height: '300px',
    color: 'red',
  };
  flag = true;

  updated() {
    console.log('updated run');
  }

  changeStyle() {
    this.affixStyle.color = this.flag ? 'blue' : 'red';
    this.flag = !this.flag;
  }
}
</script>
<style lang="scss" scoped>
.bottom {
  width: 300px;
  height: 700px;
  border: 1px solid #d07373;
  overflow-y: auto;
}
</style>
