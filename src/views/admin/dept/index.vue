<template>
  <d2-container better-scroll>
    <!-- header按钮组 -->
    <template slot="header">
      <el-button-group>
        <el-button size="mini" type="primary" v-if="deptManager_btn_add" icon="el-icon-plus" @click="handlerAdd">新 增</el-button>
        <el-button size="mini" type="primary" v-if="deptManager_btn_edit" icon="el-icon-edit" @click="handlerEdit">编 辑</el-button>
        <el-button size="mini" type="danger" v-if="deptManager_btn_del" icon="el-icon-delete" @click="handleDelete">删 除</el-button>
      </el-button-group>
    </template>
    <el-row>
      <el-col :span="8">
        <el-tree
          node-key="id"
          class="filter-tree"
          :data="treeData"
          highlight-current
          :props="defaultProps"
          :filter-node-method="filterNode"
          @node-click="getNodeData" >
        </el-tree>
      </el-col>
      <el-col :span="12">
        <el-form :label-position="labelPosition" label-width="100px" :model="form" ref="form" size="small">
          <el-form-item label="行号" prop="id" v-if="formEdit">
            <el-input v-model="form.id" :disabled="formEdit"></el-input>
          </el-form-item>
          <el-form-item label="父级节点" prop="parentId">
            <el-input v-model="form.parent_dept_name" :disabled="formEdit" placeholder="请输入父级节点"></el-input>
            <el-input v-model="form.parent_id" :disabled="formEdit" placeholder="请输入父级节点"></el-input>
          </el-form-item>
          <el-form-item label="部门名称" prop="deptName">
            <el-input v-model="form.dept_name" :disabled="formEdit"  placeholder="请输入部门名称"></el-input>
          </el-form-item>
          <el-form-item label="部门层级" prop="deptLevel">
            <el-input v-model="form.dept_level" :disabled="formEdit"  placeholder="请输入部门层级"></el-input>
          </el-form-item>
          <el-form-item label="负责人">
            <el-input v-model="form.principal_user_id" :disabled="formEdit"  placeholder="请输入部门负责人">
              <el-button slot="append" icon="el-icon-search" @click="openUserDialog">选择</el-button>
            </el-input>
          </el-form-item>
          <el-form-item label="订单审核人">
            <el-input v-model="form.order_reviewer_id" :disabled="formEdit"  placeholder="请输入订单审核人">
              <el-button slot="append" icon="el-icon-search" @click="openUserDialog">选择</el-button>
            </el-input>
          </el-form-item>
          <el-form-item label="排序" prop="orderList">
            <el-input-number v-model="form.order_list" :min="1"></el-input-number>
          </el-form-item>
        </el-form>
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
import { fetchTree, getObj, addObj, delObj, putObj } from '@/api/dept'
import { mapGetters } from 'vuex'
export default {
  name: 'table_upms_department',
  data () {
    return {
      list: null,
      total: null,
      formEdit: true,
      formAdd: true,
      formStatus: '',
      showElement: false,
      typeOptions: ['0', '1'],
      methodOptions: ['GET', 'POST', 'PUT', 'DELETE'],
      listQuery: {
        name: undefined
      },
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      labelPosition: 'right',
      form: {
        name: undefined,
        order_list: 10
      },
      curNode: {
        id: 0,
        level: 1,
        name: undefined
      },
      deptManager_btn_add: false,
      deptManager_btn_edit: false,
      deptManager_btn_del: false
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
    this.getList()
    // this.deptManager_btn_add = this.permissions['sys_dept_add']
    // this.deptManager_btn_edit = this.permissions['sys_dept_edit']
    // this.deptManager_btn_del = this.permissions['sys_dept_del']
    this.deptManager_btn_add = true
    this.deptManager_btn_edit = true
    this.deptManager_btn_del = true
  },
  computed: {
    ...mapGetters([
      'elements',
      'permissions'
    ])
  },
  methods: {
    getList () {
      fetchTree(this.listQuery).then(response => {
        this.treeData = response.data
      })
    },
    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    getNodeData (data, node) {
      // 根节点不处理
      if (node.level === 1) {
        return
      }

      if (!this.formEdit) {
        this.formStatus = 'update'
      }

      getObj(data.id).then(response => {
        this.form = response.data
        this.form.parent_dept_name = data.name
      })
      this.curNode.id = data.id
      this.curNode.name = data.name
      this.curNode.level = node.level
      this.showElement = true
    },
    handlerEdit () {
      if (this.form.id) {
        this.formEdit = false
        this.formStatus = 'update'
      }
    },
    handlerAdd () {
      this.resetForm()
      this.formEdit = false
      this.formStatus = 'create'
    },
    handleDelete () {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delObj(this.curNode.id).then(() => {
          this.getList()
          this.resetForm()
          this.onCancel()
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
        this.getList()
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
        this.getList()
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
      this.formStatus = ''
    },
    openUserDialog () {},
    resetForm () {
      var that = this
      this.form = {
        parent_id: that.curNode.id,
        parent_dept_name: that.curNode.name,
        dept_level: that.curNode.level
      }
    }
  }
}
</script>
