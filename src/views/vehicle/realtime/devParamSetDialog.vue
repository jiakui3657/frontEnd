<template>
    <el-dialog class="setBox" title="部标参数配置" :visible.sync="outerVisible"  style="z-index:9999">
      <el-tabs v-model="command_pop">
        <el-tab-pane label="车辆设置" name="first">
              <span style="font-size:14px;color:#628FA6;font-weight:bold;">● 驾驶时长设置</span>
                <el-form  ref="form_vehicle" :model="form_vehicle" label-width="135px" class="selfform" size="mini">
                  <el-row>
                      <el-col :span="12">
                          <el-form-item label="车辆里程读数">
                            <el-input v-model="form_vehicle.mileage" style="width:65%;"  size="mini"></el-input>
                            <span class="trick">(km/千米)</span>
                          </el-form-item>
                      </el-col>
                      <el-col :span="12">        
                          <el-form-item label="最高速度">
                            <el-input v-model="form_vehicle.maxSpeed"  style="width:65%;"  size="mini"></el-input>
                            <span class="trick">(km/h)</span>
                          </el-form-item>  
                      </el-col>
                  </el-row>
                  <el-row>
                      <el-col :span="12">
                          <el-form-item label="超速持续时间">
                            <el-input v-model="form_vehicle.keepTime"  style="width:65%;"  size="mini"></el-input>
                            <span class="trick">(S/秒)</span>
                          </el-form-item> 
                      </el-col>
                      <el-col :span="12">    
                          <el-form-item label="连续驾驶时间门限">
                            <el-input v-model="form_vehicle.ContinuDriverTime"  style="width:65%;"  size="mini"></el-input>
                              <span class="trick">(S/秒)</span>
                          </el-form-item> 
                      </el-col>
                  </el-row>
                    <el-row>
                      <el-col :span="12"> 
                        <el-form-item label="当天累计驾驶时间门限 ">
                          <el-input v-model="form_vehicle.totalDriverTime"  style="width:65%;"  size="mini"></el-input>
                            <span class="trick">(S/秒)</span>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">                              
                        <el-form-item label="最小休息时间">
                          <el-input v-model="form_vehicle.minRestTime"  style="width:65%;"  size="mini"></el-input>
                          <span class="trick">(S/秒)</span>
                        </el-form-item>  
                    </el-col>
                    </el-row>
                  <el-row>
                      <el-col :span="12">  
                  <el-form-item label="最长停车时间">
                    <el-input v-model="form_vehicle.maxStopCarTime"  style="width:65%;"  size="mini"></el-input>
                    <span class="trick">(S/秒)</span>
                  </el-form-item>  
                  </el-col>
                  </el-row> 

                  <span style="font-size:14px;color:#628FA6;font-weight:bold;">● 位置汇报策略</span>
                  <el-form-item class="selfChoosen_veh">
                    <el-radio-group v-model="form_vehicle.plan">
                      <el-radio label="定时汇报"></el-radio>
                      <el-radio label="定距汇报"></el-radio>
                      <el-radio label="定时定距汇报"></el-radio>
                    </el-radio-group>
                  </el-form-item>   
                  <span style="font-size:14px;color:#628FA6;font-weight:bold;">● 位置汇报方案</span>
                  <el-form-item class="selfChoosen_veh">
                    <el-radio-group v-model="form_vehicle.meth">
                      <el-radio label="根据ACC状态"></el-radio>
                      <el-radio label="根据登录状态和ACC状态"></el-radio>
                      <el-radio label="先判断登录状态，若登录再根据ACC装态"></el-radio>
                    </el-radio-group>
                  </el-form-item>             
                </el-form> 
          
              <el-row style="text-align:center;margin:10px 0;">
                <el-button @click="outerVisible = true" class="dedBtn">刷新</el-button>
                <el-button @click="saveFormVehicle()" class="saveBtn">保存</el-button>
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
        <el-tab-pane label="设备设置" name="second">
            <el-form ref="form_device" :model="form_device" label-width="135px" class="selfform" size="mini">
              <span style="font-size:14px;color:#628FA6;font-weight:bold;">● 参数设置</span>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="省域ID">
                          <el-input v-model="form_device.provinceID" style="width:65%;"  size="mini"></el-input>
                        </el-form-item> 
                    </el-col>
                    <el-col :span="12">       
                        <el-form-item label="市域ID">
                          <el-input v-model="form_device.cityID" style="width:65%;"  size="mini"></el-input>
                        </el-form-item>  
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="车牌号">
                          <el-input v-model="form_device.plateNo" style="width:65%;"  size="mini"></el-input>
                        </el-form-item>  
                    </el-col>
                    <el-col :span="12"> 
                        <el-form-item label="车牌颜色">
                          <el-input v-model="form_device.plateColor" style="width:65%;"  size="mini"></el-input>
                        </el-form-item>  
                    </el-col>
                </el-row>

                <span style="font-size:14px;color:#628FA6;font-weight:bold;">● 终端链路参数设置</span>

                <el-row>
                    <el-col :span="12">
                        <el-form-item label="终端心跳发送间隔">
                        <el-input v-model="form_device.heartBeatInterval" style="width:65%;"  size="mini"></el-input>
                          <span class="trick">(0~999999)</span>
                        </el-form-item>    
                    </el-col>
                    <el-col :span="12">                          
                        <el-form-item label="TCP消息应答超时时间">
                        <el-input v-model="form_device.tcpAnswerTimeOut" style="width:65%;"  size="mini"></el-input>
                        <span class="trick">(0~999999)</span>
                        </el-form-item>  
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="TCP消息重传次数">
                        <el-input v-model="form_device.tcpMagRetries" style="width:65%;"  size="mini"></el-input>
                        <span class="trick">(0~999999)</span>
                        </el-form-item>  
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="UDP消息应答超时时间">
                        <el-input v-model="form_device.udpAnswerTimeOut" style="width:65%;"  size="mini"></el-input>
                        <span class="trick">(0~999999)</span>
                        </el-form-item>  
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="UDP消息重传次数">
                        <el-input v-model="form_device.udpMagRetries" style="width:65%;"  size="mini"></el-input>
                        <span class="trick">(0~999999)</span>
                        </el-form-item>   
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="SMS消息应答超时时间">
                        <el-input v-model="form_device.smsAnswerTimeOut" style="width:65%;"  size="mini"></el-input>
                        <span class="trick">(0~999999)</span>
                        </el-form-item>   
                      </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                  <el-form-item label="SMS消息重传次数">
                  <el-input v-model="form_device.smsMagRetries" style="width:65%;"  size="mini"></el-input>
                  <span class="trick">(0~999999)</span>
                  </el-form-item>    
                      </el-col>
                </el-row>                     
            </el-form>  

                <el-row style="text-align:center;margin:10px 0;">
                  <el-button @click="outerVisible = true" class="dedBtn">刷新</el-button>
                  <el-button @click="saveFormDevice()" class="saveBtn">保存</el-button>
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
        <el-tab-pane label="网络设置" name="third">
            <el-form ref="form_network" :model="form_network" label-width="220px" class="selfform" size="mini">
                  <el-row style="padding: 0 15%;">
                    <el-form-item label="主服务器APN，无线通信拨号访问点">
                      <el-input v-model="form_network.firstAPNAddr" style="width:85%;"></el-input>
                    </el-form-item>   
                  </el-row>
                  <el-row style="padding: 0 15%;">
                    <el-form-item label="主服务器无线通信拨号用户名">
                    <el-input v-model="form_network.firstCallPointUserName" style="width:85%;"></el-input>
                    </el-form-item>
                  </el-row>
                  <el-row style="padding: 0 15%;">
                    <el-form-item label="主服务器无线通信拨号密码">
                      <el-input v-model="form_network.firstCallPointPwd" style="width:85%;"></el-input>
                    </el-form-item>
                  </el-row>
                  <el-row style="padding: 0 15%;">
                    <el-form-item label="主服务器地址,IP或域名">
                      <el-input v-model="form_network.firstIPAddr" style="width:85%;"></el-input>
                    </el-form-item>
                  </el-row>
                  <el-row style="padding: 0 15%;">
                    <el-form-item label="备份服务器APN，无线通信拨号访问点">
                      <el-input v-model="form_network.secondAPNAddr" style="width:85%;"></el-input>
                    </el-form-item>
                  </el-row>
                  <el-row style="padding: 0 15%;">
                    <el-form-item label="备份服务器无线通信拨号用户名">
                      <el-input v-model="form_network.secondCallPointUserName" style="width:85%;"></el-input>
                    </el-form-item>
                  </el-row>
                  <el-row style="padding: 0 15%;">
                    <el-form-item label="备份服务器无线通信拨号密码">
                      <el-input v-model="form_network.secondCallPointPwd" style="width:85%;"></el-input>
                    </el-form-item>
                  </el-row>
                  <el-row style="padding: 0 15%;">
                    <el-form-item label="备份服务器地址,IP或域名">
                      <el-input v-model="form_network.secondIPAddr" style="width:85%;"></el-input>
                    </el-form-item>
                  </el-row>                          
                </el-form>  

              <el-row style="text-align:center;margin:10px 0;">
                <el-button @click="outerVisible = true" class="dedBtn">刷新</el-button>
                <el-button @click="saveFormNetwork()" class="saveBtn">保存</el-button>
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
        <el-tab-pane label="IC卡设置" name="fourth">
            <el-form ref="form_IC" :model="form_IC" label-width="220px" class="selfform" size="mini">
                  <el-row style="padding: 0 15%;">
                    <el-form-item label="道路运输证IC卡认证主服务器IP">
                      <el-input v-model="form_IC.firstServerIPAddr" style="width:85%;"></el-input>
                    </el-form-item>  
                  </el-row>  
                  <el-row style="padding: 0 15%;">    
                  <el-form-item label="道路运输证IC卡认证主服务器TCP端口">
                    <el-input v-model="form_IC.tcpPoint" style="width:85%;"></el-input>
                  </el-form-item>  
                        </el-row>  
                  <el-row style="padding: 0 15%;">   
                  <el-form-item label="道路运输证IC卡认证主服务器UDP端口">
                    <el-input v-model="form_IC.udpPoint" style="width:85%;"></el-input>
                  </el-form-item>  
                        </el-row>  
                  <el-row style="padding: 0 15%;">   
                  <el-form-item label="道路运输证IC卡认证备份服务器IP">
                    <el-input v-model="form_IC.secondServerIPAddr" style="width:85%;"></el-input>
                  </el-form-item>    
                  </el-row>                              
                </el-form>
            <el-row style="text-align:center;margin:10px 0;">
              <el-button @click="outerVisible = true" class="dedBtn">刷新</el-button>
              <el-button @click="saveFormIC()" class="saveBtn">保存</el-button>
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
        <el-tab-pane label="监听设置" name="fifth">
            <el-form ref="form_Listen" :model="form_Listen" label-width="140px" class="selfform" size="mini">
              <Span style="font-size:14px;color:#628FA6;font-weight:bold;">● 号码参数设置</Span>
              <el-row>
                  <el-col :span="12">
                    <el-form-item label="监控平台电话号码">
                      <el-input v-model="form_Listen.listenerPhoneNum"  style="width:50%;"></el-input>
                      <span class="trick">（小于12位整数）</span>
                    </el-form-item>  
                  </el-col>  
                  <el-col :span="12">    
                    <el-form-item label="复位电话号码">
                      <el-input v-model="form_Listen.resetPhoneNum"  style="width:50%;"></el-input>
                      <span class="trick">（小于12位整数）</span>
                    </el-form-item> 
                  </el-col> 
              </el-row>
              <el-row>
                  <el-col :span="12">    
                      <el-form-item label="恢复出厂设置电话号码">
                        <el-input v-model="form_Listen.initialPhoneNum" style="width:50%;" ></el-input>
                        <span class="trick">（小于12位整数）</span>
                      </el-form-item> 
                  </el-col>  
                  <el-col :span="12">   
                    <el-form-item label="监控平台SMS电话号码" >
                      <el-input v-model="form_Listen.listenerSMSNum" style="width:50%;"></el-input>
                      <span class="trick">（小于12位整数）</span>
                    </el-form-item>  
                  </el-col> 
              </el-row> 
                <span style="font-size:14px;color:#628FA6;font-weight:bold;">● 限制参数设置</span>   
                <el-form-item class="selfChoosen_veh" label="终端电话监听策略" >
                    <el-radio-group v-model="form_Listen.deviceListenMeth">
                      <el-radio label="自动接听"></el-radio>
                      <el-radio label="(ACC)-ON自动监听/OFF手动监听"></el-radio>                     
                    </el-radio-group>
                </el-form-item>  
              <el-row>                   
                <el-form-item label="每次最长通话">
                  <el-input v-model="form_Listen.maxlistenTime" style="width:35%;" ></el-input>
                  <span class="trick">(秒)(0为不允许通话，4294967295不限制)</span>
                </el-form-item>                    
              </el-row> 
              <el-row>                     
                <el-form-item label="当月最长通话">
                  <el-input v-model="form_Listen.maxlistenTimeForMonth" style="width:35%;" ></el-input>
                  <span class="trick">(秒)(0为不允许通话，4294967295不限制)</span>
                </el-form-item>                    
              </el-row> 
              <el-row>                     
                <el-form-item label="监听电话号码">
                  <el-input v-model="form_Listen.listenedPhoneNum" style="width:35%;" ></el-input>
                  <span class="trick">（小于12位整数）</span>
                </el-form-item>                    
              </el-row> 
              <el-row>                      
                <el-form-item label="监管平台特权短信号码">
                  <el-input v-model="form_Listen.listenerSpecialSMSNum" style="width:35%;" ></el-input>
                  <span class="trick">（小于12位整数）</span>
                </el-form-item>                    
              </el-row> 
            </el-form>
            <el-row style="text-align:center;margin:10px 0;">
                <el-button @click="outerVisible = true" class="dedBtn">刷新</el-button>
                <el-button @click="saveFormListen()" class="saveBtn">保存</el-button>
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
        <el-tab-pane label="报警设置" name="sixth"> 
          <el-form ref="form_Alarm" :model="form_Alarm" label-width="140px" class="selfform" size="mini">
              <Span style="font-size:14px;color:#628FA6;font-weight:bold;">● 屏蔽参数设置</Span>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="报警屏蔽字">
                    <el-input v-model="form_Alarm.shieldWord"  style="width:70%;"></el-input>                    
                  </el-form-item>  
                </el-col>  
                <el-col :span="12">    
                  <el-form-item label="报警发送文本SMS开关">
                    <el-input v-model="form_Alarm.alarmSMSSwitch"  style="width:70%;"></el-input>                      
                  </el-form-item> 
                </el-col> 
              </el-row>
              <el-row>
                <el-col :span="12">    
                  <el-form-item label="报警拍摄储存标志">
                    <el-input v-model="form_Alarm.alarmShootFlag" style="width:70%;" ></el-input>                      
                  </el-form-item> 
                </el-col>  
                <el-col :span="12">   
                  <el-form-item label="关键标志" >
                    <el-input v-model="form_Alarm.majorFlag" style="width:70%;"></el-input>                      
                  </el-form-item>  
                </el-col> 
              </el-row> 
              <span style="font-size:14px;color:#628FA6;font-weight:bold;">● 电子围栏设置</span>   
              <el-row>
                <el-form-item label="电子围栏半径" >
                  <el-input v-model="form_Alarm.fenceRadius" style="width:27%;"></el-input>   
                  <span class="trick">(0~6553)(米)</span>                   
                </el-form-item>  
              </el-row> 
          </el-form>
              <el-row style="text-align:center;margin:10px 0;">
                <el-button @click="refreshBut()" class="dedBtn">刷新</el-button>
                <el-button @click="saveFormAlarm()" class="saveBtn">保存</el-button>
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
  name: 'devParamSetDialog',
  data() {
    return {
      outerVisible: false,
      tableData: [],
      websocket: null,
      command_pop: 'first',
      vehicleId: '',
      form_Alarm: {
        shieldWord: '',
        alarmSMSSwitch: '',
        alarmShootFlag: '',
        majorFlag: '',
        fenceRadius: ''
      },
      form_Listen: {
        listenerPhoneNum1: '',
        resetPhoneNum: '',
        initialPhoneNum: '',
        listenerSMSNum: '',
        deviceListenMeth: '',
        maxlistenTime: '',
        maxlistenTimeForMonth: '',
        listenedPhoneNum: '',
        listenerSpecialSMSNum: ''
      },
      form_IC: {
        firstServerIPAddr: '',
        tcpPoint: '',
        udpPoint: '',
        secondServerIPAddr: ''
      },
      form_network: {
        firstAPNAddr: '',
        firstCallPointUserName: '',
        firstCallPointPwd: '',
        firstIPAddr: '',
        secondAPNAddr: '',
        secondCallPointUserName: '',
        secondCallPointPwd: '',
        secondIPAddr: ''
      },
      form_device: {
        provinceID: '',
        cityID: '',
        plateNo: '',
        plateColor: '',
        smsMagRetries: '',
        smsAnswerTimeOut: '',
        udpMagRetries: '',
        udpAnswerTimeOut: '',
        tcpMagRetries: '',
        tcpAnswerTimeOut: '',
        heartBeatInterval: ''
      },
      form_vehicle: {
        mileage: '',
        maxSpeed: '',
        keepTime: '',
        ContinuDriverTime: '',
        totalDriverTime: '',
        minRestTime: '',
        maxStopCarTime: '',
        plan: '',
        meth: ''
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
        console.log('部标参数websocket连接成功')
      }
      vm.websocket.onmessage = function(evt) {
        console.log('部标参数配置数据已接收...')
        console.log(JSON.parse(evt.data))
        const obj = JSON.parse(evt.data)
        switch (obj.Command) {
          case '8106':
            switch (obj.Body.code) {
              case 0:
                vm.open('返回失败')
                break
              case 1:
                console.log(obj.Body.paramList)
                if (obj.Body.paramList != null) {
                  obj.Body.paramList.forEach(item => {
                    switch (item.paramId) {
                      case 128:
                        vm.form_vehicle.mileage = item.paramValue
                        break
                      case 85:
                        vm.form_vehicle.maxSpeed = item.paramValue
                        break
                      case 86:
                        vm.form_vehicle.keepTime = item.paramValue
                        break
                      case 87:
                        vm.form_vehicle.ContinuDriverTime = item.paramValue
                        break
                      case 88:
                        vm.form_vehicle.totalDriverTime = item.paramValue
                        break
                      case 89:
                        vm.form_vehicle.minRestTime = item.paramValue
                        break
                      case 90:
                        vm.form_vehicle.maxStopCarTime = item.paramValue
                        break
                      case 32:
                        vm.form_vehicle.plan = item.paramValue
                        break
                      case 33:
                        vm.form_vehicle.meth = item.paramValue
                        break
                      case 129:
                        vm.form_device.provinceID = item.paramValue
                        break
                      case 130:
                        vm.form_device.cityID = item.paramValue
                        break
                      case 131:
                        vm.form_device.plateNo = item.paramValue
                        break
                      case 132:
                        vm.form_device.plateColor = item.paramValue
                        break
                      case 1:
                        vm.form_device.heartBeatInterval = item.paramValue
                        break
                      case 2:
                        vm.form_device.tcpAnswerTimeOut = item.paramValue
                        break
                      case 3:
                        vm.form_device.tcpMagRetries = item.paramValue
                        break
                      case 4:
                        vm.form_device.udpAnswerTimeOut = item.paramValue
                        break
                      case 5:
                        vm.form_device.udpMagRetries = item.paramValue
                        break
                      case 6:
                        vm.form_device.smsAnswerTimeOut = item.paramValue
                        break
                      case 7:
                        vm.form_device.smsMagRetries = item.paramValue
                        break
                      case 16:
                        vm.form_network.firstAPNAddr = item.paramValue
                        break
                      case 17:
                        vm.form_network.firstCallPointUserName = item.paramValue
                        break
                      case 18:
                        vm.form_network.firstCallPointPwd = item.paramValue
                        break
                      case 19:
                        vm.form_network.firstIPAddr = item.paramValue
                        break
                      case 20:
                        vm.form_network.secondAPNAddr = item.paramValue
                        break
                      case 21:
                        vm.form_network.secondCallPointUserName = item.paramValue
                        break
                      case 22:
                        vm.form_network.secondCallPointPwd = item.paramValue
                        break
                      case 23:
                        vm.form_network.secondIPAddr = item.paramValue
                        break
                      case 26:
                        vm.form_IC.firstServerIPAddr = item.paramValue
                        break
                      case 27:
                        vm.form_IC.tcpPoint = item.paramValue
                        break
                      case 28:
                        vm.form_IC.udpPoint = item.paramValue
                        break
                      case 29:
                        vm.form_IC.secondServerIPAddr = item.paramValue
                        break
                      case 64:
                        vm.form_Listen.listenerPhoneNum = item.paramValue
                        break
                      case 65:
                        vm.form_Listen.resetPhoneNum = item.paramValue
                        break
                      case 66:
                        vm.form_Listen.initialPhoneNum = item.paramValue
                        break
                      case 67:
                        vm.form_Listen.listenerSMSNum = item.paramValue
                        break
                      case 69:
                        vm.form_Listen.deviceListenMeth = item.paramValue
                        break
                      case 70:
                        vm.form_Listen.maxlistenTime = item.paramValue
                        break
                      case 71:
                        vm.form_Listen.maxlistenTimeForMonth = item.paramValue
                        break
                      case 72:
                        vm.form_Listen.listenedPhoneNum = item.paramValue
                        break
                      case 73:
                        vm.form_Listen.listenerSpecialSMSNum = item.paramValue
                        break
                      case 80:
                        vm.form_Alarm.shieldWord = item.paramValue
                        break
                      case 81:
                        vm.form_Alarm.alarmSMSSwitch = item.paramValue
                        break
                      case 83:
                        vm.form_Alarm.alarmShootFlag = item.paramValue
                        break
                      case 84:
                        vm.form_Alarm.majorFlag = item.paramValue
                        break
                      case 49:
                        vm.form_Alarm.fenceRadius = item.paramValue
                        break
                      default:
                        break
                    }
                  })
                } else {
                  vm.open('操作成功')
                }
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
    open(ent) {
      this.$message(ent)
    },
    refreshBut() {
      this.subscribeParamSet(8106)
    },
    subscribeParamSet(command) { // 发送websocket消息，获取信息
      const data = {
        Command: command,
        CommandType: 'command',
        Token: getToken(),
        Body: {
          data: {
            vehicleId: this.vehicleId,
            paramIds: [128, 85, 86, 87, 88, 89, 90, 32, 33, 129, 130, 131, 132, 1, 2, 3, 4, 5, 6, 7, 16, 17, 18, 19, 20, 21, 22, 23, 26, 27, 28, 29, 64, 65, 67, 69, 70, 71, 72, 73, 80, 81, 83, 84, 49]
          }
        }
      }
      if (this.websocket.readyState === 1) {
        console.log('部标参数请求参数：', data)
        this.websocket.send(JSON.stringify(data))
      } else {
        console.log('部标参数websocket信息发送失败')
      }
    },
    saveFormAlarm() { // 发送websocket消息，获取信息
      const data = {
        Command: '8106',
        CommandType: 'command',
        Token: getToken(),
        Body: {
          data: {
            vehicleId: this.vehicleId,
            params: [{
              paramId: '80',
              param: this.form_Alarm.shieldWord
            }, {
              paramId: '81',
              param: this.form_Alarm.alarmSMSSwitch
            }, {
              paramId: '83',
              param: this.form_Alarm.alarmShootFlag
            }, {
              paramId: '84',
              param: this.form_Alarm.majorFlag
            }, {
              paramId: '49',
              param: this.form_Alarm.fenceRadius
            }]
          }
        }
      }
      if (this.websocket.readyState === 1) {
        console.log('部标参数form_Alarm请求参数：', data)
        this.websocket.send(JSON.stringify(data))
      } else {
        console.log('部标参数form_Alarm信息发送失败')
      }
    },
    saveFormListen() { // 发送websocket消息，获取信息
      const data = {
        Command: '8106',
        CommandType: 'command',
        Token: getToken(),
        Body: {
          data: {
            vehicleId: this.vehicleId,
            params: [{
              paramId: '64',
              param: this.form_Listen.listenerPhoneNum
            }, {
              paramId: '65',
              param: this.form_Listen.resetPhoneNum
            }, {
              paramId: '66',
              param: this.form_Listen.initialPhoneNum
            }, {
              paramId: '67',
              param: this.form_Listen.listenerSMSNum
            }, {
              paramId: '69',
              param: this.form_Listen.deviceListenMeth
            }, {
              paramId: '70',
              param: this.form_Listen.maxlistenTime
            }, {
              paramId: '71',
              param: this.form_Listen.maxlistenTimeForMonth
            }, {
              paramId: '72',
              param: this.form_Listen.listenedPhoneNum
            }, {
              paramId: '73',
              param: this.form_Listen.listenerSpecialSMSNum
            }]
          }
        }
      }
      if (this.websocket.readyState === 1) {
        console.log('部标参数form_Listen请求参数：', data)
        this.websocket.send(JSON.stringify(data))
      } else {
        console.log('部标参数form_Listen信息发送失败')
      }
    },
    saveFormIC() { // 发送websocket消息，获取信息
      const data = {
        Command: '8106',
        CommandType: 'command',
        Token: getToken(),
        Body: {
          data: {
            vehicleId: this.vehicleId,
            params: [{
              paramId: '26',
              param: this.form_IC.firstServerIPAddr
            }, {
              paramId: '27',
              param: this.form_IC.tcpPoint
            }, {
              paramId: '28',
              param: this.form_IC.udpPoint
            }, {
              paramId: '29',
              param: this.form_IC.secondServerIPAddr
            }]
          }
        }
      }
      if (this.websocket.readyState === 1) {
        console.log('部标参数form_IC请求参数：', data)
        this.websocket.send(JSON.stringify(data))
      } else {
        console.log('部标参数form_IC信息发送失败')
      }
    },
    saveFormNetwork() { // 发送websocket消息，获取信息
      const data = {
        Command: '8106',
        CommandType: 'command',
        Token: getToken(),
        Body: {
          data: {
            vehicleId: this.vehicleId,
            params: [{
              paramId: '10',
              param: this.form_network.firstAPNAddr
            }, {
              paramId: '11',
              param: this.form_network.firstCallPointUserName
            }, {
              paramId: '12',
              param: this.form_network.firstCallPointPwd
            }, {
              paramId: '13',
              param: this.form_network.firstIPAddr
            }, {
              paramId: '14',
              param: this.form_network.secondAPNAddr
            }, {
              paramId: '15',
              param: this.form_network.secondCallPointUserName
            }, {
              paramId: '16',
              param: this.form_network.secondCallPointPwd
            }, {
              paramId: '17',
              param: this.form_network.secondIPAddr
            }]
          }
        }
      }
      if (this.websocket.readyState === 1) {
        console.log('部标参数form_network请求参数：', data)
        this.websocket.send(JSON.stringify(data))
      } else {
        console.log('部标参数form_network信息发送失败')
      }
    },
    saveFormDevice() { // 发送websocket消息，获取信息
      const data = {
        Command: '8106',
        CommandType: 'command',
        Token: getToken(),
        Body: {
          data: {
            vehicleId: this.vehicleId,
            params: [{
              paramId: '129',
              param: this.form_device.provinceID
            }, {
              paramId: '130',
              param: this.form_device.cityID
            }, {
              paramId: '131',
              param: this.form_device.plateNo
            }, {
              paramId: '132',
              param: this.form_device.plateColor
            }, {
              paramId: '1',
              param: this.form_device.heartBeatInterval
            }, {
              paramId: '2',
              param: this.form_device.tcpAnswerTimeOut
            }, {
              paramId: '3',
              param: this.form_device.tcpMagRetries
            }, {
              paramId: '4',
              param: this.form_device.udpAnswerTimeOut
            }, {
              paramId: '5',
              param: this.form_device.udpMagRetries
            }, {
              paramId: '6',
              param: this.form_device.smsAnswerTimeOut
            }, {
              paramId: '7',
              param: this.form_device.smsMagRetries
            }]
          }
        }
      }
      if (this.websocket.readyState === 1) {
        console.log('部标参数请求参数：', data)
        this.websocket.send(JSON.stringify(data))
      } else {
        console.log('部标参数websocket信息发送失败')
      }
    },
    saveFormVehicle() { // 发送websocket消息，获取信息
      const data = {
        Command: '8106',
        CommandType: 'command',
        Token: getToken(),
        Body: {
          data: {
            vehicleId: this.vehicleId,
            params: [{
              paramId: '128',
              param: this.form_vehicle.mileage
            }, {
              paramId: '85',
              param: this.form_vehicle.maxSpeed
            }, {
              paramId: '86',
              param: this.form_vehicle.keepTime
            }, {
              paramId: '87',
              param: this.form_vehicle.ContinuDriverTime
            }, {
              paramId: '88',
              param: this.form_vehicle.totalDriverTime
            }, {
              paramId: '89',
              param: this.form_vehicle.minRestTime
            }, {
              paramId: '90',
              param: this.form_vehicle.maxStopCarTime
            }, {
              paramId: '32',
              param: this.form_vehicle.plan
            }, {
              paramId: '33',
              param: this.form_vehicle.meth
            }]
          }
        }
      }
      if (this.websocket.readyState === 1) {
        console.log('部标参数form_vehicle请求参数：', data)
        this.websocket.send(JSON.stringify(data))
      } else {
        console.log('部标参数form_vehicle信息发送失败')
      }
    }
  }
}
</script>
<style scoped>

</style>
