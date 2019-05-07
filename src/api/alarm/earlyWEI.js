// @Author: zhangxu  Date: 2018-11-5 20:44:24
import request from '@/utils/request'

/**
 * 驾驶员信息采集查询
 */
export function carProofList(params) {
  return request({
    url: '/alarm/evidence',
    method: 'get',
    params
  })
}

/**
 * 证据查询
 */
export function getProofListInfo(params) {
  return request({
    url: '/alarm/evidence/info',
    method: 'get',
    params
  })
}

