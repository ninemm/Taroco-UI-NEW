<template>
  <d2-container better-scroll>
    <!-- header 查询条件 -->
    <template slot="header">
      <el-form
        :inline="true"
        :model="listQuery"
        size="mini"
        style="margin-bottom: -18px;">
          <el-form-item label="功能名称" prop="operationName">
            <el-input @keyup.enter.native="handleFilter" v-model="listQuery.operationName" clearable placeholder="功能名称">
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="default" icon="el-icon-search" @click="handleFilter">搜 索</el-button>
          </el-form-item>
          <el-form-item style="float: right">
            <el-button style="float: right" @click="handleCreate" type="primary" icon="el-icon-plus">新 增</el-button>
          </el-form-item>
      </el-form>
    </template>
    <el-table :key='tableKey' :data="list" size="mini" v-loading="listLoading" stripe style="width: 100%"
      highlight-current-row
      :default-sort="{prop: 'order_list', order: 'descending'}">
      <el-table-column align="center" label="模块名称" prop="module_name" sortable=true width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.module_name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="功能名称" sortable=true width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.operation_name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" label="权限编码" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.operation_code }}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" label="URL" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.url }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否权限">
        <template slot-scope="scope">
          <el-tag :type="scope.row.is_privilege === 1 ? 'success' : 'warning'">
            <span>{{ scope.row.is_privilege === 1 ? '是' : '否' }}</span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="排序" prop="order_list" sortable width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.order_list }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.create_date | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="240" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleUpdate(scope.row)" icon="el-icon-edit" title="编辑"></el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)" icon="el-icon-delete" title="删除"></el-button>
          <el-button size="mini" type="success" plain @click="handleSetMenu(scope.row)" icon="el-icon-menu" title="设置菜单">菜单设置</el-button>
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

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="700px" append-to-body>
      <el-form :model="form" :rules="rules" ref="form" label-width="80px" size="small">
        <el-form-item label="行号" prop="id" v-if="dialogStatus=='update'">
          <el-input v-model="form.id" placeholder="编号" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="模块名称" prop="module_name">
          <el-input v-model="form.module_name" placeholder="模块名称" suffix-icon="el-icon-search" @focus="openModuleTreeDialog()" readonly>
          </el-input>
          <el-input v-model="form.module_id" v-show=false></el-input>
        </el-form-item>
        <el-form-item label="功能权限" prop="operation_name">
          <el-input v-model="form.operation_name" placeholder="功能权限"></el-input>
        </el-form-item>
        <el-form-item label="权限编码" prop="operation_code">
          <el-input v-model="form.operation_code" placeholder="权限编码"></el-input>
        </el-form-item>
        <el-form-item label="URL" prop="url">
          <el-input v-model="form.url" placeholder="URL"></el-input>
        </el-form-item>
        <el-form-item label="权限菜单" prop="is_privilege">
          <el-radio-group v-model="form.is_privilege">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序" prop="order_list">
          <el-input-number v-model="form.order_list" :min="1" label="排序（升序）"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="cancel('form')" icon="el-icon-close">取 消</el-button>
        <el-button size="small" v-if="dialogStatus=='create'" type="primary" @click="create('form')" icon="el-icon-check">确 定</el-button>
        <el-button size="small" v-else type="primary" @click="update('form')" icon="el-icon-check">修 改</el-button>
      </div>

      <el-dialog title="模块选择" :visible.sync="dialogModuleVisible" width="40%" append-to-body>
        <div class="module-tree">
          <el-scrollbar style="height: 100%;">
            <el-tree lazy node-key="id" highlight-current :props="defaultProps" :load="findModuleTreeList">
              <span class="d2-tree-node" slot-scope="{ node, data }">
                <span>{{ node.label }}</span>
                <span>
                  <el-button v-if="node.level > 1" type="text" @click="() => confirm(data)"><i class="el-icon-circle-check" title="确定"></i></el-button>
                </span>
              </span>
            </el-tree>
          </el-scrollbar>
        </div>
      </el-dialog>
    </el-dialog>
  </d2-container>
</template>

<script>
import { fetchList, addObj, putObj, delObj, addMenu } from '@/api/operation'
import { fetchTreeList } from '@/api/module'
import { mapGetters } from 'vuex'

export default {
  name: 'upms-operation',
  data () {
    return {
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10
      },
      rules: {
        module_name: [
          { required: true, message: '模块不能为空', trigger: 'blur' }
        ],
        operation_name: [
          { required: true, message: '功能权限不能为空', trigger: 'blur' },
          { max: 15, message: '名称过长', trigger: 'blur' }
        ],
        operation_code: [
          { required: true, message: '功能编码不能为空', trigger: 'blur' },
          { max: 15, message: '编码过长', trigger: 'blur' }
        ],
        url: [
          { required: true, message: 'url不能为空', trigger: 'blur' }
        ],
        order_list: [
          { type: 'number', message: '数字类型错误', trigger: 'blur' }
        ]
      },
      form: {
        is_privilege: 1,
        order_list: 10
      },
      defaultProps: {
        children: 'children',
        label: 'name',
        isLeaf: 'isLeaf'
      },
      moduleTreeQuery: {
        parentId: null
      },
      treeData: [],
      dialogFormVisible: false,
      dialogModuleVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      tableKey: 0
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  filters: {
    statusFilter (status) {
      const statusMap = {
        0: '有效',
        1: '无效'
      }
      return statusMap[status]
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      this.listLoading = true
      this.listQuery.orderByField = 'order_list'
      this.listQuery.isAsc = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleFilter () {
      this.listQuery.page = 1
      this.getList()
    },
    handleSizeChange (val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange (val) {
      this.listQuery.page = val
      this.getList()
    },
    handleDelete (row) {
      let that = this
      this.$confirm('确定删除功能权限 "' + row.operation_name + '" 吗', '提示', {
        type: 'warning'
      }).then(() => {
        delObj(row.id).then(response => {
          that.dialogFormVisible = false
          that.getList()
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
        })
      })
    },
    handleUpdate (row) {
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.form = row
    },
    handleSetMenu (row) {
      this.$confirm('确定设置功能权限 "' + row.operation_name + '" 为菜单吗', '提示', {
        type: 'warning'
      }).then(() => {
        addMenu(row.id)
          .then(res => {
            this.$notify({
              title: '成功',
              message: '设置菜单成功',
              type: 'success',
              duration: 2000
            })
          })
      })
    },
    handleCreate () {
      this.resetForm()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
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
      const set = this.$refs
      set[formName].resetFields()
    },
    update (formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          // this.dialogFormVisible = false
          // this.form.password = undefined
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
    openModuleTreeDialog () {
      // this.dialogStatus = 'open'
      this.dialogModuleVisible = true
    },
    findModuleTreeList (node, resolve) {
      if (node.level !== 0) {
        this.moduleTreeQuery.parentId = node.data.id
      }
      fetchTreeList(this.moduleTreeQuery).then(res => {
        resolve(res.data)
      })
    },
    confirm (data) {
      this.form.module_id = data.id
      this.form.module_name = data.name
      this.dialogModuleVisible = false
      this.$refs['form'].clearValidate('module_name')
    },
    resetForm () {
      this.form = {
        is_privilege: 1,
        order_list: 10
      }
    }
  }
}
</script>

<style>
  .module-tree {
    height: 300px;
    overflow: auto;
  }
  .el-dialog__body {
    padding: 0 20px 20px 20px;
  }
  .el-scrollbar .el-scrollbar__wrap {
    overflow-x: hidden;
  }
</style>
