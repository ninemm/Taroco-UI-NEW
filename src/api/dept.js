import request from '@/plugin/axios'
import { deptApi } from './api'

export function fetchTree (query) {
  return request({
    url: deptApi.tree,
    method: 'get',
    params: query
  })
}

export function fetchLazyTree (query) {
  return request({
    url: deptApi.lazyTree,
    method: 'get',
    params: query
  })
}

export function fetchDeptUserTree (query) {
  return request({
    url: deptApi.findDeptUserTree,
    method: 'get',
    params: query
  })
}

export function addObj (obj) {
  return request({
    url: deptApi.saveOrUpdate,
    method: 'post',
    data: obj
  })
}

export function getObj (id) {
  return request({
    url: deptApi.findById,
    method: 'post',
    params: { id }
  })
}

export function delObj (id) {
  return request({
    url: deptApi.delete + '/' + id,
    method: 'delete'
  })
}

export function putObj (obj) {
  return request({
    url: deptApi.saveOrUpdate,
    method: 'put',
    data: obj
  })
}
