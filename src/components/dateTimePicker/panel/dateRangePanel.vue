<template>
  <transition name="el-zoom-in-top">
    <div v-show="visible" class="date-range-panel">
      <!-- min date -->
      <div class="panel-item">
        <div class="header-wrapper">
          <ul class="datePanel-header">
            <li>年</li>
            <li>月</li>
            <li>日</li>
          </ul>
        </div>
        <date-spinner
          ref="minSpinner"
          :date="minDate"
          @change="handleMinChange"
        ></date-spinner>
      </div>
      <!-- max date -->
      <div class="panel-item">
        <div class="header-wrapper">
          <ul class="datePanel-header">
            <li>年</li>
            <li>月</li>
            <li>日</li>
          </ul>
        </div>
        <date-spinner
          ref="maxSpinner"
          :date="maxDate"
          @change="handleMaxChange"
        ></date-spinner>
      </div>
      <div class="panel-footer">
        <div class="footer-left">
          <span class="shortcuts" @click="handleShortCut(3)">近三天</span>
          <span class="shortcuts" @click="handleShortCut(7)">近一周</span>
          <span class="shortcuts" @click="handleShortCut(30)">近一个月</span>
          <span class="shortcuts" @click="handleShortCut(180)">近六个月</span>
        </div>
        <div class="footer-right">
          <el-button size="mini" @click="handleCancel">取消</el-button>
          <el-button
            size="mini"
            type="primary"
            @click="handleConfirm()"
            :disabled="!isValidValue([minDate, maxDate])"
            >确定</el-button
          >
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import dateSpinner from '../basic/date-spinner.vue';
import { isDate, clearMilliseconds } from '../utils/date-util';

export default {
  components: { dateSpinner },

  data() {
    return {
      minDate: new Date(),
      maxDate: new Date(),
      value: [],
      oldValue: [new Date(), new Date()],
      format: 'yyyy-MM-dd',
      visible: false,
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
        this.minDate = new Date();
        this.maxDate = new Date();
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
      this.$refs.minSpinner.adjustSpinners();
      this.$refs.maxSpinner.adjustSpinners();
    },
    handleCancel() {
      this.$emit('pick', this.oldValue);
    },
    handleConfirm(visible = false) {
      if (this.isValidValue([this.minDate, this.maxDate])) {
        this.$emit('pick', [this.minDate, this.maxDate], visible);
      } else {
        this.handleCancel();
      }
    },
    handleClear() {
      this.$emit('pick', null);
    },
    handleChange() {
      if (this.isValidValue([this.minDate, this.maxDate])) {
        this.$refs.minSpinner.selectableRange = [
          Number.NEGATIVE_INFINITY,
          this.maxDate,
        ];
        this.$refs.maxSpinner.selectableRange = [
          this.minDate,
          Number.POSITIVE_INFINITY,
        ];
        this.$emit('pick', [this.minDate, this.maxDate], true);
      }
    },
    handleMinChange(date) {
      this.minDate = clearMilliseconds(date);
      this.handleChange();
    },
    handleMaxChange(date) {
      this.maxDate = clearMilliseconds(date);
      this.handleChange();
    },
    handleShortCut(num) {
      this.minDate.setTime(this.maxDate.getTime() - 3600 * 1000 * 24 * num);
      this.$emit('pick', [this.minDate, this.maxDate], false);
    },
    isValidValue(value) {
      return (
        Array.isArray(value) &&
        value &&
        value[0] &&
        value[1] &&
        isDate(value[0]) &&
        isDate(value[1]) &&
        value[0].getTime() <= value[1].getTime()
      );
    },
  },
};
</script>
<style lang="scss" scoped>
.date-range-panel {
  width: 496px;
  background: #ffffff;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.2);
  border-radius: 3px;
  border: 1px solid #e1e1e1;
  margin-top: 4px;
  padding: 17px 20px;
  z-index: 20001;
  position: absolute;

  &::after {
    content: "至";
    color: #222222;
    font-size: 12px;
    position: absolute;
    top: 47%;
    left: 240px;
  }

  .header-wrapper {
    width: 216px;
  }

  .datePanel-header {
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

  .panel-item {
    display: inline-block;
    &:first-child {
      margin-right: 20px;
    }
  }

  .panel-footer {
    width: 454px;
    display: flex;
    justify-content: space-between;
    margin-top: 12px;

    .shortcuts {
      display: inline-block;
      font-size: 12px;
      line-height: 28px;
      margin-right: 20px;
      color: #222222;
      cursor: pointer;
      &:hover {
        color: #0a7cff;
      }
    }

    button {
      width: 44px;
      padding: 7px;
    }
  }
}
</style>
