<template>
  <div class="app-container">
    <el-container>
      <el-form
        ref="form"
        :model="listQuery"
        label-width="70px"
        inline
        style="background: #fff;
        margin: 0 20px;
        padding: 13px 10px 0 20px;
        border-radius: 5px;
        box-shadow: 0 0 10px #ccc">
        <el-form-item label="选择车辆">
          <el-input
            placeholder="请选择车辆"
            v-model.trim="listQuery.plateNo"
            style="width:100px;"
            size="small"
            readonly
            @focus="showChooseCar"
            clearable>
          </el-input>
        </el-form-item>
        <el-form-item label="所属企业">
          <el-popover placement="bottom" width="250">
            <!-- <menu-tree style="height: 300px; overflow: auto" :treeMenuData="menus" :treeMenuProp="defaultProps" :checkedKeys="defaultChecked" @node-click="handleNodeClick"></menu-tree> -->
            <el-tree
              :data="menus"
              :props="menusTrees"
              @node-click="munusNodeClick">
            </el-tree>
            <el-input slot="reference" placeholder="请选择所属企业" v-model.trim="listQuery.deptName" style="width:150px;" size="small" readonly></el-input>
          </el-popover>
        </el-form-item>
        <el-form-item label="车辆类型">
          <el-select
            v-model.trim="listQuery.vehicleType"
            placeholder="请选择"
            style="width:110px;"
            size="small"
            clearable>
            <el-option v-for="item in vehicleTypeOptions" :key="item.code" :label="item.value" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="抓拍对象">
          <el-select v-model="value2" placeholder="请选择" style="width:110px;" size="small" clearable>
          </el-select>
        </el-form-item>
        <el-form-item label="抓拍类型">
          <el-select v-model="value2" placeholder="请选择" style="width:110px;" size="small" clearable>
          </el-select>
        </el-form-item> -->
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
            style="width: 350px;"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
        </el-form-item>
        
        <el-form-item style="margin-left:10px; float: right">
          <el-button @click="handleQuery" type="primary" size="small">查询</el-button>
        </el-form-item>
        <el-form-item style="margin-left:10px; float: right">
          <el-button @click="reset" type="primary" size="small">重置</el-button>
        </el-form-item>
      </el-form>
      <el-main>
        <el-table
          :data="tableData"
          border
          stripe
          show-header
          style="width: 100%;border-radius: 5px;margin:20px auto">
          <el-table-column
            type="index"
            align="center"
            label="序号"
            width="60">
          </el-table-column>
          <el-table-column
            prop="plateNo"
            align="center"
            label="车牌号">
          </el-table-column>
          <el-table-column
            prop="vehicleType"
            align="center"
            label="车辆类型">
          </el-table-column>
          <el-table-column
            prop="deptName"
            align="center"
            label="所属企业">
          </el-table-column>
          <el-table-column
            prop="createTime"
            align="center"
            label="时间">
          </el-table-column>
          <!-- <el-table-column
            prop="address"
            label="抓拍对象"
            width="180">
          </el-table-column> -->
          <!-- <el-table-column
            align="center"
            prop="address"
            label="照片">
          </el-table-column> -->
          <!-- <el-table-column
            prop="address"
            label="抓拍类型">
          </el-table-column> -->
          <!-- <el-table-column
            prop="address"
            align="center"
            label="参数">
          </el-table-column> -->
        </el-table>
      </el-main>
      <el-footer>
        <!-- 分页区 -->
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="listQuery.page"
          :page-sizes="[10,20,30, 50]"
          :page-size="listQuery.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </el-footer>
    </el-container>
    <el-dialog
      title="选择车辆"
      :visible.sync="chooseDialogVisible"
      :close-on-click-modal='false'
      style="min-height: 400px;"
      width="70%">
      <el-row>
        <el-col :span="6">
          <el-tree
            :data="menus"
            @node-click="deptFilter"
            :props="defaultProps"
            default-expand-all
            :expand-on-click-node="false"
            style="background: #fff; height: 400px; overflow: auto">
          </el-tree>
        </el-col>
        <el-col :span="18" style="min-height: 400px; box-shadow: -5px 1px 5px #eee;">
          <div style="border-bottom: 1px solid #eee; padding: 10px 20px">
            <el-input
              size="small"
              placeholder="请输入车牌号"
              v-model.trim="carQuery.plateNo"
              class="input-with-select"
              style="width: 200px;">
              <el-button slot="append" icon="el-icon-search" @click="vnFilter"></el-button>
            </el-input>
          </div>
          <div style="padding: 10px 20px">
            <el-table
            ref="multipleTable"
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
// import { getMsgList, addMsg, deleteMsg } from '@/api/alarm/intelligentEWP'
import { getMsgList } from '@/api/alarm/intelligentEWP'
// import { fetchList, getDict } from '@/api/alarm/speedLimit'
import { getDict } from '@/api/alarm/speedLimit'
import { getDeptTree } from '@/api/infomationM/organizational'
import { vehicleList } from '@/api/base/vehicle'
// import { getData, getDriverList } from '@/api/alarm/autoCaptureEvent'
import { getDriverList } from '@/api/alarm/autoCaptureEvent'
// import { treeList } from '@/api/alarm/alarm'
// import menuTree from './menuTree'
// import vehicleDialog from './vehicleDialog'
// import { fetchMenuTree } from '@/api/infomationM/menu'

export default {
  name: 'intelligentEWP',
  data() {
    return {
      // 测试数据
      data1: {
        pageSize: 10,
        pageNum: 1
      },
      pickerOptions1: {
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      },
      value2: '',
      tableData: [],
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
          title: '超时开始时间',
          width: '200'
        },
        {
          key: 'speedingEndTime',
          title: '超时结束时间',
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
        pageNum: 1,
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
        isType: 2
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
      handlerTypeOptions: [],
      menusTrees: {
        children: 'children',
        label: 'text'
      }
    }
  },
  created() {
    this.getDept()
    this.getList()
    this.getData(this.data1)
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
        pageNum: 1,
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
        isType: 2
      }
    },
    // 内容区
    getData(data) {
      // getData(data).then(res => {
      //   this.tableData = res.data.rows
      //   console.log(this.tableData)
      // })
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
      // this.listLoading = true
      getDriverList(this.listQuery).then(res => {
        if (res.code === 0) {
          this.tableData = res.data.rows
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
    handleNodeClick(val) {
      console.log(val)
      this.listQuery.deptId = val.id
      this.listQuery.deptName = val.text
    },

    munusNodeClick(val) {
      console.log(val.text)
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
    background-color: #628FA6 !important;
    color: #fff
  }
  .app-container .el-dialog__header {
    background-color: #628FA6;
    height: 40px;
    padding-top: 10px;
  }
  
  .el-button--primary {
    background: #628FA6;
  }

  .el-pagination.is-background .el-pager li:not(.disabled).active {
    background: #628FA6;
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

