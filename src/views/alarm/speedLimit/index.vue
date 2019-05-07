<template>
  <div class="app-container">
    <el-container>
        <el-form ref="form" :model="listQuery" label-width="70px" inline style="background: #fff; margin: 0 20px; padding: 13px 10px 0 20px; border-radius: 5px; box-shadow: 0 0 10px #ccc">
          <el-form-item label="选择车辆">
            <el-input placeholder="请选择车辆" v-model.trim="listQuery.plateNo" style="width:100px;" size="small" readonly @focus="showChooseCar" clearable></el-input>
          </el-form-item>
          <el-form-item label="所属企业">
            <el-popover placement="bottom" width="250">
              <menu-tree style="height: 300px; overflow: auto" :treeMenuData="menus" :treeMenuProp="defaultProps" :checkedKeys="defaultChecked" @node-click="handleNodeClick"></menu-tree>
              <el-input slot="reference" placeholder="请选择所属企业" v-model.trim="listQuery.deptName" style="width:150px;" size="small" readonly></el-input>
            </el-popover>
          </el-form-item>
          <el-form-item label="查询时间">
            <el-date-picker
              v-model.trim="startEnd"
              type="datetimerange"
              :picker-options="pickerOptions"
              range-separator="——"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="left"
              size="small"
              style="width: 350px"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="车辆类型">
            <el-select v-model.trim="listQuery.vehicleType" placeholder="请选择" style="width:110px;" size="small" clearable>
              <el-option v-for="item in vehicleTypeOptions" :key="item.code" :label="item.value" :value="item.code"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="报警来源">
            <el-select v-model.trim="listQuery.alarmSource" placeholder="请选择" style="width:110px;" size="small" clearable>
              <el-option v-for="item in alarmSourceOptions" :key="item.code" :label="item.value" :value="item.code"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="处理状态">
            <el-select v-model.trim="listQuery.isHandlerType" placeholder="请选择" style="width:90px;" size="small" clearable>
              <el-option v-for="item in isHandlerTypeOptions" :key="item.code" :label="item.value" :value="item.code"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="处理方式">
            <el-select v-model.trim="listQuery.handlerType" placeholder="请选择" style="width:110px;" size="small" clearable>
              <el-option v-for="item in handlerTypeOptions" :key="item.code" :label="item.value" :value="item.code"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="margin-left:10px; float: right">
            <el-button @click="handleQuery" size="small" style="background-color: #628FA6;border-radius: 5px;color:#fff;">查询</el-button>
          </el-form-item>
          <el-form-item style="margin-left:10px; float: right">
            <el-button @click="reset" size="small" style="background-color: #628FA6;border-radius: 5px;color:#fff;">重置</el-button>
          </el-form-item>
        </el-form>
      <el-main>
        <el-table :data="data" :columns="columns" v-loading.body="listLoading" border stripe style="width:100%; border-radius: 5px; box-shadow: 0 0 10px #ccc" @selection-change="handleSelect" :header-cell-style="{ 'background-color': '#628FA6', 'color': '#fff', border: 'none !important' }">
          <el-table-column align="center" type="selection" width="40" @selection-change="handleSelect"></el-table-column>
          <el-table-column align="center" type="index" width="50" label="序号" fixed="left"></el-table-column>
          
          <el-table-column align="center" v-for="column in columns" :key="column.key" :label="column.title" :width="column.width" show-overflow-tooltip :fixed="column.fixed">
            <template slot-scope="scope">
              <!-- <el-button v-if="column.key === 'alarmName'" type="text" @click="handleDetail(scope.row)">{{scope.row[column.key]}}</el-button>
              <span v-else>{{scope.row[column.key]}}</span> -->
              <span>{{scope.row[column.key]}}</span>
            </template>
          </el-table-column>

        </el-table>
      </el-main>
      <el-footer>
        <!-- 分页区 -->
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page"
          :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </el-footer>

    </el-container>
    <!-- 批量处理对话框 -->
    <!-- <el-dialog title="批量处理" :visible.sync="batchDialog" :close-on-click-modal="false" center>
      <el-tabs v-model.trim="activeIndex">
        <el-tab-pane label="人工批量处理" name="1">
          <el-form label-position="top">
            <el-form-item label="处理方式" style="margin-bottom:0">
              <el-radio-group v-model.trim="radio">
                <el-row style="margin-bottom: 20px">
                  <el-radio :label="3">电话通知</el-radio>
                  <el-radio :label="6" style="margin-left:50px;">建议停车</el-radio>
                  <el-radio :label="9" style="margin-left:50px;">警告提醒</el-radio>
                </el-row>
                <el-row>
                  <el-radio :label="13">停车休息</el-radio>
                  <el-radio :label="16" style="margin-left:50px;">语音下发</el-radio>
                  <el-radio :label="19" style="margin-left:50px;">其他</el-radio>
                </el-row>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="处理描述">
              <el-input type="textarea" :rows="5" placeholder="请输入处理描述信息" v-model.trim="textarea"></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="消息批量下发" name="2">
          <el-form style="padding-bottom:0">
            <el-form-item label="设备">
              <el-select v-model.trim="listQuery.timeZone" placeholder="自定义" style="width:40%">
                <el-option v-for="item in timeZones" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
              <i class="el-icon-tickets msgManager" style="margin-left: 20px;" @click="updateMsgDialog = true; getMsg()">消息模版管理</i>
            </el-form-item>
            <el-form-item>
              <el-select v-model.trim="listQuery.timeZone" placeholder="选择消息模板" style="width:100%">
                <el-option v-for="item in timeZones" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
              <el-input type="textarea" :rows="5" placeholder="请输入下发消息" v-model.trim="textarea"></el-input>
            </el-form-item>
            <el-form-item label="标志" style="margin:0 30px 0 0">
              <el-checkbox-group v-model.trim="checkedCities">
                <el-checkbox label="紧急" style="margin-left:30px;"></el-checkbox>
                <el-checkbox label="终端显示器显示"></el-checkbox>
                <el-checkbox label="TTS播读"></el-checkbox>
                <el-checkbox label="广告屏显示"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      
      <div slot="footer" class="dialog-footer">
        <el-button @click="batchDialog = false">取 消</el-button>
        <el-button type="primary" @click="batchDialog = false">确 定</el-button>
      </div>
    </el-dialog> -->

    <!-- 预警处理dialog -->
    <!-- <el-dialog :visible.sync="warningProcessDialog" :close-on-click-modal="false" center>
      <el-row slot="title">
        <el-col :span="6">闽CYH300</el-col>
        <el-col :span="13" align="center">车道偏移</el-col>
      </el-row>
      <el-tabs stretch type="card" v-model="option">
        <el-tab-pane name="1">
          <span slot="label"><i class="el-icon-date"></i> 监控信息</span>
          监控信息
        </el-tab-pane>
        <el-tab-pane name="2">
          <span slot="label"><i class="el-icon-date"></i> 图片抓拍</span>
          图片抓拍
        </el-tab-pane>
        <el-tab-pane name="3">
          <span slot="label"><i class="el-icon-date"></i> 文本下发</span>
          文本下发
        </el-tab-pane>
        <el-tab-pane name="4">
          <span slot="label"><i class="el-icon-date"></i> 三电数据</span>
          三电数据
        </el-tab-pane>
        <el-tab-pane name="5">
          <span slot="label"><i class="el-icon-date"></i> 外设数据</span>
          外设数据
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button @click="warningProcessDialog = false">取 消</el-button>
        <el-button type="primary" @click="warningProcessDialog = false">确 定</el-button>
      </span>
    </el-dialog> -->
    <!-- 编辑模版弹框 -->
    <!-- <el-dialog :visible.sync="updateMsgDialog" :close-on-click-modal="false" title="批量处理" center>
      <el-input placeholder="输入消息模版" size="small" style="width: 80%; float: left; margin: 20px 5% 0 0" v-model.trim="content"></el-input>
      <el-button type="primary" size="small" style="width: 15%; margin-top: 20px" @click="addTemplate">添加模版</el-button>
      <el-table
       :data="msgTemplate"
       style="width: 100%; margin-top: 20px"
       border
       stripe>
        <el-table-column
         label="序号"
         type="index"
         width="100"
         align="center">
        </el-table-column>
        <el-table-column
         prop="content"
         label="模版内容"
         align="center">
        </el-table-column>
        <el-table-column
         label="删除"
         width="100"
         align="center">
          <template slot-scope="scope">
            <img src="@/assets/operate/delete.png" title="删除" style="cursor: pointer;" @click="deleteTemplate(scope.row.id)">
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateMsgDialog = false">取 消</el-button>
      </div>
    </el-dialog> -->

      <!-- <vehicle-dialog :vehicleInfo="vehicleInfo" :driveDatalist="[]"></vehicle-dialog> -->
    <el-dialog
     title="选择车辆"
     :visible.sync="chooseDialogVisible"
     :close-on-click-modal='false'
     style="min-height: 400px;"
     width="70%">
      <el-row>
        <el-col :span="6">
          <el-tree :data="menus" @node-click="deptFilter" :props="defaultProps" default-expand-all :expand-on-click-node="false" style="background: #fff; height: 400px; overflow: auto"></el-tree>
        </el-col>
        <el-col :span="18" style="min-height: 400px; box-shadow: -5px 1px 5px #eee;">
          <div style="border-bottom: 1px solid #eee; padding: 10px 20px">
            <el-input size="small" placeholder="请输入车牌号" v-model.trim="carQuery.plateNo" class="input-with-select" style="width: 200px;">
              <el-button slot="append" icon="el-icon-search" @click="vnFilter"></el-button>
            </el-input>
          </div>
          <div style="padding: 10px 20px">
            <el-table
            ref="multipleTable"
            :header-cell-style="{ 'background-color': '#628FA6', 'color': '#fff' }"
            :data="carData"
            style="margin-top: 10px;width:100%"
            stripe
            v-loading="allotLoading"
            border>
              <el-table-column
                label="序号"
                width="50px"
                align="center"
                type="index">
              </el-table-column>
              <el-table-column
                label="车牌号"
                align="center"
                prop="plateNo">
              </el-table-column>
              <el-table-column
                prop="activeStatus"
                align="center"
                label="状态">
              </el-table-column>
              <el-table-column
                prop="driver"
                align="center"
                label="司机">
              </el-table-column>
              <el-table-column
                prop="deptName"
                align="center"
                label="所属机构">
              </el-table-column>
              <el-table-column
                align="center"
                label="操作">
                <template slot-scope="scope">
                  <el-button type="text" @click="chooseCar(scope.row)">选择</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination background @current-change="handlePageChange" :current-page="carQuery.page" :page-size="carQuery.limit" layout="total, prev, pager, next" :total="chooseTotal" style="margin-top: 20px">
            </el-pagination>
          </div>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getMsgList, addMsg, deleteMsg } from '@/api/alarm/intelligentEWP'
import { fetchList, getDict } from '@/api/alarm/speedLimit'
import { getDeptTree } from '@/api/infomationM/organizational'
import { vehicleList } from '@/api/base/vehicle'
import menuTree from './menuTree'
// import vehicleDialog from './vehicleDialog'
// import { fetchMenuTree } from '@/api/infomationM/menu'

export default {
  name: 'intelligentEWP',
  components: { menuTree },
  data() {
    return {
      total: 0,
      listLoading: true,
      batchDialog: false,
      warningProcessDialog: false,
      activeIndex: '1',
      option: '1',
      radio: '-1',
      textarea: '',
      checkedCities: ['紧急', 'TTS播读'],
      selectRows: [], // 选中的行数据
      count: 0,
      options: [
        {
          label: '未处理',
          value: '0'
        },
        {
          label: '已处理',
          value: '1'
        }
      ],
      data: [],
      columns: [
        {
          key: 'plateNo',
          title: '车牌号',
          width: '100',
          fixed: 'left'
        },
        {
          key: 'deptName',
          title: '所属企业',
          width: '200'
        },
        {
          key: 'driverName',
          title: '司机',
          width: '100'
        },
        {
          key: 'phone',
          title: '联系方式',
          width: '200'
        },
        {
          key: 'vehicleType',
          title: '车辆类型',
          width: '200'
        },
        {
          key: 'alarmSourceName',
          title: '报警来源',
          width: '200'
        },
        {
          key: 'alarmName',
          title: '报警类型',
          width: '200'
        },
        {
          key: 'speedingStartTime',
          title: '超速开始时间',
          width: '200'
        },
        {
          key: 'speedingEndTime',
          title: '超速结束时间',
          width: '200'
        },
        {
          key: 'handlerStatus',
          title: '处理状态',
          fixed: 'right',
          width: '200'
        },
        {
          key: 'handlerTypeName',
          title: '处理方式',
          fixed: 'right',
          width: '200'
        }
      ],
      listQuery: {
        page: 1,
        pageSize: 10,
        alarmSource: null,
        isHandlerType: null,
        plateNo: null,
        deptId: null,
        startTime: null,
        endTime: null,
        vehicleType: null,
        handlerType: null,
        deptName: null,
        isType: 1
      },
      defaultChecked: [],
      defaultProps: {
        children: 'children',
        label: 'text'
      },
      menus: [],
      startEnd: [],
      pickerOptions: {
        shortcuts: [
          {
            text: '最近1天',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近3天',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 3)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近7天',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近1月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      updateMsgDialog: false,
      msgTemplate: [],
      content: '',
      chooseDialogVisible: false,
      carQuery: {
        page: 1,
        limit: 5,
        plateNo: '',
        deptId: ''
      },
      chooseTotal: 0,
      allotLoading: false,
      carData: [],
      vehicleTypeOptions: [],
      alarmSourceOptions: [],
      isHandlerTypeOptions: [
        {
          code: 0,
          value: '未处理'
        },
        {
          code: 1,
          value: '已处理'
        }
      ],
      handlerTypeOptions: []
    }
  },
  created() {
    this.getDept()
    this.getList()
    getDict('vehicle_type').then(res => {
      this.vehicleTypeOptions = res.data
    })
    getDict('alarm_source').then(res => {
      this.alarmSourceOptions = res.data
    })
    getDict('handler_type').then(res => {
      this.handlerTypeOptions = res.data
    })
  },
  methods: {
    reset() {
      this.listQuery = {
        page: 1,
        pageSize: 10,
        alarmSource: null,
        isHandlerType: null,
        plateNo: null,
        deptId: null,
        startTime: null,
        endTime: null,
        vehicleType: null,
        handlerType: null,
        deptName: null,
        isType: 1
      }
    },
    getCarList() {
      vehicleList(this.carQuery).then(res => {
        res.data.rows.forEach(item => {
          if (item.activeStatus === '1') {
            item.activeStatus = '在线'
          } else if (item.activeStatus === '0') {
            item.activeStatus = '离线'
          }
        })
        this.carData = res.data.rows
        this.chooseTotal = res.data.totalCount
      })
    },
    handlePageChange(val) {
      this.carQuery.page = val
      this.getCarList()
    },
    deptFilter(data) {
      this.carQuery.deptId = data.id
      if (data.id === '0') {
        this.carQuery.deptId = ''
      }
      this.carQuery.page = 1
      this.getCarList()
    },
    vnFilter() {
      this.carQuery.page = 1
      this.getCarList()
    },
    chooseCar(row) {
      this.chooseDialogVisible = false
      console.log(row.plateNo)
      this.listQuery.plateNo = row.plateNo
    },
    showChooseCar() {
      this.carQuery = {
        page: 1,
        limit: 5,
        plateNo: '',
        deptId: ''
      }
      this.getCarList()
      this.chooseDialogVisible = true
    },
    getDept() {
      getDeptTree().then(res => {
        this.menus = [res.data]
      })
    },
    getList() { // 分页获取智能预警列表
      this.listLoading = true
      fetchList(this.listQuery).then(res => {
        if (res.code === 0) {
          console.log(res)
          this.listLoading = false
          this.data = res.data.rows
          this.total = res.data.totalCount
        }
      })
    },
    getMsg() {
      getMsgList().then(res => {
        this.msgTemplate = res.data
      })
    },
    handleSelect(val) { // 选择处理事件
      this.selectRows = val
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleQuery() {
      console.log(this.listQuery)
      this.listQuery.page = 1
      this.listQuery.pageSize = 10
      this.getList()
    },
    batchProcess() { // 批量处理按钮
      this.batchDialog = true
    },
    handleDetail(row) { // 预警详情
      this.warningProcessDialog = true
    },
    addTemplate() {
      if (!this.content) {
        this.$message.error('请输入模版内容!')
      } else {
        addMsg({ content: this.content }).then(res => {
          if (res.code === 0) {
            this.$message.success('添加模版成功!')
            this.content = ''
            this.getMsg()
          }
        })
      }
    },
    deleteTemplate(id) {
      this.$confirm('是否删除此模版?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteMsg(id).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getMsg()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleNodeClick(val) {
      console.log(val)
      this.listQuery.deptId = val.id
      this.listQuery.deptName = val.text
    }
  },
  watch: {
    startEnd(val) {
      if (val) {
        this.listQuery.startTime = val[0]
        this.listQuery.endTime = val[1]
      } else {
        this.listQuery.startTime = ''
        this.listQuery.endTime = ''
      }
    }
  }
}
</script>

<style scope>
  .canClick {
    color: #488aff
  }
  .app-container .el-popover {
    height: 300px;
    overflow-y: scroll;
  }
  /* .app-container .el-radio-group {
    margin: 36px 0 0 50px;
  } */
  .app-container .el-dialog__body {
    padding: 5px 20px;
  }
  .app-container .el-table__header-wrapper table thead tr th {
    background-color: #4077BC;
    color: #fff
  }
  .app-container .el-dialog__header {
    background-color: #4077BC;
    height: 40px;
    padding-top: 10px;
  }
  .app-container .el-dialog__header span {
    color: #fff;
    font-size: 14px
  }
  .app-container .el-dialog__header i {
    color: #fff;
  }
  .msgManager:hover {
    color: #4077BC;
    cursor: pointer;
  }
  .app-container .el-dialog__headerbtn {
    top: 10px
  }
</style>

