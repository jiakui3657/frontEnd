// @Author: outman_qiaopeng  Date: 2018-09-12 14:44:24
import request from '@/utils/request'

/**
 * 公告中心列表
 */

export function moniCenter(prodata) {
  return request({
    url: '/moni/platforminfo/core',
    method: 'get',
    params: prodata
  })
}

/**
 *查岗对象类型
 */

export function lookupOptions(prodata) {
  return request({
    url: '/moni/platforminfo/objectType',
    method: 'get',
    params: prodata
  })
}
