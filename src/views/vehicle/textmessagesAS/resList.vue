<template>
  <div style="margin-top:20px;padding: 0 20px;">
    <p>所选车辆：
      <span>{{ typeof(carInfo) === 'object' ? '' :  carInfo}}</span>
    </p>
    <div class="demo-input-suffix">
      指令参数：
      <el-input
        placeholder="请输入电话号码"
        style="width:200px;"
        v-model="input">
      </el-input>
    </div>
    <el-button type="primary" style="margin:15px 0 0 84px;background-color:#5F7ABF;border-color:#5F7ABF" @click="send" :loading="loading">发送</el-button>
    <p>回复结果：
      <span>{{ wsStatus }}</span>
    </p>
  </div>
</template>

<script>
  import WebsocketHeartbeatJs from 'websocket-heartbeat-js'
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
        input: '',
        websocket: '',
        carInfo: this.vehicleNo || '',
        wsStatus: '',
        loading: false
      }
    },
    methods: {
      // initWebSocket() {
      //   const vm = this
      //   vm.websocket = new WebSocket(process.env.WEBSOCKET_API)
      //   vm.websocket.onopen = function() {
      //     console.log('数据发送中...')
      //   }
      //   vm.websocket.onmessage = function(evt) {
      //     console.log('数据已接收...')
      //     console.log(JSON.parse(evt.data))
      //     vm.loading = false
      //     vm.wsStatus = JSON.parse(evt.data).Body.status
      //   }
      //   vm.websocket.onerror = function() {
      //     vm.initWebSocket()
      //   }
      // },
      initWebSocket() {
        const vm = this
        this.websocket = new WebsocketHeartbeatJs({
          url: process.env.WEBSOCKET_API
        })
        this.websocket.onopen = () => {
          console.log('open success')
        }
        this.websocket.onmessage = (e) => {
          console.log('msg:', e.data)
          vm.loading = false
          vm.wsStatus = JSON.parse(e.data).Body.status
        }
        this.websocket.onreconnect = (e) => {
          console.log('reconnecting...')
        }
        this.websocket.onerror = () => {
          console.log('connect onerror')
        }
        this.websocket.onclose = () => {
          console.log('close...')
        }
      },
      send() {
        if (!this.carInfo) {
          this.$message({
            type: 'error',
            message: '请选择车辆'
          })
        } else {
          if (this.input && /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/.test(this.input)) {
            this.loading = true
            const data = {
              Command: '49',
              CommandType: 'Business',
              token: getToken('Admin-Token'),
              Body: {
                data: {
                  vehicleNo: this.carInfo,
                  monitorTel: this.input
                }
              }
            }
            console.log('发送websocket请求：' + JSON.stringify(data))
            this.websocket.send(JSON.stringify(data))
          } else {
            this.$message({
              type: 'error',
              message: '请正确的输入手机号码'
            })
          }
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

<style>
</style>
