<template>
  <div class="time-spinner">
    <!-- hours -->
    <el-scrollbar
      tag="ul"
      ref="hours"
      class="timeSpinner-wrapper wrapper-hours"
      wrap-style="max-height: inherit;"
      view-class="timeSpinner-ul"
      @mousemove.native="adjustCurrentSpinner('hours')">
      <li
        v-for="(disabled, hour) in hoursList"
        :key="hour"
        class="timeSpinner-item"
        :class="{'active': hour === hours}">{{ ('0' + hour).slice(-2) }}
      </li>
    </el-scrollbar>
    <!-- minutes -->
    <el-scrollbar
      tag="ul"
      ref="minutes"
      class="timeSpinner-wrapper wrapper-minutes"
      wrap-style="max-height: inherit;"
      view-class="timeSpinner-ul timeSpinner-minutes"
      @mousemove.native="adjustCurrentSpinner('minutes')">
      <li
        v-for="(enabled, key) in minutesList"
        :key="key"
        class="timeSpinner-item"
        :class="{ 'active': key === minutes }">{{ ('0' + key).slice(-2) }}</li>
    </el-scrollbar>
    <!-- seconds -->
    <el-scrollbar
      tag="ul"
      ref="seconds"
      class="timeSpinner-wrapper timeSpinner-seconds"
      wrap-style="max-height: inherit;"
      view-class="timeSpinner-ul"
      v-show="showSeconds"
      @mousemove.native="adjustCurrentSpinner('seconds')">
      <li
        v-for="(second, key) in 60"
        :key="key"
        class="timeSpinner-item"
        :class="{ 'active': key === seconds }">{{ ('0' + key).slice(-2) }}</li>
    </el-scrollbar>
  </div>
</template>
<script>
import { getRangeHours, getRangeMinutes, modifyTime } from '../utils/date-util'
export default {
  data(){
    return {
      selectableRange: [],
      currentScrollbar: null
    }
  },

  props: {
    date: {},
    showSeconds: {
      type: Boolean,
      default: true
    }
  },

  computed: {
    hours(){
      return this.date.getHours()
    },
    minutes(){
      return this.date.getMinutes()
    },
    seconds(){
      return this.date.getSeconds()
    },
    hoursList(){
      return getRangeHours(this.selectableRange)
    },
    minutesList(){
      return getRangeMinutes(this.selectableRange, this.hours)
    }
  },

  methods: {
    adjustSpinners(){
      this.adjustSpinner('hours', this.hours)
      this.adjustSpinner('minutes', this.minutes)
      this.adjustSpinner('seconds', this.seconds)
    },
    adjustSpinner(type, value){
      const el = this.$refs[type].wrap
      if(el){
        el.scrollTop = Math.max(0, value * this.typeItemHeight(type))
      }
    },
    adjustCurrentSpinner(type){
      this.adjustSpinner(type, this[type])
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
      bindFunction('hours')
      bindFunction('minutes')
      bindFunction('seconds')
    },
    handleScroll(type){
      // console.log(this.$refs[type], 'type')
      const value = Math.min(Math.round((this.$refs[type].wrap.scrollTop - (this.scrollBarHeight(type) * 0.5 - 10) / this.typeItemHeight(type) + 3) / this.typeItemHeight(type)), (type === 'hours' ? 23 : 59));
      this.modifyDateField(type, value)
    },   
    modifyDateField(type, value){
      switch(type){
        case 'hours':
          this.$emit('change', modifyTime(this.date, value, this.minutes, this.seconds))
          break
        case 'minutes':
          this.$emit('change', modifyTime(this.date, this.hours, value, this.seconds))
          break
        case 'seconds':
          this.$emit('change', modifyTime(this.date, this.hours, this.minutes, value))
          break
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
  }
}
</script>
<style lang="scss" scoped>
.time-spinner {
  width: 216px;
  border-radius: 2px;
  border: 1px solid #E1E1E1;
  padding: 0 16px;
  .timeSpinner-wrapper{
    width: 33%;
    max-height: 240px;
    display: inline-block;
    &::before {
      content: '';
      background-color: #E6F1FF;
      position: absolute;
      border-top: 16px solid #E6F1FF;
      border-bottom: 16px solid #E6F1FF;
      border-left: 18px solid #E6F1FF;
      border-right: 18px solid #E6F1FF;
      border-radius: 3px;
      z-index: -1;
      left: 9px;
      top: 43%;
    }
  }

  .wrapper-hours, .wrapper-minutes {
    &::after {
      content: ':';
      color: #0A7CFF;
      position: absolute;
      z-index: -1;
      top: 46%;
      left: 55px;
      font-weight: bold;
      font-size: 10px;
    }
  }

  ::v-deep .timeSpinner-ul {
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

  .timeSpinner-item {
    line-height: 32px;
    font-size: 14px;
    color: #222222;
    margin-bottom: 1px;
    margin: 0 16px 0 8px;
    border-radius: 3px;
    cursor: pointer;
  }

  .timeSpinner-seconds {
    margin-right: 0;
  }

  .active {
    color: #0A7CFF;
    // background-color: #E6F1FF;
    font-weight: bold;
  }
}
</style>