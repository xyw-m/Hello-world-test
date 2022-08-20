<template>
  <div class="datePicker">
    测试ElementUI dataPicker
    <el-time-picker
      v-model="value1"
      placeholder="任意时间点"
      ref="el-time-picker"
      @change="handleChange"
      is-range
      key="11"
      ></el-time-picker>
    <el-time-picker
      v-model="value2"
      placeholder="任意时间点"
      ref="el-time-picker"
      @change="handleChange"
      key="22"
    ></el-time-picker>
    <!---------------------divider---------------------->
    <el-divider></el-divider>
    <div class="haveDone">
      <h4>time picker</h4>
      <time-picker
        v-model="diyValue1"
        @change="timeChange"
        isRange
        key="range"></time-picker>
    </div>
    <div class="haveDone">
      <time-picker
        v-model="diyValue2"
        @change="timeChange"
        key="notRange"></time-picker>
    </div>
    <div>如果下边还有东西呢？会被覆盖吗？？</div>
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
  value1 = ''
  value2 = ''
  diyValue1 = ''
  diyValue2 = ''

  timeChange(){
    console.log(this.diyValue1, 'diyValue')
  }
  
  mounted(){
    console.log(this.$refs)
  }

  handleChange(){
    console.log(this.$refs['el-time-picker'])
  }
}
</script>
<style lang="scss" scoped>
.haveDone {
  margin: 0 40px;
  display: inline-block;
}
</style>