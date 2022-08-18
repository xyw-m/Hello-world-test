<template>
  <el-input
    ref="reference"
    class="date-editor"
    placeholder="请选择时间"
    :value="displayValue"
    v-clickoutside="handleClose"
    @input="value => userInput = value"
    @focus="handleFocus">
    <i 
      slot="prefix"
      class="el-input__icon"
      :class="triggerClass"
      ></i>
  </el-input>
</template>
<script>
import Vue from 'vue'
import { formatDate, parseDate, isDateObject } from './utils/date-util'
import Popper from 'element-ui/src/utils/vue-popper'
import merge from 'element-ui/src/utils/merge'
import clickoutside from 'element-ui/src/utils/clickoutside'

const NewPopper = {
  props: {
    appendToBody: Popper.props.appendToBody,
    offset: Popper.props.offset,
    boundariesPadding: Popper.props.boundariesPadding,
    arrowOffset: Popper.props.arrowOffset
  },
  methods: Popper.methods,
  data() {
    return merge({ visibleArrow: true }, Popper.data);
  },
  beforeDestroy: Popper.beforeDestroy
};

const HAVE_TRIGGER_TYPES = [
  'date',
  'datetime',
  'time',
  'time-select',
  'week',
  'month',
  'year',
  'daterange',
  'monthrange',
  'timerange',
  'datetimerange',
  'dates'
]

const DEFAULT_FORMATS = {
  date: 'yyyy-MM-dd',
  month: 'yyyy-MM',
  datetime: 'yyyy-MM-dd HH:mm:ss',
  time: 'HH:mm:ss',
  week: 'yyyywWW',
  timerange: 'HH:mm:ss',
  daterange: 'yyyy-MM-dd',
  monthrange: 'yyyy-MM',
  datetimerange: 'yyyy-MM-dd HH:mm:ss',
  year: 'yyyy'
}

const valueEquals = function(a, b) {
  // considers Date object and string
  const dateEquals = function(a, b) {
    const aIsDate = a instanceof Date;
    const bIsDate = b instanceof Date;
    if (aIsDate && bIsDate) {
      return a.getTime() === b.getTime();
    }
    if (!aIsDate && !bIsDate) {
      return a === b;
    }
    return false;
  };

  const aIsArray = a instanceof Array;
  const bIsArray = b instanceof Array;
  if (aIsArray && bIsArray) {
    if (a.length !== b.length) {
      return false;
    }
    return a.every((item, index) => dateEquals(item, b[index]));
  }
  if (!aIsArray && !bIsArray) {
    return dateEquals(a, b);
  }
  return false;
};

const parseAsFormatAndType = (value, customFormat, type, rangeSeparator = '-') => {
  if (!value) return null;
  const parser = (
    TYPE_VALUE_RESOLVER_MAP[type] ||
    TYPE_VALUE_RESOLVER_MAP['default']
  ).parser;
  const format = customFormat || DEFAULT_FORMATS[type];
  return parser(value, format, rangeSeparator);
};

const formatAsFormatAndType = (value, customFormat, type) => {
  if (!value) return null;
  const formatter = (
    TYPE_VALUE_RESOLVER_MAP[type] ||
    TYPE_VALUE_RESOLVER_MAP['default']
  ).formatter;
  const format = customFormat || DEFAULT_FORMATS[type];

  return formatter(value, format);
};

// 日期格式化
const DATE_FORMATTER = function(value, format){
  return formatDate(value, format)
}

// 范围格式化
const RANGE_FORMATTER = function(value, format){
  if(Array.isArray(value) && value.length === 2){
    const start = value[0]
    const end = value[1]

    if(start && end){
      return [DATE_FORMATTER(start, format), DATE_FORMATTER(end, format)]
    }
  }
  return ''
}

// 日期解析
const DATE_PARSER = function(text, format){
  return parseDate(text, format)
}

// 范围解析
const RANGE_PARSER = function(array, format, separator){
  if(!Array.isArray(array)){
    array = array.split(separator)
  }

  if(array.length === 2){
    const range1 = array[0]
    const range2 = array[1]

    return [DATE_PARSER(range1, format), DATE_PARSER(range2, format)]
  }
  return []
}

const TYPE_VALUE_RESOLVER_MAP = {
  default: {
    formatter(value){
      if (!value) return ''
      return '' + value
    },
    parser(text){
      if(text === undefined || text === '') return null
      return text
    }
  },
  time: {
    formatter: DATE_FORMATTER,
    parser: DATE_PARSER
  },
  timerange: {
    formatter: RANGE_FORMATTER,
    parser: RANGE_PARSER
  },
  datetimerange: {
    formatter: RANGE_FORMATTER,
    parser: RANGE_PARSER
  }
}

export default {
  mixins: [ NewPopper ],

  directives: {
    clickoutside: clickoutside
  },

  data(){
    return {
      pickerVisible: false,
      userInput: null,
      picker: null,
      valueOnOpen: null,  // value when picker opens, used to determine whether to emit change
    }
  },
  
  props: {
    value: {},
    format: String,
    disabled: Boolean,
    readonly: {
      type: Boolean,
      default: false
    },
    defaultValue: {},
    defaultTime: {},  // 是否有必要？
    pickerOptions: {},
    rangeSeparator: {
      default: '-'
    },
    valueFormat: String
  },

  computed: {
    displayValue(){
      const formattedValue = formatAsFormatAndType(this.parsedValue, this.format, this.type, this.rangeSeparator)
      if(Array.isArray(this.userInput)){
        return [
          this.userInput[0] || (formattedValue && formattedValue[0]) || '',
          this.userInput[1] || (formattedValue && formattedValue[1]) || '',
        ]
      } else if(this.userInput !== null){
        return this.userInput
      } else if(formattedValue){
        return this.type === 'dates' ? formattedValue.join(', ') : formattedValue
      } else {
        return ''
      }
    }, 
    reference(){
      const reference = this.$refs.reference
      return reference.$el || reference
    },
    selectionMode(){
      if (this.type === 'week') {
        return 'week';
      } else if (this.type === 'month') {
        return 'month';
      } else if (this.type === 'year') {
        return 'year';
      } else if (this.type === 'dates') {
        return 'dates';
      }

      return 'day'
    },
    refInput(){
      if(this.reference){
        return [].slice.call(this.reference.querySelectorAll('input'))
      }
      return []
    },
    parsedValue(){
      if(!this.value) return this.value
      if(this.type === 'time-select') return this.value 
      if(isDateObject(this.value)) return this.value

      if(this.valueFormat){
        return (this.value, this.parseAsFormatAndTypevalueFormat, this.type, this.rangeSeparator) || this.value;
      } 

      return Array.isArray(this.value) ? this.value.map(val => new Date(val)) : new Date(this.value)
    },
    triggerClass(){
      return this.type.indexOf('time') !== -1 ? 'el-icon-time' : 'el-icon-date'
    }
  },

  watch: {
    pickerVisible(val){
      // pickerDisabled 需要吗？
      if (this.readonly) return
      if(val){
        this.showPicker()
        this.valueOnOpen = Array.isArray(this.value) ? [...this.value] : this.value
      } else {
        this.hidePicker()
        this.emitChange(this.value)
        this.userInput = null
        this.$emit('blur', this)
        this.blur()
      }
    },
    parsedValue: {
      immediate: true,
      handler(val){
        if(this.picker){
          this.picker.value = val
        }
      }
    }
  },

  methods: {
    handleFocus(){
      const type = this.type

      if(HAVE_TRIGGER_TYPES.indexOf(type) !== -1 && !this.pickerVisible){
        this.pickerVisible = true
      }
      this.$emit('focus', this)
    },
    showPicker(){
      if(!this.picker){
        this.mountPicker()
      }

      this.pickerVisible = this.picker.visible = true

      this.updatePopper()

      this.picker.value = this.parsedValue 

      this.$nextTick(() => {
        this.picker.adjustSpinners && this.picker.adjustSpinners()
      })
    },
    mountPicker(){
      this.picker = new Vue(this.panel).$mount()
      this.picker.defaultValue = this.defaultValue
      // 可以这样设置DOM元素width吗？
      this.popperElm = this.picker.$el; // 弹出层设置
      this.picker.width = this.reference.getBoundingClientRect().width
      this.picker.selectionMode = this.selectionMode
      this.$watch('format', (format) => {
        this.picker.format = format
      })

      const updateOptions = () => {
        const options = this.pickerOptions || null

        if(options && options.selectableRange){
          let ranges = options.selectableRange
          const parser = TYPE_VALUE_RESOLVER_MAP.datetimerange.parser
          const format = DEFAULT_FORMATS.timerange

          ranges = Array.isArray(ranges) ? ranges : [ranges]
          this.picker.selectableRange = ranges.map(range => parser(range, format, this.rangeSeparator))
        }

        for(const option in options){
          if(Object.prototype.hasOwnProperty.call(options, option) && option !== 'selectableRange'){
            this.picker[option] = options[option]
          }
        }

        if(this.format){
          this.picker.format = this.format
        }
      }

      updateOptions()

      this.unwatchPickerOptions = this.$watch('pickerOptions', () => updateOptions())
      this.$el.appendChild(this.picker.$el)

      // 监听自定义事件
      // 未找到 this.doDestroy ？
      this.picker.$on('pick', (date = '', visible = false) => {
        this.userInput = null
        this.pickerVisible = this.picker.visible = visible
        this.emitInput(date)
      })

      this.picker.$on('select-range', (start, end, pos) => {
        if(this.refInput.length === 0) return
        if(!pos || pos === 'min'){
          this.refInput[0].setSelectionRange(start, end)
          this.refInput[0].focus()
        } else if(pos === 'max'){
          this.refInput[1].setSelectionRange(start, end)
          this.refInput[1].focus()
        }
      })
    },
    hidePicker(){
      if(this.picker){
        this.pickerVisible = this.picker.visible = false
        this.destroyPopper()
      }
    },
    emitInput(val){
      const formatted = this.formatToValue(val)
      if(!valueEquals(this.value, formatted)){
        this.$emit('input', formatted)
      }
    },
    emitChange(val){
      // determine user real change only
      if(!valueEquals(val, this.valueOnOpen)){
        this.$emit('change', val)
        this.valueOnOpen = val
      }
    },
    formatToValue(date){
      const isFormattable = isDateObject(date) || (Array.isArray(date) && date.every(isDateObject))
      if(this.valueFormat && isFormattable){
        return ''
        // return formatAsFormatAndType(date, this.valueFormat, this.type, this.rangeSeparator)
      } else {
        return date
      }
    },
    handleFieldReset(initialValue){
      this.userInput = initialValue === '' ? null : initialValue
    },
    blur(){
      this.refInput.forEach(input => input.blur())
    },
    handleClose(){
      if(!this.pickerVisible) return
      this.pickerVisible = false

      if(this.type === 'dates'){
        // restore to former value
        const oldValue = parseAsFormatAndType(this.valueOnOpen, this.valueFormat, this.type, this.rangeSeparator) || this.valueOnOpen
        this.emitInput(oldValue)
      }
    }
  },

  mounted(){
    // 
  },

  created(){
    // vue-popper
    this.popperOptions = {
      boundariesPadding: 0,
      gpuAcceleration: false
    }

    this.placement = 'bottom-start'
    this.$on('fieldReset', this.handleFieldReset)
  }
}
</script>
<style lang="scss" scoped>
.date-editor {
  width: 256px;
}
</style>