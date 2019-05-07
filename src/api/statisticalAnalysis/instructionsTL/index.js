import request from '@/utils/request'

export function getInstructionsTL(params) {
  return request({
    url: '/sys/log/command',
    method: 'get',
    params
  })
}
export function getCommand() {
  return request({
    url: '/sys/log/allCm',
    method: 'get'
  })
}
