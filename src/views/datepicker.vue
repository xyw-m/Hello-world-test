<template>
  <div class="datePicker">
    <el-date-picker v-model="value1" type="date" placeholder="选择日期"></el-date-picker>
    <!-- <el-time-picker
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
    ></el-time-picker> -->
    <!---------------------divider---------------------->
    <el-divider></el-divider>
    <div class="haveDone">
      <date-picker
        v-model="dateValue"
        @change="dateChange"></date-picker>
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
import datePicker from '@/components/dateTimePicker/picker/date-picker.js'
@Component({
  name: 'datePickerView',
  components: { timePicker, datePicker }
})
export default class datePickerView extends Vue {
  value1 = ''
  value2 = ''
  diyValue1 = ''
  diyValue2 = ''
  dateValue = ''

  timeChange(){
    console.log(this.diyValue1, 'diyValue')
  }
  
  mounted(){
    console.log(this.$refs)
  }

  handleChange(){
    console.log(this.$refs['el-time-picker'])
  }

  dateChange(){
    console.log(this.dateValue, 'dateValue')
  }
}
</script>
<style lang="scss" scoped>
.haveDone {
  margin: 0 40px;
  display: inline-block;
}
</style>