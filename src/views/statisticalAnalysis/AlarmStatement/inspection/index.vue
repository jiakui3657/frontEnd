<template>
  <div class="app-container">
    <el-container>
        <el-form ref="form" :model="listQuery" label-width="80px" label-position="left" inline style="background: #fff; margin: 0 20px; padding: 20px 10px 0 20px; border-radius: 5px; box-shadow: 0 0 10px #ccc">
          <el-form-item>
            <search-byArea-and-three areaName="所属地区" ref="getarea"
              :showCar="false"
              @selectAreaId="(id) => {listQuery.areaId = id}"
              @selectPlatformId="(id) => {listQuery.platformId = id}"
              @selectOwersId="(id) => {listQuery.owersId = id}"
              >
            </search-byArea-and-three>
          </el-form-item>
          <el-form-item label="查询时间">
            <el-date-picker
              v-model.trim="startEnd"
              type="daterange"
              :picker-options="pickerOptions"
              :editable="false"
              range-separator="——"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="left"
              size="small"
              style="width: 270px"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              :clearable="false">
            </el-date-picker>
          </el-form-item>
          <el-form-item style="margin-left:10px; float: right">
            <el-button icon="el-icon-search"   @click="handleQuery" size="small" style="background-color: #5F7ABF;border-radius: 5px;color:#fff;">查询</el-button>
            <el-button icon="el-icon-refresh"  @click="reset" size="small" style="background-color: #5F7ABF;border-radius: 5px;color:#fff;">重置</el-button>
            <el-button icon="el-icon-download" @click="alarmexport" size="small" style="float:right;background: #5F7ABF; color: #fff; border-radius: 5px">导出</el-button>
          </el-form-item>
        </el-form>
      <el-main style="padding:0px 20px 20px;">
        <el-table :data="data" :columns="columns" v-loading.body="listLoading" border stripe style="width:100%; border-radius: 5px; box-shadow: 0 0 10px #ccc" @row-click="handleSelect" :header-cell-style="{ 'background-color': '#5F7ABF', 'color': '#fff','border': 'none' }">
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
  </div>
</template>

<script>
import SearchByAreaAndThree from '@/components/Search/SearchByAreaAndThree'
import { inspection, inspectionExcel } from '@/api/statistics/statistics'
import { formatDate, getDate } from '@/utils/date.js'

export default {
  components: { SearchByAreaAndThree },
  data() {
    return {
      total: 0,
      listLoading: true,
      data: [],
      columns: [
        {
          key: 'areaName',
          title: '所属地区',
          width: '100'
        },
        {
          key: 'platformName',
          title: '运营商平台',
          width: '100'
        },
        {
          key: 'owersName',
          title: '所属企业/业户',
          width: '100'
        },
        {
          key: 'reqNumber',
          title: '下发命令总次数',
          width: '100'
        },
        {
          key: 'reqTime',
          title: '已回复次数',
          width: '100'
        },
        {
          key: 'passRate',
          title: '查岗响应率',
          width: '100'
        }
      ],
      listQuery: {
        page: 1,
        pageSize: 10,
        startTime: formatDate(getDate(6), 'yyyy-MM-dd') + ' 00:00:00',
        endTime: formatDate(getDate(0), 'yyyy-MM-dd') + ' 23:59:59',
        areaId: null,
        platformId: null,
        owersId: null
      },
      startEnd: [getDate(6), getDate(0)],
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
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 2)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近7天',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 6)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近15天',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 14)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      }
    }
  },
  created() {
    this.getSpeedList()
  },
  methods: {
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getSpeedList()
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getSpeedList()
    },
    reset() {
      this.startEnd = [getDate(6), getDate(0)]
      this.$refs.getarea.reset()
      this.listQuery = {
        page: 1,
        pageSize: 10,
        startTime: formatDate(getDate(6), 'yyyy-MM-dd') + ' 00:00:00',
        endTime: formatDate(getDate(0), 'yyyy-MM-dd') + ' 23:59:59',
        areaId: null,
        platformId: null,
        owersId: null
      }
    },
    getSpeedList() { // 分页获取智能预警列表
      this.listLoading = true
      inspection(this.listQuery).then(res => {
        console.log(res)
        if (res.code === 0) {
          this.listLoading = false
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
    alarmexport() {
      if (this.total > 50000) {
        this.$message('导出数据不能大于50000')
        return
      }
      inspectionExcel(this.listQuery).then(result => {
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
      link.setAttribute('download', '查岗处理率.xls')
      document.body.appendChild(link)
      link.click()
    }
  },
  watch: {
    startEnd(val) {
      if (val) {
        this.listQuery.startTime = formatDate(val[0], 'yyyy-MM-dd') + ' 00:00:00'
        this.listQuery.endTime = formatDate(val[1], 'yyyy-MM-dd') + ' 23:59:59'
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

