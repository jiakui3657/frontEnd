<template>
  <div style="padding:10px 15px;">
    <el-form
      inline style="height:60px;background: #fff;padding: 12px 10px 0 20px;border-radius:5px;box-shadow: 0 0 10px #ccc">
      <el-form-item label="选择日期" style="margin-bottom: 0;">
         <el-date-picker
           style="width:135px;"
           size="mini"
           format="yyyy-MM"
           value-format="yyyy-MM"
           v-model.trim="listQuery.month"
           type="month"
           placeholder="选择日期">
         </el-date-picker>
      </el-form-item>
      <el-form-item
        label="运营商平台" style="margin-bottom: 0;">
        <el-select @change="platformChange(listQuery.platformId)" v-model="listQuery.platformId" placeholder="请选择" style="width:150px;" size="mini">
          <el-option v-for="item in platformIdList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="选择企业/业户" >
        <el-select @focus="owersIdClick(listQuery.platformId)" v-model="listQuery.owersId" placeholder="请选择" style="width:150px;" size="small"  multiple collapse-tags>
            <el-option v-for="item in owersList" :key="item.id" :label="item.owersName" :value="item.id"></el-option>
        </el-select>
      </el-form-item> -->
      <!-- <el-form-item >
        <window-bar ref="getDriver" @getDriverName="getDriverName"></window-bar>
      </el-form-item> -->
       <window-bar ref="DriverName"  :platformId="listQuery.platformId" @getDriverName="getDriverName"></window-bar>
      <el-form-item style="float: right;margin-bottom:0;">
        <el-button :disabled="isDisable" size="small" type="primary" @click="handleQuery">查询</el-button>
        <el-button size="small" type="primary" @click="handleReset">重置</el-button>
       </el-form-item>
    </el-form>
    <p style="padding-right:20px;height:32px;line-height:32px;">
      <span>驾驶员行为综合对比分析</span>
      <el-button @click="alarmexport" size="small" style="float:right;background: #5F7ABF; color: #fff; border-radius: 5px">导出</el-button>
    </p>
    <el-table
      border
      stripe
      :header-cell-style="{ background: '#5F7ABF', color: '#fff' }"
      :data="driverTableData"
      highlight-current-row
      style="width: 100%">
      <el-table-column
        type="index"
        align="center"
        label="排名"
        width="80">
      </el-table-column>
      <el-table-column
        property="driverName"
        align="center"
        label="驾驶员"
        min-width="120">
      </el-table-column>
      <el-table-column
        property="juniorName"
        align="center"
        label="运营商平台"
        min-width="120">
      </el-table-column>
      <el-table-column
        property="owersName"
        align="center"
        min-width="120"
        label="企业/业户">
      </el-table-column>
      <el-table-column
        min-width="120"
        property="alarmNum"
        align="center"
        label="总报警数">
      </el-table-column>
      <el-table-column
        min-width="120"
        property="mileage"
        align="center"
        label="总里程数">
      </el-table-column>
      <el-table-column
        min-width="120"
        property="score"
        align="center"
        label="评分">
      </el-table-column>
      <el-table-column
        align="center"
        label="疲劳驾驶报警">
        <el-table-column
          min-width="150"
          property="tiredOne"
          align="center"
          label="一级报警( 百公里 )">
        </el-table-column>
        <el-table-column
          min-width="150"
          property="tiredTwo"
          align="center"
          label="二级报警( 百公里 )">
        </el-table-column>
      </el-table-column>
      <el-table-column
        align="center"
        label="分神驾驶报警">
        <el-table-column
          property="diverOne"
          align="center"
          min-width="150"
          label="一级报警( 百公里 )">
        </el-table-column>
        <el-table-column
          property="diverTwo"
          align="center"
          min-width="150"
          label="二级报警( 百公里 )">
        </el-table-column>
      </el-table-column>
      <el-table-column
        align="center"
        label="抽烟驾驶报警">
        <el-table-column
          property="smokeOne"
          align="center"
          min-width="150"
          label="一级报警( 百公里 )">
        </el-table-column>
        <el-table-column
          property="smokeTwo"
          align="center"
          min-width="150"
          label="二级报警( 百公里 )">
        </el-table-column>
      </el-table-column>
      <el-table-column
        align="center"
        label="接打电话报警">
        <el-table-column
          property="phoneOne"
          align="center"
          min-width="150"
          label="一级报警( 百公里 )">
        </el-table-column>
        <el-table-column
          property="phoneTwo"
          align="center"
          min-width="150"
          label="二级报警( 百公里 )">
        </el-table-column>
      </el-table-column>
      <el-table-column
        align="center"
        label="驾驶员异常报警">
        <el-table-column
          property="abnormalOne"
          align="center"
          min-width="150"
          label="一级报警( 百公里 )">
        </el-table-column>
        <el-table-column
          property="abnormalTwo"
          align="center"
          min-width="150"
          label="二级报警( 百公里 )">
        </el-table-column>
      </el-table-column>
      <el-table-column
      align="center"
      label="车道偏移报警">
      <el-table-column
        property="deviationOne"
        align="center"
        min-width="150"
        label="一级报警( 百公里 )">
      </el-table-column>
      <el-table-column
        property="deviationTwo"
        align="center"
        min-width="150"
        label="二级报警( 百公里 )">
      </el-table-column>
    </el-table-column>
      <el-table-column
        align="center"
        label="前向碰撞报警">
        <el-table-column
          property="crashOne"
          align="center"
          min-width="150"
          label="一级报警( 百公里 )">
        </el-table-column>
        <el-table-column
          property="crashTwo"
          align="center"
          min-width="150"
          label="二级报警( 百公里 )">
        </el-table-column>
      </el-table-column>
      <el-table-column
        align="center"
        label="车距过近报警">
        <el-table-column
          property="tooCloseOne"
          align="center"
          min-width="150"
          label="一级报警( 百公里 )">
        </el-table-column>
        <el-table-column
          property="tooCloseTwo"
          align="center"
          min-width="150"
          label="二级报警( 百公里 )">
        </el-table-column>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-sizes="[10,20,30, 50]"
      :page-size="listQuery.limit"
      :total="total"
      :current-page="listQuery.page"
      layout="total, sizes, prev, pager, next, jumper"
      style="margin-top:10px;">
    </el-pagination>
    <card
      :vehicleNetwork="vehicleNetwork"
      :vehicleUpLine="vehicleUpLine"
      :vehicleAlarm="vehicleAlarm"
      :violation="violation"
      :prevention="prevention"
      @sortType="getSortTypes"
      @sortType_upline="getSortType_upline"
      @sortType_alarm="getSortType_alarm"
      @sortType_violation="getSortType_violation"
      @sortType_prevention="getSortType_prevention">
    </card>
    <el-row style="margin:15px 0;">
      <el-col :span="8" style="padding:0 10px 0 0;">
        <div class="chartsWrapper">
          <div class="chartsBox">
            <defence-alarm :chart-data="lineChartData1"></defence-alarm>
          </div>
        </div>
      </el-col>
      <el-col :span="8" style="padding:0 10px 0 0;">
        <div class="chartsWrapper">
          <div class="chartsBox">
            <defence-alarm-km :chart-data="lineChartData2"></defence-alarm-km>
          </div>
        </div>
      </el-col>
      <el-col :span="8" style="padding:0;">
        <div class="chartsWrapper">
          <div class="chartsBox">
            <alarm-pie-chart :chart-data="lineChartData3"></alarm-pie-chart>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import card from './card'
  import lineChart from './components/lineChart'
  import online from './components/online'
  import fixAlarm from './components/fixAlarm'
  import defenceAlarm from './components/defenceAlarm'
  import defenceAlarmKm from './components/defenceAlarmKm'
  import alarmPieChart from './components/alarmPieChart'
  import WindowBar from './components/WindowBar'
  import { getTableData, getAlarmTrend, getAlarmHundred, getAlarmType, driverExcel, getIndexRank } from '@/api/regulatory/driver'
  import { getPermsList } from '@/api/alarm/supervise'
  import { owersListByPlatform } from '@/api/base/company'
  import { formatDate } from '@/utils/date.js'
  const lineChartData = {
    newVisitis: {
      expectedData: [],
      actualData: []
    },
    messages: {
      expectedData: [],
      actualData: []
    },
    purchases: {
      alarmName: [],
      count: []
    }
  }
  export default {
    components: { card, lineChart, online, fixAlarm, defenceAlarm, defenceAlarmKm, alarmPieChart, WindowBar },
    data() {
      return {
        isDisable: false,
        total: 10, // 默认数据总数
        pageSize: 10, // 每页的数据条数
        currPage: 1, // 默认开始页面
        driverTableData: [], // 表格数据
        platformIdList: [], // 运营商平台下拉框
        owersList: [], // 选择企业/业户
        lineChartData1: lineChartData.newVisitis,
        lineChartData2: lineChartData.messages,
        lineChartData3: lineChartData.purchases,
        // 表格请求参数列表
        listQuery: {
          month: formatDate(new Date(), 'yyyy-MM'),
          platformId: '',
          owersId: [],
          owerId: null,
          page: 1,
          limit: 10,
          driverName: '',
          licence: null,
          type: null,
          rankType: null
        },
        // 业户请求参数
        platformIdQuery: [],
        // 弹窗驾驶员名称
        dialogDriverName: '',
        vehicleNetwork: [], // 疲劳指数排名
        vehicleUpLine: [], // 专注指数排名
        vehicleAlarm: [], // 警惕指数排名
        violation: [], // 操控指数排名
        prevention: [] // 平稳指数排名
      }
    },
    methods: {
      // 获取驾驶员名称
      getDriverName(res) {
        // this.listQuery.driverName = res.driverName
        // this.listQuery.licence = res.licence
        console.log(res)
        this.listQuery.licence = res
      },
      // 驾驶员报警趋势
      getAlarmTrend() {
        this.lineChartData1.expectedData = []
        this.lineChartData1.actualData = []
        getAlarmTrend(this.listQuery).then(res => {
          if (res.code === 0 && res.data.length !== 0) {
            res.data.forEach(item => {
              this.lineChartData1.expectedData.push(item.date)
              this.lineChartData1.actualData.push(item.count)
            })
          } else {
            this.$message('查询失败,请重新查询！')
          }
        })
      },
      // 驾驶员百公里报警趋势
      getAlarmHundred() {
        this.lineChartData2.expectedData = []
        this.lineChartData2.actualData = []
        getAlarmHundred(this.listQuery).then(res => {
          if (res.code === 0 && res.data.length !== 0) {
            res.data.forEach(item => {
              this.lineChartData2.expectedData.push(item.date)
              this.lineChartData2.actualData.push(item.count)
            })
          } else {
            this.$message('查询失败,请重新查询！')
          }
        })
      },
      // 防控报警类型分布
      getAlarmType() {
        this.lineChartData3.alarmName = []
        this.lineChartData3.count = []
        getAlarmType(this.listQuery).then(res => {
          if (res.code === 0 && res.data.length !== 0) {
            res.data.forEach(item => {
              item.name = item.alarmName
              item.value = item.count
              this.lineChartData3.alarmName.push(item.name)
            })
            this.lineChartData3.count = res.data
          } else {
            this.$message('查询失败,请重新查询！')
          }
        })
      },
      // 头部查询
      handleQuery() {
        if (this.listQuery.month) {
          this.isDisable = true
          this.listQuery.page = 1
          this.listQuery.limit = 10
          this.getTableData()
          this.getAlarmTrend()
          this.getAlarmHundred()
          this.getAlarmType()
          // 疲劳指数排名
          this.getTiredIndexRank()
          // 专注指数排名
          this.getTiredIndexRank1()
          // 警惕指数排名
          this.getTiredIndexRank2()
          // 操控指数排名
          this.getTiredIndexRank3()
          // 平稳指数排名请求参数
          this.getTiredIndexRank4()
        } else {
          this.$message('请选择查询条件')
        }
      },
      // 头部重置
      handleReset() {
        this.listQuery.month = ''
        this.listQuery.platformId = ''
        this.listQuery.owersId = []
        this.listQuery.driverName = ''
        this.listQuery.licence = ''
        this.$refs.getDriver.driverName = ''
      },
      getPlatformList() { // 获取运营商平台列表
        getPermsList().then(response => {
          this.platformIdList = response.data
        })
      },
      platformChange(val) { // 根据运营商平台获取业户列表
        this.listQuery.platformId = val
        console.log(this.listQuery.platformId)
        // owersListByPlatform(val).then(response => {
        //   this.listQuery.owersId = []
        //   this.owersList = response.data
        // })
      },
      // 运营商平台
      getPermsList() {
        getPermsList().then(res => {
          if (res.code === 0 && res.data.length !== 0) {
            this.platformIdList = res.data
          } else {
            this.$message('查询失败,请重新查询！')
          }
        })
      },
      // 业户
      owersListByPlatform() {
        owersListByPlatform(this.platformIdQuery).then(res => {
          if (res.code === 0 && res.data.length !== 0) {
            this.platformId = res.data
          } else {
            this.$message('查询失败,请重新查询！')
          }
        })
      },
      // 获取驾驶员分析
      getTableData() {
        this.listQuery.owerId = this.listQuery.owersId.toString()
        getTableData(this.listQuery).then(res => {
          this.driverTableData = res.data.rows
          this.total = res.data.totalCount
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
      // 监听每页显示数据条数
      handleSizeChange(val) {
        this.listQuery.limit = val
        this.getTableData()
      },
      // 监听切换页面数据变化
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getTableData()
      },
      alarmexport() {
        driverExcel(this.listQuery).then(result => {
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
        link.setAttribute('download', '驾驶员行为评价.xls')
        document.body.appendChild(link)
        link.click()
      },
      getTiredIndexRank() {
        if (this.listQuery.rankType !== 1) {
          this.listQuery.type = 2
          this.listQuery.rankType = 1
          this.vehicleNetwork = []
        }
        getIndexRank(this.listQuery).then(res => {
          if (res.code === 0) {
            this.vehicleNetwork = res.data
          } else {
            this.$message.info('查询失败,请重新查询！')
          }
        })
      },
      getTiredIndexRank1() {
        if (this.listQuery.rankType !== 2) {
          this.listQuery.type = 2
          this.listQuery.rankType = 2
          this.vehicleUpLine = []
        }
        getIndexRank(this.listQuery).then(res => {
          if (res.code === 0) {
            this.vehicleUpLine = res.data
          } else {
            this.$message.info('查询失败,请重新查询！')
          }
        })
      },
      getTiredIndexRank2() {
        if (this.listQuery.rankType !== 3) {
          this.listQuery.type = 2
          this.listQuery.rankType = 3
          this.vehicleAlarm = []
        }
        getIndexRank(this.listQuery).then(res => {
          if (res.code === 0) {
            this.vehicleAlarm = res.data
          } else {
            this.$message.info('查询失败,请重新查询！')
          }
        })
      },
      getTiredIndexRank3() {
        if (this.listQuery.rankType !== 4) {
          this.listQuery.type = 2
          this.listQuery.rankType = 4
          this.violation = []
        }
        getIndexRank(this.listQuery).then(res => {
          if (res.code === 0) {
            this.violation = res.data
          } else {
            this.$message.info('查询失败,请重新查询！')
          }
        })
      },
      getTiredIndexRank4() {
        setTimeout(() => {
          this.isDisable = false
        }, 2000)
        if (this.listQuery.rankType !== 5) {
          this.listQuery.type = 2
          this.listQuery.rankType = 5
        }
        getIndexRank(this.listQuery).then(res => {
          if (res.code === 0) {
            this.prevention = res.data
          } else {
            this.$message.info('查询失败,请重新查询！')
          }
        })
      },
      getSortTypes(value) { // 疲劳指数排名 最好最坏
        this.listQuery.rankType = 1
        if (value && value === 2) { // 最好
          this.listQuery.type = value
          if (this.listQuery.month) {
            this.getTiredIndexRank()
          } else {
            this.$message('请选择查询条件')
          }
        } else if (value && value === 1) { // 最差
          this.listQuery.type = value
          if (this.listQuery.month) {
            this.getTiredIndexRank()
          } else {
            this.$message('请选择查询条件')
          }
        }
      },
      getSortType_upline(value) { // 专注指数排名 最好最坏
        this.listQuery.rankType = 2
        if (value && value === 2) { // 最好
          this.listQuery.type = value
          if (this.listQuery.month) {
            this.getTiredIndexRank1()
          } else {
            this.$message('请选择查询条件')
          }
        } else if (value && value === 1) { // 最差
          this.listQuery.type = value
          if (this.listQuery.month) {
            this.getTiredIndexRank1()
          } else {
            this.$message('请选择查询条件')
          }
        }
      },
      getSortType_alarm(value) { // 警惕指数排名 最好最坏
        this.listQuery.rankType = 3
        if (value && value === 2) { // 最好
          this.listQuery.type = value
          if (this.listQuery.month) {
            this.getTiredIndexRank2()
          } else {
            this.$message('请选择查询条件')
          }
        } else if (value && value === 1) { // 最差
          this.listQuery.type = value
          if (this.listQuery.month) {
            this.getTiredIndexRank2()
          } else {
            this.$message('请选择查询条件')
          }
        }
      },
      getSortType_violation(value) { //  操控指数排名 最好最坏
        this.listQuery.rankType = 4
        if (value && value === 2) { // 最好
          this.listQuery.type = value
          if (this.listQuery.month) {
            this.getTiredIndexRank3()
          } else {
            this.$message('请选择查询条件')
          }
        } else if (value && value === 1) { // 最差
          this.listQuery.type = value
          if (this.listQuery.month) {
            this.getTiredIndexRank3()
          } else {
            this.$message('请选择查询条件')
          }
        }
      },
      getSortType_prevention(value) { // 平稳指数排名 最好最坏
        this.listQuery.rankType = 5
        if (value && value === 2) { // 最好
          this.listQuery.type = value
          if (this.listQuery.month) {
            this.getTiredIndexRank4()
          } else {
            this.$message('请选择查询条件')
          }
        } else if (value && value === 1) { // 最差
          this.listQuery.type = value
          if (this.listQuery.month) {
            this.getTiredIndexRank4()
          } else {
            this.$message('请选择查询条件')
          }
        }
      }
    },
    created() {
      this.getPermsList()
      // this.getTableData()
      // this.getAlarmTrend()
      // this.getAlarmHundred()
      // this.getAlarmType()
      // // 疲劳指数排名
      // this.getTiredIndexRank()
      // // 专注指数排名
      // this.getTiredIndexRank1()
      // // 警惕指数排名
      // this.getTiredIndexRank2()
      // // 操控指数排名
      // this.getTiredIndexRank3()
      // // 平稳指数排名请求参数
      // this.getTiredIndexRank4()
    }
  }
</script>

<style scoped>
  .chartsWrapper {
    background:#fff;
  }
  .chartsWrapper .chartsBox {
    padding: 16px 16px 0;
    box-shadow: 0 0 10px #ccc;
  }
  .el-button--primary {
    color: #fff;
    background-color: #5F7ABF;
    border-color: #5F7ABF;
  }
</style>
