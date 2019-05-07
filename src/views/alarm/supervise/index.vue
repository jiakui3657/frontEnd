<template>
    <div class="realtime">
        <!-- 顶部过滤功能 -->
        <div style="background: #fff; margin: 0 20px; padding: 13px 10px 0 20px; border-radius: 5px; box-shadow: 0 0 10px #ccc">
            <el-form :inline="true" label-width="80px" :model="filterForm" class="demo-form-inline" style="overflow: hidden">
                <el-form-item label="处理状态">
                    <el-select v-model="filterForm.status" style="width: 200px" @change="getfixtype">
                        <el-option
                          v-for="item in fixTypeOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="所属地区">
                    <el-select clearable v-model="filterForm.areaCode" :loading="loading" @change="selectArea(filterForm.areaCode)"
                      @focus="getAreaList" placeholder="请选择" style="width: 200px">
                        <el-option
                         v-for="item in areaList"
                         :key="item.areaCode"
                         :label="item.areaName"
                         :value="item.areaCode">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="运营商平台" label-width="90px">
                    <el-select clearable v-model="filterForm.platformId" :loading="loading" @change="selectPlatform(filterForm.platformId)"
                      @focus="getPlatformList" placeholder="请选择" style="width: 200px">
                        <el-option
                         v-for="item in nameOptions"
                         :key="item.platformId"
                         :label="item.platformName"
                         :value="item.platformId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="选择车辆">
                  <el-input  placeholder="请选择车辆" v-model.trim="filterForm.vehicleNo" style="width:150px;" size="small" readonly @focus="showChooseCar" clearable></el-input>
                </el-form-item>
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
                      <menu-tree style="height: 300px; overflow: auto" ref="getmenu" :treeMenuData="menus1" :treeMenuProp="defaultProps1" :checkedKeys="defaultChecked1"  @check-change="handleNodeChange"></menu-tree>
                      <el-input slot="reference" placeholder="请选择" v-model.trim="filterForm.codeName" style="width:150px;" size="small" readonly></el-input>
                    </el-popover>
                </el-form-item>
                <el-form-item label="报警等级">
                    <el-select clearable v-model="filterForm.alarmLevel" placeholder="请选择" style="width: 150px">
                        <el-option
                         v-for="item in levelOptions"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="处理耗时" v-show="longTime">
                    <el-select clearable v-model="filterForm.hendlerConsume" placeholder="请选择" style="width: 150px">
                        <el-option
                         v-for="item in longTimeOptions"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="延迟时长" v-show="delaylongTime">
                    <el-select clearable v-model="filterForm.delayHendlerConsume" placeholder="请选择" style="width: 150px">
                        <el-option
                         v-for="item in delaylongTimeOptions"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="查询时间">
                  <el-date-picker
                    :editable='false'
                    v-model="startEnd"
                    type="daterange"
                    style="width: 270px"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    range-separator="——"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :clearable="false">
                  </el-date-picker>
                </el-form-item>
                <el-form-item style="float: right">
                  <el-button @click="onSubmit" size="small" type="primary">查询</el-button>
                  <el-button @click="handleReset" size="small" type="primary">重置</el-button>
                  <el-button @click="handleExport" type="primary" size="small">导出</el-button>
                  <el-button v-show="delaylongTime" @click="supervise" :disabled="isSupervise" size="small" type="primary">批量督办</el-button>
                </el-form-item>
                <!--<el-form-item v-show="delaylongTime">-->
                  <!--<el-button @click="supervise" :disabled="isSupervise" size="small" type="primary">批量督办</el-button>-->
                <!--</el-form-item>-->
            </el-form>
        </div>
        <!-- 表格主体部分 -->
        <el-row>
          <el-col :span="24">
            <div class="tableBody" style="padding: 20px; min-height: 200px ">
              <el-table v-show="b1"
              ref="multipleTable"
              :data="tableData"
              tooltip-effect="dark"
              stripe
              border
              v-loading="loading"
              style="width:100%; border-radius: 5px; box-shadow: 0 0 10px #ccc" :header-cell-style="{ 'background-color': '#5F7ABF', 'color': '#fff', border: 'none !important' }"
              @selection-change="handleSelectionChange">
                <el-table-column
                type="selection"
                width="50">
                </el-table-column>
                <el-table-column
                type="index"
                width="60px"
                label="序号"
                align="center">
                </el-table-column>
                <el-table-column
                label="地区"
                align="center"
                prop="areaName"
                width="200px"
                show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                label="运营商平台"
                align="center"
                prop="plartformName"
                width="200px"
                show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                prop="owersName"
                align="center"
                label="企业/业户"
                width="200px"
                show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                prop="plateNo"
                align="center"
                label="车牌号"
                width="120px"
                show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                align="center"
                prop="vehicleColorName"
                label="车辆颜色"
                width="120px"
                show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                align="center"
                prop="vehicleType"
                label="车辆类型"
                width="120px"
                show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                align="center"
                prop="alarmTypeName"
                label="报警类型"
                width="120px"
                show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                prop="alarmLevel"
                label="报警等级"
                align="center"
                width="120px"
                show-overflow-tooltip>
                </el-table-column>
                <!-- <el-table-column
                prop="status"
                label="报警处理状态"
                align="center"
                width="120px"
                show-overflow-tooltip>
                 </el-table-column> -->
                <el-table-column
                prop="result"
                label="督办处理状态"
                align="center"
                width="120px"
                show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                prop="alarmStart"
                align="center"
                label="报警时间"
                width="180px"
                show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                prop="delayHendlerConsume"
                label="延迟处理时长"
                align="center"
                width="120px"
                show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                prop="speed"
                label="报警速度(km/h)"
                align="center"
                width="150px"
                show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                prop="alarmAddress"
                label="报警位置"
                align="center"
                width="180px"
                show-overflow-tooltip>
                </el-table-column>
                <el-table-column align="center" label="操作" fixed="right" width="300px">
                  <template slot-scope="scope">
                      <el-button  size="small" type="primary" :disabled="scope.row.result!=='-'" @click="handleSupervise(scope.row)">督办</el-button>
                      <el-button size="small" type="primary" @click="handleSAllot(scope.row)">获取证据</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <!--已处理-->
              <el-table v-show="a1" :data="handleData" :columns="columns" v-loading.body="loading" border stripe style="width:100%; border-radius: 5px; box-shadow: 0 0 10px #ccc" :header-cell-style="{ 'background-color': '#5F7ABF', 'color': '#fff' }">
                <el-table-column align="center" type="index" width="60px" label="序号" fixed="left"></el-table-column>
                <el-table-column align="center" v-for="column in columns" :key="column.key" :label="column.title" :min-width="column.width" show-overflow-tooltip :fixed="column.fixed">
                  <template slot-scope="scope">
                    <span>{{scope.row[column.key]}}</span>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="操作" fixed="right" width="300px">
                  <template slot-scope="scope">
                       <el-button size="small" type="primary" @click="handleSAllot(scope.row)">获取证据</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-col>
        </el-row>
        <!-- 分页 -->
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="filterForm.page"
            :page-sizes="[10,20,30, 50]" :page-size="filterForm.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        <!-- 督办弹出框 -->
        <el-dialog title="督办" :visible.sync="dialogVisible" :close-on-click-modal="false">
          <el-form :model="superviseForm" :rules="rules" ref="superviseForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="督办截止时间" prop="endTime" labelWidth="120px">
              <el-date-picker
                v-model="superviseForm.endTime"
                type="datetime"
                :editable="false"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期"
                :picker-options="pickerOptions">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="督办级别" prop="level" labelWidth="120px">
              <el-select v-model="superviseForm.level" placeholder="请选择">
                <el-option
                  v-for="item in levelDb"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogVisible = false">取 消</el-button>
                <el-button size="small" type="primary" v-show="isBatch" @click="handleSubmit('superviseForm')">确 定</el-button>
                <el-button size="small" type="primary" v-show="!isBatch" @click="handleBatchSubmit('superviseForm')">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 获取证据弹出框 -->
        <el-dialog title="获取证据" :visible.sync="identDialog" :close-on-click-modal="false">
          <div style="width:100%;text-align: center;">
            <p style="text-align: left;">车牌号：{{wsVehicleNo}}</p>
          </div>
          <div style="width:100%;text-align: center;">
            <p style="text-align: left;">报警类型：{{wsAlarmType}}</p>
          </div>
          <div style="width:100%;text-align: center;">
            <p style="text-align: left;">图片</p>
            <img width="33.33%" height="200" style="padding: 0 2px;" v-for="item in wsImage" :src="item.fileUrl">
          </div>
          <div style="width:100%;text-align: center;">
            <p style="text-align: left;">视频</p>
            <video controls width="33.33%" height="200px" style="padding:0 2px;object-fit:fill;" v-for="item in wsVideo">
              <source :src="item.fileUrl"  type="video/mp4">
            </video>
          </div>
          <div style="width:100%;">
            <p style="text-align: left;">文件</p>
            <a style="display:block;" v-for="item in wsFile" download="" :href="item.fileUrl">
              <span>{{ item.fileName }}</span>
              <el-button type="primary">下载<i class="el-icon-download el-icon--right"></i></el-button>
            </a>
          </div>
        </el-dialog>
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
                  :header-cell-style="{ 'background-color': '#5F7ABF', 'color': '#fff' }"
                  :row-key="getRowKeys"
                  style="margin-top: 10px;width:100%" stripe border @selection-change="handleChange">
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
                    show-overflow-tooltip>
                  </el-table-column>
                </el-table>
              </div>
              <el-pagination small background @current-change="handlePageChange" :current-page="queryCar.page" :page-size="queryCar.limit" layout="total, prev, pager, next" :total="chooseTotal" style="margin-top: 20px">
              </el-pagination>
            </el-col>
          </el-row>
        </el-dialog>
        <!-- <footer-bar></footer-bar> -->
        <div v-if="loadingZZ" class="zzloading">
          <div class="zzloading-spinner">
            <i class="el-icon-loading"></i>
            <p class="zzloading-text">正在获取报警附件，请稍后 {{nums}} s</p>
          </div>
        </div>
    </div>
</template>
<script>
import { getAlarminfoCore, getAlarmSource } from '@/api/alarm/supervise'
import { owersListByPlatform } from '@/api/base/company'
import { getToken } from '@/utils/auth'
import { getAlarmType } from '@/api/alarm/history'
import { alarmtypetree } from '@/api/alarm/alarmPC'
import menuTree from './menuTree'
import FooterBar from '../FooterBar'
import { getChildrenVehList } from '@/api/vehicle/choiceCar'
import { getDownMenu } from '@/api/infomationM/dict'
import { formatDate, getDateEnd } from '@/utils/date.js'
export default {
  components: { menuTree, FooterBar },
  data() {
    return {
      loadingZZ: false,
      nums: 3,
      longTime: false, // 数据切换 开始
      delaylongTime: true,
      a1: false,
      b1: true,
      handleData: [],
      columns: [
        {
          key: 'plartformName',
          title: '运营商平台',
          width: '100'
        },
        {
          key: 'owersName',
          title: '企业/业户',
          width: '100'
        },
        {
          key: 'plateNo',
          title: '车牌号',
          width: '100'
        },
        {
          key: 'vehicleColorName',
          title: '车辆颜色',
          width: '100'
        },
        {
          key: 'vehicleType',
          title: '车辆类型',
          width: '100'
        },
        {
          key: 'alarmTypeName',
          title: '报警类型',
          width: '100'
        },
        {
          key: 'alarmLevel',
          title: '报警等级',
          width: '100'
        },
        {
          key: 'status',
          title: '报警处理状态',
          width: '100'
        },
        {
          key: 'result',
          title: '督办处理状态',
          width: '100'
        },
        {
          key: 'alarmStart',
          title: '报警时间',
          width: '100'
        },
        {
          key: 'speed',
          title: '报警速度',
          width: '100'
        },
        {
          key: 'alarmAddress',
          title: '报警位置',
          width: '100'
        },
        {
          key: 'handleTime',
          title: '处理时间',
          width: '100'
        },
        {
          key: 'delayHendlerConsume',
          title: '处理耗时',
          width: '100'
        }
      ],
      dataMsg: '',
      carData: [],
      chooseTotal: 0,
      identDialog: false,
      chooseDialogVisible: false,
      startEnd: [new Date(), new Date()],
      isSupervise: true,
      loading: true,
      typeOptions: [],
      menus1: [],
      menus: [],
      defaultProps1: {
        children: 'children',
        label: 'label'
      },
      defaultProps: {
        children: 'children',
        label: 'text'
      },
      defaultChecked1: [],
      isBatch: true,
      superviseData: '',
      superviseDate: '',
      filterForm: {
        page: 1,
        limit: 10,
        alarmType: '',
        platformId: '',
        areaCode: '',
        vehicleType: '',
        owersId: '',
        vehicleNo: '',
        beginTime: formatDate(new Date(), 'yyyy-MM-dd'),
        endTime: formatDate(new Date(), 'yyyy-MM-dd'),
        alarmSource: '',
        result: '',
        status: '9',
        codeName: ''
      },
      alarmSourceOptions: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < (Date.now())
        }
      },
      rules: {
        endTime: [
          { required: true, message: '请选择督办截止时间', trigger: 'blur' }
        ],
        level: [
          { required: true, message: '请选择督办级别', trigger: 'blur' }
        ]
      },
      resultOptions: [{
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
        label: '未处理'
      }],
      statusOptions: [{
        value: '9',
        label: '待处理'
      },
      {
        value: '1',
        label: '已处理'
      }],
      longTimeOptions: [
        {
          value: '0',
          label: '10分钟内'
        },
        {
          value: '1',
          label: '30分钟内'
        },
        {
          value: '2',
          label: '2小时内'
        },
        {
          value: '3',
          label: '6小时内'
        },
        {
          value: '4',
          label: '24小时内'
        },
        {
          value: '5',
          label: '超过一天'
        }
      ],
      delaylongTimeOptions: [
        {
          value: '3',
          label: '6小时内'
        },
        {
          value: '0',
          label: '6小时至12小时'
        },
        {
          value: '1',
          label: '12小时至1天'
        },
        {
          value: '2',
          label: '1天至3天'
        },
        {
          value: '4',
          label: '3天以上'
        }
      ],
      dialogVisible: false,
      areaList: [],
      nameOptions: [],
      deptOptions: [],
      fixTypeOptions: [{
        value: '9',
        label: '未处理'
      }, {
        value: '1',
        label: '已处理'
      }],
      levelOptions: [
        {
          value: 1,
          label: '一级'
        },
        {
          value: 2,
          label: '二级'
        }
      ],
      levelDb: [
        {
          value: 1,
          label: '一级'
        },
        {
          value: 2,
          label: '二级'
        }
      ],
      tableData: [],
      total: 0,
      superviseForm: {
        platformId: '',
        endTime: '',
        level: ''
      },
      userInfo: {},
      wsVehicleNo: '',
      wsAlarmType: '',
      wsImage: [],
      wsVideo: [],
      wsFile: [],
      queryCar: {
        type: 1,
        page: 1,
        limit: 10,
        areaId: '',
        platformId: '',
        plateNo: ''
      },
      vehicleTypeList: []
    }
  },
  methods: {
    handleReset() {
      this.$refs.getmenu.reset()
      this.filterForm = {
        page: 1,
        limit: 10,
        alarmType: '',
        platformId: '',
        areaCode: '',
        vehicleType: '',
        owersId: '',
        vehicleNo: '',
        vehicleId: '',
        beginTime: '',
        endTime: '',
        codeName: '',
        status: '9'
      }
      this.tableData = []
      this.handleData = []
      this.startEnd = [formatDate(new Date(), 'yyyy-MM-dd'), formatDate(new Date(), 'yyyy-MM-dd')]
      this.filterForm.beginTime = this.startEnd[0]
      this.filterForm.endTime = this.startEnd[1]
      this.a1 = false
      this.b1 = true
      this.longTime = false
      this.delaylongTime = true
      this.areaList = []
      this.nameOptions = []
      this.queryCar.areaId = ''
      this.queryCar.platformId = ''
      this.selectNo = ''
    },
    handleExport() {
      // 导出功能
    },
    showChooseCar() { // 选择车辆
      this.queryCar = {
        type: 1,
        page: 1,
        limit: 10,
        areaId: '',
        platformId: '',
        plateNo: ''
      }
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
    vnFilter() {
      this.queryCar.page = 1
      this.getCarList()
    },
    deptFilter(data) {
      this.queryCar.owersId = data.id
      if (data.id === '0') {
        this.queryCar.owersId = ''
      }
      this.queryCar.page = 1
      this.getCarList()
    },
    getRowKeys(row) {
      this.selectNo = row.vehicleNo
      return row.id
    },
    handlePageChange(val) {
      this.queryCar.page = val
      this.getCarList()
    },
    chooseCar(row) {
      if (this.superviseDate.length === 0) {
        this.$message('请选择车辆')
        this.filterForm.vehicleId = null
        this.filterForm.vehicleNo = null
      } else {
        const arr = []
        const tmp = []
        this.superviseDate.forEach(item => {
          arr.push(item.id)
          tmp.push(item.vehicleNo)
        })
        this.filterForm.vehicleId = arr.join()
        this.filterForm.vehicleNo = tmp.join()
      }
      this.chooseDialogVisible = false
      console.log(this.filterForm)
    },
    onSubmit() {
      this.total = 0 // 切换清空条数
      this.getList()
    },
    getfixtype(val) { // 监听处理情况
      this.handleReset()
      this.filterForm.status = val
      if (val === '1') {
        this.longTime = true
        this.delaylongTime = false
        this.a1 = true
        this.b1 = false
        this.onSubmit()
      } else {
        this.longTime = false
        this.delaylongTime = true
        this.a1 = false
        this.b1 = true
        this.onSubmit()
      }
    },
    supervise() {
      this.superviseForm.endTime = formatDate(getDateEnd(1), 'yyyy-MM-dd hh:mm:ss')
      this.superviseForm.level = ''
      this.isBatch = false
      this.dialogVisible = true
    },
    handleSelectionChange(val) {
      console.log('1')
      console.log(val)
      if (val.length > 0) {
        this.isSupervise = false
      } else {
        this.isSupervise = true
      }
      for (var i = 0; i < val.length; i++) {
        console.log(val[i])
        if (val[i].result !== '-') {
          this.$message({
            message: '请选择正确信息',
            type: 'error'
          })
          this.isSupervise = true
        }
      }
      this.superviseData = val
    },
    handleChange(val) {
      this.superviseDate = val
      console.log(this.superviseDate)
    },
    handleSizeChange(val) {
      this.filterForm.limit = val
      this.getList()
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
    handleCurrentChange(val) {
      this.filterForm.page = val
      this.getList()
    },
    gettypetree() {
      alarmtypetree().then(res => {
        this.menus1 = [res.data.事故报警, res.data.违规报警, res.data.主动防控报警]
      })
    },
    // 单一督办
    handleSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const data = {
            Command: '46',
            CommandType: 'Business',
            token: getToken('Admin-Token'),
            Body: {
              data: [
                {
                  userId: this.userInfo.userId,
                  vehicleNo: this.superviseData.plateNo,
                  warnId: this.superviseData.id,
                  warnTime: this.superviseData.alarmStart,
                  endTime: this.superviseForm.endTime,
                  level: this.superviseForm.level,
                  supervisor: this.userInfo.username,
                  supervisionTel: this.userInfo.mobile,
                  supervisionEmail: this.userInfo.email
                }
              ]
            }
          }
          if (this.websocket.readyState === 1) {
            console.log(data)
            this.websocket.send(JSON.stringify(data))
            this.dialogVisible = false
            this.$message.success('督办发送成功!')
            this.getList()
          } else {
            this.$message.error('发送失败，请稍候重试!')
          }
        }
      })
    },
    // 批量督办
    handleBatchSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const tmp = []
          this.superviseData.forEach(item => {
            tmp.push({
              userId: this.userInfo.userId,
              vehicleNo: item.plateNo,
              warnId: item.id,
              warnTime: item.alarmStart,
              endTime: this.superviseForm.endTime,
              level: this.superviseForm.level,
              supervisor: this.userInfo.username,
              supervisionTel: this.userInfo.mobile,
              supervisionEmail: this.userInfo.email
            })
          })
          const data = {
            Command: '46',
            CommandType: 'Business',
            token: getToken('Admin-Token'),
            Body: {
              data: tmp
            }
          }
          if (this.websocket.readyState === 1) {
            this.websocket.send(JSON.stringify(data))
            this.dialogVisible = false
            this.$message.success('督办发送成功!')
            this.getList()
          } else {
            this.$message.error('发送失败，请稍候重试!')
          }
        }
      })
    },
    handleSupervise(row) {
      console.log(row)
      this.isBatch = true
      this.superviseForm.endTime = formatDate(getDateEnd(1), 'yyyy-MM-dd hh:mm:ss')
      this.superviseForm.level = ''
      this.dialogVisible = true
      this.superviseData = row
      this.$nextTick(() => {
        this.$refs['superviseForm'].clearValidate()
      })
    },
    handleSAllot(row) {
      console.log(row.id)
      console.log(row.plateNo)
      // this.identDialog = true
      const data = {
        Command: '56',
        CommandType: 'Business',
        token: getToken('Admin-Token'),
        Body: {
          data: {
            vehicleNo: row.plateNo,
            alarmId: row.id
          }
        }
      }
      if (this.websocket.readyState === 1) {
        console.log('WebSocket请求' + JSON.stringify(data))
        this.websocket.send(JSON.stringify(data))
        this.wsAlarmType = row.alarmTypeName // 报警类型
        this.loadingZZ = true
        const a = () => {
          setTimeout(() => {
            if (this.loadingZZ) {
              this.nums--
              if (this.nums >= 1) {
                a()
              } else {
                this.loadingZZ = false
                this.nums = 3
                this.$message.error('该报警未上传附件')
              }
            }
          }, 1000)
        }
        a()
        // setTimeout(() => {
        //   if (this.loadingZZ) {
        //     this.loadingZZ = false
        //     this.$message.error('该报警未上传附件')
        //   }
        //   this.nums = 3
        // }, 3000)
      } else {
        this.$message.error('发送失败，请稍候重试!')
      }
    },
    getList() {
      this.loading = true
      console.log(this.filterForm)
      getAlarminfoCore(this.filterForm).then(res => {
        for (var i = 0; i < res.data.rows.length; i++) {
          if (res.data.rows[i].alarmLevel === 1) {
            res.data.rows[i].alarmLevel = '一级'
          } else if (res.data.rows[i].alarmLevel === 2) {
            res.data.rows[i].alarmLevel = '二级'
          }
          if (res.data.rows[i].alarmTypeName === '其他报警') {
            res.data.rows[i].alarmLevel = '-'
          }

          if (res.data.rows[i].status === 9) {
            res.data.rows[i].status = '未处理'
          } else {
            res.data.rows[i].status = '已处理'
          }

          if (res.data.rows[i].result === 0) {
            res.data.rows[i].result = '处理中'
          } else if (res.data.rows[i].result === 1) {
            res.data.rows[i].result = '已处理完毕'
          } else if (res.data.rows[i].result === 2) {
            res.data.rows[i].result = '不作处理'
          } else if (res.data.rows[i].result === 3) {
            res.data.rows[i].result = '将来处理'
          } else if (res.data.rows[i].result === 9) {
            res.data.rows[i].result = '-'
          }
        }
        this.tableData = res.data.rows
        this.handleData = res.data.rows
        this.total = res.data.totalCount
        this.loading = false
      })
    },
    initWebSocket() {
      const vm = this
      vm.websocket = new WebSocket(process.env.WEBSOCKET_API)
      vm.websocket.onopen = function() {
        // vm.$message.success('websocket连接成功')
        console.log('连接中。。。。。。。。。')
      }
      vm.websocket.onmessage = function(evt) {
        // vm.getList()
        console.log('websocket-response:' + JSON.stringify(JSON.parse(evt.data)))
        const msg = JSON.parse(evt.data).Msg
        const codes = JSON.parse(evt.data).code
        const data = JSON.parse(evt.data).Body
        // console.log(data)
        if (codes === 1) {
          vm.loadingZZ = false
          vm.nums = 3
          vm.$message.error(msg)
        } else if (codes === 0 && data.fileList) {
          if (!vm.loadingZZ) return
          vm.loadingZZ = false
          vm.nums = 3
          vm.wsImage = []
          vm.wsVideo = []
          vm.wsFile = []
          vm.wsVehicleNo = data.vehicleNo
          if (data.fileList && data.fileList.length) {
            for (var i = 0; i < data.fileList.length; i++) {
              if (data.fileList[i].fileType === '0') {
                vm.wsImage.push(data.fileList[i])
              } else if (data.fileList[i].fileType === '2') {
                vm.wsVideo.push(data.fileList[i])
              } else if (data.fileList[i].fileType === '3') {
                vm.wsFile.push(data.fileList[i])
              }
            }
          }
          console.log('wsImage:' + vm.wsImage)
          console.log('wsVideo:' + vm.wsVideo)
          vm.identDialog = true
        }
      }
      vm.websocket.onerror = function() {
        // vm.$message.error('websocket连接失败，正在尝试重新连接。。。')
        vm.initWebSocket()
      }
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
  created() {
    this.initWebSocket()
    this.gettypetree()
  },
  computed: {
    getPlatformId() {
      return this.filterForm.platformId
    }
  },
  destroyed() {
    this.websocket.close()
  },
  watch: {
    startEnd: {
      handler(val, oldVal) {
        if (val.length !== 0) {
          this.filterForm.beginTime = val[0]
          this.filterForm.endTime = val[1]
        } else {
          this.filterForm.beginTime = ''
          this.filterForm.endEndTime = ''
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
    // getPermsList().then(res => {
    //   this.nameOptions = res.data
    // })
    getAlarmType().then(res => {
      this.typeOptions = res.data
    })
    this.$store.dispatch('GetUserInfo').then(res => {
      this.userInfo = res.data.user
    })
    getAlarmSource().then(res => {
      this.alarmSourceOptions = res.data
    })
  }
}
</script>
<style>
  .el-button--text {
      color: #5F7ABF;
      background: 0 0;
      padding-left: 0;
      padding-right: 0;
      visibility: hidden;
  }
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
  .zzloading {
    background-color: rgba(0, 0, 0, 0.8);
    z-index: 2000;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    transition: opacity .3s;
  }
  .zzloading .zzloading-spinner {
    margin-top: -25px;
    top: 50%;
    width: 100%;
    text-align: center;
    position: absolute;
    color: #409EFF;
  }
  .zzloading .zzloading-text {
    margin: 3px 0;
    font-size: 14px;
  }
</style>
