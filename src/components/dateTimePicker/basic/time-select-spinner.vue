<template>
  <div class="time-select-spinner">
    <el-scrollbar
      tag="ul"
      ref="time"
      class="timeSelect-wrapper"
      wrap-style="max-height: inherit;"
      view-class="timeSelect-ul"
      @mousemove.native="adjustCurrentSpinner()"
    >
      <li
        v-for="(disabled, index) in timesList"
        :key="index"
        class="timeSelectSpinner-item"
        :class="{
          active: timesLabelList[index] === currentTime,
          disabled: disabled,
        }"
        @click="handleClick({ value: index, disabled: disabled })"
      >
        {{ timesLabelList[index] }}
      </li>
    </el-scrollbar>
  </div>
</template>
<script>
import { modifyTime } from '../utils/date-util';

const parseTime = function (time) {
  const values = (time || '').split(':');
  if (values.length >= 2) {
    const hours = parseInt(values[0], 10);
    const minutes = parseInt(values[1], 10);
    return {
      hours,
      minutes,
    };
  }
  return null;
};

const compareTime = function (time1, time2) {
  const value1 = parseTime(time1);
  const value2 = parseTime(time2);

  const minutes1 = value1.minutes + value1.hours * 60;
  const minutes2 = value2.minutes + value2.hours * 60;

  if (minutes1 === minutes2) {
    return 0;
  }

  return minutes1 > minutes2 ? 1 : -1;
};

const nextTime = function (time, step) {
  const timeValue = parseTime(time);
  const stepValue = parseTime(step);

  const next = {
    hours: timeValue.hours,
    minutes: timeValue.minutes,
  };

  next.minutes += stepValue.minutes;
  next.hours += stepValue.hours;

  next.hours += Math.floor(next.minutes / 60);
  next.minutes %= 60;

  return formatTime(next);
};

const formatTime = function (time) {
  return `${time.hours < 10 ? `0${time.hours}` : time.hours}:${
    time.minutes < 10 ? `0${time.minutes}` : time.minutes
  }`;
};

const getIntervalTimes = function (ranges, start, end, step) {
  const selectableRange = ranges || ['-1:-1', '100:100'];
  const timesList = [];
  const timesLabelList = [];
  const minTime = selectableRange[0];
  const maxTime = selectableRange[1];

  if (start && end && step) {
    let current = start;
    while (compareTime(current, end) <= 0) {
      const disabled =
        compareTime(current, minTime) < 0 || compareTime(current, maxTime) > 0;
      timesList.push(disabled);
      timesLabelList.push(current);

      current = nextTime(current, step);
    }
  }

  return { timesList, timesLabelList };
};

export default {
  data() {
    return {
      selectableRange: [],
    };
  },

  props: {
    date: {},
    interval: {}, // start, end, step,
  },

  computed: {
    timesList() {
      return getIntervalTimes(
        this.formattedranges,
        this.interval.start,
        this.interval.end,
        this.interval.step,
      ).timesList;
    },
    timesLabelList() {
      return getIntervalTimes(
        this.formattedranges,
        this.interval.start,
        this.interval.end,
        this.interval.step,
      ).timesLabelList;
    },
    currentTime() {
      const hours = this.date.getHours();
      const minutes = this.date.getMinutes();
      return `${hours < 10 ? `0${hours}` : hours}:${
        minutes < 10 ? `0${minutes}` : minutes
      }`;
    },
    formattedranges() {
      const min = new Date(this.selectableRange[0]);
      const max = new Date(this.selectableRange[1]);
      if (min instanceof Date && max instanceof Date) {
        const formattedMin = formatTime({
          hours: min.getHours(),
          minutes: min.getMinutes(),
        });
        const formattedMax = formatTime({
          hours: max.getHours(),
          minutes: max.getMinutes(),
        });
        return [formattedMin, formattedMax];
      }
      return this.selectableRange;
    },
  },

  methods: {
    adjustSpinners(value) {
      const el = this.$refs.time.wrap;
      if (el) {
        el.scrollTop = Math.max(0, value * this.typeItemHeight());
      }
    },
    adjustCurrentSpinner() {
      const value = this.timesLabelList.indexOf(this.currentTime);
      this.adjustSpinners(value);
    },
    typeItemHeight() {
      return this.$refs.time.$el.querySelector('li').offsetHeight;
    },
    scrollBarHeight() {
      return this.$refs.time.$el.offsetHeight;
    },
    bindScrollEvent() {
      this.$refs.time.wrap.onscroll = (e) => {
        this.handleScroll(e);
      };
    },
    handleScroll(e) {
      const max = this.timesList.length;
      const value = Math.min(
        Math.round(
          (this.$refs.time.wrap.scrollTop -
            (this.scrollBarHeight() * 0.5 - 10) / this.typeItemHeight() +
            3) /
            this.typeItemHeight(),
        ),
        max,
      );
      this.modifyDateField(value);
    },
    handleClick({ value, disabled }) {
      if (!disabled) {
        this.modifyDateField(value);
        this.adjustSpinners(value);
      }
    },
    modifyDateField(value) {
      const time = this.timesLabelList[value].split(':');
      const hour = parseInt(time[0]);
      const minute = parseInt(time[1]);
      this.$emit('change', modifyTime(this.date, hour, minute, 0));
    },
  },

  mounted() {
    this.$nextTick(() => {
      this.bindScrollEvent();
      if (this.date.getHours() === '0' && this.date.getMinutes() === '0') {
        this.handleScroll();
      }
    });
  },
};
</script>
<style lang="scss" scoped>
.time-select-spinner {
  width: 113px;
  border-radius: 2px;
  border: 1px solid #e1e1e1;
  padding: 0 16px;
  .timeSelect-wrapper {
    width: 100%;
    max-height: 240px;
    display: inline-block;
    &::before {
      content: "";
      background-color: #e6f1ff;
      position: absolute;
      border-top: 16px solid #e6f1ff;
      border-bottom: 16px solid #e6f1ff;
      border-left: 31px solid #e6f1ff;
      border-right: 31px solid #e6f1ff;
      border-radius: 3px;
      z-index: -1;
      left: 5px;
      top: 43%;
    }
  }

  ::v-deep .timeSelect-ul {
    list-style: none;
    padding-inline-start: 0;
    text-align: center;
    &::before,
    &::after {
      content: "";
      display: block;
      width: 100%;
      height: 96px;
    }
  }

  .timeSelectSpinner-item {
    line-height: 32px;
    font-size: 14px;
    color: #222222;
    margin-bottom: 1px;
    margin: 0 16px 0 8px;
    border-radius: 3px;
    cursor: pointer;
  }

  .active {
    color: #0a7cff;
    // background-color: #E6F1FF;
    font-weight: bold;
  }

  .disabled {
    color: #999999;
    cursor: not-allowed;
  }
}
</style>
