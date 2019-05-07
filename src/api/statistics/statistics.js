import request from '@/utils/request'

/**
 * 报警汇总报表
 */

export function alarmSummary(prodata) {
  return request({
    url: '/statistics/alarm/summary',
    method: 'get',
    params: prodata
  })
}

/**
 * 报警汇总报表Excel导出
 */
export function alarmExcel(prodata) {
  return request({
    responseType: 'blob',
    url: '/statistics/alarm/excel',
    method: 'get',
    params: prodata
  })
}

/**
 * 报警汇总报表（报警趋势图）
 */

export function trenddiagram(prodata) {
  return request({
    url: '/statistics/alarm/trenddiagram',
    method: 'get',
    params: prodata
  })
}

/**
 * 报警明细报表
 */

export function alarmDetail(prodata) {
  return request({
    url: '/statistics/alarm/detail',
    method: 'get',
    params: prodata
  })
}

/**
 * 报警明细报表Excel导出
 */
export function excelDetail(prodata) {
  return request({
    responseType: 'blob',
    url: '/statistics/alarm/excelDetail',
    method: 'get',
    params: prodata
  })
}

/**
 * 事故报警
 */

export function accidentAlarm(prodata) {
  return request({
    url: '/statistics/alarm/accident',
    method: 'get',
    params: prodata
  })
}

/**
 * 报警处理率
 */
export function alarmHandlerList(prodata) {
  return request({
    url: '/statistics/alarm/handler',
    method: 'get',
    params: prodata
  })
}

/**
 * 报警处理率excel
 */
export function alarmHandlerExcel(prodata) {
  return request({
    responseType: 'blob',
    url: '/statistics/alarm/handlerExcel',
    method: 'get',
    params: prodata
  })
}

/**
 * 报警响应时长
 */
export function getAlarmTimeList(prodata) {
  return request({
    url: '/statistics/alarm/alarmtime',
    method: 'get',
    params: prodata
  })
}

/**
 * 报警响应时长excel
 */
export function getAlarmTimeExcel(prodata) {
  return request({
    responseType: 'blob',
    url: '/statistics/alarm/alarmTimeExcel',
    method: 'get',
    params: prodata
  })
}

/**
 * 平台连通率
 */
export function platFormList(prodata) {
  return request({
    url: '/statistics/alarm/plat',
    method: 'get',
    params: prodata
  })
}

/**
 * 平台连通率
 */
export function platExcel(prodata) {
  return request({
    responseType: 'blob',
    url: '/statistics/alarm/platExcel',
    method: 'get',
    params: prodata
  })
}

/**
 * 报警数据合格率
 */
export function startnumber(prodata) {
  return request({
    url: '/statistics/alarm/startNumber',
    method: 'get',
    params: prodata
  })
}

/**
 * 报警数据合格率
 */
export function startNumberExcel(prodata) {
  return request({
    responseType: 'blob',
    url: '/statistics/alarm/startNumberExcel',
    method: 'get',
    params: prodata
  })
}

/**
 * 督办处理率
 */
export function overseeRates(prodata) {
  return request({
    url: '/statistics/alarm/overseeRates',
    method: 'get',
    params: prodata
  })
}

/**
 * 督办处理率
 */
export function overseeExcel(prodata) {
  return request({
    responseType: 'blob',
    url: '/statistics/alarm/overseeExcel',
    method: 'get',
    params: prodata
  })
}

/**
 * 查岗处理率
 */
export function inspection(prodata) {
  return request({
    url: '/statistics/alarm/inspection',
    method: 'get',
    params: prodata
  })
}

/**
 * 查岗处理率
 */
export function inspectionExcel(prodata) {
  return request({
    responseType: 'blob',
    url: '/statistics/alarm/inspectionExcel',
    method: 'get',
    params: prodata
  })
}

/**
 * 企业里程汇总报表
 */

export function enterpriseMileageSummary(prodata) {
  return request({
    url: '/statistics/mileage/enterprisesummary',
    method: 'get',
    params: prodata
  })
}

/**
 * 企业里程汇总报表Excel导出
 */
export function enterpriseMileageExcel(prodata) {
  return request({
    responseType: 'blob',
    url: '/statistics/mileage/enterpriseexcel',
    method: 'get',
    params: prodata
  })
}

/**
 * 企业里程汇总报表统计图
 */
export function enterprisetrend(prodata) {
  return request({
    url: '/statistics/mileage/enterprisetrend',
    method: 'get',
    params: prodata
  })
}

/**
 * 企业行驶汇总报表
 */

export function enterpriseTravelSummary(prodata) {
  return request({
    url: '/statistics/travel/enterprisesummary',
    method: 'get',
    params: prodata
  })
}

/**
 *企业上线率汇总报表
 */

export function enterpriseonlineSummary(prodata) {
  return request({
    url: '/statistics/online/enterprisesummary',
    method: 'get',
    params: prodata
  })
}

/**
 * 企业上线率汇总报表Excel导出
 */

export function enterpriseonlineexcel(prodata) {
  return request({
    responseType: 'blob',
    url: '/statistics/online/enterpriseexcel',
    method: 'get',
    params: prodata
  })
}

/**
 * 企业上线率汇总报表统计图
 */
export function summaryday(prodata) {
  return request({
    url: '/statistics/online/summaryday',
    method: 'get',
    params: prodata
  })
}

/**
 *企业在线率明细报表
 */

export function enterpriseOnlineDetail(prodata) {
  return request({
    url: '/statistics/online/enterprisedetail',
    method: 'get',
    params: prodata
  })
}

/**
 * 企业凌晨营运汇总报表
 */
export function enterprisWeeHoursSummary(prodata) {
  return request({
    url: '/statistics/weehours/enterprisesummary',
    method: 'get',
    params: prodata
  })
}

/**
 * 企业凌晨营运明细报表
 */

export function enterprisWeeHoursDetail(prodata) {
  return request({
    url: '/statistics/weehours/enterprisedetail',
    method: 'get',
    params: prodata
  })
}

/**
 * 车辆里程汇总列表
 */

export function vehiclerunSummary(prodata) {
  return request({
    url: '/statistics/vehiclerun/summary',
    method: 'get',
    params: prodata
  })
}

/**
 * 车辆里程汇总-里程趋势分析
 */

export function summaryImage(prodata) {
  return request({
    url: '/statistics/vehiclerun/summaryImage',
    method: 'get',
    params: prodata
  })
}

/**
 * 车辆里程明细列表
 */

export function summaryInfo(prodata) {
  return request({
    url: '/statistics/vehiclerun/summaryInfo',
    method: 'get',
    params: prodata
  })
}

/**
 * 车辆在线率明细列表
 */

export function onlineRate(prodata) {
  return request({
    url: '/statistics/vehiclerun/onlineRate',
    method: 'get',
    params: prodata
  })
}

/**
 * 车辆在线率明细列表
 */

export function onlineRateExcel(prodata) {
  return request({
    responseType: 'blob',
    url: '/statistics/vehiclerun/onlineRateExcel',
    method: 'get',
    params: prodata
  })
}

/**
 * 车辆行车汇总
 */
export function runSummary(prodata) {
  return request({
    url: 'statistics/vehiclerun/runSummary',
    method: 'get',
    params: prodata
  })
}

/**
 * 车辆行车明细
 */
export function runDetail(prodata) {
  return request({
    url: '/statistics/vehiclerun/runDetail',
    method: 'get',
    params: prodata
  })
}

/**
 * 车辆行车明细
 */
export function detailEcexl(prodata) {
  return request({
    responseType: 'blob',
    url: '/statistics/vehiclerun/detailEcexl',
    method: 'get',
    params: prodata
  })
}
