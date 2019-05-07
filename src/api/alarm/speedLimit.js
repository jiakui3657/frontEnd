import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/alarm/record/speeding',
    method: 'get',
    params
  })
}

export function getDict(type) {
  return request({
    url: `/sys/dict/downMenu/${type}`,
    method: 'get'
  })
}
