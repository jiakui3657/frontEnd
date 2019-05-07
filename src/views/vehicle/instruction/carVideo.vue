<template>
  <div>
    <el-row>
    <el-col style="margin-top:20px;padding: 0 20px;width:50%">
      <p>所选车辆：
      <span>{{ carInfo.vehicleNo }}</span>
      </p>
      <div class="block">
        <span class="demonstration">选择通道：</span>
        <el-cascader
          expand-trigger="hover"
          :props="props"
          :options="selectedData"
          v-model="selectedType"
          @change="handleChange">
        </el-cascader>
        <span class="demonstration">音视频类型：</span>
        <el-select v-model="typeValue" placeholder="请选择音视频类型">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <el-button type="primary" style="margin:5px 0 0 84px;" @click="send" :loading="loading">发送</el-button>
      <el-button type="primary" style="margin:5px 0 0 0;" @click="stop" :loading="loading">停止</el-button>
      <p>回复结果：
        <span>{{ wsStatus }}</span>
      </p>
    </el-col>
    <el-col style="width:50%">
      <video-player :options="myoptions" :pid="pid" ref="playerref" style="margin-top:10px"></video-player>
    </el-col>
    </el-row>
  </div>
</template>
<script>
  import event from './eventBus'
  import { getToken } from '@/utils/auth'
  import { getPassageway } from '@/api/vehicle/choiceCar'
  import videoPlayer from './videoPlayer'
  var videojs = require('video.js')
  require('videojs-flash')
  export default {
    data() {
      return {
        input: '',
        websocket: '',
        carInfo: {},
        wsStatus: '',
        loading: false,
        selectedType: [],
        selectedData: [],
        options: [{
          value: 0,
          label: '音视频'
        }, {
          value: 1,
          label: '音频'
        }, {
          value: 2,
          label: '视频'
        }],
        typeValue: '',
        props: {
          value: 'id',
          label: 'monitoringArea',
          children: 'children'
        },
        channel: '',
        myoptions: {
          autoplay: false, // 是否自动播放
          muted: false, // 是否静音
          controls: false,
          fluid: true, // 宽高自适应
          sources: [{
            src: 'rtmp://47.105.140.197:10090/live/test001', // 默认视频
            type: 'rtmp/flv'
          }]
        },
        pid: 'my-player'
      }
    },
    watch: {
      typeValue(val) {
        console.log(val)
      },
      selectedType(val) {
        this.channel = val[1]
        console.log(this.channel)
      }
    },
    methods: {
      doplay(fileUrl, type) {
        console.log('收到运营商平台上传来的视频--------', fileUrl)
        this.$refs.playerref.player = videojs('my-player', this.myoptions, function onPlayerReady() {
          var player = this
          player.src({ src: fileUrl, type: type })
          this.play()
        })
      },
      initWebSocket() {
        const vm = this
        vm.websocket = new WebSocket(process.env.WEBSOCKET_API)
        vm.websocket.onopen = function() {
          console.log('数据发送中...')
        }
        vm.websocket.onmessage = function(evt) {
          console.log('数据已接收...')
          console.log(JSON.parse(evt.data))
          vm.loading = false
          vm.wsStatus = JSON.parse(evt.data).Body.status
          const obj = JSON.parse(evt.data)
          // 音视频
          // result: "成功", vehicleNo: "陕A6QY53", serverIp: "116.62.127.229", serverPort: 280
          // 播放返回的视频
          console.log('收到ws返回的数据，数据为：', obj)
          const vehicleNo = obj.Body.vehicleNo // 车牌号
          console.log('返回的为车辆：', vehicleNo, '的数据')
          // vehicleColor 从this.carInfo.vehicleColor拿
          // ws接口改变，地址现在由页面拼接：http://[服务器ip地址]:[端口号]/[车牌号码].[车牌颜色].[逻辑通道号].[音视频标志].[时效口令]
          const vehicleColor = vm.carInfo.vehicleColor
          const authorizeCode = obj.Body.authorizeCode
          const channelId = vm.channel // 逻辑通道号
          const avitemType = vm.typeValue // 音视频标志
          const serverIp = obj.Body.serverIp // 服务器地址
          const serverPort = obj.Body.serverPort // 端口号
          // const authorizeCode = obj.Body.authorizeCode // 时效口令
          const fileUrlTmp = 'rtmp://47.105.140.197:10090/live/test99' // 临时地址
          // const fileUrl = 'http://' + serverIp + ':' + serverPort + '/' + vehicleNo + '.' + vehicleColor + '.' + channelId + '.' + avitemType + '.' + authorizeCode // 临时地址
          const fileUrl = 'http://' + serverIp + ':' + serverPort + '/' + vehicleNo + '.' + vehicleColor + '.' + channelId + '.' + avitemType + '.' + authorizeCode// 临时地址
          console.log('视频播放地址：', fileUrl)
          console.log('视频播放地址：', fileUrlTmp)
          const type = 'rtmp/flv'
          vm.doplay(fileUrl, type) // 后期有数据上来用fileUrl替换
        }
        vm.websocket.onerror = function() {
          vm.initWebSocket()
        }
      },
      send() {
        if (JSON.stringify(this.carInfo) === '{}') {
          this.$message({
            type: 'error',
            message: '请选择车辆'
          })
        } else {
          this.loading = true
          const data = {
            Command: '57',
            CommandType: 'Business',
            token: getToken('Admin-Token'),
            Body: {
              data: {
                channelId: this.channel,
                vehicleNo: this.carInfo.vehicleNo,
                avitemType: this.typeValue
              }
            }
          }
          console.log(data)
          this.websocket.send(JSON.stringify(data))
        }
      },
      stop() {
        if (JSON.stringify(this.carInfo) === '{}') {
          this.$message({
            type: 'error',
            message: '请选择车辆'
          })
        } else {
          this.loading = true
          const data = {
            Command: '58',
            CommandType: 'Business',
            token: getToken('Admin-Token'),
            Body: {
              data: {
                channelId: this.channel,
                vehicleNo: this.carInfo.vehicleNo,
                avitemType: this.typeValue
              }
            }
          }
          console.log(data)
          this.websocket.send(JSON.stringify(data))
        }
      },
      handleChange(value) {
        console.log(value)
      }
    },
    created() {
      this.initWebSocket()
    },
    mounted() {
      event.$on('emitInfo', data => {
        this.carInfo = data
      })
      getPassageway().then(res => {
        for (var i = 0; i < res.data.length; i++) {
          res.data[i].id = res.data[i].value
          res.data[i].monitoringArea = res.data[i].label
        }
        console.log(res.data)
        this.selectedData = res.data
      })
    },
    destroyed() {
      this.websocket.close()
    },
    components: {
      videoPlayer
    }
  }
</script>

<style>
</style>
