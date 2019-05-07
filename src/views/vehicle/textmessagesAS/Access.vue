<template>
  <div style="margin-top:20px;padding: 0 20px;">
    <p>所选车辆：
      <span>{{ typeof(carInfo) === 'object' ? '' :  carInfo}}</span>
    </p>
    <div class="demo-input-suffix">
      指令参数：
      <el-input v-model="authCode" placeholder="请输入鉴权码" style="width:200px;"></el-input>
      <el-input v-model="accName" placeholder="请输入拨号名称" style="width:200px;"></el-input>
      <el-input v-model="username" placeholder="请输入拨号用户名" style="width:200px;"></el-input>
      <el-input v-model="pwd" placeholder="请输入拨号密码" style="width:200px;"></el-input>
    </div>
    <div class="demo-input-suffix" style="margin-left:84px;">
      <el-input v-model="IP" placeholder="请输入IP地址" style="width:200px;"></el-input>
      <el-input v-model="tcpPort" placeholder="请输入TCP端口" style="width:200px;"></el-input>
      <el-input v-model="udpPort" placeholder="请输入UDP端口" style="width:200px;"></el-input>
      <el-date-picker
        v-model="endTime"
        format="yyyy-MM-dd HH:mm:ss"
        value-format="yyyy-MM-dd HH:mm:ss"
        style="width:200px;"
        type="datetime"
        placeholder="选择结束时间">
      </el-date-picker>
    </div>
    <el-button type="primary" @click="send" style="margin-left:84px;background-color:#5F7ABF;border-color:#5F7ABF" :loading="loading">发送</el-button>
    <p>回复结果：
      <span>{{ wsStatus }}</span>
    </p>
  </div>
</template>

<script>
  import event from './eventBus'
  import { getToken } from '@/utils/auth'
  export default {
    props: {
      vehicleNo: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        websocket: '',
        carInfo: this.vehicleNo || '',
        authCode: '',
        accName: '',
        username: '',
        pwd: '',
        IP: '',
        tcpPort: '',
        udpPort: '',
        endTime: '',
        wsStatus: '',
        loading: false
      }
    },
    methods: {
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
        }
        vm.websocket.onerror = function() {
          vm.initWebSocket()
        }
      },
      send() {
        if (!this.carInfo) {
          this.$message({
            type: 'error',
            message: '请选择车辆'
          })
        } else if (!(/^\d{1,20}$/.test(this.authCode))) {
          this.$message({
            type: 'error',
            message: '鉴权码应为1-20位的数字'
          })
        } else if (this.accName.trim().length === 0) {
          this.$message({
            type: 'error',
            message: '拨号名称不应为空'
          })
        } else if (this.username.trim().length === 0) {
          this.$message({
            type: 'error',
            message: '拨号用户名不应为空'
          })
        } else if (this.pwd.trim().length === 0) {
          this.$message({
            type: 'error',
            message: '拨号密码不应为空'
          })
        } else if (!(/^(([1-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5])))\.)(([1-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5])))\.){2}([1-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5])))$/.test(this.IP)) && !(/^((https|http|ftp|rtsp|mms){0,1}(:\/\/){0,1})www\.(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/.test(this.IP))) {
          this.$message({
            type: 'error',
            message: '请正确填写域名或IP'
          })
        } else if (!(/^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{4}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/.test(this.tcpPort))) {
          this.$message({
            type: 'error',
            message: '请正确填写TCP端口号'
          })
        } else if (!(/^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{4}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/.test(this.udpPort))) {
          this.$message({
            type: 'error',
            message: '请正确填写UDP端口号'
          })
        } else if (!this.endTime) {
          this.$message({
            type: 'error',
            message: '结束时间不能为空'
          })
        } else {
          this.loading = true
          const data = {
            Command: '53',
            CommandType: 'Business',
            token: getToken('Admin-Token'),
            Body: {
              data: {
                vehicleNo: this.carInfo,
                authenicationCode: this.authCode,
                accessPointName: this.accName,
                userName: this.username,
                passWord: this.pwd,
                serverIp: this.IP,
                tcpPort: this.tcpPort,
                udpPort: this.udpPort,
                endTime: this.endTime
              }
            }
          }
          console.log('发送websocket请求：' + JSON.stringify(data))
          this.websocket.send(JSON.stringify(data))
        }
      }
    },
    created() {
      this.initWebSocket()
    },
    mounted() {
      event.$on('emitInfo', data => {
        this.carInfo = data
      })
    },
    destroyed() {
      this.websocket.close()
    },
    watch: {
      vehicleNo(val) {
        this.carInfo = val
      }
    }
  }
</script>

<style scoped>
  .demo-input-suffix {
    margin-bottom: 15px;
  }
</style>
