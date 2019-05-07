<template>
  <div style="margin-top:20px;padding: 0 20px;">
    <p>所选车辆：
      <span>{{ carInfo.vehicleNo }}</span>
    </p>
    <div class="demo-input-suffix">
      指令参数：
      <el-button type="primary" @click="send" :loading="loading" style="background-color:#5F7ABF;border-color:#5F7ABF">发送</el-button>
    </div>
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
        wsStatus: '',
        carInfo: {},
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
          if (this.startTime.trim() === '' || this.endTime.trim() === '') {
            this.$message({
              type: 'error',
              message: '请输入指令参数'
            })
          } else {
            this.loading = true
            const data = {
              Command: '52',
              CommandType: 'Business',
              token: getToken('Admin-Token'),
              Body: {
                data: {
                  vehicleNo: this.carInfo.vehicleNo
                  // startTime: this.startTime,
                  // endTime: this.endTime
                }
              }
            }
            this.websocket.send(JSON.stringify(data))
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
    }
  }
</script>

<style scoped>
  th,td {
    height:40px;
    line-height: 40px;
    text-align: center;
  }
  th {
    width: 100px;
  }
  td {
    background: #eaeaea;
    width: 200px;
  }
</style>
