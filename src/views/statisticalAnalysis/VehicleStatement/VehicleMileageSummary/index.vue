<template>
    <div class="app-container">
        <el-container>
        <el-form ref="form" :model="listQuery" label-width="70px" inline style="background: #fff; margin: 0 20px; padding: 13px 10px 0 20px; border-radius: 5px; box-shadow: 0 0 10px #ccc">
          <el-form-item label="运营商平台">
            <el-select   v-model="listQuery.platformId" placeholder="请选择" style="width:150px;" size="small" clearable  filterable>
              <el-option v-for="item in platformIdList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <!--弹窗触发 选择车辆-->
          <!-- <window-bar :platformId="listQuery.platformId"  @getVehicleName="getVehicleName"></window-bar> -->
          <el-form-item label="选择车辆">
            <el-input placeholder="请选择车辆" v-model.trim="listQuery.vehicleNo" style="width:150px;" size="small" readonly @focus="showChooseCar"  clearable></el-input>
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
              style="width: 300px"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item style="margin-left:10px; float: right">
            <el-button @click="handleQuery" size="small" style="background-color: #5F7ABF;border-radius: 5px;color:#fff;">查询</el-button>
            <el-button @click="reset" size="small" style="background-color: #5F7ABF;border-radius: 5px;color:#fff;">重置</el-button>
            <!-- <el-button @click="alarmexport" size="small" style="float:right;background: #5F7ABF; color: #fff; border-radius: 5px">导出</el-button> -->
          </el-form-item>
        </el-form>
        <el-row style="margin:20px 0;">
          <div class="mil-trend">
            <line-chart :chart-data="lineChartData"></line-chart>
          </div>
        </el-row>
      <el-main>
        <el-table :data="data" :columns="columns" v-loading.body="listLoading" border stripe style="width:100%; border-radius: 5px; box-shadow: 0 0 10px #ccc" @row-click="handleSelect" :header-cell-style="{ 'background-color': '#5F7ABF', 'color': '#fff', border: 'none !important' }">
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
      <el-dialog title="选择车辆" :visible.sync="chooseDialogVisible" class="allotDialog" :close-on-click-modal="false">
          <el-row>
            <el-col :span="6" style="border: 1px solid #ccc; min-height: 400px; max-height: 600px; overflow: hidden">
              <el-tree :data="menus" @node-click="deptFilter" :props="defaultProps" default-expand-all :expand-on-click-node="false" style="background: #fff; height: 400px; overflow: auto"></el-tree>
            </el-col>
            <el-col :span="17" :offset="1">
              <div class="searchInput" style="overflow: hidden">
                车牌号: <el-input placeholder="请输入车牌号" v-model="carQuery.vehicleNo" style="width: 200px;" size="small"></el-input>
                <el-button style="background-color:#5F7ABF;color:#fff;border-radius:5px;" size="small" @click="vnFilter">查询</el-button>
                <el-button size="small" style="float:right;background-color:#5F7ABF;color:#fff;border-radius:5px;" @click="chooseCar">确定</el-button>
              </div>
              <div>
                <el-table ref="multipleTable" :data="carData" :header-cell-style="{ 'background-color': '#5F7ABF', 'color': '#fff' }"
                          style="margin-top: 10px;width:100%" stripe border @selection-change="handleSelectionChange">
                  <el-table-column type="selection" width="40"></el-table-column>
                  <el-table-column
                    label="车牌号"
                    align="center"
                    prop="vehicleNo"
                    width="100px">
                  </el-table-column>
                  <el-table-column
                    prop="activeStatus"
                    align="center"
                    label="状态"
                    width="50px">
                    <template slot-scope="scope">
                      <span v-if="scope.row.activeStatus === '在线'" style="color:#13CE66">{{ scope.row.activeStatus }}</span>
                      <span v-else>{{ scope.row.activeStatus }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="platformName"
                    align="center"
                    label="运营商平台"
                    width="159px"
                    show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column
                    prop="owersName"
                    align="center"
                    label="企业/业户"
                    min-width="159px"
                    show-overflow-tooltip>
                  </el-table-column>
                </el-table>
              </div>
              <el-pagination small background @current-change="handlePageChange" :current-page="carQuery.page" :page-size="carQuery.limit" layout="total, prev, pager, next" :total="chooseTotal" style="margin-top: 20px">
              </el-pagination>
            </el-col>
          </el-row>
    </el-dialog>
    <!-- <footer-bar></footer-bar> -->
  </div>
</template>

<script>
import LineChart from './LineChart'
import FooterBar from '../FooterBar'
import { formatDate } from '@/utils/date.js' // 日期格式化
import { getPermsList } from '@/api/base/platform' // 获得运营商平台
import { vehiclerunSummary, summaryImage, alarmExcel } from '@/api/statistics/statistics' // Excel导出
import { vehicleList } from '@/api/base/vehicle' // 车辆信息
import { getDeptTree } from '@/api/base/company' // 机构树

const lineChartData = {
  newVisitis: {
    owersName: [],
    expectedData: [],
    actualData: []
  }
}
export default {
  name: 'VehicleMileageSummary',
  components: { LineChart, FooterBar },
  data() {
    var date = function() {
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return start
    }
    return {
      menus: [],
      carData: [],
      superviseData: '',
      chooseDialogVisible: false,
      allotLoading: false,
      chooseTotal: 0,
      defaultProps: {
        children: 'children',
        label: 'text'
      },
      carQuery: {
        page: 1,
        limit: 5,
        vehicleNo: '',
        owersId: ''
      },
      listLoading: true,
      total: 0,
      data: [], // 数据列表
      platformIdList: [], // 运营商平台
      lineChartData: lineChartData.newVisitis,
      startEnd: [date(), new Date()],
      columns: [
        {
          key: 'vehicleNo',
          title: '车牌号',
          width: '100'
        },
        {
          key: 'platformName',
          title: '运营商平台',
          width: '100'
        },
        {
          key: 'owersName',
          title: '企业/业户',
          width: '100'
        },
        {
          key: 'vehicleTypeName',
          title: '车牌类型',
          width: '100'
        },
        {
          key: 'totalTime',
          title: '行车总时长',
          width: '100'
        },
        {
          key: 'runMileageTotal',
          title: '行车总里程',
          width: '100'
        }
      ],
      listQuery: {
        page: 1,
        pageSize: 10,
        startTime: formatDate(date(), 'yyyy-MM-dd'),
        endTime: formatDate(new Date(), 'yyyy-MM-dd'),
        vehicleId: null,
        platformId: null,
        vehicleNo: null
      },
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
      }
    }
  },
  created() {
    this.getPlatformList() // 初始化运营商平台
    this.getSpeedList() // 初始化列表
    this.gettrenddiagram()
  },
  methods: {
    reset() { // 重置
      this.listQuery = {
        page: 1,
        pageSize: 10,
        startTime: null,
        endTime: null,
        vehicleId: null,
        platformId: null,
        vehicleNo: null
      }
      this.startEnd = ''
    },
    getPlatformList() { // 获取运营商平台列表
      getPermsList().then(response => {
        this.platformIdList = response.data
      })
    },
    // platformChange(val) { // 根据运营商平台获取业户列表
    //   console.log('123')
    //   console.log(val)
    //   this.listQuery.platformId = val
    //   console.log(this.listQuery.platformId)
    // },
    getSpeedList() { // 分页获取智能预警列表
      this.listLoading = true
      vehiclerunSummary(this.listQuery).then(res => {
        console.log('12')
        console.log(res)
        if (res.code === 0) {
          this.listLoading = false
          this.data = res.data.rows
          this.total = res.data.totalCount
        }
      })
    },
    gettrenddiagram() { // 里程趋势分析
      this.listLoading = true
      this.lineChartData.expectedData = []
      this.lineChartData.actualData = []
      summaryImage(this.listQuery).then(res => {
        if (res.code === 0 && res.data !== null) {
          this.listLoading = false
          res.data.forEach(item => {
            this.lineChartData.expectedData.push(item.dateTime)
            this.lineChartData.actualData.push(item.runMileage)
          })
          if (this.lineChartData.owersName.length === 0) {
            this.lineChartData.owersName = '全部'
          }
        }
      })
    },
    handleQuery() { // 查询
      console.log(this.listQuery)
      this.listQuery.page = 1
      this.listQuery.pageSize = 10
      this.lineChartData.owersName = []
      this.getSpeedList()
      this.gettrenddiagram()
    },
    handleSelect(row) { // 点击事件
      this.listQuery.vehicleId = row.id
      this.lineChartData.owersName = row.vehicleNo
      this.gettrenddiagram()
    },
    handleSizeChange(val) { // 分页
      this.listQuery.pageSize = val
      this.lineChartData.owersName = []
      this.getSpeedList()
      this.gettrenddiagram()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.lineChartData.owersName = []
      this.getSpeedList()
      this.gettrenddiagram()
    },
    alarmexport() { // Excel导出
      alarmExcel(this.listQuery).then(result => {
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
      link.setAttribute('download', '企业/业户报警汇总.xls')
      document.body.appendChild(link)
      link.click()
    },
    // 车辆选择 开始
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
    showChooseCar() {
      this.carQuery = {
        page: 1,
        limit: 5,
        vehicleNo: '',
        platformId: '',
        owersId: ''
      }
      this.listQuery.vehicleId = null
      this.listQuery.vehicleNo = null
      this.carQuery.platformId = this.listQuery.platformId
      if (this.carQuery.platformId === null || this.carQuery.platformId === '') {
        this.$message('请先选择平台')
      } else {
        this.getDept()
        this.getCarList()
        this.chooseDialogVisible = true
      }
    },
    getDept() {
      getDeptTree(this.carQuery.platformId).then(res => {
        this.menus = [res.data]
      })
    },
    deptFilter(data) {
      this.carQuery.owersId = data.id
      if (data.id === '0') {
        this.carQuery.owersId = ''
      }
      this.carQuery.page = 1
      this.getCarList()
    },
    vnFilter() {
      this.carQuery.page = 1
      this.getCarList()
    },
    handlePageChange(val) {
      this.carQuery.page = val
      this.getCarList()
    },
    chooseCar() {
      if (this.superviseData.length === 0) {
        this.$message({
          type: 'error',
          message: '请选择车辆'
        })
      } else {
        console.log(this.superviseData)
        const arr = []
        const tmp = []
        this.superviseData.forEach(item => {
          arr.push(item.id)
          tmp.push(item.vehicleNo)
        })
        this.listQuery.vehicleId = arr.join()
        this.listQuery.vehicleNo = tmp.join()
      }
      this.chooseDialogVisible = false
      console.log(this.listQuery)
    },
    handleSelectionChange(val) {
      this.superviseData = val
      console.log(this.superviseData)
    }
    // 车辆选择 结束
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

<style>
  .canClick {
    color: #5F7ABF
  }
  .app-container .el-popover {
    height: 300px;
    overflow-y: scroll;
  }
  .app-container .el-dialog__body {
    padding: 5px 20px;
  }
  .app-container .el-table__header-wrapper table thead tr th {
    background-color: #5F7ABF;
    color: #fff
  }
  .app-container .el-dialog__header {
    background-color: #5F7ABF;
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
    color: #5F7ABF;
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
