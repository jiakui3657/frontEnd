<template>
  <div class="app-container">
    <el-container>
        <el-form ref="form" :model="listQuery" label-width="70px" inline style="background: #fff; margin: 0 20px; padding: 20px 10px 0 20px; border-radius: 5px; box-shadow: 0 0 10px #ccc">
          <el-form-item label="地区">
            <el-select v-model="listQuery.nationality" :loading="loading" @focus="getChildrenVehListByType()"
              placeholder="请选择" style="width:150px;" size="small" clearable  filterable>
              <el-option v-for="item in areaList" :key="item.areaCode" :label="item.areaName" :value="item.areaCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="margin-left:10px; float: right">
            <el-button icon="el-icon-search"   @click="handleQuery" size="small" style="background-color: #5F7ABF;border-radius: 5px;color:#fff;">查询</el-button>
            <el-button icon="el-icon-refresh"  @click="reset" size="small" style="background-color: #5F7ABF;border-radius: 5px;color:#fff;">重置</el-button>
            <el-button icon="el-icon-download" @click="alarmexport" size="small" style="float:right;background: #5F7ABF; color: #fff; border-radius: 5px">导出</el-button>
          </el-form-item>
        </el-form>
        <el-row style="margin:20px 0;">
            <div class="mil-trend">
              <pie-chart :chart-data="lineChartData3"></pie-chart>
            </div>
        </el-row>
      <el-main style="padding:0px 20px 20px;">
        <el-table :data="data" :columns="columns" v-loading.body="listLoading" border stripe style="width:100%; border-radius: 5px; box-shadow: 0 0 10px #ccc" @row-click="handleSelect" :header-cell-style="{ 'background-color': '#5F7ABF', 'color': '#fff', 'border': 'none !important' }">
          <el-table-column align="center" type="index" width="50" label="排名" fixed="left"></el-table-column>
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
import PieChart from './PieChart'
import { getChildrenVehList } from '@/api/vehicle/choiceCar'
import { fetchPie, fetchList, Listexcel } from '@/api/statisticalAnalysis/installSummary'

export default {
  components: { PieChart },
  data() {
    return {
      lineChartData3: {
        alarmName: [],
        count: [],
        number: '123'
      },
      total: 0,
      loading: true,
      listLoading: true,
      count: 0,
      data: [],
      columns: [
        {
          key: 'mangerName',
          title: '地区名称',
          width: '100'
        },
        {
          key: 'amount',
          title: '车辆数',
          width: '100'
        },
        {
          key: 'employ',
          title: '已安装数量',
          width: '100'
        },
        {
          key: 'ratio',
          title: '安装率',
          width: '100'
        }
      ],
      listQuery: {
        page: 1,
        pageSize: 10,
        nationality: ''
      },
      areaList: []
    }
  },
  created() {
    this.getSpeedList()
    this.getPieData()
  },
  methods: {
    getChildrenVehListByType() {
      const p = {
        type: 1
      }
      getChildrenVehList(p).then(res => {
        this.loading = false
        // for (let i = 0; i < res.data.length; i++) {
        //   if (res.data[i].provincial !== '') {
        //     res.data.splice(i, 1)
        //     i--
        //   }
        // }
        const arr = []
        res.data.forEach(item => {
          if (item.areaName.split(',').length < 3) {
            arr.push(item)
          }
        })
        this.areaList = arr
      })
    },
    getPieData(code) {
      fetchPie(code).then(res => {
        if (res.code === 0) {
          if (res.data.length !== 0) {
            res.data.forEach(item => {
              console.log(JSON.stringify(res.data))
              item.name = item.alarmName
              item.value = item.count
              this.lineChartData3.alarmName.push(item.name)
            })
            this.lineChartData3.count = res.data
            this.lineChartData3.number = res.data[0].count
            this.lineChartData3.count[0].count = res.data[0].count - res.data[1].count
            this.lineChartData3.count[0].value = this.lineChartData3.count[0].count
            this.lineChartData3.alarmName[0] = '未安装总数'
            this.lineChartData3.count[0].name = '未安装总数'
            this.lineChartData3.count[0].alarmName = '未安装总数'
            console.log(JSON.stringify(this.lineChartData3.count))
          }
        }
      })
    },
    reset() {
      this.listQuery = {
        page: 1,
        pageSize: 10,
        nationality: ''
      }
    },
    getSpeedList() { // 分页获取智能预警列表
      this.listLoading = true
      // this.listQuery.owersId = this.listQuery.owersIds.toString()
      fetchList(this.listQuery).then(res => {
        if (res.code === 0) {
          console.log(res)
          this.listLoading = false
          this.data = res.data.rows
          this.total = res.data.totalCount
        }
      })
    },
    handleSelect(row) { // 选择处理事件
      this.listQuery.owersId = row.id
      this.listQuery.owersIds.push(row.id)
      // this.getsummaryday()
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getSpeedList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getSpeedList()
    },
    handleQuery() {
      this.getPieData(this.listQuery.nationality)
      this.listQuery.page = 1
      this.listQuery.pageSize = 10
      this.getSpeedList()
    },
    alarmexport() { // Excel导出
      if (this.total > 50000) {
        this.$message('导出数据不能大于50000')
        return
      }
      Listexcel(this.listQuery).then(result => {
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
      link.setAttribute('download', '安装率统计.xls')
      document.body.appendChild(link)
      link.click()
    }
  },
  watch: {
    startEnd(val) {
      if (val) {
        console.log(val)
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

