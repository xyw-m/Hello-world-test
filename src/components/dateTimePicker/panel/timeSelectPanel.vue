<template>
  <transition name="el-zoom-in-top">
    <div
      ref="popper"
      v-show="visible"
      class="timeSelect-panel">
      <el-scrollbar 
        noresize 
        wrap-class="el-picker-panel__content"
        wrap-style="max-height: inherit;"
        view-class="timeSelect-div">
        <div 
          class="time-select-item"
          v-for="item in items"
          :class="{'active': value === item.value, 'disabled': item.disabled}"
          :key="item.value"
          @click="handleClick(item)">{{ item.value }}
        </div>
      </el-scrollbar>
    </div>
  </transition>
</template>
<script>
import scrollIntoView from 'element-ui/src/utils/scroll-into-view'
const parseTime = function(time){
  const values = (time || '').split(':')
  if(values.length >= 2){
    const hours = parseInt(values[0], 10)
    const minutes = parseInt(values[1], 10)
    return {
      hours,
      minutes
    }
  }
  return null
}


const compareTime = function(time1, time2){
  const value1 = parseTime(time1)
  const value2 = parseTime(time2)

  const minutes1 = value1.minutes + value1.hours * 60
  const minutes2 = value2.minutes + value2.hours * 60

  if(minutes1 === minutes2){
    return 0
  }

  return minutes1 > minutes2 ? 1 : -1
}

const nextTime = function(time, step){
  const timeValue = parseTime(time)
  const stepValue = parseTime(step)

  const next = {
    hours: timeValue.hours,
    minutes: timeValue.minutes
  }

  next.minutes += stepValue.minutes
  next.hours += stepValue.hours

  next.hours += Math.floor(next.minutes / 60)
  next.minutes = next.minutes % 60;

  return formatTime(next)
}

const formatTime = function(time){
  return (time.hours < 10 ? '0' + time.hours : time.hours) + ':' + (time.minutes < 10 ? '0' + time.minutes : time.minutes)
}

export default {
  data(){
    return {
      start: '00:00',
      end: '23:00',
      step: '00:30',
      value: '',
      defaultValue: '',
      visible: false,
      minTime: '',
      maxTime: '',
      width: 0
    }
  },

  props: {
    showSeconds: {
      type: Boolean,
      default: true
    }
  },

  watch: {
    value(val){
      if(!val) return
      this.$nextTick(() => this.scrollToOption())
    }
  },

  computed: {
    items(){
      const start = this.start
      const end = this.end
      const step = this.step

      const result = []

      if(start && end && step){
        let current = start
        while(compareTime(current, end) <= 0){
          result.push({
            value: this.showSeconds ? current + ':00' : current,
            disabled: compareTime(current, this.minTime || '-1:-1') <= 0 ||
                        compareTime(current, this.maxTime || '100:100') >= 0
          })
          current = nextTime(current, step)
        }
      }
      return result
    }
  },

  methods: {
    scrollToOption(selector = '.selected'){
      const menu = this.$refs.popper.querySelector('.el-picker-panel__content')
      scrollIntoView(menu, menu.querySelector(selector))
    },
    handleClick(item){
      if(!item.disabled){
        this.$emit('pick', item.value)
      }
    },
    handleClear(){
      this.$emit('pick', null)
    },
    isValidValue(date){
      return this.items.filter(item => !item.disabled).map(item => item.value).indexOf(date) !== -1;
    }
  }
}
</script>
<style lang="scss" scoped>
.timeSelect-panel {
  width: 256px;
  z-index: 200001;
  background: #FFFFFF;
  box-shadow: 0px 4px 10px 0px rgba(0,0,0,0.2);
  border-radius: 3px;
  border: 1px solid #E1E1E1;
  position: absolute;
  margin-top: 4px;

  ::v-deep .timeSelect-div {
    max-height: 220px;
  }

  .time-select-item {
    text-align: left;
    &:hover {
      color: #0A7CFF;
    }
  }

  .active {
    font-weight: bold;
    color: #0A7CFF;
    &::after {
      content: '';
      position: absolute;
      width: 7px;
      height: 14px;
      border: 2px solid #0A7CFF;
      border-left: 0;
      border-top: 0;
      transform: rotate(45deg) scaleY(1);
      left: 90%;
    }
  }
}
</style>