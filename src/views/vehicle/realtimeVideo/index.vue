<template>
  <el-container class="el-container-rt-video">
    <el-dialog
      title="提示"
      :visible.sync="defaultFlashDialog"
      width="30%"
      :before-close="defaultFlashDialogHandleClose">
      <span>请允许flash加载</span>
      <span slot="footer" class="dialog-footer">
        <a href="https://get.adobe.com/cn/flashplayer/" class="flashLoadMsg" target="_blank">允许</a>
      </span>
    </el-dialog>
    <el-aside width="300px" class="el-aside-left" @click="leftAsideClick">
      <div v-show = "treeMenu" class="right_menu" id = "menu">
        <ul>
          <li tabindex="-1" class="menu__item" id="menu-4994-1-0" @click ="getVideosStop">停止预览</li>
          <li tabindex="-1" class="menu__item" id="menu-4994-1-1" @click ="setVodeosstart">预览所有</li>
          <li tabindex="-1" class="menu__item" id="menu-4994-1-2" @click ="setVideosstop">停止所有预览</li>
          <!-- <li tabindex="-1" class="menu__item" id="menu-4994-1-4" @click ="doPlayer('4')">ch4</li>
          <li tabindex="-1" class="menu__item" id="menu-4994-1-4" @click ="doPlayer('5')">ch5</li>
          <li tabindex="-1" class="menu__item" id="menu-4994-1-5" @click ="doPlayer('6')">ch6</li> -->
        </ul>
      </div>
      <!-- 车辆汇总统计区 -->
      <div style="height: 55px; width: 100%; font-size: 12px; padding-top: 10px; padding-bottom: 10px;">
          <div class="left_top_veh" @click="monitorChange(-1)">
            <div>
              <span class="veh_count" :class="activeStatus==-1? 'monitor_all_checked' : 'monitor_all_normal'"></span>
            </div>
            <div>
              <span :class="activeStatus==-1? 'font_active' : 'font_normal'">全部({{asideObj.allVehicle}})</span>
            </div>
          </div>
          <div class="left_top_veh" @click="monitorChange(1)">
            <div>
              <span class="veh_count" :class="activeStatus==1? 'monitor_online_checked' : 'monitor_online_normal'"></span>
            </div>
            <div>
              <span :class="activeStatus==1? 'font_active' : 'font_normal'">在线({{asideObj.onlineVehicle}})</span>
            </div>
          </div>
          <div class="left_top_veh" @click="monitorChange(0)">
            <div>
              <span class="veh_count" :class="activeStatus==0? 'monitor_offline_checked' : 'monitor_offline_normal'"></span>
            </div>
            <div>
              <span :class="activeStatus==0? 'font_active' : 'font_normal'">离线({{asideObj.offlineVehicle}})</span>
            </div>
          </div>
      </div>
      <!-- <div style="margin-top:5px;font-size:12px;height:calc(100vh - 154px);overflow:auto;max-width:296px;"> -->
        <!-- <el-tree ref="tree" @node-contextmenu="treeMenuRihgtClick" :default-expanded-keys="expandedTree" lazy @node-click="handleNodeClick" :load="loadDeptNode" :default-checked-keys="checkedList" :render-content="renderContent" @check="getCurrentKey" :show-checkbox="showCheckbox" :highlight-current="true" :data="treeData" :props="defaultProps" node-key="id" :expand-on-click-node="false"></el-tree> -->
        <el-tree ref="tree" class="el-tree-j" style="margin-top:5px;font-size:12px" 
          :default-expanded-keys="expandedTree" lazy @node-click="handleNodeClick" :load="loadDeptNode" :default-checked-keys="checkedList" :render-content="renderContent" @check="getCurrentKey" :highlight-current="true" :data="treeData" :props="defaultProps" node-key="fullPath" :expand-on-click-node="false"></el-tree>
      <!-- </div> -->
    </el-aside>
    <el-container>
      <el-header height="42px" class="el-header-controller">
        <span @click="setVideosModel(1)"><img src="../../../assets/realtime/01.png"></span>
        <span @click="setVideosModel(4)"><img src="../../../assets/realtime/02.png"></span>
        <span @click="setVideosModel(6)"><img src="../../../assets/realtime/03.png"></span>
        <span @click="setVideosModel(9)"><img src="../../../assets/realtime/04.png"></span>
        <span @click="setVideosModel(16)"><img src="../../../assets/realtime/05.png"></span>
        <el-tooltip class="item" effect="dark" content="开始预览所有" placement="top">
          <span @click="setVodeosstart"><img src="../../../assets/realtime/06.png"></span>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="停止预览所有" placement="top">
          <span @click="setVideosstop"><img src="../../../assets/realtime/07.png"></span>
        </el-tooltip>
        <!-- <el-button type="text" ><img src="../../../assets/realtime/08.png"></el-button> -->
      </el-header>
      <el-container class="el-container-videos">
        <el-main class="el-main-players" :class="videos.modelClass">
          <div class="player" @mouseup="getmenu($event,'video1',1)">
            <video-player :options="options1" :pid="pid1" ref="player1ref" aria-controls="controls"></video-player>
            <div class="plfloat">
             <el-button class="videoBtns" size="small" @click="doPlay('video1', 1)">▶</el-button>
             <el-button class="videoBtns" size="small" @click="doPause('video1', 1)">█</el-button>
            </div>
          </div>
          <div class="player" @mouseup="getmenu($event,'video2',2)">
            <video-player :options="options2" :pid="pid2" ref="player2ref"></video-player>
            <div class="plfloat">
             <el-button class="videoBtns" @click="doPlay('video2', 2)">▶</el-button>
             <el-button class="videoBtns" @click="doPause('video2', 2)">█</el-button>
            </div>
          </div>
          <div class="player" @mouseup="getmenu($event,'video3',3)">
            <video-player :options="options3" :pid="pid3" ref="player3ref"></video-player>
            <div class="plfloat">
             <el-button class="videoBtns" @click="doPlay('video3', 3)">▶</el-button>
             <el-button class="videoBtns" @click="doPause('video3', 3)">█</el-button>
            </div>
          </div>
          <div class="player" @mouseup="getmenu($event,'video4',4)">
            <video-player :options="options4" :pid="pid4" ref="player4ref"></video-player>
            <div class="plfloat">
             <el-button class="videoBtns" @click="doPlay('video4', 4)">▶</el-button>
             <el-button class="videoBtns" @click="doPause('video4', 4)">█</el-button>
            </div>
          </div>
          <div class="player" @mouseup="getmenu($event,'video5',5)">
            <video-player :options="options5" :pid="pid5" ref="player5ref"></video-player>
            <div class="plfloat">
             <el-button class="videoBtns" @click="doPlay('video5', 5)">▶</el-button>
             <el-button class="videoBtns" @click="doPause('video5', 5)">█</el-button>
            </div>
          </div>
          <div class="player" @mouseup="getmenu($event,'video6',6)">
            <video-player :options="options6" :pid="pid6" ref="player6ref"></video-player>
            <div class="plfloat">
             <el-button class="videoBtns" @click="doPlay('video6', 6)">▶</el-button>
             <el-button class="videoBtns" @click="doPause('video6', 6)">█</el-button>
            </div>
          </div>
          <div class="player" @mouseup="getmenu($event,'video7',7)">
            <video-player :options="options7" :pid="pid7" ref="player7ref"></video-player>
            <div class="plfloat">
             <el-button class="videoBtns" @click="doPlay('video7', 7)">▶</el-button>
             <el-button class="videoBtns" @click="doPause('video7', 7)">█</el-button>
            </div>
          </div>
          <div class="player" @mouseup="getmenu($event,'video8',8)">
            <video-player :options="options8" :pid="pid8" ref="player8ref"></video-player>
            <div class="plfloat">
             <el-button class="videoBtns" @click="doPlay('video8', 8)">▶</el-button>
             <el-button class="videoBtns" @click="doPause('video8', 8)">█</el-button>
            </div>
          </div>
          <div class="player" @mouseup="getmenu($event,'video9',9)">
            <video-player :options="options9" :pid="pid9" ref="player9ref"></video-player>
            <div class="plfloat">
             <el-button class="videoBtns" @click="doPlay('video9', 9)">▶</el-button>
             <el-button class="videoBtns" @click="doPause('video9', 9)">█</el-button>
            </div>
          </div>
          <div class="player" @mouseup="getmenu($event,'video10',10)">
            <video-player :options="options10" :pid="pid10" ref="player10ref"></video-player>
            <div class="plfloat">
             <el-button class="videoBtns" @click="doPlay('video10', 10)">▶</el-button>
             <el-button class="videoBtns" @click="doPause('video10', 10)">█</el-button>
            </div>
          </div>
          <div class="player" @mouseup="getmenu($event,'video11',11)">
            <video-player :options="options11" :pid="pid11" ref="player11ref"></video-player>
            <div class="plfloat">
             <el-button class="videoBtns" @click="doPlay('video11', 11)">▶</el-button>
             <el-button class="videoBtns" @click="doPause('video11', 11)">█</el-button>
            </div>
          </div>
          <div class="player" @mouseup="getmenu($event,'video12',12)">
            <video-player :options="options12" :pid="pid12" ref="player12ref"></video-player>
            <div class="plfloat">
             <el-button class="videoBtns" @click="doPlay('video12', 12)">▶</el-button>
             <el-button class="videoBtns" @click="doPause('video12', 12)">█</el-button>
            </div>
          </div>
          <div class="player" @mouseup="getmenu($event,'video13',13)">
            <video-player :options="options13" :pid="pid13" ref="player13ref"></video-player>
            <div class="plfloat">
             <el-button class="videoBtns" @click="doPlay('video13', 13)">▶</el-button>
             <el-button class="videoBtns" @click="doPause('video13', 13)">█</el-button>
            </div>
          </div>
          <div class="player" @mouseup="getmenu($event,'video14',14)">
            <video-player :options="options14" :pid="pid14" ref="player14ref"></video-player>
            <div class="plfloat">
             <el-button class="videoBtns" @click="doPlay('video14', 14)">▶</el-button>
             <el-button class="videoBtns" @click="doPause('video14', 14)">█</el-button>
            </div>
          </div>
          <div class="player" @mouseup="getmenu($event,'video15',15)">
            <video-player :options="options15" :pid="pid15" ref="player15ref"></video-player>
            <div class="plfloat">
             <el-button class="videoBtns" @click="doPlay('video15', 15)">▶</el-button>
             <el-button class="videoBtns" @click="doPause('video15', 15)">█</el-button>
            </div>
          </div>
          <div class="player" @mouseup="getmenu($event,'video16',16)">
            <video-player :options="options16" :pid="pid16" ref="player16ref"></video-player>
            <div class="plfloat">
             <el-button class="videoBtns" @click="doPlay('video16', 16)">▶</el-button>
             <el-button class="videoBtns" @click="doPause('video16', 16)">█</el-button>
            </div>
          </div>
        </el-main>
      </el-container>
      <!-- <el-footer :height="footer.height">
        <el-button type="primary" :icon="footer.show ? 'el-icon-arrow-down' : 'el-icon-arrow-up'" class="toggle-table-btn" size="mini" @click="toggleFooter"></el-button>
        <el-tabs value="first" class="el-tabs-rt-video-data">
          <el-tab-pane label="北斗监控" name="first">北斗监控</el-tab-pane>
          <el-tab-pane label="报警信息" name="second">报警信息</el-tab-pane>
          <el-tab-pane label="媒体文件" name="third">媒体文件</el-tab-pane>
          <el-tab-pane label="系统事件" name="fourth">系统事件</el-tab-pane>
          <el-tab-pane label="平台消息" name="five">平台消息</el-tab-pane>
        </el-tabs>
      </el-footer> -->
      <div v-if="loadingZZ" class="zzloading">
        <div class="zzloading-spinner">
          <i class="el-icon-loading"></i>
          <p class="zzloading-text">正在获取视频，请等待 {{nums}} s</p>
          <span class="zzloading-cannel" @click="() => {this.loadingZZ = false;this.nums = 10}">取消</span>
        </div>
      </div>
      <el-dialog
        title="提示"
        :visible.sync="centerDialogVisible"
        width="30%"
        center>
        <p style="text-align:center;">确定覆盖第一个视频</p>
        <span slot="footer" class="dialog-footer">
          <el-button @click="centerDialogVisible = false">否</el-button>
          <el-button type="primary" @click="() => {centerDialogVisible = false; playnow = 1}">是</el-button>
        </span>
      </el-dialog>
    </el-container>
  </el-container>
</template>

<script>
import { BmlMarkerClusterer } from 'vue-baidu-map'
import { getToken } from '@/utils/auth'
import BMap from 'vue-baidu-map'
import { getBaseDept } from '@/api/vehicleMonitor/realtimeVideo'
import videoPlayer from './videoPlayer'
var videojs = require('video.js')
require('videojs-flash')
import { getBrowser } from '@/utils/date.js'
export default {
  components: {
    BmlMarkerClusterer,
    videoPlayer
  },
  data() {
    return {
      defaultFlashDialog: false,
      centerDialogVisible: false,
      loadingZZ: false,
      nums: 10,
      VideosNumber: {
        type: Object
      },
      transcodingFlag: '0', // 视频是否需要转码 0需要 1不需要
      chlNumber: [], // 通道号
      param: [], // 请求参数
      VehicleId: [], // 车辆数组(开始/结束)
      VehicleChl: [], // 通道号（开始/结束）
      footer: {
        height: '35px',
        show: false
      },
      vehicles: {
        tree: []
      },
      videos: {
        modelClass: 'el-main-players-model4'
      },
      checkedList: [],
      showCheckbox: true,
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'text',
        isLeaf: 'isLeaf'
      },
      expandedTree: [], // 默认展开的树节点'1-610000','1-610100'
      asideObj: {
        allVehicle: 0,
        onlineVehicle: 0,
        offlineVehicle: 0
      },
      activeStatus: -1,
      deptTreeQuery: { id: '' },
      deptVehCount: {},
      websocket: null,
      vehicleList: [],
      onlineVehicleList: [],
      offlineVehicleList: [],
      runningVehicleList: [],
      stopVehicleList: [],
      alarmVehicleList: [],
      vehicleInfo: {},
      treeMenu: false,
      rihgtVehicleId: '',
      index: 1,
      playnow: 1,
      once: null,
      oncechl: null, // 再次播放通道号
      pid1: 'my-player1',
      pid2: 'my-player2',
      pid3: 'my-player3',
      pid4: 'my-player4',
      pid5: 'my-player5',
      pid6: 'my-player6',
      pid7: 'my-player7',
      pid8: 'my-player8',
      pid9: 'my-player9',
      pid10: 'my-player10',
      pid11: 'my-player11',
      pid12: 'my-player12',
      pid13: 'my-player13',
      pid14: 'my-player14',
      pid15: 'my-player15',
      pid16: 'my-player16',
      win1chl: 1,
      win2chl: 1,
      win3chl: 1,
      win4chl: 1,
      win5chl: 1,
      win6chl: 1,
      win7chl: 1,
      win8chl: 1,
      win9chl: 1,
      win10chl: 1,
      win11chl: 1,
      win12chl: 1,
      win13chl: 1,
      win14chl: 1,
      win15chl: 1,
      win16chl: 1,
      options1: {
        text: 'judian',
        autoplay: true, // 是否自动播放
        muted: false, // 是否静音
        controls: false,
        fluid: true, // 宽高自适应
        sources: [{
          type: 'rtmp/flv',
          // src: 'rtmp://58.200.131.2:1935/livetv/hunantv'
          src: 'rtmp://1.85.32.4/live/livestream' // 默认视频
        }]
      },
      options2: {
        autoplay: true, // 是否自动播放
        muted: false, // 是否静音
        controls: false,
        fluid: true, // 宽高自适应
        sources: [{
          src: 'rtmp://1.85.32.4/live/livestream', // 默认视频
          type: 'rtmp/flv'
        }]
      },
      options3: {
        autoplay: true, // 是否自动播放
        muted: false, // 是否静音
        controls: false,
        fluid: true, // 宽高自适应
        sources: [{
          src: 'rtmp://1.85.32.4/live/livestream', // 默认视频
          type: 'rtmp/flv'
        }]
      },
      options4: {
        autoplay: true, // 是否自动播放
        muted: false, // 是否静音
        controls: false,
        fluid: true, // 宽高自适应
        sources: [{
          src: 'rtmp://1.85.32.4/live/livestream', // 默认视频
          type: 'rtmp/flv'
        }]
      },
      options5: {
        autoplay: true, // 是否自动播放
        muted: false, // 是否静音
        controls: false,
        fluid: true, // 宽高自适应
        sources: [{
          src: 'rtmp://1.85.32.4/live/livestream', // 默认视频
          type: 'rtmp/flv'
        }]
      },
      options6: {
        autoplay: true, // 是否自动播放
        muted: false, // 是否静音
        controls: false,
        fluid: true, // 宽高自适应
        sources: [{
          src: 'rtmp://1.85.32.4/live/livestream', // 默认视频
          type: 'rtmp/flv'
        }]
      },
      options7: {
        autoplay: true, // 是否自动播放
        muted: false, // 是否静音
        controls: false,
        fluid: true, // 宽高自适应
        sources: [{
          src: 'rtmp://1.85.32.4/live/livestream', // 默认视频
          type: 'rtmp/flv'
        }]
      },
      options8: {
        autoplay: true, // 是否自动播放
        muted: false, // 是否静音
        controls: false,
        fluid: true, // 宽高自适应
        sources: [{
          src: 'rtmp://1.85.32.4/live/livestream', // 默认视频
          type: 'rtmp/flv'
        }]
      },
      options9: {
        autoplay: true, // 是否自动播放
        muted: false, // 是否静音
        controls: false,
        fluid: true, // 宽高自适应
        sources: [{
          src: 'rtmp://1.85.32.4/live/livestream', // 默认视频
          type: 'rtmp/flv'
        }]
      },
      options10: {
        autoplay: true, // 是否自动播放
        muted: false, // 是否静音
        controls: false,
        fluid: true, // 宽高自适应
        sources: [{
          src: this.videoSrc, // 默认视频
          type: 'rtmp/flv'
        }]
      },
      options11: {
        autoplay: true, // 是否自动播放
        muted: false, // 是否静音
        controls: false,
        fluid: true, // 宽高自适应
        sources: [{
          src: 'rtmp://1.85.32.4/live/livestream', // 默认视频
          type: 'rtmp/flv'
        }]
      },
      options12: {
        autoplay: true, // 是否自动播放
        muted: false, // 是否静音
        controls: false,
        fluid: true, // 宽高自适应
        sources: [{
          src: 'rtmp://1.85.32.4/live/livestream', // 默认视频
          type: 'rtmp/flv'
        }]
      },
      options13: {
        autoplay: true, // 是否自动播放
        muted: false, // 是否静音
        controls: false,
        fluid: true, // 宽高自适应
        sources: [{
          src: 'rtmp://1.85.32.4/live/livestream', // 默认视频
          type: 'rtmp/flv'
        }]
      },
      options14: {
        autoplay: true, // 是否自动播放
        muted: false, // 是否静音
        controls: false,
        fluid: true, // 宽高自适应
        sources: [{
          src: 'rtmp://1.85.32.4/live/livestream', // 默认视频
          type: 'rtmp/flv'
        }]
      },
      options15: {
        autoplay: true, // 是否自动播放
        muted: false, // 是否静音
        controls: false,
        fluid: true, // 宽高自适应
        sources: [{
          src: 'rtmp://1.85.32.4/live/livestream', // 默认视频
          type: 'rtmp/flv'
        }]
      },
      options16: {
        autoplay: true, // 是否自动播放
        muted: false, // 是否静音
        controls: false,
        fluid: true, // 宽高自适应
        sources: [{
          src: 'rtmp://1.85.32.4/live/livestream', // 默认视频
          type: 'rtmp/flv'
        }]
      }
    }
  },
  created() {
    this.initWebSocket()
  },
  mounted() {
    this.getBaseTree()
    this.browser()
  },
  methods: {
    defaultFlashDialogHandleClose(done) {
      this.$confirm('关闭将不能正常播放视频')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    // 开始
    doPlay(val, idx) {
      console.log(val)
      this.rihgtVehicleId = null
      this.chlNumber = []
      this.param = []
      this.once = idx
      if (this.VideosNumber[val] !== undefined) {
        this.rihgtVehicleId = this.VideosNumber[val].split('-')[0]
        this.chlNumber.push(this.VideosNumber[val].split('-')[1])
        this.oncechl = this.VideosNumber[val].split('-')[1]
        this.param.push({ 'vehicleId': this.rihgtVehicleId, 'channelIds': this.chlNumber })
        this.doPlayer()
      } else {
        this.$message({
          message: '请先播放视频后再操作视频窗口按钮',
          type: 'warning'
        })
      }
    },
    // 停止
    doPause(val, idx) {
      this.rihgtVehicleId = null
      this.chlNumber = []
      this.param = []
      this.once = idx
      if (this.VideosNumber[val] !== undefined) {
        this.rihgtVehicleId = this.VideosNumber[val].split('-')[0]
        this.chlNumber.push(this.VideosNumber[val].split('-')[1])
        this.param.push({ 'vehicleId': this.rihgtVehicleId, 'channelIds': this.chlNumber })
        this.docontrol()
      } else {
        this.$message({
          message: '请先播放视频后再操作视频窗口按钮',
          type: 'warning'
        })
      }
    },
    // 视频右键事件
    getmenu(event, val, index) {
      document.oncontextmenu = function() {
        return false
      }
      if (event.button === 2) {
        this.treeMenu = true
        const menu = document.querySelector('#menu')
        /* 菜单定位基于鼠标点击位置 */
        menu.style.left = event.clientX + 20 + 'px'
        menu.style.top = event.clientY - 95 + 'px'
        this.rihgtVehicleId = null
        this.chlNumber = []
        if (this.VideosNumber[val] !== undefined) {
          this.rihgtVehicleId = this.VideosNumber[val].split('-')[0]
          this.chlNumber.push(this.VideosNumber[val].split('-')[1])
        } else {
          this.$message({
            message: '请先播放视频后再操作视频窗口按钮',
            type: 'warning'
          })
        }
      } else {
        this.treeMenu = false
      }
    },
    monitorChange(status) {
      this.activeStatus = status
      this.getBaseTree()
      // this.subscribeTop(24, this.topDeptId)
    },
    treeMenuRihgtClick(event, object, value, element) {
      if (value.key.substring(0, value.key.indexOf('-')) === '4') {
        this.treeMenu = true
        const menu = document.querySelector('#menu')
        /* 菜单定位基于鼠标点击位置 */
        menu.style.left = event.clientX + 20 + 'px'
        menu.style.top = event.clientY - 95 + 'px'
      }
      console.log('右键被点击的event:', event)
      console.log('右键被点击的object:', object)
      console.log('右键被点击的value:', value)
      console.log('右键被点击的element:', element)
      console.log('车辆信息:', object.id)
      console.log(object.id.substring(2))
      this.rihgtVehicleId = object.id.substring(2)
    },
    docontrol() { // 视频控制方法
      const data = {
        Command: '58',
        CommandType: 'Business',
        token: getToken('Admin-Token'),
        Body: {
          data: {
            param: this.param,
            avitemType: 0 // 数据类型：0音视频 1视频 2双向对讲 3监听 4中心广播 5透传
          }
        }
      }
      console.log('当前请求参数是：' + '[' + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds() + ']', JSON.stringify(data))
      this.websocket.send(JSON.stringify(data))
    },
    doPlayer() {
      if (!this.param.length) return
      console.log('chl----', this.chlNumber)
      console.log('vid', this.rihgtVehicleId)
      // 发送实时视频播放ws请求
      console.log(this.playnow)
      const data = {
        Command: '57',
        CommandType: 'Business',
        token: getToken('Admin-Token'),
        Body: {
          data: {
            param: this.param,
            avitemType: 0 // 数据类型：0音视频 1视频 2双向对讲 3监听 4中心广播 5透传
          }
        }
      }
      console.log('当前请求参数是:' + '[' + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds() + ']', JSON.stringify(data))
      this.websocket.send(JSON.stringify(data))
      this.loadingZZ = true
      const a = () => {
        setTimeout(() => {
          if (this.loadingZZ) {
            this.nums--
            if (this.nums >= 1) {
              a()
            } else {
              this.$message.error('未获取到视频，请重试或更换车辆/通道')
              this.loadingZZ = false
              this.nums = 10
            }
          }
        }, 1000)
      }
      a()
      // this.timeout = setTimeout(() => {
      //   if (this.loadingZZ) {
      //     this.$message.error('未获取到视频，请重试或更换车辆/通道')
      //     this.loadingZZ = false
      //     this.nums = 10
      //   }
      // }, 10000)
    },
    start(val, index) {
      let fileUrl = ''
      if (this.transcodingFlag === '0') {
        fileUrl = 'rtmp://1.85.32.4:1935/live/' + val.vehicleNo + '.' + val.vehicleColor + '.' + index + '.' + 0 + '.' + val.authorizeCode// 临时地址
      } else {
        // ws接口改变，地址现在由页面拼接：http://[服务器ip地址]:[端口号]/[车牌号码].[车牌颜色].[逻辑通道号].[音视频标志].[时效口令]
        fileUrl = 'http://' + val.serverIp + ':' + val.serverPort + '/' + val.vehicleNo + '.' + val.vehicleColor + '.' + 1 + '.' + 0 + '.' + val.authorizeCode// 临时地址
      }
      // const fileUrl = 'rtmp://58.200.131.2:1935/livetv/hunantv'
      const type = 'rtmp/flv'
      console.log(fileUrl)
      // this.playnow = Number(index)
      // this.playnow = 1
      const arr = []
      arr.push(index)
      this.VehicleId.push({ 'vehicleId': val.vehicleId, 'channelIds': arr })
      switch (this.playnow) {
        case 1:
          // 在窗口1播放视频
          this.options1.sources.splice(0)
          this.options1.sources[0] = { src: fileUrl, type: type }
          this.$set(this.VideosNumber, 'video1', val.vehicleId + '-' + index)
          this.$refs.player1ref.player = videojs('my-player1', this.options1, function onPlayerReady() {
            var player = this
            player.src({ src: fileUrl, type: type })
            setTimeout(() => {
              this.play()
            }, 5000)
          })
          this.playnow = this.playnow + 1
          break
        case 2:
          // 在窗口2播放视频
          this.$set(this.VideosNumber, 'video2', val.vehicleId + '-' + index)
          this.options2.sources[0] = { src: fileUrl, type: type }
          this.$refs.player2ref.player = videojs('my-player2', this.options2, function onPlayerReady() {
            var player = this
            player.src({ src: fileUrl, type: type })
            setTimeout(() => {
              this.play()
            }, 5000)
          })
          this.playnow = this.playnow + 1
          break
        case 3:
          // 在窗口3播放视频
          this.$set(this.VideosNumber, 'video3', val.vehicleId + '-' + index)
          this.options3.sources[0] = { src: fileUrl, type: type }
          this.$refs.player3ref.player = videojs('my-player3', this.options3, function onPlayerReady() {
            var player = this
            player.src({ src: fileUrl, type: type })
            setTimeout(() => {
              this.play()
            }, 5000)
          })
          this.playnow = this.playnow + 1
          break
        case 4:
          // 在窗口4播放视频
          this.$set(this.VideosNumber, 'video4', val.vehicleId + '-' + index)
          this.options4.sources[0] = { src: fileUrl, type: type }
          this.$refs.player4ref.player = videojs('my-player4', this.options4, function onPlayerReady() {
            var player = this
            player.src({ src: fileUrl, type: type })
            setTimeout(() => {
              this.play()
            }, 5000)
          })
          this.playnow = this.playnow + 1
          break
        case 5:
          // 在窗口5播放视频
          this.$set(this.VideosNumber, 'video5', val.vehicleId + '-' + index)
          this.options5.sources[0] = { src: fileUrl, type: type }
          this.$refs.player5ref.player = videojs('my-player5', this.options5, function onPlayerReady() {
            var player = this
            player.src({ src: fileUrl, type: type })
            setTimeout(() => {
              this.play()
            }, 5000)
          })
          this.playnow = this.playnow + 1
          break
        case 6:
          // 在窗口6播放视频
          this.$set(this.VideosNumber, 'video6', val.vehicleId + '-' + index)
          this.options6.sources[0] = { src: fileUrl, type: type }
          this.$refs.player6ref.player = videojs('my-player6', this.options6, function onPlayerReady() {
            var player = this
            player.src({ src: fileUrl, type: type })
            setTimeout(() => {
              this.play()
            }, 5000)
          })
          this.playnow = this.playnow + 1
          break
        case 7:
          // 在窗口7播放视频
          this.$set(this.VideosNumber, 'video7', val.vehicleId + '-' + index)
          this.options7.sources[0] = { src: fileUrl, type: type }
          this.$refs.player7ref.player = videojs('my-player7', this.options7, function onPlayerReady() {
            var player = this
            player.src({ src: fileUrl, type: type })
            setTimeout(() => {
              this.play()
            }, 5000)
          })
          this.playnow = this.playnow + 1
          break
        case 8:
          // 在窗口8播放视频
          this.$set(this.VideosNumber, 'video8', val.vehicleId + '-' + index)
          this.options8.sources[0] = { src: fileUrl, type: type }
          this.$refs.player8ref.player = videojs('my-player8', this.options8, function onPlayerReady() {
            var player = this
            player.src({ src: fileUrl, type: type })
            setTimeout(() => {
              this.play()
            }, 5000)
          })
          this.playnow = this.playnow + 1
          break
        case 9:
          // 在窗口9播放视频
          this.$set(this.VideosNumber, 'video9', val.vehicleId + '-' + index)
          this.options9.sources[0] = { src: fileUrl, type: type }
          this.$refs.player9ref.player = videojs('my-player9', this.options9, function onPlayerReady() {
            var player = this
            player.src({ src: fileUrl, type: type })
            setTimeout(() => {
              this.play()
            }, 5000)
          })
          this.playnow = this.playnow + 1
          break
        case 10:
          // 在窗口10播放视频
          this.$set(this.VideosNumber, 'video10', val.vehicleId + '-' + index)
          this.options10.sources[0] = { src: fileUrl, type: type }
          this.$refs.player10ref.player = videojs('my-player10', this.options10, function onPlayerReady() {
            var player = this
            player.src({ src: fileUrl, type: type })
            setTimeout(() => {
              this.play()
            }, 5000)
          })
          this.playnow = this.playnow + 1
          break
        case 11:
          // 在窗口11播放视频
          this.$set(this.VideosNumber, 'video11', val.vehicleId + '-' + index)
          this.options11.sources[0] = { src: fileUrl, type: type }
          this.$refs.player11ref.player = videojs('my-player11', this.options11, function onPlayerReady() {
            var player = this
            player.src({ src: fileUrl, type: type })
            setTimeout(() => {
              this.play()
            }, 5000)
          })
          this.playnow = this.playnow + 1
          break
        case 12:
          // 在窗口12播放视频
          this.$set(this.VideosNumber, 'video12', val.vehicleId + '-' + index)
          this.options12.sources[0] = { src: fileUrl, type: type }
          this.$refs.player12ref.player = videojs('my-player12', this.options12, function onPlayerReady() {
            var player = this
            player.src({ src: fileUrl, type: type })
            setTimeout(() => {
              this.play()
            }, 5000)
          })
          this.playnow = this.playnow + 1
          break
        case 13:
          // 在窗口13播放视频
          this.$set(this.VideosNumber, 'video13', val.vehicleId + '-' + index)
          this.options13.sources[0] = { src: fileUrl, type: type }
          this.$refs.player13ref.player = videojs('my-player13', this.options13, function onPlayerReady() {
            var player = this
            player.src({ src: fileUrl, type: type })
            setTimeout(() => {
              this.play()
            }, 5000)
          })
          this.playnow = this.playnow + 1
          break
        case 14:
          // 在窗口14播放视频
          this.$set(this.VideosNumber, 'video14', val.vehicleId + '-' + index)
          this.options14.sources[0] = { src: fileUrl, type: type }
          this.$refs.player14ref.player = videojs('my-player14', this.options14, function onPlayerReady() {
            var player = this
            player.src({ src: fileUrl, type: type })
            setTimeout(() => {
              this.play()
            }, 5000)
          })
          this.playnow = this.playnow + 1
          break
        case 15:
          // 在窗口15播放视频
          this.$set(this.VideosNumber, 'video15', val.vehicleId + '-' + index)
          this.options15.sources[0] = { src: fileUrl, type: type }
          this.$refs.player15ref.player = videojs('my-player15', this.options15, function onPlayerReady() {
            var player = this
            player.src({ src: fileUrl, type: type })
            setTimeout(() => {
              this.play()
            }, 5000)
          })
          this.playnow = this.playnow + 1
          break
        case 16:
          // 在窗口16播放视频
          this.$set(this.VideosNumber, 'video16', val.vehicleId + '-' + index)
          this.options16.sources[0] = { src: fileUrl, type: type }
          this.$refs.player16ref.player = videojs('my-player16', this.options16, function onPlayerReady() {
            var player = this
            player.src({ src: fileUrl, type: type })
            setTimeout(() => {
              this.play()
            }, 5000)
          })
          this.centerDialogVisible = true
          // this.playnow = 1 // 16下次播放重置从窗口1开始播放 弹框控制是否循环
          break
        default:
          break
      }
    },
    again(val, index) { // 再次播放
      // ws接口改变，地址现在由页面拼接：http://[服务器ip地址]:[端口号]/[车牌号码].[车牌颜色].[逻辑通道号].[音视频标志].[时效口令]
      // const fileUrl = 'rtmp://' + val.serverIp + ':' + val.serverPort + '/live/' + val.vehicleNo + '.' + val.vehicleColor + '.' + 1 + '.' + 0 + '.' + val.authorizeCode// 临时地址
      const fileUrl = 'rtmp://1.85.32.4:1935/live/' + val.vehicleNo + '.' + val.vehicleColor + '.' + index + '.' + 0 + '.' + val.authorizeCode// 临时地址
      // const fileUrl = 'rtmp://58.200.131.2:1935/livetv/hunantv'
      const type = 'rtmp/flv'
      console.log(fileUrl)
      switch (this.once) {
        case 1:
          // 在窗口1播放视频
          this.options1.sources.splice(0)
          this.options1.sources[0] = { src: fileUrl, type: type }
          this.$refs.player1ref.player = videojs('my-player1', this.options1, function onPlayerReady() {
            var player = this
            player.src({ src: fileUrl, type: type })
            setTimeout(() => {
              this.play()
            }, 5000)
          })
          break
        case 2:
          // 在窗口2播放视频
          this.options2.sources[0] = { src: fileUrl, type: type }
          this.$refs.player2ref.player = videojs('my-player2', this.options2, function onPlayerReady() {
            var player = this
            player.src({ src: fileUrl, type: type })
            setTimeout(() => {
              this.play()
            }, 5000)
          })
          break
        case 3:
          // 在窗口3播放视频
          this.options3.sources[0] = { src: fileUrl, type: type }
          this.$refs.player3ref.player = videojs('my-player3', this.options3, function onPlayerReady() {
            var player = this
            player.src({ src: fileUrl, type: type })
            setTimeout(() => {
              this.play()
            }, 5000)
          })
          break
        case 4:
          // 在窗口4播放视频
          this.options4.sources[0] = { src: fileUrl, type: type }
          this.$refs.player4ref.player = videojs('my-player4', this.options4, function onPlayerReady() {
            var player = this
            player.src({ src: fileUrl, type: type })
            setTimeout(() => {
              this.play()
            }, 5000)
          })
          break
        case 5:
          // 在窗口5播放视频
          this.options5.sources[0] = { src: fileUrl, type: type }
          this.$refs.player5ref.player = videojs('my-player5', this.options5, function onPlayerReady() {
            var player = this
            player.src({ src: fileUrl, type: type })
            setTimeout(() => {
              this.play()
            }, 5000)
          })
          break
        case 6:
          // 在窗口6播放视频
          this.options6.sources[0] = { src: fileUrl, type: type }
          this.$refs.player6ref.player = videojs('my-player6', this.options6, function onPlayerReady() {
            var player = this
            player.src({ src: fileUrl, type: type })
            setTimeout(() => {
              this.play()
            }, 5000)
          })
          break
        case 7:
          // 在窗口7播放视频
          this.options7.sources[0] = { src: fileUrl, type: type }
          this.$refs.player7ref.player = videojs('my-player7', this.options7, function onPlayerReady() {
            var player = this
            player.src({ src: fileUrl, type: type })
            setTimeout(() => {
              this.play()
            }, 5000)
          })
          break
        case 8:
          // 在窗口8播放视频
          this.options8.sources[0] = { src: fileUrl, type: type }
          this.$refs.player8ref.player = videojs('my-player8', this.options8, function onPlayerReady() {
            var player = this
            player.src({ src: fileUrl, type: type })
            setTimeout(() => {
              this.play()
            }, 5000)
          })
          break
        case 9:
          // 在窗口9播放视频
          this.options9.sources[0] = { src: fileUrl, type: type }
          this.$refs.player9ref.player = videojs('my-player9', this.options9, function onPlayerReady() {
            var player = this
            player.src({ src: fileUrl, type: type })
            setTimeout(() => {
              this.play()
            }, 5000)
          })
          break
        case 10:
          // 在窗口10播放视频
          this.options10.sources[0] = { src: fileUrl, type: type }
          this.$refs.player10ref.player = videojs('my-player10', this.options10, function onPlayerReady() {
            var player = this
            player.src({ src: fileUrl, type: type })
            setTimeout(() => {
              this.play()
            }, 5000)
          })
          break
        case 11:
          // 在窗口11播放视频
          this.options11.sources[0] = { src: fileUrl, type: type }
          this.$refs.player11ref.player = videojs('my-player11', this.options11, function onPlayerReady() {
            var player = this
            player.src({ src: fileUrl, type: type })
            setTimeout(() => {
              this.play()
            }, 5000)
          })
          break
        case 12:
          // 在窗口12播放视频
          this.options12.sources[0] = { src: fileUrl, type: type }
          this.$refs.player12ref.player = videojs('my-player12', this.options12, function onPlayerReady() {
            var player = this
            player.src({ src: fileUrl, type: type })
            setTimeout(() => {
              this.play()
            }, 5000)
          })
          break
        case 13:
          // 在窗口13播放视频
          this.options13.sources[0] = { src: fileUrl, type: type }
          this.$refs.player13ref.player = videojs('my-player13', this.options13, function onPlayerReady() {
            var player = this
            player.src({ src: fileUrl, type: type })
            setTimeout(() => {
              this.play()
            }, 5000)
          })
          break
        case 14:
          // 在窗口14播放视频
          this.options14.sources[0] = { src: fileUrl, type: type }
          this.$refs.player14ref.player = videojs('my-player14', this.options14, function onPlayerReady() {
            var player = this
            player.src({ src: fileUrl, type: type })
            setTimeout(() => {
              this.play()
            }, 5000)
          })
          break
        case 15:
          // 在窗口15播放视频
          this.options15.sources[0] = { src: fileUrl, type: type }
          this.$refs.player15ref.player = videojs('my-player15', this.options15, function onPlayerReady() {
            var player = this
            player.src({ src: fileUrl, type: type })
            setTimeout(() => {
              this.play()
            }, 5000)
          })
          break
        case 16:
          // 在窗口16播放视频
          this.options16.sources[0] = { src: fileUrl, type: type }
          this.$refs.player16ref.player = videojs('my-player16', this.options16, function onPlayerReady() {
            var player = this
            player.src({ src: fileUrl, type: type })
            setTimeout(() => {
              this.play()
            }, 5000)
          })
          break
        default:
          break
      }
    },
    leftAsideClick() {
      console.log('点击了其他区域，关掉树节点菜单')
      this.treeMenu = false
    },
    toggleFooter() {
      this.footer.show = !this.footer.show
      this.footer.height = this.footer.show ? '300px' : '35px'
    },
    setVideosModel(model) {
      this.videos.modelClass = `el-main-players-model${model}`
    },
    setVodeosstart() {
      this.treeMenu = false
      // 发送实时视频播放ws请求
      this.chlNumber = []
      this.once = null
      this.oncechl = null
      if (this.VehicleId.length !== 0) {
        this.param = this.VehicleId
        this.doPlayer()
      } else {
        this.$message('请选择车辆')
      }
    },
    setVideosstop() {
      this.treeMenu = false
      // 发送实时视频播放ws请求
      this.once = null
      this.oncechl = null
      if (this.VehicleId.length !== 0) {
        this.param = this.VehicleId
        this.docontrol()
      } else {
        this.$message('请选择车辆')
      }
    },
    getVideosStop() {
      this.treeMenu = false
      this.param = []
      this.once = null
      this.oncechl = null
      if (this.chlNumber.length !== 0 && this.rihgtVehicleId !== '') {
        this.param.push({ 'vehicleId': this.rihgtVehicleId, 'channelIds': this.chlNumber })
        this.docontrol()
      }
    },
    browser() {
      const swf = getBrowser()
      if (swf === undefined) {
        this.defaultFlashDialog = true
        // this.$message({
        //   message: '请安装flash插件',
        //   type: 'error'
        // })
      }
    },
    getBaseTree() {
      this.deptTreeQuery = { id: '', activeStatus: this.activeStatus === -1 ? '' : this.activeStatus, type: 'vedio' }
      getBaseDept(this.deptTreeQuery).then(res => { // 加载机构树顶级节点
        if (res.code === 0) {
          if (this.websocket.readyState === 1) {
            this.subscribeTop(24, res.data[0].fullPath)
            this.subscribeTop(5, res.data[0].fullPath)
            this.subscribeExpend(4, 'online', res.data[0].fullPath)
          }
          this.topDeptId = res.data[0].fullPath
          this.treeData = res.data
          const deptVeh = this.deptVehCount[this.topDeptId] // 取机构车辆缓存数据
          this.$set(this.treeData[0], 'allVehicle', (deptVeh ? deptVeh.allVehicle : 0))
          this.$set(this.treeData[0], 'onlineVehicle', (deptVeh ? deptVeh.onlineVehicle : 0))
          this.$set(this.treeData[0], 'offlineVehicle', (deptVeh ? deptVeh.allVehicle : 0))
        } else {
          this.$message({ message: res.msg, type: 'error' })
        }
      })
    },
    setDataTotree(treeData, pId, obj) { // 机构树填值
      if (treeData) {
        for (let i = 0; i < treeData.length; i++) {
          const td = treeData[i]
          if (td.type !== '3') {
            if (td.id) {
              if (td.id.substring(2) === pId) {
                treeData[i].allVehicle = obj.allVehicle
                treeData[i].onlineVehicle = obj.onlineVehicle
                treeData[i].offlineVehicle = obj.offlineVehicle
                return
              } else {
                this.setDataTotree(treeData[i].children, pId, obj)
              }
            }
          } else {
            if (td.id.substring(2) === pId) {
              treeData[i].online = obj.online
            } else {
              this.setDataTotree(treeData[i].children, pId, obj)
            }
          }
        }
      }
    },
    subscribe(command, isdept, id) { // 发送websocket消息，获取车辆或者机构下车辆经纬度信息
      const data = {
        Command: command,
        CommandType: 'track',
        Token: getToken(),
        Body: {
          isdept: isdept,
          id: id
        }
      }
      console.log('ws请求参数：', data)
      if (this.websocket.readyState === 1) {
        this.websocket.send(JSON.stringify(data))
      } else {
        console.log('websocket信息发送失败')
      }
    },
    renderContent(h, { node, data, store }) { // 渲染tree
      if (data.type === '1') {
        if (this.activeStatus === -1) {
          return (
            <span style='height:18px;line-height:18px'>
              <i class='tree_dept_icon'></i>
              <span>{node.label}</span>
              <span>({data.onlineVehicle}/{data.allVehicle})</span>
            </span>
          )
        } else if (this.activeStatus === 1) {
          return (
            <span style='height:18px;line-height:18px'>
              <i class='tree_dept_icon'></i>
              <span>{node.label}</span>
              <span>({data.onlineVehicle})</span>
            </span>
          )
        } else if (this.activeStatus === 0) {
          return (
            <span style='height:18px;line-height:18px'>
              <i class='tree_dept_icon'></i>
              <span>{node.label}</span>
              <span>({data.allVehicle - data.onlineVehicle})</span>
            </span>
          )
        }
      } else if (data.type === '4') {
        if (data.online === '1') {
          return (
            <span class='online'>
              <i class='tree_veh_online_icon'></i>
              <span>{node.label}</span>
            </span>
          )
        } else {
          return (
            <span class='offline'>
              <i class='tree_veh_offline_icon'></i>
              <span>{node.label}</span>
            </span>
          )
        }
      } else if (data.type === '5') {
        if (data.online === '1') {
          return (
            <span class='online'>
              <i class='tree_veh_huis'></i>
              <span>{node.label}</span>
            </span>
          )
        } else {
          return (
            <span class='offline'>
              <i class='tree_veh_huis'></i>
              <span>{node.label}</span>
            </span>
          )
        }
      } else if (data.type === '2') {
        if (this.activeStatus === -1) {
          return (
            <span>
              <i class='tree_line_icon'></i>
              <span>{node.label}</span>
              <span>({data.onlineVehicle}/{data.allVehicle})</span>
            </span>
          )
        } else if (this.activeStatus === 1) {
          return (
            <span>
              <i class='tree_line_icon'></i>
              <span>{node.label}</span>
              <span>({data.onlineVehicle})</span>
            </span>
          )
        } else if (this.activeStatus === 0) {
          return (
            <span>
              <i class='tree_line_icon'></i>
              <span>{node.label}</span>
              <span>({data.allVehicle - data.onlineVehicle})</span>
            </span>
          )
        }
      } else if (data.type === '3') {
        if (this.activeStatus === -1) {
          return (
            <span>
              <i class='tree_owers_icon'></i>
              <span>{node.label}</span>
              <span>({data.onlineVehicle}/{data.allVehicle})</span>
            </span>
          )
        } else if (this.activeStatus === 1) {
          return (
            <span>
              <i class='tree_owers_icon'></i>
              <span>{node.label}</span>
              <span>({data.onlineVehicle})</span>
            </span>
          )
        } else if (this.activeStatus === 0) {
          return (
            <span>
              <i class='tree_owers_icon'></i>
              <span>{node.label}</span>
              <span>({data.allVehicle - data.onlineVehicle})</span>
            </span>
          )
        }
      }
    },
    subscribeExpend(command, commandType, deptId) { // 实时接收已展开过的节点下车辆上下线通知
      const data = {
        Command: command,
        CommandType: commandType,
        Token: getToken(),
        Body: {
          deptId: deptId
        }
      }
      console.log('实时接收已展开过的节点下车辆上下线通知请求参数：', data)
      if (this.websocket.readyState === 1) {
        this.websocket.send(JSON.stringify(data))
      } else {
        console.log('websocket信息发送失败')
      }
    },
    subscribeTop(command, deptId) { // 获取企业节点车辆在线数
      const data = {
        Command: command,
        CommandType: 'online',
        Token: getToken(),
        Body: {
          TopDeptId: deptId
        }
      }
      console.log('获取企业节点车辆在线数请求参数：', data)
      if (this.websocket.readyState === 1) {
        this.websocket.send(JSON.stringify(data))
      } else {
        console.log('websocket信息发送失败')
      }
    },
    getSelectArr(vehicleArray, arr, deptId) {
      if (arr) {
        for (let i = 0; i < arr.length; i++) {
          const td = arr[i]
          if (td.type === '3') {
            vehicleArray.push(td)
          } else {
            this.getSelectArr(vehicleArray, arr[i].children, deptId)
          }
        }
        return vehicleArray
      }
    },
    deleteArray(list, id) { // 删除数组中的某个元素
      for (let i = 0; i < list.length; i++) {
        if (list[i].BaseVehicle.VehicleId === id) {
          if (i === 0) {
            list.shift()
            return list
          } else if (i === list.length - 1) {
            list.pop()
            return list
          } else {
            list.splice(i, 1)
            return list
          }
        }
      }
    },
    handleNodeClick(val) { // 结点点击事件
      // this.leftAsideClick()

      this.chlNumber = []
      this.param = []
      this.once = null
      this.oncechl = null
      this.transcodingFlag = val.transcodingFlag
      if (val.type === '4') {
        console.log(val.id)
        this.rihgtVehicleId = val.id.substring(2)
        // 处理已经播放的车辆通道停止发送websocket
        if (this.VehicleId && this.VehicleId.length) {
          this.chlNumber.push('1')
          this.chlNumber.push('2')
          this.chlNumber.push('3')
          this.chlNumber.push('4')
          this.VehicleId.forEach(item => {
            if (item.vehicleId === this.rihgtVehicleId) {
              item.channelIds.forEach(t => {
                const idx = this.chlNumber.indexOf(t)
                if (idx !== -1) {
                  this.chlNumber.splice(idx, 1)
                }
              })
            }
          })
        } else {
          this.chlNumber.push('1')
          this.chlNumber.push('2')
          this.chlNumber.push('3')
          this.chlNumber.push('4')
        }
        if (this.chlNumber.length < 1) {
          this.$message('已经在播放中。。')
          return
        }
        this.param.push({ 'vehicleId': this.rihgtVehicleId, 'channelIds': this.chlNumber })
        this.VehicleChl = this.chlNumber
        // this.VehicleId.push({ 'vehicleId': this.rihgtVehicleId, 'channelIds': this.VehicleChl })
      }
      if (val.type === '5') {
        console.log('val.parentId:' + val.parentId)
        this.rihgtVehicleId = val.parentId.substring(2)
        if (this.VehicleId && this.VehicleId.length) {
          if (val.text === 'ch1') {
            this.chlNumber.push('1')
          }
          if (val.text === 'ch2') {
            this.chlNumber.push('2')
          }
          if (val.text === 'ch3') {
            this.chlNumber.push('3')
          }
          if (val.text === 'ch4') {
            this.chlNumber.push('4')
          }
          this.VehicleId.forEach(item => {
            if (item.vehicleId === this.rihgtVehicleId) {
              item.channelIds.forEach(t => {
                const idx = this.chlNumber.indexOf(t)
                if (idx !== -1) {
                  this.chlNumber.splice(idx, 1)
                }
              })
            }
          })
        } else {
          if (val.text === 'ch1') {
            this.chlNumber.push('1')
          }
          if (val.text === 'ch2') {
            this.chlNumber.push('2')
          }
          if (val.text === 'ch3') {
            this.chlNumber.push('3')
          }
          if (val.text === 'ch4') {
            this.chlNumber.push('4')
          }
        }
        if (this.chlNumber.length < 1) {
          this.$message('已经在播放中。。')
          return
        }
        this.param.push({ 'vehicleId': this.rihgtVehicleId, 'channelIds': this.chlNumber })
        // if (this.VehicleId.length === 0) {
        //   this.VehicleChl = this.chlNumber
        //   this.VehicleId.push({ 'vehicleId': this.rihgtVehicleId, 'channelIds': this.VehicleChl })
        // } else {
        //   let isreturn = false
        //   this.VehicleId.forEach((item, i) => {
        //     if (!isreturn) {
        //       if (item.vehicleId === this.rihgtVehicleId) {
        //         item.channelIds.push(this.chlNumber[0])
        //         isreturn = true
        //       } else {
        //         this.VehicleChl = this.chlNumber
        //         this.VehicleId.push({ 'vehicleId': this.rihgtVehicleId, 'channelIds': this.VehicleChl })
        //         isreturn = true
        //       }
        //     }
        //   })
        // }
      }
      const cCount = this.playnow
      console.log('this.VehicleId:' + JSON.stringify(this.VehicleId))
      // this.VehicleId.forEach(car => {
      //   car.channelIds.forEach(chl => {
      //     cCount++
      //   })
      // })
      console.log('cCount:=====' + cCount)
      if (cCount > 4) {
        this.setVideosModel(6)
      }
      if (cCount > 6) {
        this.setVideosModel(9)
      }
      if (cCount > 9) {
        this.setVideosModel(16)
      }
      if (cCount > 16) {
        // this.$message('最多16个视频')
        // return
        this.playnow = 1
      }
      this.doPlayer()
    },
    loadDeptNode(node, resolve) {
      const deptId = node.key
      let ids = node.key
      if (node.data.type === '4') ids = node.data.id
      this.deptTreeQuery = { id: ids, nodeType: node.data.type, activeStatus: this.activeStatus === -1 ? '' : this.activeStatus, type: 'vedio' }
      if (node.level === 0) {
        return
      }
      getBaseDept(this.deptTreeQuery).then(res => {
        if (res.code === 0) {
          const checkArr = this.checkedList
          const childrenData = res.data
          // const _this = this
          if (childrenData.length === 0) {
            node.isLeaf = true // 叶子
            resolve([])
            return
          }
          for (let i = 0; i < childrenData.length; i++) {
            const child = childrenData[i]
            if (this.checkedList.indexOf(node.key) > -1) {
              checkArr.push(child.fullPath)
            }
            if (child.type !== '4') {
              const deptVeh = this.deptVehCount[child.fullPath] // 取机构车辆缓存数据
              this.$set(child, 'allVehicle', (deptVeh ? deptVeh.allVehicle : 0))
              this.$set(child, 'onlineVehicle', (deptVeh ? deptVeh.onlineVehicle : 0))
              this.$set(child, 'offlineVehicle', (deptVeh ? deptVeh.offlineVehicle : 0))
            } else {
              this.$set(child, 'online', '0')
            }
          }
          const allarr = this.treeData
          if (node.level !== 0) {
            // 异步加载树节点 push到treedata中给websocket32使用
            const a = (allarr) => {
              allarr.forEach((item, index, arr) => {
                if (item.children && item.children instanceof Array) {
                  a(item.children)
                } else {
                  if (item.fullPath === node.key) {
                    arr[index].children = childrenData
                  }
                }
              })
            }
            a(allarr)
          }
          this.treeData = allarr
          resolve(childrenData)
          this.subscribeExpend(4, 'online', deptId)
          // setTimeout(() => {
          //   if (childrenData.length > 0) {
          //     _this.$refs.tree.setCheckedKeys(checkArr)
          //   } else {
          //     _this.$refs.tree.setCheckedKeys(_this.checkedList)
          //   }
          // }, 10)
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    handleNodeExpand(data, node) {
      const deptId = data.key
      this.deptTreeQuery = { id: data.id, activeStatus: this.activeStatus === -1 ? '' : this.activeStatus, type: 'vedio' }
      getBaseDept(this.deptTreeQuery).then(res => {
        if (res.code === 0) {
          const checkArr = this.checkedList
          const arr = res.data
          const _this = this
          if (arr.length === 0) {
            node.isLeaf = true
            return
          }
          for (let i = 0; i < arr.length; i++) {
            const element = arr[i]
            if (this.checkedList.indexOf(data.id) > -1) {
              checkArr.push(element.id)
            }
            if (element.type !== '4') {
              if (!element.children) {
                this.$set(element, 'children', [])
              }
              const deptVeh = this.deptVehCount[element.id] // 取机构车辆缓存数据
              this.$set(element, 'text', element.text)
              this.$set(element, 'allVehicle', (deptVeh ? deptVeh.allVehicle : 0))
              this.$set(element, 'onlineVehicle', (deptVeh ? deptVeh.onlineVehicle : 0))
              this.$set(element, 'offlineVehicle', (deptVeh ? deptVeh.offlineVehicle : 0))
            } else {
              this.$set(element, 'online', '0')
            }
          }
          data.children = arr
          this.subscribeExpend(4, 'online', deptId)
          setTimeout(() => {
            if (arr.length > 0) {
              _this.$refs.tree.setCheckedKeys(checkArr)
            } else {
              _this.$refs.tree.setCheckedKeys(_this.checkedList)
            }
          }, 10)
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    getCurrentKey(data, node) { // 获取当前选中节点的key
      const id = data.id
      this.checkedList = node.checkedKeys
      if (this.checkedList.indexOf(data.id) > -1) {
        if (data.type === '4') {
          this.subscribe(1, 1, id.substring(2))
        } else {
          this.subscribe(1, 0, id)
        }
      } else {
        if (data.type === '4') {
          if (id === this.vehicleInfo.vId + '') {
            this.isShowDialog = false
          }
          this.subscribe(15, 1, id)
          this.deleteArray(this.vehicleList, data.id)
        } else {
          this.subscribe(15, 0, id)
          const vehicleArray = []
          const arr = this.getSelectArr(vehicleArray, this.treeData[0].children, data.id)
          for (let i = 0; i < arr.length; i++) {
            this.deleteArray(this.vehicleList, arr[i].id)
          }
        }
      }
    },
    updataTree(childrenData) {
      childrenData.forEach(child => {
        if (child.children && child.children instanceof Array) {
          this.updataTree(child.children)
        }
        if (child.type !== '4') {
          const deptVeh = this.deptVehCount[child.fullPath] // 取机构车辆缓存数据
          this.$set(child, 'allVehicle', (deptVeh ? deptVeh.allVehicle : 0))
          this.$set(child, 'onlineVehicle', (deptVeh ? deptVeh.onlineVehicle : 0))
          this.$set(child, 'offlineVehicle', (deptVeh ? deptVeh.offlineVehicle : 0))
        } else {
          // this.$set(child, 'online', '1')
        }
      })
    },
    initWebSocket() { // 初始化websocket
      const vm = this
      vm.websocket = new WebSocket(process.env.WEBSOCKET_API)
      // vm.websocket = new WebSocket('ws://192.168.5.137:6947')
      vm.websocket.onopen = function() {
        console.log('websocket连接成功:' + process.env.WEBSOCKET_API)
        if (vm.topDeptId && vm.topDeptId !== '') {
          vm.subscribeTop(5, vm.topDeptId.substring(2))
          vm.subscribeTop(24, vm.topDeptId.substring(2))
          vm.subscribeExpend(4, 'online', vm.topDeptId.substring(2))
        }
      }
      vm.websocket.onmessage = function(evt) {
        const obj = JSON.parse(evt.data)
        // console.log('收到websocket消息' + '[' + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds() + '] receive command(' + obj.Command + ') message:' + JSON.stringify(obj))
        switch (obj.Command) {
          case '15': { // 取消订阅应答
            const vehIds = obj.Body.VehIds
            for (let i = 0; i < vehIds.length; i++) {
              vm.deleteArray(vm.vehicleList, vehIds[i])
              vm.deleteArray(vm.onlineVehicleList, vehIds[i])
              vm.deleteArray(vm.offlineVehicleList, vehIds[i])
              vm.deleteArray(vm.runningVehicleList, vehIds[i])
              vm.deleteArray(vm.stopVehicleList, vehIds[i])
              vm.deleteArray(vm.alarmVehicleList, vehIds[i])
            }
            break
          }
          case '26': { // 订阅->轨迹数据
            // console.log('[' + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds() + '] receive command(' + obj.Command + ') message:' + JSON.stringify(obj))
            const dataVehicle = obj.Body.DataVehicle
            const baseVehicle = obj.Body.BaseVehicle
            const vdata = obj.Body

            const point = new BMap.Point(dataVehicle.PosData.Longitude, dataVehicle.PosData.Latitude)
            new BMap.Geocoder().getLocation(point, function(rs) {
              vdata.BaseVehicle.PC = rs.addressComponents.province + rs.addressComponents.city
              vdata.BaseVehicle.Street = rs.addressComponents.district + rs.addressComponents.street + rs.addressComponents.streetNumber
              vdata.BaseVehicle.Address = vdata.BaseVehicle.PC + vdata.BaseVehicle.Street
              for (let j = 0; j < vm.vehicleList.length; j++) {
                const v = vm.vehicleList[j]
                v.BaseVehicle.Address = vdata.BaseVehicle.PC + vdata.BaseVehicle.Street
                vm.$set(vm.vehicleList, j, v)
              }
            })

            if (vm.vehicleList.length === 0) {
              vm.vehicleList.push(vdata)
            } else {
              const arr = []
              for (let i = 0; i < vm.vehicleList.length; i++) {
                arr.push(vm.vehicleList[i].BaseVehicle.VehicleId)
              }
              if (arr.indexOf(baseVehicle.VehicleId) > -1) {
                const j = vm.contains(arr, baseVehicle.VehicleId)
                vm.vehicleList[j] = vdata
              } else {
                vm.vehicleList.push(vdata)
              }
              if (vm.vehicleInfo.BaseVehicle !== undefined && vm.vehicleInfo.BaseVehicle.VehicleId === baseVehicle.VehicleId) {
                vm.vehicleInfo = vdata
              }
            }
            break
          }
          case '27': { // 实时接收已展开过的节点下车辆上下线通知
            // console.log('[' + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds() + '] receive command(' + obj.Command + ') message:' + JSON.stringify(obj))

            const offlineVeh = obj.Body.Offline
            const onlineVeh = obj.Body.Online

            offlineVeh.forEach(nodePath => {
              if (vm.$refs.tree.getNode(nodePath) !== null) {
                vm.$refs.tree.getNode(nodePath).data.online = '0'
              }
            })

            onlineVeh.forEach(nodePath => {
              if (vm.$refs.tree.getNode(nodePath) !== null) {
                vm.$refs.tree.getNode(nodePath).data.online = '1'
              }
            })
            break
          }
          case '33': { // 企业车辆总数,在线数,离线数统计
            // console.log('收到websocket消息' + '[' + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds() + '] receive command(' + obj.Command + ') message:' + JSON.stringify(obj))
            vm.asideObj = obj.Body
            vm.treeData[0].onlineVehicle = obj.Body.onlineVehicle
            vm.treeData[0].allVehicle = obj.Body.allVehicle
            vm.deptVehCount[vm.topDeptId] = obj.Body // 缓存顶级节车辆数，32 command不返回顶级节点
            break
          }
          case '32': { // 获取企业所有节点车辆在线数
            // console.log('收到websocket消息' + '[' + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds() + '] receive command(' + obj.Command + ') message:' + JSON.stringify(obj))
            const data = obj.Body
            for (const key in data) {
              // 更新机构车辆数缓存
              vm.deptVehCount[key] = data[key]
              // 更新机构树节点的车辆总数、在线数、离线数
              // vm.setDataTotree(vm.treeData[0].children, key, data[key])
            }
            if (vm.treeData[0].children) {
              const childrenData = vm.treeData[0].children
              vm.updataTree(childrenData)
            }
            break
          }
          case '57': { // 获得sim号
            console.log('收到websocket消息' + '[' + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds() + '] receive command(' + obj.Command + ') message:' + JSON.stringify(obj))
            if (obj.Body.result === 0) {
              if (!vm.loadingZZ) return
              vm.loadingZZ = false
              vm.nums = 10
              // console.log(vm.VideosNumber.length)
              // if (vm.VideosNumber.length !== undefined || vm.VideosNumber !== '') {
              //   console.log(vm.VideosNumber)
              //   console.log('2244566788899990900')
              //   console.log(obj.Body)
              // } else
              if (vm.once !== null && vm.oncechl !== null) {
                console.log('___________二次播放_______________')
                console.log(vm.oncechl)
                vm.again(obj.Body, vm.oncechl)
              } else {
                if (vm.rihgtVehicleId === obj.Body.vehicleId && vm.chlNumber.length === 4) {
                  switch (vm.index) {
                    case 1:
                      vm.start(obj.Body, vm.index)
                      vm.index = vm.index + 1
                      break
                    case 2:
                      vm.start(obj.Body, vm.index)
                      vm.index = vm.index + 1
                      break
                    case 3:
                      vm.start(obj.Body, vm.index)
                      vm.index = vm.index + 1
                      break
                    case 4:
                      vm.start(obj.Body, vm.index)
                      vm.index = 1
                      break
                    default: {
                      break
                    }
                  }
                } else {
                  vm.start(obj.Body, vm.chlNumber[0])
                }
              }
            } else if (obj.Body.result === 1) {
              vm.loadingZZ = false
              vm.nums = 10
              vm.$message({ type: 'error', message: '失败' })
            } else if (obj.Body.result === 2) {
              vm.loadingZZ = false
              vm.nums = 10
              vm.$message({ type: 'error', message: '不支持' })
            } else if (obj.Body.result === 3) {
              vm.loadingZZ = false
              vm.nums = 10
              vm.$message({ type: 'error', message: '回话结束' })
            } else if (obj.Body.result === 4) {
              vm.loadingZZ = false
              vm.nums = 10
              vm.$message({ type: 'error', message: '时效口令错误' })
            } else if (obj.Body.result === 5) {
              vm.loadingZZ = false
              vm.nums = 10
              vm.$message({ type: 'error', message: '不满足跨域条件' })
            }
            break
          }
          case '58': {
            console.log('收到websocket消息' + '[' + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds() + '] receive command(' + obj.Command + ') message:' + JSON.stringify(obj))
            // console.log(obj.Body)
            if (obj.Body.result === 0) {
              // 收到停止指令
            }
            break
          }
          default: {
            break
          }
        }
      }
    }
  }
}
</script>

<style lang="scss">
.flashLoadMsg {
  color:#2479bc;
  &:hover {
    color:#3a8ee6;
  }
}
.plfloat {
  position: absolute;
  bottom: 5px;
  right: 5px;
}
.videoBtns {
  padding: 8px 15px;
  background: rgba(97,95,95,.4);
  border: none;
}
.videoBtns:hover,.videoBtns:active {
  background: rgba(97,95,95,.4);
}
.el-container-rt-video {
  // height: calc(100vh - 94px);
  // height: calc(100vh - 30px);
  height: calc(100vh - 95px);
  .el-dialog__header {
    background-color: #5F7ABF;
    height: 50px;
    padding-top: 12px;
    span {
      color: #fff;
      font-size: 14px
    }
    i {
      color: #fff;
    }
  }
  .el-aside-left {
    background-color: #ffffff;
    border-right: 1px solid #eaeefb;
  }
  .el-header-controller {
    background-color: #ffffff;
    border-bottom: 1px solid #eaeefb;
    span {
      cursor:pointer;
      margin: 10px 10px 5px 0;
      display: inline-block;
      img {
        width: 18px;
        height: 18px;
      }
    }
  }
  .el-footer {
    padding: 0;
    background-color: #ffffff;
    transition: height 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
    position: relative;
    .toggle-table-btn {
      position: absolute;
      border-radius: 10px 10px 0 0;
      padding: 3px 20px;
      left: 50%;
      margin-top: -20px;
      margin-left: -27px;
    }
  }
  .el-container-videos {
    transition: height 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
  }
  .map {
    width: 100%;
    height: 100%;
  }
  .el-main-players {
    padding: 0;
    overflow: hidden;
    height: calc(100vh - 137px);
    .player {
      position: relative;
      float: left;
      border: 1px solid #eeeeee;
    }
    &.el-main-players-model1 {
      .player:first-child {
        width: 100%;
        height: 100%;
      }
    }
    &.el-main-players-model4 {
      .player {
        width: 50%;
        height: 50%;
      }
    }
    &.el-main-players-model6 {
      .player {
        width: 33.3333%;
        height: 33.3333%;
        &:first-child {
          width: 66.66%;
          height: 66.66%;
        }
      }
    }
    &.el-main-players-model8 {
      .player {
        width: 25%;
        height: 25%;
        &:first-child {
          width: 75%;
          height: 75%;
        }
      }
    }
    &.el-main-players-model9 {
      .player {
        width: 33.3333%;
        height: 33.3333%;
      }
    }
    &.el-main-players-model16 {
      .player {
        width: 25%;
        height: 25%;
      }
    }
  }
}
</style>

<style lang="scss">
// @import '../../../styles/video-js.min.css';
.el-tabs-rt-video-data {
  overflow: hidden;
  height: 100%;
  .el-tabs__nav-scroll {
    padding-left: 20px;
    .el-tabs__item {
      font-weight: normal;
      font-size: 12px;
      height: 35px;
    }
  }
}

.right_menu{
    font-size: 11px;
    position: absolute;
    background: #FFFFFF;
    z-index: 100000;
    /* line-height: 22px; */
    width: 120px;
    border: 1px solid #6B96AB;
    border-radius: 5px;
  }

  .right_menu ul{
    list-style: none;
    margin: 0px;
    padding: 0px;
  }
  .right_menu li{
    line-height: 30px;
    cursor: pointer;
    padding: 0 10px;
  }
  .right_menu li:hover{
    background-color: #C6DEEA
  }
</style>

<style>
  .left_top_veh{
    float:left;
    width:33.33333%;
    height:40px;
    text-align:center;
    cursor:pointer
  }
  .left_top_veh div{
    height:20px;
    line-height:20px;
  }
  .left_top_veh .veh_count{
    width:18px;
    height:18px;
    display:inline-block
  }
  .monitor_all_normal{
    background-image: url('../../../assets/realtime/monitor_all_normal.png');
    background-repeat:no-repeat;
    background-size:100% 100%;
    color: #333333
  }
  .monitor_all_checked{
    background-image: url('../../../assets/realtime/monitor_all_checked.png');
    background-repeat:no-repeat;
    background-size:100% 100%;
    color: #4178bd
  }
  .monitor_online_normal{
    background-image: url('../../../assets/realtime/monitor_online_normal.png');
    background-repeat:no-repeat;
    background-size:100% 100%;
    color: #333333
  }
  .monitor_online_checked{
    background-image: url('../../../assets/realtime/monitor_online_checked.png');
    background-repeat:no-repeat;
    background-size:100% 100%;
    color: #4178bd
  }
  .monitor_offline_normal{
    background-image: url('../../../assets/realtime/monitor_offline_normal.png');
    background-repeat:no-repeat;
    background-size:100% 100%;
    color: #333333
  }
  .monitor_offline_checked{
    background-image: url('../../../assets/realtime/monitor_offline_checked.png');
    background-repeat:no-repeat;
    background-size:100% 100%;
    color: #4178bd
  }
  .font_normal{
    color: #333333
  }
  .font_active{
    color: #4178bd
  }
  .tree_dept_icon{
    width: 14px;
    height: 14px;
    display: inline-block;
    background-image: url('../../../assets/realtime/tree_area.png');
    background-repeat:no-repeat;
    background-size:100% 100%;
    margin-right: 5px
  }
  .tree_line_icon{
    width: 14px;
    height: 14px;
    display: inline-block;
    background-image: url('../../../assets/realtime/tree_platform.png');
    background-repeat:no-repeat;
    background-size:100% 100%;
    margin-right: 5px
  }
  .tree_owers_icon{
    width: 14px;
    height: 14px;
    display: inline-block;
    background-image: url('../../../assets/realtime/tree_owers.png');
    background-repeat:no-repeat;
    background-size:100% 100%;
    margin-right: 5px
  }
  .tree_veh_online_icon{
    width: 14px;
    height: 14px;
    display: inline-block;
    background-image: url('../../../assets/realtime/veh_online.png');
    background-repeat:no-repeat;
    background-size:100% 100%;
    margin-right: 5px
  }
  .tree_veh_offline_icon{
    width: 14px;
    height: 14px;
    display: inline-block;
    background-image: url('../../../assets/realtime/veh_offline.png');
    background-repeat:no-repeat;
    background-size:100% 100%;
    margin-right: 5px
  }
  .tree_veh_huis{
    width: 14px;
    height: 14px;
    display: inline-block;
    background-image: url('../../../assets/realtime/huis.png');
    background-repeat:no-repeat;
    background-size:100% 100%;
    margin-right: 5px
  }
  .el-container-rt-video .el-tree-j {
    position: relative;
    cursor: default;
    background: #fff;
    color: #606266;
    height: calc(100vh - 154px);
    overflow: auto;
  }

  .el-tree>.el-tree-node{
    min-width:100%;
    max-height: calc(100vh - 385px);
    display: inline-block;
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
  .zzloading .zzloading-cannel {
    font-size: 14px;
    border: 1px solid #409eff;
    margin: 20px auto;
    display: block;
    width: 80px;
    text-align: center;
    height: 26px;
    line-height: 24px;
    border-radius: 13px;
    cursor: pointer;
  }
</style>
