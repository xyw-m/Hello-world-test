import fecha from 'element-ui/src/utils/date.js'

function newArray(start, end){
  let result = []
  for(let i = start; i <= end; i++){
    result.push(i)
  }
  return result
}

function setRangeData(arr, start, end, value){
  for (let i = start; i < end; i++) {
    arr[i] = value;
  } 
}



export function isDate(date){
  if(date === null || date === undefined) return false
  if(isNaN(new Date(date).getTime())) return false
  if(Array.isArray(date)) return false
  return true
}

export function isDateObject(val){
  return val instanceof Date
}

export function toDate(date){
  return isDate(date) ? new Date(date) : null
}

export function formatDate(date, format){
  date = toDate(date)
  if(!date) return ''
  return fecha.format(date, format || '')
}

export function parseDate(string, format){
  return fecha.parse(string, format || 'yyyy-MM-dd')
}

export function getRangeYears(oldRanges, date,  ranges){
  let yearsLabel 
  const currYear = date.getFullYear() || new Date().getFullYear()
  let disabledYears = []
  const yearsList = []
  let yearsRanges = oldRanges || []

  // 禁用逻辑

  const dateRanges = Array.from({length: 20}, (item, index) => currYear + index - 10 + 1)

  // 判断谁在前面
  if(yearsRanges.length == 0 || dateRanges[dateRanges.length - 1] < yearsRanges[yearsRanges.length - 1]){
    yearsLabel = Array.from(new Set(dateRanges.concat(yearsRanges)));
  } else {
    yearsLabel = Array.from(new Set(yearsRanges.concat(dateRanges)));
  }
  

  (ranges || []).forEach(range => {
    const value = range.map(date => date.getFullYear())
    disabledYears = disabledYears.concat(newArray(value[0], value[1]))
  })

  if(disabledYears.length){
    for(let i = 0; i < yearsLabel.length; i++){
      yearsList[i] = disabledYears.indexOf(yearsLabel[i]) === -1
    } 
  } else {
    for(let i = 0; i < yearsLabel.length; i++){
      yearsList[i] = false
    }
  }

  return { yearsList, yearsLabel}
}

export function getRangeMonths(ranges){
  const months = []
  let disabledMonths = [];

  (ranges || []).forEach(range => {
    const value = range.map(date => date.getMonth())
    disabledMonths = disabledMonths.concat(newArray(value[0], value[1]))
  })

  if(disabledMonths.length){
    for(let i = 0; i < 12; i++){
      months[i] = disabledMonths.indexOf(i) === -1
    }
  } else {
    for(let i = 0; i < 12; i++){
      months[i] = false
    }
  }

  return months
}

export function getRangeDays(current, ranges){
  const days = []
  const currentDate = current || new Date()
  const monthLength = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  let disabledDays = [];

  (ranges || []).forEach(range => {
    const value = range.map(date => date.getDate())
    disabledDays = disabledDays.concat(newArray(value[0], value[1]))
  })

  if(disabledDays.length){
    for(let i = 0; i < monthLength; i++){
      days[i] = disabledDays.indexOf(i) === -1
    }
  } else {
    for(let i = 0; i < monthLength; i++){
      days[i] = false
    }    
  }

  return days
}

export function getRangeHours(ranges){
  const hours = []
  let disabledHours = [];

  // 范围选择逻辑
  (ranges || []).forEach(range => {
    const value = range.map(date => date.getHours());

    disabledHours = disabledHours.concat(newArray(value[0], value[1]));
  });

  if (disabledHours.length) {
    for (let i = 0; i < 24; i++) {
      hours[i] = disabledHours.indexOf(i) === -1;
    }
  } else {
    for (let i = 0; i < 24; i++) {
      hours[i] = false;
    }
  }

  return hours
}



export function getRangeMinutes(ranges, hour){
  const minutes = new Array(60)

  if(ranges.length > 0){
    ranges.forEach(range => {
      const start = range[0];
      const end = range[1];
      const startHour = start.getHours();
      const startMinute = start.getMinutes();
      const endHour = end.getHours();
      const endMinute = end.getMinutes();
      if (startHour === hour && endHour !== hour) {
        setRangeData(minutes, startMinute, 60, true);
      } else if (startHour === hour && endHour === hour) {
        setRangeData(minutes, startMinute, endMinute + 1, true);
      } else if (startHour !== hour && endHour === hour) {
        setRangeData(minutes, 0, endMinute + 1, true);
      } else if (startHour < hour && endHour > hour) {
        setRangeData(minutes, 0, 60, true);
      }
    })
  } else {
    setRangeData(minutes, 0, 60, true);
  }
  return minutes
}

export function getWeekNumber(src){
  if(!isDate(src)) return null
  const date = new Date(src.getTime())
  date.setHours(0,0,0,0)
  // 
}

export function modifyTime(date, h, m, s){
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), h, m, s, date.getMilliseconds())
}

export const modifyDate = function(date, y, m, d) {
  return new Date(y, m, d, date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
};

export function clearMilliseconds(date){
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), 0)
}

export function timeWithinRange(date, selectableRange, format){
  const limitedDate = limitTimeRange(date, selectableRange, format)
  return limitedDate.getTime() === date.getTime()
}

export const limitTimeRange = function(date, ranges, format = 'HH:mm:ss') {
  // TODO: refactory a more elegant solution
  if (ranges.length === 0) return date;
  const normalizeDate = date => fecha.parse(fecha.format(date, format), format);
  const ndate = normalizeDate(date);
  const nranges = ranges.map(range => range.map(normalizeDate));
  if (nranges.some(nrange => ndate >= nrange[0] && ndate <= nrange[1])) return date;

  let minDate = nranges[0][0];
  let maxDate = nranges[0][0];

  nranges.forEach(nrange => {
    minDate = new Date(Math.min(nrange[0], minDate));
    maxDate = new Date(Math.max(nrange[1], minDate));
  });

  const ret = ndate < minDate ? minDate : maxDate;
  // preserve Year/Month/Date
  return modifyDate(
    ret,
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
};