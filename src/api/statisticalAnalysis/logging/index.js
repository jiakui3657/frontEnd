import request from '@/utils/request'

export function getLogin(params) {
  return request({
    url: '/upms/log/login',
    method: 'get',
    params
  })
}
