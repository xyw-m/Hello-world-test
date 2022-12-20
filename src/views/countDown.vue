<template>
  <div>
    <h3>倒计时</h3>
    <div class="countDown">
      <!-- 选择时间:
      <el-date-picker
        v-model="desiredDate"
        type="datetime"
        placeholder="选择日期时间"
        @change="handleDateChange"></el-date-picker>
      <span>{{ hours }}:</span>
      <span>{{ minutes }}: </span>
      <span>{{ seconds }}: </span> -->
      <div class="container">
        <div class="cell">{{ hours }}</div>
        <div class="cell">{{ minutes }}</div>
        <div class="cell">{{ seconds }}</div>
      </div>
    </div>
    <div>
      <h2>注意事项</h2>
      <p>getTime()返回毫秒数，1s=1000ms</p>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
@Component({
  name: 'countDown'
})
export default class countDown extends Vue {
  hours = ''
  minutes = ''
  seconds = ''
  timer = 0    // interval ID 唯一标识时间间隔
  desiredDate = new Date('2022/12/7')

  created(){
    this.timer = setInterval(() => {
      const duration = this.desiredDate.getTime() - new Date().getTime()
      const allMinutes = Math.floor(duration / 1000)
      const hours = Math.floor(allMinutes / 3600)
      const lastMinutes = Math.floor(allMinutes % 3600)
      const minutes = Math.floor(lastMinutes / 60)
      const seconds = lastMinutes % 60 

      // 格式化
      this.hours = this.timeFormatter(hours)
      this.minutes = this.timeFormatter(minutes)
      this.seconds = this.timeFormatter(seconds)
    }, 1000)
  }

  timeFormatter(time:number){
    return time >= 10 ? '' + time : '0' + time
  }

  handleDateChange(newDate:any){
    console.log(newDate, 'newDate')
  }
}
</script>
<style lang="scss" scoped>
.countDown {
  width: 500px;
  height: 500px;
  border: 1px solid green;
  text-align: center;
  vertical-align: middle;
  .container {
    margin: auto auto;
    .cell {
      width: 80px;
      height: 80px;
      border: 1px solid black;
      display: inline-block;
    }
  }
}
</style>