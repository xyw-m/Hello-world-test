<template>
  <transition name="el-zoom-in-toop">
    <div
      v-show="visible"
      class="dateTimeSelect-panel">
      <!-- date -->
      <div class="panel-item">
        <div class="header-wrapper">
          <ul class="panel-header">
            <li>年</li>
            <li>月</li>
            <li>日</li>
          </ul>
        </div>
        <date-spinner
          ref="dateSpinner"
          :date="date"
          @change="handleChange"></date-spinner>
      </div>
      <!-- time select -->
      <div class="panel-item">
        <div class="select-header-wrapper">
          <ul class="panel-header">
            <li>时间</li>
          </ul>
        </div>
        <time-select-spinner
          ref="timeSelectSpinner"
          :date="date"
          @change="handleChange"
          :interval="interval"></time-select-spinner>
      </div>
      <div class="panel-footer">
        <el-button size="mini" @click="handleCancel">取消</el-button>
        <el-button size="mini" type="primary" @click="handleConfirm()">确认</el-button>
      </div>
    </div>
  </transition>
</template>
<script>
import { limitTimeRange, modifyTime, timeWithinRange } from '../utils/date-util'
import dateSpinner from '../basic/date-spinner.vue'
import timeSelectSpinner from '../basic/time-select-spinner.vue'
export default {
  components: { dateSpinner, timeSelectSpinner },

  data(){
    return {
      date: modifyTime(new Date(), 0, 0, 0),
      value: '',
      format: 'yyyy-MM-dd HH:mm:ss',
      oldValue: modifyTime(new Date(), 0, 0, 0),
      visible: false,
      defaultValue: null,
      interval: {
        start: '00:00',
        end: '23:30',
        step: '00:30'
      }
    }
  },

  watch: {
    visible(val){
      if(val){
        this.oldValue = this.value
      }
    },
    value(newVal){
      let date
      if(newVal instanceof Date){
        date = limitTimeRange(newVal , [], this.format)
      } else if(!newVal){
        date = this.defaultValue ? new Date(this.defaultValue) : new Date()
        date = modifyTime(date, 0, 0, 0)
      }
      this.date = date
      if(this.visible){
        this.$nextTick(_ => this.adjustSpinners())
      }
    }
  },

  props: {

  },

  methods: {
    adjustSpinners(){
      this.$refs.dateSpinner.adjustSpinners()
      this.$refs.timeSelectSpinner.adjustCurrentSpinner()
    },
    handleChange(date){
      this.date = date
      const step = parseInt(this.interval.step.split(':')[1])
      if(this.isValidValue(this.date)){
        this.$refs.timeSelectSpinner.selectableRange = [modifyTime(this.date, 0, 0, 0), modifyTime(this.date, 23, step, 0)]
        this.$emit('pick', this.date, true)
      }
    },
    handleCancel(){
      this.$emit('pick', this.oldValue, false)
    },
    handleConfirm(visible = false){
      if(this.isValidValue(this.date)){
        this.$emit('pick', this.date, visible)
      } else {
        this.handleCancel()
      }
    },
    isValidValue(value){
      return timeWithinRange(value, [])
    }
  }
}
</script>
<style lang="scss" scoped>
.dateTimeSelect-panel {
  width: 372px;
  background: #FFFFFF;
  box-shadow: 0px 4px 10px 0px rgba(0,0,0,0.2);
  border-radius: 3px;
  border: 1px solid #E1E1E1;
  padding: 16px 20px;
  margin-top: 4px;
  z-index: 20001;
  position: absolute;

  .header-wrapper {
    width: 216px;
  }

  .select-header-wrapper {
    width: 113px;
  }

  .panel-header {
    height: 30px;
    background-color: #F8F8F8;
    border-top-left-radius: 2px;
    border-top-right-radius: 2px;
    border: 1px solid #E1E1E1;
    border-bottom: none;
    list-style: none;
    padding-inline-start: 0;
    padding: 0 16px;
    margin-bottom: 0;
    line-height: 2;

    li {
      width: 33%;
      display: inline-block;
      text-align: center;
      font-size: 12px;
      font-family: 'MicrosoftYaHei';
      color: #222222;
      line-height: 30px;
      margin-left: -1px;
    }
  }

  .panel-item {
    display: inline-block;
  }

  .panel-footer {
    width: 329px;
    text-align: right;
    margin-top: 12px;

    button {
      width: 44px;
      padding: 7px ;
    }
  }
}
</style>