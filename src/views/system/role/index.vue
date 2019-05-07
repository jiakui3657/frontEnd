<template>
  <div class="app-container">
    <el-container style="border: 1px solid #eee; height:720px;">
      <el-aside width="220px" style="background-color: rgb(238, 241, 246);">
        <!-- <el-tree :data="treeData" :props="defaultProps" ref="deptTree" @node-click="handleNodeClick" :filter-node-method="filterNode"></el-tree> -->
        <dept-tree @nodeClick="handleNodeClick"></dept-tree>
      </el-aside>
      <el-container>
        <el-header style="height: 60px;font-size: 12px">
          <!-- 查询条件区 -->
          <div class="filter-container" style="float: left">
            <label class="radio-label" style="padding-left:0;">角色名称: </label>
            <el-input size="small" label="角色名称" @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="请输入角色名称" v-model="listQuery.roleName"></el-input>
            <el-button size="small" class="filter-item filter-btn" type="primary" v-waves icon="el-icon-search" @click="handleFilter">查询</el-button>
          </div>
          <!-- 工具栏 -->
          <div class="toolbar" style="float: right">
              <el-button size="small" type="primary" class="filter-btn" icon="el-icon-plus" @click="handleCreate">新增</el-button>
              <!-- <el-button size="small" class="filter-item" type="primary" v-waves icon="el-icon-download" @click="educe">导出</el-button> -->
          </div>
        </el-header>
        <el-main>
          <!-- 列表数据区 -->
          <el-table :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%" @selection-change="handleSelect" :header-cell-style="{ 'background-color': '#5F7ABF', 'color': '#fff', border: 'none !important' }">

            <el-table-column align="center" label="序号" type="index" width="60" fixed="left">
            </el-table-column>

            <el-table-column align="center" label="角色名称" fixed="left">
              <template slot-scope="scope">
                <span>{{scope.row.roleName}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="角色归属" fixed="left">
              <template slot-scope="scope">
                <div style="text-align: left!important;" >{{scope.row.nodeName}}</div>
                <!--<span>{{scope.row.nodeName}}</span>-->
              </template>
            </el-table-column>
            <el-table-column label="修改日期" align="center" width="180">
              <template slot-scope="scope">
                <span>{{scope.row.createTime}}</span>
              </template>
            </el-table-column>

            <el-table-column align="center" label="操作" fixed="right" width="270px">
              <template slot-scope="scope">
                <el-button type="info" size="small" icon="el-icon-message" @click="handleView(scope.row)">查看</el-button>
                <el-button type="primary" size="small" icon="el-icon-edit" class="filter-btn" @click="handleUpdate(scope.row)">编辑</el-button>
                <el-button type="danger" size="small" icon="el-icon-delete" @click="handleDelete(scope.row.roleId)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-main>
        <!-- 分页区 -->
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page"
          :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </el-container>
    </el-container>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false" custom-class="role-dialog">
      <el-form :rules="rules" ref="dataForm" :model="sysUser" label-position="left" label-width="100px" style='width: 500px; margin-left:50px;' :disabled="isView">
        <el-form-item label="角色名称" prop="roleName">
          <el-input size="small" v-model="sysUser.roleName" placeholder="请输入角色名称" :disabled="isView"></el-input>
        </el-form-item>

        <el-form-item label="角色归属" prop="nodeName">
          <el-col :span="22">
            <el-input size="small" v-model="sysUser.nodeName" :disabled="true" placeholder="请选择角色归属"></el-input>
          </el-col>
          <el-col :span="2" v-show="!isView">
            <i class="el-icon-search" style="cursor:pointer" @click="chooseDept" ></i>
          </el-col>
        </el-form-item>
        <el-form-item label="数据权限" prop="nodePathList">
          <el-tree ref="shujtree" show-checkbox default-expand-all :check-strictly="true"
           :render-content="renderContent" :highlight-current="true" :data="treeDataNode"
           @check-change="checkChangeData" :default-checked-keys="sysUser.nodePathList"
           :props="defaultProps2" node-key="fullPath" :expand-on-click-node="true"
           style="min-height: 100px; max-height: 300px; overflow: auto;background: #eef1f6;">
          </el-tree>
        </el-form-item>
        <el-form-item label="功能权限" prop="menuIdList">
          <el-tree
          :data="data"
          ref="jurisdictionTree"
          show-checkbox
          node-key="id"
          default-expand-all
          :props="defaultProps"
          @check-change="checkChange"
          :default-checked-keys="sysUser.menuIdList"
          style="min-height: 100px; max-height: 300px; overflow: auto;background: #eef1f6;">
          </el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogFormVisible = false">取 消</el-button>
        <el-button size="small" v-if="dialogStatus=='create'" type="primary" class="filter-btn" @click="createData" :disabled="isView">确 定</el-button>
        <el-button size="small" v-else type="primary" class="filter-btn" @click="updateData" :disabled="isView">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="选择角色归属" :visible.sync="dialogDeptVisible" width="300px" :close-on-click-modal="false" custom-class="search-dialog">
      <dept-tree ref="selectDeptTree" :showCheckbox="true" style="overflow-y: auto"></dept-tree>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogDeptVisible = false">取 消</el-button>
        <el-button size="small" type="primary" class="filter-btn" @click="chooseDeptConfirm">确 认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchRoleList, getMenuTree, createRole, getRoleDetail, updateRole, deleteRole, exportRole } from '@/api/system/role'
import waves from '@/directive/waves' // 水波纹指令
import deptTree from '../dept/components/deptTree'
import { getBaseDept } from '@/api/vehicleMonitor/realtime'
import { deptTreeData } from '@/api/system/dept'

export default {
  name: 'userList',
  components: { deptTree },
  directives: {
    waves
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      downloadLoading: false,
      selectRows: [], // 选中的行数据
      data: [],
      isView: false,
      defaultProps: {
        children: 'children',
        label: 'text'
      },
      listQuery: {
        page: 1,
        limit: 10,
        roleName: '',
        // nodeName: ''
        nodePath: ''
      },
      sysUser: {
        id: undefined,
        roleName: '',
        deptId: '',
        nodeName: '',
        nodePath: '',
        menuIdList: [],
        nodePathList: [],
        halfNodePathList: []
      },
      roles: [],
      dialogFormVisible: false,
      dialogDeptVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑角色',
        create: '新增角色',
        view: '角色详情'
      },
      rules: { // 表单验证规则
        roleName: [
          { required: true, message: '角色名称是必填项', trigger: 'blur' },
          { max: 20, message: '长度不应超过20个字符', trigger: 'blur' }
        ],
        nodeName: [{ required: true, message: '请选择角色归属', trigger: 'blur' }],
        menuIdList: [{ required: true, message: '请选择功能权限', trigger: 'blur' }],
        nodePathList: [{ required: true, message: '请选择数据权限', trigger: 'blur' }]
      },
      tmpKey: '-999',
      deptTreeQuery: { id: '' },
      defaultProps2: {
        children: 'children',
        label: 'text',
        isLeaf: 'isLeaf'
      },
      treeDataNode: [
      ],
      dataHalfByChrose: [],
      checkedHalf: []
    }
  },
  watch: {
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  mounted() {
    this.getList()
    getMenuTree().then(res => {
      // this.data = res.data.children
      this.data = JSON.parse('[' + JSON.stringify(res.data) + ']')
    })
  },
  methods: {
    educe() {
      exportRole().then(res => {})
    },
    checkChange(data) {
      this.sysUser.menuIdList = [].concat(this.$refs.jurisdictionTree.getCheckedKeys(), [this.tmpKey], this.$refs.jurisdictionTree.getHalfCheckedKeys())
    },
    // 获取当前节点的所有父节点 organTreeInfo:0--1:0-0:1-820000:1-820100:1-820101:
    getFullpathFather(fullPath, arrs = []) {
      const arr = arrs || []
      const idx = fullPath.lastIndexOf(':')
      const newd = fullPath.slice(0, idx)
      if (newd.indexOf(':') !== -1) {
        arr.push(newd)
        this.getFullpathFather(newd, arr)
      }
      return arr
    },
    checkChangeData(data, c) {
      if (c) {
        const fullPath = data.fullPath
        // const arr = []
        // const a = (fullPath) => {
        //   const idx = fullPath.lastIndexOf(':')
        //   const newd = fullPath.slice(0, idx)
        //   if (newd.indexOf(':') !== -1) {
        //     arr.push(newd)
        //     a(newd)
        //   }
        // }
        const arr = this.getFullpathFather(fullPath)
        const checkHalfarr = this.sysUser.halfNodePathList || []
        arr.forEach((item, index) => {
          if (index === 0) return
          checkHalfarr.push(item + ':')
        })

        const checkeds = this.$refs.shujtree.getCheckedKeys()
        const ccc = this.checkedHalf || []
        checkeds.forEach(item => {
          checkHalfarr.forEach((i, key) => {
            if (item !== i) {
              ccc.push(i)
            } else {
              ccc.splice(key, 1)
            }
          })
        })
        this.checkedHalf = this.removeDuplicatedItem(ccc)
      } else {
        const idx = this.sysUser.halfNodePathList.indexOf(data.fullPath)
        if (idx !== -1) {
          this.sysUser.halfNodePathList.splice(idx, 1)
        }
        // this.checkedHalf = this.sysUser.halfNodePathList || []
        // this.checkedHalf.push(data.fullPath)
      }

      this.checkedHalf = this.removeDuplicatedItem(this.checkedHalf)

      const checked = this.$refs.shujtree.getCheckedKeys()
      // for (const item of this.dataHalfByChrose) {
      //   const index = checked.indexOf(item)
      //   if (index > -1) {
      //     checked.splice(index, 1)
      //   }
      // }

      checked.forEach(item => {
        this.checkedHalf.forEach((i, key) => {
          if (item === i) {
            this.checkedHalf.splice(key, 1)
          }
        })
      })

      this.sysUser.nodePathList = checked
      // this.sysUser.halfNodePathList = [].concat(this.$refs.shujtree.getHalfCheckedKeys(), this.dataHalfByChrose)
      this.sysUser.halfNodePathList = [].concat(this.$refs.shujtree.getHalfCheckedKeys(), this.checkedHalf)
    },
    // 数组去重
    removeDuplicatedItem(arr) {
      for (var i = 0; i < arr.length - 1; i++) {
        for (var j = i + 1; j < arr.length; j++) {
          if (arr[i] === arr[j]) {
            arr.splice(j, 1)
            j--
          }
        }
      }
      return arr
    },
    getList() { // 分页获角色列表
      this.listLoading = true
      fetchRoleList(this.listQuery).then(response => {
        this.list = response.data.rows
        this.total = response.data.totalCount
        this.listLoading = false
      })
    },
    handleView(row) {
      this.isView = true
      this.dialogFormVisible = true
      this.dialogStatus = 'view'
      this.$refs['dataForm'].clearValidate()
      getRoleDetail(row.roleId).then(res => {
        this.sysUser.roleName = res.data.roleName
        this.sysUser.nodeName = res.data.nodeName
        const nparr = res.data.nodePath.split(':')
        this.getDeptTree(nparr[nparr.length - 2], res.data.nodePath, res.data.halfNodePathList)
        res.data.menuIdList == null ? this.sysUser.menuIdList = [] : this.sysUser.menuIdList = res.data.menuIdList
        this.$nextTick(() => {
          // 2. 给tree绑定数据时，通过tempKey移除之前添加的半选中状态节点Id。
          const idx = this.sysUser.menuIdList.indexOf(this.tmpKey)
          if (idx !== -1) {
            this.sysUser.menuIdList.splice(idx, this.sysUser.menuIdList.length - idx)
          }
          this.sysUser.nodePathList = res.data.nodePathList
          this.$refs.jurisdictionTree.setCheckedKeys(this.sysUser.menuIdList)
          this.$refs.shujtree.setCheckedKeys(this.sysUser.nodePathList)
          // this.$refs.jurisdictionTree.setCheckedKeys(this.sysUser.menuIdList)
        })
      })
    },
    handleSelect(val) { // 选择处理事件
      this.selectRows = val
    },
    handleDelete(id) { // 删除事件
      this.isView = false
      this.$confirm('此操作将删除角色信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRole(id).then(response => {
          if (response && response.code === 0) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getList()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleNodeClick(data) { // 树节点点击回调方法
      this.listQuery.roleName = ''
      if (data.text === '顶级节点') {
        this.listQuery.deptId = ''
      } else {
        // this.listQuery.deptId = data.id
        this.listQuery.nodePath = data.fullPath
      }
      this.getList()
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
      // this.$nextTick(() => {
      //   this.listQuery.roleName = ''
      // })
    },
    chooseDept() {
      this.dialogDeptVisible = true
      const np = this.sysUser.nodePath
      // 清空所属机构选择
      this.$nextTick(() => {
        this.$refs.selectDeptTree.setCheckedKeysChoose(np)
        this.$refs.selectDeptTree.setCheckedKeysNull()
      })
    },
    chooseDeptConfirm() {
      // getSelectNode
      const deptNode = this.$refs.selectDeptTree.getSelectNode()
      if (deptNode === null) {
        this.$message({
          message: '请选择所属机构',
          type: 'warning'
        })
      } else {
        this.sysUser.deptId = deptNode.id
        this.sysUser.nodeName = deptNode.text
        this.sysUser.nodePath = deptNode.fullPath
        this.dialogDeptVisible = false
        // 获取下级树
        this.getDeptTree(deptNode.id, deptNode.fullPath)
        this.sysUser.halfNodePathList = []
      }
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    loadDeptNode(node, resolve) {
      this.deptTreeQuery = { id: node.data.fullPath, activeStatus: this.activeStatus === -1 ? '' : this.activeStatus, nodeType: node.data.type }
      getBaseDept(this.deptTreeQuery).then(res => {
        if (res.code === 0) {
          const checkArr = []
          const childrenData = res.data
          const _this = this
          if (childrenData.length === 0) {
            node.isLeaf = true // 叶子
            resolve([])
            return
          }
          resolve(childrenData)
          setTimeout(() => {
            if (childrenData.length > 0) {
              _this.$refs.shujtree.setCheckedKeys(checkArr)
            } else {
              _this.$refs.shujtree.setCheckedKeys(_this.checkedList)
            }
          }, 10)
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    renderContent(h, { node, data, store }) { // 渲染tree
      if (data.disabled) {
        if (data.type === '1') {
          return (
            <span style='height:18px;line-height:18px'>
              <i class='tree_dept_icon tree_dept_icon_l'></i>
              <span class='tree_dept_l'>{node.label}</span>
            </span>
          )
        } else if (data.type === '2') {
          return (
            <span>
              <i class='tree_line_icon tree_line_icon_l'></i>
              <span class='tree_dept_l'>{node.label}</span>
            </span>
          )
        } else if (data.type === '3') {
          return (
            <span>
              <i class='tree_owers_icon tree_owers_icon_l'></i>
              <span class='tree_dept_l'>{node.label}</span>
            </span>
          )
        }
      } else {
        if (data.type === '1') {
          return (
            <span style='height:18px;line-height:18px'>
              <i class='tree_dept_icon'></i>
              <span>{node.label}</span>
            </span>
          )
        } else if (data.type === '2') {
          return (
            <span>
              <i class='tree_line_icon'></i>
              <span>{node.label}</span>
            </span>
          )
        } else if (data.type === '3') {
          return (
            <span>
              <i class='tree_owers_icon'></i>
              <span>{node.label}</span>
            </span>
          )
        }
      }
    },
    resetForm() { // 重置表单
      this.sysUser = {
        userId: undefined,
        roleName: '',
        deptId: '',
        nodeName: '',
        nodePath: '',
        menuIdList: [],
        nodePathList: []
      }
      this.treeDataNode = []
    },
    handleCreate() { // 新增按钮方法
      this.isView = false
      this.resetForm()
      // this.getAllRole()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs.jurisdictionTree.setCheckedKeys([])
        this.$refs.shujtree.setCheckedKeys([])
        localStorage.setItem('editCheckId', '')
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() { // 新增保存方法
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createRole(this.sysUser).then((response) => {
            if (response && response.code === 0) {
              // this.list.unshift(this.sysUser)
              this.getList()
              this.dialogFormVisible = false
              this.$message({
                message: '新增成功',
                type: 'success'
              })
              this.resetForm()
            }
            this.resetForm()
          })
        }
      })
    },
    // 获取下级树
    getDeptTree(id, nodePath, nodePathList) {
      // deptTreeApi({ id: id, nodePath: nodePath }).then(response => {
      deptTreeData({ chrosedNodePath: nodePath }).then(response => {
        this.treeDataNode = [].concat(response.data.afterChrosedNodeTree)
        this.dataHalfByChrose = response.data.banByChrose
        this.tickMenuIdFilter(response.data.banByChrose).filter(this.treeDataNode)
        if (!nodePathList) return
        this.tickMenuIdFilter(nodePathList).filter(this.treeDataNode)
      })
    },
    // 设置数据权限树某些节点不可以点击
    tickMenuIdFilter(np) {
      var resultArr = []
      var getTickMenuId = function(obj) {
        if (undefined === obj || obj === null || !(obj instanceof Object)) {
          return
        }
        np.forEach(item => {
          if (obj.fullPath === item) {
            // console.log('obj',obj)
            obj.disabled = true
            resultArr.push(obj.id)
          }
          if (obj.children && obj.children instanceof Array) {
            for (const child of obj.children) {
              getTickMenuId(child)
            }
          }
        })
      }

      return {
        filter: function(arr) {
          if (!(arr instanceof Array)) {
            return false
          }
          resultArr = []
          for (const rootMenu of arr) {
            getTickMenuId(rootMenu)
          }
          return resultArr
        }
      }
    },
    handleUpdate(row) { // 修改按钮方法
      this.resetForm()
      this.isView = false
      this.dialogFormVisible = true
      getRoleDetail(row.roleId).then(res => {
        this.sysUser.roleName = res.data.roleName
        this.sysUser.menuIdList = res.data.menuIdList
        this.sysUser.roleId = res.data.roleId
        this.sysUser.nodeName = res.data.nodeName
        this.sysUser.deptId = res.data.deptId
        this.sysUser.nodePath = res.data.nodePath
        const nparr = res.data.nodePath.split(':')
        this.getDeptTree(nparr[nparr.length - 2], res.data.nodePath, res.data.halfNodePathList)
        if (res.data.deptId === '-1') {
          this.sysUser.nodeName = '顶级节点'
        }
        this.dialogStatus = 'update'
        res.data.menuIdList == null ? this.sysUser.menuIdList = [] : this.sysUser.menuIdList = res.data.menuIdList
        this.$nextTick(() => {
          const idx = this.sysUser.menuIdList.indexOf(this.tmpKey)
          if (idx !== -1) {
            this.sysUser.menuIdList.splice(idx, this.sysUser.menuIdList.length - idx)
          }
          this.sysUser.nodePathList = res.data.nodePathList

          const halfarr = []
          res.data.nodePathList.forEach(item => {
            const arr = this.getFullpathFather(item)
            arr.forEach(i => {
              halfarr.push(i)
            })
          })
          const halfao = this.removeDuplicatedItem(halfarr)
          const ha = halfao.map(item => {
            return item + ':'
          })
          res.data.nodePathList.forEach(item => {
            ha.forEach((i, key) => {
              if (item === i) {
                ha.splice(key, 1)
              }
            })
          })
          this.sysUser.halfNodePathList = ha
          this.$refs.jurisdictionTree.setCheckedKeys(this.sysUser.menuIdList)
          this.$refs.shujtree.setCheckedKeys(this.sysUser.nodePathList)
          // this.$refs.jurisdictionTree.setCheckedKeys(this.sysUser.menuIdList)
          this.$refs['dataForm'].clearValidate()
        })
      })
    },
    updateData() { // 修改保存方法
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.sysUser)
          updateRole(tempData).then((response) => {
            if (response && response.code === 0) {
              this.getList()
              this.dialogFormVisible = false
              this.$message({
                message: '更新成功',
                type: 'success',
                duration: 2000
              })
            }
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.app-container >>> .tree_dept_l {
  color:#b1b1b1;
}
.app-container >>> .tree_dept_icon{
  width: 14px;
  height: 14px;
  display: inline-block;
  background-image: url('../../../assets/realtime/tree_area.png');
  background-repeat:no-repeat;
  background-size:100% 100%;
  margin-right: 5px
}
.app-container >>> .tree_dept_icon_l {
  background-image: url('../../../assets/realtime/tree_area_l.png');
}
.app-container >>> .tree_line_icon{
  width: 14px;
  height: 14px;
  display: inline-block;
  background-image: url('../../../assets/realtime/tree_platform.png');
  background-repeat:no-repeat;
  background-size:100% 100%;
  margin-right: 5px
}
.app-container >>> .tree_line_icon_l{
  background-image: url('../../../assets/realtime/tree_platform_l.png');
}
.app-container >>> .tree_owers_icon{
  width: 14px;
  height: 14px;
  display: inline-block;
  background-image: url('../../../assets/realtime/tree_owers.png');
  background-repeat:no-repeat;
  background-size:100% 100%;
  margin-right: 5px
}
.app-container >>> .tree_owers_icon_l{
  background-image: url('../../../assets/realtime/tree_owers_l.png');
}
.radio-label {
  font-size: 14px;
  color: #606266;
  line-height: 40px;
  padding: 0 12px 0 30px;
}
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
.el-header {
  height: 70px;
  padding: 10px 20px;
}
.toolbar {
  height: 50px;
  line-height: 50px;
}
.filter-container {
  height: 50px;
  line-height: 50px;
}
.el-pagination {
  padding: 2px 20px;
}
.el-tree {
  // background: #eef1f6;
}
.el-aside {
  padding: 8px;
}
.app-container >>> .el-dialog__header {
  background-color: #5F7ABF;
}
.app-container >>> .el-dialog__header span {
  color: #fff;
  font-size: 14px
}
.app-container >>> .el-dialog__header i {
  color: #fff;
}
.app-container .filter-btn {
  background-color: #5F7ABF;
  border-color: #5F7ABF;
}
.app-container >>> .el-dialog{

}
.app-container >>> .el-dialog__body {
  /*overflow: auto !important;*/
  /*height: 65vh;*/
  /*padding: 5px 20px !important;*/
}
.app-container >>> .role-dialog  .el-dialog__body{
  overflow: auto !important;
  height: 65vh;
}
</style>
