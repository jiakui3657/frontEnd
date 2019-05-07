<template>
  <div class="dashboard-editor-container">
    <!-- numbers 统计 -->
    <top-pannel></top-pannel>
    <!-- 运营商平台整体运营态势 -->
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <bar-chart :chart-data="lineChartData1"></bar-chart>
    </el-row>
    <!-- 辖区基本信息统计 -->
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <AreaBarChart :chart-data="lineChartData4"></AreaBarChart>
    </el-row>
    <!-- 主动安全报警趋势分析 -->
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData"></line-chart>
    </el-row>
    <el-row :gutter="32">
      <!-- 主动安全报警今日统计 -->
      <el-col :xs="12" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <raddar-chart :chart-data="lineChartData2"></raddar-chart>
        </div>
      </el-col>
      <!-- 主动安全报警类型分布 -->
      <el-col :xs="12" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <pie-chart :chart-data="lineChartData3"></pie-chart>
        </div>
      </el-col>
    </el-row>
    <!--<el-row :gutter="32">-->
      <!--&lt;!&ndash; 运营商排名 &ndash;&gt;-->
      <!--<el-col :xs="8" :sm="12" :lg="8">-->
        <!--<div class="chart-wrapper1">-->
          <!--<operator></operator>-->
        <!--</div>-->
      <!--</el-col>-->
      <!--&lt;!&ndash; 企业排名 &ndash;&gt;-->
      <!--<el-col :xs="8" :sm="12" :lg="8">-->
        <!--<div class="chart-wrapper1">-->
          <!--<firm></firm>-->
        <!--</div>-->
      <!--</el-col>-->
      <!--&lt;!&ndash; 驾驶员排名 &ndash;&gt;-->
      <!--<el-col :xs="8" :sm="12" :lg="8">-->
        <!--<div class="chart-wrapper1">-->
          <!--<driver></driver>-->
        <!--</div>-->
      <!--</el-col>-->
    <!--</el-row>-->
  </div>
</template>

<script>
import topPannel from './components/topPannel'
import LineChart from './components/LineChart'
import RaddarChart from './components/RaddarChart'
import PieChart from './components/PieChart'
import BarChart from './components/BarChart'
import AreaBarChart from './components/AreaBarChart'
import TodoList from './components/TodoList'
import BoxCard from './components/BoxCard'
// import operator from './components/operator'
// import firm from './components/firm'
// import driver from './components/driver'
import { entireSupervise, jursdictionSuperviseInfo, alarmingTrend, alarmHandleInfo, alarmTypeInfo } from '@/api/dashboard/dashboard'

const lineChartData = {
  newVisitis: {
    expectedData: [],
    actualData: [],
    date: []
  },
  messages: { // 运营商运营趋势数据
    name: [],
    allCar: [],
    inCar: [],
    online: [],
    user: []
  },
  info: { // 省市运营商运营趋势数据
    name: [],
    allCar: [],
    inCar: [],
    online: [],
    user: [],
    installCar: []
  },
  purchases: { // 今日统计
    rate: [],
    unDone: [],
    counts: [],
    done: [],
    alarmName: []
  },
  types: {
    alarmName: [],
    count: []
  }
}
export default {
  name: 'dashboard-admin',
  inject: ['reload'],
  components: {
    topPannel,
    LineChart,
    RaddarChart,
    PieChart,
    BarChart,
    TodoList,
    BoxCard,
    AreaBarChart
    // operator,
    // firm,
    // driver
  },
  data() {
    return {
      lineChartData: lineChartData.newVisitis,
      lineChartData1: lineChartData.messages,
      lineChartData2: lineChartData.purchases,
      lineChartData3: lineChartData.types,
      lineChartData4: lineChartData.info
    }
  },
  methods: {
    getEntireSupervise() {
      entireSupervise().then(res => {
        if (res.code === 0) {
          res.data.forEach(item => {
            this.lineChartData1.allCar.push(item.totalCount)
            this.lineChartData1.inCar.push(item.netCount)
            this.lineChartData1.online.push(item.onlineCount)
            this.lineChartData1.user.push(item.driverCount)
            this.lineChartData1.name.push(item.name)
          })
        }
      })
    },
    getEntireInfo() {
      jursdictionSuperviseInfo().then(res => {
        if (res.code === 0) {
          res.data.forEach(item => {
            // console.log(JSON.stringify(item))
            this.lineChartData4.allCar.push(item.totalCount)
            this.lineChartData4.inCar.push(item.netCount)
            this.lineChartData4.online.push(item.onlineCount)
            this.lineChartData4.user.push(item.driverCount)
            this.lineChartData4.installCar.push(item.installCount)
            this.lineChartData4.name.push(item.name)
          })
        }
      })
    },
    getAlarmingTrend() {
      alarmingTrend().then(res => {
        if (res.code === 0) {
          if (res.data.length !== 0) {
            res.data.forEach(item => {
              this.lineChartData.expectedData.push(item.num)
              this.lineChartData.actualData.push(item.hundredNum)
              this.lineChartData.date.push(item.datetime)
            })
          }
        }
      })
    },
    getAlarmHandleInfo() {
      alarmHandleInfo().then(res => {
        if (res.code === 0) {
          if (res.data.length !== 0) {
            res.data.forEach(item => {
              this.lineChartData2.rate.push(parseFloat(item.rate))
              this.lineChartData2.unDone.push(item.unDone)
              this.lineChartData2.counts.push(item.counts)
              this.lineChartData2.done.push(item.done)
              this.lineChartData2.alarmName.push(item.alarmName)
            })
          }
        }
      })
    },
    getAlarmTypeInfo() {
      alarmTypeInfo().then(res => {
        if (res.code === 0) {
          if (res.data.length !== 0) {
            res.data.forEach(item => {
              item.name = item.alarmName
              item.value = item.count
              this.lineChartData3.alarmName.push(item.name)
            })
            this.lineChartData3.count = res.data
          }
        }
      })
    },
    reset() { // 清空表单
      // 运营商运营趋势数据
      this.lineChartData1.allCar = []
      this.lineChartData1.inCar = []
      this.lineChartData1.online = []
      this.lineChartData1.user = []
      this.lineChartData1.name = []
      // 省市运营商运营趋势数据
      this.lineChartData4.allCar = []
      this.lineChartData4.inCar = []
      this.lineChartData4.online = []
      this.lineChartData4.user = []
      this.lineChartData4.installCar = []
      this.lineChartData4.name = []
      // 主动
      this.lineChartData.expectedData = []
      this.lineChartData.actualData = []
      this.lineChartData.date = []
      // 今日统计
      this.lineChartData2.rate = []
      this.lineChartData2.unDone = []
      this.lineChartData2.counts = []
      this.lineChartData2.done = []
      this.lineChartData2.alarmName = []
      // 防控报警类型
      this.lineChartData3.alarmName = []
      this.lineChartData3.count = []
    }
  },
  mounted() {
    this.intervalid = setInterval(() => { // 定时刷新页面
      // console.log('刷新数据')
      this.reload()
    }, 300000)
    this.reset()
    this.getEntireSupervise()
    this.getEntireInfo()
    this.getAlarmingTrend()
    this.getAlarmHandleInfo()
    this.getAlarmTypeInfo()
  },
  beforeDestroy() {
    clearInterval(this.intervalid)
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: #EEF3FA;
  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
  .chart-wrapper1 {
    background: #fff;
    margin-bottom: 32px;
  }
}
</style>
