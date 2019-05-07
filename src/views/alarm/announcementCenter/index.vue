<template>
  <div class="realtime">
      <!-- 顶部过滤功能 -->
      <div style="background: #fff; margin: 0 20px; padding: 13px 10px 0 20px; border-radius: 5px; box-shadow: 0 0 10px #ccc">
          <el-form :inline="true" :model="filterForm" class="demo-form-inline">
            <!-- <search-byArea-and-three ref="areathree"
              @selectAreaId="(id) => {filterForm.areaCode = id}"
              @selectPlatformId="(id) => {filterForm.platformId = id}" :showOwers="false">
            </search-byArea-and-three> -->
              <el-form-item label="运营商平台">
                  <el-select v-model="filterForm.platformId" placeholder="请选择" style="width: 225px">
                      <el-option
                        v-for="item in nameOptions"
                        :key="item.platformId"
                        :label="item.platformName"
                        :value="item.platformId">
                      </el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="查询时间">
                  <div class="block">
                      <el-date-picker
                        style="width: 270px"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        v-model="startEnd"
                        type="daterange"
                        range-separator="——"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :editable="false"
                        :clearable="false">
                      </el-date-picker>
                  </div>
              </el-form-item>
              <el-form-item>
                  <el-button @click="onSubmit" size="small" type="primary">查询</el-button>
              </el-form-item>
              <el-form-item>
                  <el-button @click="handleReset" size="small" type="primary">重置</el-button>
              </el-form-item>
              <el-form-item>
                <el-button @click="handleExport" type="primary" size="small">导出</el-button>
              </el-form-item>
              <el-form-item>
                  <el-button @click="handleMessage" size="small" type="primary">发布公告</el-button>
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
                type="primary"
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
                prop="platformName"
                label="运营商平台"
                align="center"
                show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                prop="reqTime"
                align="center"
                label="发布时间">
                </el-table-column>
                <el-table-column
                label="发布内容"
                align="center"
                prop="req">
                </el-table-column>
                <el-table-column
                prop="objectTypeName"
                label="对象类型"
                align="center"
                show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                prop="objectName"
                label="公告对象"
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

      <!-- 报文弹出框 -->
      <el-dialog title="发布公告" :visible.sync="MsgDialogVisible" :close-on-click-modal="false">
        <el-form :model="messageForm" :rules="rules" ref="msgForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="选择平台" prop="platformId" labelWidth="170px">
            <el-select v-model="messageForm.platformId" placeholder="请选择" style="width: 50%" value-key="id">
              <el-option
                v-for="item in platformIdOptions"
                :key="item.platformId"
                :label="item.platformName"
                :value="item.platformId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择公告发布类型" prop="objectType" labelWidth="170px">
            <el-select v-model="messageForm.objectType" placeholder="请选择" style="width: 50%">
              <el-option
                v-for="item in lookupOptions"
                :key="item.code"
                :label="item.value"
                :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择企业/业户" labelWidth="170px" prop="deptId" v-if="msgDeptShow">
            <el-select v-model="messageForm.deptId" placeholder="请先选择平台" style="width: 50%" value-key="id">
              <el-option
                v-for="item in msgDeptOptions"
                :key="item.owersId"
                :label="item.owersName"
                :value="item.rtoln">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发布公告信息" prop="req" labelWidth="170px">
            <el-input size="small" v-model="messageForm.req"></el-input>
          </el-form-item>
          <!-- 待定 -->
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button size="small" type="primary" @click="MsgDialogVisible = false">取 消</el-button>
            <el-button size="small" type="primary" @click="MsgHandleSubmit('msgForm')">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>
<script>

import { getToken } from '@/utils/auth'
// import { owersListByPlatform } from '@/api/base/company'
import { parseTime } from '@/utils'
// import { getPermsList } from '@/api/base/platform' // 获得运营商平台
import { getChildrenVehList } from '@/api/vehicle/choiceCar'
import { moniCenter } from '@/api/alarm/moniCenter' // 公告中心列表
import { lookupOptions } from '@/api/alarm/moniCenter' // 公告发布类型
import { formatDate } from '@/utils/date.js'
import SearchByAreaAndThree from '@/components/Search/SearchByAreaAndThree'
export default {
  components: { SearchByAreaAndThree },
  data() {
    return {
      startEnd: [new Date(), new Date()],
      loading: true,
      websocket: null,
      msgDeptShow: false,
      lookupOptions: [], // 公告发布类型
      msgDeptOptions: [],
      MsgDialogVisible: false,
      filterForm: {
        page: 1,
        limit: 10,
        areaCode: '',
        platformId: '',
        reqStartTime: formatDate(new Date(), 'yyyy-MM-dd'),
        reqEndTime: formatDate(new Date(), 'yyyy-MM-dd')
      },
      messageForm: {
        platformId: '',
        objectType: '',
        deptId: '',
        req: ''
      },
      nameOptions: [],
      platformIdOptions: [],
      statusOptions: [
        {
          value: '1',
          label: '已回复'
        },
        {
          value: '0',
          label: '未回复'
        }],
      tableData: [],
      total: 0,
      rules: {
        platformId: [
          { required: true, message: '请选择运营商平台', trigger: 'blur' }
        ],
        objectType: [
          { required: true, message: '请选择对象类型', trigger: 'blur' }
        ],
        deptId: [
          { required: true, message: '请选择业户', trigger: 'blur' }
        ],
        req: [
          { required: true, message: '请输入要下发内容', trigger: 'blur' }
        ]
      },
      userInfo: {},
      queryCar: {
        type: 2
      }
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
    },
    handleReset() {
      this.filterForm = {
        page: 1,
        limit: 10,
        platformId: '',
        reqStartTime: '',
        areaCode: '',
        reqEndTime: ''
      }
      this.startEnd = [formatDate(new Date(), 'yyyy-MM-dd'), formatDate(new Date(), 'yyyy-MM-dd')]
      // this.$refs.areathree.reset()
    },
    handleExport() {
      // 导出功能
    },
    handleMessage() {
      this.MsgDialogVisible = true
      this.$nextTick(() => {
        this.messageForm.deptId = ''
        this.$refs.msgForm.resetFields()
      })
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
    MsgHandleSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let tmp
          if (this.messageForm.objectType === '1' || this.messageForm.objectType === '3') {
            let platform = {}
            this.platformIdOptions.forEach(item => {
              if (item.platformId === this.messageForm.platformId) {
                platform = item
              }
            })
            tmp = {
              userId: this.userInfo.userId,
              // platformId: this.messageForm.platformId.id,
              // platformCode: this.messageForm.platformId.platformCode,
              // objectId: this.messageForm.platformId.platformCode + this.messageForm.platformId.area,
              platformId: platform.platformId,
              platformCode: platform.platformCode,
              objectId: platform.platformCode + platform.area,
              objectType: this.messageForm.objectType,
              content: this.messageForm.req
            }
          } else {
            if (this.messageForm.deptId === '') {
              this.$message({
                type: 'error',
                message: '请选择企业/业户'
              })
              return
            }
            let platform = {}
            this.platformIdOptions.forEach(item => {
              if (item.platformId === this.messageForm.platformId) {
                platform = item
              }
            })
            tmp = {
              userId: this.userInfo.userId,
              // platformId: this.messageForm.platformId.id,
              // platformCode: this.messageForm.platformId.platformCode,
              platformId: platform.platformId,
              platformCode: platform.platformCode,
              // objectId: this.messageForm.deptId.rtoln,
              objectId: this.messageForm.deptId,
              objectType: this.messageForm.objectType,
              content: this.messageForm.req
            }
          }
          // 发送websocket
          const data = {
            Command: '48',
            CommandType: 'Business',
            token: getToken('Admin-Token'),
            Body: {
              data: tmp
            }
          }
          console.log('公告websoket发送：' + JSON.stringify(data))
          if (this.websocket.readyState === 1) {
            this.websocket.send(JSON.stringify(data))
            this.$message.success('公告发送成功!')
            this.MsgDialogVisible = false
            this.getList()
          } else {
            this.$message.error('发送失败，请稍候重试!')
          }
        }
      })
    },
    getList() {
      this.loading = true
      moniCenter(this.filterForm).then(res => {
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
    }
  },
  computed: {
    msgFormObjectType() {
      return this.messageForm.objectType
    },
    msgFormPlatformId() {
      return this.messageForm.platformId
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
    msgFormObjectType: {
      handler(val, oldVal) {
        if (val === '2') {
          this.msgDeptShow = true
        } else {
          this.msgDeptShow = false
        }
      }
    },
    msgFormPlatformId: {
      handler(val, oldVal) {
        if (val) {
          this.queryCar.type = 3
          this.queryCar.platformId = val
          getChildrenVehList(this.queryCar).then(res => {
            this.msgDeptOptions = res.data
          })
          // owersListByPlatform(val.id).then(res => {
          //   this.msgDeptOptions = res.data
          // })
        } else {
          this.msgDeptOptions = []
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
    // getPermsList().then(res => {
    //   this.nameOptions = res.data
    //   this.platformIdOptions = res.data
    // })
    getChildrenVehList(this.queryCar).then(res => {
      this.nameOptions = res.data
      this.platformIdOptions = res.data
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
<style >
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
