import Picker from '../picker.vue'
import TimePanel from '../panel/timePanel.vue'
import TimeRangePanel from '../panel/timeRangePanel'

export default {
  mixins: [Picker],

  name: 'timePicker',

  props: {
    isRange: Boolean  // 是否范围选择
  },

  data(){
    return {
      type: ''
    }
  },

  watch: {
    isRange(isRange){
      // 
    }
  },

  created(){
    this.type = this.isRange ? 'timerange' : 'time'
    this.panel = this.isRange ? TimeRangePanel : TimePanel
  }
}