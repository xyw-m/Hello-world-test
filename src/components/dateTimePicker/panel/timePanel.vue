<template>
  <transition name="el-zoom-in-top">
    <div v-show="visible" class="time-panel">
      <div class="header-wrapper">
        <ul class="timePanel-header">
          <li>时</li>
          <li>分</li>
          <li>秒</li>
        </ul>
      </div>
      <time-spinner
        ref="spinner"
        :date="date"
        :show-seconds="showSeconds"
        @change="handleChange"
        @select-range="setSelectionRange"
      ></time-spinner>
      <div class="panel-footer">
        <el-button size="mini" @click="handleCancel">取消</el-button>
        <el-button
          size="mini"
          type="primary"
          @click="handleConfirm()"
          :disabled="!isValidValue(date)"
          >确认</el-button
        >
      </div>
    </div>
  </transition>
</template>
<script>
import timeSpinner from '../basic/time-spinner.vue';
import {
  clearMilliseconds,
  isDate,
  limitTimeRange,
  timeWithinRange,
  modifyTime,
} from '../utils/date-util.js';

export default {
  components: { timeSpinner },

  data() {
    return {
      date: new Date(),
      format: 'HH:mm:ss',
      defaultValue: null,
      selectableRange: [],
      selectionRange: [0, 2],
      value: '',
      oldValue: new Date(),
      needInitAdjust: true,
    };
  },

  props: {
    visible: Boolean,
  },

  watch: {
    visible(val) {
      if (val) {
        this.oldValue = this.value;
        this.$nextTick(() => this.$refs.spinner.emitSelectRange('hours'));
      } else {
        this.needInitAdjust = true;
      }
    },
    value(newVal) {
      let date;
      if (newVal instanceof Date) {
        date = limitTimeRange(newVal, this.selectableRange, this.format);
        // 改为当前日期
        date = modifyTime(
          this.date,
          date.getHours(),
          date.getMinutes(),
          date.getSeconds(),
        );
      } else if (!newVal) {
        date = this.defaultValue ? new Date(this.defaultValue) : new Date();
      }

      this.date = date;
      if (this.visible && this.needInitAdjust) {
        this.$nextTick((_) => this.adjustSpinners());
        this.needInitAdjust = false;
      }
    },
    selectableRange(val) {
      this.$refs.spinner.selectableRange = val;
    },
    defaultValue(val) {
      if (!isDate(this.value)) {
        this.date = val ? new Date(val) : new Date();
      }
    },
  },

  computed: {
    showSeconds() {
      return (this.format || '').indexOf('ss') !== -1;
    },
  },

  methods: {
    adjustSpinners() {
      return this.$refs.spinner.adjustSpinners();
    },
    isValidValue(date) {
      return timeWithinRange(date, this.selectableRange, this.format);
    },
    handleChange(date) {
      if (this.visible) {
        this.date = clearMilliseconds(date);
        if (this.isValidValue(this.date)) {
          this.$emit('pick', this.date, true);
        }
      }
    },
    handleCancel() {
      this.$emit('pick', this.oldValue, false);
    },
    handleConfirm(visible = false, first) {
      if (first) return;
      const date = clearMilliseconds(
        limitTimeRange(this.date, this.selectableRange, this.format),
      );
      this.$emit('pick', date, visible, first);
    },
    setSelectionRange(start, end) {
      this.$emit('select-range', start, end);
      this.selectionRange = [start, end];
    },
  },
};
</script>
<style lang="scss" scoped>
.time-panel {
  width: 256px;
  background: #ffffff;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.2);
  border-radius: 3px;
  border: 1px solid #e1e1e1;
  padding: 17px 20px;
  margin-top: 4px;
  z-index: 20001;
  position: absolute;

  .header-wrapper {
    width: 216px;
  }

  .timePanel-header {
    height: 30px;
    background-color: #f8f8f8;
    border-top-left-radius: 2px;
    border-top-right-radius: 2px;
    border: 1px solid #e1e1e1;
    border-bottom: none;
    list-style: none;
    padding-inline-start: 0;
    padding: 0 16px;
    margin-bottom: 0;
    line-height: 2;

    li {
      width: 33%;
      display: inline-block;
      text-align: center;
      font-size: 12px;
      font-family: "MicrosoftYaHei";
      color: #222222;
      line-height: 30px;
      margin-left: -1px;
    }
  }

  .panel-footer {
    width: 216px;
    text-align: right;
    margin-top: 12px;

    button {
      width: 44px;
      padding: 7px;
    }
  }
}
</style>
