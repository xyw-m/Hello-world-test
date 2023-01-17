<template>
  <div>
    <h1>同一个页面多次使用重复组件</h1>
    <temp message="one"></temp>
    <temp message="two"></temp>
    <temp message="three"></temp>
    <temp message="four" ref="temp"></temp>
    <el-button @click="handleClick">打印resData</el-button>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import temp from '@/components/temp/index.vue'
@Component({
  name: 'repeatComponent',
  components: { temp }
})
export default class repeatComponent extends Vue {
  handleClick(){
    (this as any).$refs.temp.getResData()
  }

  /* tslint:disable */
  created(){
    console.log('just a test for eslint check')
  }
}
</script>