import request from '@/plugin/axios'

/**
 * 登录
 * @param {用户名} username
 * @param {密码} password
 * @param {验证码} code
 * @param {验证码随机字符串} randomStr
 */
export const loginByUsername = (mobile, password, deptId, code, randomStr) => {
  var grantType = 'password'
  var scope = 'server'
  return request({
    url: '/auth/login',
    // headers: {
    //   'Jwt': 'Basic dGFyb2NvOnRhcm9jbw=='
    // },
    method: 'post',
    params: { mobile, password, deptId, code, randomStr, 'grant_type': grantType, scope }
  })
}

/**
 * 获取用户信息
 */
export const getUserInfo = () => {
  return request({
    url: '/api/v1/admin/user/info',
    method: 'get'
  })
}

/**
 * 退出登录
 * @param {请求token} accesstoken
 */
export const logout = (accesstoken) => {
  return request({
    url: '/auth/logout',
    method: 'post',
    params: { accesstoken }
  })
}
