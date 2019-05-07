<template>
  <div class="app-container">
    <el-container>
      <el-form ref="form" label-width="90px" inline style="background: #fff; margin: 0 20px; padding: 20px 10px 0 20px; border-radius: 5px; box-shadow: 0 0 10px #ccc">
        <el-form-item label="运营商平台">
          <el-select v-model="listQuery.platformId" placeholder="请选择" style="width:200px;" size="small">
            <el-option v-for="item in platformIdList" :key="item.platformId" :label="item.platformName" :value="item.platformId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="企业/业户">
          <!-- <el-select @focus="owersIdClick" v-model="listQuery.name" placeholder="请选择" style="width:200px;" size="small">
              <el-option v-for="item in owersList" :key="item.id" :label="item.owersName" :value="item.owersName"></el-option>
            </el-select> -->
          <el-input v-model.trim="listQuery.name" placeholder="请输入企业/业户" style="width:200px;" size="small"></el-input>
        </el-form-item>
        <el-form-item style="float: right;">
          <el-button icon="el-icon-search" @click="handleQuery" type="primary" size="small">查询</el-button>
          <el-button icon="el-icon-refresh" @click="handleReset" type="primary" size="small">重置</el-button>
          <el-button icon="el-icon-plus" @click="handleCreate" type="primary" size="small">新增</el-button>
          <el-button icon="el-icon-download" @click="handleExport" type="primary" size="small">导出</el-button>
        </el-form-item>
      </el-form>
      <el-main>
        <el-table @selection-change="handleSelect" :data="data" :columns="columns" v-loading.body="listLoading" border stripe highlight-current-row style="width:100%; border-radius: 5px; box-shadow: 0 0 10px #ccc" :header-cell-style="{ 'background-color': '#5F7ABF', 'color': '#fff', border: 'none !important' }">
          <!-- <el-table-column align="center" type="selection" width="40" @selection-change="handleSelect"></el-table-column> -->
          <el-table-column align="center" type="index" label="序号" fixed="left" width="100px"></el-table-column>

          <el-table-column align="center" v-for="column in columns" :key="column.key" :label="column.title" :min-width="column.width">
            <template slot-scope="scope">
              <span>{{scope.row[column.key]}}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="操作" fixed="right" width="200px">
            <template slot-scope="scope">
              <el-button icon="el-icon-edit" size="small" type="primary" @click="handleUpdate(scope.row)">
                编辑
              </el-button>
              <el-button icon="el-icon-delete" size="small" type="danger" @click="handleDelete(scope.row)">
                删除
              </el-button>
            </template>
          </el-table-column>

        </el-table>
      </el-main>
      <el-footer>
        <!-- 分页区 -->
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page"
          :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </el-footer>
    </el-container>
    <!-- 新增业户dialog -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="addDialog"  :close-on-click-modal="false" style="min-width: 630px">
      <el-form :model="form" :rules="rules" ref="addForm">
        <el-row class="create_dialog_row">
          <el-col :span="11">
            <el-form-item label="运营商平台" prop="platformId" label-width="115px">
              <el-select :disabled="dialogStatus === 'update'" @change="platformChange(form.platformId)" v-model="form.platformId" placeholder="请选择运营商平台" size="small" style="width: 100%">
                <el-option v-for="item in platformIdList" :key="item.platformId" :label="item.platformName" :value="item.platformId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="1">
            <span>&nbsp;</span>
          </el-col>
          <el-col :span="11">
            <el-form-item label="企业/业户" prop="name" label-width="90px">
              <el-input placeholder="请输入企业/业户" v-model.trim="form.name"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="create_dialog_row">
          <el-col :span="23">
            <el-form-item label="上级企业/业户" prop="parentId" class="deptTreeInput" label-width="115px">
              <el-input placeholder="请选择上级企业/业户" v-model="form.parentName" disabled style="float: left; width: 85%"></el-input>
              <el-button v-if="btnIsShow" icon="el-icon-search" :disabled="isOpened" style="float: left; width: 15%" @click="showDeptTree(form.platformId)"></el-button>
              <div v-show="deptTreeShow" style="position: absolute;top:36px;left:0;width:100%;border:1px solid #ccc;z-index: 9;box-sizing: border-box;">
                <el-tree :data="treeData"
                :props="defaultProps"
                @node-click="handleNodeClick"
                default-expand-all
                ></el-tree>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="create_dialog_row">
          <el-col :span="11">
            <el-form-item label="联系人" prop="linkman" label-width="115px">
              <el-input placeholder="请输入联系人" v-model.trim="form.linkman"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="1">
            <span>&nbsp;</span>
          </el-col>
          <el-col :span="11">
            <el-form-item label="联系电话" prop="linkmanTel" label-width="90px">
              <el-input placeholder="请输入联系电话" v-model.trim="form.linkmanTel"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="create_dialog_row">
          <el-col :span="11">
            <el-form-item label="经营许可证号" prop="rtoln" label-width="115px">
              <el-input placeholder="请输入经营许可证号" v-model.trim="form.rtoln"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align:right">
        <el-button type="primary" @click="addDialog = false">取 消</el-button>
        <el-button :disabled="isDisable" v-if="dialogStatus === 'create'" type="primary" @click="confirmCreate('addForm')">确 定</el-button>
        <el-button v-else type="primary" @click="confirmUpdate('addForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { owersList, owersListByPlatform, deletePlatform, getDeptTree, getDeptTreeEdit, save, detailOwers, reFixed, enterpriseExcel } from '@/api/base/company'
// import { getPermsList } from '@/api/base/platform'
import { getChildrenVehList } from '@/api/vehicle/choiceCar'
// import { parseTime } from '@/utils'
import { validatePhoneNum } from '@/utils/validate'
export default {
  name: 'company',
  data() {
    return {
      isDisable: false,
      total: 0,
      isOpened: true,
      btnIsShow: true,
      listLoading: false,
      deptTreeShow: false,
      platformIdList: [],
      addDialog: false,
      data: [],
      trees: false,
      treeData: [],
      columns: [
        {
          key: 'platformName',
          title: '运营商平台',
          width: '150'
        },
        {
          key: 'name',
          title: '企业/业户',
          width: '150'
        },
        {
          key: 'linkman',
          title: '联系人',
          width: '150'
        },
        {
          key: 'linkmanTel',
          title: '联系电话',
          width: '150'
        },
        {
          key: 'rtoln',
          title: '经营许可证号',
          width: '150'
        },
        {
          key: 'parentName',
          title: '上级企业/业户',
          width: '150'
        },
        {
          key: 'lastUpdateTime',
          title: '最后更新时间',
          width: '200'
        }
      ],
      listQuery: {
        page: 1,
        limit: 10,
        name: ''
      },
      owersList: [],
      selectRows: [], // 选中的行数据
      textMap: {
        update: '修改企业/业户信息',
        create: '新增企业/业户'
      },
      dialogStatus: '',
      form: {},
      rules: {
        platformId: [{ required: true, message: '必填项', trigger: 'blur' }],
        name: [{ required: true, message: '必填项', trigger: 'blur' }],
        parentId: [{ required: true, message: '必填项', trigger: 'blur' }],
        linkman: [{ required: true, message: '必填项', trigger: 'blur' }],
        linkmanTel: [{ required: true, message: '必填项', trigger: 'blur' }],
        rtoln: [{ required: true, message: '必填项', trigger: 'blur' }]
      },
      defaultProps: {
        children: 'children',
        label: 'text'
      }
    }
  },
  computed: {
    platformId() {
      return this.form.platformId
    }
  },
  watch: {
    platformId: {
      handler(val, oldVal) {
        if (val) {
          this.isOpened = false
        } else {
          this.isOpened = true
        }
      }
    }
  },
  mounted() {
    // 获取下拉框数据
    this.getPlatformList()
    // this.getOwersList()
    this.getList()
  },
  methods: {
    // 重置表单
    resetForm() {
      this.form = {
        platformId: '',
        name: '',
        parentName: '',
        linkman: '',
        linkmanTel: '',
        rtoln: ''
      }
    },
    showDeptTree(val) {
      if (this.dialogStatus === 'create') {
        this.deptTreeShow = !this.deptTreeShow
        if (this.isOpened === false) {
          getDeptTree(val).then(res => {
            const data = JSON.parse('[' + JSON.stringify(res.data) + ']')
            this.treeData = data
          })
        }
      } else {
        this.deptTreeShow = !this.deptTreeShow
        if (this.isOpened === false) {
          getDeptTreeEdit(val, this.form.id).then(res => {
            const data = JSON.parse('[' + JSON.stringify(res.data) + ']')
            this.treeData = data
          })
        }
      }
    },
    // 获取下拉框数据
    getPlatformList() { // 获取运营商平台列表
      // getPermsList().then(response => {
      //   this.platformIdList = response.data
      // })
      const p = { type: 2 }
      getChildrenVehList(p).then(response => {
        this.platformIdList = response.data
      })
    },
    platformChange(val) {
      owersListByPlatform(val).then(response => {
        this.dialogOwersList = response.data
      })
      this.form.parentId = null
      this.form.parentName = null
      this.showDeptTree(val)
    },
    // platformChange(val) {
    //   owersListByPlatform(val).then(response => {
    //     this.listQuery.name = ''
    //     this.owersList = response.data
    //   })
    // },
    // getOwersList() {
    //   owersList(this.listQuery).then(response => {
    //     this.owersList = response.data.rows
    //   })
    // },
    // owersIdClick() {
    //   console.log('模糊搜索')
    // },
    getList() {
      this.listLoading = true
      owersList(this.listQuery).then(response => {
        this.data = response.data.rows
        this.owersList = response.data.rows
        this.total = response.data.totalCount
        this.listLoading = false
      })
    },
    handleQuery() { // 头部查询方法
      this.listQuery.page = 1
      this.getList()
    },
    handleReset() {
      this.listQuery.name = ''
      this.listQuery.platformId = ''
      this.owersList = []
      // this.handleQuery()
    },
    handleCreate() {
      this.resetForm()
      this.addDialog = true
      this.dialogStatus = 'create'
      this.deptTreeShow = false
      this.btnIsShow = true
    },
    handleUpdate(row) {
      this.resetForm()
      this.btnIsShow = true
      this.addDialog = true
      this.dialogStatus = 'update'
      this.deptTreeShow = false
      this.$nextTick(() => {
        this.$refs['addForm'].clearValidate()
      })
      this.handleDetail(row.id)
    },
    handleDetail(id) { // 业户详情
      this.listLoading = true
      detailOwers(id).then(response => {
        owersListByPlatform(response.data.platformId).then(response => {
          this.dialogOwersList = response.data
        })
        this.listLoading = false
        this.form = response.data
      })
    },
    // handleExport() { // 导出
    //   import('@/vendor/Export2Excel').then(excel => {
    //     const tHeader = ['运营商平台', '企业/业户', '联系人', '联系电话', '经营许可证号', '上级企业/业户', '最后更新时间']
    //     const filterVal = ['platformName', 'name', 'linkman', 'linkmanTel', 'rtoln', 'parentName', 'lastUpdateTime']
    //     const list = this.data
    //     const data = this.formatJson(filterVal, list)
    //     excel.export_json_to_excel({
    //       header: tHeader,
    //       data,
    //       filename: '企业/业户档案第' + this.listQuery.page + '页',
    //       autoWidth: true
    //     })
    //   })
    // },
    // formatJson(filterVal, jsonData) {
    //   return jsonData.map(v => filterVal.map(j => {
    //     if (j === 'timestamp') {
    //       return parseTime(v[j])
    //     } else {
    //       return v[j]
    //     }
    //   }))
    // },
    handleExport() {
      if (this.total > 50000) {
        this.$message('导出数据不能大于50000')
        return
      }
      enterpriseExcel(this.listQuery).then(result => {
        this.downloads(result)
      }).catch((result) => {
        this.downloads(result)
      })
    },
    downloads(data) {
      if (!data) {
        return
      }
      const url = window.URL.createObjectURL(new Blob([data]), { type: 'application/vnd.ms-excel' })
      const link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      link.setAttribute('download', '企业/业户档案管理汇总.xls')
      document.body.appendChild(link)
      link.click()
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleDelete(row) { // 删除业户
      const platformIds = []
      if (row && row.id) {
        platformIds.push(row.id)
      } else {
        if (this.selectRows.length === 0) {
          this.$message({
            message: '请选择要删除的企业/业户',
            type: 'warning'
          })
          return
        }
        this.selectRows.forEach(row => {
          platformIds.push(row.id)
        })
      }
      this.$confirm('此操作将删除企业/业户信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        deletePlatform(platformIds).then(response => {
          this.listLoading = false
          if (response.code === 0) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getList()
          } else {
            this.$message({
              message: response.msg,
              type: 'error'
            })
          }
        })
      }).catch(() => {
        this.$message({
          message: '已取消删除',
          type: 'info'
        })
      })
    },
    handleSelect(val) { // 选择处理事件
      this.selectRows = val
    },
    handleNodeClick(val) {
      this.deptTreeShow = false
      this.form.parentId = val.id
      this.form.parentName = val.text
      this.$refs.addForm.validateField('parentId')
    },
    confirmCreate(formName) {
      this.isDisable = true
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!validatePhoneNum(this.form.linkmanTel)) {
            this.$message({
              message: '请输入正确的手机号',
              type: 'error'
            })
            this.isDisable = false
            return
          }
          this.listLoading = true
          setTimeout(() => {
            this.isDisable = false
          }, 2000)
          save(this.form).then(response => {
            this.listLoading = false
            if (response.code === 0) {
              this.getList()
              this.addDialog = false
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
        } else {
          this.isDisable = false
        }
      })
    },
    confirmUpdate(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!validatePhoneNum(this.form.linkmanTel)) {
            this.$message({
              message: '请输入正确的手机号',
              type: 'error'
            })
            this.isDisable = false
            return
          }
          this.listLoading = true
          reFixed(this.form).then(response => {
            this.listLoading = false
            if (response.code === 0) {
              this.getList()
              this.addDialog = false
              this.$message({
                message: '修改成功',
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
  }
}
</script>

<style scope>
  .app-container .el-dialog__header {
    background-color: #5F7ABF;
    height: 40px;
    padding-top: 10px;
  }
  .app-container .el-dialog__header span {
    color: #fff;
    font-size: 14px
  }
  .app-container .el-dialog__headerbtn{
    top: 10px;
  }
  .app-container .el-dialog__headerbtn:focus .el-dialog__close, .app-container .el-dialog__headerbtn:hover .el-dialog__close{
    color: #fff;
  }
  .app-container .el-dialog__header i {
    color: #fff;
  }
  .el-button--primary {
    color: #fff;
    background-color: #5F7ABF;
    border-color: #5F7ABF;
  }
  .el-popover {
    height: 300px;
    overflow-y: scroll;
  }
  .el-dialog__body {
    /*padding: 5px 20px !important;*/
  }
  .create_dialog_row {
    text-align: right;
    padding: 0;
  }
  .create_dialog_row el-col span {
    width: 30%
  }
  .create_dialog_row el-col el-input {
    width: 70% !important
  }
  .deptTreeInput {
    position: relative;
  }
</style>
