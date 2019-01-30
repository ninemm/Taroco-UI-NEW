import request from '@/plugin/axios'
import { optionApi } from './api'

export function addObj (obj) {
  return request({
    url: optionApi.saveOrUpdate,
    method: 'post',
    data: obj
  })
}

export function getObj () {
  return request({
    url: optionApi.findAll,
    method: 'get'
  })
}

export function delObj (id) {
  return request({
    url: optionApi.delete + '/' + id,
    method: 'delete'
  })
}

export function putObj (obj) {
  return request({
    url: optionApi.saveOrUpdate,
    method: 'put',
    data: obj
  })
}
