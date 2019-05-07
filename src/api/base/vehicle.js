// @Author: outman_qiaopeng  Date: 2018-09-18 16:55:13
import request from '@/utils/request'

/**
 * 车辆列表
 */
export function vehicleList(query) {
  return request({
    url: '/base/vehicle',
    method: 'get',
    params: query
  })
}

/**
 * 车辆列表
 */
export function fetchList(query) {
  return request({
    url: '/base/vehicle',
    method: 'get',
    params: query
  })
}

/**
 * 新增车辆
 * @param {*} 表单数据
 */
export function createVehicle(data) {
  return request({
    url: '/base/vehicle',
    method: 'post',
    data
  })
}

/**
 * 修改车辆
 * @param {*} json格式参数
 */
export function updateVehicle(data) {
  return request({
    url: '/base/vehicle',
    method: 'put',
    data
  })
}

/**
 * 删除车辆
 * @param id 车辆id数组格式
 */
export function deleteVehicle(id) {
  return request({
    url: '/base/vehicle/' + id.join(),
    method: 'delete'
  })
}

/**
 * 车辆详情
 * @param id 车辆id
 */
export function detailVehicle(id) {
  return request({
    url: '/base/vehicle/' + id,
    method: 'get'
  })
}

/**
 * 未绑定设备列表
 * @param id 车辆id
 */
export function unBindDeviceList(query) {
  return request({
    url: '/base/device/notDound',
    method: 'get',
    params: query
  })
}

/**
 * 车辆档案导出
 *
 */
export function vehicleExcel(prodata) {
  return request({
    responseType: 'blob',
    url: '/base/vehicle/vehicleExcel',
    method: 'get',
    params: prodata
  })
}
