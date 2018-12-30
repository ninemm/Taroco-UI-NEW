import request from '@/plugin/axios'
import { menuApi } from './api'

export function GetMenu () {
  return request({
    url: menuApi.userMenu,
    method: 'get'
  })
}
export function fetchTree (query) {
  return request({
    url: menuApi.allMenuTree,
    method: 'get',
    params: query
  })
}

export function addObj (obj) {
  return request({
    url: menuApi.saveOrUpdate,
    method: 'post',
    data: obj
  })
}

export function getObj (id) {
  return request({
    url: menuApi.findById + '/' + id,
    method: 'get'
  })
}

export function delObj (id) {
  return request({
    url: menuApi.delete + '/' + id,
    method: 'delete'
  })
}

export function putObj (obj) {
  return request({
    url: menuApi.saveOrUpdate,
    method: 'put',
    data: obj
  })
}
