import request from '@/utils/request'

/**
 * 分页获取督办列表
 * @param {*} query 查询参数，json格式
 */
export function getData(query) {
  return request({
    url: '/alarm/urge',
    method: 'get',
    params: query
  })
}

/**
 * 分页获取平台查岗列表
 * @param {*} query 查询参数，json格式
 */
export function fetchData(query) {
  return request({
    url: '/platfrom/info',
    method: 'get',
    params: query
  })
}
