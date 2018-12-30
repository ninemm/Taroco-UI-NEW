<template>
<d2-container>
  <!-- header 查询条件 -->
  <template slot="header">
    <el-form
      :inline="true"
      :model="listQuery"
      size="mini"
      style="margin-bottom: -18px;">
        <el-form-item label="角色名称" prop="roleName">
          <el-input @keyup.enter.native="handleFilter" placeholder="角色名称" v-model="listQuery.roleName" clearable>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="default" @click="handleFilter" icon="el-icon-search">搜 索</el-button>
        </el-form-item>
        <el-form-item style="float: right">
          <el-button style="float: right" @click="handleCreate" type="primary" icon="el-icon-plus">新 增</el-button>
        </el-form-item>
    </el-form>
  </template>
  <el-table
        :key='tableKey'
        :data="list"
        v-loading="listLoading"
        element-loading-text="拼命加载中..."
        highlight-current-row
        stripe
        size="mini"
        style="width: 100%">

    <el-table-column align="center" label="序号" width="60">
      <template slot-scope="scope">
        <span>{{scope.row.order_list}}</span>
      </template>
    </el-table-column>

    <el-table-column align="center" label="所属部门">
      <template slot-scope="scope">
        <span>{{scope.row.department.dept_name }}</span>
      </template>
    </el-table-column>

    <el-table-column label="角色名称">
      <template slot-scope="scope">
        <span>{{scope.row.role_name}}</span>
      </template>
    </el-table-column>

    <el-table-column align="center" label="角色标识">
      <template slot-scope="scope">
        <span>{{scope.row.role_code}}</span>
      </template>
    </el-table-column>

    <el-table-column align="center" label="角色描述">
      <template slot-scope="scope">
        <span>{{scope.row.description }}</span>
      </template>
    </el-table-column>

    <el-table-column align="center" label="创建时间">
      <template slot-scope="scope">
        <span>{{scope.row.create_date | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
      </template>
    </el-table-column>

    <el-table-column label="操作" width="220">
      <template slot-scope="scope">
        <el-button size="mini" type="primary" @click="handleUpdate(scope.row)" icon="el-icon-edit"></el-button>
        <el-button size="mini" type="danger" @click="handleDelete(scope.row)" icon="el-icon-delete"></el-button>
        <el-button size="mini" type="success" plain @click="handlePermission(scope.row)" icon="el-icon-rank">权限</el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- footer 分页条 -->
  <template slot="footer">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="listQuery.page"
        :page-sizes="[10,20,30,50]"
        :page-size="listQuery.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        style="margin: -10px;">
      </el-pagination>
  </template>
  <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="400px">
    <el-form :model="form" :rules="rules" ref="form" label-width="80px" size="small">
      <el-form-item label="行号" prop="id" v-if="dialogStatus == 'update'">
        <el-input v-model="form.id" :disabled=true />
      </el-form-item>
      <el-form-item label="角色名称" prop="role_name">
        <el-input v-model="form.role_name" placeholder="角色名称"></el-input>
      </el-form-item>
      <el-form-item label="角色标识" prop="role_code">
        <el-input v-model="form.role_code" placeholder="角色标识"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input type="textarea" v-model="form.description" placeholder="描述"></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="order_list">
        <el-input-number v-model="form.order_list" :min="1" label="排序（升序）"></el-input-number>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel('form')" icon="el-icon-close" size="mini">取 消</el-button>
      <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')" icon="el-icon-check" size="mini">确 定</el-button>
      <el-button v-else type="primary" @click="update('form')" icon="el-icon-check" size="mini">修 改</el-button>
    </div>
  </el-dialog>

  <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogDeptVisible" width="600px">
    <el-tree class="filter-tree" :data="treeDeptData" :default-checked-keys="checkedKeys" check-strictly node-key="id" highlight-current ref="deptTree" @node-click="getNodeData" :props="defaultProps" :filter-node-method="filterNode" default-expand-all>
    </el-tree>
  </el-dialog>

  <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogPermissionVisible" width="800px" top="20px">
    <el-tree class="filter-tree" :data="treeData" :default-checked-keys="checkedKeys" check-strictly node-key="id" highlight-current :props="defaultProps" show-checkbox ref="menuTree" :filter-node-method="filterNode">
    </el-tree>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="updatePermession(roleId, roleCode)" icon="el-icon-check">授 权</el-button>
    </div>
  </el-dialog>
</d2-container>
</template>

<script>
import {
  fetchList,
  addObj,
  putObj,
  delObj,
  permissionUpd,
  fetchRoleTree,
  fetchDeptTree
} from '@/api/role'
import { fetchTree } from '@/api/menu'
import { mapGetters } from 'vuex'

export default {
  name: 'table_role',
  data () {
    return {
      treeData: [],
      treeDeptData: [],
      checkedKeys: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        isAsc: true,
        orderByField: 'dept_id order_list'
      },
      form: {
        order_list: 10
      },
      roleId: undefined,
      roleCode: undefined,
      rules: {
        role_name: [
          {
            required: true,
            message: '角色名称',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 20,
            message: '长度在 3 到 20 个字符',
            trigger: 'blur'
          }
        ],
        role_code: [
          {
            required: true,
            message: '角色标识',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 20,
            message: '长度在 3 到 20 个字符',
            trigger: 'blur'
          }
        ],
        description: [
          {
            min: 3,
            max: 20,
            message: '长度在 3 到 20 个字符',
            trigger: 'blur'
          }
        ]
      },
      statusOptions: ['0', '1'],
      rolesOptions: undefined,
      dialogFormVisible: false,
      dialogDeptVisible: false,
      dialogPermissionVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建',
        permission: '分配权限'
      },
      tableKey: 0,
      roleManager_btn_add: false,
      roleManager_btn_edit: false,
      roleManager_btn_del: false,
      roleManager_btn_perm: false
    }
  },
  created () {
    this.getList()
    // this.roleManager_btn_add = this.permissions['sys_role_add']
    // this.roleManager_btn_edit = this.permissions['sys_role_edit']
    // this.roleManager_btn_del = this.permissions['sys_role_del']
    // this.roleManager_btn_perm = this.permissions['sys_role_perm']
  },
  computed: {
    ...mapGetters(['elements', 'permissions'])
  },
  methods: {
    handleFilter () {
      this.listQuery.page = 1
      this.getList()
    },
    getList () {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleSizeChange (val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange (val) {
      this.listQuery.page = val
      this.getList()
    },
    handleCreate () {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    handleUpdate (row) {
      this.form.id = row.id
      this.form.role_name = row.role_name
      this.form.role_code = row.role_code
      this.form.order_list = row.order_list
      this.form.description = row.description
      this.dialogFormVisible = true
      this.dialogStatus = 'update'
    },
    handlePermission (row) {
      fetchRoleTree(row.role_code)
        .then(response => {
          this.checkedKeys = response.data
          return fetchTree()
        })
        .then(response => {
          this.treeData = response.data
          this.dialogStatus = 'permission'
          this.dialogPermissionVisible = true
          this.roleId = row.roleId
          this.role_code = row.role_code
        })
    },
    handleDept () {
      fetchDeptTree().then(response => {
        this.treeDeptData = response.data
        this.dialogDeptVisible = true
      })
    },
    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    getNodeData (data) {
      this.dialogDeptVisible = false
      this.form.roleDeptId = data.id
      this.form.deptName = data.name
    },
    handleDelete (row) {
      let that = this
      this.$confirm('确定删除角色"' + row.role_name + '"', '提示', {
        type: 'warning'
      }).then(() => {
        delObj(row.id).then(response => {
          that.dialogFormVisible = false
          that.getList()
          that.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
        })
      }).catch(() => {})
    },
    create (formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          addObj(this.form).then(() => {
            this.dialogFormVisible = false
            this.getList()
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        } else {
          return false
        }
      })
    },
    cancel (formName) {
      this.dialogFormVisible = false
      this.$refs[formName].resetFields()
    },
    update (formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
          putObj(this.form).then(() => {
            this.dialogFormVisible = false
            this.getList()
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 2000
            })
          })
        } else {
          return false
        }
      })
    },
    updatePermession (roleId, roleCode) {
      permissionUpd(roleId, this.$refs.menuTree.getCheckedKeys()).then(() => {
        this.dialogPermissionVisible = false
        fetchTree()
          .then(response => {
            this.treeData = response.data
            return fetchRoleTree(roleCode)
          })
          .then(response => {
            this.checkedKeys = response.data
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 2000
            })
          })
      })
    },
    resetTemp () {
      this.form = {
        id: undefined,
        role_name: undefined,
        role_code: undefined,
        order_list: undefined,
        description: undefined
      }
    }
  }
}
</script>
