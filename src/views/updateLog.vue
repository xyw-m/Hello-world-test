<template>
  <div>
    更新日志
    <el-button @click="handleClick">click</el-button>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import obj from './temp.js'
@Component({
  name: 'updateLog'
})
export default class updateLog extends Vue {

  handleClick(){
    obj.testFunc()
  }
}
</script>