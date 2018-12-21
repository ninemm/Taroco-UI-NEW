import request from '@/plugin/axios'
import { systemApi } from './api'

export function fetchList (query) {
  return request({
    url: systemApi.list,
    method: 'get',
    params: query
  })
}

export function fetchListAsSelect () {
  return request({
    url: systemApi.findListAsSelect,
    method: 'get'
  })
}

export function addObj (obj) {
  return request({
    url: systemApi.save,
    method: 'post',
    data: obj
  })
}

export function getObj (id) {
  return request({
    url: systemApi.findById + '/' + id,
    method: 'get'
  })
}

export function delObj (id) {
  return request({
    url: systemApi.delete + '/' + id,
    method: 'delete'
  })
}

export function putObj (obj) {
  return request({
    url: systemApi.update,
    method: 'put',
    data: obj
  })
}
