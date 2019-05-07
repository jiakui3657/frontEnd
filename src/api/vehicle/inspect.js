import request from '@/utils/request'

export function getPlatforminfo(query) {
  return request({
    url: '/moni/platforminfo',
    method: 'get',
    params: query
  })
}

export function postPlatforminfo(data) {
  return request({
    url: '/moni/platforminfo',
    method: 'post',
    data
  })
}
