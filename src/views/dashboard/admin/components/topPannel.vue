<template>
  <el-row class="panel-group" :gutter="40">
    <el-col :xs="3" :sm="3" :lg="3" class="card-panel-col">
      <div class="card-panel" @click="carrierClick()">
        <img class="card-panel-img" src="../../../../assets/navicon/i1.png" style="width:2.6rem">
        <div class="card-panel-description">
          <count-to class="card-panel-num" :startVal="0" :endVal="a" :duration="2600"></count-to>
          <div class="card-panel-text">运营商平台</div>
        </div>
      </div>
    </el-col>
    <el-col :xs="3" :sm="3" :lg="3" class="card-panel-col">
      <div class="card-panel" @click="companyClick()">
        <img class="card-panel-img" src="../../../../assets/navicon/i2.png" style="width:2.6rem">
        <div class="card-panel-description">
          <count-to class="card-panel-num" :startVal="0" :endVal="b" :duration="3000"></count-to>
          <div class="card-panel-text">运营企业</div>
        </div>
      </div>
    </el-col>
     <el-col :xs="3" :sm="3" :lg="3" class="card-panel-col">
      <div class="card-panel" @click="vehicleClick()">
        <img class="card-panel-img" src="../../../../assets/navicon/i4.png" style="width:2.6rem">
        <div class="card-panel-description">
          <count-to class="card-panel-num" :startVal="0" :endVal="h" :duration="3600"></count-to>
          <div class="card-panel-text">营运车辆</div>
        </div>
      </div>
    </el-col>
    <el-col :xs="3" :sm="3" :lg="3" class="card-panel-col">
      <div class="card-panel" @click="vehicleClick()">
        <img class="card-panel-img" src="../../../../assets/navicon/i3.png" style="width:2.6rem">
        <div class="card-panel-description">
          <count-to class="card-panel-num" :startVal="0" :endVal="c" :duration="3200"></count-to>
          <div class="card-panel-text">入网车辆</div>
        </div>
      </div>
    </el-col>
    <el-col :xs="3" :sm="3" :lg="3" class="card-panel-col">
      <div class="card-panel" @click="onlineClick()">
        <img class="card-panel-img" src="../../../../assets/navicon/i8.png" style="width:2.6rem">
        <div class="card-panel-description">
          <count-to class="card-panel-num" :startVal="0" :endVal="d" :duration="3600"></count-to>
          <div class="card-panel-text">在线车辆</div>
        </div>
      </div>
    </el-col>
    <!-- <el-col :xs="4" :sm="4" :lg="4" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-description">
          <img class="card-panel-img" src="../../../../assets/navicon/i5.png" width="50">
          <count-to class="card-panel-num" :startVal="0" :endVal="e" :duration="3600"></count-to>
          <div class="card-panel-text">从业人员</div>
        </div>
      </div>
    </el-col> -->
    <el-col :xs="3" :sm="3" :lg="3" class="card-panel-col">
      <div class="card-panel" @click="superviseClick()">
        <img class="card-panel-img" src="../../../../assets/navicon/i6.png" style="width:2.6rem">
        <div class="card-panel-description">
          <count-to class="card-panel-num" :startVal="0" :endVal="f" :duration="3600"></count-to>
          <div class="card-panel-text">今日主动安全报警</div>
        </div>
      </div>
    </el-col>
    <el-col :xs="3" :sm="3" :lg="3" class="card-panel-col">
      <div class="card-panel" @click="InstallSummaryClick()">
        <img class="card-panel-img" src="../../../../assets/navicon/i7.png" style="width:2.6rem">
        <div class="card-panel-description" style="border-right:none;">
          <count-to class="card-panel-num" :startVal="0" :endVal="k" :duration="3600"></count-to>
          <div class="card-panel-text">已安装车辆</div>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from '@/components/CountTo'
import { tabNum } from '@/api/dashboard/dashboard'
import { getToken } from '@/utils/auth'

export default {
  components: {
    CountTo
  },
  data() {
    return {
      a: null,
      b: null,
      c: null,
      d: null,
      // e: null,
      f: null,
      k: null,
      g: null,
      h: null
    }
  },
  methods: {
    getTabNum() {
      tabNum().then(res => {
        // console.log(res.data)
        if (res.code === 0) {
          res.data.forEach(item => {
            // console.log('车辆信息：' + console.log(JSON.stringify(item)))
            this.a = item.terraceNum
            this.b = item.enterpriseNum
            this.c = item.networkNum
            // this.d = item.onlineNum
            // this.e = item.practitionersNum
            this.f = item.alarmNum
            this.g = item.admin
            this.h = item.vehicleNum
            this.k = item.installNum
          })
        }
      })
    },
    carrierClick() { // 跳转至运营商平台管理
      this.$router.push({ path: '/base/platform' })
    },
    companyClick() { // 跳转至企业/业户档案管理
      this.$router.push({ path: '/base/company' })
    },
    vehicleClick() { // 跳转至车辆档案管理
      this.$router.push({ path: '/base/vehicleInfo' })
    },
    onlineClick() { // 跳转至车辆档案管理
      this.$router.push({
        name: 'vehicleInfo',
        params: {
          activeStatus: '1'
        }
      })
    },
    superviseClick() { // 跳转至报警中心
      this.$router.push({ path: '/alarm/supervise' })
    },
    InstallSummaryClick() { // 跳转至安装率统计
      this.$router.push({ path: '/statisticalAnalysis/InstallSummary' })
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
      if (this.websocket.readyState === 1) {
        console.log('请求参数：', JSON.stringify(data))
        this.websocket.send(JSON.stringify(data))
      } else {
        console.log('websocket信息发送失败')
      }
    },
    initWebSocket() { // 初始化websocket
      const vm = this
      vm.websocket = new WebSocket(process.env.WEBSOCKET_API)
      // vm.websocket = new WebSocket('ws://192.168.5.137:6947')
      vm.websocket.onopen = function() {
        console.log('websocket连接成功：' + process.env.WEBSOCKET_API)
        vm.subscribeTop(24, 'organTreeInfo:0--1:0-0:')
      }
      vm.websocket.onmessage = function(evt) {
        const obj = JSON.parse(evt.data)
        // console.log('['+new Date().getHours()+':'+new Date().getMinutes()+':'+new Date().getSeconds()+'] receive command('+obj.Command+') message:' + JSON.stringify(obj))
        switch (obj.Command) {
          case '33': // 企业车辆总数,在线数,离线数统计
            vm.d = obj.Body.onlineVehicle
            break
          default:
            break
        }
      }
      vm.websocket.onerror = function() {
        vm.initWebSocket()
      }
    }
  },
  created() {
    this.getTabNum()
    this.initWebSocket()
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.panel-group {
  margin: 18px 0 0 0 !important;
  .card-panel-col{
    width: 14.25%;
    padding-left: 10px!important;
    padding-right: 10px!important;
    margin-bottom: 32px;
    background: #fff;
  }
  .card-panel {
    height: 96px;
    cursor: pointer;
    font-size: 12px;
    /*position: relative;*/
    overflow: hidden;
    color: #666;
    background: #fff;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    .card-panel-img {
      /*position: absolute;*/
      /*left: 0;*/
      /*top: 30px;*/
    }
    .card-panel-description {
      font-weight: 500;
      border-right: 1px solid #ccc;
      height:50px;
      margin: 24px 0;
      text-align: center;
      width: 80%;
      .card-panel-text {
        line-height: 18px;
        color: #303030;
        font-size: 14px;
        /*margin: 12px 0;*/
      }
      .card-panel-num {
        vertical-align: top;
        font-size: 26px;
        color: #303030;
      }
    }
  }
}
</style>
