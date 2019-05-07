<template>
  <div class="inspect">
      <!-- 顶部过滤功能 -->
      <div class="dataFilter">
          <el-form :inline="true" :model="filterForm" class="demo-form-inline">
              <el-form-item label="运营商平台名称">
                  <el-select v-model="filterForm.platformId" placeholder="请选择" style="width: 225px">
                      <el-option
                        v-for="item in nameOptions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="交互时间段">
                  <div class="block">
                      <el-date-picker
                        style="width: 270px"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        v-model="startEnd"
                        type="daterange"
                        range-separator="——"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                      </el-date-picker>
                  </div>
              </el-form-item>
              <el-form-item>
                  <el-button size="small" type="primary" @click="onSubmit" icon="el-icon-search">查询</el-button>
              </el-form-item>
              <el-form-item>
                  <el-button icon="el-icon-refresh" @click="handleReset" type="primary" size="small">重置</el-button>
              </el-form-item>
              <el-form-item>
                  <el-button size="small" type="primary" @click="inspect" icon="el-icon-document">查岗</el-button>
              </el-form-item>
              <el-form-item>
                  <el-button size="small" type="primary" @click="handleMessage" icon="el-icon-document">发送报文</el-button>
              </el-form-item>
              <el-form-item>
                  <el-button @click="handleExport" size="small" type="primary" icon="el-icon-download">导出</el-button>
              </el-form-item>
          </el-form>
      </div>
      <!-- 表格主体部分 -->
      <el-row>
        <el-col :span="24">
          <div class="tableBody" style="padding: 0 20px">
            <el-table
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%"
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
                label="运营商平台"
                align="center"
                prop="platformName">
                </el-table-column>
                <el-table-column
                prop="type"
                align="center"
                label="交互类型">
                </el-table-column>
                <el-table-column
                prop="req"
                label="交互内容"
                align="center"
                show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                prop="reqTime"
                label="交互时间"
                align="center"
                show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                prop="ack"
                label="回复内容"
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
                prop="reqStatus"
                label="回复状态"
                align="center"
                show-overflow-tooltip>
                </el-table-column>
            </el-table>
          </div>
        </el-col>
      </el-row>

      <!-- 分页 -->
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="filterForm.page"
        :page-sizes="[10,20,30, 50]" :page-size="filterForm.limit" layout="total, sizes, prev, pager, next" :total="total">
      </el-pagination>
      <!-- 查岗输入框 -->
      <el-dialog title="查岗" :visible.sync="dialogVisible" :close-on-click-modal="false">
          <el-form :model="inspectForm" :rules="rules" ref="inspectForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="选择平台" prop="platformId" labelWidth="150px">
              <el-select v-model="inspectForm.platformId" placeholder="请选择" style="width: 50%" value-key="id">
                <el-option
                  v-for="item in platformIdOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="选择查岗对象类型" prop="objectType" labelWidth="150px">
              <el-select v-model="inspectForm.objectType" placeholder="请选择" style="width: 50%">
                <el-option
                  v-for="item in inspectObjectTypedOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="选择企业/业户" prop="dept" labelWidth="150px" v-if="inspectDeptShow">
              <el-select v-model="inspectForm.deptId" placeholder="请先选择平台" style="width: 50%" value-key="id">
                <el-option
                  v-for="item in inspectDeptOptions"
                  :key="item.id"
                  :label="item.owersName"
                  :value="item">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="查岗信息" prop="req" labelWidth="150px">
              <el-input size="small" v-model="inspectForm.req"></el-input>
            </el-form-item>
            <!-- 待定 -->
          </el-form>
          <span slot="footer" class="dialog-footer">
              <el-button size="small" @click="dialogVisible = false">取 消</el-button>
              <el-button size="small" type="primary" @click="handleSubmit('inspectForm')">确 定</el-button>
          </span>
      </el-dialog>
      <!-- 报文弹出框 -->
      <el-dialog title="下发报文" :visible.sync="MsgDialogVisible" :close-on-click-modal="false">
        <el-form :model="messageForm" :rules="rules" ref="msgForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="选择平台" prop="platformId" labelWidth="170px">
            <el-select v-model="messageForm.platformId" placeholder="请选择" style="width: 50%" value-key="id">
              <el-option
                v-for="item in platformIdOptions"
                :key="item.id"
                :label="item.name"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择下发报文对象类型" prop="objectType" labelWidth="170px">
            <el-select v-model="messageForm.objectType" placeholder="请选择" style="width: 50%">
              <el-option
                v-for="item in msgObjectTypedOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择企业/业户" labelWidth="170px" v-if="msgDeptShow">
            <el-select v-model="messageForm.deptId" placeholder="请先选择平台" style="width: 50%" value-key="id">
              <el-option
                v-for="item in msgDeptOptions"
                :key="item.id"
                :label="item.owersName"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="下发报文信息" prop="req" labelWidth="170px">
            <el-input size="small" v-model="messageForm.req"></el-input>
          </el-form-item>
          <!-- 待定 -->
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="MsgDialogVisible = false">取 消</el-button>
            <el-button size="small" type="primary" @click="MsgHandleSubmit('msgForm')">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>
<script>
import { getPlatforminfo } from '@/api/vehicle/inspect'
import { getPermsList } from '@/api/alarm/supervise'
import { getToken } from '@/utils/auth'
import { owersListByPlatform } from '@/api/base/company'
import { parseTime } from '@/utils'
export default {
  data() {
    return {
      startEnd: [],
      loading: true,
      websocket: null,
      inspectDeptShow: false,
      msgDeptShow: false,
      inspectObjectTypedOptions: [
        {
          value: '1',
          label: '当前链接的运营商平台'
        },
        {
          value: '2',
          label: '运营商平台所属单一业户'
        },
        {
          value: '3',
          label: '运营商平台所属所有业户'
        }
      ],
      inspectDeptOptions: [],
      msgObjectTypedOptions: [
        {
          value: '0',
          label: '运营商平台所属单一平台'
        },
        {
          value: '1',
          label: '当前链接的运营商平台'
        },
        {
          value: '2',
          label: '运营商平台所属单一业户'
        },
        {
          value: '3',
          label: '运营商平台所属所有业户'
        },
        {
          value: '4',
          label: '运营商平台所属所有平台'
        },
        {
          value: '5',
          label: '运营商平台所属所有平台和业户'
        },
        {
          value: '6',
          label: '运营商平台所属所有政府监管平台（含监控端）'
        },
        {
          value: '7',
          label: '运营商平台所属所有企业监控平台'
        },
        {
          value: '8',
          label: '运营商平台所属所有经营性企业监控平台'
        },
        {
          value: '9',
          label: '运营商平台所属所有非经营性企业监控平台'
        }
      ],
      msgDeptOptions: [],
      MsgDialogVisible: false,
      filterForm: {
        page: 1,
        limit: 10,
        platformId: '',
        reqStartTime: '',
        reqEndTime: ''
      },
      inspectForm: {
        platformId: {},
        objectType: '',
        deptId: '',
        req: ''
      },
      messageForm: {
        platformId: {},
        objectType: '',
        deptId: '',
        req: ''
      },
      dialogVisible: false,
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
        req: [
          { required: true, message: '请输入要下发内容', trigger: 'blur' }
        ]
      },
      userInfo: {}
    }
  },
  methods: {
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
    handleReset() {
      this.filterForm = {
        page: 1,
        limit: 10,
        platformId: '',
        reqStartTime: '',
        reqEndTime: ''
      }
      this.startEnd = ''
      // this.getList()
    },
    inspect() {
      this.dialogVisible = true
      this.$nextTick(() => {
        this.inspectForm.deptId = ''
        this.$refs.inspectForm.resetFields()
      })
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
    handleSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 首先对objectType进行判断1是对当前平台，2是对某一业户，3是所有业户，根据这个发送websocket
          let tmp
          if (this.inspectForm.objectType === '1') {
            tmp = {
              userId: this.userInfo.userId,
              platformId: this.inspectForm.platformId.id,
              platformCode: this.inspectForm.platformId.platformCode,
              objectId: this.inspectForm.platformId.area + this.inspectForm.platformId.platformCode,
              objectType: this.inspectForm.objectType,
              content: this.inspectForm.req
            }
          } else if (this.inspectForm.objectType === '2') {
            if (this.inspectForm.deptId === '') {
              this.$message({
                type: 'error',
                message: '请选择企业/业户'
              })
              return
            }
            tmp = {
              userId: this.userInfo.userId,
              platformId: this.inspectForm.platformId.id,
              platformCode: this.inspectForm.platformId.platformCode,
              objectId: this.inspectForm.deptId.rtoln,
              objectType: this.inspectForm.objectType,
              content: this.inspectForm.req
            }
          } else {
            tmp = {
              userId: this.userInfo.userId,
              platformId: this.inspectForm.platformId.id,
              platformCode: this.inspectForm.platformId.platformCode,
              objectId: '0',
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
    MsgHandleSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let tmp
          if (this.messageForm.objectType === '0' || this.messageForm.objectType === '1') {
            tmp = {
              userId: this.userInfo.userId,
              platformId: this.messageForm.platformId.id,
              platformCode: this.messageForm.platformId.platformCode,
              objectId: this.messageForm.platformId.platformCode + this.messageForm.platformId.area,
              objectType: this.messageForm.objectType,
              content: this.messageForm.req
            }
          } else if (this.messageForm.objectType === '2') {
            if (this.messageForm.deptId === '') {
              this.$message({
                type: 'error',
                message: '请选择企业/业户'
              })
              return
            }
            tmp = {
              userId: this.userInfo.userId,
              platformId: this.messageForm.platformId.id,
              platformCode: this.messageForm.platformId.platformCode,
              objectId: this.messageForm.deptId.rtoln,
              objectType: this.messageForm.objectType,
              content: this.messageForm.req
            }
          } else {
            tmp = {
              userId: this.userInfo.userId,
              platformId: this.inspectForm.platformId.id,
              platformCode: this.inspectForm.platformId.platformCode,
              objectId: '0',
              objectType: this.inspectForm.objectType,
              content: this.inspectForm.req
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
          if (this.websocket.readyState === 1) {
            this.websocket.send(JSON.stringify(data))
            this.$message.success('报文发送成功!')
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
      getPlatforminfo(this.filterForm).then(res => {
        res.data.rows.forEach(item => {
          if (item.type === 1) {
            item.type = '查岗'
          } else {
            item.type = '平台间报文'
          }
          if (item.reqStatus === '0') {
            item.reqStatus = '未回复'
          } else if (item.reqStatus === '1') {
            item.reqStatus = '已回复'
          }
        })
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
    handleExport() { // 导出
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['运营商平台', '交互类型', '交互内容', '交互时间', '回复内容', '回复时间', '回复状态']
        const filterVal = ['platformName', 'type', 'req', 'reqTime', 'ack', 'ackTime', 'reqStatus']
        const list = this.tableData
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '平台交互第' + this.filterForm.page + '页',
          autoWidth: true
        })
      })
    }
  },
  computed: {
    inspectFormObjectType() {
      return this.inspectForm.objectType
    },
    inspectFormPlatformId() {
      return this.inspectForm.platformId
    },
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
        if (val.id) {
          owersListByPlatform(val.id).then(res => {
            this.inspectDeptOptions = res.data
          })
        } else {
          this.inspectDeptOptions = []
        }
      }
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
        if (val.id) {
          owersListByPlatform(val.id).then(res => {
            this.msgDeptOptions = res.data
          })
        } else {
          this.msgDeptOptions = []
        }
      }
    }
  },
  created() {
    this.initWebSocket()
  },
  mounted() {
    this.getList()
    getPermsList().then(res => {
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
<style lang="scss" scoped>
.inspect {
    .dataFilter {
        padding: 20px;
    }
    .el-pagination {
        padding: 20px;
    }
}
</style>
