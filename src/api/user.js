import request from '@/plugin/axios'
import { userApi } from './api'

export function fetchList (query) {
  return request({
    url: userApi.list,
    method: 'get',
    params: query
  })
}

export function addObj (obj) {
  return request({
    url: userApi.saveOrUpdate,
    method: 'post',
    data: obj
  })
}

export function getObj (id) {
  return request({
    url: userApi.findById + '/' + id,
    method: 'get'
  })
}

export function delObj (id) {
  return request({
    url: userApi.delete + '/' + id,
    method: 'delete'
  })
}

export function putObj (obj) {
  return request({
    url: userApi.saveOrUpdate,
    method: 'put',
    data: obj
  })
}

export function batchDelObj (ids) {
  return request({
    url: userApi.batchDelete + '/' + ids,
    method: 'delete'
  })
}

export function fetchAllOptions () {
  return request({
    url: userApi.fetchAllOptions,
    method: 'get'
  })
}

export function uploadFile (obj) {
  return request({
    url: userApi.uploadFile,
    method: 'post',
    data: obj,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
}
