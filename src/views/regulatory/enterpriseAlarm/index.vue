<template>
  <div style="padding:10px 15px;">
    <el-form inline style="height:60px;background: #fff;padding: 12px 10px 0 20px;border-radius:5px;box-shadow: 0 0 10px #ccc">
      <el-button-group>
        <el-button v-if="queryDate" class="querycolor" type="" size="small" @click="dateQuery">日</el-button>
        <el-button v-else type="" size="small" @click="dateQuery">日</el-button>
        <el-button v-if="queryMonth" class="querycolor" size="small" @click="monthQuery">月</el-button>
        <el-button v-else  type="" size="small" @click="monthQuery">月</el-button>
        <!--<el-button type="" size="small" >季</el-button>-->
        <el-button v-if="queryYear" class="querycolor" type="" size="small" @click="yearQuery">年</el-button>
        <el-button v-else type="" size="small" @click="yearQuery">年</el-button>
      </el-button-group>
      <el-form-item v-show="queryDate" label="查询时间">
        <el-date-picker
          v-model.trim="startEnd"
          type="daterange"
          :picker-options="pickerOptions"
          range-separator="——"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="left"
          size="small"
          style="width: 230px"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-form-item>
      <el-form-item v-show="queryMonth" label="查询时间">
        <el-date-picker
          size="mini"
          style="width:175px;"
          v-model.trim="listQuery.startTime"
          value-format="yyyy-MM"
          type="month">
        </el-date-picker>
        <el-date-picker
          size="mini"
          style="width:175px;"
          v-model.trim="listQuery.endTime"
          value-format="yyyy-MM"
          type="month">
        </el-date-picker>
      </el-form-item>
      <el-form-item v-show="queryYear" label="查询时间">
        <el-date-picker
          size="mini"
          style="width:175px;"
          v-model.trim="listQuery.startTime"
          value-format="yyyy"
          :picker-options="pickerOptions0"
          type="year">
        </el-date-picker>
        <el-date-picker
          size="mini"
          style="width:175px;"
          v-model.trim="listQuery.endTime"
          value-format="yyyy"
          :picker-options="pickerOptions0"
          type="year">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="运营商平台">
        <el-select  @change="platformChange(listQuery.platformId)" v-model="listQuery.platformId" placeholder="请选择" style="width:150px;" size="small" clearable  filterable>
          <el-option v-for="item in platformIdList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择企业/业户">
        <el-select @focus="owersIdsClick(listQuery.platformId)" v-model="listQuery.owersIds" placeholder="请选择" style="width:150px;" size="small"  multiple collapse-tags  clearable>
            <el-option v-for="item in owersList" :key="item.id" :label="item.owersName" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item style="margin-bottom:0;">
        <el-button :disabled="isDisable"  @click="handleQuery" size="small" type="primary">查询</el-button>
        <el-button @click="reset" size="small" type="primary">重置</el-button>
       </el-form-item>
    </el-form>
    <p style="padding-right:20px;height:32px;line-height:32px;">
      <span>企业/业户报警处理汇总</span>
      <el-button @click="alarmexport" size="small" style="float:right;background: #5F7ABF; color: #fff; border-radius: 5px">导出</el-button>
    </p>
    <el-table
      border
      @row-click="clickedRow"
      stripe
      :header-cell-style="{ background: '#5F7ABF', color: '#fff' }"
      :data="tableData"
      highlight-current-row
      style="width: 100%">
      <el-table-column
        fixed="left"
        type="index"
        align="center"
        label="序号"
        width="50">
      </el-table-column>
      <el-table-column
        fixed="left"
        property="owersName"
        align="center"
        label="企业/业户"
        show-overflow-tooltip
        width="180">
      </el-table-column>
      <el-table-column
        fixed="left"
        property="platformName"
        align="center"
        label="运营商平台"
        show-overflow-tooltip
        width="180">
      </el-table-column>
      <el-table-column
        fixed="left"
        property="parentName"
        align="center"
        label="上级企业/业户"
        show-overflow-tooltip
        width="180">
      </el-table-column>
      <el-table-column
        fixed="left"
        property="alarmNumber"
        align="center"
        label="报警总数">
      </el-table-column>
      <el-table-column
        fixed="left"
        property="alarmProcessed"
        align="center"
        label="已处理">
      </el-table-column>
      <el-table-column
        fixed="left"
        property="alarmNotProcessed"
        align="center"
        label="未处理">
      </el-table-column>
      <el-table-column
        fixed="left"
        property="avgProcessedTime"
        align="center"
        label="平均处理耗时">
      </el-table-column>
       <el-table-column
        align="center"
        label="超速报警">
        <el-table-column
          property="alarmNumber8"
          align="center"
          label="发生次数">
        </el-table-column>
        <el-table-column
          property="alarmHand8"
          align="center"
          label="已处理">
        </el-table-column>
      </el-table-column>
      <el-table-column
        align="center"
        label="超时疲劳驾驶报警">
        <el-table-column
          property="alarmNumber10"
          align="center"
          label="发生次数">
        </el-table-column>
        <el-table-column
          property="alarmHand10"
          align="center"
          label="已处理">
        </el-table-column>
      </el-table-column>
      <el-table-column
        align="center"
        label="紧急报警">
        <el-table-column
          property="alarmNumber11"
          align="center"
          label="发生次数">
        </el-table-column>
        <el-table-column
          property="alarmHand11"
          align="center"
          label="已处理">
        </el-table-column>
      </el-table-column>
      <el-table-column
        align="center"
        label="超时驾驶报警">
        <el-table-column
          property="alarmNumber9"
          align="center"
          label="发生次数">
        </el-table-column>
        <el-table-column
          property="alarmHand9"
          align="center"
          label="已处理">
        </el-table-column>
      </el-table-column>
      <el-table-column
        align="center"
        label="前向碰撞报警">
        <el-table-column
          property="alarmNumber0"
          align="center"
          label="发生次数">
        </el-table-column>
        <el-table-column
          property="alarmHand0"
          align="center"
          label="已处理">
        </el-table-column>
      </el-table-column>
      <el-table-column
        align="center"
        label="车道偏离报警">
        <el-table-column
          property="alarmNumber1"
          align="center"
          label="发生次数">
        </el-table-column>
        <el-table-column
          property="alarmHand1"
          align="center"
          label="已处理">
        </el-table-column>
      </el-table-column>
       <el-table-column
        align="center"
        label="车距过近报警">
        <el-table-column
          property="alarmNumber2"
          align="center"
          label="发生次数">
        </el-table-column>
        <el-table-column
          property="alarmHand2"
          align="center"
          label="已处理">
        </el-table-column>
      </el-table-column>
       <el-table-column
        align="center"
        label="疲劳驾驶报警">
        <el-table-column
          property="alarmNumber3"
          align="center"
          label="发生次数">
        </el-table-column>
        <el-table-column
          property="alarmHand3"
          align="center"
          label="已处理">
        </el-table-column>
      </el-table-column>
       <el-table-column
        align="center"
        label="接打电话报警">
        <el-table-column
          property="alarmNumber4"
          align="center"
          label="发生次数">
        </el-table-column>
        <el-table-column
          property="alarmHand4"
          align="center"
          label="已处理">
        </el-table-column>
      </el-table-column>
      <el-table-column
        align="center"
        label="抽烟报警">
        <el-table-column
          property="alarmNumber5"
          align="center"
          label="发生次数">
        </el-table-column>
        <el-table-column
          property="alarmHand5"
          align="center"
          label="已处理">
        </el-table-column>
      </el-table-column>
      <el-table-column
        align="center"
        label="分神驾驶报警">
        <el-table-column
          property="alarmNumber6"
          align="center"
          label="发生次数">
        </el-table-column>
        <el-table-column
          property="alarmHand6"
          align="center"
          label="已处理">
        </el-table-column>
      </el-table-column>
       <el-table-column
        align="center"
        label="驾驶人异常报警">
        <el-table-column
          property="alarmNumber7"
          align="center"
          label="发生次数">
        </el-table-column>
        <el-table-column
          property="alarmHand7"
          align="center"
          label="已处理">
        </el-table-column>
      </el-table-column>
    </el-table>
    <!-- 分页区 -->
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page"
      :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" style="margin-top: 20px">
    </el-pagination>
    <el-row style="margin:15px 0;">
      <el-col :span="14" style="padding:0 10px 0 0;">
        <div class="chartsWrapper">
          <div class="chartsBox">
            <lines-charts :control-data="controlTrend"></lines-charts>
          </div>
        </div>
      </el-col>
      <el-col :span="10" style="padding:0 10px 0 0;">
        <div class="chartsWrapper">
          <div class="chartsBox">
            <alarm-pie-chart :control-data="controlDistribution"></alarm-pie-chart>
          </div>
        </div>
      </el-col>
    </el-row>
    <!-- <el-row style="margin:15px 0;">
      <el-col :span="14" style="padding:0 10px 0 0;">
        <div class="chartsWrapper">
          <div class="chartsBox">
            <accident-alarm :accident-data="accidentTrend"></accident-alarm>
          </div>
        </div>
      </el-col>
      <el-col :span="10" style="padding:0 10px 0 0;">
        <div class="chartsWrapper">
          <div class="chartsBox">
            <accident-pie :accident-data="accidentDistribution"></accident-pie>
          </div>
        </div>
      </el-col>
    </el-row> -->
    <el-row style="margin:15px 0;">
      <el-col :span="14" style="padding:0 10px 0 0;">
        <div class="chartsWrapper">
          <div class="chartsBox">
            <violation-alarm :violation-data="violationTrend"></violation-alarm>
          </div>
        </div>
      </el-col>
      <el-col :span="10" style="padding:0 10px 0 0;">
        <div class="chartsWrapper">
          <div class="chartsBox">
            <violation-pie :violation-data="violationDistribution"></violation-pie>
          </div>
        </div>
      </el-col>
    </el-row>
    <!-- <el-row style="margin:15px 0;">
      <el-col :span="14" style="padding:0 10px 0 0;">
        <div class="chartsWrapper">
          <div class="chartsBox">
            <bad-alarm :fault-data="faultTrend"></bad-alarm>
          </div>
        </div>
      </el-col>
      <el-col :span="10" style="padding:0 10px 0 0;">
        <div class="chartsWrapper">
          <div class="chartsBox">
            <bad-pie :fault-data="faultDistribution"></bad-pie>
          </div>
        </div>
      </el-col>
    </el-row> -->
  </div>
</template>

<script>
  import linesCharts from './components/linesCharts'
  import alarmPieChart from './components/alarmPieChart'
  import accidentAlarm from './components/accidentAlarm'
  import accidentPie from './components/accidentPie'
  import violationAlarm from './components/violationAlarm'
  import violationPie from './components/violationPie'
  import badAlarm from './components/badAlarm'
  import badPie from './components/badPie'
  import { getPermsList } from '@/api/base/platform'
  import { owersListByPlatform } from '@/api/base/company'
  import { enterpriseAlarm, enterpriseAlarmeexcel, enterpriseAlarmdetails, enterpriseAlarmType } from '@/api/regulatory/enterpriseralarm'
  import { formatDate, addMonth, getDate, getAll } from '@/utils/date.js'

  const lineChartData = {
    newVisitis: {
      // 主动防控报警
      owersName: ['全部'],
      platformDate: getAll(formatDate(getDate(7), 'yyyy-MM-dd'), formatDate(getDate(1), 'yyyy-MM-dd')), // 日期
      activeAlarmChart: [], // 发生次数
      activeAlarmProcessedChart: [], // 已处理
      oneActiveAlarmRateChart: [], // 一级处理率
      twoActiveAlarmRateChart: [] // 二级处理率
    },
    messages: {
      // 事故报警
      owersName: ['全部'],
      platformDate: getAll(formatDate(getDate(7), 'yyyy-MM-dd'), formatDate(getDate(1), 'yyyy-MM-dd')), // 日期
      accidentAlarmChart: [], // 发生次数
      accidentAlarmProcessedChart: [], // 已处理
      accidentAlarmRateChart: [] // 处理率
    },
    purchases: {
      // 违规报警
      owersName: ['全部'],
      platformDate: getAll(formatDate(getDate(7), 'yyyy-MM-dd'), formatDate(getDate(1), 'yyyy-MM-dd')), // 日期
      violationAlarmChart: [], // 发生次数
      violationAlarmProcessedChart: [], // 已处理
      violationAlarmRateChart: [] // 处理率
    },
    shoppings: {
      // 故障报警
      owersName: ['全部'],
      platformDate: getAll(formatDate(getDate(7), 'yyyy-MM-dd'), formatDate(getDate(1), 'yyyy-MM-dd')), // 日期
      faultAlarmChart: [], // 发生次数
      faultAlarmProcessedChart: [], // 已处理
      faultAlarmRateChart: [] // 处理率
    },
    controlDistribution: {
      // 防控报警类型分布
      owersName: ['全部'],
      activeControlName: [],
      activeControlNumber: []
    },
    accidentDistribution: {
      // 事故报警类型分布
      owersName: ['全部'],
      accidentName: [],
      accidentNumber: []
    },
    violationDistribution: {
      // 违规报警类型分布
      owersName: ['全部'],
      violationName: [],
      violationNumber: []
    },
    faultDistribution: {
      // 故障报警类型分布
      owersName: ['全部'],
      faultName: [],
      faultNumber: []
    }
  }
  export default {
    components: { alarmPieChart, linesCharts, accidentAlarm, accidentPie, violationAlarm, violationPie, badAlarm, badPie },
    data() {
      return {
        mileageData: {
          type: Object
        },
        pickerOptions0: {
          disabledDate(time) {
            console.log('time.getTime()-------->' + time.getTime())
            console.log('Date.now()-------->' + Date.now())
            // 时间小于2018-01-01 00:00:00不允许选
            return time.getTime() < 1514736000000
          }
        },
        isDisable: false,
        queryDate: true,
        queryMonth: false,
        queryYear: false,
        controlTrend: lineChartData.newVisitis, // 防控报警趋势
        accidentTrend: lineChartData.messages, // 事故报警趋势
        violationTrend: lineChartData.purchases, // 违规报警趋势
        faultTrend: lineChartData.shoppings, // 故障报警趋势
        controlDistribution: lineChartData.controlDistribution, // 防控报警类型分布
        accidentDistribution: lineChartData.accidentDistribution, // 事故报警类型分布
        violationDistribution: lineChartData.violationDistribution, // 违规报警类型分布
        faultDistribution: lineChartData.faultDistribution, // 故障报警类型分布
        accident: [],
        violation: [],
        total: 0,
        tableData: [],
        listLoading: true,
        startEnd: [getDate(7), getDate(1)],
        platformIdList: [],
        owersList: [],
        pickerOptions: {
          // 查询时间最大间隔15天
          onPick: ({ maxDate, minDate }) => {
            this.choiceDate = minDate.getTime()
            if (maxDate) {
              this.choiceDate = ''
            }
          },
          disabledDate: (time) => {
            if (this.choiceDate !== '') {
              const one = 14 * 24 * 3600 * 1000
              const minTime = this.choiceDate - one
              const maxTime = this.choiceDate + one
              return time.getTime() > Date.now() || time.getTime() < minTime || time.getTime() > maxTime
            } else {
              return time.getTime() > Date.now()
            }
          },
          shortcuts: [{
            text: '最近7天',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
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
        listQuery: {
          page: 1,
          pageSize: 10,
          startTime: formatDate(getDate(7), 'yyyy-MM-dd'),
          endTime: formatDate(getDate(1), 'yyyy-MM-dd'),
          platformId: null,
          owersIds: [],
          owersId: null,
          type: 1,
          owersName: null
        }
      }
    },
    created() {
      this.getPlatformList()
    },
    methods: {
      reset() {
        this.listQuery = {
          page: 1,
          pageSize: 10,
          startTime: null,
          endTime: null,
          platformId: null,
          owersId: null,
          owersIds: [],
          type: 1,
          owersName: null
        }
        this.startEnd = ''
      },
      handleSizeChange(val) {
        this.listQuery.pageSize = val
        this.getEnterpriseList()
        this.getenterpriseAlarmdetails()
        this.getenterpriseAlarmType()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getEnterpriseList()
        this.getenterpriseAlarmdetails()
        this.getenterpriseAlarmType()
      },
      handleQuery() {
        if (this.listQuery.platformId && this.listQuery.startTime && this.listQuery.endTime) {
          this.listQuery.owersName = null
          this.isDisable = true
          this.listQuery.page = 1
          this.listQuery.pageSize = 10
          this.getEnterpriseList()
          this.getenterpriseAlarmdetails()
          this.getenterpriseAlarmType()
        } else {
          this.$message('请选择查询条件')
        }
      },
      getEnterpriseList() { // 分页获取智能预警列表
        this.listLoading = true
        this.listQuery.owersId = this.listQuery.owersIds.toString()
        enterpriseAlarm(this.listQuery).then(res => {
          console.log(res)
          if (res.code === 0 && res.data.length !== 0) {
            this.listLoading = false
            res.data.rows.forEach((item, i) => {
              item.enterpriseControlAlarmEntity.forEach((it, j) => {
                if (it.code === '10300') {
                  this.$set(this.mileageData, 'alarmNumber0', it.alarmNumber)
                  this.$set(this.mileageData, 'alarmHand0', it.alarmHand)
                }
                if (it.code === '10301') {
                  this.$set(this.mileageData, 'alarmNumber1', it.alarmNumber)
                  this.$set(this.mileageData, 'alarmHand1', it.alarmHand)
                }
                if (it.code === '10302') {
                  this.$set(this.mileageData, 'alarmNumber2', it.alarmNumber)
                  this.$set(this.mileageData, 'alarmHand2', it.alarmHand)
                }
                if (it.code === '10400') {
                  this.$set(this.mileageData, 'alarmNumber3', it.alarmNumber)
                  this.$set(this.mileageData, 'alarmHand3', it.alarmHand)
                }
                if (it.code === '10401') {
                  this.$set(this.mileageData, 'alarmNumber4', it.alarmNumber)
                  this.$set(this.mileageData, 'alarmHand4', it.alarmHand)
                }
                if (it.code === '10402') {
                  this.$set(this.mileageData, 'alarmNumber5', it.alarmNumber)
                  this.$set(this.mileageData, 'alarmHand5', it.alarmHand)
                }
                if (it.code === '10403') {
                  this.$set(this.mileageData, 'alarmNumber6', it.alarmNumber)
                  this.$set(this.mileageData, 'alarmHand6', it.alarmHand)
                }
                if (it.code === '10404') {
                  this.$set(this.mileageData, 'alarmNumber7', it.alarmNumber)
                  this.$set(this.mileageData, 'alarmHand7', it.alarmHand)
                }
                if (it.code === '10200') {
                  this.$set(this.mileageData, 'alarmNumber8', it.alarmNumber)
                  this.$set(this.mileageData, 'alarmHand8', it.alarmHand)
                }
                if (it.code === '10212') {
                  this.$set(this.mileageData, 'alarmNumber9', it.alarmNumber)
                  this.$set(this.mileageData, 'alarmHand9', it.alarmHand)
                }
                if (it.code === '10201') {
                  this.$set(this.mileageData, 'alarmNumber10', it.alarmNumber)
                  this.$set(this.mileageData, 'alarmHand10', it.alarmHand)
                }
                if (it.code === '10202') {
                  this.$set(this.mileageData, 'alarmNumber11', it.alarmNumber)
                  this.$set(this.mileageData, 'alarmHand11', it.alarmHand)
                }
                item = Object.assign(item, this.mileageData)
              })
            })
            this.tableData = res.data.rows
            this.total = res.data.totalCount
          } else {
            this.$message.info('查询失败,请重新查询！')
          }
        })
      },
      getenterpriseAlarmdetails() { // 企业报警类型分布
        this.listLoading = true
        this.controlDistribution.owersName = []
        this.controlDistribution.activeControlName = []
        this.controlDistribution.activeControlNumber = []
        this.accidentDistribution.owersName = []
        this.accidentDistribution.accidentName = []
        this.accidentDistribution.accidentNumber = []
        this.violationDistribution.owersName = []
        this.violationDistribution.violationName = []
        this.violationDistribution.violationNumber = []
        this.faultDistribution.owersName = []
        this.faultDistribution.faultName = []
        this.faultDistribution.faultNumber = []
        enterpriseAlarmdetails(this.listQuery).then(detail => {
          if (detail.code === 0 && detail.data.length !== 0) {
            detail.data.forEach(det => {
              // 防控报警分布
              det.activeControl.forEach(act => {
                act.name = act.alarmName
                act.value = act.alarmNumber
                this.controlDistribution.activeControlName.push(act.alarmName)
              })
              this.controlDistribution.activeControlNumber = det.activeControl
              // 事故报警分布
              det.accident.forEach(acc => {
                acc.name = acc.alarmName
                acc.value = acc.alarmNumber
                this.accidentDistribution.accidentName.push(acc.alarmName)
              })
              this.accidentDistribution.accidentNumber = det.accident
              // 违规报警分布
              det.violation.forEach(vio => {
                vio.name = vio.alarmName
                vio.value = vio.alarmNumber
                this.violationDistribution.violationName.push(vio.alarmName)
              })
              this.violationDistribution.violationNumber = det.violation
              // 故障报警分布
              det.fault.forEach(fat => {
                fat.name = fat.alarmName
                fat.value = fat.alarmNumber
                this.faultDistribution.faultName.push(fat.alarmName)
              })
              this.faultDistribution.faultNumber = det.fault
            })
            if (this.listQuery.owersId && this.listQuery.owersName) {
              this.controlDistribution.owersName = this.listQuery.owersName
              this.accidentDistribution.owersName = this.listQuery.owersName
              this.violationDistribution.owersName = this.listQuery.owersName
              this.faultDistribution.owersName = this.listQuery.owersName
            } else {
              this.controlDistribution.owersName = '全部'
              this.accidentDistribution.owersName = '全部'
              this.violationDistribution.owersName = '全部'
              this.faultDistribution.owersName = '全部'
            }
          } else {
            this.$message.info('查询失败,请重新查询！')
          }
        })
      },
      getenterpriseAlarmType() { // 企业报警趋势分析
        this.listLoading = true
        // 防控报警趋势
        this.controlTrend.owersName = []
        this.controlTrend.platformDate = []
        this.controlTrend.activeAlarmChart = []
        this.controlTrend.activeAlarmProcessedChart = []
        this.controlTrend.oneActiveAlarmRateChart = []
        this.controlTrend.twoActiveAlarmRateChart = []
        // 事故报警趋势
        this.accidentTrend.owersName = []
        this.accidentTrend.platformDate = []
        this.accidentTrend.accidentAlarmChart = []
        this.accidentTrend.accidentAlarmProcessedChart = []
        this.accidentTrend.accidentAlarmRateChart = []
        // 违规报警趋势
        this.violationTrend.owersName = []
        this.violationTrend.platformDate = []
        this.violationTrend.violationAlarmChart = []
        this.violationTrend.violationAlarmProcessedChart = []
        this.violationTrend.violationAlarmRateChart = []
        // 故障报警趋势
        this.faultTrend.owersName = []
        this.faultTrend.platformDate = []
        this.faultTrend.faultAlarmChart = []
        this.faultTrend.faultAlarmProcessedChart = []
        this.faultTrend.faultAlarmRateChart = []
        setTimeout(() => {
          this.isDisable = false
        }, 2000)
        enterpriseAlarmType(this.listQuery).then(type => {
          if (type.code === 0 && type.data.length !== 0) {
            type.data.forEach(item => {
              // 防控报警趋势
              this.controlTrend.platformDate.push(item.platformDate)
              this.controlTrend.activeAlarmChart.push(item.activeAlarm)
              this.controlTrend.activeAlarmProcessedChart.push(item.activeAlarmProcessed)
              this.controlTrend.oneActiveAlarmRateChart.push(item.oneActiveAlarmRate)
              this.controlTrend.twoActiveAlarmRateChart.push(item.twoActiveAlarmRate)
              // 事故报警趋势
              this.accidentTrend.platformDate.push(item.platformDate)
              this.accidentTrend.accidentAlarmChart.push(item.accidentAlarm)
              this.accidentTrend.accidentAlarmProcessedChart.push(item.accidentAlarmProcessed)
              this.accidentTrend.accidentAlarmRateChart.push(item.accidentAlarmRate)
              // 违规报警趋势
              this.violationTrend.platformDate.push(item.platformDate)
              this.violationTrend.violationAlarmChart.push(item.violationAlarm)
              this.violationTrend.violationAlarmProcessedChart.push(item.violationAlarmProcessed)
              this.violationTrend.violationAlarmRateChart.push(item.violationAlarmRate)
              // 故障报警趋势
              this.faultTrend.platformDate.push(item.platformDate)
              this.faultTrend.faultAlarmChart.push(item.faultAlarm)
              this.faultTrend.faultAlarmProcessedChart.push(item.faultAlarmProcessed)
              this.faultTrend.faultAlarmRateChart.push(item.faultAlarmRate)
            })
            if (this.listQuery.owersId && this.listQuery.owersName) {
              this.controlTrend.owersName = this.listQuery.owersName
              this.accidentTrend.owersName = this.listQuery.owersName
              this.violationTrend.owersName = this.listQuery.owersName
              this.faultTrend.owersName = this.listQuery.owersName
            } else {
              this.controlTrend.owersName = '全部'
              this.accidentTrend.owersName = '全部'
              this.violationTrend.owersName = '全部'
              this.faultTrend.owersName = '全部'
            }
          } else {
            this.$message.info('查询失败,请重新查询！')
          }
        })
      },
      getPlatformList() { // 获取运营商平台列表
        getPermsList().then(response => {
          console.log(response)
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
        enterpriseAlarmeexcel(this.listQuery).then(result => {
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
        link.setAttribute('download', '企业/业户报警分析.xls')
        document.body.appendChild(link)
        link.click()
      },
      dateQuery() { // 日期查询
        this.queryDate = true
        this.queryMonth = false
        this.queryYear = false
        this.listQuery.type = 1
        this.startEnd = [formatDate(getDate(7), 'yyyy-MM-dd'), formatDate(getDate(1), 'yyyy-MM-dd')]
      },
      monthQuery() { // 月查询
        this.queryMonth = true
        this.queryDate = false
        this.queryYear = false
        const endTime = new Date()
        this.listQuery.type = 2
        this.listQuery.endTime = formatDate(new Date(), 'yyyy-MM')
        var eDate = addMonth(formatDate(endTime, 'yyyy-MM-dd'), -5)
        this.listQuery.startTime = eDate
      },
      yearQuery() { // 年查询
        this.queryYear = true
        this.queryDate = false
        this.queryMonth = false
        const endTime = new Date()
        const startyear = endTime.getFullYear() - 1
        const strDay = endTime.getDate()
        const strMonth = endTime.getMonth() + 1
        const startTime = startyear + '-' + strMonth + '-' + strDay
        this.listQuery.startTime = formatDate(startTime, 'yyyy')
        this.listQuery.endTime = formatDate(endTime, 'yyyy')
        this.listQuery.type = 4
      },
      clickedRow(row) {
        this.listQuery.owersId = ''
        this.listQuery.owersId = row.owersId
        this.listQuery.startTime = formatDate(this.listQuery.startTime, 'yyyy-MM-dd')
        this.listQuery.endTime = formatDate(this.listQuery.endTime, 'yyyy-MM-dd')
        this.listQuery.owersName = row.owersName
        this.getenterpriseAlarmdetails()
        this.getenterpriseAlarmType()
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

<style>
  .querycolor {
      color: #fff;
      background-color: #409EFF;
      border-color: #409EFF;
  }
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
