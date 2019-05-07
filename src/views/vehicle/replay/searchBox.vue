<template>
  <div class="searchBox">
    <div style="height:100%;width:100%;padding:10px;">
      <el-row style="margin-bottom:10px;">
        <el-col :span="14">
          <search-byArea-and-three
            @selectAreaId="(id) => {params.areaId = id}"
            @selectPlatformId="(id) => {params.platformId = id}"
            @selectOwersId="(id) => {params.owersId = id}">
          </search-byArea-and-three>
        </el-col>
        <!-- <span class="m" style="padding:0 10px;">选择平台</span>
        <el-select  @change="platformChange(params.platformId)" v-model="params.platformId" placeholder="请选择" style="width:150px;" size="small" clearable  filterable>
          <el-option v-for="item in platformIdList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select> -->
        <span class="m" style="padding:0 10px;">选择车辆</span>
        <el-input placeholder="请选择车辆" v-model.trim="params.vehicleNo" style="width:150px;" size="small" readonly @focus="showChooseCar" clearable></el-input>
      </el-row>
      <el-row style="margin-bottom:10px;">
        <span class="m" style="padding:0 10px;">选择通道</span>
        <el-select v-model="params.chlType" size="mini" style="width:100px;">
          <el-option v-for="item in searchForm.chlType.options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <span class="m" style="padding:0 10px;">回放时间</span>
        <el-date-picker style="width:320px;" size="mini" type="datetimerange" v-model="tmp.dateRange" :picker-options="searchForm.dateRange.pickerOptions" range-separator="-" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" start-placeholder="开始日期" end-placeholder="结束日期" align="right" @change="updateDateRange">
        </el-date-picker>
        <el-button type="primary" size="mini" @click="search">查询</el-button>
      </el-row>
      <el-row>
        <span class="m" style="padding:0 10px;">文件位置</span>
        <el-select v-model="params.fileLocation" size="mini" style="width:100px;">
          <el-option v-for="item in searchForm.fileLocation.options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <span class="m" style="padding:0 10px;">文件类型</span>
        <el-select v-model="params.fileType" size="mini" style="width:100px;">
          <el-option v-for="item in searchForm.fileType.options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <span class="m" style="padding:0 10px;">录像类型</span>
        <el-select v-model="params.videoType" size="mini" style="width:100px;" @change="changeStatus">
          <el-option v-for="item in searchForm.videoType.options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <span class="m" style="padding:0 10px;" v-if="showAlarmType" >报警类型</span>
        <el-select v-model="params.alarmType" size="mini" style="width:100px;" v-if="showAlarmType">
          <el-option v-for="item in searchForm.alarmType.options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-row>
    </div>
    <!-- 分选择车辆弹出框 -->
    <el-dialog title="选择车辆" :visible.sync="allotDialogVisible" class="allotDialog" :close-on-click-modal="false">
      <el-row>
        <!-- <el-col :span="6" style="border: 1px solid #ccc; min-height: 400px; max-height: 600px; overflow: hidden">
          <el-tree :data="menus" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
        </el-col> -->
        <el-col :span="23" :offset="1">
          <div class="searchInput" style="overflow: hidden">
            车牌号: <el-input placeholder="请输入内容" v-model="carQuery.vehicleNo" style="width: 200px;" size="small"></el-input>
              <el-button type="primary" size="small" @click="search">查询</el-button>
            <el-button type="primary"  size="small" style="float: right" @click="choose">确定</el-button>
          </div>
          <div>
            <el-table
            ref="multipleTable"
            :data="tableData"
            style="margin-top: 10px;width:100%"
            stripe
            border>
              <el-table-column
               width="40px">
                <template slot-scope="scope">
                  <el-radio v-model="radioVal" @change.native="getRow(scope.row)" :label="scope.row.id"></el-radio>
                </template>
              </el-table-column>
              <el-table-column
                label="车牌号"
                align="center"
                prop="vehicleNo">
              </el-table-column>
              <el-table-column
                prop="platformName"
                align="center"
                label="运营商平台">
              </el-table-column>
              <el-table-column
                prop="vehicleTypeName"
                align="center"
                label="车辆类型"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="vehicleMode"
                align="center"
                label="车型号"
                show-overflow-tooltip
                fixed="right">
              </el-table-column>
            </el-table>
          </div>
          <el-pagination background @current-change="handleCurrentChange" :current-page="carQuery.page" :page-size="carQuery.limit" layout="total, prev, pager, next" :total="total" style="margin-top: 20px">
          </el-pagination>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
// import { getTree, getVehicleList } from '@/api/vehicleMonitor/replay'
import { getToken } from '@/utils/auth'
import { getPermsList } from '@/api/base/platform'
import { getDeptTree } from '@/api/base/company'
import { vehicleList } from '@/api/base/vehicle'
import { getChildrenVehList } from '@/api/vehicle/choiceCar'
import SearchByAreaAndThree from '@/components/Search/SearchByAreaAndThree'
const OneDayMillseconds = 1000 * 3600 * 24

function dateRangeBefore(days) {
  const now = new Date()
  const start = new Date(now.getTime() - OneDayMillseconds * days)
  return [start, now]
}

const Search = {
  dateRange: {
    pickerOptions: {
      shortcuts: [
        { text: '近一天', onClick(picker) { picker.$emit('pick', dateRangeBefore(1)) } },
        { text: '近两天', onClick(picker) { picker.$emit('pick', dateRangeBefore(2)) } },
        { text: '近三天', onClick(picker) { picker.$emit('pick', dateRangeBefore(3)) } }
      ]
    }
  },
  fileLocation: {
    options: [
      { value: 1, label: '终端设备' },
      { value: 2, label: '存储服务器' }
    ]
  },
  fileType: {
    options: [
      { value: 0, label: '混合' },
      { value: 1, label: '音频' },
      { value: 2, label: '视频' },
      { value: 3, label: '视频/混合' }
    ]
  },
  videoType: {
    options: [
      // { value: 0, label: '所有' },
      { value: 1, label: '常规' },
      { value: 2, label: '报警' }
    ]
  },
  chlType: {
    options: [
      { value: 1, label: '通道1' },
      { value: 2, label: '通道2' },
      { value: 3, label: '通道3' },
      { value: 4, label: '通道4' },
      { value: 5, label: '通道5' },
      { value: 6, label: '通道6' }
    ]
  },
  alarmType: {
    options: [
      { value: -1, label: '所有报警' },
      { value: 0, label: '紧急报警' },
      { value: 1, label: '超速报警' },
      { value: 2, label: '疲劳驾驶报警' },
      { value: 3, label: '危险预警' },
      { value: 4, label: 'GNSS模块故障' },
      { value: 5, label: 'GNSS天线未接或剪断' },
      { value: 6, label: 'GNSS天线短路' },
      { value: 7, label: '主电源欠压' },
      { value: 8, label: '主电源掉电' },
      { value: 9, label: 'LCD或显示器故障' },
      { value: 10, label: 'TTS模块故障' },
      { value: 11, label: '摄像头故障' },
      { value: 12, label: '道路运输证IC卡模块故障' },
      { value: 13, label: '超速预警' },
      { value: 14, label: '疲劳驾驶预警' },
      { value: 17, label: '存储介质故障' },
      { value: 18, label: '当天累计驾驶超时' },
      { value: 19, label: '超时停车' },
      { value: 20, label: '进出区域' },
      { value: 21, label: '进出线路' },
      { value: 22, label: '路段行驶时间不足或过长' },
      { value: 23, label: '路线偏离' },
      { value: 24, label: 'VSS故障' },
      { value: 25, label: '油量异常' },
      { value: 26, label: '防盗器' },
      { value: 27, label: '非法点火' },
      { value: 28, label: '非法位移' },
      { value: 29, label: '碰撞报警' },
      { value: 30, label: '侧翻' },
      { value: 31, label: '非法开门报警' },
      { value: 32, label: '摄像头无信号报警' },
      { value: 33, label: '摄像头遮挡报警' },
      { value: 34, label: '存储介质故障' }
    ]
  }
}

export default {
  components: { SearchByAreaAndThree },
  data() {
    return {
      searchForm: Search,
      dialog: {
        vehicle: false
      },
      allotDialogVisible: false,
      showAlarmType: false,
      platformId: null,
      platformIdList: [],
      params: {
        vehicleId: null,
        channelId: null,
        vehicle: null,
        deviceIdMaster: null,
        startTime: null,
        endTime: null,
        fileLocation: 1,
        fileType: 0,
        videoType: 1,
        chlType: 1,
        alarmType: -1,
        vehicleNo: '',
        platformId: '',
        areaId: '',
        owersId: ''
      },
      menus: [],
      tmp: {
        dateRange: null
      },
      treeData: [],
      tableData: [],
      total: 0,
      defaultProps: {
        children: 'children',
        label: 'text'
      },
      queryList: {
        page: 1,
        limit: 5,
        deptId: '',
        vehicleNo: ''
      },
      carQuery: {
        page: 1,
        limit: 5,
        vehicleNo: '',
        platformId: '',
        owersId: ''
      },
      radioVal: '-1'
    }
  },
  created() {
    this.getPlatformList()
  },
  mounted() {
    this.initWebSocket()
  },
  methods: {
    getPlatformList() { // 获取运营商平台列表
      getPermsList().then(response => {
        this.platformIdList = response.data
      })
    },
    getDept() {
      getDeptTree(this.params.platformId).then(res => {
        this.menus = [res.data]
      })
    },
    platformChange(val) {
      console.log(val)
    },
    showChooseCar() {
      this.carQuery = {
        page: 1,
        limit: 5,
        vehicleNo: '',
        platformId: '',
        owersId: '',
        areaId: '',
        type: 4
      }
      this.carQuery.platformId = this.params.platformId
      this.carQuery.areaId = this.params.areaId
      this.carQuery.owersId = this.params.owersId
      if (!this.carQuery.platformId && !this.carQuery.areaId) {
        this.$message('请先选择平台或地区')
      } else {
        // this.getDept()
        // this.getCarList()
        getChildrenVehList(this.carQuery).then(res => {
          res.data.rows.forEach(item => {
            if (item.activeStatus === '1') {
              item.activeStatus = '在线'
            } else {
              item.activeStatus = '离线'
            }
          })
          this.tableData = res.data.rows
          this.total = res.data.totalCount
        })
        this.allotDialogVisible = true
      }
    },
    getCarList() {
      getChildrenVehList(this.carQuery).then(res => {
        res.data.rows.forEach(item => {
          if (item.activeStatus === '1') {
            item.activeStatus = '在线'
          } else {
            item.activeStatus = '离线'
          }
        })
        this.tableData = res.data.rows
        this.total = res.data.totalCount
      })
    },
    search() {
      console.log('通过ws获取数据 start')
      if (this.params.vehicleId === null) {
        this.$message.error('请选择车辆')
        return
      } else if (this.params.chlType === null) {
        this.$message.error('请选择通道')
        return
      } else if (this.params.startTime === null) {
        this.$message.error('请选择回放开始时间')
        return
      } else if (this.params.endTime === null) {
        this.$message.error('请选择回放结束时间')
        return
      } else if (this.params.fileLocation === null) {
        this.$message.error('请选择文件位置')
        return
      } else if (this.params.fileType === null) {
        this.$message.error('请选择文件类型')
        return
      }
      if (this.params.videoType === null) {
        this.$message.error('请选择录像类型')
        return
      } else {
        if (this.params.alarmType === null) {
          this.$message.error('录像类型为报警必须选择报警类型')
          return
        }
      }
      if (this.params.fileLocation === 1) {
        console.log('搜索资源开始，搜索方式：从终端获取>>>---->流文件')
        this.getFileListWS('70')
      } else if (this.params.fileLocation === 2) {
        console.log('搜索资源开始，搜索方式：从文件服务器直接获取文件>>>---->文件')
        // 发送get请求获取文件服务器上的数据
        const fileAddrise = process.env.VIDEO_API
        const url = fileAddrise + '/ftp/013128696936/20181116/1/2/1'
        this.getfile(url)
      }
    },
    changeStatus() {
      if (this.params.videoType === 2) {
        this.showAlarmType = true
      } else {
        this.showAlarmType = false
      }
    },
    getRow(row) {
      console.log(row)
      this.tmp = row
      this.params.vehicleId = row.vehicleId
    },
    handleNodeClick(val) {
      this.carQuery.owersId = val.id
      this.getCarList()
    },
    updateDateRange() {
      this.params.startTime = this.tmp.dateRange[0]
      this.params.endTime = this.tmp.dateRange[1]
    },
    choose() {
      if (this.radioVal === '-1') {
        this.$message({
          type: 'error',
          message: '请选择车辆'
        })
      } else {
        // this.$emit('emitInfo', this.tmp)\
        console.log(this.tmp)
        this.params.vehicleNo = this.tmp.vehicleNo
        this.params.vehicleId = this.tmp.id
        this.params.vehicle = this.tmp.plateNo // 如果是终端设备，走WS，用device_id
        this.params.deviceIdMaster = this.tmp.deviceIdMaster // 如果是文件服务器，走http，用device_id
        this.allotDialogVisible = false
      }
    },
    handleCurrentChange(val) {
      this.carQuery.page = val
      this.getCarList()
    },
    initWebSocket() { // 初始化websocket
      const vm = this
      vm.websocket = new WebSocket(process.env.WEBSOCKET_API)
      vm.websocket.onopen = function() {}
      vm.websocket.onmessage = function(evt) {
        const obj = JSON.parse(evt.data)
        console.log('收到ws消息', obj)
        if (obj.Command === '70') {
          if (obj.Body && obj.Body.data) {
            console.log('子组件收到的参数>>>---->', obj.Body.data)
            obj.Body.data.forEach(function(item) {
              if (item.avitemType === '0') {
                // 0音视频 1音频 2视频
                item.fileType = '音视频'
                item.vehicleId = vm.params.vehicleId
                item.fileLocation = vm.params.fileLocation
              } else if (item.avitemType === '1') {
                item.fileType = '音频'
                item.vehicleId = vm.params.vehicleId
                item.fileLocation = vm.params.fileLocation
              } else if (item.avitemType === '2') {
                item.fileType = '视频'
                item.vehicleId = vm.params.vehicleId
                item.fileLocation = vm.params.fileLocation
              }
            })
          }
          vm.$emit('emitTableData666', obj.Body.data) // 传值给父页面
        }
      }
      vm.websocket.onerror = function() {
        vm.initWebSocket()
      }
    },
    getFileListWS(command) { // 发送websocket消息，获取文件列表
      console.log(this.params)
      const data = {
        Command: command,
        CommandType: 'Business',
        token: getToken('Admin-Token'),
        Body: {
          data: {
            vehicleId: this.params.vehicleId,
            channelId: this.params.chlType,
            startTime: this.params.startTime,
            endTime: this.params.endTime,
            memType: this.params.fileLocation, // 存储器类型
            avitemType: this.params.fileType, // 音视频类型
            streamType: this.params.videoType, // 码流类型
            alarmType: this.params.alarmType // 报警标识

          }
        }
      }
      console.log('当前操作是：' + command)
      console.log('当前请求参数是：', data)
      if (this.websocket.readyState === 1) {
        this.websocket.send(JSON.stringify(data))
      } else {
        this.$message.error('查询媒体列表失败!')
      }
    },
    getfile(url) {
      axios.get(url, function(res) {
        console.log('-----------------', res)
      })
    }
  }
}
</script>

<style>
.searchBox {
  width: 100%;
  height: 87px;
  background-color: #ffffff;
  top: 0;
  left: 0;
  font-size: 12px;
}
</style>
