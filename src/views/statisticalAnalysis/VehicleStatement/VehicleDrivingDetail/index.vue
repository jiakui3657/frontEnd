<template>
    <div class="app-container">
          <el-container>
        <el-form ref="form" :model="listQuery" label-width="80px" label-position="left" inline style="background: #fff; margin: 0 20px; padding: 20px 10px 0 20px; border-radius: 5px; box-shadow: 0 0 10px #ccc">
           <el-form-item>
            <search-byArea-and-three areaName="所属地区" ref="getarea"
              @chooseCar="(tmp) => {listQuery.vehicleId = tmp.id; listQuery.vehicleNo = tmp.vehicleNo}"
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
      <el-dialog title="选择车辆" :visible.sync="chooseDialogVisible" class="allotDialog" :close-on-click-modal="false">
          <el-row>
            <!-- <el-col :span="6" style="border: 1px solid #ccc; min-height: 400px; max-height: 600px; overflow: hidden">
              <el-tree :data="menus" @node-click="deptFilter" :props="defaultProps" default-expand-all :expand-on-click-node="false" style="background: #fff; height: 400px; overflow: auto"></el-tree>
            </el-col> -->
            <el-col :span="22" :offset="1">
              <div class="searchInput" style="overflow: hidden">
                车牌号: <el-input placeholder="请输入车牌号" v-model="carQuery.plateNo" style="width: 200px;" size="small"></el-input>
                <el-button style="background-color:#5F7ABF;color:#fff;border-radius:5px;" size="small" @click="vnFilter">查询</el-button>
                <el-button size="small" style="float:right;background-color:#5F7ABF;color:#fff;border-radius:5px;" @click="chooseCar">确定</el-button>
              </div>
              <div>
                <el-table ref="multipleTable" :data="carData" :header-cell-style="{ 'background-color': '#5F7ABF', 'color': '#fff' }"
                          style="margin-top: 10px;width:100%" stripe border @selection-change="handleSelectionChange">
                  <el-table-column type="selection" width="40"></el-table-column>
                   <el-table-column
                    label="车牌号"
                    align="center"
                    prop="vehicleNo"
                    width="100px">
                  </el-table-column>
                  <el-table-column
                    prop="activeStatus"
                    align="center"
                    label="状态"
                    width="100px">
                    <template slot-scope="scope">
                      <span v-if="scope.row.activeStatus === '在线'" style="color:#13CE66">{{ scope.row.activeStatus }}</span>
                      <span v-else>{{ scope.row.activeStatus }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="platformName"
                    align="center"
                    label="运营商平台"
                    width="180px"
                    show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column
                    prop="owersName"
                    align="center"
                    label="企业/业户"
                    min-width="180px"
                    show-overflow-tooltip>
                  </el-table-column>
                </el-table>
              </div>
              <el-pagination small background @current-change="handlePageChange" :current-page="carQuery.page" :page-size="carQuery.limit" layout="total, prev, pager, next" :total="chooseTotal" style="margin-top: 20px">
              </el-pagination>
            </el-col>
          </el-row>
    </el-dialog>
    </div>
</template>

<script>
import { formatDate, getDate } from '@/utils/date.js'
import { runDetail, detailEcexl } from '@/api/statistics/statistics' // Excel导出
import { getDeptTree } from '@/api/base/company' // 机构树
import SearchByAreaAndThree from '@/components/Search/SearchByAreaAndThree'
import { getChildrenVehList } from '@/api/vehicle/choiceCar'

export default {
  name: 'VehicleMileageSummary',
  components: { SearchByAreaAndThree },
  data() {
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
        type: 4,
        page: 1,
        limit: 10,
        areaId: '',
        platformId: '',
        plateNo: '',
        owersId: ''
      },
      listLoading: true,
      total: 0,
      data: [], // 数据列表
      platformIdList: [], // 运营商平台
      startEnd: [getDate(6), getDate(0)],
      columns: [
        {
          key: 'vehicleNo',
          title: '车牌号',
          width: '100'
        },
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
          title: '企业/业户',
          width: '100'
        },
        {
          key: 'vehicleTypeName',
          title: '车牌类型',
          width: '100'
        },
        {
          key: 'vehicleColorName',
          title: '车辆颜色',
          width: '100'
        },
        {
          key: 'transTypeName',
          title: '运输行业类型',
          width: '100'
        },
        {
          key: 'vehicleNumber',
          title: '行车次数',
          width: '100'
        },
        {
          key: 'totalLength',
          title: '行车总时长',
          width: '100'
        },
        {
          key: 'totalMileage',
          title: '行车累计里程',
          width: '100'
        },
        {
          key: 'avgSpeed',
          title: '平均速度',
          width: '100'
        },
        {
          key: 'maxSpeed',
          title: '最大速度',
          width: '100'
        }
      ],
      listQuery: {
        page: 1,
        limit: 10,
        startTime: formatDate(getDate(6), 'yyyy-MM-dd') + ' 00:00:00',
        endTime: formatDate(getDate(0), 'yyyy-MM-dd') + ' 23:59:59',
        vehicleId: null,
        vehicleNo: null,
        areaId: null,
        platformId: null,
        owersId: null
      },
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
    this.getSpeedList() // 初始化列表
  },
  methods: {
    reset() { // 重置
      this.startEnd = [getDate(6), getDate(0)]
      this.$refs.getarea.reset()
      this.listQuery = {
        page: 1,
        limit: 10,
        startTime: formatDate(getDate(6), 'yyyy-MM-dd') + ' 00:00:00',
        endTime: formatDate(getDate(0), 'yyyy-MM-dd') + ' 23:59:59',
        vehicleId: null,
        vehicleNo: null,
        areaId: null,
        platformId: null,
        owersId: null
      }
    },
    getSpeedList() { // 分页获取智能预警列表
      this.listLoading = true
      runDetail(this.listQuery).then(res => {
        console.log(res)
        if (res.code === 0) {
          this.listLoading = false
          this.data = res.data.rows
          this.total = res.data.totalCount
        }
      })
    },
    handleQuery() { // 查询
      this.listQuery.page = 1
      this.listQuery.limit = 10
      this.getSpeedList()
    },
    handleSizeChange(val) { // 分页
      this.listQuery.limit = val
      this.getSpeedList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getSpeedList()
    },
    alarmexport() { // Excel导出
      if (this.total > 50000) {
        this.$message('导出数据不能大于50000')
        return
      }
      detailEcexl(this.listQuery).then(result => {
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
      link.setAttribute('download', '车辆行车明细.xls')
      document.body.appendChild(link)
      link.click()
    },
    // 车辆选择 开始
    getCarList() {
      getChildrenVehList(this.carQuery).then(res => {
        res.data.rows.forEach(item => {
          if (item.activeStatus === 1) {
            item.activeStatus = '在线'
          } else if (item.activeStatus === 0) {
            item.activeStatus = '离线'
          }
        })
        this.carData = res.data.rows
        this.chooseTotal = res.data.totalCount
        this.chooseDialogVisible = true
        if (this.listQuery.vehicleNo) {
          const checkedrow = []
          let cidarr = []
          if (this.listQuery.vehicleNo.indexOf(',') !== -1) {
            cidarr = this.listQuery.vehicleNo.split(',')
          } else {
            cidarr.push(this.listQuery.vehicleNo)
          }
          res.data.rows.forEach(item => {
            cidarr.forEach(i => {
              if (i === item.vehicleNo) {
                checkedrow.push(item)
              }
            })
          })
          this.$nextTick(() => {
            checkedrow.forEach(row => {
              this.$refs.multipleTable.toggleRowSelection(row)
            })
          })
        }
      })
    },
    showChooseCar() {
      this.carQuery = {
        type: 4,
        page: 1,
        limit: 10,
        areaId: '',
        platformId: '',
        plateNo: '',
        owersId: ''
      }
      this.carQuery.platformId = this.listQuery.platformId
      this.carQuery.owersId = this.listQuery.owersId
      if (!this.carQuery.platformId) {
        this.$message('请先选择平台')
        return
      }
      this.getCarList()
      this.chooseDialogVisible = true
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
      if (this.superviseData.length === 0) {
        this.$message('请选择车辆')
        this.listQuery.vehicleId = null
        this.listQuery.vehicleNo = null
      } else {
        const arr = []
        const tmp = []
        this.superviseData.forEach(item => {
          arr.push(item.id)
          tmp.push(item.vehicleNo)
        })
        this.listQuery.vehicleId = arr.join()
        this.listQuery.vehicleNo = tmp.join()
      }
      this.chooseDialogVisible = false
    },
    handleSelectionChange(val) {
      this.superviseData = val
    }
    // 车辆选择 结束
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

<style >
  .el-pagination.is-background .el-pager li:not(.disabled).active {
    background-color: #5F7ABF;
    color: #fff;
  }
  .app-container .el-table__header-wrapper table thead tr th {
    background-color: #5F7ABF;
    color: #fff
  }
  .app-container .el-dialog__header {
    background-color: #5F7ABF;
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
    color: #5F7ABF;
    cursor: pointer;
  }
  .app-container .el-dialog__headerbtn {
    top: 10px
  }
</style>
