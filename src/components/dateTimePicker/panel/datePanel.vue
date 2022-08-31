<template>
  <transition name="el-zoom-in-toop">
    <div
      v-show="visible"
      class="date-panel">
      <div class="header-wrapper">
        <ul class="datePanel-header">
          <li>年</li>
          <li>月</li>
          <li>日</li>
        </ul>
      </div>
      <date-spinner
        ref="spinner"
        :date="date"
        @change="handleChange">
      </date-spinner>
      <div class="panel-footer">
        <el-button size="mini" @click="handleCancel">取消</el-button>
        <el-button size="mini" type="primary" @click="handleConfirm()" :disabled="!isValidValue(this.date)">确认</el-button>
      </div>
    </div>
  </transition>
</template>
<script>
import dateSpinner from '../basic/date-spinner.vue'
import { clearMilliseconds, limitTimeRange, timeWithinRange } from '../utils/date-util'
export default {
  components: { dateSpinner },

  data(){
    return {
      date: new Date(),
      format: 'yyyy/MM/dd',
      defaultValue: null,
      selectableRange: [],
      selectionRange: [0, 2],
      value: '',
      oldValue: new Date(),
      needInitAdjust: true
    }
  },

  props: {
    visible:Boolean
  },

  watch: {
    visible(val){
      if(val){
        this.oldValue = this.value
        this.$nextTick(() => this.$refs.spinner.emitSelectRange('years'))
      } else {
        this.needInitAdjust = true
      }
    },
    value(newVal){
      let date
      if(newVal instanceof Date){
        if(this.isValidValue(newVal)){
          date = newVal
        } else {
          date = this.selectableRange[0]
        }
      } else if(!newVal) {
        date = this.defaultValue ? new Date(this.defaultValue) : new Date()
      }
      this.date = date
      if(this.visible && this.needInitAdjust){
        this.$nextTick(_ => this.adjustSpinners())
        this.needInitAdjust = false
      }
    }
  },

  methods: {
    adjustSpinners(){
      return this.$refs.spinner.adjustSpinners()
    },
    isValidValue(value) {
      const min = this.selectableRange[0] ? this.selectableRange[0].getTime() : Number.NEGATIVE_INFINITY
      const max = this.selectableRange[1] ? this.selectableRange[1].getTime() : Number.POSITIVE_INFINITY
      return value && !isNaN(value)  && new Date(value).getTime() >= min &&
            new Date(value).getTime() <= max
    },
    handleChange(date){
      if(this.visible){
        this.date = clearMilliseconds(date)
        this.$refs.spinner.selectableRange = this.selectableRange
        if(this.isValidValue(this.date)){
          this.$emit('pick', this.date, true)
        }
      }
    },
    handleCancel(){
      this.$emit('pick', this.oldValue, false)
    },
    handleConfirm(visible = false, first){
      if(first) return
      if(this.isValidValue(this.date)){
        this.$emit('pick', this.date, visible)
      } else {
        this.handleCancel()
      }
    },
    setSelectionRange(start, end){
      this.$emit('select-range', start, end)
      this.selectionRange = [start, end]
    }
  },
}
</script>
<style lang="scss" scoped>
.date-panel {
  width: 256px;
  background: #FFFFFF;
  box-shadow: 0px 4px 10px 0px rgba(0,0,0,0.2);
  border-radius: 3px;
  border: 1px solid #E1E1E1;
  padding: 17px 20px;
  margin-top: 4px;
  z-index: 20001;
  position: absolute;

  .header-wrapper {
    width: 216px;
  }

  .datePanel-header {
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

  .panel-footer {
    width: 216px;
    text-align: right;
    margin-top: 12px;

    button {
      width: 44px;
      padding: 7px ;
    }
  }
}
</style>