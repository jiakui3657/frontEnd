import request from '@/utils/request'
/**
 * 驾驶员行为分析
 */
export function getTableData(query) {
  return request({
    url: '/driverBehavior/comparaAnalysis',
    method: 'get',
    params: query
  })
}
/**
 * 指数排名
 */
export function getIndexRank(query) {
  return request({
    url: '/driverBehavior/indexRanking',
    method: 'get',
    params: query
  })
}
/**
 * 驾驶员报警趋势
 */
export function getAlarmTrend(query) {
  return request({
    url: '/driverBehavior/driverAlarmTrend',
    method: 'get',
    params: query
  })
}
/**
 * 驾驶员百公里报警趋势
 */
export function getAlarmHundred(query) {
  return request({
    url: '/driverBehavior/driverHundredAlarmTrend',
    method: 'get',
    params: query
  })
}
/**
 * 驾驶员报警类型趋势
 */
export function getAlarmType(query) {
  return request({
    url: '/homePageStatis/alarmTypeInfo',
    method: 'get',
    params: query
  })
}

/**
 * 导出
 */

export function driverExcel(query) {
  return request({
    responseType: 'blob',
    url: '/driverBehavior/driverExcel',
    method: 'get',
    params: query
  })
}
