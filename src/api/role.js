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

export function updateRolePermission (data) {
  return request({
    url: roleApi.updatePermission,
    method: 'put',
    data: data
  })
}

export function fetchAllocatedPermission (roleId) {
  return request({
    url: roleApi.allocatedPermission + '/' + roleId,
    method: 'get'
  })
}
