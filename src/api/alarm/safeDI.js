// @Author: outman_qiaopeng  Date: 2018-09-12 14:44:24
import request from '@/utils/request'

/**
 * 列表查询
 */
export function safeidList(prodata) {
  return request({
    url: '/sys/alarmInfo',
    method: 'get',
    params: prodata
  })
}
/**
 * 树列表查询
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
