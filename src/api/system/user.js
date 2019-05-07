import request from '@/utils/request'

/**
 * 分页获取用户列表
 * @param {*} 查询参数，json格式
 */
export function fetchList(query) {
  return request({
    // url: '/upms/user',
    url: '/upms/user/nodePath',
    method: 'get',
    params: query
  })
}

/**
 * 获取用户详情
 * @param {*} 用户id
 */
export function fetchUser(id) {
  return request({
    url: '/upms/user/' + id,
    method: 'get'
  })
}

/**
 * 新增用户
 * @param {*} 表单数据
 */
export function createUser(data) {
  return request({
    url: '/upms/user',
    method: 'post',
    data
  })
}

/**
 * 修改用户信息
 * @param {*} json格式参数
 */
export function updateUser(data) {
  return request({
    url: '/upms/user',
    method: 'put',
    data
  })
}

/**
 * 删除用户
 * @param {*} userIds 数组格式
 */
export function deleteUser(userIds) {
  return request({
    url: '/upms/user/' + userIds.join(),
    method: 'delete'
  })
}

export function exportUser() {
  return request({
    url: '/upms/user/excel',
    method: 'get'
  })
}

export function getAllotlist(params) {
  return request({
    url: '/base/platform/permslistAll',
    method: 'get',
    params
  })
}
export function allot(data) {
  return request({
    url: '/base/user/permPlatform',
    method: 'put',
    data
  })
}

export function changePassword(userid, password) {
  return request({
    // url: '/upms/user/updatePwd?userId=&password=',
    url: '/upms/user/updatePwd?userId=' + userid + '&password=' + password,
    method: 'get'
  })
}

// 根据老密码改密码
export function changePasswordByOldPwd(oldpassword, enterpassword) {
  return request({
    url: '/upms/user/password?password=' + oldpassword + '&newPassword=' + enterpassword,
    method: 'get'
  })
}
