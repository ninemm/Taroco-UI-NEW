// 接口api地址

const basePath = '/api/v1'
// menu api
export const menuApi = {
  menuList: basePath + '/admin/menu/list',
  userMenu: basePath + '/admin/menu/userMenu',
  allMenuTree: basePath + '/admin/menu/allMenuTree',
  findById: basePath + '/admin/menu/findById',
  save: basePath + '/admin/menu/save',
  saveOrUpdate: basePath + '/admin/menu/saveOrUpdate',
  delete: basePath + '/admin/menu/delete',
  update: basePath + '/admin/menu/update'
}

export const userApi = {
  list: basePath + '/admin/user/list',
  findById: basePath + '/admin/user/findById',
  save: basePath + '/admin/user/save',
  delete: basePath + '/admin/user/delete',
  update: basePath + '/admin/user/update',
  saveOrUpdate: basePath + '/admin/user/saveOrUpdate',
  batchDelete: basePath + '/admin/user/batchDelete',
  uploadFile: basePath + '/admin/user/batchImport',
  fetchAllOptions: basePath + '/admin/user/findAllOptions',
  fetchAccountOptions: basePath + '/admin/user/findAccountOptions'
}

export const deptApi = {
  deptList: basePath + '/admin/dept/list',
  tree: basePath + '/admin/dept/tree',
  lazyTree: basePath + '/admin/dept/findListAsTree',
  findDeptUserTree: basePath + '/admin/dept/findDeptUserTree',
  findById: basePath + '/admin/dept/findById',
  save: basePath + '/admin/dept/save',
  delete: basePath + '/admin/dept/delete',
  saveOrUpdate: basePath + '/admin/dept/saveOrUpdate',
  update: basePath + '/admin/dept/update'
}

export const roleApi = {
  list: basePath + '/admin/role/list',
  findRoleList: basePath + '/admin/role/findListAsSelect',
  findById: basePath + '/admin/role/findById',
  save: basePath + '/admin/role/save',
  delete: basePath + '/admin/role/delete',
  update: basePath + '/admin/role/update',
  batchDelete: basePath + '/admin/role/batchDelete',
  updatePermission: basePath + '/admin/role/updatePermission',
  allocatedPermission: basePath + '/admin/role/findAllocatedPermission'
}

export const groupApi = {
  list: basePath + '/admin/group/list',
  findById: basePath + '/admin/group/findById',
  findListAsOptions: basePath + '/admin/group/findListAsOptions',
  findCheckedRoleList: basePath + '/admin/group/findCheckedRoleList',
  save: basePath + '/admin/group/save',
  delete: basePath + '/admin/group/delete',
  update: basePath + '/admin/group/update',
  saveOrUpdate: basePath + '/admin/group/saveOrUpdate',
  batchDelete: basePath + '/admin/group/batchDelete',
  updateGroupPermission: basePath + '/admin/group/updateGroupPermission'
}

export const stationApi = {
  list: basePath + '/admin/station/list',
  findById: basePath + '/admin/station/findById',
  save: basePath + '/admin/station/save',
  delete: basePath + '/admin/station/delete',
  update: basePath + '/admin/station/update',
  saveOrUpdate: basePath + '/admin/station/saveOrUpdate',
  batchDelete: basePath + '/admin/station/batchDelete',
  updatePermission: basePath + '/admin/station/updatePermission',
  allocatedPermission: basePath + '/admin/station/findAllocatedPermission'
}

export const operationApi = {
  list: basePath + '/admin/operation/list',
  findById: basePath + '/admin/operation/findById',
  save: basePath + '/admin/operation/save',
  delete: basePath + '/admin/operation/delete',
  update: basePath + '/admin/operation/update',
  batchDelete: basePath + '/admin/operation/batchDelete',
  addMenu: basePath + '/admin/operation/addMenu',
  findListByModuleId: basePath + '/admin/operation/findListByModuleId'
}

export const moduleApi = {
  list: basePath + '/admin/module/list',
  findById: basePath + '/admin/module/findById',
  findListAsTree: basePath + '/admin/module/findListAsTree',
  moduleTree: basePath + '/admin/module/moduleTree',
  save: basePath + '/admin/module/save',
  delete: basePath + '/admin/module/delete',
  update: basePath + '/admin/module/update',
  batchDelete: basePath + '/admin/module/batchDelete'
}

export const systemApi = {
  list: basePath + '/admin/systems/list',
  findListAsSelect: basePath + '/admin/systems/findListAsSelect',
  findById: basePath + '/admin/systems/findById',
  save: basePath + '/admin/systems/save',
  delete: basePath + '/admin/systems/delete',
  update: basePath + '/admin/systems/update',
  batchDelete: basePath + '/admin/systems/batchDelete'
}

export const dictApi = {
  list: basePath + '/admin/dict/list',
  findById: basePath + '/admin/dict/findById',
  saveOrUpdate: basePath + '/admin/dict/saveOrUpdate',
  delete: basePath + '/admin/dict/delete',
  batchDelete: basePath + '/admin/dict/batchDelete'
}

export const optionApi = {
  findAll: basePath + '/admin/option/findAll',
  saveOrUpdate: basePath + '/admin/option/saveOrUpdate'
}
