import request from '@/utils/request'

export function getOperationalLogbook(params) {
  return request({
    url: '/sys/log/operate',
    method: 'get',
    params
  })
}
export function getOperate() {
  return request({
    url: '/sys/log/allOp',
    method: 'get'
  })
}
