import request from '@/utils/request'

export function loginByUsername(username, password) {
  const data = {
    username,
    password
  }
  return request({
    url: '/upms/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/upms/logout',
    method: 'get'
  })
}

export function getUserInfo(token) {
  return request({
    url: '/upms/user/info',
    method: 'get'
  })
}

export function getCount() {
  return request({
    url: '/moni/alarminfo/count',
    method: 'get'
  })
}

export function changeUserPass(password, newPassword) {
  return request({
    url: '/upms/user/updatePwd?userId=' + password + '&newPassword=' + newPassword,
    method: 'get'
  })
}
