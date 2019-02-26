<template>
<d2-container better-scroll>
  <!-- header 查询条件 -->
  <template slot="header">
    <el-form
      :inline="true"
      :model="listQuery"
      size="mini"
      style="margin-bottom: -18px;">
        <el-form-item label="用户组" prop="groupName">
          <el-input @keyup.enter.native="handleFilter" placeholder="用户组名称" v-model="listQuery.groupName" clearable>
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

    <el-table-column align="center" label="序号">
      <template slot-scope="scope">
        <span>{{scope.row.order_list}}</span>
      </template>
    </el-table-column>
    <el-table-column align="center" label="用户组名称">
      <template slot-scope="scope">
        <span>{{scope.row.group_name }}</span>
      </template>
    </el-table-column>
    <el-table-column label="用户组编码">
      <template slot-scope="scope">
        <span>{{scope.row.group_code}}</span>
      </template>
    </el-table-column>
    <el-table-column align="center" label="系统默认分组">
      <template slot-scope="scope">
        <el-tag :type="scope.row.dept_id === '0' ? 'warning' : 'success'">{{scope.row.dept_id | statusFilter}}</el-tag>
      </template>
    </el-table-column>
    <el-table-column align="center" label="描述">
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
        <el-tooltip content="给用户分组分配角色" placement="top">
          <el-button size="mini" type="success" plain @click="handlePermission(scope.row)" icon="el-icon-rank">角色</el-button>
        </el-tooltip>
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

  <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="400px" append-to-body>
    <el-form :model="form" :rules="rules" ref="form" label-width="80px" size="small">
      <el-form-item label="行号" prop="id" v-if="dialogStatus == 'update'">
        <el-input v-model="form.id" :disabled=true />
      </el-form-item>
      <el-form-item label="用户组" prop="group_name">
        <el-input v-model="form.group_name" placeholder="用户组名称"></el-input>
      </el-form-item>
      <el-form-item label="编码" prop="group_code">
        <el-input v-model="form.group_code" placeholder="用户组编码"></el-input>
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

  <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogPermissionVisible" width="800px" append-to-body>
    <div style="text-align: center">
      <el-transfer
        style="text-align: left; display: inline-block"
        v-model="checkedKeys"
        :data="roleOptions"
        v-loading="loading"
        :titles="['角色列表', '选中角色列表']"
        :right-default-checked="checkedKeys"
        @change="handleChange"
        :props="{
          key: 'id',
          label: 'name'
        }">
      </el-transfer>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="updatePermession()" size="mini" icon="el-icon-check">授 权</el-button>
    </div>
  </el-dialog>
</d2-container>
</template>

<script>
import { fetchList, addObj, putObj, delObj, fetchCheckedRoleList, updateGroupPermission } from '@/api/group'
import { mapGetters } from 'vuex'

export default {
  name: 'upms-group',
  data () {
    return {
      roleOptions: [],
      checkedKeys: [],
      list: null,
      total: null,
      loading: false,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        isAsc: true,
        orderByField: 'order_list'
      },
      form: {
        order_list: 10
      },
      groupId: undefined,
      rules: {
        group_name: [
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
        description: [
          {
            min: 3,
            max: 100,
            message: '长度在 3 到 100 个字符',
            trigger: 'blur'
          }
        ]
      },
      statusOptions: ['0', '1'],
      dialogFormVisible: false,
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
  filters: {
    statusFilter (status) {
      if (status === '0') {
        return '是'
      }
      return '否'
    }
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
      this.form.group_name = row.group_name
      this.form.group_code = row.group_code
      this.form.order_list = row.order_list
      this.form.description = row.description
      this.dialogFormVisible = true
      this.dialogStatus = 'update'
    },
    handlePermission (row) {
      this.loading = true
      this.dialogStatus = 'permission'
      this.dialogPermissionVisible = true
      fetchCheckedRoleList(row.id).then(res => {
        this.loading = false
        this.checkedKeys = res.data.checkedKeys
        this.roleOptions = res.data.roleOptions
        this.groupId = row.id
      })
    },
    handleChange (val, direction, movedKeys) {
      this.checkedKeys = val
    },
    updatePermession () {
      let roleIds = this.checkedKeys.join(',')
      updateGroupPermission(this.groupId, roleIds).then(res => {
        this.$notify({
          title: '成功',
          message: '修改成功',
          type: 'success',
          duration: 2000
        })
        this.dialogPermissionVisible = false
      })
    },
    handleDelete (row) {
      let that = this
      this.$confirm('确定删除分组 "' + row.group_name + '" 吗', '提示', {
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
    resetTemp () {
      this.form = {
        id: undefined,
        group_name: undefined,
        group_code: undefined,
        order_list: undefined,
        description: undefined
      }
    }
  }
}
</script>
