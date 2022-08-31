<template>
  <div class="date-spinner">
    <!-- years -->
    <el-scrollbar
      tag="ul"
      ref="years"
      class="dateSpinner-wrapper warpper-years"
      wrap-style="max-height: inherit;"
      view-class="dateSpinner-ul"
      @mousemove.native="adjustCurrentSpinner('years')">
      <li
        v-for="(disabled, index) in yearsList"
        :key="index"
        class="dateSpinner-item"
        :class="{'active': yearsLabel[index] === years, 'disabled': disabled}"
        @click="handleClick('years', { value: index, disabled: disabled})">{{yearsLabel[index]}}</li>
    </el-scrollbar>
    <!-- months -->
    <el-scrollbar
      tag="ul"
      ref="months"
      class="dateSpinner-wrapper wrapper-months"
      wrap-style="max-height: inherit;"
      view-class="dateSpinner-ul"
      @mousemove.native="adjustCurrentSpinner('months')">
      <li
        v-for="(disabled, month) in monthsList"
        :key="month"
        class="dateSpinner-item"
        :class="{'active': month === months, 'disabled': disabled}"
        @click="handleClick('months', { value: month, disabled: disabled })">{{ ('0' + (month + 1)).slice(-2) }}</li>
    </el-scrollbar>
    <el-scrollbar
      tag="ul"
      ref="days"
      class="dateSpinner-wrapper wrapper-days"
      wrap-style="max-height: inherit;"
      view-class="dateSpinner-ul"
      @mousemove.native="adjustCurrentSpinner('days')">
      <li
        v-for="(disabled, day) in daysList"
        :key="day"
        class="dateSpinner-item"
        :class="{'active': (day + 1)  === days, 'disabled': disabled}"
        @click="handleClick('days', { value: day + 1, disabled: false })">{{ ('0' + (day + 1)).slice(-2) }}</li>
    </el-scrollbar>
  </div>
</template>
<script>
import { getRangeYears, getRangeMonths, getRangeDays, modifyDate } from '../utils/date-util.js'
export default {
  date(){
    return {
      selectableRange: [],
      yearsLabel: []
    }
  },

  props: {
    date: {}
  },

  watch: {
    years: {
      deep: true,
      handler(val){
        const before = Math.abs(val - this.yearsLabel[0])
        const after = Math.abs(val - this.yearsLabel[this.yearsLabel.length - 1])
        if(before < 5 || after < 5){
          this.yearsLabel = getRangeYears(this.yearsLabel, this.date, this.selectableRange).yearsLabel
          this.$nextTick(() => {
            this.adjustSpinner('years', this.yearsLabel.indexOf(this.years))
          })
        }
      }
    }
  },

  computed: {
    years(){
      return this.date.getFullYear()
    },
    months(){
      return this.date.getMonth()
    },
    days(){
      return this.date.getDate()
    },
    yearsList(){
      return getRangeYears(this.yearsLabel, this.date, this.selectableRange).yearsList
    },
    monthsList(){
      return getRangeMonths(this.date, this.selectableRange)
    },
    daysList(){
      return getRangeDays(this.date, this.selectableRange)
    }
  },

  methods: {
    adjustSpinners(){
      this.adjustSpinner('years', this.yearsLabel.indexOf(this.years))
      this.adjustSpinner('months', this.months)
      this.adjustSpinner('days', this.days)
    },
    adjustSpinner(type, value){
      const el = this.$refs[type].wrap
      if(el){
        if(type === 'days'){
          value--
        }
        el.scrollTop = Math.max(0, value * this.typeItemHeight(type))
      }
    },
    adjustCurrentSpinner(type){
      let value = this[type]
      if(type === 'years'){
        value = this.yearsLabel.indexOf(this.years)
      }
      this.adjustSpinner(type, value)
    },
    typeItemHeight(type){
      return this.$refs[type].$el.querySelector('li').offsetHeight
    },
    scrollBarHeight(type){
      return this.$refs[type].$el.offsetHeight
    },
    bindScrollEvent(){
      const bindFunction = (type) => {
        this.$refs[type].wrap.onscroll = (e) => {
          this.handleScroll(type, e)
        }
      }
      bindFunction('years')
      bindFunction('months')
      bindFunction('days')
    },
    handleScroll(type){
      let max
      switch(type){
        case 'years':
          max = 10000
          break
        case 'months':
          max = 11
          break;
        case 'days':
          max = 31
          break
      }
      let value = Math.min(Math.round((this.$refs[type].wrap.scrollTop - (this.scrollBarHeight(type) * 0.5 - 10) / this.typeItemHeight(type) + 3) / this.typeItemHeight(type)), max);
      if(type === 'days'){
        value ++
      }
      
      this.modifyDateField(type, value)
    },
    handleClick(type, { value, disabled }){
      if(!disabled){
        this.modifyDateField(type, value)
        this.emitSelectRange(type)
        this.adjustSpinner(type, value)
      }
    },
    modifyDateField(type, value){
      switch(type){
        case 'years':
          this.$emit('change', modifyDate(this.date, this.yearsLabel[value], this.months, this.days))
          break
        case 'months':
          this.$emit('change', modifyDate(this.date, this.years, value, this.days))
          break
        case 'days':
          this.$emit('change', modifyDate(this.date, this.years, this.months, value))
      }
    },
    emitSelectRange(type){
      if(type === 'hours'){
        this.$emit('select-range', 0, 2)
      } else if(type === 'minutes'){
        this.$emit('select-range', 3, 5)
      } else if(type === 'seconds'){
        this.$emit('select-range', 6, 8)
      }
      this.currentScrollbar = type
    }
  },

  mounted(){
    this.$nextTick(() => {
      this.bindScrollEvent()
      
    })
  },

  created(){
    this.yearsLabel = getRangeYears([], this.date, this.selectableRange).yearsLabel
  }
}
</script>
<style lang="scss" scoped>
.date-spinner {
  width: 216px;
  border-radius: 2px;
  border: 1px solid #E1E1E1;
  padding: 0 16px;
  .dateSpinner-wrapper {
    width: 33%;
    max-height: 240px;
    display: inline-block;
    &::before {
      content: '';
      background-color: #E6F1FF;
      position: absolute;
      border-top: 16px solid #E6F1FF;
      border-bottom: 16px solid #E6F1FF;
      border-left: 22px solid #E6F1FF;
      border-right: 22px solid #E6F1FF;
      border-radius: 3px;
      z-index: -1;
      left: 5px;
      top: 43%;
    }
  }

  .warpper-years, .wrapper-months {
    &::after {
      content: '/';
      color: #0A7CFF;
      position: absolute;
      z-index: -1;
      top: 46%;
      left: 55px;
      font-weight: bold;
      font-size: 10px;
    } 
  }

  ::v-deep .dateSpinner-ul {
    list-style: none;
    padding-inline-start: 0;
    text-align: center;
    &::before, &::after {
      content: '';
      display: block;
      width: 100%;
      height: 96px;
    }
  }

  .dateSpinner-item {
    line-height: 32px;
    font-size: 14px;
    color: #222222;
    margin-bottom: 1px;
    margin: 0 16px 0 8px;
    border-radius: 3px;
    cursor: pointer;
  }

  .warpper-days {
    margin-right: 0;
  }

  .active {
    color: #0A7CFF;
    // background-color: #E6F1FF;
    font-weight: bold;
  }

  .disabled {
    color: #999999;
    cursor: not-allowed;
  }

}
</style>