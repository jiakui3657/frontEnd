import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/statistics/security/detail',
    method: 'get',
    params
  })
}
