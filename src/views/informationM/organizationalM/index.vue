<template>
<div class="organManagement">
  <!-- 搜索部分 -->
  <el-row class="organManagementHeader">
    <el-col :span="4">
      <div>
        <div style="width: 300px">
          <el-input size="small" placeholder="请输入机构名称" v-model="input" class="input-with-select" autofocus style="width: 200px">
          </el-input>
          <el-button size="small" style="background-color: #66b1ff; color: #fff" slot="append" @click="searchData" icon="el-icon-search">查询</el-button>
        </div>
      </div>
    </el-col>
    <el-col :span="6" :offset="12 ">
      <div class="grid-content bg-purple-light">
        <div class="organManagementButton">
          <el-button size="small" type="primary" @click="addData" icon="el-icon-plus">新增</el-button>
          <!-- <el-button size="small" type="primary" icon="el-icon-download" @click="derive">导出</el-button> -->
        </div>
      </div>
    </el-col>
  </el-row>
  <!-- 表格主体 -->
  <el-row class="organManagementBody">
    <el-col :span="24">
      <el-table
      :data="tableData"
      border
      stripe
      v-loading="loading"
      @selection-change="handleSelect"
      :header-cell-style="{ 'background-color': '#5F7ABF', 'color': '#fff', border: 'none !important' }"
      >
        <el-table-column
          type="index"
          label="序号"
          width="60"
          align="center">
        </el-table-column>
        <el-table-column
          prop="name"
          align="center"
          label="机构名称">
        </el-table-column>
        <el-table-column
          prop="userName"
          align="center"
          label="主账户">
        </el-table-column>
        <el-table-column
          prop="contactPerson"
          align="center"
          label="联系人">
        </el-table-column>
        <el-table-column
          prop="phone"
          align="center"
          label="联系电话">
        </el-table-column>
        <el-table-column
          prop="parentName"
          align="center"
          label="上级机构">
        </el-table-column>
        <el-table-column
         fixed="right"
         label="操作"
          align="center"
         width="270px">
          <template slot-scope="scope">
            <el-row>
              <el-button type="info" size="small" icon="el-icon-message" @click="viewDetails(scope.row)">查看</el-button>
              <el-button type="primary" size="small" icon="el-icon-edit" @click="edit(scope.row)">编辑</el-button>
              <el-button type="danger" size="small" icon="el-icon-delete" @click="deleteData(scope.row)">删除</el-button>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>
  <!-- 分页组件 -->
  <div class="pagination">
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="[10, 25, 50]" :page-size="limit" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
  </div>
  <!-- 弹出框 -->
  <!-- 新增弹出框 -->
  <el-dialog title="新增机构" :visible.sync="addDialogVisible" :close-on-click-modal="false">
    <el-form :model="form" :rules="rules" ref="addForm">
      <el-row>
        <el-col :span="24">
          <el-form-item label="上级机构" :label-width="formLabelWidth" prop="parentName" class="deptTreeInput">
            <el-input v-model="form.parentName" disabled style="float: left; width: 90%"></el-input>
            <el-button icon="el-icon-search" style="float: left; width: 10%" @click="showDeptTree"></el-button>
            <div class="deptTree" v-show="deptTreeShow">
              <el-tree :data="data"
              :props="defaultProps"
              @node-click="handleNodeClick"
              default-expand-all
              ></el-tree>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="机构名称" :label-width="formLabelWidth" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="主账号" :label-width="formLabelWidth" prop="userName">
            <el-input v-model="form.userName"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="登录密码" :label-width="formLabelWidth" prop="password">
            <el-input v-model="form.password" type="password"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="确认密码" :label-width="formLabelWidth" prop="confirmPwd">
            <el-input v-model="form.confirmPwd" type="password"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="联系人" :label-width="formLabelWidth" prop="contactPerson">
            <el-input v-model="form.contactPerson"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系电话" :label-width="formLabelWidth" prop="phone">
            <el-input v-model="form.phone"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="备注" :label-width="formLabelWidth">
            <el-input
             type="textarea"
             :rows="5"
             placeholder="请输入内容"
             v-model="form.remark">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="addDialogVisible = false; $refs.addForm.resetFields()">取 消</el-button>
      <el-button size="small" type="primary" @click="submitAddForm('addForm')">确 定</el-button>
    </div>
  </el-dialog>
  <!-- 查看详情弹出框 -->
  <el-dialog title="查看详情" :visible.sync="viewDetailsDialogVisible" :close-on-click-modal="false">
    <el-form :model="viewDetailsForm">
      <el-row>
        <el-col :span="24">
          <el-form-item label="上级机构" :label-width="formLabelWidth">
            <el-input v-model="viewDetailsForm.parentName" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="机构名称" :label-width="formLabelWidth">
            <el-input v-model="viewDetailsForm.name" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="主账号" :label-width="formLabelWidth">
            <el-input v-model="viewDetailsForm.userName" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="联系人" :label-width="formLabelWidth">
            <el-input v-model="viewDetailsForm.contactPerson" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系电话" :label-width="formLabelWidth">
            <el-input v-model="viewDetailsForm.phone" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="备注" :label-width="formLabelWidth">
            <el-input
             type="textarea"
             :rows="5"
             placeholder="请输入内容"
             v-model="viewDetailsForm.remark"
             disabled>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-dialog>
  <!-- 编辑信息弹出框 -->
  <el-dialog title="编辑信息" :visible.sync="editDialogVisible" :close-on-click-modal="false">
    <el-form :model="editForm" :rules="rules" ref="editForm">
      <el-row>
        <el-col :span="24">
          <el-form-item label="上级机构" :label-width="formLabelWidth" prop="parentName" @focus="showEditDeptTree" class="deptTreeInput">
            <el-input v-model="editForm.parentName" disabled style="float: left; width: 90%"></el-input>
            <el-button icon="el-icon-search" style="float: left; width: 10%" @click="showEditDeptTree"></el-button>
            <div class="deptTree" v-show="editDeptTreeShow">
              <el-tree :data="data"
              :props="defaultProps"
              @node-click="editHandleNodeClick"
              default-expand-all
              ></el-tree>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="机构名称" :label-width="formLabelWidth" prop="name">
            <el-input v-model="editForm.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="主账号" :label-width="formLabelWidth" prop="userName">
            <el-input v-model="editForm.userName" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="联系人" :label-width="formLabelWidth" prop="contactPerson">
            <el-input v-model="editForm.contactPerson"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系电话" :label-width="formLabelWidth" prop="phone">
            <el-input v-model="editForm.phone"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="备注" :label-width="formLabelWidth">
            <el-input
             type="textarea"
             :rows="5"
             placeholder="请输入内容"
             v-model="editForm.remark">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="editDialogVisible = false">取 消</el-button>
      <el-button size="small" type="primary" @click="submitEditForm('editForm')">确 定</el-button>
    </div>
  </el-dialog>
</div>
</template>
<style lang="scss" scoped>
.organManagement{
  .organManagementHeader {
    padding-left: 30px;
    padding-top: 15px;
    .input-with-select .el-input-group__prepend {
      background-color: #fff;
    }
    .organManagementButton {
      float: right;
    }
  }
  .organManagementBody {
    margin: 20px;
    .pl-10 {
      padding-left: 10px
    }
  }
  .pagination {
    margin-left: 20px;
  }
  .deptTreeInput {
    position: relative;
    .deptTree {
      position: absolute;
      top: 36px;
      left: 0;
      z-index: 9;
      width: 100%;
      border: 1px solid #ccc;
      box-sizing: border-box;
    }
  }
}
</style>
<script>
import { getDeptList, getDeptTree, addDept, updateDept, deleteDept, getDeptById, exportDept } from '@/api/infomationM/organizational'
export default {
  data() {
    const validatePhoneNum = (rule, value, callback) => {
      const reg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/
      if (reg.test(value)) {
        callback()
      } else {
        return callback(new Error('请输入合法的手机号码'))
      }
    }
    return {
      input: '',
      page: 1,
      total: 5,
      limit: 10,
      data: [],
      addDialogVisible: false,
      viewDetailsDialogVisible: false,
      editDialogVisible: false,
      formLabelWidth: '80px',
      deptTreeShow: false,
      editDeptTreeShow: false,
      loading: true,
      form: {},
      viewDetailsForm: {},
      editForm: {},
      options: [],
      tableData: [],
      rules: {
        parentName: [
          { required: true, message: '请选择上级机构', trigger: 'blur' },
          { max: 20, message: '长度不应超过20个字符', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入机构名称', trigger: 'blur' },
          { max: 20, message: '长度不应超过20个字符', trigger: 'blur' }
        ],
        userName: [
          { required: true, message: '请输入主账号', trigger: 'blur' },
          { max: 20, message: '长度不应超过20个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { max: 20, message: '长度不应超过20个字符', trigger: 'blur' }
        ],
        confirmPwd: [
          { required: true, message: '请输入确认密码', trigger: 'blur' },
          { max: 20, message: '长度不应超过20个字符', trigger: 'blur' }
        ],
        contactPerson: [
          { required: true, message: '请输入联系人', trigger: 'blur' },
          { max: 20, message: '长度不应超过20个字符', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入联系电话', trigger: 'blur' },
          { validator: validatePhoneNum, trigger: 'blur' },
          { max: 20, message: '长度不应超过20个字符', trigger: 'blur' }
        ]
      },
      defaultProps: {
        children: 'children',
        label: 'text'
      }
    }
  },
  methods: {
    derive() {
      exportDept().then(res => {
      })
    },
    handleSizeChange(val) {
      this.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.page = val
      this.getList()
    },
    showEditDeptTree() {
      this.editDeptTreeShow = !this.editDeptTreeShow
    },
    handleSelect(val) {
    },
    addData() {
      this.deptTreeShow = false
      this.addDialogVisible = true
      this.$nextTick(() => {
        this.form = {}
        this.$refs.addForm.resetFields()
      })
    },
    handleNodeClick(data) {
      this.deptTreeShow = false
      this.form.parentId = data.id
      this.form.parentName = data.text
      this.$refs.addForm.validateField('parentName')
    },
    editHandleNodeClick(data) {
      this.editDeptTreeShow = false
      this.editForm.parentId = data.id
      this.editForm.parentName = data.text
      this.$refs.editForm.validateField('parentName')
    },
    showDeptTree() {
      this.deptTreeShow = !this.deptTreeShow
    },
    // 表格筛选业务处理
    searchData() {
      this.getList()
      // this.$nextTick(() => {
      //   this.input = ''
      // })
    },
    // 提交表单业务处理
    submitAddForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid && this.form.password === this.form.confirmPwd) {
          addDept(this.form).then(res => {
            if (res && res.code === 0) {
              this.$message({
                type: 'success',
                message: '提交成功!'
              })
              this.form = {}
              this.addDialogVisible = false
              this.getList()
              this.getTree()
              this.$refs[formName].resetFields()
            }
          })
        } else {
          this.$message({
            type: 'error',
            message: '请验证表单是否正确并确认密码填写是否一致!'
          })
          return false
        }
      })
    },
    // 查看详情业务处理
    viewDetails(row) {
      this.viewDetailsDialogVisible = true
      getDeptById(row.deptId).then(res => {
        if (res.code === 0) {
          if (res.data.parentId === '0') {
            res.data.id = '-1'
            res.data.parentName = '顶级节点'
          }
          this.viewDetailsForm = res.data
        }
      }).catch(rej => {
        console.log(rej)
      })
    },
    // 点击编辑业务处理
    edit(row) {
      this.editDeptTreeShow = false
      this.editDialogVisible = true
      getDeptById(row.deptId).then(res => {
        if (res.code === 0) {
          if (res.data.parentId === '0') {
            res.data.id = '-1'
            res.data.parentName = '顶级节点'
          }
          this.editForm = res.data
        }
      }).catch(rej => {
        console.log(rej)
      })
      // this.editForm = row
      // this.editForm.industryType = row.industryName
      // this.editForm.deptType = String(row.deptType)
    },
    // 提交编辑业务处理
    submitEditForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 校验通过的逻辑处理
          updateDept(this.editForm).then(res => {
            if (res && res.code === 0) {
              this.$message({
                type: 'success',
                message: '编辑信息成功!'
              })
              this.editForm = {}
              this.editDialogVisible = false
            }
            this.getList()
            this.getTree()
          })
        }
      })
    },
    // 删除业务处理
    deleteData(row) {
      this.$confirm('确定要删除该角色吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 在这里做删除的业务逻辑处理
        deleteDept(row.deptId).then(res => {
          if (res && res.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }
          this.getList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    getList() {
      this.loading = true
      getDeptList({ deptName: this.input, page: this.page, limit: this.limit }).then((res) => {
        const data = res.data.rows
        this.total = res.data.totalCount
        this.tableData = data
        this.loading = false
      }).catch(() => {
      })
    },
    getTree() {
      getDeptTree().then(res => {
        const data = JSON.parse('[' + JSON.stringify(res.data) + ']')
        this.data = data
      })
    }
  },
  mounted() {
    this.getList()
    this.getTree()
  }
}
</script>
