import Picker from '../picker.vue'
import DatePanel from '../panel/datePanel.vue'

const getPanel = function(type){
  if(type === 'daterange' || type === 'datetimerange'){
    return ''
  } else {
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