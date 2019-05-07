<template>
    <div class="realtime">
        <!-- 顶部过滤功能 -->
       <div style="background: #fff; margin: 0 20px; padding: 13px 10px 0 20px; border-radius: 5px; box-shadow: 0 0 10px #ccc">
            <el-form :inline="true" :model="filterForm" class="demo-form-inline">
                <search-byArea-and-three ref="areathree" :showOwers="false"
                  @chooseCar="(tmp) => {filterForm.vehicleId = tmp.id; filterForm.vehicleNo = tmp.vehicleNo}"
                  @selectAreaId="(id) => {filterForm.areaCode = id}"
                  @selectPlatformId="(id) => {filterForm.platformId = id}">
                </search-byArea-and-three>
                <el-form-item label="车辆类型">
                  <el-select clearable v-model="filterForm.vehicleType" @focus="getDownMenuList('vehicle_type')"
                    placeholder="请选择" style="width:150px" size="small">
                    <el-option v-for="item in vehicleTypeList"
                      :key="item.code" :label="item.value" :value="item.code">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="报警类型">
                  <el-popover placement="bottom" width="200">
                      <menu-tree ref="menuTree" style="height: 300px; overflow: auto" :treeMenuData="menus1" :treeMenuProp="defaultProps1" :checkedKeys="defaultChecked1"  @check-change="handleNodeChange"></menu-tree>
                      <el-input slot="reference" placeholder="请选择" v-model.trim="filterForm.codeName" style="width:150px;" size="small" readonly></el-input>
                    </el-popover>
                </el-form-item>
                <el-form-item label="报警等级">
                    <el-select v-model="filterForm.alarmLevel" placeholder="请选择" style="width: 150px">
                        <el-option
                         v-for="item in alarmLevels"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="督办状态">
                    <el-select v-model="filterForm.result" placeholder="请选择" style="width: 150px">
                        <el-option
                         v-for="item in statusOptions"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <!-- <el-form-item label="企业/业户">
                    <el-select v-model="filterForm.owersId" placeholder="请先选择运营商平台" style="width: 160px">
                        <el-option
                         v-for="item in deptOptions"
                         :key="item.id"
                         :label="item.owersName"
                         :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="报警来源">
                  <el-select v-model="filterForm.alarmSource" placeholder="请选择报警来源" style="width: 150px">
                    <el-option
                      v-for="item in alarmSourceOptions"
                      :key="item.code"
                      :label="item.value"
                      :value="item.code">
                    </el-option>
                    </el-select>
                </el-form-item> -->
                <el-form-item label="督办时间">
                   <el-date-picker
                    v-model="startEnd"
                    type="daterange"
                    style="width: 270px"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    range-separator="——"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :editable="false"
                    :clearable="false">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="逾期时长">
                    <el-select v-model="filterForm.delayTime" placeholder="请选择" style="width: 150px">
                        <el-option
                         v-for="item in timeeOptions"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item style="float: right">
                    <el-button @click="onSubmit" size="small" type="primary">查询</el-button>
                    <el-button @click="handleReset" size="small" type="primary">重置</el-button>
                    <el-button @click="handleExport" type="primary" size="small">导出</el-button>
                </el-form-item>
                <!-- <el-form-item>
                    <el-button @click="handleExport" size="small" type="primary" icon="el-icon-download">导出</el-button>
                </el-form-item> -->
            </el-form>
        </div>
        <!-- 表格主体部分 -->
        <el-row>
          <el-col :span="24">
            <div class="tableBody" style="padding: 20px 20px">
              <el-table
              ref="multipleTable"
              :data="tableData"
              tooltip-effect="dark"
              style="width:100%; border-radius: 5px; box-shadow: 0 0 10px #ccc" :header-cell-style="{ 'background-color': '#5F7ABF', 'color': '#fff', border: 'none !important' }"
              stripe
              border
              v-loading="loading"
              @selection-change="handleSelectionChange">
                <el-table-column
                type="selection"
                width="55">
                </el-table-column>
                <el-table-column
                type="index"
                width="60px"
                align="center"
                label="序号">
                </el-table-column>
                <el-table-column
                label="地区"
                align="center"
                prop="areaName"
                width="180px"
                show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                label="运营商平台"
                align="center"
                prop="platfromName"
                width="220px"
                show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                label="企业/业户"
                align="center"
                prop="owersName"
                width="220px"
                show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                prop="vehicleType"
                label="车辆类型"
                align="center"
                width="200px"
                show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                prop="vehicleNo"
                label="车牌号"
                align="center"
                show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                prop="alarmTypeName"
                align="center"
                label="报警类型"
                show-overflow-tooltip>
                </el-table-column>
                 <el-table-column
                prop="level"
                align="center"
                label="报警等级"
                show-overflow-tooltip>
                </el-table-column>
                <!-- <el-table-column
                prop="alarmSourceName"
                align="center"
                label="报警来源"
                show-overflow-tooltip>
                </el-table-column> -->
                <el-table-column
                prop="alarmTime"
                label="报警时间"
                align="center"
                width="180px"
                show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                prop="speed"
                label="报警速度"
                align="center"
                show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                prop="location"
                align="center"
                label="报警位置"
                show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                prop="result"
                align="center"
                label="督办状态"
                show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                prop="createTime"
                label="督办时间"
                align="center"
                width="180px"
                show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                prop="endTime"
                label="督办截止时间"
                align="center"
                width="180px"
                show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                prop="ackTime"
                label="督办处理时间"
                align="center"
                width="180px"
                show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                prop="delayTime"
                align="center"
                label="逾期时长"
                show-overflow-tooltip>
                </el-table-column>
              </el-table>
            </div>
          </el-col>
        </el-row>
        <!-- 分页 -->
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="filterForm.page"
          :page-sizes="[10,20,30, 50]" :page-size="filterForm.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
        <!-- 选择车辆弹出框 -->
         <el-dialog title="选择车辆" :visible.sync="chooseDialogVisible" class="allotDialog" :close-on-click-modal="false">
          <el-row>
            <!-- <el-col :span="6" style="border: 1px solid #ccc; min-height: 400px; max-height: 600px; overflow: hidden">
              <el-tree :data="menus" @node-click="deptFilter" :props="defaultProps" default-expand-all :expand-on-click-node="false" style="background: #fff; height: 400px; overflow: auto"></el-tree>
            </el-col> -->
            <el-col :span="23" :offset="1">
              <div class="searchInput" style="overflow: hidden">
                车牌号: <el-input placeholder="请输入车牌号" v-model="queryCar.plateNo" style="width: 200px;" size="small"></el-input>
                <el-button style="background-color:#5F7ABF;color:#fff;border-radius:5px;" size="small" @click="vnFilter">查询</el-button>
                <el-button size="small" style="float:right;background-color:#5F7ABF;color:#fff;border-radius:5px;" @click="chooseCar">确定</el-button>
              </div>
              <div>
                <el-table ref="multipleTable" :data="carData"
                  :header-cell-style="{ 'background-color': '#5F7ABF', 'color': '#fff' }" :row-key="getRowKeys"
                  style="margin-top: 10px;width:100%" stripe border @selection-change="handleSelectionChange">
                  <el-table-column type="selection" :reserve-selection="true" width="40"></el-table-column>
                  <el-table-column
                    label="车牌号"
                    align="center"
                    prop="vehicleNo"
                    min-width="100px">
                  </el-table-column>
                  <el-table-column
                    prop="activeStatus"
                    align="center"
                    label="状态"
                    min-width="50px">
                    <template slot-scope="scope">
                      <span v-if="scope.row.activeStatus === '在线'" style="color:#13CE66">{{ scope.row.activeStatus }}</span>
                      <span v-else>{{ scope.row.activeStatus }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="platformName"
                    align="center"
                    label="运营商平台"
                    min-width="120px"
                    show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column
                    prop="owersName"
                    align="center"
                    label="企业/业户"
                    min-width="120px"
                    show-overflow-tooltip="">
                  </el-table-column>
                </el-table>
              </div>
              <el-pagination small background @current-change="handlePageChange" :current-page="queryCar.page" :page-size="queryCar.limit" layout="total, prev, pager, next" :total="chooseTotal" style="margin-top: 20px">
              </el-pagination>
            </el-col>
          </el-row>
        </el-dialog>
        <!-- <footer-bar></footer-bar> -->
    </div>
</template>
<script>
import { getHistory } from '@/api/alarm/history'
import { getPermsList } from '@/api/alarm/supervise'
import { owersListByPlatform } from '@/api/base/company'
// import { parseTime } from '@/utils'
import { getAlarmSource } from '@/api/alarm/supervise'
import FooterBar from '../FooterBar'
import { formatDate } from '@/utils/date.js'
import { alarmtypetree } from '@/api/alarm/alarmPC'
import { getChildrenVehList } from '@/api/vehicle/choiceCar'
import { getDownMenu } from '@/api/infomationM/dict'
import menuTree from './menuTree'
import SearchByAreaAndThree from '@/components/Search/SearchByAreaAndThree'

export default {
  components: { FooterBar, menuTree, SearchByAreaAndThree },
  data() {
    return {
      startEnd: [new Date(), new Date()],
      loading: true,
      filterForm: {
        page: 1,
        limit: 10,
        alarmSource: '',
        platformId: '',
        areaCode: '',
        vehicleType: '',
        owersId: '',
        vehicleNo: '',
        alarmType: '',
        alarmLevel: '',
        processingTime: '',
        result: '',
        createBeginTime: formatDate(new Date(), 'yyyy-MM-dd'),
        createEndTime: formatDate(new Date(), 'yyyy-MM-dd'),
        delayTime: '',
        codeName: ''
      },
      carQuery: {
        page: 1,
        limit: 5,
        vehicleNo: '',
        owersId: ''
      },
      defaultProps1: {
        children: 'children',
        label: 'label'
      },
      defaultProps: {
        children: 'children',
        label: 'text'
      },
      defaultChecked1: [],
      chooseTotal: 0,
      alarmSourceOptions: [],
      chooseDialogVisible: false,
      menus1: [],
      menus: [],
      carData: [],
      textarea: '',
      nameOptions: [],
      deptOptions: [],
      alarmLevels: [{
        value: '1',
        label: '一级'
      },
      {
        value: '2',
        label: '二级'
      }],
      statusOptions: [{
        value: '0',
        label: '处理中'
      },
      {
        value: '1',
        label: '已处理完毕'
      },
      {
        value: '2',
        label: '不作处理'
      },
      {
        value: '3',
        label: '将来处理'
      },
      {
        value: '9',
        label: '督办逾期'
      }],
      timeeOptions: [{
        value: '0',
        label: '30分钟'
      },
      {
        value: '1',
        label: '2小时'
      },
      {
        value: '2',
        label: '4小时'
      },
      {
        value: '3',
        label: '8小时'
      },
      {
        value: '4',
        label: '1天'
      },
      {
        value: '5',
        label: '3天'
      },
      {
        value: '6',
        label: '3天以上'
      }],
      tableData: [],
      total: 0,
      superviseForm: {
        platformId: '',
        endTime: '',
        level: '1'
      },
      queryCar: {
        type: 1,
        page: 1,
        limit: 10,
        areaId: '',
        platformId: '',
        plateNo: ''
      },
      vehicleTypeList: [],
      areaList: []
    }
  },
  methods: {
    handleReset() {
      this.filterForm = {
        page: 1,
        limit: 10,
        platformId: '',
        areaCode: '',
        vehicleType: '',
        owersId: '',
        vehicleNo: '',
        alarmType: '',
        codeName: '',
        alarmLevel: '',
        processingTime: '',
        result: '',
        createBeginTime: '',
        createEndTime: '',
        delayTime: ''
      }
      this.startEnd = []
      this.queryCar.areaId = ''
      this.startEnd = [formatDate(new Date(), 'yyyy-MM-dd'), formatDate(new Date(), 'yyyy-MM-dd')]
      this.queryCar.platformId = ''
      this.queryCar.plateNo = ''
      this.areaList = []
      this.nameOptions = []
      this.$refs.menuTree.setCheckedNull()
      this.$refs.areathree.reset()
      this.selectNo = ''
      this.superviseData = []
    },
    onSubmit() {
      this.getList()
    },
    getRowKeys(row) {
      // this.selectNo = row.vehicleNo
      return row.id
    },
    handleSelectionChange(val) {
      this.superviseData = val
      console.log(this.superviseData)
    },
    handlePageChange(val) {
      this.queryCar.page = val
      this.getCarList()
    },
    handleSizeChange(val) {
      this.filterForm.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.filterForm.page = val
      this.getList()
    },
    vnFilter() {
      this.carQuery.page = 1
      this.getCarList()
    },
    getList() {
      this.loading = true
      getHistory(this.filterForm).then(res => {
        res.data.rows.forEach(item => {
          if (item.result === 0) {
            item.result = '处理中'
          } else if (item.result === 1) {
            item.result = '已处理完毕'
          } else if (item.result === 2) {
            item.result = '不作处理'
          } else if (item.result === 3) {
            item.result = '将来处理'
          } else if (item.result === 9) {
            item.result = '督办逾期'
          }
          if (item.level === 2) {
            item.level = '二级'
          } else if (item.level === 1) {
            item.level = '一级'
          }
        })
        this.tableData = res.data.rows
        this.total = res.data.totalCount
        this.loading = false
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
    chooseCar(row) {
      // if (this.superviseData.length === 0) {
      console.log(this.superviseData)
      if (this.superviseData === undefined) {
        this.$message({
          type: 'error',
          message: '请选择车辆'
        })
      } else if (this.superviseData.length === 0) {
        this.$message({
          type: 'error',
          message: '请选择车辆'
        })
      } else {
        console.log(this.superviseData)
        const arr = []
        const tmp = []
        this.superviseData.forEach(item => {
          arr.push(item.id)
          tmp.push(item.vehicleNo)
        })
        this.filterForm.vehicleId = arr.join()
        this.filterForm.vehicleNo = tmp.join()
        this.chooseDialogVisible = false
      }
      console.log(this.filterForm)
    },
    showChooseCar() {
      this.queryCar.type = 4
      this.queryCar.platformId = this.filterForm.platformId
      if (!this.queryCar.platformId) {
        this.$message('请先选择平台')
        return
      }
      this.getCarList()
      this.chooseDialogVisible = true
    },
    getCarList() {
      this.queryCar.type = 4
      // this.$refs.multipleTable.clearSelection()
      getChildrenVehList(this.queryCar).then(res => {
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
        if (this.filterForm.vehicleNo || this.selectNo) {
          const checkedrow = []
          let cidarr = []
          let no = this.selectNo
          if (this.filterForm.vehicleNo) no = this.filterForm.vehicleNo
          if (no.indexOf(',') !== -1) {
            cidarr = no.split(',')
          } else {
            cidarr.push(no)
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
              this.$refs.multipleTable.toggleRowSelection(row, true)
            })
          })
        } else {
          this.$refs.multipleTable.clearSelection()
        }
      })
    },
    gettypetree() {
      alarmtypetree().then(res => {
        this.menus1 = [res.data.事故报警, res.data.违规报警, res.data.主动防控报警]
      })
    },
    handleNodeChange(val) {
      const arr = []
      const tmp = []
      this.count = val.length
      val.forEach(item => {
        arr.push(item.code)
        tmp.push(item.label)
      })
      this.filterForm.codeName = tmp.join()
      this.filterForm.alarmType = arr.join()
    },
    // handleExport() { // 导出
    //   import('@/vendor/Export2Excel').then(excel => {
    //     const tHeader = ['运营商平台', '企业/业户', '车牌号', '报警类型', '报警来源', '报警时间', '速度', '位置', '督办时间', '督办状态', '逾期时长']
    //     const filterVal = ['platfromName', 'owersName', 'vehicleNo', 'alarmTypeName', 'alarmSourceName', 'alarmTime', 'speed', 'location', 'createTime', 'result', 'delayTime']
    //     const list = this.tableData
    //     const data = this.formatJson(filterVal, list)
    //     excel.export_json_to_excel({
    //       header: tHeader,
    //       data,
    //       filename: '督办记录第' + this.filterForm.page + '页',
    //       autoWidth: true
    //     })
    //   })
    // },
    // formatJson(filterVal, jsonData) {
    //   return jsonData.map(v => filterVal.map(j => {
    //     if (j === 'timestamp') {
    //       return parseTime(v[j])
    //     } else {
    //       return v[j]
    //     }
    //   }))
    // },
    handleExport() {
      // 导出功能
    },
    getAreaList() {
      this.queryCar.type = 1
      getChildrenVehList(this.queryCar).then(res => {
        this.loading = false
        this.areaList = res.data
      })
    },
    selectArea(area) {
      this.queryCar.areaId = area
    },
    getPlatformList() {
      this.queryCar.type = 2
      getChildrenVehList(this.queryCar).then(res => {
        this.loading = false
        this.nameOptions = res.data
      })
    },
    selectPlatform(platformId) {
      this.queryCar.platformId = platformId
    },
    // 获取下拉框数据
    getDownMenuList(type) {
      getDownMenu(type).then(response => {
        this.vehicleTypeList = response.data
      })
    }
  },
  computed: {
    getPlatformId() {
      return this.filterForm.platformId
    }
  },
  watch: {
    startEnd: {
      handler(val, oldVal) {
        if (val.length !== 0) {
          this.filterForm.createBeginTime = val[0]
          this.filterForm.createEndTime = val[1]
        } else {
          this.filterForm.createBeginTime = ''
          this.filterForm.createEndTime = ''
        }
      },
      deep: true
    },
    getPlatformId: {
      handler(val, oldVal) {
        if (val !== '') {
          owersListByPlatform(this.filterForm.platformId).then(res => {
            this.deptOptions = res.data
          })
        } else {
          this.deptOptions = []
        }
      }
    }
  },
  mounted() {
    this.getList()
    this.gettypetree()
    getPermsList().then(res => {
      this.nameOptions = res.data
    })
    getAlarmSource().then(res => {
      this.alarmSourceOptions = res.data
    })
  }
}
</script>
<style>
  .el-dialog__headerbtn {
      position: absolute;
      top: 14px;
      right: 20px;
      padding: 0;
      background: 0 0;
      border: none;
      outline: 0;
      cursor: pointer;
      font-size: 16px;
  }
  .realtime .el-dialog__header i {
    color: #fff;
  }
  .el-pagination.is-background .el-pager li:not(.disabled).active{
    background-color: #5F7ABF;
  }
  .el-button--primary {
      color: #fff;
      background-color: #5F7ABF;
      border-color: #5F7ABF;
  }
  .realtime .el-dialog__header span {
    color: #fff;
    font-size: 14px;
  }
  .realtime .el-dialog__header {
    background-color: #5F7ABF;
    height: 40px;
    padding-top: 10px;
  }
</style>
