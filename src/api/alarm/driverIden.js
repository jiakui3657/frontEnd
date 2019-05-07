// @Author: zhangxu  Date: 2018-11-7 20:44:24
import request from '@/utils/request'

/**
 * 驾驶员信息采集查询
 */
export function driverIden(params) {
  return request({
    url: '/event/driver',
    method: 'get',
    params
  })
}

/**
 * 人员识别
 */
export function driverStatus(params) {
  return request({
    url: `/event/${params.id}?status=${params.status}`,
    method: 'put'
  })
}
