<template>
    <div class="app-container">
          <el-container>
        <el-form ref="form" :model="listQuery" label-width="70px" inline style="background: #fff; margin: 0 20px; padding: 13px 10px 0 20px; border-radius: 5px; box-shadow: 0 0 10px #ccc">
          <el-form-item label="运营商平台">
            <el-select  @change="platformChange(listQuery.platformId)" v-model="listQuery.platformId" placeholder="请选择" style="width:120px;" size="small" clearable  filterable>
              <el-option v-for="item in platformIdList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <!--弹窗触发 选择车辆-->
          <window-bar  ref="DriverName"  :platformId="listQuery.platformId" @getDriverName="getDriverName" ></window-bar>
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
          :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </el-footer>
    </el-container>
    <!-- <footer-bar></footer-bar> -->
    </div>
</template>

<script>
import WindowBar from '../WindowBar'
import LineChart from './LineChart'
import FooterBar from '../FooterBar'
import { formatDate } from '@/utils/date.js' // 日期格式化
import { getPermsList } from '@/api/base/platform' // 获得运营商平台
import { driverMileage, totalMileage } from '@/api/statisticalAnalysis/driver' // Excel导出
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
  components: { LineChart, FooterBar, WindowBar },
  data() {
    var date = function() {
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return start
    }
    return {
      menus: [],
      carData: [],
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
          key: 'driverName',
          title: '司机名称',
          width: '100'
        },
        {
          key: 'platfromName',
          title: '运营商平台',
          width: '100'
        },
        {
          key: 'owersName',
          title: '企业/业户',
          width: '100'
        },
        {
          key: 'totalLength',
          title: '行驶总时长',
          width: '100'
        },
        {
          key: 'totalMileage',
          title: '行车总里程',
          width: '100'
        }
      ],
      listQuery: {
        page: 1,
        limit: 10,
        startTime: formatDate(date(), 'yyyy-MM-dd'),
        endTime: formatDate(new Date(), 'yyyy-MM-dd'),
        driverId: null,
        platformId: null
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
    this.gettotalMileage()
  },
  methods: {
    getDriverName(row) {
      this.listQuery.driverId = row
    },
    reset() { // 重置
      this.listQuery = {
        page: 1,
        limit: 10,
        startTime: null,
        endTime: null,
        driverId: null,
        platformId: null
      }
      this.startEnd = ''
      this.$refs.DriverName.driverName = ''
    },
    getPlatformList() { // 获取运营商平台列表
      getPermsList().then(response => {
        this.platformIdList = response.data
      })
    },
    platformChange(val) { // 根据运营商平台获取业户列表
      this.listQuery.platformId = val
      console.log(this.listQuery.platformId)
    },
    getSpeedList() { // 分页获取智能预警列表
      this.listLoading = true
      driverMileage(this.listQuery).then(res => {
        if (res.code === 0) {
          this.listLoading = false
          this.data = res.data.rows
          this.total = res.data.totalCount
        }
      })
    },
    gettotalMileage() { // 分页获取智能预警列表
      this.listLoading = true
      this.lineChartData.expectedData = []
      this.lineChartData.actualData = []
      totalMileage(this.listQuery).then(res => {
        if (res.code === 0) {
          this.listLoading = false
          res.data.forEach(item => {
            this.lineChartData.expectedData.push(item.statDate)
            this.lineChartData.actualData.push(item.total)
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
      this.listQuery.limit = 10
      this.getSpeedList()
      this.gettotalMileage()
    },
    handleSelect(rows) { // 点击事件
      console.log(rows)
      this.lineChartData.owersName = rows.driverName
      this.listQuery.driverId = rows.driverId
      this.gettotalMileage()
    },
    handleSizeChange(val) { // 分页
      this.listQuery.limit = val
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
    },
    // alarmexport() { // Excel导出
    //   alarmExcel(this.listQuery).then(result => {
    //     this.downloads(result)
    //   }).catch((result) => {
    //     this.downloads(result)
    //   })
    // },
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
      this.carQuery.platformId = this.listQuery.platformId
      if (this.carQuery.platformId === null) {
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
    chooseCar(row) {
      this.chooseDialogVisible = false
      console.log(row.vehicleNo)
      this.listQuery.vehicleNo = row.vehicleNo
      this.listQuery.vehicleId = row.id
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

<style  scoped>
  .app-container .el-dialog__header {
    background-color: #4077BC;
    height: 40px;
    padding-top: 10px;
  }
  .mil-trend{
    border-radius: 5px;
    box-shadow: 0 0 10px #ccc;
    height: 400px;
    padding: 20px 30px 20px 30px;
    margin: 0px 20px
  }
</style>
