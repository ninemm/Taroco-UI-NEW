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
    url: '/admin/menu/',
    method: 'post',
    data: obj
  })
}

export function getObj (id) {
  return request({
    url: '/admin/menu/' + id,
    method: 'get'
  })
}

export function delObj (id) {
  return request({
    url: '/admin/menu/' + id,
    method: 'delete'
  })
}

export function putObj (obj) {
  return request({
    url: '/admin/menu/',
    method: 'put',
    data: obj
  })
}
