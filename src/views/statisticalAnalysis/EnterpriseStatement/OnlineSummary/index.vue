<template>
  <div class="app-container">
    <el-container>
        <el-form ref="form" :model="listQuery" label-width="70px" inline style="background: #fff; margin: 0 20px; padding: 13px 10px 0 20px; border-radius: 5px; box-shadow: 0 0 10px #ccc">
          <el-form-item label="运营商平台">
            <el-select  @change="platformChange(listQuery.platformId)" v-model="listQuery.platformId" placeholder="请选择" style="width:150px;" size="small" clearable  filterable>
              <el-option v-for="item in platformIdList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="企业/业户" label-width="80px">
              <el-select @focus="owersIdsClick(listQuery.platformId)" v-model="listQuery.owersIds" placeholder="请选择" style="width:150px;" size="small" multiple collapse-tags clearable>
                <el-option v-for="item in owersList" :key="item.id" :label="item.owersName" :value="item.id"></el-option>
              </el-select>
          </el-form-item>
          <!--<el-form-item label="选择车辆">
            <el-input placeholder="请选择车辆" v-model.trim="listQuery.vehicleNo" style="width:100px;" size="small" readonly @focus="showChooseCar" clearable></el-input>
          </el-form-item>
          <el-form-item label="车辆类型">
            <el-select v-model.trim="listQuery.vehicleType" placeholder="请选择" style="width:110px;" size="small" clearable>
              <el-option v-for="item in vehicleTypeOptions" :key="item.code" :label="item.value" :value="item.code"></el-option>
            </el-select>
          </el-form-item>-->
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
              style="width: 300px"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item style="margin-left:10px; float: right">
            <el-button @click="handleQuery" size="small" style="background-color: #5F7ABF;border-radius: 5px;color:#fff;">查询</el-button>
            <el-button @click="reset" size="small" style="background-color: #5F7ABF;border-radius: 5px;color:#fff;">重置</el-button>
            <el-button @click="alarmexport" size="small" style="float:right;background: #5F7ABF; color: #fff; border-radius: 5px">导出</el-button>
          </el-form-item>
        </el-form>
        <el-row style="margin:20px 0;">
            <div class="mil-trend">
              <bar-chart :chart-data="lineChartData"></bar-chart>
            </div>
        </el-row>
      <el-main style="padding:0px 20px 20px;">
        <el-table :data="data" :columns="columns" v-loading.body="listLoading" border stripe style="width:100%; border-radius: 5px; box-shadow: 0 0 10px #ccc" @row-click="handleSelect" :header-cell-style="{ 'background-color': '#5F7ABF', 'color': '#fff' }">
          <el-table-column align="center" type="index" width="50" label="序号" fixed="left"></el-table-column>
          <el-table-column align="center" v-for="column in columns" :key="column.key" :label="column.title" :min-width="column.width" show-overflow-tooltip :fixed="column.fixed">
            <template slot-scope="scope">
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
            <el-input size="small" placeholder="请输入车牌号" v-model.trim="carQuery.vehicleNo" class="input-with-select" style="width: 200px;">
              <el-button slot="append" icon="el-icon-search" @click="vnFilter"></el-button>
            </el-input>
          </div>
          <div style="padding: 10px 20px">
            <el-table
            ref="multipleTable"
            :header-cell-style="{ 'background-color': '#5F7ABF', 'color': '#fff' }"
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
                prop="vehicleNo">
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
    <!-- <footer-bar></footer-bar> -->
  </div>
</template>

<script>
import { getDict } from '@/api/alarm/speedLimit'
import { getDeptTree } from '@/api/infomationM/organizational'
import { vehicleList } from '@/api/base/vehicle'
import { enterpriseonlineSummary, summaryday, enterpriseonlineexcel } from '@/api/statistics/statistics'
import menuTree from './menuTree'
import BarChart from './BarChart'
import FooterBar from '../FooterBar'
import { getPermsList } from '@/api/base/platform'
import { owersListByPlatform } from '@/api/base/company'

const lineChartData = {
  newVisitis: {
    owersName: [],
    expectedData: [],
    actualData: []
  }
}

export default {
  components: { menuTree, BarChart, FooterBar },
  data() {
    var date = function() {
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return start
    }
    return {
      echData: {
        xAxis: [],
        series1: [],
        series2: []
      },
      total: 0,
      listLoading: true,
      activeIndex: '1',
      option: '1',
      radio: '-1',
      textarea: '',
      selectRows: [], // 选中的行数据
      count: 0,
      data: [],
      lineChartData: lineChartData.newVisitis,
      columns: [
        {
          key: 'owersName',
          title: '企业/业户',
          width: '100'
        },
        {
          key: 'platformName',
          title: '上级平台',
          width: '100'
        },
        {
          key: 'totalNumber',
          title: '所有车辆',
          width: '100'
        },
        {
          key: 'onlineVehicleNumber',
          title: '上线车辆',
          width: '100'
        },
        {
          key: 'onlineRate',
          title: '在线率',
          width: '100'
        }
      ],
      listQuery: {
        page: 1,
        pageSize: 10,
        handlerState: null,
        vehicleNo: null,
        deptId: null,
        startTime: date(),
        endTime: new Date(),
        vehicleType: null,
        handlerType: null,
        deptName: null,
        vehicleId: null,
        platformId: null,
        owersIds: [],
        owersId: null
      },
      defaultChecked: [],
      platformIdList: [],
      owersList: [],
      defaultProps: {
        children: 'children',
        label: 'text'
      },
      menus: [],
      startEnd: [date(), new Date()],
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
            text: '最近15天',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 15)
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
        vehicleNo: '',
        deptId: ''
      },
      chooseTotal: 0,
      allotLoading: false,
      carData: [],
      vehicleTypeOptions: []
    }
  },
  created() {
    this.getDept()
    this.getSpeedList()
    this.getPlatformList()
    this.getsummaryday()
    getDict('vehicle_type').then(res => {
      this.vehicleTypeOptions = res.data
    })
  },
  methods: {
    reset() {
      this.listQuery = {
        page: 1,
        pageSize: 10,
        handlerState: null,
        vehicleNo: null,
        deptId: null,
        startTime: null,
        endTime: null,
        vehicleType: null,
        handlerType: null,
        deptName: null,
        vehicleId: null,
        platformId: null,
        owersIds: [],
        owersId: null
      }
      this.startEnd = ''
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
      console.log(row.vehicleNo)
      this.listQuery.vehicleNo = row.vehicleNo
      this.listQuery.vehicleId = row.id
    },
    showChooseCar() {
      this.carQuery = {
        page: 1,
        limit: 5,
        vehicleNo: '',
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
    getSpeedList() { // 分页获取智能预警列表
      this.listLoading = true
      this.listQuery.owersId = this.listQuery.owersIds.toString()
      enterpriseonlineSummary(this.listQuery).then(res => {
        if (res.code === 0) {
          console.log(res)
          this.listLoading = false
          this.data = res.data.rows
          this.total = res.data.totalCount
        }
      })
    },
    getsummaryday() { // 上线率趋势图
      this.listLoading = true
      this.lineChartData.expectedData = []
      this.lineChartData.actualData = []
      summaryday(this.listQuery).then(res => {
        if (res.code === 0) {
          this.listLoading = false
          res.data.forEach(item => {
            this.lineChartData.expectedData.push(item.statDate)
            this.lineChartData.actualData.push(item.totalNumber)
          })
          if (this.lineChartData.owersName.length === 0) {
            this.lineChartData.owersName = '全部'
          }
        }
        if (this.listQuery.platformId === null) {
          this.listQuery.owersIds = []
          this.listQuery.owersId = null
        }
      })
    },
    handleSelect(row) { // 选择处理事件
      this.listQuery.owersId = row.id
      this.listQuery.owersIds.push(row.id)
      this.lineChartData.owersName = row.owersName
      this.getsummaryday()
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.lineChartData.owersName = []
      this.getSpeedList()
      this.getsummaryday()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.lineChartData.owersName = []
      this.getSpeedList()
      this.getsummaryday()
    },
    handleQuery() {
      console.log(this.listQuery)
      this.listQuery.page = 1
      this.listQuery.pageSize = 10
      this.lineChartData.owersName = []
      this.getSpeedList()
      this.getsummaryday()
    },
    getPlatformList() { // 获取运营商平台列表
      getPermsList().then(response => {
        this.platformIdList = response.data
      })
    },
    platformChange(val) { // 根据运营商平台获取业户列表
      if (val === null || val === '') {
        return
      }
      owersListByPlatform(val).then(response => {
        console.log(response)
        this.listQuery.owersIds = []
        this.owersList = response.data
      })
    },
    owersIdsClick(id) {
      if (!id || id === '') {
        this.$message({
          message: '请先选择平台',
          type: 'info'
        })
      }
    },
    alarmexport() {
      enterpriseonlineexcel(this.listQuery).then(result => {
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
      link.setAttribute('download', '企业/业户上线率汇总.xls')
      document.body.appendChild(link)
      link.click()
    }
  },
  watch: {
    startEnd(val) {
      if (val) {
        console.log(val)
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
  .mil-trend{
    border-radius: 5px;
    box-shadow: 0 0 10px #ccc;
    height: 400px;
    padding: 20px 30px 20px 30px;
    margin: 0px 20px
  }
</style>

