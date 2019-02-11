<template>
  <d2-container>
    <!-- header 查询条件 -->
    <template slot="header">
      <el-form :inline="true" :model="listQuery" size="mini" style="margin-bottom: -18px;">
          <el-form-item label="类型名称" prop="name">
            <el-input @keyup.enter.native="handleFilter" style="width: 200px;" placeholder="类型名称" v-model="listQuery.name" />
          </el-form-item>
          <el-form-item>
            <el-button type="default" icon="el-icon-search" @click="handleFilter">搜 索</el-button>
          </el-form-item>
          <el-form-item style="float: right">
            <el-button v-if="sys_dict_add" style="float: right" @click="handleCreate" type="primary" icon="el-icon-plus">新 增</el-button>
          </el-form-item>
      </el-form>
    </template>
    <el-table :key='tableKey' :data="list" v-loading="listLoading" stripe size="mini" style="width: 100%"
      element-loading-text="拼命加载中..."
      highlight-current-row>
      <el-table-column type="selection" width="60"></el-table-column>
      <el-table-column align="center" label="类型名称">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="类型编码">
        <template slot-scope="scope">
          <span>{{ scope.row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="序号">
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
          <el-button v-if="sys_dict_upd" size="mini" type="success" @click="handleUpdate(scope.row)" icon="el-icon-edit"></el-button>
          <el-button v-if="sys_dict_del" size="mini" type="danger" @click="handleDelete(scope.row)" icon="el-icon-delete"></el-button>
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
      <el-form :model="form" :rules="rules" ref="form" label-width="100px" size="mini">
        <el-form-item label="编号" prop="id" v-if="dialogStatus == 'update'">
          <el-input v-model="form.id" placeholder="编号" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="类型名称" prop="name">
          <el-input v-model="form.name" placeholder="类型名称"></el-input>
        </el-form-item>
        <el-form-item label="类型编码" prop="code">
          <el-input v-model="form.code" placeholder="类型编码"></el-input>
        </el-form-item>
        <el-form-item label="序号" prop="order_list">
          <el-input-number v-model="form.order_list" :min="1" placeholder="请输入序号"></el-input-number>
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
import { fetchList, addObj, putObj, delObj } from '@/api/dict_type'
import { mapGetters } from 'vuex'

export default {
  name: 'upms-dict-type',
  data () {
    return {
      list: null,
      total: null,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 10
      },
      rules: {
        code: [
          {
            required: true,
            message: '类型不能为空',
            trigger: 'blur'
          }
        ],
        name: [
          {
            required: true,
            message: '字典名称不能为空',
            trigger: 'blur'
          }
        ]
      },
      form: {
        order_list: 10
      },
      dialogFormVisible: false,
      dialogStatus: '',
      sys_dict_add: true,
      sys_dict_upd: true,
      sys_dict_del: true,
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
    /* this.sys_dict_add = this.permissions['sys_dict_add']
    this.sys_dict_upd = this.permissions['sys_dict_upd']
    this.sys_dict_del = this.permissions['sys_dict_del'] */
  },
  methods: {
    getList () {
      this.listLoading = true
      this.listQuery.orderByField = 'create_date'
      this.listQuery.isAsc = false
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
      delObj(row).then(response => {
        this.dialogFormVisible = false
        this.getList()
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
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
      this.form = {}
    },
    update (formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
          this.form.password = undefined
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
    }
  }
}
</script>
