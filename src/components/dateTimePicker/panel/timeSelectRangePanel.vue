<template>
  <transition name="el-zoom-in-top">
    <div v-show="visible" class="timeSelectRangePanel">
      <!-- min time -->
      <div class="panel-item">
        <div class="select-header-wrapper">
          <ul class="panel-header">
            <li>开始时间</li>
          </ul>
        </div>
        <time-select-spinner
          ref="startSpinner"
          :date="minDate"
          @change="handleMinChange"
          :interval="interval"
        ></time-select-spinner>
      </div>
      <!-- max time -->
      <div class="panel-item">
        <div class="select-header-wrapper">
          <ul class="panel-header">
            <li>结束时间</li>
          </ul>
        </div>
        <time-select-spinner
          ref="endSpinner"
          :date="maxDate"
          @change="handleMaxChange"
          :interval="interval"
        ></time-select-spinner>
      </div>
      <div class="panel-footer">
        <el-button size="mini" @click="handleCancel">取消</el-button>
        <el-button
          size="mini"
          type="primary"
          @click="handleConfirm()"
          :disabled="!isValidValue([minDate, maxDate])"
          >确认</el-button
        >
      </div>
    </div>
  </transition>
</template>
<script>
import timeSelectSpinner from '../basic/time-select-spinner.vue';
import {
  limitTimeRange,
  modifyTime,
  timeWithinRange,
  clearMilliseconds,
} from '../utils/date-util';

export default {
  components: { timeSelectSpinner },

  data() {
    return {
      minDate: new Date(),
      maxDate: new Date(),
      value: [],
      oldValue: [new Date(), new Date()],
      format: 'HH:mm',
      visible: false,
      interval: {
        start: '00:00',
        end: '23:30',
        step: '00:30',
      },
      defaultValue: null,
    };
  },

  watch: {
    value(value) {
      if (Array.isArray(value) && this.isValidValue([value[0], value[1]])) {
        this.minDate = new Date(value[0]);
        this.maxDate = new Date(value[1]);
      } else if (Array.isArray(this.defaultValue)) {
        this.minDate = new Date(this.defaultValue[0]);
        this.maxDate = new Date(this.defaultValue[1]);
      } else if (this.defaultValue) {
        this.minDate = new Date(this.defaultValue);
        this.maxDate = new Date(this.defaultValue);
      } else {
        this.minDate = modifyTime(new Date(), 0, 0, 0);
        this.maxDate = modifyTime(new Date(), 0, 0, 0);
      }
    },
    visible(val) {
      if (val) {
        this.oldValue = this.value;
      }
    },
  },

  methods: {
    adjustSpinners() {
      this.$refs.startSpinner.adjustCurrentSpinner();
      this.$refs.endSpinner.adjustCurrentSpinner();
    },
    handleCancel() {
      this.$emit('pick', this.oldValue, false);
    },
    handleMinChange(date) {
      this.minDate = clearMilliseconds(date);
      this.handleChange();
    },
    handleMaxChange(date) {
      this.maxDate = clearMilliseconds(date);
      this.handleChange();
    },
    handleChange() {
      const step = parseInt(this.interval.step.split(':')[1]);
      if (this.isValidValue([this.minDate, this.maxDate])) {
        this.$refs.startSpinner.selectableRange = [
          modifyTime(this.minDate, 0, 0, 0),
          this.maxDate,
        ];
        this.$refs.endSpinner.selectableRange = [
          this.minDate,
          modifyTime(this.maxDate, 23, step, 0),
        ];
        this.$emit('pick', [this.minDate, this.maxDate], true);
      }
    },
    handleClear() {
      this.$emit('pick', null);
    },
    handleConfirm(visible = false) {
      if (this.isValidValue([this.minDate, this.maxDate])) {
        this.$emit('pick', [this.minDate, this.maxDate], visible);
      } else {
        this.handleCancel();
      }
    },
    isValidValue(date) {
      return Array.isArray(date) && date[0].getTime() <= date[1].getTime();
    },
  },

  mounted() {
    this.minDate = modifyTime(new Date(), 0, 0, 0);
    this.maxDate = modifyTime(new Date(), 0, 0, 0);
    this.oldValue = [
      modifyTime(new Date(), 0, 0, 0),
      modifyTime(new Date(), 0, 0, 0),
    ];
    const date = new Date();
    const step = parseInt(this.interval.step.split(':')[1]);
    this.$refs.startSpinner.selectableRange = [
      new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0),
      new Date(this.maxDate),
    ];
    this.$refs.endSpinner.selectableRange = [
      new Date(this.minDate),
      new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        23,
        step,
        0,
      ),
    ];
  },
};
</script>
<style lang="scss" scoped>
.timeSelectRangePanel {
  width: 290px;
  background: #ffffff;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.2);
  border-radius: 3px;
  border: 1px solid #e1e1e1;
  padding: 16px 20px;
  margin-top: 4px;
  z-index: 20001;
  position: absolute;

  &::after {
    content: "至";
    color: #222222;
    font-size: 12px;
    position: absolute;
    top: 47%;
    left: 136px;
  }

  .select-header-wrapper {
    width: 113px;
  }

  .panel-header {
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
      width: 100%;
      display: inline-block;
      text-align: center;
      font-size: 12px;
      font-family: "MicrosoftYaHei";
      color: #222222;
      line-height: 30px;
      margin-left: -1px;
    }
  }

  .panel-item {
    display: inline-block;
    &:first-child {
      margin-right: 20px;
    }
  }

  .panel-footer {
    width: 246px;
    text-align: right;
    margin-top: 12px;

    button {
      width: 44px;
      padding: 7px;
    }
  }
}
</style>
