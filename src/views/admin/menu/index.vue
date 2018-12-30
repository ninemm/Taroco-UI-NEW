<template>
  <d2-container better-scroll>
    <!-- header按钮组 -->
    <el-row :gutter="20">
      <el-col :span="10">
        <el-card header="菜单" body-style="{padding: '5px'}">
          <el-tree
            node-key="id"
            highlight-current
            :data="menuTreeData"
            :props="defaultProps"
            :expand-on-click-node="false"
            :default-expanded-keys="aExpandedKeys"
            @node-expand="nodeExpand"
            @node-collapse="nodeCollapse">
            <span class="d2-tree-node" slot-scope="{ node, data }">
              <span>{{ node.label }}</span>
              <span>
                <el-button type="text" @click="() => handleAdd(node)">新增</el-button>
                <el-button v-if="node.level > 1" type="text" @click="() => handleEdit(node)">编辑</el-button>
                <el-button v-if="node.level > 1" type="text" @click="() => handleDelete(node)" style="color:#F56C6C;">删除</el-button>
              </span>
            </span>
          </el-tree>
        </el-card>
      </el-col>
      <el-col :span="14">
        <el-card :header="textMap[formStatus]" body-style="{padding: '5px'}">
          <el-form :label-position="labelPosition" label-width="80px" :model="form" ref="form" size="small">
            <input type="hidden" v-model="form.id" />
            <el-form-item label="父级节点" prop="parent_id">
              <el-input v-model="form.parent_name" :disabled="formEdit" placeholder="请输入父级节点"></el-input>
              <input type="hidden" v-model="form.parent_id">
            </el-form-item>
            <el-form-item label="菜单名称" prop="name">
              <el-input v-model="form.name" :disabled="formEdit" placeholder="请输入菜单名称"></el-input>
            </el-form-item>
            <el-form-item label="权限标识" prop="permission">
              <el-input v-model="form.permission" :disabled="formEdit" placeholder="请输入权限标识，如sys-menu-add"></el-input>
            </el-form-item>
            <el-form-item label="图标" prop="icon">
              <d2-icon-select v-model="form.icon" :disabled="formEdit" placeholder="请选择图标"></d2-icon-select>
            </el-form-item>
            <el-form-item label="资源路径" prop="code">
              <el-input v-model="form.code" :disabled="formEdit" placeholder="请输入资源路径"></el-input>
            </el-form-item>
            <el-form-item label="前端组件" prop="component">
              <el-input v-model="form.component" :disabled="formEdit" placeholder="请输入描述"></el-input>
            </el-form-item>
            <el-form-item label="前端地址" prop="path">
              <el-input v-model="form.path" :disabled="formEdit" placeholder="iframe嵌套地址"></el-input>
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
            <el-form-item label="菜单层级" prop="level">
              <el-input v-model="form.level" :disabled="formEdit" placeholder="菜单层级"></el-input>
            </el-form-item>
            <el-form-item label="排序" prop="order_list">
              <el-input v-model="form.order_list" :disabled="formEdit" placeholder="请输入排序"></el-input>
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
  name: 'user-menu',
  data () {
    return {
      formEdit: true,
      formAdd: true,
      formStatus: 'normal',
      showElement: false,
      typeOptions: ['0', '1'],
      methodOptions: ['GET', 'POST', 'PUT', 'DELETE'],
      listQuery: {
        name: undefined
      },
      menuTreeData: [],
      aExpandedKeys: [],
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
      menuManager_btn_del: true
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
        this.menuTreeData = response.data
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
      this.formStatus = 'update'
      getObj(node.data.id).then(res => {
        let data = res.data
        this.form = data
        this.form.parent_name = data.parent.name
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
