import request from '@/utils/request'

export function createMsg(data) {
  return request({
    url: '/alarm/record/contentModle',
    method: 'post',
    data
  })
}

export function getMsg() {
  return request({
    url: '/alarm/record/contentModle',
    method: 'get'
  })
}

export function textSend() {
  return request({
    url: '/alarm/record/textSend',
    method: 'post'
  })
}

export function deleteMsg(data) {
  return request({
    url: '/alarm/record/contentModle',
    method: 'delete',
    data
  })
}

export function getBaseDept(data) {
  return request({
    url: '/moni/monitoring/getChildrenList',
    method: 'get',
    params: data
  })
}

export function getVehicleList(data) {
  return request({
    url: '/moni/monitoring/vehicleSearch',
    method: 'get',
    params: data
  })
}

export function getVehicleInfo(data) {
  return request({
    url: '/moni/monitoring/vehOtherInfo',
    method: 'get',
    params: data
  })
}
