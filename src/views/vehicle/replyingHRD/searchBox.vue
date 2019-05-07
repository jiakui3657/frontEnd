<template>
	<div class="searchBox">
        <div style="height:100%;width:100%;padding:10px;">
          <el-row style="margin-bottom:10px;">
            <search-byArea-and-three
              :carNo="carValue"
              @chooseCar="chooseCar"
              @selectAreaId="(id) => {params.areaId = id}"
              @selectPlatformId="(id) => {params.platformId = id}"
              @selectOwersId="(id) => {params.owersId = id}">
            </search-byArea-and-three>
          </el-row>
          <el-row style="margin-bottom:10px;">
            <span class="m" style="font-size:14px;font-weight: 700;color:#606266;padding:0 10px;">回放时间</span>
            <el-date-picker
              :disabled="gettime"
              style="width:400px;"
              size="small"
              v-model="rePlayDate"
              type="datetimerange"
              :editable="false"
              :default-time="rePlayTime"
              :picker-options="pickerOptions"
              range-separator="-"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right">
            </el-date-picker>
            <el-button style="background-color:#5F7ABF;color:#fff;border-radius:5px;" size="small" @click="searchDatas" v-loading.fullscreen.lock="fullscreenLoading" element-loading-text="正在加载中,请稍后..." element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" :loading="searchStatus"><span v-text="searchBtn"></span></el-button>
            <el-button style="border-radius:5px;"  type="primary" size="small" @click="handleExport" :disabled="exportStatus">导出</el-button>
            <span style="font-size:14px;font-weight: 700;color:#606266;padding:0 5px;">回放速度</span>
            <el-select @change="getLineSpeed" v-model="replaySpeedVal" size="small" style="width:70px;">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-button style="border-radius:5px;" type="primary" size="small" @click="replay" :disabled="replayStatus">回放</el-button>
            <el-button style="border-radius:5px;" type="primary" size="small" @click="pause" :disabled="pauseStatus">暂停</el-button>
            <el-button style="border-radius:5px;" type="primary"  size="small" @click="stop" :disabled="pauseStatus">停止</el-button>
            <!-- <span class="m" style="padding:0 10px;">回放进度</span>
            <el-progress :text-inside="true" :stroke-width="18" :percentage="percents" style="width:200px;display:inline-block;padding: 0 10px 0 0;top:-2px;"></el-progress> -->
          </el-row>
        </div>
      </div>
</template>

<script>
  // import { deptTree } from '@/api/system/dept'
  import { getPermsList } from '@/api/base/platform'
  import { getDeptTree } from '@/api/base/company'
  import { parseTime } from '@/utils'
  import news from './news'
  import { getToken } from '@/utils/auth'
  import { formatDate } from '@/utils/date.js'
  import SearchByAreaAndThree from '@/components/Search/SearchByAreaAndThree'
  export default {
    props: ['message', 'searchStatus'],
    components: { SearchByAreaAndThree },
    data() {
      var date = function() {
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 8)
        return start
      }
      return {
        fullscreenLoading: false,
        getPlatform: false,
        getMessaged: false,
        replayStatus: true,
        permmsion: true,
        gettime: false,
        pauseStatus: true,
        stopStatus: true,
        exportStatus: true,
        searchBtn: '查询',
        acceptData: [],
        activeName: '',
        checked: true,
        allotDialogVisible: false,
        radioVal: '-1',
        platformIdList: [],
        rePlayDate: [date(), new Date()],
        rePlayTime: [formatDate(date(), 'hh:mm:ss'), formatDate(new Date(), 'hh:mm:ss')],
        pickerOptions: {
          // 查询时间最大间隔2天
          onPick: ({ maxDate, minDate }) => {
            this.choiceDate = minDate.getTime()
            if (maxDate) {
              this.choiceDate = ''
            }
          },
          disabledDate: (time) => {
            if (this.choiceDate !== '') {
              const one = 2 * 24 * 3600 * 1000
              const minTime = this.choiceDate - one
              const maxTime = this.choiceDate + one
              return time.getTime() > Date.now() || time.getTime() < minTime || time.getTime() > maxTime
            } else {
              return time.getTime() > Date.now()
            }
          },
          shortcuts: [{
            text: '4小时',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 4)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '8小时',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 8)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '近一天',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 1)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '近两天',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 2)
              picker.$emit('pick', [start, end])
            }
          }]
        },
        replaySpeedVal: 100,
        options: [{
          value: 100,
          label: '1x'
        }, {
          value: 500,
          label: '5x'
        }, {
          value: 1000,
          label: '10x'
        }, {
          value: 3000,
          label: '30x'
        }, {
          value: 5000,
          label: '50x'
        }],
        queryList: {
          page: 1,
          limit: 5,
          owersId: '',
          plateNo: ''
        },
        params: {
          platformId: '',
          areaId: '',
          owersId: ''
        },
        treeData: [],
        tmp: {},
        tableData: [],
        onlineCount: '',
        allCount: '',
        defaultProps: {
          children: 'children',
          label: 'text'
        },
        total: 0,
        startDate: date(),
        endDate: new Date(),
        loading: false,
        carValue: ''
      }
    },
    watch: {
      replaySpeedVal(val) {
        console.log(val)
        this.$emit('speed', val)
      },
      rePlayDate(val) {
        console.log(val)
        if (val) {
          this.startDate = val[0]
          this.endDate = val[1]
          console.log(this.startDate, this.endDate)
        }
      },
      searchStatus(flag) {
        console.log('----------' + flag)
        if (flag) {
          this.searchBtn = '正在回放'
          this.replayStatus = false
          this.pauseStatus = true
          this.stopStatus = false
          this.exportStatus = false
          this.getPlatform = true
          this.getMessaged = true
          this.gettime = true
        } else {
          this.searchBtn = '查询'
          this.replayStatus = true
          this.pauseStatus = true
          this.stopStatus = true
          this.exportStatus = true
          this.getPlatform = false
          this.getMessaged = false
          this.gettime = false
        }
      },
      message(val) {
        this.carValue = ''
        this.tmp.id = ''
        if (val) {
          this.carValue = val.vNo
          this.tmp.vehicleNo = val.vNo
          this.tmp.id = val.vId
        }
      }
    },
    mounted() {
      this.getMessaged = false
      news.$on('sendData', msg => {
        this.acceptData = msg
      })
    },
    created() {
      this.initWebSocket()
      // this.initWebSocketM(process.env.WEBSOCKET_API, (websocket) => {
      //   this.websocket = websocket
      // }, (evt) => {
      //   const vm = this
      //   vm.loading = false
      //   // vm.wsStatus = JSON.parse(evt.data).Body.status
      //   vm.$emit('searchDatas', JSON.parse(evt.data).Body)
      //   vm.fullscreenLoading = false
      // })
      this.getPlatformList()
    },
    destroyed() {
      this.websocket.close()
    },
    methods: {
      getPlatformList() { // 获取运营商平台列表
        getPermsList().then(response => {
          this.platformIdList = response.data
        })
      },
      getDept() {
        getDeptTree(this.params.platformId).then(res => {
          this.treeData = [res.data]
        })
      },
      getLineSpeed(val) {
        this.$emit('speed', val)
      },
      initWebSocket() {
        const vm = this
        vm.websocket = new WebSocket(process.env.WEBSOCKET_API)
        vm.websocket.onopen = function() {
          console.log('数据发送中...:' + process.env.WEBSOCKET_API)
        }

        vm.websocket.onmessage = function(evt) {
          vm.loading = false
          // vm.wsStatus = JSON.parse(evt.data).Body.status
          vm.$emit('searchDatas', JSON.parse(evt.data).Body)
          vm.fullscreenLoading = false
        }
        vm.websocket.onerror = function() {
          vm.initWebSocket()
        }
      },
      replay() {
        const self = this
        this.$emit('isrePlay', true)
        setTimeout(() => {
          self.replayStatus = true
          self.pauseStatus = false
          self.stopStatus = false
          self.exportStatus = false
        }, 50)
      },
      searchDatas() {
        const startt = formatDate(this.startDate, 'yyyy-MM-dd hh:mm:ss')
        const endt = formatDate(this.endDate, 'yyyy-MM-dd hh:mm:ss')
        if (this.tmp.vehicleNo && this.rePlayDate) {
          if (new Date(this.endDate).getTime() - new Date(this.startDate).getTime() <= (3600 * 1000 * 24 * 2)) {
            this.fullscreenLoading = true
            const data = {
              Command: '22',
              CommandType: 'track',
              token: getToken('Admin-Token'),
              Body: {
                VehicleID: this.tmp.id,
                // VehicleID: '2156',
                StartTime: startt,
                EndTime: endt,
                Interval: 30
              }
            }
            console.log(JSON.stringify(data))
            this.websocket.send(JSON.stringify(data))
            this.$emit('isStop')// 清除状态
          } else {
            this.$message({
              type: 'error',
              message: '最多只可查询两天！',
              duration: 1000
            })
          }
        } else {
          this.$message({
            type: 'error',
            message: '请选择查询条件！',
            duration: 1000
          })
        }
      },
      pause() {
        this.$emit('isPause', false)
        this.replayStatus = false
        this.pauseStatus = true
      },
      stop() {
        const self = this
        this.searchStatus = false
        this.$emit('isPause', false)
        setTimeout(() => {
          self.replayStatus = false
          self.pauseStatus = true
          self.stopStatus = false
          self.exportStatus = false
        }, 50)
        setTimeout(() => {
          if (self.searchStatus) {
            self.stop()
          }
        }, 150)
      },
      handleNodeClick(val) {
        this.queryList.owersId = val.id
        this.getList()
      },
      chooseCar(tmp) {
        this.tmp = tmp
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        }))
      },
      handleExport() {
        console.log(this.acceptData)
        news.$on('sendData', msg => {
          this.acceptData = msg
        })
        if (this.acceptData.length !== 0) {
          import('@/vendor/Export2Excel').then(excel => {
            const tHeader = ['上报时间', '经度', '纬度', '车速', '里程']
            const filterVal = ['dataTime', 'longitude', 'latitude', 'currentSpeed', 'currentMileage']
            const list = this.acceptData
            const data = this.formatJson(filterVal, list)
            excel.export_json_to_excel({
              header: tHeader,
              data,
              filename: '轨迹回放',
              autoWidth: true
            })
          })
        } else {
          this.$message.error('暂无数据！')
        }
      }
    }
  }
</script>

<style>
  .el-dialog__headerbtn .el-dialog__close {
      color: #fff;
  }
  .el-dialog__headerbtn {
    position: absolute;
    top: 15px;
    right: 20px;
    padding: 0;
    background: 0 0;
    border: none;
    outline: 0;
    cursor: pointer;
    font-size: 16px;
  }
  .el-button--primary {
      color: #fff;
      background-color: #5F7ABF;
      border-color: #5F7ABF;
  }
  .searchBox {
    width: 100%;
    height: 94px;
    background-color: #FFFFFF;
    position: absolute;
    top: 0;
    left: 0;
    font-size:12px;
  }
  .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content .demo {
    border: 1px solid #5F7ABF;
    padding: 0 3px;
    border-radius: 4px;
    color: #5F7ABF;
  }
  .allotDialog .el-pagination.is-background .el-pager li:not(.disabled).active {
    background-color: #5F7ABF;
  }
  .searchBox .el-dialog__header span {
    color: #fff;
    font-size: 14px;
  }
  .searchBox .el-dialog__header {
    background-color: #5F7ABF;
    height: 40px;
    padding-top: 10px;
  }
</style>
