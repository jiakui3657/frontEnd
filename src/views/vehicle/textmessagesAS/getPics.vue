<template>
  <div style="margin-top:20px;padding: 0 20px;">
    <p>所选车辆：
      <span>{{ typeof(carInfo) === 'object' ? '' :  carInfo}}</span>
    </p>
    <div class="demo-input-suffix">
      指令参数：
      <el-select v-model="cameraValue" placeholder="请选择摄像头" class="im">
        <el-option
          v-for="item in cameraOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-select v-model="sizeValue" placeholder="请选择照片尺寸" class="im">
        <el-option
          v-for="item in sizeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </div>
    <el-button type="primary" style="margin:15px 0 0 84px;background-color:#5F7ABF;border-color:#5F7ABF" @click="send" :loading="loading">抓拍</el-button>
    <p>回复结果：
      <span>{{wsStatus}}</span>
      <br />
      <img :src="imgUrl">
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
        carInfo: this.vehicleNo || '',
        websocket: '',
        loading: false,
        cameraOptions: [
          {
            value: '1',
            label: '摄像头1'
          },
          {
            value: '2',
            label: '摄像头2'
          },
          {
            value: '3',
            label: '摄像头3'
          },
          {
            value: '4',
            label: '摄像头4'
          }
        ],
        sizeOptions: [
          {
            value: '1',
            label: '320x240'
          },
          {
            value: '2',
            label: '640x480'
          },
          {
            value: '3',
            label: '800x600'
          },
          {
            value: '4',
            label: '1240x768'
          },
          {
            value: '5',
            label: '176x144(QCIF)'
          },
          {
            value: '6',
            label: '704x288(CIF)'
          },
          {
            value: '7',
            label: '704x288(HALF D)'
          }
        ],
        cameraValue: '',
        sizeValue: '',
        wsStatus: '',
        imgUrl: ''
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
          if (JSON.parse(evt.data).Body.photoUrl) {
            vm.loading = false
          }
          vm.wsStatus = JSON.parse(evt.data).Body.photoRspFlag
          vm.imgUrl = JSON.parse(evt.data).Body.photoUrl
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
          if (this.cameraValue.trim() === '' || this.sizeValue.trim() === '') {
            this.$message({
              type: 'error',
              message: '请选择指令参数'
            })
          } else {
            this.loading = true
            const data = {
              Command: '50',
              CommandType: 'Business',
              token: getToken('Admin-Token'),
              Body: {
                data: {
                  vehicleNo: this.carInfo,
                  lensId: this.cameraValue,
                  size: this.sizeValue
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
