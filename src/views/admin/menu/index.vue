<template>
  <d2-container better-scroll>
    <div class="d2-help-box d2-mb">
      <div class="d2-pl-10">1. <b>新增</b>：选中树节点，点击<em>新增按钮</em>，在右边填入菜单相关信息，点击保存即可！<b>编辑</b>：选中树节点，点击<em>编辑按钮</em>，在右边修改菜单相关信息，点击更新即可！</div>
      <div class="d2-pl-10">2. 点击树节点前面的 <i class="el-icon-caret-right"></i> 箭头，可以展开树节点</div>
      <div class="d2-pl-10">3. 菜单添加完成之后，请<b>重新登录系统</b></div>
    </div>
    <el-row :gutter="20">
      <el-col :span="10">
        <el-card header="菜单树" body-style="{padding: '5px'}">
          <el-tree
            node-key="id"
            highlight-current
            :data="menuTreeData"
            :props="defaultProps"
            :expand-on-click-node="false"
            :default-expanded-keys="aExpandedKeys"
            @node-expand="nodeExpand"
            @node-collapse="nodeCollapse">
            <span class="d2-tree-node" slot-scope="{ node }">
              <span>{{ node.label }}</span>
              <span>
                <el-button type="text" @click="() => handleAdd(node)"><i class="el-icon-circle-plus-outline"></i></el-button>
                <el-button v-if="node.level > 1" type="text" @click="() => handleEdit(node)"><i class="el-icon-edit-outline"></i></el-button>
                <el-button v-if="node.level > 1" type="text" @click="() => handleDelete(node)" style="color:#F56C6C;"><i class="el-icon-delete"></i></el-button>
              </span>
            </span>
          </el-tree>
        </el-card>
      </el-col>
      <el-col :span="14">
        <el-card :header="textMap[formStatus]" body-style="{padding: '5px'}" v-loading="loading">
          <el-form :label-position="labelPosition" label-width="100px" :rules="rules" :model="form" ref="form" size="small">
            <input type="hidden" v-model="form.id" />
            <el-form-item label="父级节点" prop="parent_id">
              <el-select v-model="form.parent_id" placeholder="请选择">
                <el-option
                  v-for="item in menuOptions"
                  :key="item.key"
                  :label="item.value"
                  :value="item.key">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="菜单名称" prop="name">
              <el-input v-model="form.name" :disabled="formEdit" placeholder="请输入菜单名称"></el-input>
            </el-form-item>
            <el-form-item label="资源路径" prop="path">
              <el-input v-model="form.path" :disabled="formEdit" placeholder="请输入资源路径"></el-input>
            </el-form-item>
            <el-form-item label="前端组件" prop="component">
              <el-input v-model="form.component" :disabled="formEdit" placeholder="请输入描述"></el-input>
            </el-form-item>
            <el-form-item label="菜单层级" prop="level">
              <el-input type="number" v-model.number="form.level" :disabled="formEdit" placeholder="菜单层级"></el-input>
              <p class="d2-help-text"><i class="el-icon-warning"></i> 菜单层级请按实际情况填写，否则父级节点数据会显示错误</p>
            </el-form-item>
            <el-form-item label="权限标识" prop="permission">
              <el-input v-model="form.permission" :disabled="formEdit" placeholder="请输入权限标识，如sys-menu-add"></el-input>
            </el-form-item>
            <el-form-item label="菜单图标" prop="icon">
              <d2-icon-select v-model="form.icon" :disabled="formEdit" placeholder="请选择图标"></d2-icon-select>
            </el-form-item>
            <el-form-item label="重定向地址" prop="redirect">
              <el-input v-model="form.redirect" :disabled="formEdit" placeholder="前端重定向跳转地址"></el-input>
            </el-form-item>
            <el-form-item label="参数" prop="param">
              <el-input v-model="form.param" :disabled="formEdit" placeholder="请输入参数"></el-input>
            </el-form-item>
            <el-form-item label="请求方法" prop="method">
              <el-select class="filter-item" v-model="form.method"  :disabled="formEdit"  placeholder="请输入资源请求类型">
                <el-option v-for="item in  methodOptions" :key="item" :label="item" :value="item"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="菜单类型" prop="type">
              <el-select class="filter-item" v-model="form.type"  :disabled="formEdit"  placeholder="请输入资源请求类型">
                <el-option v-for="item in typeOptions" :key="item" :label="item | typeFilter" :value="item"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="排序" prop="order_list">
              <el-input type="number" v-model.number="form.order_list" :disabled="formEdit" placeholder="请输入排序"></el-input>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
    <!-- footer -->
    <template slot="footer" v-if="formStatus == 'create'">
      <div style="margin:-5px; text-align:center">
        <el-button size="small" @click="onCancel" icon="el-icon-close">取消</el-button>
        <el-button size="small" type="primary" @click="create" icon="el-icon-check">保 存</el-button>
      </div>
    </template>
    <template slot="footer" v-if="formStatus == 'update'">
      <div style="margin:-5px; text-align:center">
        <el-button size="small" @click="onCancel" icon="el-icon-close">取消</el-button>
        <el-button size="small" type="primary" @click="update" icon="el-icon-check">更 新</el-button>
      </div>
    </template>
  </d2-container>
</template>

<script>
import { fetchTree, getObj, addObj, delObj, putObj } from '@/api/menu'
import { mapGetters } from 'vuex'
export default {
  name: 'upms-menu',
  data () {
    return {
      formEdit: true,
      formAdd: true,
      formStatus: 'normal',
      showElement: false,
      loading: false,
      typeOptions: ['0', '1'],
      methodOptions: ['GET', 'POST', 'PUT', 'DELETE'],
      listQuery: {
        name: undefined
      },
      menuTreeData: [],
      menuOptions: [],
      aExpandedKeys: ['0'],
      oExpandedKey: {
        // key (from tree id) : expandedOrNot boolean
      },
      oTreeNodeChildren: {
        // id1 : [children] (from tree node id1)
        // id2 : [children] (from tree node id2)
      },
      textMap: {
        create: '新增菜单',
        update: '编辑菜单',
        normal: '菜单录入表单'
      },
      defaultProps: {
        label: 'name',
        isLeaf: 'leaf',
        disabled: 'disabled',
        children: 'children'
      },
      labelPosition: 'right',
      form: {
        order_list: 10
      },
      menuManager_btn_add: true,
      menuManager_btn_edit: true,
      menuManager_btn_del: true,
      rules: {
        parent_id: [
          {
            required: true,
            message: '父级节点不能为空',
            trigger: 'blur'
          }
        ],
        name: [
          {
            required: true,
            message: '菜单名称不能为空',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 15,
            message: '长度在 3 到 15 个字符',
            trigger: 'blur'
          }
        ],
        path: [
          {
            required: true,
            message: '菜单名称不能为空',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 15,
            message: '长度在 3 到 15 个字符',
            trigger: 'blur'
          }
        ],
        component: [
          {
            required: true,
            message: '前端页面地址不能为空',
            trigger: 'blur'
          }
        ],
        level: [
          {
            required: true,
            message: '菜单层级不能为空',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  filters: {
    typeFilter (type) {
      const typeMap = {
        0: '菜单',
        1: '按钮'
      }
      return typeMap[type]
    }
  },
  created () {
    this.initMenuTree()
    // this.menuManager_btn_add = this.permissions['sys_menu_add']
    // this.menuManager_btn_edit = this.permissions['sys_menu_edit']
    // this.menuManager_btn_del = this.permissions['sys_menu_del']
  },
  computed: {
    ...mapGetters([
      'elements',
      'permissions'
    ])
  },
  methods: {
    initMenuTree () {
      fetchTree(this.listQuery).then(response => {
        this.menuTreeData = response.data.menuTreeData
        this.menuOptions = response.data.menuOptions
      })
    },
    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    nodeExpand (data) {
      let aChildren = data.children
      if (aChildren.length > 0) {
        this.oExpandedKey[data.id] = true
        this.oTreeNodeChildren[data.id] = aChildren
      }
      this.setExpandedKeys()
    },
    nodeCollapse (data) {
      this.oExpandedKey[data.id] = false
      // 如果有子节点
      this.treeRecursion(this.oTreeNodeChildren[data.id], (oNode) => {
        this.oExpandedKey[oNode.id] = false
      })
      this.setExpandedKeys()
    },
    setExpandedKeys () {
      let oTemp = this.oExpandedKey
      this.aExpandedKeys = []
      for (let sKey in oTemp) {
        if (oTemp[sKey]) {
          this.aExpandedKeys.push((sKey))
        }
      }
    },
    treeRecursion (aChildren, fnCallback) {
      if (aChildren) {
        for (let i = 0; i < aChildren.length; ++i) {
          let oNode = aChildren[i]
          fnCallback && fnCallback(oNode)
          this.treeRecursion(oNode.children, fnCallback)
        }
      }
    },
    handleEdit (node) {
      this.formEdit = false
      this.loading = true
      this.formStatus = 'update'
      getObj(node.data.id).then(res => {
        let data = res.data
        this.form = data
        this.loading = false
      })
    },
    handleAdd (node) {
      this.resetForm()
      this.formEdit = false
      this.formStatus = 'create'
      this.form.is_parent = 0
      this.form.level = node.level
      this.form.parent_id = node.data.id
      this.form.parent_name = node.data.name
    },
    handleDelete (node) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delObj(node.data.id).then(() => {
          this.resetForm()
          this.onCancel()
          this.initMenuTree()

          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
        })
      })
    },
    update () {
      putObj(this.form).then(() => {
        this.resetForm()
        this.onCancel()
        this.initMenuTree()
        this.$notify({
          title: '成功',
          message: '更新成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    create () {
      addObj(this.form).then(() => {
        this.resetForm()
        this.onCancel()
        this.initMenuTree()
        this.$notify({
          title: '成功',
          message: '创建成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    onCancel () {
      this.formEdit = true
      this.formStatus = 'normal'
    },
    resetForm () {
      this.form = {}
      this.form.is_parent = 0
      this.form.order_list = 10
    }
  }
}
</script>
