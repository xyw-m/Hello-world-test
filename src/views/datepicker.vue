<template>
  <div class="datePicker">
    测试ElementUI dataPicker
    <el-time-picker
      v-model="value"
      placeholder="任意时间点"
      ref="el-time-picker"></el-time-picker>
      <el-divider></el-divider>
    <div class="self-picker">
      <h4>time picker</h4>
      <time-picker
        v-model="diyValue"></time-picker>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import timePicker from '@/components/dateTimePicker/picker/time-picker.js'
@Component({
  name: 'datePicker',
  components: { timePicker }
})
export default class datePicker extends Vue {
  value = ''
  diyValue = ''
  
  mounted(){
    console.log(this.$refs)
  }
}
</script>