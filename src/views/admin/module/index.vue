<template>
  <d2-container better-scroll>
    <!-- header 查询条件 -->
    <template slot="header">
      <el-form
        :inline="true"
        :model="listQuery"
        size="mini"
        style="margin-bottom: -18px;">
          <el-form-item label="平台名称" prop="systemId">
            <el-select v-model="listQuery.systemId" clearable placeholder="请选择">
              <el-option
                v-for="item in systemOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="名称" prop="moduleName">
            <el-input @keyup.enter.native="handleFilter" style="width: 200px;" placeholder="模块名称" v-model="listQuery.moduleName">
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
    <el-table
      :key='tableKey'
      :data="list"
      size="mini"
      v-loading="listLoading"
      element-loading-text="拼命加载中..."
      stripe
      style="width: 100%">
      <el-table-column align="center" label="平台名称" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.system_name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="父模块">
        <template slot-scope="scope">
          <span>{{ scope.row.parent_module_name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="模块名称" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.module_name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="模块编码">
        <template slot-scope="scope">
          <span>{{ scope.row.module_code }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="排序" prop="orderList" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.order_list }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.create_date | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button size="mini" type="success" @click="handleUpdate(scope.row)" icon="el-icon-edit"></el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)" icon="el-icon-delete"></el-button>
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
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="400px" :before-close="handleClose" append-to-body>
      <el-form :model="form" :rules="rules" ref="form" label-width="80px" size="small">
        <el-form-item label="行号" prop="id" v-if="dialogStatus=='update'">
          <el-input v-model="form.id" placeholder="编号" :disabled=true></el-input>
        </el-form-item>
        <el-form-item label="平台名称" prop="system_id">
          <el-select v-model="form.system_id" placeholder="请选择" clearable>
            <el-option
              v-for="item in systemOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item ref="treeParent" label="父模块" prop="parent_module_name">
          <el-input @click.native="moduleTree($event)" v-model="form.parent_module_name" placeholder="父模块" suffix-icon="el-icon-caret-bottom" readonly></el-input>
          <el-tree
            lazy
            ref="tree"
            class="d2-tree"
            v-show="isShowTree"
            highlight-current
            :props="defaultProps"
            :load="findModuleTreeList">
            <span class="d2-tree-node" slot-scope="{ node, data }">
              <span>{{ node.label }}</span>
              <span>
                <el-button v-if="node.level>1" type="text" @click="() => confirm(data)">确定</el-button>
              </span>
            </span>
          </el-tree>
        </el-form-item>
        <el-form-item label="模块名称" prop="module_name">
          <el-input v-model="form.module_name" placeholder="模块名称"></el-input>
        </el-form-item>
        <el-form-item label="模块编码" prop="module_code">
          <el-input v-model="form.module_code" placeholder="模块编码"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="order_list">
          <el-input-number v-model="form.order_list" :min="1" label="排序（升序）"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="cancel('form')" icon="el-icon-close">取 消</el-button>
        <el-button size="mini" v-if="dialogStatus=='create'" type="primary" @click="create('form')" icon="el-icon-check">确 定</el-button>
        <el-button size="mini" v-else type="primary" @click="update('form')" icon="el-icon-check">修 改</el-button>
      </div>
    </el-dialog>
  </d2-container>
</template>

<script>
import { fetchList, addObj, putObj, delObj, fetchTreeList } from '@/api/module'
import { fetchListAsSelect } from '@/api/systems'
import { mapGetters } from 'vuex'

export default {
  name: 'upms-module',
  data () {
    return {
      list: null,
      total: null,
      systemOptions: null,
      listLoading: true,
      isShowTree: false,
      listQuery: {
        page: 1,
        limit: 10
      },
      rules: {
        module_name: [
          { required: true, message: '模块名称不能为空', trigger: 'blur' }
        ],
        module_code: [
          { required: true, message: '模块编码不能为空', trigger: 'blur' }
        ],
        system_id: [
          { required: true, message: '平台不能为空', trigger: 'blur' }
        ],
        parent_module_name: [
          { required: true, message: '父模块不能为空', trigger: 'blur' }
        ]
      },
      form: {
        order_list: 10
      },
      defaultProps: {
        children: 'children',
        label: 'name',
        disabled: 'disabled',
        isLeaf: 'isLeaf'
      },
      moduleTreeQuery: {
        parentId: null
      },
      dialogFormVisible: false,
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
    this.getSystemOptions()
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
    getSystemOptions () {
      fetchListAsSelect().then(response => {
        this.systemOptions = response.data
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
      this.$confirm('确定删除模块"' + row.module_name + '"', '提示', {
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
      })
    },
    handleUpdate (row) {
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.form = row
    },
    handleCreate () {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    handleClose () {
      this.dialogFormVisible = false
      this.resetForm()
    },
    create (formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          addObj(this.form).then(() => {
            this.dialogFormVisible = false
            const set = this.$refs
            set[formName].resetFields()
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
      this.resetForm()
    },
    update (formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          putObj(this.form).then(() => {
            this.cancel(formName)
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
    moduleTree (e) {
      this.isShowTree = !this.isShowTree
      // 点击其它区域树消失
      document.onclick = function () {
        this.isShowTree = false
      }
      e.stopPropagation()
      let that = this
      that.$refs.tree.$el.onmouseleave = function () {
        that.isShowTree = false
      }

      that.$refs.treeParent.$el.onmouseleave = function () {
        that.isShowTree = false
      }
    },
    confirm (data) {
      this.form.parent_id = data.id
      this.form.parent_module_name = data.name
      this.isShowTree = false
      this.$refs['form'].clearValidate('parent_module_name')
    },
    findModuleTreeList (node, resolve) {
      if (node.level !== 0) {
        this.moduleTreeQuery.parentId = node.data.id
      }
      fetchTreeList(this.moduleTreeQuery).then(res => {
        resolve(res.data)
      })
    },
    resetForm () {
      this.form = {}
    }
  }
}
</script>

<style>
  .d2-tree {
    height: 200px;
    position: absolute;
    z-index: 100;
  }
</style>
