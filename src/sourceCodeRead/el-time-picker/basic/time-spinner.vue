<template>
  <div class="el-time-spinner" :class="{ 'has-seconds': showSeconds }">
    <template v-if="!arrowControl">
      <!-- noresize：容器大小是否是不可变的-->
      <!-- hours 列-->
      <el-scrollbar
        ref="hours"
        tag="ul"
        class="el-time-spinner__wrapper"
        wrap-style="max-height: inherit;"
        view-class="el-time-spinner__list"
        noresize>
        <li
          v-for="(disabled,hour) in hoursList"
          :key="hour"
          :class="{ 'active': hour === hours, 'disabled': disabled }"
          class="el-time-spinner__item"
          @click="handleClick('hours', { value: hour, disabled: disabled })">
          {{ ('0' + (amPmMode ? (hour % 12 || 12) : hour )).slice(-2) }}{{ amPm(hour) }}
        </li>
      </el-scrollbar>
      <!-- minutes 列-->
      <el-scrollbar
        ref="minutes"
        tag="ul"
        class="el-time-spinner__wrapper"
        wrap-style="max-height: inherit;"
        view-class="el-time-spinner__list"
        noresize>
        <li
          v-for="(enabled, key) in minutesList"
          :key="key"
          :class="{ 'active': key === minutes, disabled: !enabled }"
          class="el-time-spinner__item"
          @click="handleClick('minutes', { value: key, disabled: false })">
          {{ ('0' + key).slice(-2) }}
        </li>
      </el-scrollbar>
      <!-- seconds 列-->
      <el-scrollbar
        ref="seconds"
        tag="ul"
        v-show="showSeconds"
        class="el-time-spinner__wrapper"
        wrap-style="max-height: inherit;"
        view-class="el-time-spinner__list"
        noresize>
        <li
          v-for="(second, key) in 60"
          :key="key"
          :class="{ 'active': key === seconds }"
          class="el-time-spinner__item"
          @click="handleClick('seconds', { value: key, disabled: false })">
          {{ ('0' + key).slice(-2) }}
        </li>
      </el-scrollbar>
    </template>
  </div>
</template>
<script>
export default {
  data(){
    return {
      selectableRange: [],
      currentScrollbar: null
    }
  },
  props: {
    showSeconds: {  // timePanel的计算属性
      type: Boolean,
      default: true
    },
    arrowControl: Boolean, // time-picker的属性，暴露给用户
    date: {},
    defaultValue: {}, // reserved for future use
  },
  computed: {
    hoursList(){
      return getRangeHours(this.selectableRange)
    },
    minutesList(){
      return getRangeMinutes(this.selectableRange, this.hours)
    }
  },
  methods: {
    handleClick(type, { value, disabled }){
      if(!disabled){
        this.modifyDateField(type, value)
        this.emitSelectRange(type)
        this.adjustSpinner(type, value)
      }
    },
    modifyDateField(type, value){
      switch(type){
        case 'hours': this.$emit('change', modifyTime(this.date, value, this.minutes, this.seconds)); break;
        case 'minutes': this.$emit('change', modifyTime(this.date, this.hours, value, this.seconds)); break;
        case 'seconds': this.$emit('change', modifyTime(this.date, this.hours, this.minutes, value)); break;
      }
    },
    emitSelectRange(type){
      if(type === 'hours'){
        this.$emit('select-range', 0, 2)
      } else if(type === 'minutes'){
        this.$emit('select-range', 3, 5)
      } else if (type === 'seconds'){
        this.$emit('select-range', 6, 8)
      }
      this.currentScrollbar = type
    }
  }
}
</script>