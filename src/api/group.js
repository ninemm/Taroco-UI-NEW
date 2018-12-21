import request from '@/plugin/axios'
import { groupApi } from './api'

export function fetchList (query) {
  return request({
    url: groupApi.list,
    method: 'get',
    params: query
  })
}

export function findListAsOptions () {
  return request({
    url: groupApi.findListAsOptions,
    method: 'get'
  })
}

export function fetchCheckedRoleList (id) {
  return request({
    url: groupApi.findCheckedRoleList + '/' + id,
    method: 'get'
  })
}

export function addObj (obj) {
  return request({
    url: groupApi.saveOrUpdate,
    method: 'post',
    data: obj
  })
}

export function getObj (id) {
  return request({
    url: groupApi.findById + '/' + id,
    method: 'get'
  })
}

export function delObj (id) {
  return request({
    url: groupApi.delete + '/' + id,
    method: 'delete'
  })
}

export function putObj (obj) {
  return request({
    url: groupApi.saveOrUpdate,
    method: 'put',
    data: obj
  })
}

export function updateGroupPermission (groupId, roleIds) {
  return request({
    url: groupApi.updateGroupPermission,
    method: 'put',
    data: {
      groupId, roleIds
    }
  })
}
