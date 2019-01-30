<template>
  <d2-container better-scroll>
    <div class="tips-box d2-mb">
      <div class="tips-add-box d2-pl-10">1. <b>新增</b>：选中树节点，点击<em>新增按钮</em>，在右边填入部门相关信息，点击保存即可！<b>编辑</b>：选中树节点，点击<em>编辑按钮</em>，在右边修改部门相关信息，点击更新即可！</div>
      <div class="tips-edit-box d2-pl-10">2. 点击树节点前面的 <i class="el-icon-caret-right"></i> 箭头，可以展开树节点</div>
    </div>
    <el-row :gutter="20">
      <el-col :span="10">
        <el-card header="组织机构" body-style="{padding: '5px'}">
          <el-tree
            node-key="id"
            ref="deptTree"
            highlight-current
            :data="deptTreeData"
            :props="defaultProps"
            :expand-on-click-node="false"
            :default-expanded-keys="aExpandedKeys"
            @node-click="handleNodeClick"
            @node-expand="nodeExpand"
            @node-collapse="nodeCollapse">
            <span class="d2-tree-node" slot-scope="{ node }">
              <span>{{ node.label }}</span>
              <span>
                <el-button type="text" @click="() => handleAdd(node)"><i class="el-icon-circle-plus-outline" title="新增"></i></el-button>
                <el-button v-if="node.level > 1" type="text" @click="() => handleEdit(node)"><i class="el-icon-edit-outline" title="编辑"></i></el-button>
                <el-button v-if="node.level > 1" type="text" @click="() => handleDelete(node)" style="color:#F56C6C;"><i class="el-icon-delete" title="删除"></i></el-button>
              </span>
            </span>
          </el-tree>
        </el-card>
      </el-col>
      <el-col :span="14">
        <el-card :header="textMap[formStatus]" body-style="{padding: '5px'}" v-loading="loading">
          <el-form :label-position="labelPosition" :rules="rules" label-width="100px" :model="form" ref="form" size="small">
            <input type="hidden" v-model="form.id" />
            <el-form-item label="上级部门" prop="parent_id">
              <el-input v-model="form.parent_dept_name" :disabled="formEdit" readonly placeholder="请输入上级部门"></el-input>
              <el-input v-model="form.parent_id" :disabled="formEdit" v-show="false" readonly placeholder="请输入父级节点"></el-input>
            </el-form-item>
            <el-form-item label="部门名称" prop="dept_name">
              <el-input v-model="form.dept_name" :disabled="formEdit" placeholder="请输入部门名称"></el-input>
            </el-form-item>
            <el-form-item label="部门层级" prop="dept_level">
              <el-input v-model="form.dept_level" :disabled="formEdit" placeholder="请输入部门层级"></el-input>
            </el-form-item>
            <el-form-item label="负责人">
              <el-input v-model="form.principal_user_name" :disabled="formEdit" placeholder="请设置部门负责人">
                <el-button slot="append" icon="el-icon-search" :disabled="formEdit" @click="openDialog('manager')">选择</el-button>
              </el-input>
              <el-input v-model="form.principal_user_id" v-show=false />
            </el-form-item>
            <el-form-item label="审核人">
              <el-input v-model="form.order_reviewer_name" :disabled="formEdit" placeholder="请设置审核人(客户、拜访、活动)">
                <el-button slot="append" icon="el-icon-search" :disabled="formEdit" @click="openDialog('review')">选择</el-button>
              </el-input>
              <el-input v-model="form.order_reviewer_id" v-show=false />
            </el-form-item>
            <el-form-item label="数据域" prop="dataArea" v-if="!formEdit">
              <el-input v-model="form.data_area" disabled></el-input>
            </el-form-item>
            <el-form-item label="排序" prop="orderList">
              <el-input-number v-model="form.order_list" :min="1"></el-input-number>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog width="50%" append-to-body :title="textMap[dialogStatus]" :visible.sync="dialogTreeVisible" @open="handleDialogOpen" @close="handleDialogClose">
      <el-tree
        lazy
        ref="deptUserTree"
        show-checkbox
        node-key="id"
        class="d2-tree"
        highlight-current
        :props="defaultProps"
        :load="loadDeptUserTree"
        @node-click="handleNodeExpand"
        @node-expand="handleNodeExpand">
        <span class="d2-tree-node" slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
          <span>
            <el-button v-if="data.leaf === true && data.disabled === false" type="text" @click="() => confirm(data)">确定</el-button>
          </span>
        </span>
      </el-tree>
    </el-dialog>
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
import { fetchTree, fetchDeptUserTree, getObj, addObj, delObj, putObj } from '@/api/dept'
import { mapGetters } from 'vuex'
export default {
  name: 'upms-dept',
  data () {
    return {
      formEdit: true,
      formStatus: 'normal',
      loading: false,
      listQuery: {
        name: undefined
      },
      labelPosition: 'right',
      form: {
        order_list: 10
      },
      deptTreeData: [],
      aExpandedKeys: ['0'],
      oExpandedKey: {
        // key (from tree id) : expandedOrNot boolean
      },
      oTreeNodeChildren: {
        // id1 : [children] (from tree node id1)
        // id2 : [children] (from tree node id2)
      },
      defaultProps: {
        children: 'children',
        label: 'name',
        disabled: 'disabled',
        isLeaf: 'leaf'
      },
      resolve: null,
      isFirst: true,
      deptUserTreeQuery: {
        parentId: null,
        isLoadUser: false
      },
      // 组织机构树选中的节点
      checkedNode: undefined,
      // 组织机构树(含用户)，默认根节点ID
      treeRootId: '',
      textMap: {
        create: '新增部门',
        update: '编辑部门',
        review: '选择审核人',
        normal: '组织机构表单',
        manager: '选择部门负责人'
      },
      dialogStatus: '',
      rules: {
        parent_id: [
          {
            required: true,
            message: '上级部门不能为空',
            trigger: 'blur'
          }
        ],
        dept_name: [
          {
            required: true,
            min: 3,
            max: 100,
            message: '请输入部门名称，长度为 3 到 100 个字符',
            trigger: 'blur'
          }
        ],
        dept_level: [
          {
            required: true,
            message: '请输入部门层级，如1，2，3',
            trigger: 'blur'
          }
        ]
      },
      dialogTreeVisible: false,
      deptManager_btn_add: false,
      deptManager_btn_edit: false,
      deptManager_btn_del: false
    }
  },
  created () {
    this.initDeptTree()
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
    initDeptTree () {
      fetchTree(this.listQuery).then(response => {
        this.deptTreeData = response.data
      })
    },
    handleNodeClick (data, node) {
      // 当前选择的树节点
      this.checkedNode = node
      this.deptUserTreeQuery.parentId = data.id
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
    handleNodeExpand (data, node) {
      // this.deptUserTreeQuery.parentId = data.id
    },
    handleEdit (node) {
      this.formEdit = false
      this.formStatus = 'update'
      this.loading = true
      getObj(node.data.id).then(res => {
        let data = res.data
        this.form = data
        this.form.parent_id = data.department.id
        this.form.parent_dept_name = data.department.dept_name
        if (data.leader && data.leader.realname) {
          this.form.principal_user_name = data.leader.realname
        }
        if (data.reviewer && data.reviewer.realname) {
          this.form.order_reviewer_name = data.reviewer.realname
        }
        this.loading = false
      })
    },
    handleAdd (node) {
      this.resetForm()
      this.formEdit = false
      this.formStatus = 'create'
      this.form.is_parent = 0
      this.form.dept_level = node.level
      this.form.parent_id = node.data.id
      this.form.parent_dept_name = node.data.name
    },
    handleDelete (node) {
      this.$confirm('此操作将永久删除节点 "' + node.data.name + '" 及子节点, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delObj(node.data.id).then(() => {
          this.onCancel()
          this.resetForm()
          this.initDeptTree()

          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
        })
      }).catch(() => {})
    },
    update () {
      putObj(this.form).then(() => {
        this.initDeptTree()
        this.resetForm()
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
        this.initDeptTree()
        this.resetForm()
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
    openDialog (state) {
      this.dialogStatus = state
      this.dialogTreeVisible = true
    },
    handleDialogOpen () {
      if (this.$refs.deptUserTree) {
        this.$refs.deptUserTree.load(this.checkedNode, this.resolve)
      }
    },
    handleDialogClose () {
      this.removeDeptUserTree()
    },
    loadDeptUserTree (node, resolve) {
      if (this.isFirst) {
        this.resolve = resolve
        this.isFirst = false
      }
      fetchDeptUserTree(this.deptUserTreeQuery).then(res => {
        resolve(res.data)
        if (!this.deptUserTreeQuery.isLoadUser) {
          console.log('treeRootId=', res.data[0].id)
          this.treeRootId = res.data[0].id
          this.deptUserTreeQuery.isLoadUser = true
        }
      })
    },
    removeDeptUserTree () {
      console.log(this.treeRootId)
      if (this.treeRootId) {
        let rootNode = this.$refs.deptUserTree.getNode(this.treeRootId)
        if (rootNode !== null) {
          this.$refs.deptUserTree.remove(rootNode)
          this.deptUserTreeQuery.isLoadUser = false
        }
      }
    },
    confirm (data) {
      if (this.dialogStatus === 'manager') {
        this.form.principal_user_id = data.id
        this.form.principal_user_name = data.name
      } else {
        this.form.order_reviewer_id = data.id
        this.form.order_reviewer_name = data.name
      }
      this.removeDeptUserTree()
      this.dialogTreeVisible = false
    },
    resetForm () {
      this.form = {
        order_list: 10
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '~@/assets/style/public.scss';
  .tips-box {
    display: flex;
    flex-flow: column wrap;
    width: 100%;
    color: $color-text-sub;
    font-size: 14px;
    line-height: 30px;
    background: $color-bg;
    em {
      color: $color-primary;
    };
    i {
      color: $color-warning;
    }
  }
</style>
