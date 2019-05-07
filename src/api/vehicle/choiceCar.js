import request from '@/utils/request'

export function getOwersTree(id) {
  return request({
    url: `/base/owers/tree/${id}`,
    method: 'get'
  })
}
// 运营车辆车载视频终端音视频通道（下拉框）
export function getPassageway() {
  return request({
    url: '/passageway/type',
    method: 'get'
  })
}

// 地区平台业户查询车辆列表
export function getChildrenVehList(query) {
  return request({
    url: '/base/vehicle/getChildrenVehList',
    method: 'get',
    params: query
  })
}
