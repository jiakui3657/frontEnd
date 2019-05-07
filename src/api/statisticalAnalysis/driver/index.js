import request from '@/utils/request'

/**
 * 报警汇总报表
 */

export function driverMileage(prodata) {
  return request({
    url: '/base/driverMileage/mileage',
    method: 'get',
    params: prodata
  })
}

export function totalMileage(prodata) {
  return request({
    url: '/base/driverMileage/mileage/report',
    method: 'get',
    params: prodata
  })
}

export function MileageDetail(prodata) {
  return request({
    url: '/base/driverMileage/detail',
    method: 'get',
    params: prodata
  })
}

/**
 * 司机在线率明细
 */

export function OnlineRate(prodata) {
  return request({
    url: '/base/driverMileage/onlineRate',
    method: 'get',
    params: prodata
  })
}

/**
 * 司机行程明细
 */

export function runDetail(prodata) {
  return request({
    url: '/base/driverMileage/runDetail',
    method: 'get',
    params: prodata
  })
}

/**
 * 司机行程汇总
 */

export function Driving(prodata) {
  return request({
    url: '/base/driverMileage/driving',
    method: 'get',
    params: prodata
  })
}

/**
 * 司机行程汇总图表
 */

export function DrivingChart(prodata) {
  return request({
    url: '/base/driverMileage/drivingChart',
    method: 'get',
    params: prodata
  })
}
