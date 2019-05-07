
import _ from 'lodash'
export function formatDate(date, fmt) {
  if (!_.isDate(date)) {
    date = new Date(date)
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  const o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      const str = o[k] + ''
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : padLeftZero(str))
    }
  }
  return fmt
}

function padLeftZero(str) {
  return ('00' + str).substr(str.length)
}
/**
 * 获取年的第N个季度的开始时间
 * @param {String} year
 * @param {Number} n
 * @param {String} fmt
 */
export function getQuarterStartMonth(year, n, fmt) {
  var quarterStartDate = new Date(year, getQuarterStartMonthByN(n), 1)
  return formatDate(quarterStartDate, fmt)
}

function getQuarterStartMonthByN(n) {
  var quarterStartMonth = 0
  switch (n) {
    case 1:
      quarterStartMonth = 0
      break
    case 2:
      quarterStartMonth = 3
      break
    case 3:
      quarterStartMonth = 6
      break
    case 4:
      quarterStartMonth = 9
      break
  }
  return quarterStartMonth
}
/**
 * 获取年的第N个季度的结束时间
 * @param {String} year
 * @param {Number} n
 * @param {String} fmt
 */
export function getQuarterEndMonth(year, n, fmt) {
  var quarterEndMonth = getQuarterStartMonthByN(n) + 2
  var quarterStartDate = new Date(year, quarterEndMonth, getMonthDays(year, quarterEndMonth))
  return formatDate(quarterStartDate, fmt)
}

// 获得某月的天数
function getMonthDays(y, m) {
  var monthStartDate = new Date(y, m, 1)
  var monthEndDate = new Date(y, m + 1, 1)
  var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24)
  return days
}

/**
 * 将时长转换为时长字符串
 * @param {int} StatusMinute
 */
export function timeStamp(StatusMinute) {
  var day = parseInt(StatusMinute / 60 / 24)
  var hour = parseInt(StatusMinute / 60 % 24)
  var min = parseInt(StatusMinute % 60)
  StatusMinute = ''
  if (day > 0) {
    StatusMinute = day + '天'
  }
  if (hour > 0) {
    StatusMinute += hour + '小时'
  }
  if (min > 0) {
    StatusMinute += parseFloat(min) + '分钟'
  }
  return StatusMinute
}

/**
 * 获得当前的前N个月
 */

export function strToDate(str) {
  var val = Date.parse(str)
  var newDate = new Date(val)
  return newDate
}

export function addMonth(date, month) {
  var strDate
  var oldDate = strToDate(date)
  var newDate = strToDate(date)
  newDate.setMonth(newDate.getMonth() + month)
  var yy1 = newDate.getFullYear()
  // 因为getMonth（）返回值是 0（一月） 到 11（十二月） 之间的一个整数。所以要给其加1
  var mm1 = newDate.getMonth() + 1
  var dd1 = newDate.getDate()
  if (mm1 < 10) {
    mm1 = '0' + mm1
  }
  if (dd1 < 10) {
    dd1 = '0' + dd1
  }
  // 预计结束日期=开始日期+期限
  // 月末,getDaysInMonth()获取该月的最后一天
  if (oldDate.getDate() === newDate.getDate()) {
    strDate = yy1 + '-' + mm1 + '-' + dd1
  } else {
    strDate = yy1 + '-' + newDate.getMonth() + '-' + new Date(yy1, newDate.getMonth(), 0).getDate()
  }
  console.log(strDate)
  return strDate
}

/**
 * 获得当前前N天
 */
export function getDate(number) {
  const start = new Date()
  start.setTime(start.getTime() - 3600 * 1000 * 24 * number)
  return start
}
/**
 * 获得当前后N天
 */
export function getDateEnd(number) {
  const start = new Date()
  start.setTime(start.getTime() + 3600 * 1000 * 24 * number)
  return start
}

/**
 * 获得两个日期之日期的数组
 */
export function getAll(begin, end) {
  const arr = []
  const ab = begin.split('-')
  const ae = end.split('-')
  const db = new Date()
  db.setUTCFullYear(ab[0], ab[1] - 1, ab[2])
  const de = new Date()
  de.setUTCFullYear(ae[0], ae[1] - 1, ae[2])
  const unixDb = db.getTime() - 24 * 3600 * 1000
  const unixDe = de.getTime()
  for (let i = unixDb; i <= unixDe; i++) {
    i = i + 24 * 3600 * 1000
    arr.push(formatDate(i, 'yyyy-MM-dd'))
  }
  return arr
}

/**
 * 判断是否安装flash
 */
export function getBrowser() {
  var swf = false
  if (typeof window.ActiveXObject !== 'undefined') {
    swf = new window.ActiveXObject('ShockwaveFlash.ShockwaveFlash')
  } else {
    swf = navigator.plugins['Shockwave Flash']
  }
  return swf
}
