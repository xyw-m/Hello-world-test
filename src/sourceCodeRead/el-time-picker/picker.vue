<template>
  <!-- 时间/日期选择器，input-->
  <el-input
    ref="reference"
    v-if="!ranged"
    v-bind="firstInputId"
    :value="displayValue"
    :readonly="!editable || readonly || type === 'dates' || type === 'week'"
    @input="value => userInput = value"
    @change="handleChange"
    @focus="handleFocus"
    >
    <i slot="prefix"></i>
  </el-input>
  <!-- 范围选择 2个input-->
  <div v-else
    ref="reference">
    <input/>
    <input/>
  </div>
</template>
<script>
import Vue from 'vue'
// type可接受的所有值，即组件的所有可选模式
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
export default {
  data() {
    return {
      pickerVisible: false,
      showClose: false,
      userInput: null,  // 存放用户输入
      valueOnOpen: null,
      unwatchPickerOptions: null
    }
  },
  props: {
    size: String, // 输入框尺寸
    format: String, // 时间格式化
    valueFormat: String,  // 仅TimePicker时可用，绑定值的格式。默认为Date对象
    readonly: Boolean,
    placeholder: String,
    startPlaceholder: String, // 范围选择时开始input的占位内容
    endPlaceholder: String, // 范围选择时结束input的占位内容
    prefixIcon: String, // 自定义头部图标类名
    clearIcon: {  // 清除数据自定义图标类名
      type: String,
      default: 'el-icon-circle-close'
    },
    name: {
      default: '',
      validator // 验证是否为String，Array of String，null或undefined
    },
    disabled: Boolean,  
    clearable: {  // 是否显示清除按钮
      type: Boolean,
      default: true
    },
    id: {
      default: '',
      validator
    },
    popperClass: String,  // TimePicker下拉框的类名
    editable: { // 文本框可输入
      type: Boolean,
      default: true
    },
    align: {  // 对齐方式
      type: String,
      default: 'left'
    },
    value: {},
    defaultValue: {}, // 选择器打开时默认显示的时间
    defaultTime: {},
    rangeSeparator: { // 选择范围时的分隔符
      default: '-'
    },
    pickerOptions: {},  // 时间日期选择器特有的选项
    unlinkPanels: Boolean,
    validateEvent: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    // 正常情况下this.type不存在，暂时没找到
    // 通过devtools查看，type在data里？？
    ranged(){
      return this.type.indexOf('range') > -1
    },
    reference(){
      const reference = this.$refs.reference
      return reference.$el || reference
    },
    refInput(){
      if(this.reference){
        // 应该返回 数组形式的 reference下的所有input
        // 非范围：返回一个input；范围选择：返回两个input
        return [].slice.call(this.reference.querySelectorAll('input'))
      } else {
        return []
      }
    },
    
    // 验证value是否为空 || value数组中是否有空值
    valueIsEmpty(){
      const val = this.value
      if(Array.isArray(val)){
        for(let i=0; i<val.length; i++){
          if(val[i]){
            return false
          }
        }
      } else {
        if(val){
          return false
        }
      }
      return true
    },

    // 有自定义图标用自定义，没有的话判断是类型是时间还是日期
    triggerClass(){
      return this.prefixIcon || (this.type.indexOf('time') !== -1 ? 'el-icon-time' : 'el-icon-date')
    },
    selectionMode(){
      if(this.type === 'week'){
        return 'week'
      } else if(this.type === 'month'){
        return 'month'
      } else if(this.type === 'year'){
        return 'year'
      } else if(this.type === 'dates'){
        return 'dates'
      }
      return 'day'
    },

    haveTrigger(){
      // this.showTrigger 未找到出处
      if(typeof this.showTrigger !== 'undefined'){
        return this.showTrigger
      }
      return HAVE_TRIGGER_TYPES.indexOf(this.type) !== -1
    },

    // 绑定到模板的value上，只能通过更新displayValue更新视图，无法通过更新视图来更新displayValue
    displayValue(){
      // this.type 未找到出处
      const formattedValue = formatAsFormatAndType(this.parsedValue, this.format, this.type, this.rangeSeparator)
      if(Array.isArray(this.userInput)){
        return [
          this.userInput[0] || (formattedValue && formattedValue[0]) || '',
          this.userInput[1] || (formattedValue && formattedValue[1]) || ''
        ]
      } else if(this.userInput !== null){
        return this.userInput
      } else if(formattedValue){
          return this.type === 'dates'
                ? formattedValue.join(', ')
                : formattedValue
      } else {
        return ''
      }
    },
    
    parsedValue(){
      if(!this.value) return this.value // 组件value未设置，即外部调用时v-model="undefined"？
      if(this.type === 'time-select') return this.value // time-select类型无需解析

      const valueIsDateObject = isDateObject(this.value) || (Array.isArray(this.value) && this.value.every(isDateObject))

      // 如果value是Date格式，无需处理直接返回
      if(valueIsDateObject){
        return this.value
      }
      // 如果用户提供了format格式，按要求返回
      if(this.valueFormat){
        return parseAsFormatAndType(this.value, this.valueFormat, this.type, this.rangeSeparator) || this.value
      }
      // user might provide string / timestamp without value-format
      // coerce them into date (or array of date)
      return Array.isArray(this.value) ? this.value.map(val => new Date(val)) : new Date(this.value)
    },

    // 为elForm作适配
    _elFormItemSize(){
      return (this.elFormItem || {} ).elFormItemSize
    },

    pickerSize(){
      return this.size || this.elFormItemSize || (this.$ELEMENT || {}).size
    },

    pickerDisabled(){
      return this.disabled || (this.elForm || {}).disabled
    },

    firstInputId(){
      const obj = {}
      let id
      if(this.ranged){
        id = this.id && this.id[0]
      } else {
        id = this.id
      }
      if(id) obj.id = id
      return obj
    },

    secondInputId(){
      const obj = {}
      let id
      if(this.ranged){
        id = this.id && this.id[0]
      } else {
        id = this.id
      }
      if(id) obj.id = id
      return obj
    }
      
  },
  watch: {
    pickerVisible(val){
      if(this.readonly || this.pickerDisabled ) return
      if(val){
        this.showPicker()
        this
      }
    }
  },
  methods: {
    // 显示Picker
    showPicker(){
      // 当前Vue实例是否运行于服务器
      if(this.$isServer) return
      if(!this.picker){
        this.mountPicker()
      }
      未完待续2
    },

    mountPicker(){
      // $mount返回vm实例自身
      // panel 时间/日期选择面板
      this.picker = new Vue(this.panel).$mount()
      this.picker.defaultValue = this.defaultValue
    },

    // 获得焦点
    focus() {
      if (!this.ranged) {
        this.$refs.reference.focus()
      } else {
        this.handleFocus()
      }
    },

    // 失去焦点
    blur(){
      this.refInput.forEach(input => input.blur())
    },

    // 和计算属性parsedValue的功能基本一样？
    parseValue(value){
      const isParsed = isDateObject(value) || (Array.isArray(value) && value.every(isDateObject))
      if(this.valueFormat && !isParsed){
        return parseAsFormatAndType(value, this.valueFormat, this.type, this.rangeSeparator) || value
      } else {
        return value
      }
    },

    formatToValue(date){
      // date是否是Date对象或Array<Date>
      const isFormattable = isDateObject(date) || (Array.isArray(date) && date.every(isDateObject))
      if(this.valueFormat && isFormattable){
        return formatAsFormatAndType(date, this.valueFormat, this.type, this.rangeSeparator)
      } else {
        return date
      }
    },

    parseString(value){
      const type = Array.isArray(value) ? this.type : this.type.replace('range', '')
      return parseAsFormatAndType(value, this.format, type)
    },

    formatToString(value){
      const type = Array.isArray(value) ? this.type : this.type.replace('range', '')
      return formatAsFormatAndType(value, this.format, type)
    },

    handleFocus(){
      const type = this.type
      if(HAVE_TRIGGER_TYPES.indexOf(type) !== -1 && !this.pickerVisible){
        this.pickerVisible = true
      }
      this.$emit('focus', this)
    },

    handleMouseEnter(){
      if(this.readonly || this.pickerDisabled ) return
      if(!this.valueIsEmpty && this.clearable){
        this.showClose = true
      }
    },

    handleChange(){
      if(this.userInput){
        const value = this.parseString(this.displayValue)
        if(value){
          this.picker.value = value
        }
      }
    },

    handleFieldReset(initialValue){
      this.userInput = initialValue === '' ? null : initialValue
    }
  },
  created(){
    // vue-popper
    this.popperOptions = {
      boundariesPadding: 0,
      gpuAcceleration: false
    }
    // 没找到出处
    this.placement = PLACEMENT_MAP[this.align] || PLACEMENT_MAP.left;
    this.$on('fieldReset', this.handleFieldReset)
  }
}
</script>
