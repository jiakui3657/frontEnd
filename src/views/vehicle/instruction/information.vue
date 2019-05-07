<template>
  <div style="margin-top:20px;padding: 0 20px;">
    <p>所选车辆：
      <span>{{ carInfo.vehicleNo }}</span>
    </p>
    <div class="block">
      <span class="demonstration">选择通道：</span>
      <el-cascader
        expand-trigger="hover"
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
      <span class="demonstration">码流类型：</span>
      <el-select v-model="streamValue" placeholder="请选择码流类型">
        <el-option
          v-for="item in streamOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </div>
    <div class="block" style="margin-top:10px;">
      <span class="demonstration">存储器类型：</span>
      <el-select v-model="memValue" placeholder="请选择码流类型">
        <el-option
          v-for="item in memOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <span class="demonstration">起止时间：</span>
      <el-date-picker
        v-model="dateValue"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>
    </div>
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
        loading: false,
        selectedType: '',
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
        streamOptions: [{
          value: 0,
          label: '所有码流'
        }, {
          value: 1,
          label: '主码流'
        }, {
          value: 2,
          label: '子码流'
        }],
        memOptions: [{
          value: 0,
          label: '所有存储器'
        }, {
          value: 1,
          label: '主存储器'
        }, {
          value: 2,
          label: '灾备存储器'
        }],
        typeValue: '',
        streamValue: '',
        memValue: '',
        dateValue: ''
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
            Command: '49',
            CommandType: 'Business',
            token: getToken('Admin-Token'),
            Body: {
              data: {
                vehicleNo: this.carInfo.vehicleNo,
                monitorTel: this.input
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
