import request from '@/utils/request'

export function tabNum() {
  return request({
    url: '/bigScreen/tabNum',
    method: 'get'
  })
}

export function entireSupervise() {
  return request({
    url: '/homePageStatis/entireSupervise',
    method: 'get'
  })
}

export function jursdictionSuperviseInfo() {
  return request({
    url: 'homePageStatis/jursdictionSuperviseInfo',
    method: 'get'
  })
}

export function alarmingTrend() {
  return request({
    url: '/homePageStatis/alarmingTrend',
    method: 'get'
  })
}

export function alarmHandleInfo() {
  return request({
    url: '/homePageStatis/alarmHandleInfo',
    method: 'get'
  })
}

export function alarmTypeInfo() {
  return request({
    url: '/homePageStatis/alarmTypeInfo',
    method: 'get'
  })
}

export function driverRank(query) {
  return request({
    url: '/homePageStatis/driverRank',
    method: 'get',
    params: query
  })
}

export function enterpriseRank(query) {
  return request({
    url: '/homePageStatis/enterpriseRank',
    method: 'get',
    params: query
  })
}

export function platformRanking(query) {
  return request({
    url: '/bigScreen/platformRanking',
    method: 'get',
    params: query
  })
}
