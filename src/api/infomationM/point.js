import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/sys/point',
    method: 'get',
    params
  })
}

export function addPoint(data) {
  return request({
    url: '/sys/point',
    method: 'post',
    data
  })
}

export function fetchPoint(id) {
  return request({
    url: `/sys/point/${id}`,
    method: 'get'
  })
}

export function updatePoint(data) {
  return request({
    url: `/sys/point`,
    method: 'put',
    data
  })
}

export function deletePoint(id) {
  return request({
    url: `/sys/point/${id}`,
    method: 'delete'
  })
}
