<template>
  <el-input
    ref="reference"
    class="date-editor"
    placeholder="请选择时间"
    :value="displayValue"
    :disabled="disabled"
    :readonly="inputReadOnly"
    v-clickoutside="handleClose"
    v-if="!ranged"
    @input="(value) => (userInput = value)"
    @focus="handleFocus"
    @change="handleChange"
    @mouseenter.native="handleMouseEnter"
    @mouseleave.native="showClose = false"
  >
    <i
      slot="prefix"
      class="el-input__icon editor-icon"
      :class="triggerClass"
      style="font-size: 18px"
    ></i>
    <i
      v-if="haveTrigger"
      slot="suffix"
      class="el-input__icon close-icon editor-icon"
      style="font-size: 18px"
      :class="[showClose ? 'el-icon-circle-close' : '']"
      @click="handleClickClose"
    ></i>
  </el-input>
  <div
    v-else
    ref="reference"
    class="date-range-editor"
    v-clickoutside="handleClose"
    :class="[disabled ? 'is-disabled' : '']"
    @mouseenter="handleMouseEnter"
    @mouseleave="showClose = false"
  >
    <span class="range-icon editor-icon">
      <i :class="['el-input__icon', triggerClass]"></i>
    </span>
    <!-- 开始时间 -->
    <input
      auto-complete="off"
      placeholder="开始时间"
      :value="displayValue && displayValue[0]"
      :disabled="disabled"
      :readonly="inputReadOnly"
      class="range-input"
      @focus="handleFocus"
      @input="handleStartInput"
      @change="handleStartChange"
    />
    <slot name="range-separator">
      <span class="range-separator">{{ rangeSeparator }}</span>
    </slot>
    <!-- 结束时间 -->
    <input
      auto-complete="off"
      placeholder="结束时间"
      :disabled="disabled"
      :readonly="inputReadOnly"
      :value="displayValue && displayValue[1]"
      class="range-input"
      @focus="handleFocus"
      @input="handleEndInput"
      @change="handleEndChange"
    />
    <span class="range-icon">
      <i
        v-if="haveTrigger"
        class="el-input__icon close-icon editor-icon"
        :class="[showClose ? 'el-icon-circle-close' : '']"
        @click="handleClickClose"
      ></i>
    </span>
  </div>
</template>
<script>
import Vue from 'vue';
import {
  formatDate,
  parseDate,
  isDateObject,
  modifyTime,
} from './utils/date-util';
import Popper from 'element-ui/src/utils/vue-popper';
import merge from 'element-ui/src/utils/merge';
import clickoutside from 'element-ui/src/utils/clickoutside';

const NewPopper = {
  props: {
    appendToBody: Popper.props.appendToBody,
    offset: Popper.props.offset,
    boundariesPadding: Popper.props.boundariesPadding,
    arrowOffset: Popper.props.arrowOffset,
  },
  methods: Popper.methods,
  data() {
    return merge({ visibleArrow: true }, Popper.data);
  },
  beforeDestroy: Popper.beforeDestroy,
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
  'dates',
  'datetimeselect',
  'time-selectrange',
];

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
  year: 'yyyy',
  datetimeselect: 'yyyy-MM-dd HH:mm',
  'time-selectrange': 'HH:mm',
};

const valueEquals = function (a, b) {
  // considers Date object and string
  const dateEquals = function (a1, b1) {
    const aIsDate = a1 instanceof Date;
    const bIsDate = b1 instanceof Date;
    if (aIsDate && bIsDate) {
      return a1.getTime() === b1.getTime();
    }
    if (!aIsDate && !bIsDate) {
      return a1 === b1;
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

const parseAsFormatAndType = (
  value,
  customFormat,
  type,
  rangeSeparator = '-'
) => {
  if (!value) return null;
  const { parser } =
    TYPE_VALUE_RESOLVER_MAP[type] || TYPE_VALUE_RESOLVER_MAP.default;
  const format = customFormat || DEFAULT_FORMATS[type];
  return parser(value, format, rangeSeparator);
};

const formatAsFormatAndType = (value, customFormat, type) => {
  if (!value) return null;
  const { formatter } =
    TYPE_VALUE_RESOLVER_MAP[type] || TYPE_VALUE_RESOLVER_MAP.default;
  const format = customFormat || DEFAULT_FORMATS[type];

  return formatter(value, format);
};

// 日期格式化
const DATE_FORMATTER = function (value, format) {
  return formatDate(value, format);
};

// 范围格式化
const RANGE_FORMATTER = function (value, format) {
  if (Array.isArray(value) && value.length === 2) {
    const start = value[0];
    const end = value[1];

    if (start && end) {
      return [DATE_FORMATTER(start, format), DATE_FORMATTER(end, format)];
    }
  }
  return '';
};

// 日期解析
const DATE_PARSER = function (text, format) {
  return parseDate(text, format);
};

// 范围解析
const RANGE_PARSER = function (array, format, separator) {
  if (!Array.isArray(array)) {
    array = array.split(separator);
  }

  if (array.length === 2) {
    const range1 = array[0];
    const range2 = array[1];

    return [DATE_PARSER(range1, format), DATE_PARSER(range2, format)];
  }
  return [];
};

const TYPE_VALUE_RESOLVER_MAP = {
  default: {
    formatter(value) {
      if (!value) return '';
      return `${value}`;
    },
    parser(text) {
      if (text === undefined || text === '') return null;
      return text;
    },
  },
  time: {
    formatter: DATE_FORMATTER,
    parser: DATE_PARSER,
  },
  timerange: {
    formatter: RANGE_FORMATTER,
    parser: RANGE_PARSER,
  },
  datetimerange: {
    formatter: RANGE_FORMATTER,
    parser: RANGE_PARSER,
  },
  date: {
    formatter: DATE_FORMATTER,
    parser: DATE_PARSER,
  },
  daterange: {
    formatter: RANGE_FORMATTER,
    parser: RANGE_PARSER,
  },
  datetime: {
    formatter: DATE_FORMATTER,
    parser: DATE_PARSER,
  },
  datetimeselect: {
    formatter: DATE_FORMATTER,
    parser: DATE_PARSER,
  },
  'time-selectrange': {
    formatter: RANGE_FORMATTER,
    parser: RANGE_PARSER,
  },
};

export default {
  mixins: [NewPopper],

  directives: {
    clickoutside,
  },

  data() {
    return {
      pickerVisible: false,
      userInput: null,
      picker: null,
      valueOnOpen: null, // value when picker opens, used to determine whether to emit change
      showClose: false,
    };
  },

  props: {
    value: {},
    format: String,
    disabled: Boolean,
    readonly: {
      type: Boolean,
      default: false,
    },
    defaultValue: {},
    defaultTime: {}, // 是否有必要？
    pickerOptions: {},
    rangeSeparator: {
      default: '至',
    },
    valueFormat: String,
  },

  computed: {
    displayValue() {
      let formattedValue = formatAsFormatAndType(
        this.parsedValue,
        this.format,
        this.type,
        this.rangeSeparator
      );
      if (Array.isArray(this.userInput)) {
        return [
          this.userInput[0] || (formattedValue && formattedValue[0]) || '',
          this.userInput[1] || (formattedValue && formattedValue[1]) || '',
        ];
      } else if (this.userInput !== null) {
        return this.userInput;
      } else if (formattedValue) {
        if (this.type === 'date') {
          formattedValue = formattedValue.replaceAll('-', '/');
        } else if (this.type === 'datetime' || this.type === 'datetimeselect') {
          formattedValue = formattedValue.replaceAll('-', '/');
          formattedValue = formattedValue.replace(' ', ' - ');
        } else if (this.type === 'daterange') {
          formattedValue = formattedValue.map((val) =>
            val.replaceAll('-', '/'));
        }
        return formattedValue;
      } else {
        return '';
      }
    },
    reference() {
      const { reference } = this.$refs;
      return reference.$el || reference;
    },
    selectionMode() {
      if (this.type === 'week') {
        return 'week';
      } else if (this.type === 'month') {
        return 'month';
      } else if (this.type === 'year') {
        return 'year';
      } else if (this.type === 'dates') {
        return 'dates';
      }

      return 'day';
    },
    refInput() {
      if (this.reference) {
        return [].slice.call(this.reference.querySelectorAll('input'));
      }
      return [];
    },
    parsedValue() {
      if (!this.value) return this.value;
      if (this.type === 'time-select') return this.value;
      if (isDateObject(this.value)) return this.value;

      if (this.valueFormat) {
        return (
          (this.value,
          this.parseAsFormatAndTypevalueFormat,
          this.type,
          this.rangeSeparator) || this.value
        );
      }

      if (this.type === 'time') {
        const text = this.value.split(':');
        const hours = parseInt(text[0]);
        const minutes = parseInt(text[1]);
        const seconds = parseInt(text[2]);
        const current = new Date();
        return new Date(
          current.getFullYear(),
          current.getMonth(),
          current.getDate(),
          hours,
          minutes,
          seconds
        );
      }

      if (this.type === 'timerange') {
        const result = [];
        if (Array.isArray(this.value)) {
          this.value.forEach((val) => {
            if (isDateObject(val)) {
              result.push(new Date(val));
            } else {
              const text = val.split(':');
              const hours = parseInt(text[0]);
              const minutes = parseInt(text[1]);
              const seconds = parseInt(text[2]);
              const current = new Date();
              result.push(
                new Date(
                  current.getFullYear(),
                  current.getMonth(),
                  current.getDate(),
                  hours,
                  minutes,
                  seconds
                )
              );
            }
          });
        }
        if (result[0].getTime() <= result[1].getTime()) {
          return result;
        } else {
          throw new Error(`Invalid value: ${this.value}`);
        }
      }

      if (this.type === 'time-selectrange') {
        const result = [];
        if (Array.isArray(this.value)) {
          // eslint-disable-next-line array-callback-return
          this.value.map((val) => {
            if (isDateObject(val)) {
              result.push(new Date(val));
            } else {
              const text = val.split(':');
              const hours = parseInt(text[0]);
              const minutes = parseInt(text[1]);
              const current = new Date();
              result.push(
                new Date(
                  current.getFullYear(),
                  current.getMonth(),
                  current.getDate(),
                  hours,
                  minutes,
                  0
                )
              );
            }
          });
        }
        if (result[0].getTime() <= result[1].getTime()) {
          return result;
        } else {
          throw new Error(`Invalid value: ${this.value}`);
        }
      }

      return Array.isArray(this.value)
        ? this.value.map((val) => new Date(val))
        : new Date(this.value);
    },
    triggerClass() {
      return this.type.indexOf('time') !== -1 ? 'el-icon-time' : 'el-icon-date';
    },
    ranged() {
      return this.type.indexOf('range') > -1;
    },
    haveTrigger() {
      if (typeof this.showTrigger !== 'undefined') {
        return this.showTrigger;
      }
      return HAVE_TRIGGER_TYPES.indexOf(this.type) !== -1;
    },
    valueIsEmpty() {
      const val = this.value;
      if (Array.isArray(val)) {
        for (let i = 0, len = val.length; i < len; i++) {
          if (val[i]) {
            return false;
          }
        }
      } else if (val) {
        return false;
      }
      return true;
    },
    inputReadOnly() {
      return (
        this.readonly ||
        this.type === 'time-selectrange' ||
        this.type === 'datetimeselect'
      );
    },
  },

  watch: {
    pickerVisible(val) {
      // pickerDisabled 需要吗？
      if (this.readonly) return;
      if (val) {
        this.showPicker();
        this.valueOnOpen = Array.isArray(this.value)
          ? [...this.value]
          : this.value;
      } else {
        this.hidePicker();
        this.emitChange(this.value);
        this.userInput = null;
        this.$emit('blur', this);
        this.blur();
      }
    },
    parsedValue: {
      immediate: true,
      handler(val) {
        if (this.picker) {
          this.picker.value = val;
        }
      },
    },
  },

  methods: {
    focus() {
      if (!this.ranged) {
        this.$refs.reference.focus();
      } else {
        this.handleFocus();
      }
    },
    handleFocus() {
      const { type } = this;

      if (HAVE_TRIGGER_TYPES.indexOf(type) !== -1 && !this.pickerVisible) {
        this.pickerVisible = true;
      }
      this.$emit('focus', this);
    },
    showPicker() {
      if (!this.picker) {
        this.mountPicker();
      }

      // eslint-disable-next-line no-multi-assign
      this.pickerVisible = this.picker.visible = true;

      // this.updatePopper()

      this.picker.value = this.parsedValue;

      this.$nextTick(() => {
        this.picker.adjustSpinners && this.picker.adjustSpinners();
      });
    },
    mountPicker() {
      this.picker = new Vue(this.panel).$mount();
      this.picker.defaultValue = this.defaultValue;
      // 可以这样设置DOM元素width吗？
      this.popperElm = this.picker.$el; // 弹出层设置
      this.picker.width = this.reference.getBoundingClientRect().width;
      this.picker.selectionMode = this.selectionMode;
      this.$watch('format', (format) => {
        this.picker.format = format;
      });

      const updateOptions = () => {
        const options = this.pickerOptions || null;

        if (
          options &&
          options.selectableRange &&
          (this.type === 'time' || this.type === 'date')
        ) {
          let ranges = options.selectableRange;
          const { parser } = TYPE_VALUE_RESOLVER_MAP.datetimerange;
          const format = DEFAULT_FORMATS.timerange;

          ranges = Array.isArray(ranges) ? ranges : [ranges];
          this.picker.selectableRange = ranges.map((range) =>
            parser(range, format, '-'));
          if (this.type === 'date') {
            ranges = ranges[0].split(' - ');
            this.picker.selectableRange = ranges.map((range) => {
              const date = new Date(range);
              const hours = ranges.indexOf(range) === 0 ? 0 : 23;
              const minutes = ranges.indexOf(range) === 0 ? 0 : 39;
              const seconds = ranges.indexOf(range) === 0 ? 0 : 59;
              return new Date(
                date.getFullYear(),
                date.getMonth(),
                date.getDate(),
                hours,
                minutes,
                seconds
              );
            });
          }
        }

        for (const option in options) {
          if (
            Object.prototype.hasOwnProperty.call(options, option) &&
            option !== 'selectableRange'
          ) {
            this.picker[option] = options[option];
          }
        }

        if (this.format) {
          this.picker.format = this.format;
        }
      };

      updateOptions();

      this.unwatchPickerOptions = this.$watch('pickerOptions', () =>
        updateOptions());
      this.$el.appendChild(this.picker.$el);

      // 监听自定义事件
      // 未找到 this.doDestroy ？
      this.picker.$on('pick', (date = '', visible = false) => {
        this.userInput = null;
        // eslint-disable-next-line no-multi-assign
        this.pickerVisible = this.picker.visible = visible;
        this.emitInput(date);
      });

      this.picker.$on('select-range', (start, end, pos) => {
        if (this.refInput.length === 0) return;
        if (!pos || pos === 'min') {
          this.refInput[0].setSelectionRange(start, end);
          this.refInput[0].focus();
        } else if (pos === 'max') {
          this.refInput[1].setSelectionRange(start, end);
          this.refInput[1].focus();
        }
      });
    },
    unmountPicker() {
      if (this.picker) {
        this.picker.$destroy();
        this.picker.$off();
        if (typeof this.unwatchPickerOptions === 'function') {
          this.unwatchPickerOptions();
        }
        this.picker.$el.parentNode.removeChild(this.picker.$el);
      }
    },
    hidePicker() {
      if (this.picker) {
        // eslint-disable-next-line no-multi-assign
        this.pickerVisible = this.picker.visible = false;
        this.destroyPopper();
      }
    },
    emitInput(value) {
      let formatted = this.formatToValue(value);
      if (!valueEquals(this.value, formatted)) {
        if (this.type === 'time-selectrange') {
          const result = [];
          if (Array.isArray(value)) {
            value.forEach((val) => {
              if (typeof val === 'string') {
                result.push(val);
              } else {
                const hours = val.getHours();
                const minutes = val.getMinutes();
                result.push(
                  `${hours < 10 ? `0${hours}` : hours}:${
                    minutes < 10 ? `0${minutes}` : minutes
                  }`
                );
              }
            });
          }
          formatted = result;
        }
        this.$emit('input', formatted);
      }
    },
    emitChange(val) {
      // determine user real change only
      if (!valueEquals(val, this.valueOnOpen)) {
        if (this.type === 'time-selectrange' && Array.isArray(val)) {
          val = val.map((date) => {
            if (typeof date === 'string') return date;
            const hours = date.getHours();
            const minutes = date.getMinutes();
            return `${hours < 10 ? `0${hours}` : hours}:${
              minutes < 10 ? `0${minutes}` : minutes
            }`;
          });
        }
        this.$emit('change', val);
        this.valueOnOpen = val;
      }
    },
    isValidValue(value) {
      if (!this.picker) {
        this.mountPicker();
      }
      if (this.picker.isValidValue) {
        return value && this.picker.isValidValue(value);
      } else {
        return true;
      }
    },
    formatToValue(date) {
      const isFormattable =
        isDateObject(date) || (Array.isArray(date) && date.every(isDateObject));
      if (this.valueFormat && isFormattable) {
        return formatAsFormatAndType(
          date,
          this.valueFormat,
          this.type,
          this.rangeSeparator
        );
      } else {
        return date;
      }
    },
    formatToString(value) {
      const type = Array.isArray(value)
        ? this.type
        : this.type.replace('range', '');
      return formatAsFormatAndType(value, this.format, type);
    },
    // deals with user input
    parseString(value) {
      const type = Array.isArray(value)
        ? this.type
        : this.type.replace('range', '');
      return parseAsFormatAndType(value, this.format, type);
    },
    handleFieldReset(initialValue) {
      this.userInput = initialValue === '' ? null : initialValue;
    },
    blur() {
      this.refInput.forEach((input) => input.blur());
    },
    handleClose() {
      if (!this.pickerVisible) return;
      this.pickerVisible = false;

      if (this.type === 'dates') {
        // restore to former value
        const oldValue =
          parseAsFormatAndType(
            this.valueOnOpen,
            this.valueFormat,
            this.type,
            this.rangeSeparator
          ) || this.valueOnOpen;
        this.emitInput(oldValue);
      }
    },
    handleChange() {
      if (this.userInput) {
        if (this.type === 'date') {
          this.userInput = this.userInput.replaceAll('/', '-');
        } else if (this.type === 'datetime') {
          this.userInput = this.userInput.replace(' - ', ' ');
          this.userInput = this.userInput.replaceAll('/', '-');
        }
        const value = this.parseString(this.displayValue);
        if (value) {
          this.picker.value = value;
          if (this.isValidValue(value)) {
            this.emitInput(value);
            this.userInput = null;
          }
        }
      }

      if (this.userInput === '') {
        this.emitInput(null);
        this.emitChange(null);
        this.userInput = null;
      }
    },
    handleStartInput(event) {
      if (this.userInput) {
        this.userInput = [event.target.value, this.userInput[1]];
      } else {
        this.userInput = [event.target.value, null];
      }
    },
    handleStartChange(event) {
      if (this.type === 'daterange' && this.userInput && this.userInput[0]) {
        this.userInput[0] = this.userInput[0].replaceAll('/', '-');
      }
      const value = this.parseString(this.userInput && this.userInput[0]);
      if (value) {
        this.userInput = [this.formatToString(value), this.displayValue[1]];
        const newValue = [value, this.picker.value && this.picker.value[1]];
        if (this.type === 'timerange') {
          newValue[0] = modifyTime(
            this.picker.value[1],
            value.getHours(),
            value.getMinutes(),
            value.getSeconds()
          );
        }
        this.picker.value = newValue;
        if (this.isValidValue(newValue)) {
          this.emitInput(newValue);
          this.userInput = null;
        }
      }
    },
    handleEndInput(event) {
      if (this.userInput) {
        this.userInput = [this.userInput[0], event.target.value];
      } else {
        this.userInput = [null, event.target.value];
      }
    },
    handleEndChange(event) {
      if (this.type === 'daterange' && this.userInput && this.userInput[1]) {
        this.userInput[1] = this.userInput[1].replaceAll('/', '-');
      }
      const value = this.parseString(this.userInput && this.userInput[1]);
      if (value) {
        this.userInput = [this.displayValue[0], this.formatToString(value)];
        const newValue = [this.picker.value && this.picker.value[0], value];
        if (this.type === 'timerange') {
          newValue[1] = modifyTime(
            this.picker.value[0],
            value.getHours(),
            value.getMinutes(),
            value.getSeconds()
          );
        }
        this.picker.value = newValue;
        if (this.isValidValue(newValue)) {
          this.emitInput(newValue);
          this.userInput = null;
        }
      }
    },
    handleMouseEnter() {
      if (this.readonly || this.disabled) return;
      if (!this.valueIsEmpty) {
        this.showClose = true;
      }
    },
    handleClickClose(event) {
      if (this.readonly || this.disabled) return;
      if (this.showClose) {
        this.valueOnOpen = this.value;
        event.stopPropagation();
        this.emitInput(null);
        this.emitChange(null);
        this.showClose = false;
        if (this.picker && typeof this.picker.handleClear === 'function') {
          this.picker.handleClear();
        }
      } else {
        this.pickerVisible = !this.pickerVisible;
      }
    },
  },

  mounted() {
    //
  },

  created() {
    // vue-popper
    this.popperOptions = {
      boundariesPadding: 0,
      gpuAcceleration: false,
    };

    this.placement = 'bottom-start';
    this.$on('fieldReset', this.handleFieldReset);
  },
};
</script>
<style lang="scss" scoped>
.date-editor,
.date-range-editor {
  width: 256px;
  border-radius: 3px;
  &:hover {
    border-color: #0a7cff;
  }
  ::v-deep input {
    font-size: 12px;
    border-color: #0a7cff;
  }
}

::v-deep .date-editor {
  span {
    font-size: 18px;
  }
}

::v-deep .close-icon {
  color: #c0c4cc;
  cursor: pointer;
}

.date-range-editor {
  border: 1px solid #dddddd;
  text-align: left;

  .range-icon {
    color: #c0c4cc;
    font-size: 14px;
  }

  .range-input {
    display: inline-block;
    width: 80px;
    font-size: 12px;
    border: none;
    margin-left: 10px;
    &:focus-visible {
      outline: none;
    }
  }

  ::v-deep .editor-icon {
    font-size: 18px;
    margin-left: 2px;
  }
}
.is-disabled {
  background-color: #f5f7fa;
  cursor: not-allowed;
  input {
    background-color: #f5f7fa;
    cursor: not-allowed;
    &::placeholder {
      color: #c0c4cc;
    }
  }

  ::v-deep .range-separator {
    color: #c0c4cc;
  }
}
</style>
