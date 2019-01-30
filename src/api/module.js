import request from '@/plugin/axios'
import { moduleApi } from './api'

export function fetchList (query) {
  return request({
    url: moduleApi.list,
    method: 'get',
    params: query
  })
}

export function fetchTreeList (query) {
  return request({
    url: moduleApi.findListAsTree,
    method: 'get',
    params: query
  })
}

export function fetchModuleTree () {
  return request({
    url: moduleApi.moduleTree,
    method: 'get'
  })
}

export function addObj (obj) {
  return request({
    url: moduleApi.save,
    method: 'post',
    data: obj
  })
}

export function getObj (id) {
  return request({
    url: moduleApi.findById + '/' + id,
    method: 'get'
  })
}

export function delObj (id) {
  return request({
    url: moduleApi.delete + '/' + id,
    method: 'delete'
  })
}

export function putObj (obj) {
  return request({
    url: moduleApi.update,
    method: 'put',
    data: obj
  })
}
