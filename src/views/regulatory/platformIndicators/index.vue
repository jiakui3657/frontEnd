<template>
  <div style="padding:10px 15px;">
    <el-form inline style="height:60px;background: #fff;padding: 12px 10px 0 20px;border-radius:5px;box-shadow: 0 0 10px #ccc">
      <el-form-item label="选择时间" style="margin-bottom: 0;">
         <el-date-picker
           size="mini"
           style="width:178px;"
           v-model.trim="listQuery.queryDate"
           value-format="yyyy-MM"
           type="month">
         </el-date-picker>
      </el-form-item>
      <el-form-item label="运营商平台" style="margin-bottom: 0;">
        <el-select size="mini" clearable v-model.trim="listQuery.platformId" placeholder="请选择运营商平台">
          <el-option
           v-for="item in platsOptions"
           :key="item.id"
           :label="item.name"
           :value="item.id">
         </el-option>
        </el-select>
      </el-form-item>
      <el-form-item style="float: right;margin-bottom:0;">
        <el-button :disabled="isDisable" size="small" type="primary" @click="search">查询</el-button>
        <el-button size="small" type="primary" @click="reset">重置</el-button>
       </el-form-item>
    </el-form>
    <el-row style="margin:15px 0;">
      <el-col :span="24">
        <div class="chartsWrapper">
          <div class="chartsBox">
            <plat-data :plat-data="PlatDatas"></plat-data>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row style="margin:15px 0;">
      <el-col :span="12" style="padding:0 10px 0 0">
        <div class="chartsWrapper">
          <div class="chartsBox">
            <left-card :left-data="leftDatas"></left-card>
          </div>
        </div>
      </el-col>
      <el-col :span="12" style="padding:0 0 0 10px">
        <div class="chartsWrapper">
          <div class="chartsBox">
            <right-card :right-data="rightDatas"></right-card>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row style="margin:15px 0;">
      <el-col :span="12" style="padding:0 10px 0 0">
        <div class="chartsWrapper">
          <div class="chartsBox">
            <line-chart :chart-data="lineChartData"></line-chart>
          </div>
        </div>
      </el-col>
      <el-col :span="12" style="padding:0 0 0 10px">
        <div class="chartsWrapper">
          <div class="chartsBox">
            <lines :chart-data="lineChartData2"></lines>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import platData from './platData'
  import leftCard from './leftCard'
  import rightCard from './rightCard'
  import lineChart from './lineChart'
  import lines from './lines'
  import { platFormData, control, assessment } from '@/api/regulatory/platform'
  import { getPermsList } from '@/api/base/platform'
  import { formatDate, getAll, getDate } from '@/utils/date.js'

  const lineChartData = {
    trend: {
      date: getAll(formatDate(new Date().setDate(1), 'yyyy-MM-dd'), formatDate(getDate(1), 'yyyy-MM-dd')),
      trendScore: []
    },
    norm: {
      normDate: getAll(formatDate(new Date().setDate(1), 'yyyy-MM-dd'), formatDate(getDate(1), 'yyyy-MM-dd')), // 日期
      connected: [], // 平台联通率
      onlineCars: [], // 车辆上线率
      SupervisoryTreatment: [], // 督办处理率
      reaction: [], // 查岗响应率
      alamrFixs: [] // 报警处理率
    }
  }
  export default {
    components: { platData, leftCard, rightCard, lineChart, lines },
    data() {
      return {
        isDisable: false,
        lineChartData: lineChartData.trend,
        lineChartData2: lineChartData.norm,
        listQuery: {
          queryDate: formatDate(new Date(), 'yyyy-MM'),
          platformId: ''
        },
        platsOptions: [],
        PlatDatas: [],
        leftDatas: [],
        rightDatas: []
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
      getPlatFormData() {
        platFormData(this.listQuery).then(res => {
          if (res.code === 0 && res.data.length !== 0) {
            this.PlatDatas = res.data
          } else {
            this.$message.info('查询失败,请重新查询！')
          }
        })
      },
      getControl() {
        control(this.listQuery).then(res => {
          if (res.code === 0 && res.data.length !== 0) {
            this.leftDatas = res.data
            this.rightDatas = res.data
          } else {
            this.$message.info('查询失败,请重新查询！')
          }
        })
      },
      getAssessment() {
        setTimeout(() => {
          this.isDisable = false
        }, 2000)
        assessment(this.listQuery).then(res => {
          if (res.code === 0 && res.data.length !== 0) {
            this.lineChartData.date = []
            this.lineChartData.trendScore = []
            this.lineChartData2.normDate = []
            this.lineChartData2.connected = []
            this.lineChartData2.onlineCars = []
            this.lineChartData2.SupervisoryTreatment = []
            this.lineChartData2.reaction = []
            this.lineChartData2.alamrFixs = []
            res.data.forEach(item => {
              this.lineChartData.date.push(item.platformDate)
              this.lineChartData.trendScore.push(item.scoreNumber)
              // 考核指标分析
              this.lineChartData2.normDate.push(item.platformDate)
              this.lineChartData2.connected.push(item.platformOnlineDate)
              this.lineChartData2.onlineCars.push(item.onlineRateDate)
              this.lineChartData2.SupervisoryTreatment.push(item.overseeRatesDate)
              this.lineChartData2.reaction.push(item.checkRateDate)
              this.lineChartData2.alamrFixs.push(item.alarmRateDate)
            })
          }
        })
      },
      search() {
        if (this.listQuery.queryDate && this.listQuery.platformId) {
          if (this.listQuery.queryDate.replace('-', '') > formatDate(new Date(), 'yyyyMM')) {
            this.$message('不能选择大于当前月查询')
            this.listQuery.queryDate = formatDate(new Date(), 'yyyy-MM')
          } else {
            this.isDisable = true
            this.getPlatFormData()
            this.getControl()
            this.getAssessment()
          }
        } else {
          this.$message('请选择查询条件')
        }
      },
      reset() {
        this.listQuery.queryDate = ''
        this.listQuery.platformId = ''
      }
    },
    mounted() {
      this.getPlatformList()
    }
  }
</script>

<style scoped>
  .chartsWrapper {
    background:#fff;
  }
  .chartsWrapper .chartsBox {
    box-shadow: 0 0 10px #ccc;
  }
  .el-button--primary {
    color: #fff;
    background-color: #5F7ABF;
    border-color: #5F7ABF;
  }
</style>
