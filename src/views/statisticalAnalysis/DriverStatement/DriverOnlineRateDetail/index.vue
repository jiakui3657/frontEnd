<template>
    <div class="app-container">
          <el-container>
        <el-form ref="form" :model="listQuery" label-width="70px" inline style="background: #fff; margin: 0 20px; padding: 13px 10px 0 20px; border-radius: 5px; box-shadow: 0 0 10px #ccc">
          <el-form-item label="运营商平台">
            <el-select  @change="platformChange(listQuery.platformId)" v-model="listQuery.platformId" placeholder="请选择" style="width:120px;" size="small" clearable  filterable>
              <el-option v-for="item in platformIdList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <window-bar ref="DriverName"  :platformId="listQuery.platformId" @getDriverName="getDriverName"></window-bar>
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
      <el-main>
        <el-table :data="data" :columns="columns" v-loading.body="listLoading" border stripe style="width:100%; border-radius: 5px; box-shadow: 0 0 10px #ccc" :header-cell-style="{ 'background-color': '#5F7ABF', 'color': '#fff', border: 'none !important' }">
          <el-table-column align="center" type="index" width="50" label="序号" fixed="left"></el-table-column>
          <el-table-column property="driverName" align="center" label="司机名称" :min-width="120"></el-table-column>
          <el-table-column property="platformName" align="center" label="运营商平台" :min-width="120"></el-table-column>
          <el-table-column property="owersName" align="center" label="企业/业户" :min-width="120"></el-table-column>
          <el-table-column property="onlineData" align="center" label="在线时长" :min-width="100"></el-table-column>
          <el-table-column property="offlineData" align="center" label="离线时长" :min-width="100"></el-table-column>
          <el-table-column property="time" align="center" label="总时长" :min-width="100"></el-table-column>
          <el-table-column property="rate" align="center" label="在线率" :min-width="100"></el-table-column>
          <el-table-column align="center" v-for="column in columns" :key="column.key" :label="column.title" :min-width="column.width">
            <el-table-column property="faultAlarm" align="center"  label="在线时长">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{scope.row[column.key]}}</span>
            </template>
            </el-table-column>
            <el-table-column property="faultAlarmProcessed" align="center" label="在线率">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{scope.row[column.key1]}}</span>
              </template>
            </el-table-column>
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
    <!-- <footer-bar></footer-bar> -->
    </div>
</template>

<script>
import WindowBar from '../WindowBar'
import FooterBar from '../FooterBar'
import { formatDate } from '@/utils/date.js' // 日期格式化
import { getPermsList } from '@/api/base/platform' // 获得运营商平台
import { OnlineRate } from '@/api/statisticalAnalysis/driver' // Excel导出

export default {
  name: 'VehicleMileageSummary',
  components: { FooterBar, WindowBar },
  data() {
    var date = function() {
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return start
    }
    return {
      mileageData: {
        type: Object
      },
      listLoading: true,
      total: 0,
      data: [], // 数据列表
      platformIdList: [], // 运营商平台
      startEnd: [date(), new Date()],
      columns: [],
      listQuery: {
        page: 1,
        pageSize: 10,
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
            text: '最近1月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
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
  },
  methods: {
    getDriverName(row) {
      console.log(row)
      this.listQuery.driverId = row
    },
    reset() { // 重置
      this.listQuery = {
        page: 1,
        pageSize: 10,
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
      OnlineRate(this.listQuery).then(res => {
        if (res.code === 0) {
          this.listLoading = false
          res.data.rows.forEach((item, i) => {
            item.total.forEach((it, j) => {
              const onlinetime = 'onlinetime' + j
              const onlineRate = 'onlineRate' + j
              if (i === 0) {
                this.columns.push({ key: onlinetime, key1: onlineRate, title: it.data, width: '100' })
              }
              this.$set(this.mileageData, onlinetime, it.onlinetime)
              this.$set(this.mileageData, onlineRate, it.onlineRate)
              item = Object.assign(item, this.mileageData)
            })
          })
          this.data = res.data.rows
          this.total = res.data.totalCount
        }
      })
    },
    handleQuery() { // 查询
      console.log(this.listQuery)
      this.listQuery.page = 1
      this.listQuery.pageSize = 10
      this.getSpeedList()
    },
    handleSizeChange(val) { // 分页
      this.listQuery.pageSize = val
      this.getSpeedList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getSpeedList()
    },
    alarmexport() {},
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

<style  scoped>
  .app-container .el-dialog__header {
    background-color: #4077BC;
    height: 40px;
    padding-top: 10px;
  }
</style>
