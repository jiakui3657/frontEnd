<template>     
<el-dialog title="终端控制" :visible.sync="deviceControl"  style="z-index:9999">
  <el-tabs v-model="devControl_pop">
        <el-tab-pane label="无线升级" name="first">
            <span style="font-size:14px;color:#628FA6;font-weight:bold;">● 无线升级</span>
              <el-form  ref="form_wifi_update" :model="form_wifi_update" label-width="120px" class="selfform" size="mini">
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="URL地址">
                          <el-input v-model="form_wifi_update.URL" style="width:90%;"  size="mini"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">        
                        <el-form-item label="拨号点名称">
                          <el-input v-model="form_wifi_update.dialName"  style="width:90%;"  size="mini"></el-input>
                        </el-form-item>  
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="拨号用户名">
                          <el-input v-model="form_wifi_update.userName"  style="width:90%;"  size="mini"></el-input>
                        </el-form-item> 
                    </el-col>
                    <el-col :span="10">    
                        <el-form-item label="拨号密码">
                          <el-input v-model="form_wifi_update.password"  style="width:90%;"  size="mini"></el-input>
                        </el-form-item> 
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="10"> 
                      <el-form-item label="地址 ">
                        <el-input v-model="form_wifi_update.address"  style="width:90%;"  size="mini"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="14">                              
                      <el-form-item label="TCP端口">
                        <el-input v-model="form_wifi_update.tcpPort"  style="width:55%;"  size="mini"></el-input>
                        <span class="trick">(0~65535)</span>
                      </el-form-item>  
                  </el-col>
                </el-row>
                <el-row>
                   <el-col :span="10">  
                      <el-form-item label="制造商ID">
                      <el-input v-model="form_wifi_update.manufacturer"  style="width:90%;"  size="mini"></el-input>                         
                      </el-form-item>  
                  </el-col>
                  <el-col :span="14">  
                      <el-form-item label="UDP端口">
                      <el-input v-model="form_wifi_update.udpPort"  style="width:55%;"  size="mini"></el-input>
                      <span class="trick">(0~65535)</span>
                      </el-form-item>  
                  </el-col>                   
                </el-row> 
                <el-row>
                  <el-col :span="10">  
                      <el-form-item label="硬件版本">
                      <el-input v-model="form_wifi_update.hardWare"  style="width:90%;"  size="mini"></el-input>                           
                      </el-form-item>  
                  </el-col>
                    <el-col :span="10">  
                      <el-form-item label="时限">
                      <el-input v-model="form_wifi_update.timeLength"  style="width:90%;"  size="mini"></el-input>                       
                      </el-form-item>  
                  </el-col>
                </el-row>       
                <el-row>
                  <el-col :span="10">  
                      <el-form-item label="固件版本">
                      <el-input v-model="form_wifi_update.firmWare"  style="width:90%;"  size="mini"></el-input>                           
                      </el-form-item>  
                  </el-col>
                </el-row>                     
              </el-form> 
              <el-row style="text-align:center;margin:10px 0;">
                <el-button @click="refreshWifiUpdate()" class="dedBtn">刷新</el-button>
                <el-button @click="subFormWifiUpdate()" class="saveBtn">保存</el-button>
                <el-button @click="outerVisible = false" class="dedBtn">保存到其他车辆</el-button>
                <el-button @click="outerVisible = false" class="dedBtn">关闭</el-button>
              </el-row>          
              <el-table :data="tableData" style="width: 100%" :header-cell-style="{'background': '#628FA6', 'color': '#fff','border': 'none !important'}">
                <el-table-column prop="date" label="车牌号" width="180"  align="center">
                </el-table-column>
                <el-table-column prop="name" label="时间" width="180" align="center">
                </el-table-column>
                <el-table-column prop="address" label="状态" width="180" align="center">
                </el-table-column>
                <el-table-column prop="address" label="类型" width="180" align="center">
                </el-table-column>
              </el-table>            
        </el-tab-pane>
        <el-tab-pane label="控制终端连接到服务器" name="second">
            <el-form ref="form_devConnServer" :model="form_devConnServer" label-width="135px" class="selfform" size="mini">
              <span style="font-size:14px;color:#628FA6;font-weight:bold;">● 连续控制</span>
                <el-row>
                    <el-form-item class="selfChoosen_veh">
                      <el-radio-group v-model="form_devConnServer.connectCol">
                        <el-radio label="0">切换到指定监控平台服务器</el-radio>
                        <el-radio label="1">切换回原缺省监控平台服务器</el-radio>                             
                      </el-radio-group>
                    </el-form-item>  
                </el-row>
                <span style="font-size:14px;color:#628FA6;font-weight:bold;">● 信息</span>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="鉴权码">
                          <el-input v-model="form_devConnServer.authentication" style="width:65%;"  size="mini"></el-input>
                        </el-form-item>  
                    </el-col>
                    <el-col :span="12"> 
                        <el-form-item label="拨号点名称">
                          <el-input v-model="form_devConnServer.dialName" style="width:65%;"  size="mini"></el-input>
                        </el-form-item>  
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="拨号用户名">
                        <el-input v-model="form_devConnServer.userName" style="width:65%;"  size="mini"></el-input>
                        </el-form-item>    
                    </el-col>
                    <el-col :span="12">                          
                        <el-form-item label="拨号密码">
                        <el-input v-model="form_devConnServer.password" style="width:65%;"  size="mini"></el-input>
                        </el-form-item>  
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="地址">
                        <el-input v-model="form_devConnServer.address" style="width:65%;"  size="mini"></el-input>
                        </el-form-item>  
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="TCP端口">
                        <el-input v-model="form_devConnServer.tcpPort" style="width:65%;"  size="mini"></el-input>
                        <span class="trick">(0~65535)</span>
                        </el-form-item>  
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="UDP端口">
                        <el-input v-model="form_devConnServer.udpPort" style="width:65%;"  size="mini"></el-input>
                        <span class="trick">(0~65535)</span>
                        </el-form-item>   
                    </el-col>
                      <el-col :span="12">
                        <el-form-item label="时限">
                        <el-input v-model="form_devConnServer.timeLength" style="width:65%;"  size="mini"></el-input>
                        <span class="trick">(0~999999)</span>
                        </el-form-item>   
                    </el-col>                              
                </el-row>                              
            </el-form>  
            <el-row style="text-align:center;margin:10px 0;">
              <el-button @click="refreshDevConnServer()" class="dedBtn">刷新</el-button>
              <el-button @click="subFormDevConnServer()" class="saveBtn">保存</el-button>
              <el-button @click="outerVisible = false" class="dedBtn">保存到其他车辆</el-button>
              <el-button @click="outerVisible = false" class="dedBtn">关闭</el-button>
            </el-row>
            <el-table :data="tableData" style="width: 100%" :header-cell-style="{'background': '#628FA6', 'color': '#fff','border': 'none !important'}">
                <el-table-column prop="date" label="车牌号" width="180"  align="center">
                </el-table-column>
                <el-table-column prop="name" label="时间" width="180" align="center">
                </el-table-column>
                <el-table-column prop="address" label="状态" width="180" align="center">
                </el-table-column>
                <el-table-column prop="address" label="类型" width="180" align="center">
                </el-table-column>
            </el-table> 
        </el-tab-pane>
        <el-tab-pane label="其他控制" name="third">
            <el-form ref="form_otherControl" :model="form_otherControl" label-width="220px" class="selfform" size="mini">  
              <span style="font-size:14px;color:#628FA6;font-weight:bold;">● 连续控制</span>
                <el-row>
                    <el-form-item class="selfChoosen_veh">
                      <el-radio-group v-model="form_otherControl.commandId">
                        <el-radio label="3">终端关机</el-radio>
                        <el-radio label="4">终端复位</el-radio> 
                        <el-radio label="5">终端恢复出厂设置</el-radio> 
                      </el-radio-group>
                      <el-radio-group v-model="form_otherControl.commandId">
                        <el-radio label="6">关闭数据通信</el-radio>
                        <el-radio label="7">关闭所有无线通讯</el-radio>
                      </el-radio-group>
                    </el-form-item>  
                </el-row>
            </el-form>  
            <el-row style="text-align:center;margin:10px 0;">
              <el-button @click="refreshOtherControl()" class="dedBtn">刷新</el-button>
              <el-button @click="subFormOtherControl()" class="saveBtn">保存</el-button>
              <el-button @click="outerVisible = false" class="dedBtn">保存到其他车辆</el-button>
              <el-button @click="outerVisible = false" class="dedBtn">关闭</el-button>
            </el-row>
            <el-table :data="tableData" style="width: 100%" :header-cell-style="{'background': '#628FA6', 'color': '#fff','border': 'none !important'}">
                  <el-table-column prop="date" label="车牌号" width="180"  align="center">
                  </el-table-column>
                  <el-table-column prop="name" label="时间" width="180" align="center">
                  </el-table-column>
                  <el-table-column prop="address" label="状态" width="180" align="center">
                  </el-table-column>
                  <el-table-column prop="address" label="类型" width="180" align="center">
                  </el-table-column>
            </el-table> 
        </el-tab-pane>                  
  </el-tabs> 
</el-dialog>     
</template>
<script>
import { getToken } from '@/utils/auth'
export default {
  name: 'devControlDialog',
  data() {
    return {
      deviceControl: false,
      tableData: [],
      websocket: null,
      vehicleId: '4',
      devControl_pop: 'first',
      form_wifi_update: {
        URL: '',
        dialName: '',
        userName: '',
        password: '',
        address: '',
        tcpPort: '',
        udpPort: '',
        manufacturer: '',
        hardWare: '',
        firmWare: '',
        timeLength: ''
      },
      form_devConnServer: {
        connectCol: '',
        authentication: '',
        dialName: '',
        userName: '',
        password: '',
        address: '',
        tcpPort: '',
        udpPort: '',
        timeLength: ''
      },
      form_otherControl: {
        commandId: ''
      }
    }
  },
  created() {
    // this.initWebSocket()
  },
  destroyed() {
    if (this.websocket) this.websocket.close()
  },
  methods: {
    initWebSocket() {
      const vm = this
      vm.websocket = new WebSocket(process.env.WEBSOCKET_API)
      vm.websocket.onopen = function() {
        console.log('终端控制websocket连接成功...')
      }
      vm.websocket.onmessage = function(evt) {
        console.log('数据已接收...')
        console.log(JSON.parse(evt.data))
        const obj = JSON.parse(evt.data)
        switch (obj.Command) {
          case '8105':
            switch (obj.Body.code) {
              case 0:
                vm.open('返回失败')
                break
              case 1:
                vm.open('操作成功')
                break
              case 10:
                vm.open('返回失败；接口认证错误')
                break
              case 11:
                vm.open('返回失败；设备不存在或不允许操作')
                break
              case 12:
                vm.open('返回失败；设备类型或ID无效')
                break
              case 20:
                vm.open('返回失败；请求消息无法解析')
                break
              case 21:
                vm.open('返回失败；请求消息参数错误')
                break
              default:
                break
            }
            break
          default:
            break
        }
      }
      vm.websocket.onerror = function() {
        vm.initWebSocket()
      }
    },
    subFormWifiUpdate() { // 发送websocket  无线消息
      const data = {
        Command: '8105',
        CommandType: 'command',
        Token: getToken(),
        Body: {
          data: {
            vehicleId: this.vehicleId,
            commandId: '1',
            URL: this.form_wifi_update.URL,
            dialName: this.form_wifi_update.dialName,
            userName: this.form_wifi_update.userName,
            password: this.form_wifi_update.password,
            address: this.form_wifi_update.address,
            tcpPort: this.form_wifi_update.tcpPort,
            udpPort: this.form_wifi_update.udpPort,
            manufacturer: this.form_wifi_update.manufacturer,
            hardWare: this.form_wifi_update.hardWare,
            firmWare: this.form_wifi_update.firmWare,
            timeLength: this.form_wifi_update.timeLength
          }
        }
      }
      if (this.websocket.readyState === 1) {
        console.log('WifiUpdate请求参数：', data)
        this.websocket.send(JSON.stringify(data))
      } else {
        console.log('WifiUpdate信息发送失败')
      }
    },
    open(ent) {
      this.$message(ent)
    },
    subFormDevConnServer() { // 发送websocket 控制终端连接到服务器 消息，
      const data = {
        Command: '8105',
        CommandType: 'command',
        Token: getToken(),
        Body: {
          data: {
            vehicleId: this.vehicleId,
            commandId: '2',
            connectCol: this.form_devConnServer.connectCol,
            authentication: this.form_devConnServer.authentication,
            dialName: this.form_devConnServer.dialName,
            userName: this.form_devConnServer.userName,
            password: this.form_devConnServer.password,
            address: this.form_devConnServer.address,
            tcpPort: this.form_devConnServer.tcpPort,
            udpPort: this.form_devConnServer.udpPort,
            timeLength: this.form_devConnServer.timeLength
          }
        }
      }
      if (this.websocket.readyState === 1) {
        console.log('DevConnServer请求参数：', data)
        this.websocket.send(JSON.stringify(data))
      } else {
        console.log('DevConnServer信息发送失败')
      }
    },
    subFormOtherControl() { // 发送websocket 控制终端连接到服务器 消息，
      const data = {
        Command: '8105',
        CommandType: 'command',
        Token: getToken(),
        Body: {
          data: {
            vehicleId: this.vehicleId,
            commandId: this.form_otherControl.commandId
          }
        }
      }
      if (this.websocket.readyState === 1) {
        console.log('WifiUpdate请求参数：', data)
        this.websocket.send(JSON.stringify(data))
      } else {
        console.log('WifiUpdate信息发送失败')
      }
    },
    refreshWifiUpdate() {
      this.form_wifi_update.URL = ''
      this.form_wifi_update.dialName = ''
      this.form_wifi_update.userName = ''
      this.form_wifi_update.password = ''
      this.form_wifi_update.address = ''
      this.form_wifi_update.tcpPort = ''
      this.form_wifi_update.udpPort = ''
      this.form_wifi_update.manufacturer = ''
      this.form_wifi_update.hardWare = ''
      this.form_wifi_update.firmWare = ''
      this.form_wifi_update.timeLength = ''
    },
    refreshDevConnServer() {
      this.form_devConnServer.connectCol = ''
      this.form_devConnServer.authentication = ''
      this.form_devConnServer.dialName = ''
      this.form_devConnServer.userName = ''
      this.form_devConnServer.password = ''
      this.form_devConnServer.address = ''
      this.form_devConnServer.tcpPort = ''
      this.form_devConnServer.udpPort = ''
      this.form_devConnServer.timeLength
    },
    refreshOtherControl() {
      this.form_otherControl.commandId = ''
    }
  }
}
</script>
<style scoped>

</style>
