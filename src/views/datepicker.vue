<template>
  <div class="datePicker">
    <h4>时间及时间范围任意选择</h4>

    <time-picker
      v-model="timeValue"
      @change="handleChange"
      class="haveDone"
      :picker-options="{
        selectableRange: '18:30:00 - 20:30:00',
      }"
    ></time-picker>
    <div class="haveDone">
      <time-picker
        v-model="timeRangeValue"
        isRange
        @change="handleChange"
      ></time-picker>
    </div>
    <el-divider></el-divider>
    <h4>日期及日期范围任意选择</h4>
    <date-picker
      v-model="dateValue"
      class="haveDone"
      @change="handleChange"
      :picker-options="{
        selectableRange: '2022-08-01 - 2022-08-31',
      }"
    ></date-picker>
    <div class="haveDone">
      <date-picker
        v-model="dateRangeValue"
        type="daterange"
        @change="handleChange"
      ></date-picker>
    </div>
    <el-divider></el-divider>
    <h4>日期时间选择</h4>
    <div class="haveDone">
      <date-picker
        v-model="datetimeValue"
        type="datetime"
        @change="handleChange"
      ></date-picker>
    </div>
    <div class="haveDone">
      <date-picker
        v-model="dateTimeSelectValue"
        @change="handleChange"
        type="datetimeselect"
      ></date-picker>
    </div>
    <el-divider></el-divider>
    <h4>固定时间点选择</h4>
    <div class="haveDone">
      <time-select
        v-model="timeSelectValue"
        @change="handleChange"
        type="time-select"
      ></time-select>
    </div>

    <div class="haveDone">
      <time-select
        v-model="timeSelectRangeValue"
        @change="handleChange"
        type="time-selectrange"
      ></time-select>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import timePicker from '@/components/dateTimePicker/picker/time-picker.js';
import datePicker from '@/components/dateTimePicker/picker/date-picker.js';
import timeSelect from '@/components/dateTimePicker/picker/time-select.js';

@Component({
  name: 'datePickerView',
  components: { timePicker, datePicker, timeSelect },
})
export default class datePickerView extends Vue {
  timeValue = '16:30:30';
  dateValue = '2022-08-27';

  timeRangeValue = '';
  dateRangeValue = ['2022-08-01', '2022-08-30'];

  datetimeValue = 'Mon Aug 29 2022 08:57:04 GMT+0800 (中国标准时间)';
  timeSelectValue = '10:30:00';

  dateTimeSelectValue = 'Tue Aug 30 2022 00:00:00 GMT+0800 (中国标准时间)';
  timeSelectRangeValue = ['00:00', '07:30'];

  handleChange(val: any) {
    console.log(val, 'val');
  }
}
</script>
<style lang="scss" scoped>
.haveDone {
  margin: 0 40px;
  display: inline-block;
}
</style>
