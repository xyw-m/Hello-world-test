<template>
  <transition name="el-zoom-in-top">
    <div
      v-show="visible"
      class="time-range-panel"
    >
      <!-- min time -->
      <div class="panel-item">
        <div class="header-wrapper">
          <ul class="timePanel-header">
            <li>时</li>
            <li>分</li>
            <li>秒</li>
          </ul>
        </div>
        <time-spinner
          ref="minSpinner"
          :date="minDate"
          :show-seconds="showSeconds"
          @change="handleMinChange"
          @select-range="setMinSelectionRange">
        </time-spinner>
      </div>
      <!-- <div class="panel-separator"><span >至</span></div> -->
      <!-- max time -->
      <div class="panel-item">
        <div class="header-wrapper">
          <ul class="timePanel-header">
            <li>时</li>
            <li>分</li>
            <li>秒</li>
          </ul>
        </div>
        <time-spinner
          ref="maxSpinner"
          :date="maxDate"
          :show-seconds="showSeconds"
          @change="handleMaxChange"
          @select-range="setMaxSelectionRange"></time-spinner>
      </div>
      <div class="panel-footer">
        <el-button size="mini" @click="handleCancel">取消</el-button>
        <el-button size="mini" type="primary" @click="handleConfirm()">确定</el-button>
      </div>
    </div>
  </transition>
</template>
<script>
import timeSpinner from '../basic/time-spinner.vue'
import { parseDate, modifyDate, clearMilliseconds, timeWithinRange, limitTimeRange } from '../utils/date-util.js'

const MIN_TIME = parseDate('00:00:00', 'HH:mm:ss')
const MAX_TIME = parseDate('23:59:59', 'HH:mm:ss')

const maxTimeOfDay = function(date){
  return modifyDate(MAX_TIME, date.getFullYear(), date.getMonth(), date.getDate())
}

const minTimeOfDay = function(date){
  return modifyDate(MIN_TIME, date.getFullYear(), date.getMonth(), date.getDate())
}

const advanceTime = function(date, amount){
  return new Date(Math.min(date.getTime() + amount, maxTimeOfDay(date).getTime()))
}

export default {
  components: { timeSpinner },
  data(){
    return {
      minDate: new Date(),
      maxDate: new Date(),
      value: [],
      oldValue: [new Date(), new Date()],
      format: 'HH:mm:ss',
      visible: false,
      selectionRange: [0, 2],
      defaultValue: null,
    }
  },

  computed: {
    showSeconds(){
      return (this.format || '').indexOf('ss') !== -1
    },
    offset(){
      return this.showSeconds ? 11 : 8
    }
  },

  watch: {
    value(value){
      if(Array.isArray(value)){
        this.minDate = new Date(value[0])
        this.maxDate = new Date(value[1])
      } else {
        if(Array.isArray(this.defaultValue)){
          this.minDate = new Date(this.defaultValue[0])
          this.maxDate = new Date(this.defaultValue[1])
        } else if(this.defaultValue){
          this.minDate = new Date(this.defaultValue)
          this.maxDate = advanceTime(new Date(this.defaultValue), 60 * 60 * 1000)
        } else {
          this.minDate = new Date()
          this.maxDate = advanceTime(new Date(), 60 * 60 * 1000)
        }
      }
    },
    visible(val){
      if(val){
        this.oldValue = this.value
        this.$nextTick(() => this.$refs.minSpinner.emitSelectRange('hours'))
      }
    }
  },

  methods: {
    adjustSpinners(){
      this.$refs.minSpinner.adjustSpinners()
      this.$refs.maxSpinner.adjustSpinners()
    },
    handleMinChange(date){
      this.minDate = clearMilliseconds(date)
      this.handleChange()
    },
    handleMaxChange(date){
      this.maxDate = clearMilliseconds(date)
      this.handleChange()
    },
    handleChange(){
      if(this.isValidValue([this.minDate, this.maxDate])){
        this.$refs.minSpinner.selectableRange = [[minTimeOfDay(this.minDate), this.maxDate]]
        this.$refs.maxSpinner.selectableRange = [[this.minDate, maxTimeOfDay(this.maxDate)]]
        this.$emit('pick', [this.minDate, this.maxDate], true)
      }
    },
    handleCancel(){
      this.$emit('pick', this.oldValue)
    },
    handleConfirm(visible = false){
      const minSelectableRange = this.$refs.minSpinner.selectableRange
      const maxSelectableRange = this.$refs.maxSpinner.selectableRange

      this.minDate = limitTimeRange(this.minDate, minSelectableRange, this.format)
      this.maxDate = limitTimeRange(this.maxDate, maxSelectableRange, this.format)

      this.$emit('pick', [this.minDate, this.maxDate], visible)

    },
    handleClear(){
      this.$emit('pick', null)
    },
    setMinSelectionRange(start, end){
      this.$emit('select-range', start, end, 'min')
      this.selectionRange = [start, end]
    },
    setMaxSelectionRange(start, end){
      this.$emit('select-range', start, end, 'max');
      this.selectionRange = [start + this.offset, end + this.offset]
    },
    isValidValue(date){
      return Array.isArray(date) && 
        timeWithinRange(this.minDate, this.$refs.minSpinner.selectableRange) &&
        timeWithinRange(this.maxDate, this.$refs.maxSpinner.selectableRange)
    }
  }
}
</script>
<style lang="scss" scoped>
.time-range-panel {
  width: 496px;
  background: #FFFFFF;
  box-shadow: 0px 4px 10px 0px rgba(0,0,0,0.2);
  border-radius: 3px;
  border: 1px solid #E1E1E1;
  margin-top: 4px;
  padding: 17px 20px;
  z-index: 20001;
  position: absolute;

  &::after {
    content: '至';
    color: #222222;
    font-size: 12px;
    position: absolute;
    top: 47%;
    left: 240px;
  }

  .header-wrapper {
    width: 216px;
  }

  .timePanel-header {
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
    }
  }

  .panel-item {
    display: inline-block;
    &:first-child {
      margin-right: 20px;
    }
  }

  .panel-footer {
    width: 454px;
    text-align: right;
    margin-top: 12px;

    button {
      width: 44px;
      padding: 7px ;
    }
  }
}
</style>