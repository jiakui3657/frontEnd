<template>
  <div class="realtime">
      <!-- 顶部过滤功能 -->
      <div style="background: #fff; margin: 0 20px; padding: 20px 10px 0 20px; border-radius: 5px; box-shadow: 0 0 10px #ccc">
        <el-form :inline="true" :model="filterForm" class="demo-form-inline" style="overflow: hidden">
          <el-form-item>
            <search-byArea-and-three ref="areathree"
               @selectAreaId="(id) => {filterForm.areaCode = id}"
               @selectPlatformId="(id) => {filterForm.platformId = id}"
               @selectOwersId="(id) => {filterForm.owersId}">
            </search-byArea-and-three>
          </el-form-item>
          <el-form-item label="查询时间">
            <div class="block">
              <el-date-picker
                size="small"
                style="width: 270px"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                v-model="startEnd"
                :picker-options="pickerOptions"
                type="daterange"
                range-separator="——"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :editable="false"
                :clearable="false">
              </el-date-picker>
            </div>
          </el-form-item>
          <el-form-item label="查岗状态">
            <el-select v-model="filterForm.chechState" placeholder="请选择" style="width: 150px">
              <el-option
                v-for="item in chechStateList"
                :key="item.key"
                :label="item.value"
                :value="item.key">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item style="float: right">
            <el-button @click="onSubmit" size="small" type="primary">查询</el-button>
            <el-button @click="handleReset" size="small" type="primary">重置</el-button>
            <el-button @click="inspect" size="small" type="primary">查岗</el-button>
            <el-button @click="handleExport" type="primary" size="small">导出</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 表格主体部分 -->
      <el-row>
        <el-col :span="24">
          <div class="tableBody" style="padding: 20px 20px">
            <el-table
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            style="width:100%; border-radius: 5px; box-shadow: 0 0 10px #ccc" :header-cell-style="{ 'background-color': '#5F7ABF', 'color': '#fff', border: 'none !important' }"
            stripe
            border
            v-loading="loading"
            @selection-change="handleSelectionChange">
                <el-table-column
                type="selection"
                width="55">
                </el-table-column>
                <el-table-column
                type="index"
                width="60"
                label="序号">
                </el-table-column>
                <el-table-column
                label="地区"
                align="center"
                prop="areaName"
                show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                label="运营商平台"
                align="center"
                prop="platformName"
                show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                label="企业/业户"
                align="center"
                prop="owersName"
                show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                prop="reqTime"
                align="center"
                label="查岗时间">
                </el-table-column>
                <el-table-column
                prop="req"
                label="查岗信息"
                align="center"
                show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                prop="objectTypeName"
                label="对象类型"
                align="center"
                show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                prop="objectName"
                label="查岗对象"
                align="center"
                show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                prop="reqStatu"
                label="查岗状态"
                align="center"
                show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                prop="ackTime"
                label="回复时间"
                align="center"
                show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                prop="ack"
                label="回复内容"
                align="center"
                show-overflow-tooltip>
                </el-table-column>
            </el-table>
          </div>
        </el-col>
      </el-row>

      <!-- 分页 -->
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="filterForm.page"
        :page-sizes="[10,20,30, 50]" :page-size="filterForm.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
      <!-- 查岗输入框 -->
      <el-dialog title="查岗" :visible.sync="dialogVisible" :close-on-click-modal="false" >
          <el-form :model="inspectForm" :rules="rules" ref="inspectForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="选择平台" prop="platformId" labelWidth="150px">
              <el-select v-model="inspectForm.platformId" @focus="getPlatformList"
                placeholder="请选择" style="width: 50%" value-key="id">
                <el-option
                  v-for="item in nameOptions"
                  :key="item.platformId"
                  :label="item.platformName"
                  :value="item.platformId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="选择查岗对象类型" prop="objectType" labelWidth="150px">
              <el-select v-model="inspectForm.objectType" placeholder="请选择" style="width: 50%">
                <el-option
                  v-for="item in lookupOptions"
                  :key="item.code"
                  :label="item.value"
                  :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="企业/业户" prop="deptId" labelWidth="150px" v-if="inspectDeptShow">
              <el-select v-model="inspectForm.deptId" placeholder="请先选择平台" style="width: 50%" value-key="id">
                <el-option
                  v-for="item in inspectDeptOptions"
                  :key="item.owersId"
                  :label="item.owersName"
                  :value="item.rtoln">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="查岗信息" prop="req" labelWidth="150px">
              <el-input size="small" v-model="inspectForm.req"></el-input>
            </el-form-item>
            <!-- 待定 -->
          </el-form>
          <span slot="footer" class="dialog-footer">
              <el-button size="small" type="primary" @click="dialogVisible = false">取 消</el-button>
              <el-button size="small" type="primary" @click="handleSubmit('inspectForm')">确 定</el-button>
          </span>
      </el-dialog>
  </div>
</template>
<script>

import { parseTime } from '@/utils'
import { checkCenter } from '@/api/alarm/checkCenter' // 公告中心列表
import { lookupOptions } from '@/api/alarm/moniCenter' // 公告发布类型
import { getToken } from '@/utils/auth' // 发送报文
import { getChildrenVehList } from '@/api/vehicle/choiceCar'
import { formatDate } from '@/utils/date.js'
import SearchByAreaAndThree from '@/components/Search/SearchByAreaAndThree'

export default {
  components: { SearchByAreaAndThree },
  data() {
    return {
      startEnd: [new Date(), new Date()],
      loading: true,
      websocket: null,
      inspectDeptShow: false,
      lookupOptions: [], // 公告发布类型
      chechStateList: [
        {
          key: 0,
          value: '未回复'
        },
        {
          key: 1,
          value: '已回复'
        }
      ],
      inspectDeptOptions: [],
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      filterForm: {
        page: 1,
        limit: 10,
        platformId: '',
        areaCode: '',
        owersId: '',
        reqStartTime: formatDate(new Date(), 'yyyy-MM-dd'),
        reqEndTime: formatDate(new Date(), 'yyyy-MM-dd'),
        chechState: null
      },
      inspectForm: {
        platformId: '',
        objectType: '',
        deptId: '',
        req: ''
      },
      dialogVisible: false,
      nameOptions: [],
      platformIdOptions: [],
      tableData: [],
      total: 0,
      rules: {
        platformId: [
          { required: true, message: '请选择平台', trigger: 'blur' }
        ],
        objectType: [
          { required: true, message: '请选择查岗对象类型1', trigger: 'blur' }
        ],
        deptId: [
          { required: true, message: '请选择业户', trigger: 'blur' }
        ],
        req: [
          { required: true, message: '请输入查岗信息', trigger: 'blur' }
        ]
      },
      userInfo: {},
      queryCar: {
        type: 1,
        areaId: '',
        platformId: '',
        owersId: ''
      },
      areaList: [],
      owersList: []
    }
  },
  methods: {
    getLookupOptions() { // 获取公告发布类型列表
      lookupOptions().then(response => {
        this.lookupOptions = response.data
      })
    },
    onSubmit() {
      this.getList()
      // this.filterForm = {
      //   page: 1,
      //   limit: 10,
      //   platformId: '',
      //   reqStartTime: '',
      //   reqEndTime: ''
      // }
    },
    handleReset() { // 重置
      this.filterForm = {
        page: 1,
        limit: 10,
        platformId: '',
        areaCode: '',
        owersId: '',
        reqStartTime: '',
        reqEndTime: '',
        chechState: null
      }
      this.startEnd = [formatDate(new Date(), 'yyyy-MM-dd'), formatDate(new Date(), 'yyyy-MM-dd')]
      // this.getList()
      this.queryCar.areaId = ''
      this.queryCar.platformId = ''
      this.queryCar.owersId = ''
      this.areaList = []
      this.nameOptions = []
      this.owersList = []
      this.$refs.areathree.reset()
    },
    inspect() {
      this.dialogVisible = true
      this.$nextTick(() => {
        this.inspectForm.deptId = ''
        this.$refs.inspectForm.resetFields()
      })
    },
    handleExport() {
      // 导出功能
    },
    handleSelectionChange(val) {
    },
    handleSizeChange(val) {
      this.filterForm.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.filterForm.page = val
      this.getList()
    },
    handleSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 首先对objectType进行判断1是对当前平台，2是对某一业户，3是所有业户，根据这个发送websocket
          let tmp
          let platform = {}
          this.nameOptions.forEach(item => {
            if (item.platformId === this.inspectForm.platformId) {
              platform = item
            }
          })
          if (this.inspectForm.objectType === '1' || this.inspectForm.objectType === '3') {
            tmp = {
              userId: this.userInfo.userId,
              // platformId: this.inspectForm.platformId.id,
              // platformCode: this.inspectForm.platformId.platformCode,
              // objectId: this.inspectForm.platformId.area + this.inspectForm.platformId.platformCode,
              platformId: platform.platformId,
              platformCode: platform.platformCode,
              objectId: platform.platformCode + platform.area,
              objectType: this.inspectForm.objectType,
              content: this.inspectForm.req
            }
          } else {
            if (this.inspectForm.deptId === '') {
              this.$message({
                type: 'error',
                message: '请选择企业/业户'
              })
              return
            }
            tmp = {
              userId: this.userInfo.userId,
              // platformId: this.inspectForm.platformId.id,
              // platformCode: this.inspectForm.platformId.platformCode,
              platformId: platform.platformId,
              platformCode: platform.platformCode,
              // objectId: this.inspectForm.deptId.rtoln,
              objectId: this.inspectForm.deptId,
              objectType: this.inspectForm.objectType,
              content: this.inspectForm.req
            }
          }
          // 发送websocket
          const data = {
            Command: '47',
            CommandType: 'Business',
            token: getToken('Admin-Token'),
            Body: {
              data: tmp
            }
          }
          if (this.websocket.readyState === 1) {
            console.log(1112313)
            console.log(data)
            this.websocket.send(JSON.stringify(data))
            this.$message.success('查岗发送成功!')
            this.dialogVisible = false
            this.getList()
          } else {
            this.$message.error('发送失败，请稍候重试!')
          }
        }
      })
    },
    getList() {
      this.loading = true
      checkCenter(this.filterForm).then(res => {
        this.tableData = res.data.rows
        this.total = res.data.totalCount
        this.loading = false
      })
    },
    initWebSocket() {
      const vm = this
      vm.websocket = new WebSocket(process.env.WEBSOCKET_API)
      vm.websocket.onopen = function() {
        // vm.$message.success('websocket连接成功')
      }
      vm.websocket.onmessage = function(evt) {
        vm.getList()
      }
      vm.websocket.onerror = function() {
        // vm.$message.error('websocket连接失败，正在尝试重新连接。。。')
        vm.initWebSocket()
      }
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getAreaList() {
      this.queryCar.type = 1
      getChildrenVehList(this.queryCar).then(res => {
        this.areaList = res.data
      })
    },
    selectArea(area) {
      this.queryCar.areaId = area
    },
    getPlatformList() {
      this.queryCar.type = 2
      getChildrenVehList(this.queryCar).then(res => {
        this.nameOptions = res.data
      })
    },
    selectPlatform(platformId) {
      this.queryCar.platformId = platformId
    },
    getOwersList() {
      this.queryCar.type = 3
      getChildrenVehList(this.queryCar).then(res => {
        this.owersList = res.data
      })
    },
    selectOwers(owersId) {
      this.queryCar.owersId = owersId
    }
  },
  computed: {
    inspectFormObjectType() {
      return this.inspectForm.objectType
    },
    inspectFormPlatformId() {
      return this.inspectForm.platformId
    }
  },
  watch: {
    startEnd: {
      handler(val, oldVal) {
        if (val) {
          this.filterForm.reqStartTime = val[0]
          this.filterForm.reqEndTime = val[1]
        } else {
          this.filterForm.reqStartTime = ''
          this.filterForm.reqEndTime = ''
        }
      },
      deep: true
    },
    inspectFormObjectType: {
      handler(val, oldVal) {
        if (val === '1') {
          this.inspectDeptShow = false
        } else if (val === '2') {
          this.inspectDeptShow = true
        } else {
          this.inspectDeptShow = false
        }
      }
    },
    inspectFormPlatformId: {
      handler(val, oldVal) {
        if (val) {
          this.queryCar.type = 3
          this.queryCar.platformId = val
          getChildrenVehList(this.queryCar).then(res => {
            this.inspectDeptOptions = res.data
          })
        } else {
          this.inspectDeptOptions = []
        }
      }
    }
  },
  created() {
    this.initWebSocket()
    this.getLookupOptions() // 初始化公告发布类型
  },
  mounted() {
    this.getList()
    this.queryCar.type = 2
    getChildrenVehList(this.queryCar).then(res => {
      this.nameOptions = res.data
    })
    this.$store.dispatch('GetUserInfo').then(res => {
      this.userInfo = res.data.user
    })
  },
  destroyed() {
    this.websocket.close()
  }
}
</script>
<style lang="scss" scoped>
  .el-range-editor--small .el-range-input{
    font-size: 14px!important;
  }
 .el-dialog__headerbtn {
      position: absolute;
      top: 10px;
      right: 20px;
      padding: 0;
      background: 0 0;
      border: none;
      outline: 0;
      cursor: pointer;
      font-size: 16px;
  }
 .el-pagination.is-background .el-pager li:not(.disabled).active{
    background-color: #5F7ABF;
  }
  .el-button--primary {
      color: #fff;
      background-color: #5F7ABF;
      border-color: #5F7ABF;
  }
  .realtime .el-dialog__header span {
      color: #fff;
      font-size: 14px;
  }
  .realtime .el-dialog__header i {
    color: #fff;
  }
  .realtime .el-dialog__header {
      background-color: #5F7ABF;
      height: 40px;
      padding-top: 10px;
  }
</style>
