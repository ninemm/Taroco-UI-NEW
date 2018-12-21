import request from '@/plugin/axios'
import { roleApi } from './api'

export function roleList () {
  return request({
    url: roleApi.findRoleList,
    method: 'get'
  })
}

export function fetchList (query) {
  return request({
    url: roleApi.list,
    method: 'get',
    params: query
  })
}

export function deptRoleList (deptId) {
  return request({
    url: '/admin/role/roleList/' + deptId,
    method: 'get'
  })
}

export function getObj (id) {
  return request({
    url: roleApi.findById + '/' + id,
    method: 'get'
  })
}

export function addObj (obj) {
  return request({
    url: roleApi.save,
    method: 'post',
    data: obj
  })
}

export function putObj (obj) {
  return request({
    url: roleApi.update,
    method: 'put',
    data: obj
  })
}

export function delObj (id) {
  return request({
    url: roleApi.delete + '/' + id,
    method: 'delete'
  })
}

export function permissionUpd (roleId, menuIds) {
  return request({
    url: '/admin/role/roleMenuUpd',
    method: 'put',
    data: {
      roleId: roleId,
      menuIds: menuIds
    }
  })
}

export function fetchRoleTree (roleName) {
  return request({
    url: '/admin/menu/roleTree/' + roleName,
    method: 'get'
  })
}

export function fetchDeptTree (query) {
  return request({
    url: '/admin/dept/tree',
    method: 'get',
    params: query
  })
}
