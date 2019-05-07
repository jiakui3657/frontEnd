import request from '@/utils/request'
/**
 * 企业车辆数据对比分析
 */
export function tableNum(query) {
  return request({
    url: '/enterpriseData/tableNum',
    method: 'get',
    params: query
  })
}
/**
 * 企业运行数据分析趋势
 */
export function runningChange(query) {
  return request({
    url: '/enterpriseData/runningChange',
    method: 'get',
    params: query
  })
}

/**
 * 车辆数据对比分析导出
 */
export function enterpriseexcel(query) {
  return request({
    responseType: 'blob',
    url: '/enterpriseData/excel',
    method: 'get',
    params: query
  })
}
