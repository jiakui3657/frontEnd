// @Author: outman_qiaopeng  Date: 2018-09-12 14:44:24
import request from '@/utils/request'

/**
 * 查岗中心列表
 */
export function checkCenter(prodata) {
  return request({
    url: '/moni/platforminfo/inspect',
    method: 'get',
    params: prodata
  })
}
