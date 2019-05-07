<template>
  <div class="app-container">
    <el-container>
      <el-form ref="form" label-width="90px" inline style="background: #fff; margin: 0 20px; padding: 20px 10px 0 20px; border-radius: 5px; box-shadow: 0 0 10px #ccc">
        <el-form-item label="运营商平台">
          <el-select @change="platformChange(listQuery.platformId)" v-model="listQuery.platformId" placeholder="请选择" style="width:200px;" size="small">
            <el-option v-for="item in platformIdList" :key="item.platformId" :label="item.platformName" :value="item.platformId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="企业/业户">
          <el-select @focus="owersIdClick" v-model="listQuery.owersId" placeholder="请选择" style="width:200px;" size="small">
            <el-option v-for="item in owersList" :key="item.id" :label="item.owersName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <!--<el-form-item label="车牌号">-->
          <!--<el-input maxlength="20" placeholder="车牌号" v-model.trim="listQuery.vehicleNo" style="width:150px;" size="small"></el-input>-->
        <!--</el-form-item>-->
        <el-form-item label="司机姓名">
          <el-input maxlength="20" placeholder="司机姓名" v-model.trim="listQuery.driverName" style="width:150px;" size="small"></el-input>
        </el-form-item>
        <el-form-item label="驾驶证号">
          <el-input placeholder="驾驶证号" v-model.trim="listQuery.drivingLicense" style="width:150px;" size="small"></el-input>
        </el-form-item>
        <el-form-item label="驾照状态">
          <el-select v-model="listQuery.state" placeholder="请选择" style="width:150px;" size="small">
            <el-option v-for="item in drivingLicenseStatusList" :key="item.key" :label="item.value" :value="item.key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="float: right">
          <el-button icon="el-icon-search" @click="handleQuery" type="primary" size="small">查询</el-button>
          <el-button icon="el-icon-refresh" @click="handleReset" type="primary" size="small">重置</el-button>
          <el-button icon="el-icon-plus" @click="handleCreate" type="primary" size="small">新增</el-button>
        </el-form-item>
      </el-form>
      <el-main>
        <el-table :data="data" :columns="columns" v-loading.body="listLoading" border stripe highlight-current-row style="width:100%; border-radius: 5px; box-shadow: 0 0 10px #ccc" :header-cell-style="{ 'background-color': '#5F7ABF', 'color': '#fff', border: 'none !important' }">

          <el-table-column align="center" type="index" label="序号" fixed="left" width="60px"></el-table-column>

          <el-table-column align="center" v-for="column in columns" :key="column.key" :label="column.title" :width="column.width">
            <template slot-scope="scope">
              <span v-if="column.key === 'isExpire'">{{scope.row[column.key] === '0' ? '未到期' : scope.row[column.key] === '1' ? '已到期' : '未知'}}</span>
              <span v-else>{{scope.row[column.key]}}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="操作" fixed="right" width="200px">
            <template slot-scope="scope">
              <el-button icon="el-icon-edit" type="primary" size="small" @click="handleUpdate(scope.row)">
                编辑
              </el-button>

              <el-button icon="el-icon-delete" type="danger" size="small" @click="handleDelete(scope.row)">
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

    <!-- 新增司机dialog -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="addEquipmentDialog"  :close-on-click-modal="false">
      <el-form :model="form" :rules="rules" ref="addForm">

        <el-row class="create_dialog_row">
          <el-col :span="11">
            <el-form-item label="司机姓名" prop="driverName">
              <el-input maxlength="20" v-model.trim="form.driverName" placeholder="司机姓名" style="width:70%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="1">
            <span>&nbsp;</span>
          </el-col>
          <el-col :span="11">
            <el-form-item label="驾驶证号" prop="drivingLicense">
              <el-input maxlength="20" placeholder="驾驶证号" v-model.trim="form.drivingLicense" style="width:70%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="create_dialog_row">
          <el-col :span="11">
            <el-form-item label="运营商平台" prop="platformId">
              <el-select :disabled="dialogStatus === 'update'" @change="dialogPlatformChange(form.platformId)" v-model="form.platformId" placeholder="请选择" style="width:70%" size="small">
                <el-option v-for="item in platformIdList" :key="item.platformId" :label="item.platformName" :value="item.platformId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="1">
            <span>&nbsp;</span>
          </el-col>
          <el-col :span="11">
            <el-form-item label="企业/业户" prop="owersId">
              <el-select :disabled="dialogStatus === 'update'" v-model="form.owersId" placeholder="请选择" style="width:70%" size="small">
                <el-option v-for="item in dialogOwersList" :key="item.id" :label="item.owersName" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="create_dialog_row">
          <el-col :span="11">
            <el-form-item label="资格证号" prop="licence">
              <el-input maxlength="20" v-model.trim="form.licence" placeholder="从业资格证号" style="width:70%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="1">
            <span>&nbsp;</span>
          </el-col>
          <el-col :span="11">
            <el-form-item label="发证机构" prop="orgName">
              <el-input maxlength="20" v-model.trim="form.orgName" placeholder="发证机构名称" style="width:70%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="create_dialog_row">
          <el-col :span="11">
            <el-form-item label="联系电话" prop="mobile">
              <el-input maxlength="20" placeholder="联系电话" v-model.trim="form.mobile" style="width:70%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="1">
            <span>&nbsp;</span>
          </el-col>
          <el-col :span="11">
            <el-form-item label="身份证号" prop="idCard">
              <el-input maxlength="20" v-model.trim="form.idCard" placeholder="身份证号" style="width:70%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="create_dialog_row">
          <el-col :span="13">
            <el-form-item label="驾照期限" prop="startEnd">
              <el-date-picker style="width:75%" format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-model="startEnd" type="daterange" range-separator="——" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="1">
            <span>&nbsp;</span>
          </el-col>
          <el-col :span="9">
            <el-form-item label="车牌号" prop="vehicleNo" v-if="dialogStatus === 'create'">
              <el-input maxlength="20" v-model.trim="form.vehicleNo" placeholder="车牌号" style="width:70%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="create_dialog_row">
          <el-col :span="10">
            <el-form-item label="正面照">
              <el-upload
                class="avatar-uploader"
                name="headImg"
                :action=baseApi
                :show-file-list="true"
                :file-list="fileList"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload">
                <img v-if="imageUrl" :src="imageUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-row class="create_dialog_row">
          <el-col :span="11">
            <el-form-item label="照片" prop="headImg">
              <el-input type="file" placeholder="选择照片" v-model="form.headImg" style="width:70%"></el-input>
            </el-form-item>
          </el-col>
        </el-row> -->

      </el-form>

      <div slot="footer" class="dialog-footer" style="text-align:right">
        <el-button type="primary" @click="addEquipmentDialog = false">取 消</el-button>
        <el-button  v-if="dialogStatus === 'create'" type="primary" @click="submit('addForm')" :disabled="isUploaded">确 定</el-button>
        <el-button v-else type="primary" @click="update('addForm')" :disabled="isUploaded">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// @Author: outman_qiaopeng  Date: 2018-09-17 14:14:13
import { fetchList, createDriver, updateDriver, deleteDriver, detailDriver } from '@/api/base/driver'
// import { getPermsList } from '@/api/base/platform'
import { owersListByPlatform } from '@/api/base/company'
import { getChildrenVehList } from '@/api/vehicle/choiceCar'
import { validatePhoneNum, validateIdCardNum } from '@/utils/validate'

export default {
  name: 'driver',
  data() {
    return {
      imageUrl: '',
      total: 0,
      listLoading: false,
      drivingLicenseStatusList: [
        {
          key: '1',
          value: '未到期'
        },
        {
          key: '0',
          value: '已到期'
        }
      ],
      isUploaded: false,
      addEquipmentDialog: false,
      platformIdList: [],
      data: [],
      startEnd: [],
      owersList: [],
      dialogOwersList: [],
      form: [],
      columns: [
        {
          key: 'driverName',
          title: '司机姓名',
          width: '100'
        },
        {
          key: 'platformName',
          title: '运营商平台',
          width: '160'
        },
        {
          key: 'owersName',
          title: '企业/业户',
          width: '160'
        },
        {
          key: 'mobile',
          title: '联系电话',
          width: '130'
        },
        {
          key: 'idCard',
          title: '身份证号',
          width: '160'
        },
        // {
        //   key: 'vehicleNo',
        //   title: '车牌号',
        //   width: '120'
        // },
        {
          key: 'drivingLicense',
          title: '驾驶证号',
          width: '220'
        },
        {
          key: 'licence',
          title: '资格证号',
          width: '220'
        },
        {
          key: 'orgName',
          title: '发证机构',
          width: '120'
        },
        {
          key: 'startTime',
          title: '发证日期',
          width: '160'
        },
        {
          key: 'expireTime',
          title: '过期日期',
          width: '160'
        },
        {
          key: 'isExpire',
          title: '驾驶证状态',
          width: '100'
        }
      ],
      baseApi: '',
      listQuery: {
        page: 1,
        limit: 10,
        owersId: '',
        platformId: '',
        state: '',
        driverName: '',
        vehicleNo: '',
        drivingLicense: ''
      },
      selectRows: [], // 选中的行数据
      rules: {
        vehicleNo: [{ required: true, message: '必填项', trigger: 'blur' }],
        driverName: [{ required: true, message: '必填项', trigger: 'blur' }],
        platformId: [{ required: true, message: '必选项', trigger: 'change' }],
        owersId: [{ required: true, message: '必选项', trigger: 'change' }],
        idCard: [{ required: true, message: '必填项', trigger: 'blur' }],
        drivingLicense: [{ required: true, message: '必填项', trigger: 'blur' }]
      },
      textMap: {
        update: '修改司机信息',
        create: '新增司机'
      },
      dialogStatus: '',
      fileList: []
    }
  },
  mounted() {
    this.getList()
    this.getPlatformList()
    this.baseApi = process.env.BASE_API + '/base/driver/upload'
  },
  watch: {
    startEnd: {
      handler(val, oldVal) {
        if (val) {
          this.form.startTime = val[0]
          this.form.expireTime = val[1]
        }
      },
      deep: true
    }
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
      this.form.headImg = res.data.uploadUrl
      console.log(this.imageUrl)
      this.isUploaded = false
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传头像图片只能是JPG格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过2MB!')
      }
      this.isUploaded = true
      return isJPG && isLt2M
    },
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
        this.listQuery.owersId = ''
        this.owersList = response.data
      })
    },
    dialogPlatformChange(val) {
      owersListByPlatform(val).then(response => {
        this.form.owersId = ''
        this.dialogOwersList = response.data
      })
    },
    owersIdClick() {
      if (!this.listQuery.platformId && this.listQuery.platformId === '') {
        this.$message({
          message: '请先选择运营商平台',
          type: 'info'
        })
      }
    },
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        console.log(response.data.rows)
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
      this.listQuery.owersId = ''
      this.listQuery.platformId = ''
      this.listQuery.state = ''
      this.listQuery.driverName = ''
      this.listQuery.drivingLicense = ''
      this.owersList = []
      // this.handleQuery()
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleDelete(row) { // 发送驾驶员身份信息
      const userIds = []
      userIds.push(row.id)
      this.$confirm('确认删除驾驶员身份信息的请求吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        deleteDriver(userIds).then(response => {
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
    handleNodeClick(data) { // 树节点点击回调方法
      this.listQuery.deptId = data.id
      this.listQuery.deptName = data.text
      this.visible = false
    },
    // 重置表单
    resetForm() {
      this.form = {
        driverName: '',
        idCard: '',
        vehicleNo: '',
        licence: '',
        orgName: '',
        platformId: '',
        owersId: '',
        mobile: '',
        drivingLicense: '',
        startTime: '',
        expireTime: '',
        headImg: ''
      }
      this.startEnd = []
      this.fileList = []
    },
    handleCreate() { // 头部新增
      this.startEnd = []
      this.resetForm()
      this.imageUrl = undefined
      this.dialogOwersList = []
      this.dialogStatus = 'create'
      this.addEquipmentDialog = true
      this.$nextTick(() => {
        this.$refs['addForm'].clearValidate()
      })
    },
    handleDetail(id) {
      this.listLoading = true
      this.imageUrl = null
      detailDriver(id).then(response => {
        console.log(response)
        owersListByPlatform(response.data.platformId).then(res => {
          this.dialogOwersList = res.data
        })
        this.form = response.data
        this.imageUrl = response.data.headImg
        this.startEnd = [response.data.startTime, response.data.expireTime]
        this.listLoading = false
      })
    },
    handleUpdate(row) { // 编辑
      this.resetForm()
      this.imageUrl = undefined
      this.dialogStatus = 'update'
      this.addEquipmentDialog = true
      this.$nextTick(() => {
        this.$refs['addForm'].clearValidate()
      })
      this.handleDetail(row.id)
    },
    submit(formName) { // 表单内容提交
      this.isUploaded = true
      this.$refs[formName].validate((valid) => {
        console.log(this.form)
        if (valid) {
          if (this.form.mobile && !validatePhoneNum(this.form.mobile)) {
            this.$message({
              message: '请输入合法的手机号码',
              type: 'error'
            })
            this.isUploaded = false
            return
          }
          if (!validateIdCardNum(this.form.idCard)) {
            this.$message({
              message: '请输入合法的身份证号',
              type: 'error'
            })
            this.isUploaded = false
            return
          }
          if (!validateIdCardNum(this.form.drivingLicense)) {
            this.$message({
              message: '请输入合法的驾驶证号',
              type: 'error'
            })
            this.isUploaded = false
            return
          }
          this.listLoading = true
          setTimeout(() => {
            this.isUploaded = false
          }, 2000)
          createDriver(this.form).then(response => {
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
          this.isUploaded = false
        }
      })
    },
    update(formName) { // 修改提交
      if (this.form.mobile && !validatePhoneNum(this.form.mobile)) {
        this.$message({
          message: '请输入合法的手机号码',
          type: 'error'
        })
        return
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.form.idCard && !validateIdCardNum(this.form.idCard)) {
            this.$message({
              message: '请输入合法的身份证号',
              type: 'error'
            })
            return
          }
          if (!validateIdCardNum(this.form.drivingLicense)) {
            this.$message({
              message: '请输入合法的驾驶证号',
              type: 'error'
            })
            return
          }
          this.listLoading = true
          updateDriver(this.form).then(response => {
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
    }
  }
}
</script>

<style scope>
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
    text-align: right;
    padding: 0;
  }
  .create_dialog_row el-col span {
    width: 30%
  }
  .create_dialog_row el-col el-input {
    width: 70% !important
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
