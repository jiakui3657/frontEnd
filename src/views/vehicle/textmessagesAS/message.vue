<template>
  <div style="margin-top:20px;padding: 0 20px;">
    <p>所选车辆：
      <span>{{ typeof(carInfo) === 'object' ? '' :  carInfo}}</span>
    </p>
    <div class="demo-input-suffix">
      指令参数：
      <el-select v-model="prValue" style="margin-bottom:15px;" placeholder="请选择优先级">
        <el-option
        v-for="item in prOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value">
        </el-option>
      </el-select><br>
      <el-input type="textarea" v-model="desc" style="width:300px;margin-left:80px;" placeholder="请输入下发内容"></el-input>
    </div>
    <el-button type="primary" style="margin:15px 0 0 84px;background-color:#5F7ABF;border-color:#5F7ABF" @click="send" :loading="loading">发送</el-button>
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
        desc: '',
        websocket: '',
        carInfo: this.vehicleNo || '',
        prOptions: [
          {
            value: '0',
            label: '紧急'
          },
          {
            value: '1',
            label: '一般'
          }
        ],
        prValue: '',
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
        } else {
          if (this.desc.trim() === '' || this.prValue.trim() === '') {
            this.$message({
              type: 'error',
              message: '请输入指令参数'
            })
          } else {
            this.loading = true
            const data = {
              Command: '51',
              CommandType: 'Business',
              token: getToken('Admin-Token'),
              Body: {
                data: {
                  vehicleNo: this.carInfo,
                  msgPriority: this.prValue,
                  msgContent: this.desc
                }
              }
            }
            console.log('发送websocket请求：' + JSON.stringify(data))
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
        this.wsStatus = ''
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
