// @Author: zhangxu  Date: 2018-11-5 20:44:24
import request from '@/utils/request'

/**
 * 驾驶员信息采集查询
 */
export function diverList(params) {
  return request({
    url: '/event/ic',
    method: 'get',
    params
  })
}
