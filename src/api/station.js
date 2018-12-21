import request from '@/plugin/axios'
import { stationApi } from './api'

export function fetchList (query) {
  return request({
    url: stationApi.list,
    method: 'get',
    params: query
  })
}

export function fetchListAsSelect () {
  return request({
    url: stationApi.findListAsSelect,
    method: 'get'
  })
}

export function addObj (obj) {
  return request({
    url: stationApi.saveOrUpdate,
    method: 'post',
    data: obj
  })
}

export function getObj (id) {
  return request({
    url: stationApi.findById + '/' + id,
    method: 'get'
  })
}

export function delObj (id) {
  return request({
    url: stationApi.delete + '/' + id,
    method: 'delete'
  })
}

export function putObj (obj) {
  return request({
    url: stationApi.saveOrUpdate,
    method: 'put',
    data: obj
  })
}
