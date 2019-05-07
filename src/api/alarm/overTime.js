import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/alarm/record/overtime',
    method: 'get',
    params
  })
}
