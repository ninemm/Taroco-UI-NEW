<template>
  <d2-container better-scroll>
    <!-- header 查询条件 -->
    <template slot="header">
      <el-form
        :inline="true"
        :model="listQuery"
        size="mini"
        style="margin-bottom: -18px;">
          <el-form-item label="姓名" prop="realname">
            <el-input @keyup.enter.native="handleFilter" v-model="listQuery.realname" clearable placeholder="姓名">
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="default" @click="handleFilter" icon="el-icon-search">搜 索</el-button>
          </el-form-item>
          <el-form-item style="float: right">
            <el-button v-if="sys_user_add" @click="handleCreate" type="primary" icon="el-icon-plus">新 增</el-button>
            <el-button v-if="sys_user_add" @click="dialogFileVisible = true" type="primary" icon="el-icon-upload">导 入</el-button>
            <el-button v-if="sys_user_del" @click="handleBatchDelete" type="danger" icon="el-icon-delete">批量删除</el-button>
          </el-form-item>
      </el-form>
    </template>
    <!-- table表格 -->
    <el-table
      :key='tableKey'
      :data="list"
      stripe
      size="mini"
      v-loading="listLoading"
      element-loading-text="拼命加载中..."
      highlight-current-row
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="table-expand">
            <el-form-item label="姓名">
              <span>{{ props.row.realname }}</span>
            </el-form-item>
            <el-form-item label="用户名">
              <span>{{ props.row.username }}</span>
            </el-form-item>
            <el-form-item label="手机">
              <span>{{ props.row.mobile }}</span>
            </el-form-item>
            <el-form-item label="部门">
              <span>{{ props.row.department_name }}</span>
            </el-form-item>
            <el-form-item label="用户组">
              <span>{{ props.row.group_name }}</span>
            </el-form-item>
            <el-form-item label="岗位">
              <span>{{ props.row.station_name }}</span>
            </el-form-item>
            <el-form-item label="创建时间">
              <span>{{props.row.create_date | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
            </el-form-item>
            <el-form-item label="状态">
              <el-tag>{{props.row.status | statusFilter}}</el-tag>
            </el-form-item>
            <el-form-item label="微信openid">
              <span>{{ props.row.wechat_open_id }}</span>
            </el-form-item>
            <el-form-item label="企业微信openid">
              <span>{{ props.row.wechat_userid }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column type="selection" width="60"></el-table-column>
      <el-table-column align="center" label="姓名" width="140">
        <template slot-scope="scope">
          <span>{{scope.row.realname}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户名">
        <template slot-scope="scope">
          <span>
            <img v-if="scope.row.avatar" class="user-avatar" style="width: 16px; height: 16px; border-radius: 50%;" :src="scope.row.avatar+'?imageView2/1/w/20/h/20'"> {{scope.row.username}}
          </span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="手机号" width="100">
        <template slot-scope="scope">
          <span>{{scope.row.mobile}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="所属部门" width="120">
        <template slot-scope="scope">
          <span>{{scope.row.department_name}} </span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="用户组" width="150" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.group_name}} </span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="岗位" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.station_name}} </span>
        </template>
      </el-table-column>

      <!--<el-table-column align="center" label="角色">
        <template slot-scope="scope">
          <span v-for="role in scope.row.roleList" :key="role.id">{{role.roleDesc}} </span>
        </template>
      </el-table-column>-->

      <el-table-column align="center" label="创建时间" width="120">
        <template slot-scope="scope">
          <span>{{scope.row.create_date | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>

      <!--<el-table-column align="center" label="标签">
        <template slot-scope="scope">
          <span>{{scope.row.label}}</span>
        </template>
      </el-table-column>-->

      <el-table-column align="center" label="状态">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status === 1 ? 'success' : 'warning'">{{scope.row.status | statusFilter}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="150" fixed="right">
        <template slot-scope="scope">
          <el-button v-if="scope.row.username !== 'admin'" size="mini" type="primary" @click="handleUpdate(scope.row)" icon="el-icon-edit"></el-button>
          <el-button v-if="scope.row.username !== 'admin'" size="mini" type="danger" @click="handleDelete(scope.row)" icon="el-icon-delete"></el-button>
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

    <!-- 新增用户弹框 -->
    <el-dialog
      width="700px"
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      @open="initOptions"
      append-to-body>
      <el-form :model="form" :rules="rules" ref="form" label-width="100px" size="mini">
        <el-form-item label="姓名" prop="realname">
          <el-input v-model="form.realname" placeholder="请输入姓名"></el-input>
        </el-form-item>

        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输用户名"></el-input>
        </el-form-item>

        <el-form-item v-if="dialogStatus == 'create'" label="密码" prop="password">
          <el-input type="password" v-model="form.password" placeholder="请输入密码"></el-input>
        </el-form-item>

        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="form.mobile" placeholder="验证码登录使用"></el-input>
        </el-form-item>

        <el-form-item label="用户类型" prop="type">
          <el-select v-model="form.type" clearable readonly style="width: 550px" placeholder="请选择用户类型">
            <el-option
              v-for="item in typeOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="所属部门" prop="department_name">
          <el-input v-model="form.department_name" placeholder="请选择部门" suffix-icon="el-icon-search" @focus="handleDept()" readonly>
          </el-input>
          <input type="hidden" v-model="form.department_id" />
        </el-form-item>

        <el-row>
          <el-form-item label="所属用户组" prop="group_id">
            <el-select v-model="form.group_id" multiple clearable readonly @change="handleGroupChange" style="width: 550px" placeholder="请选择用户组">
              <el-option
                v-for="item in groupOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
            <input type="hidden" v-model="form.group_name" />
          </el-form-item>
        </el-row>

        <el-form-item label="岗位" prop="station_id">
          <el-select v-model="form.station_id" @change="handleStationChange" multiple clearable readonly style="width: 550px" placeholder="请选择岗位">
            <el-option
              v-for="item in stationOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <input type="hidden" v-model="form.station_name" />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')" icon="el-icon-close" size="small">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')" icon="el-icon-check" size="small">确 定</el-button>
        <el-button v-else type="primary" @click="update('form')" icon="el-icon-check" size="small">修 改</el-button>
      </div>
      <el-dialog title="部门选择" :visible.sync="dialogDeptVisible" width="400px" append-to-body>
        <el-tree
          lazy
          node-key="id"
          class="module-tree"
          highlight-current
          :props="defaultProps"
          :load="loadDeptTree"
          :render-content="renderContent">
        </el-tree>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeDeptDialog" icon="el-icon-close" size="small">取 消</el-button>
        </div>
      </el-dialog>
      <!-- 部门筛选 -->
      <!--<el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogDeptVisible" width="600px">
        <el-tree class="filter-tree"
          :data="treeDeptData"
          :default-checked-keys="checkedKeys"
          check-strictly node-key="id"
          highlight-current ref="deptTree"
          :props="defaultProps"
          @node-click="getNodeData"
          default-expand-all>
        </el-tree>
      </el-dialog>-->
    </el-dialog>

    <!-- 图片上传 -->
    <el-dialog title="用户导入" :visible.sync="dialogFileVisible" width="400px" append-to-body>
      <el-upload
        drag
        :limit=1
        ref="upload"
        action=""
        :multiple=false
        with-credentials
        accept=".xls, .xlsx"
        :file-list="files"
        :http-request='doUploadFile'
        :auto-upload=false>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip el-upload__text" slot="tip">只能上传xls/xlsx文件</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFileVisible=false" icon="el-icon-close" size="small">取 消</el-button>
        <el-button @click="submitUpload" type="primary" icon="el-icon-check" size="small">上 传</el-button>
      </div>
    </el-dialog>
  </d2-container>
</template>

<script>
import { fetchList, getObj, addObj, putObj, delObj, batchDelObj, uploadFile, fetchAllOptions } from '@/api/user'
import { fetchLazyTree } from '@/api/dept'
import { mapGetters } from 'vuex'
import ElRadioGroup from 'element-ui/packages/radio/src/radio-group'
import ElOption from 'element-ui/packages/select/src/option'

export default {
  components: {
    ElOption,
    ElRadioGroup
  },
  name: 'table_upms_user',
  data () {
    return {
      treeDeptData: [],
      checkedKeys: [],
      multipleSelection: [],
      defaultProps: {
        children: 'children',
        label: 'name',
        isLeaf: 'isLeaf'
      },
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10
      },
      deptTreeQuery: {
        parentId: null
      },
      role: [],
      form: {
        status: 1
      },
      rules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 20,
            message: '长度在 3 到 20 个字符',
            trigger: 'blur'
          }
        ],
        realname: [
          {
            required: true,
            message: '请输入用户姓名',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 20,
            message: '长度在 3 到 20 个字符',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 20,
            message: '长度在 6 到 20 个字符',
            trigger: 'blur'
          }
        ],
        department_name: [
          {
            required: false,
            message: '请选择部门',
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            required: true,
            message: '请输入手机号',
            trigger: 'blur'
          },
          {
            min: 11,
            max: 11,
            message: '长度在11 个字符',
            trigger: 'blur'
          }
        ]
      },
      statusOptions: ['0', '1'],
      groupOptions: [],
      stationOptions: [],
      typeOptions: [],
      files: [],
      dialogFormVisible: false,
      dialogDeptVisible: false,
      dialogFileVisible: false,
      sys_user_add: true,
      sys_user_upd: true,
      sys_user_del: true,
      dialogStatus: '',
      textMap: {
        update: '编辑用户',
        create: '新增用户'
      },
      isDisabled: {
        0: false,
        1: true
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
        1: '正常',
        0: '停用',
        9: '锁定'
      }
      return statusMap[status]
    }
  },
  created () {
    this.getList()
    // this.sys_user_add = this.permissions['sys_user_add']
    // this.sys_user_upd = this.permissions['sys_user_upd']
    // this.sys_user_del = this.permissions['sys_user_del']
  },
  methods: {
    getList () {
      this.listLoading = true
      this.listQuery.isAsc = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total
        this.listLoading = false
      })
    },
    getNodeData (data) {
      this.dialogDeptVisible = false
      this.form.department_id = data.id
      this.form.department_name = data.name
    },
    handleDept () {
      this.dialogDeptVisible = true
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
    handleCreate () {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    handleUpdate (row) {
      getObj(row.id).then(res => {
        this.form = res.data
        this.form.group_id = res.data.groupIds
        this.form.station_id = res.data.stationIds
        this.dialogFormVisible = true
        this.dialogStatus = 'update'
      })
    },
    handleSelectionChange (selection) {
      this.multipleSelection = []
      selection.find((obj) => {
        this.multipleSelection.push(obj.id)
      })
    },
    handleDelete (row) {
      this.$confirm('此操作将永久删除该用户(姓名:' + row.realname + '), 是否继续?', '提示', {
        type: 'warning'
      }).then(() => {
        delObj(row.id).then(() => {
          this.getList()
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
        }).cache(() => {
          this.$notify({
            title: '失败',
            message: '删除失败',
            type: 'error',
            duration: 2000
          })
        })
      }).catch(() => {})
    },
    handleBatchDelete () {
      if (this.multipleSelection.length === 0) {
        this.$message({
          message: '请选择用户',
          type: 'warning'
        })
      } else {
        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          type: 'warning'
        }).then(() => {
          batchDelObj(this.multipleSelection).then(res => {
            this.getList()
            this.$notify({
              title: '成功',
              message: '批量删除成功',
              type: 'success',
              duration: 2000
            })
          })
        })
      }
    },
    handleGroupChange (val) {
      this.form.group_name = this.findCheckedOptionNames(this.groupOptions, val)
    },
    handleStationChange (val) {
      this.form.station_name = this.findCheckedOptionNames(this.stationOptions, val)
    },
    findCheckedOptionNames (optionsData, checkedIds) {
      let names = []
      optionsData.find((option) => {
        checkedIds.find((checkId) => {
          if (option.id === checkId) {
            names.push(option.name)
          }
        })
      })
      return names.join(',')
    },
    initOptions () {
      fetchAllOptions().then(res => {
        this.groupOptions = res.data.groupOptions
        this.stationOptions = res.data.stationOptions
        this.typeOptions = res.data.typeOptions
      })
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
    closeDeptDialog () {
      this.dialogDeptVisible = false
    },
    update (formName) {
      const set = this.$refs
      this.form.role = this.role
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
    },
    loadDeptTree (node, resolve) {
      if (node.level !== 0) {
        this.deptTreeQuery.parentId = node.data.id
      }
      fetchLazyTree(this.deptTreeQuery).then(res => {
        resolve(res.data)
      })
    },
    renderContent (h, { node, data, store }) {
      if (node.level === 1) {
        return (
          <span class="custom-tree-node">
            <span>{node.label}</span>
          </span>
        )
      } else {
        return (
          <span class="custom-tree-node">
            <span>{node.label}</span>
            <span>
              <el-button size="mini" type="text" on-click={ () => this.confirm(data) }>确定</el-button>
            </span>
          </span>
        )
      }
    },
    confirm (data) {
      this.form.department_id = data.id
      this.form.department_name = data.name
      this.dialogDeptVisible = false
    },
    submitUpload () {
      this.$refs.upload.submit()
    },
    doUploadFile (param) {
      let formData = new FormData()
      formData.append('file', param.file)
      uploadFile(formData).then(res => {
        this.files.push(param.file)
        this.$refs.upload.clearFiles()
        this.$message.success('导入用户成功')
        this.dialogFileVisible = false
        this.getList()
      })
    },
    resetTemp () {
      this.form = {
        status: 1
      }
    }
  }
}
</script>

<style>
  .table-expand {
    font-size: 0;
  }
  .table-expand label {
    width: 160px;
    color: #99a9bf;
  }
  .table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }

  .module-tree {
    height: 200px;
    overflow: auto;
  }
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
