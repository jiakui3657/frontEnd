// @Author: outman_qiaopeng  Date: 2018-09-18 16:09:19
import request from '@/utils/request'

/**
 * 终端列表
 */
export function fetchList(query) {
  return request({
    url: '/base/device',
    method: 'get',
    params: query
  })
}

/**
 * 新增终端
 * @param {*} 表单数据
 */
export function createDevice(data) {
  return request({
    url: '/base/device',
    method: 'post',
    data
  })
}

/**
 * 修改终端
 * @param {*} json格式参数
 */
export function updateDevice(data) {
  return request({
    url: '/base/device',
    method: 'put',
    data
  })
}

/**
 * 删除终端
 * @param id 终端id数组格式
 */
export function deleteDevice(id) {
  return request({
    url: '/base/device/' + id.join(),
    method: 'delete'
  })
}

/**
 * 终端详情
 * @param id 终端id
 */
export function detailDevice(id) {
  return request({
    url: '/base/device/' + id,
    method: 'get'
  })
}

/**
 * 终端档案导出
 *
 */
export function handleExcel(prodata) {
  return request({
    responseType: 'blob',
    url: '/base/device/deviceExcel',
    method: 'get',
    params: prodata
  })
}

