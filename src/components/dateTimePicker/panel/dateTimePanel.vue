<template>
  <transition name="el-zoom-in-toop">
    <div
      v-show="visible"
      class="dateTime-panel">
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
      <!-- time -->
      <div class="panel-item">
        <div class="header-wrapper">
          <ul class="panel-header">
            <li>时</li>
            <li>分</li>
            <li>秒</li>
          </ul>
        </div>
        <time-spinner
          ref="timeSpinner"
          :date="date"
          :showSeconds="showSeconds"
          @change="handleChange"></time-spinner>
      </div>
      <div class="panel-footer">
        <el-button size="mini" @click="handleCancel">取消</el-button>
        <el-button size="mini" type="primary" @click="handleConfirm()">确认</el-button>
      </div>
    </div>
  </transition>
</template>
<script>
import timeSpinner from '../basic/time-spinner.vue'
import dateSpinner from '../basic/date-spinner.vue'
import { clearMilliseconds,  limitTimeRange,  timeWithinRange} from '../utils/date-util.js'
export default {
  components: { dateSpinner, timeSpinner },

  data(){
    return {
      date: new Date(),
      value: '',
      oldValue: new Date(),
      format: 'yyyy-MM-dd HH:mm:ss',
      visible: false,
      defaultValue: null,
      selectableRange: []
    }
  },

  watch: {
    visible(val){
      if(val){
        this.oldValue = this.value
      }
    },
    value(newVal){
      let date;
      if(newVal instanceof Date){
        date = limitTimeRange(newVal, this.selectableRange, this.format)
      } else if(!newVal){
        date = this.defaultValue ? new Date(this.defaultValue) : new Date()
      }
      this.date = date
      if(this.visible){
        this.$nextTick(_ => this.adjustSpinners())
      }
    }
  },

  computed: {
    showSeconds(){
      return (this.format || '').indexOf('ss') !== -1
    }
  },

  methods: {
    adjustSpinners(){
      this.$refs.dateSpinner.adjustSpinners()
      this.$refs.timeSpinner.adjustSpinners()
    },
    handleChange(date){
      this.date = clearMilliseconds(date)
      if(this.isValidValue(this.date)){
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
    isValidValue(date){
      return timeWithinRange(date, this.selectableRange) 
    }
  }

}
</script>
<style lang="scss" scoped>
.dateTime-panel {
  width: 474px;
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
    width: 432px;
    text-align: right;
    margin-top: 12px;

    button {
      width: 44px;
      padding: 7px ;
    }
  }
}
</style>