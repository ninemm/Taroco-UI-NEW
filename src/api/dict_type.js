import request from '@/plugin/axios'
import { dictTypeApi } from './api'

export function fetchList (query) {
  return request({
    url: dictTypeApi.list,
    method: 'get',
    params: query
  })
}

export function findDictTypeOptions (query) {
  return request({
    url: dictTypeApi.list,
    method: 'get',
    params: query
  })
}

export function addObj (obj) {
  return request({
    url: dictTypeApi.saveOrUpdate,
    method: 'post',
    data: obj
  })
}

export function getObj (id) {
  return request({
    url: dictTypeApi.findById + '/' + id,
    method: 'get'
  })
}

export function putObj (obj) {
  return request({
    url: dictTypeApi.saveOrUpdate,
    method: 'put',
    data: obj
  })
}

export function delObj (row) {
  return request({
    url: dictTypeApi + '/' + row.id,
    method: 'delete'
  })
}
