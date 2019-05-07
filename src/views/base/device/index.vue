<template>
  <div class="app-container">
    <el-container>
      <el-form ref="form" label-width="80px" inline style="background: #fff; margin: 0 20px; padding: 20px 10px 0 20px; border-radius: 5px; box-shadow: 0 0 10px #ccc">
        <el-form-item>
          <search-byArea-and-three :showArea="false" ref="areathree" :showCar="false"
          @selectPlatformId="(id) => {listQuery.platformId = id}"
          @selectOwersId="(id) => {listQuery.owersId = id}"></search-byArea-and-three>
          <!-- <span>运营商平台</span>
          <el-select v-model="listQuery.platformId" placeholder="请选择" style="width:180px;" size="small">
          <el-option v-for="item in platformIdList" :key="item.platformId" :label="item.platformName" :value="item.platformId"></el-option>
          </el-select> -->
        </el-form-item>
        <el-form-item label="车牌号">
          <el-input maxlength="20" placeholder="请输入车牌" v-model.trim="listQuery.vehicleNo" style="width:150px;" size="small"></el-input>
        </el-form-item>
        <el-form-item label="终端号">
          <el-input maxlength="20" placeholder="请输入" v-model.trim="listQuery.deviceId" style="width:150px;" size="small"></el-input>
        </el-form-item>
        <el-form-item style="margin-left:10px; float: right">
          <el-button icon="el-icon-search" @click="handleQuery" type="primary" size="small" style="">查询</el-button>
          <el-button icon="el-icon-refresh" @click="handleReset" type="primary" size="small">重置</el-button>
          <el-button icon="el-icon-plus" @click="handleCreate" type="primary" size="small">新增</el-button>
          <el-button icon="el-icon-delete" @click="handleDelete" type="primary" size="small" >删除</el-button>
           <el-button icon="el-icon-download" @click="handleExport" type="primary" size="small">导出</el-button>
        </el-form-item>
      </el-form>
      <el-main>
        <el-table @selection-change="handleSelect" :data="data" :columns="columns" v-loading.body="listLoading" border stripe highlight-current-row style="width:100%; border-radius: 5px; box-shadow: 0 0 10px #ccc" :header-cell-style="{ 'background-color': '#5F7ABF', 'color': '#fff', border: 'none !important' }">
          <el-table-column align="center" type="selection" width="40" @selection-change="handleSelect"></el-table-column>

          <el-table-column align="center" type="index" label="序号" fixed="left" width="60px"></el-table-column>

          <el-table-column align="center" v-for="column in columns" :key="column.key" :label="column.title" :width="column.width">
            <template slot-scope="scope">
              <span v-if="column.key === 'bindStat'">{{scope.row[column.key] === '0' ? '未绑定' : scope.row[column.key] === '1' ? '已绑定' : '未知'}}</span>
              <span v-else>{{scope.row[column.key]}}</span>
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
    <!-- 新增终端dialog -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="addEquipmentDialog" :close-on-click-modal="false" custom-class="styledialog">
      <el-form :model="form" :rules="rules" ref="addForm">
        <el-row class="create_dialog_row">
          <el-col :span="11">
            <el-form-item label="运营商平台" prop="platformId">
              <el-select :disabled="dialogStatus === 'update'" @change="platformChange(form.platformId)" v-model="form.platformId" placeholder="请选择运营商平台" style="width:70%" size="small">
                <el-option v-for="item in platformIdList" :key="item.platformId" :label="item.platformName" :value="item.platformId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="1">
            <span>&nbsp;</span>
          </el-col>
          <el-col :span="11">
            <el-form-item label="企业/业户" prop="owersId">
              <el-select :disabled="dialogStatus === 'update'" @focus="owersIdClick(form.platformId)" v-model="form.owersId" placeholder="请选择企业/业户" style="width:70%;" size="small">
                <el-option v-for="item in dialogOwersList" :key="item.id" :label="item.owersName" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="create_dialog_row">
          <el-col :span="11">
            <el-form-item label="终端号" prop="deviceId">
              <el-input maxlength="20" placeholder="请输入终端号" v-model.trim="form.deviceId" style="width:70%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="1">
            <span>&nbsp;</span>
          </el-col>
          <el-col :span="11">
            <el-form-item label="终端型号" prop="modelType">
              <el-input maxlength="20" placeholder="请输入终端型号" v-model.trim="form.modelType" style="width:70%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="create_dialog_row">
          <el-col :span="11">
            <el-form-item label="厂商编码" prop="producerId">
              <el-input maxlength="20" placeholder="请输入终端厂商唯一编码" v-model.trim="form.producerId" style="width:70%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="1">
            <span>&nbsp;</span>
          </el-col>
          <el-col :span="11">
            <el-form-item label="SIM卡号" prop="simcode">
              <el-input maxlength="12" placeholder="请输入SIM卡号" v-model.trim="form.simcode" style="width:70%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="create_dialog_row">
          <el-col :span="11">
            <el-form-item label="ICCID" prop="iccid">
              <el-input maxlength="20" placeholder="ICCID" v-model.trim="form.iccid" style="width:70%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-footer" style="text-align:right">
        <el-button type="primary" @click="addEquipmentDialog = false">取 消</el-button>
        <el-button :disabled="isDisable"  v-if="dialogStatus === 'create'" type="primary" @click="confirmCreate('addForm')">确 定</el-button>
        <el-button v-else type="primary" @click="confirmUpdate('addForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// @Author: outman_qiaopeng  Date: 2018-09-17 14:14:13
import deptTree from '../../system/dept/components/deptTree'
import SearchByAreaAndThree from '@/components/Search/SearchByAreaAndThree'
import { fetchList, deleteDevice, detailDevice, updateDevice, createDevice, handleExcel } from '@/api/base/device'
// import { getPermsList } from '@/api/base/platform'
import { getChildrenVehList } from '@/api/vehicle/choiceCar'
import { owersListByPlatform } from '@/api/base/company'
import { validatePhoneNum, numAndLetter } from '@/utils/validate'
export default {
  name: 'device',
  components: { deptTree, SearchByAreaAndThree },
  data() {
    return {
      isDisable: false,
      total: 0,
      listLoading: false,
      addEquipmentDialog: false,
      platformIdList: [],
      data: [],
      dialogOwersList: [],
      columns: [
        {
          key: 'deviceId',
          title: '终端号',
          width: '180'
        },
        {
          key: 'vehicleNo',
          title: '车牌号'
        },
        {
          key: 'owersName',
          title: '企业/业户'
        },
        {
          key: 'platfromName',
          title: '运营商平台'
        },
        {
          key: 'producerId',
          title: '厂商编码',
          width: '120'
        },
        {
          key: 'modelType',
          title: '终端型号',
          width: '100'
        },
        {
          key: 'simcode',
          title: 'SIM卡号'
        },
        {
          key: 'bindStat',
          title: '绑定状态'
        },
        {
          key: 'createTime',
          title: '安装日期',
          width: '180'
        }
      ],
      listQuery: {
        page: 1,
        limit: 10,
        deviceId: '',
        platformId: '',
        owersId: '',
        vehicleNo: ''
      },
      form: {},
      rules: {
        deviceId: [{ required: true, message: '必填项', trigger: 'blur' }],
        simcode: [{ required: true, message: '必填项', trigger: 'blur' }],
        producerId: [{ required: true, message: '必填项', trigger: 'blur' }],
        modelType: [{ required: true, message: '必填项', trigger: 'blur' }],
        platformId: [{ required: true, message: '必选项', trigger: 'change' }],
        owersId: [{ required: true, message: '必选项', trigger: 'change' }]
      },
      selectRows: [], // 选中的行数据
      textMap: {
        update: '修改终端信息',
        create: '新增终端'
      },
      dialogStatus: ''
    }
  },
  mounted() {
    this.getList()
    this.getPlatformList()
  },
  methods: {
    getPlatformList() { // 获取运营商平台列表
      const p = { type: 2 }
      getChildrenVehList(p).then(response => {
        this.platformIdList = response.data
      })
    },
    platformChange(val) {
      owersListByPlatform(val).then(response => {
        this.form.owersId = ''
        this.dialogOwersList = response.data
      })
    },
    owersIdClick(id) {
      if (!id || id === '') {
        this.$message({
          message: '请先选择平台',
          type: 'info'
        })
      }
    },
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.data = response.data.rows
        this.total = response.data.totalCount
        this.listLoading = false
      })
    },
    handleQuery() { // 头部查询方法
      this.listQuery.page = 1
      this.getList()
    },
    handleReset() {
      this.listQuery.deviceId = ''
      this.listQuery.platformId = ''
      this.listQuery.vehicleNo = ''
      this.listQuery.owersId = ''
      this.$refs.areathree.reset()
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    // 重置表单
    resetForm() {
      this.form = {
        platformId: '',
        owersId: '',
        iccid: '',
        producerId: '',
        modelType: '',
        simcode: '',
        deviceId: ''
      }
    },
    handleCreate() { // 头部新增
      this.dialogOwersList = []
      this.resetForm()
      this.dialogStatus = 'create'
      this.addEquipmentDialog = true
      this.$nextTick(() => {
        this.$refs['addForm'].clearValidate()
      })
    },
    confirmCreate(formName) {
      this.isDisaable = true
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!validatePhoneNum(this.form.simcode)) {
            this.$message({
              message: '请输入正确的SIM卡号',
              type: 'error'
            })
            this.isDisable = false
            return
          }
          if (!numAndLetter(this.form.deviceId)) {
            this.$message({
              message: '终端号只能输入数字',
              type: 'error'
            })
            this.isDisable = false
            return
          }
          this.listLoading = true
          setTimeout(() => {
            this.isDisable = false
          }, 3000)
          createDevice(this.form).then(response => {
            this.listLoading = false
            if (response.code === 0) {
              this.getList()
              this.addEquipmentDialog = false
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
          if (!validatePhoneNum(this.form.simcode)) {
            this.$message({
              message: '请输入正确的SIM卡号',
              type: 'error'
            })
            return
          }
          if (!numAndLetter(this.form.deviceId)) {
            this.$message({
              message: '终端号只能输入数字',
              type: 'error'
            })
            return
          }
          this.listLoading = true
          updateDevice(this.form).then(response => {
            this.listLoading = false
            if (response.code === 0) {
              this.getList()
              this.addEquipmentDialog = false
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
    },
    handleDetail(id) { // 终端详情
      this.listLoading = true
      detailDevice(id).then(response => {
        owersListByPlatform(response.data.platformId).then(response => {
          this.dialogOwersList = response.data
        })
        this.listLoading = false
        this.form = response.data
      })
    },
    handleUpdate(row) { // 修改终端
      this.resetForm()
      this.dialogStatus = 'update'
      this.addEquipmentDialog = true
      this.$nextTick(() => {
        this.$refs['addForm'].clearValidate()
      })
      this.handleDetail(row.id)
    },
    handleDelete(row) { // 删除终端
      const userIds = []
      if (row && row.id) {
        userIds.push(row.id)
      } else {
        if (this.selectRows.length === 0) {
          this.$message({
            message: '请选择要删除的终端',
            type: 'warning'
          })
          return
        }
        this.selectRows.forEach(row => {
          userIds.push(row.id)
        })
      }
      this.$confirm('此操作将删除终端信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        deleteDevice(userIds).then(response => {
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
    handleExport() {
      if (this.total > 50000) {
        this.$message('导出数据不能大于50000')
        return
      }
      handleExcel(this.listQuery).then(result => {
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
      link.setAttribute('download', '终端档案管理汇总.xls')
      document.body.appendChild(link)
      link.click()
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
    padding: 5px 20px !important;
  }
  .create_dialog_row {
    text-align:right;
    padding: 0;
  }
  .create_dialog_row el-col span {
    width: 30%
  }
</style>
