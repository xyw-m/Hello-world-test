import Picker from '../picker.vue'
import DatePanel from '../panel/datePanel.vue'
import DateRangePanel from '../panel/dateRangePanel.vue'
import DateTimePanel from '../panel/dateTimePanel'
import DateTimeSelectPanel from '../panel/dateTimeSelectPanel'

const getPanel = function(type){
  if(type === 'daterange'){
    return DateRangePanel
  } else if(type === 'datetime'){
    return DateTimePanel
  } else if(type === 'datetimeselect'){
    return DateTimeSelectPanel
  }
  else {
    return DatePanel
  }
}

export default {
  mixins: [Picker],
  
  name: 'datePicker',

  props: {
    type: {
      type: String,
      default: 'date'
    }
  },

  watch: {
    type(type){
      if(this.picker){
        this.unmountPicker()
        this.panel = getPanel(type)
        this.mountPicker()
      } else {
        this.panel = getPanel(type)
      }
    }
  },

  created(){
    this.panel = getPanel(this.type)
  }
}