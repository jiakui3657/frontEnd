<template>
  <div style="padding:10px 15px;">
    <el-form inline style="height:60px;background: #fff;padding: 12px 10px 0 20px;border-radius:5px;box-shadow: 0 0 10px #ccc">
      <el-button-group>
        <el-button  v-if="queryDate" class="querycolor" type="" size="small" @click="dateQuery">日</el-button>
        <el-button v-else type="" size="small" @click="dateQuery">日</el-button>
        <el-button  v-if="queryMonth" class="querycolor" type="" size="small" @click="monthQuery">月</el-button>
        <el-button v-else  type="" size="small" @click="monthQuery">月</el-button>
        <!--<el-button type="" size="small" >季</el-button>-->
        <el-button  v-if="queryYear" class="querycolor" type="" size="small" @click="yearQuery">年</el-button>
        <el-button  v-else type="" size="small" @click="yearQuery">年</el-button>
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
          style="width: 350px"
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
          :picker-options="pickerOptions0"
          value-format="yyyy"
          type="year">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="运营商平台">
        <el-select  @change="platformChange(listQuery.platformId)" v-model="listQuery.platformId" placeholder="请选择" style="width:150px;" size="small" clearable  filterable>
          <el-option v-for="item in platformIdList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择企业/业户" >
        <el-select @focus="owersIdClick(listQuery.platformId)" v-model="listQuery.owersId" placeholder="请选择" style="width:150px;" size="small"  multiple collapse-tags>
            <el-option v-for="item in owersList" :key="item.id" :label="item.owersName" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item style="float: right;margin-bottom:0;">
        <el-button :disabled="isDisable" @click="handleQuery" size="small" type="primary">查询</el-button>
        <el-button @click="reset" size="small" type="primary">重置</el-button>
       </el-form-item>
    </el-form>
    <p style="padding-right:20px;height:32px;line-height:32px;">
      <span>企业/业户车辆数据对比分析</span>
      <el-button @click="alarmexport" size="small" style="float:right;background: #5F7ABF; color: #fff; border-radius: 5px">导出</el-button>
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
        label="序号"
        width="50">
      </el-table-column>
      <el-table-column
        align="center"
        prop="name"
        label="企业/业户"
        width="180">
      </el-table-column>
      <el-table-column
        prop="platformname"
        align="center"
        label="运营商平台"
        width="180">
      </el-table-column>
      <el-table-column
        prop="parentName"
        align="center"
        label="上级企业/业户"
        width="180">
      </el-table-column>
      <el-table-column
        prop="amount"
        align="center"
        label="所有车辆">
      </el-table-column>
      <el-table-column
        prop="kysum"
        align="center"
        label="客运班线">
      </el-table-column>
      <el-table-column
        prop="dbsum"
        align="center"
        label="旅游包车">
      </el-table-column>
      <el-table-column
        prop="hcsum"
        align="center"
        label="危险货运">
      </el-table-column>
      <el-table-column
        prop="network"
        align="center"
        label="入网车辆">
      </el-table-column>
      <el-table-column
        prop="networkRate"
        align="center"
        label="入网率">
      </el-table-column>
      <el-table-column
        prop="onine"
        align="center"
        label="上线车辆">
      </el-table-column>
      <el-table-column
        prop="onlineRate"
        align="center"
        label="上线率">
      </el-table-column>
      <el-table-column
        prop="employee"
        align="center"
        label="从业人员">
      </el-table-column>
    </el-table>
    <!-- 分页区 -->
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page"
      :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total" style="margin-top: 20px">
    </el-pagination>
    <bar-echarts-one :control-data="echDataOne"></bar-echarts-one>
  </div>
</template>

<script>
  import barEchartsOne from './barEchartsOne'
  import { getPermsList } from '@/api/alarm/supervise'
  import { owersListByPlatform } from '@/api/base/company'
  import { tableNum, runningChange, enterpriseexcel } from '@/api/regulatory/enterpriseData'
  import { formatDate, addMonth, getDate, getAll } from '@/utils/date.js'

  const lineChartData = {
    newVisitis: {
      // 企业运行数据分析趋势
      days: getAll(formatDate(getDate(15), 'yyyy-MM-dd'), formatDate(getDate(1), 'yyyy-MM-dd')), // 日期
      onlineRate: [], // 上线率
      networkRate: [], // 入网率
      onine: [], // 上线
      network: [], // 入网
      carnum: [], // 车辆总数
      owersName: []
    }
  }
  export default {
    components: { barEchartsOne },
    data() {
      return {
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
        echDataOne: lineChartData.newVisitis, // 企业运行数据分析趋势
        total: 0,
        tableData: [],
        listLoading: true,
        startEnd: [getDate(15), getDate(1)],
        platformIdList: [],
        owersList: [],
        choiceDate: '',
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
          },
          {
            text: '最近15天',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 15)
              picker.$emit('pick', [start, end])
            }
          }]
        },
        listQuery: {
          page: 1,
          limit: 10,
          startTime: formatDate(getDate(15), 'yyyy-MM-dd'),
          endTime: formatDate(getDate(1), 'yyyy-MM-dd'),
          platformId: null,
          owersId: [],
          owersIds: null,
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
        // alert(JSON.stringify(this.owersList))
        // alert(JSON.stringify(this.listQuery.owersId))
        this.listQuery = {
          page: 1,
          limit: 10,
          startTime: null,
          endTime: null,
          platformId: null,
          owersIds: null,
          owersName: null
        }
        this.listQuery.owersId = ''
        // alert(JSON.stringify(this.listQuery.owersId))
        this.owersId = ''
        this.startEnd = ''
      },
      handleSizeChange(val) {
        this.listQuery.limit = val
        this.gettableNum()
        this.getRunningChange()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.gettableNum()
        this.getRunningChange()
      },
      handleQuery() {
        if (this.listQuery.platformId && this.listQuery.startTime && this.listQuery.endTime) {
          this.listQuery.owersName = null
          this.isDisable = true
          this.listQuery.page = 1
          this.listQuery.limit = 10
          this.gettableNum()
          this.getRunningChange()
        } else {
          this.$message('请选择查询条件')
        }
      },
      gettableNum() { // 分页获取智能预警列表
        this.listLoading = true
        this.listQuery.owersIds = this.listQuery.owersId.toString()
        tableNum(this.listQuery).then(res => {
          if (res.code === 0 && res.data.length !== 0) {
            this.listLoading = false
            this.tableData = res.data.rows
            this.total = res.data.totalCount
          } else {
            this.$message.info('查询失败,请重新查询！')
          }
        })
      },
      getRunningChange() {
        setTimeout(() => {
          this.isDisable = false
        }, 2000)
        runningChange(this.listQuery).then(res => {
          this.echDataOne.owersName = []
          this.echDataOne.days = []
          this.echDataOne.onlineRate = []
          this.echDataOne.networkRate = []
          this.echDataOne.onine = []
          this.echDataOne.network = []
          this.echDataOne.carnum = []
          res.data.forEach(item => {
            this.echDataOne.days.push(item.days)
            this.echDataOne.onlineRate.push(item.onlineRate)
            this.echDataOne.networkRate.push(item.networkRate)
            this.echDataOne.onine.push(item.onine)
            this.echDataOne.network.push(item.network)
            this.echDataOne.carnum.push(item.carnum)
          })
          if (this.listQuery.owersIds && this.listQuery.owersName) {
            this.echDataOne.owersName = this.listQuery.owersName
          } else {
            this.echDataOne.owersName = '全部'
          }
        })
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
          this.listQuery.owersId = []
          this.owersList = response.data
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
      alarmexport() {
        enterpriseexcel(this.listQuery).then(result => {
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
        link.setAttribute('download', '企业/业户数据分析.xls')
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
        const endTime = new Date()
        this.queryDate = false
        this.queryMonth = true
        this.queryYear = false
        this.listQuery.type = 2
        this.listQuery.endTime = formatDate(new Date(), 'yyyy-MM')
        var eDate = addMonth(formatDate(endTime, 'yyyy-MM-dd'), -5)
        this.listQuery.startTime = eDate
      },
      yearQuery() { // 年查询
        const endTime = new Date()
        const startyear = endTime.getFullYear() - 1
        const strDay = endTime.getDate()
        const strMonth = endTime.getMonth() + 1
        const startTime = startyear + '-' + strMonth + '-' + strDay
        this.listQuery.startTime = formatDate(startTime, 'yyyy')
        this.listQuery.endTime = formatDate(endTime, 'yyyy')
        this.queryDate = false
        this.queryMonth = false
        this.queryYear = true
        this.listQuery.type = 4
      },
      clickedRow(row) { // 点击表格某一行
        this.listQuery.owersIds = row.id
        this.listQuery.owersName = row.name
        this.getRunningChange()
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

<style >
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
