import request from '@/plugin/axios'
import { dictApi } from './api'

export function fetchList (query) {
  return request({
    url: dictApi.list,
    method: 'get',
    params: query
  })
}

export function addObj (obj) {
  return request({
    url: dictApi.saveOrUpdate,
    method: 'post',
    data: obj
  })
}

export function getObj (id) {
  return request({
    url: dictApi.findById + '/' + id,
    method: 'get'
  })
}

export function delObj (row) {
  return request({
    url: dictApi.delete + '/' + row.id + '/' + row.type,
    method: 'delete'
  })
}

export function putObj (obj) {
  return request({
    url: dictApi.saveOrUpdate,
    method: 'put',
    data: obj
  })
}

export function remote (type) {
  return request({
    url: '/admin/dict/type/' + type,
    method: 'get'
  })
}
