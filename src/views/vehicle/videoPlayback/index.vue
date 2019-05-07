<template>
  <transition name="fade">
    <div>
      <search-box @emitTableData666="getTableData"></search-box>
      <div class="videos" :class="{'videos-higher': !table.show}">
        <el-row>
          <el-col :span="12">
            <div class="grid-content bg-purple-light" style="position: relative; max-height: 292px;">
              <video
                id="my-player1"
                width="100%" height="100%"
                class="video-js
                vjs-default-skin
                vjs-big-play-centered"
                preload="auto"
                data-setup='{ "html5" : { "nativeTextTracks" : false } }'>
              </video>
              <div style="position:absolute; bottom: 0; right: 0;">
                <el-button type="primary" icon="el-icon-d-arrow-left" size="mini" @click="speedsub(params.speed1d, 1)"></el-button>
                <!--<el-button type="primary" icon="" size="mini">X1</el-button>-->
                <el-select v-model="params.speed1d" size="mini" @change="speedchange(params.speed1d, 1)" style="width:80px;">
                  <el-option v-for="item in vsData.speed1.options" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
                <el-button type="primary" icon="el-icon-d-arrow-right" size="mini" @click="speedadd(params.speed1d, 1)"></el-button>
                <el-button type="primary" icon="" size="mini" @click="doPlay(player1, 1)">▶</el-button>
                <el-button type="primary" icon="" size="mini" @click="doPause(player1, 1)">█</el-button>
              </div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple-light" style="position: relative; max-height: 292px;">
              <video
                id="my-player2"
                width="100%" height="100%"
                class="video-js
                    vjs-default-skin
                    vjs-big-play-centered"
                preload="auto"
                data-setup='{ "html5" : { "nativeTextTracks" : false } }'>
              </video>
              <div style="position:absolute; bottom: 0; right: 0;">
                <el-button type="primary" icon="el-icon-d-arrow-left" size="mini" @click="speedsub(params.speed2d, 2)"></el-button>
                <!--<el-button type="primary" icon="" size="mini">X1</el-button>-->
                <el-select v-model="params.speed2d" size="mini" @change="speedchange(params.speed2d, 2) "style="width:80px;">
                  <el-option v-for="item in vsData.speed2.options" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
                <el-button type="primary" icon="el-icon-d-arrow-right" size="mini" @click="speedadd(params.speed2d, 2)"></el-button>
                <el-button type="primary" icon="" size="mini" @click="doPlay(player2, 2)">▶</el-button>
                <el-button type="primary" icon="" size="mini" @click="doPause(player2, 2)">█</el-button>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <div class="grid-content bg-purple" style="position: relative; max-height: 292px;">
              <video
                id="my-player3"
                width="100%" height="100%"
                class="video-js
                vjs-default-skin
                vjs-big-play-centered"
                preload="auto"
                data-setup='{ "html5" : { "nativeTextTracks" : false } }'>
              </video>
              <div style="position:absolute; bottom: 0; right: 0;">
                <el-button type="primary" icon="el-icon-d-arrow-left" size="mini" @click="speedsub(params.speed3d, 3)"></el-button>
                <!--<el-button type="primary" icon="" size="mini">X1</el-button>-->
                <el-select v-model="params.speed3d" size="mini" @change="speedchange(params.speed3d, 3) "style="width:80px;">
                  <el-option v-for="item in vsData.speed3.options" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
                <el-button type="primary" icon="el-icon-d-arrow-right" size="mini" @click="speedadd(params.speed3d, 3)"></el-button>
                <el-button type="primary" icon="" size="mini" @click="doPlay(player3, 3)">▶</el-button>
                <el-button type="primary" icon="" size="mini" @click="doPause(player3, 3)">█</el-button>
              </div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple-light" style="position: relative; max-height: 292px;">
              <video
                id="my-player4"
                width="100%" height="100%"
                class="video-js
                vjs-default-skin
                vjs-big-play-centered"
                preload="auto"
                data-setup='{ "html5" : { "nativeTextTracks" : false } }'>
              </video>
              <div style="position:absolute; bottom: 0; right: 0;">
                <el-button type="primary" icon="el-icon-d-arrow-left" size="mini" @click="speedsub(params.speed4d, 4)"></el-button>
                <!--<el-button type="primary" icon="" size="mini">X1</el-button>-->
                <el-select v-model="params.speed4d" size="mini" @change="speedchange(params.speed4d, 4)" style="width:80px;">
                  <el-option v-for="item in vsData.speed4.options" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
                <el-button type="primary" icon="el-icon-d-arrow-right" size="mini" @click="speedadd(params.speed4d, 4)"></el-button>
                <el-button type="primary" icon="" size="mini" @click="doPlay(player4, 4)">▶</el-button>
                <el-button type="primary" icon="" size="mini" @click="doPause(player4, 4)">█</el-button>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="el-footer">
        <el-button type="primary" :icon="table.show ? 'el-icon-arrow-down' : 'el-icon-arrow-up'" class="toggle-table-btn" size="mini" @click="toggleTable"></el-button>
        <el-table :data="fileList" size="mini" :class="{'el-table-close': !table.show}" border stripe :header-cell-style="{ background: '#628FA6', color: '#fff', border: 'none !important' }">
          <el-table-column prop="date" label="操作" width="110">
            <template slot-scope="scope">
              <el-button-group>
                <el-tooltip class="item" effect="dark" content="点击下载" placement="top-start">
                  <el-button @click="handleDownload(scope.row)" class="el-icon-download" size="mini" round></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="点击播放" placement="top-start">
                  <el-button @click="handlePlayer(scope.row)" class="el-icon-caret-right" size="mini" round></el-button>
                </el-tooltip>
              </el-button-group>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="name" label="序号" width="100"></el-table-column> -->
          <!-- <el-table-column prop="address" label="文件"></el-table-column> -->
          <el-table-column prop="startTime" label="开始时间" width="180"></el-table-column>
          <el-table-column prop="endTime" label="结束时间" width="180"></el-table-column>
          <el-table-column prop="fileSize" label="文件大小" width="180"></el-table-column>
          <el-table-column prop="alarmType" label="报警类型" width="180"></el-table-column>
          <el-table-column prop="avitemType" label="录像类型值" width="180" hidden="hidden"></el-table-column>
          <el-table-column prop="fileType" label="录像类型" width="180" hidden="hidden"></el-table-column>
          <el-table-column prop="channelId" label="通道"></el-table-column>
        </el-table>
      </div>
    </div>
  </transition>
</template>

<script>
  import SearchBox from './searchBox'
  import { getToken } from '@/utils/auth'
  var videojs = require('video.js')
  require('videojs-flash')

  const vs = {
    speed1: {
      options: [
        { value: 1, label: 'X1' },
        { value: 2, label: 'X2' },
        { value: 3, label: 'X4' },
        { value: 4, label: 'X8' },
        { value: 5, label: 'X16' }
      ]
    },
    speed2: {
      options: [
        { value: 1, label: 'X1' },
        { value: 2, label: 'X2' },
        { value: 3, label: 'X4' },
        { value: 4, label: 'X8' },
        { value: 5, label: 'X16' }
      ]
    },
    speed3: {
      options: [
        { value: 1, label: 'X1' },
        { value: 2, label: 'X2' },
        { value: 3, label: 'X4' },
        { value: 4, label: 'X8' },
        { value: 5, label: 'X16' }
      ]
    },
    speed4: {
      options: [
        { value: 1, label: 'X1' },
        { value: 2, label: 'X2' },
        { value: 3, label: 'X4' },
        { value: 4, label: 'X8' },
        { value: 5, label: 'X16' }
      ]
    }
  }
  export default {
    name: 'realVideo',
    data() {
      return {
        vsData: vs,
        fileList: [],
        table: { show: false },
        playnow: 1,
        player1: null,
        player2: null,
        player3: null,
        player4: null,
        player1row: null,
        player2row: null,
        player3row: null,
        player4row: null,
        options1: {
          autoplay: true, // 是否自动播放
          muted: false, // 是否静音
          controls: false,
          fluid: true, // 宽高自适应
          sources: [{
            src: 'rtmp://47.105.140.197:10090/live/test99', // 默认视频
            type: 'rtmp/flv'
          }]
        },
        options2: {
          autoplay: true, // 是否自动播放
          muted: false, // 是否静音
          controls: false,
          fluid: true, // 宽高自适应
          sources: [{
            src: 'rtmp://47.105.140.197:10090/live/test99', // 默认视频
            type: 'rtmp/flv'
          }]
        },
        options3: {
          autoplay: true, // 是否自动播放
          muted: false, // 是否静音
          controls: false,
          fluid: true, // 宽高自适应
          sources: [{
            src: 'rtmp://47.105.140.197:10090/live/test99', // 默认视频
            type: 'rtmp/flv'
          }]
        },
        options4: {
          autoplay: true, // 是否自动播放
          muted: false, // 是否静音
          controls: false,
          fluid: true, // 宽高自适应
          sources: [{
            src: 'rtmp://47.105.140.197:10090/live/test99', // 默认视频
            type: 'rtmp/flv'
          }]
        },
        params: {
          speed1d: 1,
          speed2d: 1,
          speed3d: 1,
          speed4d: 1
        }
      }
    },
    mounted() {
      this.initWebSocket()
      this.player1 = videojs('my-player1', this.options1, function onPlayerReady() {
        this.play()
      })
      this.player2 = videojs('my-player2', this.options2, function onPlayerReady() {
        this.play()
      })
      this.player3 = videojs('my-player3', this.options3, function onPlayerReady() {
        this.play()
      })
      this.player4 = videojs('my-player4', this.options4, function onPlayerReady() {
        this.play()
      })
    },
    methods: {
      toggleTable() {
        this.table.show = !this.table.show
      },
      getTableData(val) {
        console.log('子组件传来的数据>>>---->', val)
        this.fileList = val
      },
      handleDownload(row) {
        console.log('下载ws请求开始>>>---->', row)
        const wsData = {
          vehicleId: row.vehicleId,
          channelId: row.channelId,
          startTime: row.startTime,
          endTime: row.endTime,
          avitemType: row.avitemType,
          streamType: row.streamType,
          alarmSign: row.alarmType, // 报警类型标识
          memType: row.memType,
          conditionsExecution: 128 // 任务执行条件 128-wifi 64-lan 32-3G、4G
        }
        console.log('下载ws请求完成>>>---->', row)
        this.playerWS('73', wsData)
      },
      handlePlayer(row) {
        console.log('播放ws请求开始>>>---->', row)
        if (this.playnow > 4) {
          this.playnow = 1
          // 播放重置从第一个窗口播放
          console.log('> 4 本次点击视频将在第：' + this.playnow + '窗口播放')
          if (this.playnow === 1) {
            let videoType = null
            if (row.fileLocation === 1) {
              videoType = 'rtmp/flv'
            } else {
              videoType = 'video/mp4'
            }
            console.log('player options ------- >', row.fileUrl, videoType)
            this.player1 = videojs('my-player1', this.options1, function onPlayerReady() {
              var player1 = this
              player1.src({ src: row.fileUrl, type: videoType })
              this.play()
            })
            this.player1.play()
            this.player1row
            this.player1row = row
            console.log('>>>---->窗口1临时row', this.player1row)
          }
        } else {
          // 从当前窗口播放
          console.log('<= 4 本次点击视频将在第：' + this.playnow + '窗口播放')
          // 播放重置从对应窗口播放
          if (this.playnow === 1) {
            let videoType = null
            if (row.fileLocation === 1) {
              videoType = 'rtmp/flv'
            } else {
              videoType = 'video/mp4'
            }
            console.log('player options ------- >', row.fileUrl, videoType)
            this.player1 = videojs('my-player1', this.options1, function onPlayerReady() {
              var player1 = this
              player1.src({ src: row.fileUrl, type: videoType })
              this.play()
            })
            this.player1.play()
            this.player1row
            this.player1row = row
            console.log('>>>---->窗口1临时row', this.player1row)
          } else if (this.playnow === 2) {
            let videoType = null
            if (row.fileLocation === 1) {
              videoType = 'rtmp/flv'
            } else {
              videoType = 'video/mp4'
            }
            console.log('player options ------- >', row.fileUrl, videoType)
            this.player2 = videojs('my-player2', this.options1, function onPlayerReady() {
              var player2 = this
              player2.src({ src: row.fileUrl, type: videoType })
              this.play()
            })
            this.player2.play()
            this.player2row
            this.player2row = row
            console.log('>>>---->窗口1临时row', this.player2row)
          } else if (this.playnow === 3) {
            let videoType = null
            if (row.fileLocation === 1) {
              videoType = 'rtmp/flv'
            } else {
              videoType = 'video/mp4'
            }
            console.log('player options ------- >', row.fileUrl, videoType)
            this.player3 = videojs('my-player3', this.options1, function onPlayerReady() {
              var player3 = this
              player3.src({ src: row.fileUrl, type: videoType })
              this.play()
            })
            this.player3.play()
            this.player3row
            this.player3row = row
            console.log('>>>---->窗口1临时row', this.player3row)
          } else if (this.playnow === 4) {
            let videoType = null
            if (row.fileLocation === 1) {
              videoType = 'rtmp/flv'
            } else {
              videoType = 'video/mp4'
            }
            console.log('player options ------- >', row.fileUrl, videoType)
            this.player4 = videojs('my-player4', this.options1, function onPlayerReady() {
              var player4 = this
              player4.src({ src: row.fileUrl, type: videoType })
              this.play()
            })
            this.player4.play()
            this.player4row
            this.player4row = row
            console.log('>>>---->窗口1临时row', this.player4row)
          }
          // 播放后播放窗口后移1
          this.playnow = this.playnow + 1
        }
        if (row.avitemType === '0') { // 音视频
          console.log('音视频请求开始', row.avitemType)
          const wsData = {
            vehicleId: row.vehicleId,
            channelId: row.channelId,
            playBackStartTime: row.startTime,
            playBackEndTime: row.endTime,
            backType: 0, // 回放方式 0-正常回放 1-快进回放 2-关键快退回放 3-关键帧播放 4-单帧上传
            avitemType: row.avitemType,
            streamType: row.streamType,
            memType: row.memType,
            timesNum: 1 // 快进快退倍数 0-无效 1-1倍 2-2倍 3-4倍 4-8倍 5-16倍
          }
          this.playerWS('71', wsData)
        } else if (row.avitemType === '1') { // 音频
          console.log('音频请求开始', row.avitemType)
          const wsData = {
            vehicleId: row.vehicleId,
            channelId: row.channelId,
            playBackStartTime: row.startTime,
            playBackEndTime: row.endTime,
            backType: 0, // 回放方式 0-正常回放 1-快进回放 2-关键快退回放 3-关键帧播放 4-单帧上传
            avitemType: row.avitemType,
            streamType: row.streamType,
            memType: row.memType,
            timesNum: 1 // 快进快退倍数 0-无效 1-1倍 2-2倍 3-4倍 4-8倍 5-16倍
          }
          this.playerWS('71', wsData)
        } else if (row.avitemType === '2') { // 视频
          console.log('视频请求开始', row.avitemType)
          const wsData = {
            vehicleId: row.vehicleId,
            channelId: row.channelId,
            playBackStartTime: row.startTime,
            playBackEndTime: row.endTime,
            backType: 0, // 回放方式 0-正常回放 1-快进回放 2-关键快退回放 3-关键帧播放 4-单帧上传
            avitemType: row.avitemType,
            streamType: row.streamType,
            memType: row.memType,
            timesNum: 1 // 快进快退倍数 0-无效 1-1倍 2-2倍 3-4倍 4-8倍 5-16倍
          }
          this.playerWS('71', wsData)
        }
        console.log('播放ws请求完成>>>---->', row)
      },
      initWebSocket() { // 初始化websocket
        const vm = this
        vm.websocket = new WebSocket(process.env.WEBSOCKET_API)
        vm.websocket.onopen = function() {
        }
        vm.websocket.onmessage = function(evt) {
          const obj = JSON.parse(evt.data)
          console.log('收到ws消息', obj)
          if (obj.Command === '70') {
            vm.$emit('emitTableData666', obj.Body.data)
            if (obj.Body && obj.Body.data) {
              console.log('子组件收到的参数>>>---->', obj.Body.data)
              obj.Body.data.forEach(function(item) {
                if (item.avitemType === '0') {
                  // 0音视频 1音频 2视频
                  item.fileType = '音视频'
                } else if (item.avitemType === '1') {
                  item.fileType = '音频'
                } else if (item.avitemType === '2') {
                  item.fileType = '视频'
                }
              })
            }
          }
        }
        vm.websocket.onerror = function() {
          vm.initWebSocket()
        }
      },
      playerWS(command, wsData) { // 发送websocket消息，请求播放音视频
        const data = {
          Command: command,
          CommandType: 'Business',
          token: getToken('Admin-Token'),
          Body: {
            data: wsData
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
      playOrStopWS(command, wsData) { // 发送websocket消息，请求播放音视频
        const data = {
          Command: command,
          CommandType: 'Business',
          token: getToken('Admin-Token'),
          Body: {
            data: wsData
          }
        }
        console.log('当前操作是：' + command)
        console.log('当前请求参数是：', data)
        if (this.websocket.readyState === 1) {
          this.websocket.send(JSON.stringify(data))
        } else {
          this.$message.error('控制视频失败!')
        }
      },
      doPlay(player, win) {
        console.log('>>>---->点击了播放视频:窗口' + win)
        if (win === 1) {
          if (this.player1row === null) {
            this.$message({
              message: '请先在列表中播放视频后再操作视频窗口按钮',
              type: 'warning'
            })
            return
          }
          const wsData = {
            vehicleId: this.player1row.vehicleId,
            channelId: this.player1row.channelId,
            type: 0, // type：0-开始回放，1-暂停回放，2-结束回放，3-快进回放，4-关键帧快退回放，5-拖动回放，6关键帧播放
            timesNum: this.params.speed1d, // 快进快退倍数 0-无效 1-1倍 2-2倍 3-4倍 4-8倍 5-16倍
            dateTime: 0
          }
          console.log('窗口', win, '播放视频，wsData:', wsData)
          this.playOrStopWS('72', wsData) // 控制播放视频
        } else if (win === 2) {
          if (this.player2row === null) {
            this.$message({
              message: '请先在列表中播放视频后再操作视频窗口按钮',
              type: 'warning'
            })
            return
          }
          const wsData = {
            vehicleId: this.player2row.vehicleId,
            channelId: this.player2row.channelId,
            type: 0, // type：0-开始回放，1-暂停回放，2-结束回放，3-快进回放，4-关键帧快退回放，5-拖动回放，6关键帧播放
            timesNum: this.params.speed2d, // 快进快退倍数 0-无效 1-1倍 2-2倍 3-4倍 4-8倍 5-16倍
            dateTime: 0
          }
          console.log('窗口', win, '播放视频，wsData:', wsData)
          this.playOrStopWS('72', wsData) // 控制播放视频
        } else if (win === 3) {
          if (this.player3row === null) {
            this.$message({
              message: '请先在列表中播放视频后再操作视频窗口按钮',
              type: 'warning'
            })
            return
          }
          const wsData = {
            vehicleId: this.player3row.vehicleId,
            channelId: this.player3row.channelId,
            type: 0, // type：0-开始回放，1-暂停回放，2-结束回放，3-快进回放，4-关键帧快退回放，5-拖动回放，6关键帧播放
            timesNum: this.params.speed3d, // 快进快退倍数 0-无效 1-1倍 2-2倍 3-4倍 4-8倍 5-16倍
            dateTime: 0
          }
          console.log('窗口', win, '播放视频，wsData:', wsData)
          this.playOrStopWS('72', wsData) // 控制播放视频
        } else if (win === 4) {
          if (this.player4row === null) {
            this.$message({
              message: '请先在列表中播放视频后再操作视频窗口按钮',
              type: 'warning'
            })
            return
          }
          const wsData = {
            vehicleId: this.player4row.vehicleId,
            channelId: this.player4row.channelId,
            type: 0, // type：0-开始回放，1-暂停回放，2-结束回放，3-快进回放，4-关键帧快退回放，5-拖动回放，6关键帧播放
            timesNum: this.params.speed4d, // 快进快退倍数 0-无效 1-1倍 2-2倍 3-4倍 4-8倍 5-16倍
            dateTime: 0
          }
          console.log('窗口', win, '播放视频，wsData:', wsData)
          this.playOrStopWS('72', wsData) // 控制播放视频
        }
        player.play() // 播放
      },
      doPause(player, win) {
        console.log('>>>---->点击了停止播放:窗口' + win)
        if (win === 1) {
          if (this.player1row === null) {
            this.$message({
              message: '请先在列表中播放视频后再操作视频窗口按钮',
              type: 'warning'
            })
            return
          }
          const wsData = {
            vehicleId: this.player1row.vehicleId,
            channelId: this.player1row.channelId,
            type: 1, // type：0-开始回放，1-暂停回放，2-结束回放，3-快进回放，4-关键帧快退回放，5-拖动回放，6关键帧播放
            timesNum: this.params.speed1d, // 快进快退倍数 0-无效 1-1倍 2-2倍 3-4倍 4-8倍 5-16倍
            dateTime: 0
          }
          console.log('窗口', win, '暂停播放视频，wsData:', wsData)
          this.playOrStopWS('72', wsData) // 控制播放视频
        } else if (win === 2) {
          if (this.player2row === null) {
            this.$message({
              message: '请先在列表中播放视频后再操作视频窗口按钮',
              type: 'warning'
            })
            return
          }
          const wsData = {
            vehicleId: this.player2row.vehicleId,
            channelId: this.player2row.channelId,
            type: 1, // type：0-开始回放，1-暂停回放，2-结束回放，3-快进回放，4-关键帧快退回放，5-拖动回放，6关键帧播放
            timesNum: this.params.speed2d, // 快进快退倍数 0-无效 1-1倍 2-2倍 3-4倍 4-8倍 5-16倍
            dateTime: 0
          }
          console.log('窗口', win, '暂停播放视频，wsData:', wsData)
          this.playOrStopWS('72', wsData) // 控制播放视频
        } else if (win === 3) {
          if (this.player3row === null) {
            this.$message({
              message: '请先在列表中播放视频后再操作视频窗口按钮',
              type: 'warning'
            })
            return
          }
          const wsData = {
            vehicleId: this.player3row.vehicleId,
            channelId: this.player3row.channelId,
            type: 1, // type：0-开始回放，1-暂停回放，2-结束回放，3-快进回放，4-关键帧快退回放，5-拖动回放，6关键帧播放
            timesNum: this.params.speed3d, // 快进快退倍数 0-无效 1-1倍 2-2倍 3-4倍 4-8倍 5-16倍
            dateTime: 0
          }
          console.log('窗口', win, '暂停播放视频，wsData:', wsData)
          this.playOrStopWS('72', wsData) // 控制播放视频
        } else if (win === 4) {
          if (this.player4row === null) {
            this.$message({
              message: '请先在列表中播放视频后再操作视频窗口按钮',
              type: 'warning'
            })
            return
          }
          const wsData = {
            vehicleId: this.player4row.vehicleId,
            channelId: this.player4row.channelId,
            type: 1, // type：0-开始回放，1-暂停回放，2-结束回放，3-快进回放，4-关键帧快退回放，5-拖动回放，6关键帧播放
            timesNum: this.params.speed4d, // 快进快退倍数 0-无效 1-1倍 2-2倍 3-4倍 4-8倍 5-16倍
            dateTime: 0
          }
          console.log('窗口', win, '暂停播放视频，wsData:', wsData)
          this.playOrStopWS('72', wsData) // 控制播放视频
        }
        player.pause() // 暂停
      },
      speedsub(option, win) {
        console.log('>>>---->', option)
        if (option > 1) {
          const type = option === 1 ? 0 : 3
          if (win === 1) {
            if (this.player1row === null) {
              this.$message({
                message: '请先在列表中播放视频后再操作视频窗口按钮',
                type: 'warning'
              })
              return
            }
            this.params.speed1d = this.params.speed1d - 1
            const wsData = {
              vehicleId: this.player1row.vehicleId,
              channelId: this.player1row.channelId,
              type: type, // type：0-开始回放，1-暂停回放，2-结束回放，3-快进回放，4-关键帧快退回放，5-拖动回放，6关键帧播放
              timesNum: this.params.speed1d, // 快进快退倍数 0-无效 1-1倍 2-2倍 3-4倍 4-8倍 5-16倍
              dateTime: 0
            }
            console.log('窗口', win, '播放视频速度改变，wsData:', wsData)
            this.playOrStopWS('72', wsData) // 控制播放视频
          } else if (win === 2) {
            if (this.player2row === null) {
              this.$message({
                message: '请先在列表中播放视频后再操作视频窗口按钮',
                type: 'warning'
              })
              return
            }
            this.params.speed2d = this.params.speed2d - 1
            const wsData = {
              vehicleId: this.player2row.vehicleId,
              channelId: this.player2row.channelId,
              type: type, // type：0-开始回放，1-暂停回放，2-结束回放，3-快进回放，4-关键帧快退回放，5-拖动回放，6关键帧播放
              timesNum: this.params.speed2d, // 快进快退倍数 0-无效 1-1倍 2-2倍 3-4倍 4-8倍 5-16倍
              dateTime: 0
            }
            console.log('窗口', win, '播放视频速度改变，wsData:', wsData)
            this.playOrStopWS('72', wsData) // 控制播放视频
          } else if (win === 3) {
            if (this.player3row === null) {
              this.$message({
                message: '请先在列表中播放视频后再操作视频窗口按钮',
                type: 'warning'
              })
              return
            }
            this.params.speed3d = this.params.speed3d - 1
            const wsData = {
              vehicleId: this.player3row.vehicleId,
              channelId: this.player3row.channelId,
              type: type, // type：0-开始回放，1-暂停回放，2-结束回放，3-快进回放，4-关键帧快退回放，5-拖动回放，6关键帧播放
              timesNum: this.params.speed3d, // 快进快退倍数 0-无效 1-1倍 2-2倍 3-4倍 4-8倍 5-16倍
              dateTime: 0
            }
            console.log('窗口', win, '播放视频速度改变，wsData:', wsData)
            this.playOrStopWS('72', wsData) // 控制播放视频
          } else if (win === 4) {
            if (this.player4row === null) {
              this.$message({
                message: '请先在列表中播放视频后再操作视频窗口按钮',
                type: 'warning'
              })
              return
            }
            this.params.speed4d = this.params.speed4d - 1
            const wsData = {
              vehicleId: this.player4row.vehicleId,
              channelId: this.player4row.channelId,
              type: type, // type：0-开始回放，1-暂停回放，2-结束回放，3-快进回放，4-关键帧快退回放，5-拖动回放，6关键帧播放
              timesNum: this.params.speed4d, // 快进快退倍数 0-无效 1-1倍 2-2倍 3-4倍 4-8倍 5-16倍
              dateTime: 0
            }
            console.log('窗口', win, '播放视频速度改变，wsData:', wsData)
            this.playOrStopWS('72', wsData) // 控制播放视频
          }
        } else {
          this.$message({
            message: '已是最底播放速度',
            type: 'warning'
          })
        }
      },
      speedadd(option, win) {
        console.log(option)
        const type = option === 1 ? 0 : 3
        if (option < 5) {
          if (win === 1) {
            if (this.player1row === null) {
              this.$message({
                message: '请先在列表中播放视频后再操作视频窗口按钮',
                type: 'warning'
              })
              return
            }
            this.params.speed1d = this.params.speed1d + 1
            const wsData = {
              vehicleId: this.player1row.vehicleId,
              channelId: this.player1row.channelId,
              type: type, // type：0-开始回放，1-暂停回放，2-结束回放，3-快进回放，4-关键帧快退回放，5-拖动回放，6关键帧播放
              timesNum: this.params.speed1d, // 快进快退倍数 0-无效 1-1倍 2-2倍 3-4倍 4-8倍 5-16倍
              dateTime: 0
            }
            console.log('窗口', win, '播放视频速度改变，wsData:', wsData)
            this.playOrStopWS('72', wsData) // 控制播放视频
          } else if (win === 2) {
            if (this.player2row === null) {
              this.$message({
                message: '请先在列表中播放视频后再操作视频窗口按钮',
                type: 'warning'
              })
              return
            }
            this.params.speed2d = this.params.speed2d + 1
            const wsData = {
              vehicleId: this.player2row.vehicleId,
              channelId: this.player2row.channelId,
              type: type, // type：0-开始回放，1-暂停回放，2-结束回放，3-快进回放，4-关键帧快退回放，5-拖动回放，6关键帧播放
              timesNum: this.params.speed2d, // 快进快退倍数 0-无效 1-1倍 2-2倍 3-4倍 4-8倍 5-16倍
              dateTime: 0
            }
            console.log('窗口', win, '播放视频速度改变，wsData:', wsData)
            this.playOrStopWS('72', wsData) // 控制播放视频
          } else if (win === 3) {
            if (this.player3row === null) {
              this.$message({
                message: '请先在列表中播放视频后再操作视频窗口按钮',
                type: 'warning'
              })
              return
            }
            this.params.speed3d = this.params.speed3d + 1
            const wsData = {
              vehicleId: this.player3row.vehicleId,
              channelId: this.player3row.channelId,
              type: type, // type：0-开始回放，1-暂停回放，2-结束回放，3-快进回放，4-关键帧快退回放，5-拖动回放，6关键帧播放
              timesNum: this.params.speed3d, // 快进快退倍数 0-无效 1-1倍 2-2倍 3-4倍 4-8倍 5-16倍
              dateTime: 0
            }
            console.log('窗口', win, '播放视频速度改变，wsData:', wsData)
            this.playOrStopWS('72', wsData) // 控制播放视频
          } else if (win === 4) {
            if (this.player4row === null) {
              this.$message({
                message: '请先在列表中播放视频后再操作视频窗口按钮',
                type: 'warning'
              })
              return
            }
            this.params.speed4d = this.params.speed4d + 1
            const wsData = {
              vehicleId: this.player4row.vehicleId,
              channelId: this.player4row.channelId,
              type: type, // type：0-开始回放，1-暂停回放，2-结束回放，3-快进回放，4-关键帧快退回放，5-拖动回放，6关键帧播放
              timesNum: this.params.speed4d, // 快进快退倍数 0-无效 1-1倍 2-2倍 3-4倍 4-8倍 5-16倍
              dateTime: 0
            }
            console.log('窗口', win, '播放视频速度改变，wsData:', wsData)
            this.playOrStopWS('72', wsData) // 控制播放视频
          }
        } else {
          this.$message({
            message: '已是最高播放速度',
            type: 'warning'
          })
        }
      },
      speedchange(option, win) {
        console.log('窗口', win, '下拉值改变了：' + option)
        const type = option === 1 ? 0 : 3
        if (win === 1) {
          if (this.player1row === null) {
            this.$message({
              message: '请先在列表中播放视频后再操作视频窗口按钮',
              type: 'warning'
            })
            return
          }
          this.params.speed1d = this.params.speed1d + 1
          const wsData = {
            vehicleId: this.player1row.vehicleId,
            channelId: this.player1row.channelId,
            type: type, // type：0-开始回放，1-暂停回放，2-结束回放，3-快进回放，4-关键帧快退回放，5-拖动回放，6关键帧播放
            timesNum: option, // 快进快退倍数 0-无效 1-1倍 2-2倍 3-4倍 4-8倍 5-16倍
            dateTime: 0
          }
          console.log('窗口', win, '播放视频速度改变，wsData:', wsData)
          this.playOrStopWS('72', wsData) // 控制播放视频
        } else if (win === 2) {
          if (this.player2row === null) {
            this.$message({
              message: '请先在列表中播放视频后再操作视频窗口按钮',
              type: 'warning'
            })
            return
          }
          this.params.speed2d = this.params.speed2d + 1
          const wsData = {
            vehicleId: this.player2row.vehicleId,
            channelId: this.player2row.channelId,
            type: type, // type：0-开始回放，1-暂停回放，2-结束回放，3-快进回放，4-关键帧快退回放，5-拖动回放，6关键帧播放
            timesNum: option, // 快进快退倍数 0-无效 1-1倍 2-2倍 3-4倍 4-8倍 5-16倍
            dateTime: 0
          }
          console.log('窗口', win, '播放视频速度改变，wsData:', wsData)
          this.playOrStopWS('72', wsData) // 控制播放视频
        } else if (win === 3) {
          if (this.player3row === null) {
            this.$message({
              message: '请先在列表中播放视频后再操作视频窗口按钮',
              type: 'warning'
            })
            return
          }
          this.params.speed3d = this.params.speed3d + 1
          const wsData = {
            vehicleId: this.player3row.vehicleId,
            channelId: this.player3row.channelId,
            type: type, // type：0-开始回放，1-暂停回放，2-结束回放，3-快进回放，4-关键帧快退回放，5-拖动回放，6关键帧播放
            timesNum: option, // 快进快退倍数 0-无效 1-1倍 2-2倍 3-4倍 4-8倍 5-16倍
            dateTime: 0
          }
          console.log('窗口', win, '播放视频速度改变，wsData:', wsData)
          this.playOrStopWS('72', wsData) // 控制播放视频
        } else if (win === 4) {
          if (this.player4row === null) {
            this.$message({
              message: '请先在列表中播放视频后再操作视频窗口按钮',
              type: 'warning'
            })
            return
          }
          this.params.speed4d = this.params.speed4d + 1
          const wsData = {
            vehicleId: this.player4row.vehicleId,
            channelId: this.player4row.channelId,
            type: type, // type：0-开始回放，1-暂停回放，2-结束回放，3-快进回放，4-关键帧快退回放，5-拖动回放，6关键帧播放
            timesNum: option, // 快进快退倍数 0-无效 1-1倍 2-2倍 3-4倍 4-8倍 5-16倍
            dateTime: 0
          }
          console.log('窗口', win, '播放视频速度改变，wsData:', wsData)
          this.playOrStopWS('72', wsData) // 控制播放视频
        }
      }
    },
    components: {
      SearchBox
    }
  }
</script>

<style lang="scss">
  @import '../../../styles/video-js.min.css';
  .videos {
    /*height: calc(100vh - 342px);*/
    transition: height 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
    &.videos-higher {
      max-height: calc(100vh - 142px);
    }
    .el-row {
      height: 50%;
    }
    .el-row .el-col {
      height: 100%;
      border: 1px solid #eaeefb;
    }
    .el-row .el-col .div .video {
      height: 100%;
      border: 10px solid #eaeefb;
    }

    .grid-content bg-purple-light {
      position: relative;
      overflow: hidden;

      .el-button-group {
        position: absolute;
        bottom: 0;
        right: 0;
      }
    }
  }
  .el-footer {
    padding: 0;
    position: relative;
    .toggle-table-btn {
      position: absolute;
      border-radius: 10px 10px 0 0;
      padding: 3px 20px;
      left: 50%;
      margin-top: -20px;
      margin-left: -27px;
    }
    .el-table {
      width: 100%;
      height: 200px;
      transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
      border-top: none;
      &.el-table-close {
        height: 0;
      }
    }
  }
</style>
