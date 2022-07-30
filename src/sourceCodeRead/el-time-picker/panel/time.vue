<template>
  <transition name="el-zoom-in-top">
    <div
      v-show="visible"
      class="el-time-panel el-popper"
      :class="popperClass">
      <div class="el-time-panel__content" :class="{ 'has-seconds': showSeconds }">
        <time-spinner
          ref="spinner"
          :date="date"
          :arrow-control="useArrow"
          :show-seconds="showSeconds"
          :am-pm-mode="amPmMode"
          @change="handleChange"
          @select-range="setSelectionRange"
          ></time-spinner>
      </div>
      <div class="el-time-panel__footer">
        <button
          type="button"
          class="el-time-panel__btn cancel"
          @click="handleCancel">{{ t('el.datepicker.cancel') }}
        </button>
        <button
          type="button"
          class="el-time-panel__btn"
          :class="{confirm: !disabled}"
          @click="handleConfirm()">{{ t('el.datepicker.confirm') }}></button>
      </div>
    </div>
  </transition>
</template>
<script>
import timeSpinner from '../basic/time-spinner.vue'
export default {
  data(){
    return {
      popperClass: '',
      format: 'HH:mm:ss',
      date: new Date(),
      arrowControl: false,
      selectionRange: [0, 2],
      oldValue: new Date()
    }
  },
  components: { timeSpinner },
  props: {
    visible: Boolean,
    timeArrowControl: Boolean
  },
  computed: {
    showSeconds(){
      return (this.format || '').indexOf('ss') !== -1
    },
    useArrow(){
      return this.arrowControl || this.timeArrowControl || false
    },
    amPmMode(){
      if((this.format || '').indexOf('A') !== -1) return 'A'
      if((this.format || '').indexOf('a') !== -1) return 'a'
      return ''
    }
  },
  methods: {
    handleChange(date){
      // this.visible avoids edge cases, when use scrolls during panel closing animation
      if(this.visible){
        this.date = clearMilliseconds(date)
        // if date is out of range, do not emit
        if(this.isValidValue(this.date)){
          this.$emit('pick', this.date, true)
        }
      }
    },
    setSelectionRange(start, end){
      this.$emit('select-range', start, end)
      this.selectionRange = [start, end]
    },
    handleCancel(){
      this.$emit('pick', this.oldValue, false)
    },
    handleConfirm(visible = false, first){
      if(first) return
      const date = clearMilliseconds(limitTimeRange(this.date, this.selectableRange, this.format))
      this.$emit('pick', date, visible, first)
    }
  }

}
</script>