import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/sys/deviceextend',
    method: 'get',
    params
  })
}

export function getDownMenu(type) {
  return request({
    url: `/sys/dict/downMenu/${type}`,
    method: 'get'
  })
}

export function addDevice(data) {
  return request({
    url: `/sys/deviceextend`,
    method: 'post',
    data
  })
}

export function getInfo(id) {
  return request({
    url: `/sys/deviceextend/${id}`,
    method: 'get'
  })
}

export function updateInfo(data) {
  return request({
    url: `/sys/deviceextend`,
    method: 'put',
    data
  })
}

export function deleteDevice(id) {
  return request({
    url: `/sys/deviceextend/${id}`,
    method: 'delete'
  })
}
