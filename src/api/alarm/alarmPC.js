// @Author: outman_qiaopeng  Date: 2018-09-12 14:44:24
import request from '@/utils/request'

/**
 * 预警列表查询(树列表)
 */
export function treeList() {
  return request({
    url: '/sys/dept/tree',
    method: 'get'
  })
}
/**
 * 车辆列表查询
 */
export function carlist(prodata) {
  return request({
    url: '/base/vehicle',
    method: 'get',
    params: prodata
  })
}

/**
 * 未处理查询
 */
export function alarmlist(prodata) {
  return request({
    url: '/alarm/record/callCore',
    method: 'get',
    params: prodata
  })
}

/**
 * 报警类型树的查询
 */
export function alarmtypetree() {
  return request({
    url: '/alarm/record/callAlarmtype',
    method: 'get'
  })
}
