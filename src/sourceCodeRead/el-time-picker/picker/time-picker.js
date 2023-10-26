import Picker from '../picker.vue';
import TimePanel from '../panel/time.vue';

export default {
  mixins: [Picker],

  name: 'ElTimePicker',

  props: {
    isRange: Boolean,
    arrowControl: Boolean, // 可通过界面上的箭头选择时间范围
  },

  data() {
    return {
      type: '',
    };
  },

  watch: {
    isRange(isRange) {
      if (this.picker) {
        this.unmountPicker(); // 定义在picker.vue中
        this.type = isRange ? 'timerange' : 'time';
        this.panel = isRange ? TimeRangePanel : TimePanel;
        this.mountPicker(); // 定义在picker.vue中
      } else {
        this.type = isRange ? 'timerange' : 'time';
        this.panel = isRange ? TimeRangePanel : TimePanel;
      }
    },
  },

  created() {
    this.type = this.isRange ? 'timerange' : 'time';
    this.panel = this.isRange ? TimeRangePanel : TimePanel;
  },
};
