<template>
  <div style="margin-top:20px;padding: 0 20px;">
    <p>所选车辆：
      <span>{{ carInfo.vehicleNo }}</span>
    </p>
    <el-button type="primary" style="margin:5px 0 0 0;" @click="send" :loading="loading">发送</el-button>
    <p>回复结果：
      <span>{{ wsStatus }}</span>
    </p>
  </div>
</template>

<script>
  import event from './eventBus'
  import { getToken } from '@/utils/auth'
  export default {
    data() {
      return {
        input: '',
        websocket: '',
        carInfo: {},
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
                vehicleNo: this.carInfo.vehicleNo
              }
            }
          }
          console.log(data)
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
    }
  }
</script>

<style>
</style>
