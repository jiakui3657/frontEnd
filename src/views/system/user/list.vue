<template>
  <div class="app-container">
    <el-container style="border: 1px solid #eee">
      <el-aside width="220px" style="background-color: rgb(238, 241, 246); overflow: auto">
        <!-- <el-tree :data="treeData" :props="defaultProps" ref="deptTree" @node-click="handleNodeClick" :filter-node-method="filterNode"></el-tree> -->
        <dept-tree @nodeClick="handleNodeClick"></dept-tree>
      </el-aside>
      <el-container class="rightContainer">
        <!--<el-form ref="form" inline style="background: #fff; margin: 0 20px; padding: 20px 10px 0 20px; border-radius: 5px; box-shadow: 0 0 10px #ccc">-->
        <el-form ref="form" inline class="noMargin"style="padding: 20px 10px 0 20px;font-size: 12px;margin-bottom: 0">
          <!-- 查询条件区 -->
          <el-form-item label="姓名:">
            <el-input size="small" @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="请输入姓名" v-model="listQuery.realname"></el-input>
          </el-form-item>
          <el-form-item label="账号:">
            <el-input size="small" @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="请输入账号" v-model="listQuery.username"></el-input>
            <el-button size="small" class="filter-item filter-btn" type="primary" v-waves icon="el-icon-search" @click="handleFilter">查询</el-button>
          </el-form-item>
          <el-form-item style="float: right">
            <el-button size="small" type="primary" class="filter-btn" icon="el-icon-plus" @click="handleCreate">新增</el-button>
            <el-button size="small" type="danger" icon="el-icon-delete" @click="handleDelete">删除</el-button>
            <!-- <el-button size="small" class="filter-item" type="primary" v-waves icon="el-icon-download" @click="educe">导出</el-button> -->
          </el-form-item>
        </el-form>
        <el-main>
          <!-- 列表数据区 -->
          <el-table :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%" @selection-change="handleSelect" :header-cell-style="{ 'background-color': '#5F7ABF', 'color': '#fff', border: 'none !important' }">
            <el-table-column align="center" type="selection" width="40" @selection-change="handleSelect">
            </el-table-column>
            <el-table-column
              label="序号"
              type="index"
              align="center"
              width="50">
            </el-table-column>
            <el-table-column width="120px" align="center" label="姓名">
              <template slot-scope="scope">
                <span>{{scope.row.realname}}</span>
              </template>
            </el-table-column>

            <el-table-column width="120px" align="center" label="账号">
              <template slot-scope="scope">
                <span>{{scope.row.username}}</span>
              </template>
            </el-table-column>

            <el-table-column width="150px" label="用户所属" align="center">
              <template slot-scope="scope">
                <div style="text-align: left!important;">{{scope.row.nodeName}}</div>
              </template>
            </el-table-column>

            <el-table-column width="150px" label="所属角色" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.roleNameList}}</span>
              </template>
            </el-table-column>

            <el-table-column width="120px" label="帐号状态" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.status | statuFilter}}</span>
              </template>
            </el-table-column>

            <el-table-column width="200px" label="修改日期" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.updateTime}}</span>
              </template>
            </el-table-column>

            <el-table-column align="center" label="操作" fixed="right" width="350px">
              <template slot-scope="scope">
                <el-button type="info" size="small" icon="el-icon-message" @click="handleView(scope.row)">查看</el-button>
                <el-button type="info" size="small" icon="el-icon-message" @click="handlePwd(scope.row.userId)">修改密码</el-button>
                <!--<el-button type="success" size="small" icon="el-icon-setting" @click="handleSAllot(scope.row.userId)">分配</el-button>-->
                <el-button type="primary" size="small" class="filter-btn" icon="el-icon-edit" @click="handleUpdate(scope.row)">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页区 -->
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page"
            :page-sizes="[10,20,30, 50]" style="margin-top: 20px" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </el-main>
      </el-container>
    </el-container>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form :rules="rules" ref="dataForm" :model="sysUser" label-position="left" label-width="100px" style='width: 400px; margin-left:50px;'>
        <el-form-item label="姓名" prop="realname">
          <el-input size="small" v-model="sysUser.realname" placeholder="请输入用户姓名" :disabled="isView"></el-input>
        </el-form-item>

        <el-form-item label="账号" prop="username">
          <el-input size="small" v-model="sysUser.username" placeholder="请输入登录账号" :disabled="isView"></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password" v-if="dialogStatus=='create'">
          <el-input size="small" v-model="sysUser.password" :type="passwordType" autoComplete="off" readonly onfocus="this.removeAttribute('readonly')" placeholder="请输入登录密码"></el-input>
          <span class="show-pwd" @click="showPwd()">
            <img src="../../../assets/login/icon-undisplay.png" v-show="hidPwd" label-position="left">
            <img src="../../../assets/login/icon-display.png" v-show="!hidPwd">
          </span>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input size="small" v-model="sysUser.email" placeholder="请输入邮箱" :disabled="isView"></el-input>
        </el-form-item>

        <el-form-item label="手机号" prop="mobile">
          <el-input size="small" v-model="sysUser.mobile" type="number" placeholder="请输入手机号" :disabled="isView"></el-input>
        </el-form-item>

        <el-form-item label="用户所属" prop="nodeName">
          <el-col :span="22">
            <el-input size="small" v-model="sysUser.nodeName" :disabled="true" placeholder="请选择所属机构" ></el-input>
          </el-col>
          <el-col :span="2" v-if="dialogStatus=='view'">
            <i class="el-icon-search" style="cursor:pointer" v-show ="false" @click="chooseDept"></i>
          </el-col>
          <el-col :span="2" v-else>
            <i class="el-icon-search" style="cursor:pointer" v-show ="!isUser" @click="chooseDept"></i>
          </el-col>
        </el-form-item>

        <el-form-item label="启用时间" prop="enableTime">
          <el-date-picker v-model="sysUser.enableTime" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="请选择时间" :editable="false" :disabled="isView">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="过期时间" prop="disableTime">
          <el-date-picker v-model="sysUser.disableTime" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="请选择时间" :editable="false" :disabled="isView" :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="所属角色" prop="roleIdList">
          <el-select v-if="dialogStatus=='view'" @focus="roleIdClick(sysUser.nodePath)" v-model="sysUser.roleIdList" multiple placeholder="请选择" :disabled="isView" style="width:300px" >
            <el-option
              v-for="item in roles"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select  v-else @focus="roleIdClick(sysUser.nodePath)" v-model="sysUser.roleIdList" multiple placeholder="请选择" :disabled="isUser" style="width:300px" >
            <el-option
              v-for="item in roles"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogFormVisible = false">取 消</el-button>
        <el-button size="small" v-if="dialogStatus=='create'" type="primary" class="filter-btn" @click="createData" :disabled="isView">确 定</el-button>
        <el-button size="small" v-else type="primary" @click="updateData" class="filter-btn" :disabled="isView">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="选择用户所属" :visible.sync="dialogDeptVisible" width="300px" :close-on-click-modal="false" custom-class="search-dialog">
      <dept-tree ref="selectDeptTree" :show-checkbox="true" @gettreenode="getTreeNode" style="overflow-y: auto;"></dept-tree>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogDeptVisible = false">取 消</el-button>
        <el-button size="small" type="primary" class="filter-btn" @click="chooseDeptConfirm">确 认</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改密码" :visible.sync="dialogChangePwd" width="500px" :close-on-click-modal="false">
      <el-form class="change-form" :model="changeForm" :rules="changeRules" ref="changeForm" label-position="left">
        <!--<div class="title-container">-->
          <!--<h3 class="title">修改密码</h3>-->
        <!--</div>-->
        <el-form-item prop="enterpassword">
          <el-input name="enterpassword" :type="passwordType" @keyup.enter.native="submitPwd" autoComplete="off" readonly onfocus="this.removeAttribute('readonly')" v-model="changeForm.enterpassword" placeholder="新密码" />
          <span class="show-pwd" @click="showPwd()">
            <img src="../../../assets/login/icon-undisplay.png" v-show="hidPwd" label-position="left">
            <img src="../../../assets/login/icon-display.png" v-show="!hidPwd">
          </span>
        </el-form-item>
        <el-form-item prop="password">
          <el-input name="password" :type="passwordType" @keyup.enter.native="submitPwd" autoComplete="off" readonly onfocus="this.removeAttribute('readonly')" v-model="changeForm.password" placeholder="再次输入密码" />
          <span class="show-pwd" @click="showPwd()">
            <img src="../../../assets/login/icon-undisplay.png" v-show="hidPwd">
            <img src="../../../assets/login/icon-display.png" v-show="!hidPwd">
          </span>
        </el-form-item>
        <!--<el-button type="primary" style="width:100%;margin-bottom:30px;" :loading="loading" @click.native.prevent="submitPwd">登录</el-button>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogChangePwd = false">取 消</el-button>
        <el-button size="small" type="primary" class="filter-btn" @click="submitPwd()">确 认</el-button>
      </div>
    </el-dialog>
    <el-dialog title="分配运营商平台" :visible.sync="allotVisible" width="500px" :close-on-click-modal="false">
      <el-select v-model="allotDept" multiple placeholder="请选择" style="width: 400px">
        <el-option
          v-for="item in options"
          :key="item.platformId"
          :label="item.platformName"
          :value="item.platformId">
        </el-option>
      </el-select>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="allotVisible = false">取 消</el-button>
        <el-button size="small" type="primary" class="filter-btn" @click="submitAllot()">确 认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, fetchUser, createUser, updateUser, deleteUser, exportUser, getAllotlist, allot, changePassword } from '@/api/system/user'
import { fetchIdRole } from '@/api/system/role'
import waves from '@/directive/waves' // 水波纹指令
import deptTree from '../dept/components/deptTree'
import utils from '@/api/base/utils'

export default {
  name: 'userList',
  components: { deptTree },
  directives: {
    waves
  },
  data() {
    return {
      changeForm: {
        enterpassword: '',
        password: ''
      },
      changeRules: {
        enterpassword: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
        password: [{ required: true, message: '请再次输入密码', trigger: 'blur' }]
      },
      passwordType: 'password',
      list: null,
      userIdnew: null,
      allotVisible: false,
      total: 0,
      listLoading: true,
      downloadLoading: false,
      dialogChangePwd: false,
      selectRows: [], // 选中的行数据
      isView: false,
      isUser: false,
      listQuery: {
        page: 1,
        limit: 10,
        deptId: '',
        realname: '',
        username: '',
        nodePath: ''
      },
      options: [],
      sysUser: {
        id: undefined,
        username: '',
        realname: '',
        password: '',
        deptId: '',
        nodeName: '',
        enableTime: '',
        disableTime: '',
        nodePath: '',
        roleIdList: [],
        email: '',
        mobile: '',
        isMine: null
      },
      roles: [],
      dialogFormVisible: false,
      dialogDeptVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑用户',
        create: '新增用户',
        view: '查看详情'
      },
      rules: { // 表单验证规则
        username: [
          { required: true, message: '账号是必填项', trigger: 'blur' },
          { max: 20, message: '长度不应超过20个字符', trigger: 'blur' }
        ],
        realname: [
          { required: true, message: '姓名是必填项', trigger: 'blur' },
          { max: 20, message: '长度不应超过20个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码是必填项', trigger: 'blur' },
          { max: 20, message: '长度不应超过20个字符', trigger: 'blur' }
        ],
        nodeName: [
          { required: true, message: '请选择所属机构', trigger: 'blur' }
        ],
        enableTime: [
          { required: true, message: '启用时间是必填项', trigger: 'blur' }
        ],
        disableTime: [
          { required: true, message: '禁用时间是必填项', trigger: 'blur' }
        ],
        roleIdList: [
          { required: true, message: '请选择所属角色', trigger: 'blur' }
        ],
        mobile: [{ validator: (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请输入手机号'))
          } else {
            if (!(/^1(3|4|5|7|8)\d{9}$/.test(value))) {
              callback(new Error('手机号格式错误'))
            }
            callback()
          }
        }, required: true, trigger: 'blur' }],
        email: [{ validator: (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请输入邮箱'))
          } else {
            if (!(/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(value))) {
              callback(new Error('邮箱格式错误'))
            }
            callback()
          }
        }, required: true, trigger: 'blur' }]
      },
      pickerOptions: {
        disabledDate: (time) => {
          if (this.sysUser.enableTime && this.sysUser.disableTime) {
            return time.getTime() < new Date(this.sysUser.enableTime.replace(/-/g, '/')).getTime()
          }
        }
      },
      allotDept: [],
      selectTreeNode: {},
      hidPwd: true
    }
  },
  computed: {
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
    },
    statuFilter(statu) {
      return statu === 1 ? '未过期' : '已过期'
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    educe() {
      exportUser().then(res => {})
    },
    // 点击分配按钮
    handleSAllot(userId) {
      const arr = []
      this.allotVisible = true
      this.userIdnew = userId
      getAllotlist({ userId }).then(res => {
        this.options = res.data
        res.data.forEach((item) => {
          if (item.isCheck === '1') {
            arr.push(item.platformId)
          }
        })
        this.allotDept = arr
      })
    },
    // 提交分配平台
    submitAllot() {
      console.log('1')
      if (this.allotDept.length === '') {
        this.$message({
          type: 'error',
          message: '请选择要分配的运营商平台'
        })
      } else {
        console.log('2')
        const platformId = this.allotDept.join()
        const userId = this.userIdnew
        console.log(platformId)
        allot({ platformId, userId }).then(res => {
          if (res && res.code === 0) {
            this.$message({
              type: 'success',
              message: '分配成功'
            })
          }
          this.allotVisible = false
          getAllotlist().then(res => {
            this.options = res.data.rows
          })
        })
      }
    },
    getList() { // 分页获取用户列表
      // this.listLoading = true
      fetchList(this.listQuery).then(response => {
        if (response && response.data) {
          response.data.rows.forEach(item => {
            if (item.roleNameList) {
              item.roleNameList = item.roleNameList.join()
            }
          })
          this.list = response.data.rows
          this.total = response.data.totalCount
        }
        this.listLoading = false
      })
    },
    getRoleChange() { // 获取机构下的所有角色
      // fetchIdRole(this.sysUser.deptId).then(response => {
      fetchIdRole(this.sysUser.nodePath).then(response => {
        console.log('233')
        console.log(response)
        if (response.code === 0) {
          this.sysUser.roleNameList = ''
          this.roles = response.data
        }
      })
    },
    roleIdClick(id) {
      if (!id || id === '') {
        this.$message({
          message: '请先选择机构',
          type: 'info'
        })
      }
    },
    getUserDetail(userId) { // 获取单个用户详情信息
      fetchUser(userId).then(response => {
        console.log(response)
        const temp = response.data
        this.sysUser.userId = temp.userId
        this.sysUser.username = temp.username
        this.sysUser.realname = temp.realname
        this.sysUser.deptId = temp.deptId
        this.sysUser.nodeName = temp.nodeName
        this.sysUser.enableTime = temp.enableTime
        this.sysUser.disableTime = temp.disableTime
        this.sysUser.nodePath = temp.nodePath
        this.sysUser.roleIdList = temp.roleIdList
        this.sysUser.email = temp.email
        this.sysUser.mobile = temp.mobile
        this.sysUser.isMine = temp.isMine
        console.log('角色数据' + this.sysUser.roleIdList)
        console.log(this.sysUser)
        this.$nextTick(() => {
          if (this.sysUser.isMine === 1) {
            this.isUser = true
          } else {
            this.isUser = false
          }
        })
      })
    },
    handleSelect(val) { // 选择处理事件
      this.selectRows = val
    },
    handleDelete() { // 删除事件
      const userIds = []
      if (this.selectRows.length === 0) {
        this.$message({
          message: '请选择要删除的用户',
          type: 'warning'
        })
        return
      }
      this.$confirm('此操作将删除用户信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.selectRows.forEach(element => {
          userIds.push(element.userId)
        })
        // const data = { userIds: userIds }
        deleteUser(userIds).then(response => {
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
    handleView(row) {
      this.dialogStatus = 'view'
      this.isView = true
      this.sysUser.deptId = row.deptId
      this.sysUser.nodePath = row.nodePath
      this.dialogFormVisible = true
      this.getRoleChange()
      this.getUserDetail(row.userId)
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      // this.sysUser = row
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
      //   this.listQuery.realname = ''
      //   this.listQuery.username = ''
      // })
    },
    getTreeNode(msg) {
      this.selectTreeNode = msg
    },
    chooseDept() {
      // this.sysUser.roleIdList = []
      this.dialogDeptVisible = true
      const nodePath = this.sysUser.nodePath
      console.log('当前选中节点' + nodePath)
      this.$nextTick(() => {
        this.$refs.selectDeptTree.setCheckedKeysChoose(nodePath) // 编辑页面设置默认选中节点
        this.$refs.selectDeptTree.setCheckedKeysNull()
      })
    },
    chooseDeptConfirm() {
      // getSelectNode
      const deptNode = this.$refs.selectDeptTree.getSelectNode()
      // const deptNode = this.selectTreeNode
      if (deptNode === null) {
        this.$message({
          message: '请选择所属机构',
          type: 'warning'
        })
      } else {
        this.sysUser.roleIdList = []
        this.sysUser.deptId = deptNode.id
        this.sysUser.nodeName = deptNode.text
        this.sysUser.nodePath = deptNode.fullPath
        this.dialogDeptVisible = false
        this.getRoleChange()
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
    resetForm() { // 重置表单
      this.sysUser = {
        userId: undefined,
        username: '',
        realname: '',
        password: '',
        deptId: '',
        nodeName: '',
        enableTime: '',
        disableTime: '',
        nodePath: '',
        roleIdList: []
      }
    },
    handleCreate() { // 新增按钮方法
      this.isView = false
      this.resetForm()
      this.roles = []
      // this.getAllRole()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        // this.$refs.selectDeptTree.setCheckedKeys([])
        localStorage.setItem('editCheckId', '')
        this.$refs['dataForm'].clearValidate()
        this.resetForm()
      })
      // const deptNode = this.$refs.selectDeptTree.getSelectNode()
    },
    createData() { // 新增保存方法
      let flag = true
      if (new Date(this.sysUser.enableTime.replace(/-/g, '/')).getTime() > new Date(this.sysUser.disableTime.replace(/-/g, '/')).getTime()) {
        this.$message({
          message: '启用时间应小于禁用时间',
          type: 'error'
        })
        flag = false
      }
      if (flag) {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            createUser(this.sysUser).then((response) => {
              if (response && response.code === 0) {
                // this.list.unshift(this.sysUser)
                this.getList()
                this.dialogFormVisible = false
                this.$message({
                  message: '新增成功',
                  type: 'success'
                })
              } else {
                this.$message({
                  message: response.msg,
                  type: 'error'
                })
              }
            })
          }
        })
      }
    },
    handleUpdate(row) { // 修改按钮方法
      this.isView = false
      this.resetForm()
      this.roles = []
      this.sysUser.deptId = row.deptId
      this.sysUser.nodePath = row.nodePath
      this.getRoleChange()
      this.getUserDetail(row.userId)
      console.log('修改' + this.sysUser.nodePath)
      // this.thisUser()
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      // localStorage.setItem('editCheckId', this.sysUser.nodePath)
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
        localStorage.setItem('editCheckId', this.sysUser.nodePath)
      })
    },
    updateData() { // 修改保存方法
      let flag = true
      if (new Date(this.sysUser.enableTime.replace(/-/g, '/')).getTime() > new Date(this.sysUser.disableTime.replace(/-/g, '/')).getTime()) {
        this.$message({
          message: '启用时间应小于禁用时间',
          type: 'error'
        })
        flag = false
      }
      if (flag) {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            console.log('xxxx' + JSON.stringify(this.sysUser))
            const tempData = Object.assign({}, this.sysUser)
            updateUser(tempData).then((response) => {
              if (response && response.code === 0) {
                this.getList()
                for (const v of this.list) {
                  if (v.userId === this.sysUser.userId) {
                    const index = this.list.indexOf(v)
                    this.list.splice(index, 1, this.sysUser)
                    break
                  }
                }
                this.dialogFormVisible = false
                this.$message({
                  message: '更新成功',
                  type: 'success',
                  duration: 2000
                })
              } else {
                this.$message({
                  message: response.msg,
                  type: 'error',
                  duration: 2000
                })
              }
            })
          }
        })
      }
    },
    handlePwd(userId) { // 修改密码方法
      // 修改密码
      this.dialogChangePwd = true
      this.changeForm.password = ''
      this.changeForm.enterpassword = ''
      this.userIdnew = userId
      console.log('用户id' + this.userIdnew)
      this.$nextTick(() => {
        this.$refs['changeForm'].clearValidate()
      })
    },
    showPwd() { // 是否显示密码
      if (this.passwordType === 'password') {
        this.passwordType = ''
        this.hidPwd = false
      } else {
        this.passwordType = 'password'
        this.hidPwd = true
      }
    },
    submitPwd() { // 修改密码保存方法
      const userId = this.userIdnew
      console.log(userId)
      console.log(this.changeForm.password)
      this.$refs['changeForm'].validate((valid) => {
        if (valid) {
          if (this.changeForm.password === this.changeForm.enterpassword) {
            console.log(this.changeForm.password)
            // this.changeForm.password = utils.encrypt(this.changeForm.password)
            this.changeForm.password = encodeURIComponent(utils.encrypt(this.changeForm.password))
            changePassword(userId, this.changeForm.password).then((response) => {
              console.log(response)
              console.log(this.changeForm.password)
              if (response && response.code === 0) {
                this.dialogChangePwd = false
                this.$message({
                  message: '修改成功',
                  type: 'success'
                })
              } else {
                this.$message({
                  message: '修改失败',
                  type: 'error'
                })
              }
            })
          } else {
            alert('密码必须一致')
          }
        }
      })
    }
  }
}
</script>

<style scoped>
  .app-container >>> .el-dialog__header {
    background-color: #5F7ABF;
    height: 40px;
    padding-top: 10px;
  }
  .app-container >>> .el-dialog__header span {
    color: #fff;
    font-size: 14px
  }
  .app-container >>> .el-dialog__header i {
    color: #fff;
  }
  .app-container >>> .styledialog {
    width: 52.5%;
  }
  .app-container >>> .el-dialog__headerbtn{
    top: 10px;
  }
  .app-container >>>  .el-dialog__body{
    padding-bottom: 0;
  }
  .app-container .filter-btn {
    background-color: #5F7ABF;
    border-color: #5F7ABF;
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
  float: right;
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
  background: #eef1f6;
}
.el-aside {
  padding: 8px;
}
.rightContainer {
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
}
.noMargin .el-form-item{
margin-bottom: 0px;
}

/*.app-container >>> .search-dialog  .el-dialog__body{*/
  /*height: 60vh;*/
  /*overflow: auto;*/
/*}*/
</style>
