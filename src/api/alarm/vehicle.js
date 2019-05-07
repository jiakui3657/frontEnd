import request from '@/utils/request'


export function vehicleList(params) {
  return request({
    url: '/alarm/all',
    method: 'get',
    params
  })
}

export function addRule(data) {
  return request({
    url: '/alarm',
    method: 'post',
    data
  })
}

export function fetchInfo(id) {
  return request({
    url: `/alarm/area/${id}`,
    method: 'get'
  })
}

export function updateRule(data) {
  return request({
    url: `/alarm`,
    method: 'put',
    data
  })
}

export function deleteRule(id) {
  return request({
    url: `/alarm/${id}`,
    method: 'delete'
  })
}

export function getCarList(params) {
  return request({
    url: '/alarm/vehicle',
    method: 'get',
    params
  })
}

export function allotCar(data) {
  return request({
    url: `/alarm/assigned/${data.allot}`,
    method: 'post',
    data
  })
}

// 点位报警列表
export function getPointList(params) {
  return request({
    url: '/alarm/point/list',
    method: 'get',
    params
  })
}

// 点位报警列表详情查询
export function getPointInfo(id) {
  return request({
    url: `/alarm/point/${id}`,
    method: 'get'
  })
}

// 点位报警新增
export function addPoint(data) {
  return request({
    url: '/alarm/point',
    method: 'post',
    data
  })
}

// 删除进出点位报警
export function deletePoint(id) {
  return request({
    url: `/alarm/point/${id}`,
    method: 'delete'
  })
}

// 修改进出点位报警
export function updatePoint(data) {
  return request({
    url: `/alarm/point`,
    method: 'put',
    data
  })
}

// 分析报警列表
export function getDatasList(params) {
  return request({
    url: '/alarm/analyse/list',
    method: 'get',
    params
  })
}

// 新增分析报警
export function addFatigue(data) {
  return request({
    url: '/alarm/analyse',
    method: 'post',
    data
  })
}

// 删除分析报警
export function deleteFatigue(id) {
  return request({
    url: `/alarm/analyse/${id}`,
    method: 'delete'
  })
}

// 点位报警列表详情查询
export function getFatigueInfo(id) {
  return request({
    url: `/alarm/analyse/${id}`,
    method: 'get'
  })
}

// 修改分析报警
export function updateFatigue(data) {
  return request({
    url: `/alarm/analyse/update`,
    method: 'put',
    data
  })
}

// 报警证据详情
export function getRecords(id) {
  return request({
    url: `/alarm/record/info/${id}`,
    method: 'get'
  })
}
