<template>
  <div style="padding:10px 15px;">
    <el-form inline style="height:60px;background: #fff;padding: 12px 10px 0 20px;border-radius:5px;box-shadow: 0 0 10px #ccc">
      <el-form-item label="选择时间" style="margin-bottom: 0;">
         <el-date-picker
           style="width:135px;"
           size="mini"
           v-model.trim="listQuery.time"
           value-format="yyyy-MM"
           type="month"
           placeholder="选择时间">
         </el-date-picker>
      </el-form-item>
      <el-form-item label="运营商平台" style="margin-bottom: 0;">
        <el-select @change="platformChange(listQuery.platformId)" size="mini" v-model.trim="listQuery.platformId" placeholder="请选择运营商平台">
          <el-option
           v-for="item in platsOptions"
           :key="item.id"
           :label="item.name"
           :value="item.id">
         </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择企业/业户" style="margin-bottom: 0;">
        <el-select size="mini" multiple collapse-tags v-model="listQuery.owersId" placeholder="请选择企业/业户">
          <el-option
           v-for="item in userOptions"
           :key="item.id"
           :label="item.owersName"
           :value="item.id">
         </el-option>
        </el-select>
      </el-form-item>
      <el-form-item style="float: right;margin-bottom:0;">
        <el-button :disabled="isDisable"  @click="search" size="small" type="primary">查询</el-button>
        <el-button @click="reset" size="small" type="primary">重置</el-button>
       </el-form-item>
    </el-form>
    <p style="padding-right:20px;height:32px;line-height:32px;">
      <span>企业/业户运营综合对比分析</span>
      <el-button @click="alarmexcel" size="small" style="float:right;background: #5F7ABF; color: #fff; border-radius: 5px">导出</el-button>
    </p>
    <el-table
      border
      stripe
      :header-cell-style="{ background: '#5F7ABF', color: '#fff' }"
      :data="tableData"
      @row-click="clickedRow"
      highlight-current-row
      style="width: 100%">
      <el-table-column
        type="index"
        align="center"
        label="排名"
        width="50">
      </el-table-column>
      <el-table-column
        property="name"
        align="center"
        label="企业/业户"
        width="180">
      </el-table-column>
      <el-table-column
        property="platformname"
        align="center"
        label="运营商平台"
        width="180">
      </el-table-column>
      <el-table-column
        property="parentName"
        align="center"
        label="上级企业/业户"
        width="180">
      </el-table-column>
      <el-table-column
        property="total"
        align="center"
        label="评分">
      </el-table-column>
      <el-table-column
        property="network"
        align="center"
        label="入网车辆指数">
      </el-table-column>
      <el-table-column
        property="upLine"
        align="center"
        label="车辆上线指数">
      </el-table-column>
      <el-table-column
        property="alarm"
        align="center"
        label="报警处理指数">
      </el-table-column>
      <el-table-column
        property="violation"
        align="center"
        label="违规运营指数">
      </el-table-column>
      <el-table-column
        property="prevention"
        align="center"
        label="防控报警指数">
      </el-table-column>
    </el-table>
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" :current-page="listQuery.page" layout="total, sizes, prev, pager, next, jumper" :total="total" style="margin-top:20px;">
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
    <el-row style="margin-bottom: 15px;">
      <el-col :span="8" style="padding:0 10px 0 0;">
        <div class="chartsWrapper">
          <div class="chartsBox">
            <line-chart :chart-data="enterpriseNetTrend"></line-chart>
          </div>
        </div>
      </el-col>
      <el-col :span="8" style="padding:0 10px 0 0;">
        <div class="chartsWrapper">
          <div class="chartsBox">
            <online :chart-data="enterpriseOnlineTrend"></online>
          </div>
        </div>
      </el-col>
      <el-col :span="8" style="padding:0;">
        <div class="chartsWrapper">
          <div class="chartsBox">
            <fix-alarm :chart-data="enterpriseAlarmTrend"></fix-alarm>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row style="margin-bottom: 15px">
      <el-col :span="8" style="padding:0 10px 0 0;">
        <div class="chartsWrapper">
          <div class="chartsBox">
            <defence-alarm :chart-data="enterpriseControlTrend"></defence-alarm>
          </div>
        </div>
      </el-col>
      <el-col :span="8" style="padding:0 10px 0 0;">
        <div class="chartsWrapper">
          <div class="chartsBox">
            <defence-alarm-km :chart-data="enterpriseKmControlTrend"></defence-alarm-km>
          </div>
        </div>
      </el-col>
      <el-col :span="8" style="padding:0;">
        <div class="chartsWrapper">
          <div class="chartsBox">
            <alarm-pie-chart :chart-data="controlAlarmDistribution"></alarm-pie-chart>
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
  import { getPermsList } from '@/api/alarm/supervise'
  import { owersListByPlatform } from '@/api/base/company'
  import { formatDate, getDate, getAll } from '@/utils/date.js'
  import { tableNum, vehicleNetwork, vehicleUpLine, vehicleAlarm, violation, prevention, networkTrend, upLineTrend, alarmTrend, preventionTrend, kilometersPreventionTrend, preventionDistributed, enterpriseExcel } from '@/api/regulatory/enterprise'
  const lineChartData = {
    newVisitis: {
      // 企业入网率趋势
      owersName: [],
      expectedData: getAll(formatDate(new Date().setDate(1), 'yyyy-MM-dd'), formatDate(getDate(1), 'yyyy-MM-dd')),
      actualData: []
    },
    messages: {
      // 企业上线率趋势
      owersName: [],
      expectedData: getAll(formatDate(new Date().setDate(1), 'yyyy-MM-dd'), formatDate(getDate(1), 'yyyy-MM-dd')),
      actualData: []
    },
    purchases: {
      // 企业报警处理率趋势
      owersName: [],
      expectedData: getAll(formatDate(new Date().setDate(1), 'yyyy-MM-dd'), formatDate(getDate(1), 'yyyy-MM-dd')),
      actualData: []
    },
    shoppings: {
      // 企业报警防控趋势
      owersName: [],
      expectedData: getAll(formatDate(new Date().setDate(1), 'yyyy-MM-dd'), formatDate(getDate(1), 'yyyy-MM-dd')),
      actualData: []
    },
    kmcontroltrend: {
      // 企业百公里防控趋势
      owersName: [],
      expectedData: getAll(formatDate(new Date().setDate(1), 'yyyy-MM-dd'), formatDate(getDate(1), 'yyyy-MM-dd')),
      actualData: []
    },
    alarmdistribution: {
      // 防控报警分布
      owersName: [],
      activeControlName: [],
      activeControlNumber: []
    }
  }
  export default {
    components: { card, lineChart, online, fixAlarm, defenceAlarm, defenceAlarmKm, alarmPieChart },
    data() {
      return {
        isDisable: false,
        enterpriseNetTrend: lineChartData.newVisitis,
        enterpriseOnlineTrend: lineChartData.messages,
        enterpriseAlarmTrend: lineChartData.purchases,
        enterpriseControlTrend: lineChartData.shoppings,
        enterpriseKmControlTrend: lineChartData.kmcontroltrend,
        controlAlarmDistribution: lineChartData.alarmdistribution,
        total: 0,
        listQuery: {
          time: formatDate(new Date(), 'yyyy-MM'),
          platformId: '',
          owersId: [],
          owersIds: null,
          page: 1,
          limit: 10,
          type: 1,
          owersName: null
        },
        platsOptions: [],
        userOptions: [],
        tableData: [],
        vehicleNetwork: [],
        vehicleUpLine: [],
        vehicleAlarm: [],
        violation: [],
        prevention: []
      }
    },
    methods: {
      getPlatformList() {
        getPermsList().then(res => {
          if (res.code === 0) {
            this.platsOptions = res.data
          } else {
            console.log(res)
          }
        })
      },
      platformChange(val) { // 根据运营商平台获取业户列表
        owersListByPlatform(val).then(res => {
          this.listQuery.owersId = []
          this.userOptions = res.data
        })
      },
      getTableNum() {
        this.listQuery.owersIds = this.listQuery.owersId.toString()
        tableNum(this.listQuery).then(res => {
          if (res.code === 0 && res.data.length !== 0) {
            console.log(res)
            this.tableData = res.data.rows
            this.total = res.data.totalCount
          } else {
            this.$message('查询失败,请重新查询')
          }
        })
      },
      getVehicleNetwork() { // 车辆入网指数排名
        vehicleNetwork(this.listQuery).then(res => {
          if (res.code === 0 && res.data.length !== 0) {
            this.vehicleNetwork = res.data
          }
        })
      },
      getVehicleUpLine() { // 车辆上线指数排名
        vehicleUpLine(this.listQuery).then(res => {
          if (res.code === 0 && res.data.length !== 0) {
            this.vehicleUpLine = res.data
          }
        })
      },
      getVehicleAlarm() { // 车辆报警排名
        vehicleAlarm(this.listQuery).then(res => {
          if (res.code === 0 && res.data.length !== 0) {
            this.vehicleAlarm = res.data
          }
        })
      },
      getViolation() { // 违规排名
        violation(this.listQuery).then(res => {
          if (res.code === 0 && res.data.length !== 0) {
            this.violation = res.data
          }
        })
      },
      getPrevention() { // 防控排名
        setTimeout(() => {
          this.isDisable = false
        }, 2000)
        prevention(this.listQuery).then(res => {
          if (res.code === 0 && res.data.length !== 0) {
            this.prevention = res.data
          }
        })
      },
      getnetworkTrend() { // 企业入网率趋势
        this.enterpriseNetTrend.expectedData = []
        this.enterpriseNetTrend.actualData = []
        networkTrend(this.listQuery).then(res => {
          if (res.code === 0 && res.data.length !== 0) {
            res.data.forEach(element => {
              this.enterpriseNetTrend.expectedData.push(element.days)
              this.enterpriseNetTrend.actualData.push(element.score)
            })
            if (this.listQuery.owersIds && this.listQuery.owersName) {
              this.enterpriseNetTrend.owersName = this.listQuery.owersName
            } else {
              this.enterpriseNetTrend.owersName = '全部'
            }
          }
        })
      },
      getupLineTrend() { // 企业上线率趋势
        this.enterpriseOnlineTrend.expectedData = []
        this.enterpriseOnlineTrend.actualData = []
        upLineTrend(this.listQuery).then(res => {
          if (res.code === 0 && res.data.length !== 0) {
            res.data.forEach(element => {
              this.enterpriseOnlineTrend.expectedData.push(element.days)
              this.enterpriseOnlineTrend.actualData.push(element.score)
            })
            if (this.listQuery.owersIds && this.listQuery.owersName) {
              this.enterpriseOnlineTrend.owersName = this.listQuery.owersName
            } else {
              this.enterpriseOnlineTrend.owersName = '全部'
            }
          }
        })
      },
      getalarmTrend() { // 企业报警处理率趋势
        this.enterpriseAlarmTrend.expectedData = []
        this.enterpriseAlarmTrend.actualData = []
        alarmTrend(this.listQuery).then(res => {
          if (res.code === 0 && res.data.length !== 0) {
            res.data.forEach(element => {
              this.enterpriseAlarmTrend.expectedData.push(element.days)
              this.enterpriseAlarmTrend.actualData.push(element.score)
            })
            if (this.listQuery.owersIds && this.listQuery.owersName) {
              this.enterpriseAlarmTrend.owersName = this.listQuery.owersName
            } else {
              this.enterpriseAlarmTrend.owersName = '全部'
            }
          }
        })
      },
      getpreventionTrend() { // 企业防控趋势
        this.enterpriseControlTrend.expectedData = []
        this.enterpriseControlTrend.actualData = []
        preventionTrend(this.listQuery).then(res => {
          if (res.code === 0 && res.data.length !== 0) {
            res.data.forEach(element => {
              this.enterpriseControlTrend.expectedData.push(element.days)
              this.enterpriseControlTrend.actualData.push(element.score)
            })
            if (this.listQuery.owersIds && this.listQuery.owersName) {
              this.enterpriseControlTrend.owersName = this.listQuery.owersName
            } else {
              this.enterpriseControlTrend.owersName = '全部'
            }
          }
        })
      },
      getkilometersPreventionTrend() { // 企业百公里防控趋势
        this.enterpriseKmControlTrend.expectedData = []
        this.enterpriseKmControlTrend.actualData = []
        kilometersPreventionTrend(this.listQuery).then(res => {
          if (res.code === 0 && res.data.length !== 0) {
            res.data.forEach(element => {
              this.enterpriseKmControlTrend.expectedData.push(element.days)
              this.enterpriseKmControlTrend.actualData.push(element.score)
            })
            if (this.listQuery.owersIds && this.listQuery.owersName) {
              this.enterpriseKmControlTrend.owersName = this.listQuery.owersName
            } else {
              this.enterpriseKmControlTrend.owersName = '全部'
            }
          }
        })
      },
      getpreventionDistributed() { // 防控报警分布
        this.controlAlarmDistribution.activeControlName = []
        this.controlAlarmDistribution.activeControlNumber = []
        preventionDistributed(this.listQuery).then(res => {
          if (res.code === 0 && res.data.length !== 0) {
            res.data.forEach(element => {
              element.name = element.alarmName
              element.value = element.count
              this.controlAlarmDistribution.activeControlName.push(element.alarmName)
            })
            this.controlAlarmDistribution.activeControlNumber = res.data
            if (this.listQuery.owersIds && this.listQuery.owersName) {
              this.controlAlarmDistribution.owersName = this.listQuery.owersName
            } else {
              this.controlAlarmDistribution.owersName = '全部'
            }
          }
        })
      },
      alarmexcel() {
        enterpriseExcel(this.listQuery).then(result => {
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
        link.setAttribute('download', '车辆数据对比分析.xls')
        document.body.appendChild(link)
        link.click()
      },
      handleSizeChange(val) {
        this.listQuery.limit = val
        this.getTableNum()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getTableNum()
      },
      search() { // 查询
        if (this.listQuery.time) {
          if (this.listQuery.time.replace('-', '') > formatDate(new Date(), 'yyyyMM')) {
            this.$message('不能选择大于当前月查询')
            this.listQuery.time = formatDate(new Date(), 'yyyy-MM')
          } else {
            this.listQuery.owersName = null
            this.isDisable = true
            this.getTableNum()
            this.getVehicleNetwork()
            this.getVehicleUpLine()
            this.getVehicleAlarm()
            this.getViolation()
            this.getPrevention()
            this.getnetworkTrend()
            this.getupLineTrend()
            this.getalarmTrend()
            this.getpreventionTrend()
            this.getkilometersPreventionTrend()
            this.getpreventionDistributed()
          }
        } else {
          this.$message('请选择时间')
        }
      },
      reset() {
        this.listQuery.time = ''
        this.listQuery.platformId = ''
        this.listQuery.owersId = []
      },
      getSortTypes(value) { // 获取车辆入网指数排名 最好最坏
        if (value && value === 1) { // 最好
          this.listQuery.type = value
          if (this.listQuery.time) {
            this.getVehicleNetwork()
          } else {
            this.$message('请选择时间')
          }
        } else if (value && value === 2) { // 最差
          this.listQuery.type = value
          if (this.listQuery.time) {
            this.getVehicleNetwork()
          } else {
            this.$message('请选择时间')
          }
        }
      },
      getSortType_upline(value) { // 获取车辆上线指数排名 最好最坏
        if (value && value === 1) { // 最好
          this.listQuery.type = value
          if (this.listQuery.time) {
            this.getVehicleUpLine()
          } else {
            this.$message('请选择时间')
          }
        } else if (value && value === 2) { // 最差
          this.listQuery.type = value
          if (this.listQuery.time) {
            this.getVehicleUpLine()
          } else {
            this.$message('请选择时间')
          }
        }
      },
      getSortType_alarm(value) { // 获取车辆报警排名 最好最坏
        if (value && value === 1) { // 最好
          this.listQuery.type = value
          if (this.listQuery.time) {
            this.getVehicleAlarm()
          } else {
            this.$message('请选择时间')
          }
        } else if (value && value === 2) { // 最差
          this.listQuery.type = value
          if (this.listQuery.time) {
            this.getVehicleAlarm()
          } else {
            this.$message('请选择时间')
          }
        }
      },
      getSortType_violation(value) { // 获取违规排名 最好最坏
        if (value && value === 1) { // 最好
          this.listQuery.type = value
          if (this.listQuery.time) {
            this.getViolation()
          } else {
            this.$message('请选择时间')
          }
        } else if (value && value === 2) { // 最差
          this.listQuery.type = value
          if (this.listQuery.time) {
            this.getViolation()
          } else {
            this.$message('请选择时间')
          }
        }
      },
      getSortType_prevention(value) { // 获取防控排名 最好最坏
        if (value && value === 1) { // 最好
          this.listQuery.type = value
          if (this.listQuery.time) {
            this.getPrevention()
          } else {
            this.$message('请选择时间')
          }
        } else if (value && value === 2) { // 最差
          this.listQuery.type = value
          if (this.listQuery.time) {
            this.getPrevention()
          } else {
            this.$message('请选择时间')
          }
        }
      },
      clickedRow(row) { // 点击表格某一行
        this.listQuery.owersIds = row.id
        this.getnetworkTrend()
        this.getupLineTrend()
        this.getalarmTrend()
        this.getpreventionTrend()
        this.getkilometersPreventionTrend()
        this.getpreventionDistributed()
        this.listQuery.owersName = row.name
      }
    },
    mounted() {
      this.getPlatformList()
    }
  }
</script>

<style>
  .el-pagination.is-background .el-pager li:not(.disabled).active{
    background-color: #5F7ABF;
  }
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
