import Picker from '../picker'
import TimeSelectPanel from '../panel/timeSelectPanel'
import TimeSelectRangePanel from '../panel/timeSelectRangePanel'

const getPanel = function(type){
  if(type === 'time-select'){
    return TimeSelectPanel
  } else {
    return TimeSelectRangePanel
  }
}


export default {
  mixins: [ Picker ],

  name: 'timeSelect',

  props: {
    type: {
      type: String,
      default: 'time-select'
    }
  },

  created(){
    this.panel = getPanel(this.type)
  }
}