<template>
  <div class="datePicker">
    测试ElementUI dataPicker
    <el-time-picker
      v-model="value"
      placeholder="任意时间点"
      ref="el-time-picker"></el-time-picker>
    <div class="self-picker">
      自定义组件
      <picker type="week"></picker>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import picker from '@/components/dateTimePicker/picker.vue'
@Component({
  name: 'datePicker',
  components: {picker}
})
export default class datePicker extends Vue {
  value = ''
  mounted(){
    console.log(this.$refs)
  }
}
</script>