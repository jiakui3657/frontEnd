import request from '@/utils/request'
/**
 * 企业报警处理汇总
 */

export function enterpriseAlarm(query) {
  return request({
    url: '/platform/enterprise/alarmprocessin',
    method: 'get',
    params: query
  })
}

/**
 * 企业报警处理汇总导出
 */

export function enterpriseAlarmeexcel(query) {
  return request({
    responseType: 'blob',
    url: '/platform/enterprise/alarmexcel',
    method: 'get',
    params: query
  })
}

/**
 * 企业报警类型分布
 */

export function enterpriseAlarmdetails(query) {
  return request({
    url: '/platform/enterprise/detailsPalarmprocessin',
    method: 'get',
    params: query
  })
}

/**
 * 企业报警趋势分析
 */

export function enterpriseAlarmType(query) {
  return request({
    url: '/platform/enterprise/typePalarmprocessin',
    method: 'get',
    params: query
  })
}
