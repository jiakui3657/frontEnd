import request from '@/utils/request'
/**
 * 企业运营综合分析
 */
export function tableNum(query) {
  return request({
    url: '/enterprise/tableNum',
    method: 'get',
    params: query
  })
}
/**
 * 车辆入网排名
 */
export function vehicleNetwork(query) {
  return request({
    url: '/enterprise/vehicleNetwork',
    method: 'get',
    params: query
  })
}
/**
 * 车辆上线排名
 */
export function vehicleUpLine(query) {
  return request({
    url: '/enterprise/vehicleUpLine',
    method: 'get',
    params: query
  })
}
/**
 * 车辆报警排名
 */
export function vehicleAlarm(query) {
  return request({
    url: '/enterprise/vehicleAlarm',
    method: 'get',
    params: query
  })
}
/**
 * 违规排名
 */
export function violation(query) {
  return request({
    url: '/enterprise/violation',
    method: 'get',
    params: query
  })
}
/**
 * 违规排名
 */
export function prevention(query) {
  return request({
    url: '/enterprise/prevention',
    method: 'get',
    params: query
  })
}

/**
 * 企业入网率趋势
 */

export function networkTrend(query) {
  return request({
    url: '/enterprise/networkTrend',
    method: 'get',
    params: query
  })
}

/**
 * 企业上线率趋势
 */

export function upLineTrend(query) {
  return request({
    url: '/enterprise/upLineTrend',
    method: 'get',
    params: query
  })
}

/**
 * 企业报警处理率趋势
 */

export function alarmTrend(query) {
  return request({
    url: '/enterprise/alarmTrend',
    method: 'get',
    params: query
  })
}

/**
 * 企业防控趋势
 */

export function preventionTrend(query) {
  return request({
    url: '/enterprise/preventionTrend',
    method: 'get',
    params: query
  })
}

/**
 * 企业百公里防控趋势
 */

export function kilometersPreventionTrend(query) {
  return request({
    url: '/enterprise/kilometersPreventionTrend',
    method: 'get',
    params: query
  })
}

/**
 * 防控报警分布
 */

export function preventionDistributed(query) {
  return request({
    url: '/enterprise/preventionDistributed',
    method: 'get',
    params: query
  })
}

/**
 * 企业运营评分导出
 */

export function enterpriseExcel(query) {
  return request({
    responseType: 'blob',
    url: '/enterprise/excel',
    method: 'get',
    params: query
  })
}
