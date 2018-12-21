import request from '@/plugin/axios'
import { operationApi } from './api'

export function fetchList (query) {
  return request({
    url: operationApi.list,
    method: 'get',
    params: query
  })
}

export function fetchListAsSelect () {
  return request({
    url: operationApi.findListAsSelect,
    method: 'get'
  })
}

export function addObj (obj) {
  return request({
    url: operationApi.save,
    method: 'post',
    data: obj
  })
}

export function getObj (id) {
  return request({
    url: operationApi.findById + '/' + id,
    method: 'get'
  })
}

export function delObj (id) {
  return request({
    url: operationApi.delete + '/' + id,
    method: 'delete'
  })
}

export function putObj (obj) {
  return request({
    url: operationApi.update,
    method: 'put',
    data: obj
  })
}
