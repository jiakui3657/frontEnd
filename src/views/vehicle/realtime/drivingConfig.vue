<template>
  <!-- 安全驾驶配置 -->
      <el-dialog title="安全驾驶配置" :visible.sync="drivingConfig" style="z-index:9999">
        <el-tabs v-model="tabChecked_DC">
          <el-tab-pane label="ADAS辅助参数" name="first">
            <el-form  ref="from_ADAS" :model="from_ADAS" label-width="62%" class="selfform" size="mini">
            <span style="font-size:14px;color:#628FA6;font-weight:bold;">●通用设置</span>
              <el-row>
                <el-col :span="12">
                  <el-form-item  label="报警速度阈值(0-60)">
                    <el-input v-model="from_ADAS.alarmSpeed" style="width:50%;" size="mini"></el-input>
                    <span class="trick">km/h</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12"> 
                  <el-form-item label="提示音量(1-8)">
                    <el-input v-model="from_ADAS.alarmVolume" style="width:50%;" size="mini"></el-input>
                  </el-form-item> 
                </el-col>
              </el-row>
          
              <el-row>
                <el-col :span="12">
                  <el-form-item label="主动拍照策略"  >
                     <el-select v-model="from_ADAS.photoStrategy" placeholder="请选择" style="width:100px;" size="mini">
                      <el-option
                        v-for="item in snapshot"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="主动定时拍照时间间隔(0-3600)" >
                    <el-input v-model="from_ADAS.photoTime" style="width:50%;" size="mini"></el-input>
                    <span class="trick">秒</span>
                  </el-form-item>
                </el-col>
              </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="主动定时拍照距离间隔(0-3600)" >
                  <el-input v-model="from_ADAS.photoDistance" style="width:50%;" size="mini"></el-input>
                  <span class="trick">米</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="单次主动拍照张数(0-10)" >
                  <el-input v-model="from_ADAS.photoNum" style="width:50%;" size="mini"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="单次主动拍照时间间隔(0-5)" >
                  <el-input v-model="from_ADAS.onePhotoTime" style="width:50%;" size="mini"></el-input>
                  <span class="trick">100ms</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="拍照分辨率" >
                  <el-select v-model="from_ADAS.photoResolving" placeholder="请选择" style="width:100px;" size="mini">
                      <el-option
                        v-for="item in picture"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="录像分辨率" >
                  <el-select v-model="from_ADAS.videoResolving" placeholder="请选择" style="width:100px;" size="mini">
                      <el-option
                        v-for="item in video"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          
          <span style="font-size:14px;color:#628FA6;font-weight:bold;">●道路偏移报警参数设置</span>
           <el-row>
              <el-col :span="12">
                <el-form-item label="报警分级速度阈值(0-220)" >
                  <el-input v-model="from_ADAS.deviateAlarmSpeed" style="width:50%;" size="mini"></el-input>
                   <span class="trick">km/h</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="报警视频录制时间(0-60)" >
                  <el-input v-model="from_ADAS.deviateAlarmVideoTime" style="width:50%;" size="mini"></el-input>
                  <span class="trick">100ms</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="报警证据拍照张数" >
                  <el-input v-model="from_ADAS.deviateAlarmPhoNum" style="width:50%;" size="mini"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="报警证据拍照间隔(0-60)" >
                  <el-input v-model="from_ADAS.deviateAlarmPhoTime" style="width:50%;" size="mini"></el-input>
                  <span class="trick">100ms</span>
                </el-form-item>
              </el-col>
            </el-row>
          <span style="font-size:14px;color:#628FA6;font-weight:bold;">●前向碰撞报警参数设置</span>
           <el-row>
              <el-col :span="12">
                <el-form-item label="前向碰撞分级速度阈值(0-220)" >
                  <el-input v-model="from_ADAS.collisionAlarmSpeed" style="width:50%;" size="mini"></el-input>
                  <span class="trick">km/h</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="前向碰撞视频录制时间(0-60)" >
                  <el-input v-model="from_ADAS.collisionAlarmVideoTime" style="width:50%;" size="mini"></el-input>
                  <span class="trick">100ms</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="前向碰撞证据拍照张数" >
                  <el-input v-model="from_ADAS.collisionAlarmNum" style="width:50%;" size="mini"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="前向碰撞证据拍照间隔(0-60)" >
                  <el-input v-model="from_ADAS.collisionAlarmTime" style="width:50%;" size="mini"></el-input>
                  <span class="trick">100ms</span>
                </el-form-item>
              </el-col>
            </el-row>
          <span style="font-size:14px;color:#628FA6;font-weight:bold;">●车距过近报警参数设置</span>
           <el-row>
              <el-col :span="12">
                <el-form-item label="车距过近分级速度阈值(0-220)" >
                  <el-input v-model="from_ADAS.carDistanceSpeed" style="width:50%;" size="mini"></el-input>
                  <span class="trick">km/h</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="车距过近视频录制时间(0-60)" >
                  <el-input v-model="from_ADAS.carDistanceVideoTime" style="width:50%;" size="mini"></el-input>
                  <span class="trick">100ms</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="车距过近证据拍照张数" >
                  <el-input v-model="from_ADAS.carDistancePhoNum" style="width:50%;" size="mini"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="车距过近证据拍照间隔(0-60)" >
                  <el-input v-model="from_ADAS.carDistancePhoTime" style="width:50%;" size="mini"></el-input>
                  <span class="trick">100ms</span>
                </el-form-item>
              </el-col>
            </el-row>
        </el-form>  
            <el-row style="text-align:center;margin:10px 0;">
                    <el-button @click="refreshBtn()" class="dedBtn">刷新</el-button>
                    <el-button @click="submitADAS()" class="saveBtn">保存</el-button>
                    <el-button @click="drivingConfig = false" class="dedBtn">保存到其他车辆</el-button>
                    <el-button @click="drivingConfig = false" class="dedBtn">关闭</el-button>
            </el-row>
           
             
           
              <template>
                <el-table :data="tableData_ADAS"  style="width: 100%">
                  <el-table-column  prop="date" label="车牌号" width="180">
                  </el-table-column>
                  <el-table-column  prop="name" label="时间" width="180">
                  </el-table-column>
                  <el-table-column  prop="address"  label="状态">
                  </el-table-column>
                  <el-table-column  prop="address" label="类型">
                  </el-table-column>
                </el-table>
              </template>
         
          </el-tab-pane>
          <el-tab-pane label="DSM辅助参数" name="second">
            <el-form  ref="from_DSM" :model="from_DSM" label-width="62%" class="selfform" size="mini">
            <span style="font-size:14px;color:#628FA6;font-weight:bold;">●通用设置</span>
            <el-row>
                <el-col :span="12">
                  <el-form-item  label="报警速度阈值(0-60)">
                    <el-input v-model="from_DSM.alarmSpeed" style="width:50%;" size="mini"></el-input>
                    <span class="trick">km/h</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12"> 
                  <el-form-item label="提示音量(1-8)">
                    <el-input v-model="from_DSM.alarmVolume" style="width:50%;" size="mini"></el-input>
                  </el-form-item> 
                </el-col>
              </el-row>
          
              <el-row>
                <el-col :span="12">
                  <el-form-item label="主动拍照策略"  >
                     <el-select v-model="from_DSM.photoStrategy" placeholder="请选择" style="width:100px;" size="mini">
                      <el-option
                        v-for="item in snapshot"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="主动定时拍照时间间隔(0-3600)" >
                    <el-input v-model="from_DSM.photoTime" style="width:50%;" size="mini"></el-input>
                    <span class="trick">秒</span>
                  </el-form-item>
                </el-col>
              </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="主动定时拍照距离间隔(0-3600)" >
                  <el-input v-model="from_DSM.photoDistance" style="width:50%;" size="mini"></el-input>
                  <span class="trick">米</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="单次主动拍照张数(0-10)" >
                  <el-input v-model="from_DSM.onePhotoNum" style="width:50%;" size="mini"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="单次主动拍照时间间隔(0-5)" >
                  <el-input v-model="from_DSM.onePhoTime" style="width:50%;" size="mini"></el-input>
                  <span class="trick">100ms</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="拍照分辨率" >
                  <el-select v-model="from_DSM.photoResolving" placeholder="请选择" style="width:100px;" size="mini">
                      <el-option
                        v-for="item in picture"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="录像分辨率" >
                  <el-select v-model="from_DSM.vedioResolving" placeholder="请选择" style="width:100px;" size="mini">
                      <el-option
                        v-for="item in video"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <span style="font-size:14px;color:#628FA6;font-weight:bold;">●疲劳驾驶报警参数设置</span>
              <el-row>
                  <el-col :span="12">
                    <el-form-item label="疲劳驾驶分级速度阈值(0-220)" >
                      <el-input v-model="from_DSM.fatigueAlarmSpeed" style="width:50%;" size="mini"></el-input>
                      <span class="trick">km/h</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="疲劳驾驶视频录制时间(0-60)" >
                      <el-input v-model="from_DSM.fatigueAlarmVideoTime" style="width:50%;" size="mini"></el-input>
                      <span class="trick">100ms</span>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="疲劳驾驶证据拍照张数(1-10)" >
                      <el-input v-model="from_DSM.fatigueAlarmPhoNum" style="width:50%;" size="mini"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="疲劳驾驶证据拍照间隔(0-60)" >
                      <el-input v-model="from_DSM.fatigueAlarmPhoTime" style="width:50%;" size="mini"></el-input>
                      <span class="trick">100ms</span>
                    </el-form-item>
                  </el-col>
                </el-row>
            <span style="font-size:14px;color:#628FA6;font-weight:bold;">●分神驾驶报警参数设置</span>
              <el-row>
                  <el-col :span="12">
                    <el-form-item label="分神驾驶分级速度阈值(0-220)" >
                      <el-input v-model="from_DSM.distractionAlarmSpeed" style="width:50%;" size="mini"></el-input>
                      <span class="trick">km/h</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="分神驾驶视频录制时间(0-60)" >
                      <el-input v-model="from_DSM.distractionAlarmVideoTime" style="width:50%;" size="mini"></el-input>
                      <span class="trick">100ms</span>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="分神驾驶证据拍照张数(1-10)" >
                      <el-input v-model="from_DSM.distractionAlarmPhoNum" style="width:50%;" size="mini"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="分神驾驶证据拍照间隔(0-60)" >
                      <el-input v-model="from_DSM.distractionAlarmPhoTime" style="width:50%;" size="mini"></el-input>
                      <span class="trick">100ms</span>
                    </el-form-item>
                  </el-col>
                </el-row>
              <span style="font-size:14px;color:#628FA6;font-weight:bold;">●抽烟报警参数设置</span>
              <el-row>
                  <el-col :span="12">
                    <el-form-item label="抽烟分级速度阈值(0-220)" >
                      <el-input v-model="from_DSM.smokeAlarmSpeed" style="width:50%;" size="mini"></el-input>
                      <span class="trick">km/h</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="抽烟视频录制时间(0-60)" >
                      <el-input v-model="from_DSM.smokeAlarmVideoTime" style="width:50%;" size="mini"></el-input>
                      <span class="trick">100ms</span>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="抽烟证据拍照张数(1-10)" >
                      <el-input v-model="from_DSM.smokeAlarmPhoNum" style="width:50%;" size="mini"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="抽烟证据拍照间隔(0-60)" >
                      <el-input v-model="from_DSM.smokeAlarmPhoTime" style="width:50%;" size="mini"></el-input>
                      <span class="trick">100ms</span>
                    </el-form-item>
                  </el-col>
                </el-row>
              <span style="font-size:14px;color:#628FA6;font-weight:bold;">●接打电话报警参数设置</span>
              <el-row>
                  <el-col :span="12">
                    <el-form-item label="接打电话分级速度阈值(0-220)" >
                      <el-input v-model="from_DSM.phoneAlarmSpeed" style="width:50%;" size="mini"></el-input>
                      <span class="trick">km/h</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="接打电话视频录制时间(0-60)" >
                      <el-input v-model="from_DSM.phoneAlarmVideoTime" style="width:50%;" size="mini"></el-input>
                      <span class="trick">100ms</span>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="接打电话证据拍照张数" >
                      <el-input v-model="from_DSM.phoneAlarmPhoNum" style="width:50%;" size="mini"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="接打电话证据拍照间隔(0-60)" >
                      <el-input v-model="from_DSM.phoneAlarmPhoTime" style="width:50%;" size="mini"></el-input>
                      <span class="trick">100ms</span>
                    </el-form-item>
                  </el-col>
                </el-row>
                <span style="font-size:14px;color:#628FA6;font-weight:bold;">●驾驶员异常报警参数设置</span>
              <el-row>
                  <el-col :span="12">
                    <el-form-item label="驾驶员异常分级速度阈值(0-220)" >
                      <el-input v-model="from_DSM.driveAbnormalSpeed" style="width:50%;" size="mini"></el-input>
                      <span class="trick">km/h</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="驾驶员异常视频录制时间(0-60)" >
                      <el-input v-model="from_DSM.driveAbnormalVideoTime" style="width:50%;" size="mini"></el-input>
                      <span class="trick">100ms</span>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="驾驶员异常证据拍照张数(1-10)" >
                      <el-input v-model="from_DSM.driveAbnormalPhoNum" style="width:50%;" size="mini"></el-input>
                      
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="驾驶员异常证据拍照间隔(0-60)" >
                      <el-input v-model="from_DSM.driveAbnormalPhoTime" style="width:50%;" size="mini"></el-input>
                      <span class="trick">100ms</span>
                    </el-form-item>
                  </el-col>
                </el-row>

              <el-row style="text-align:center;margin:10px 0;">
                    <el-button @click="refreshBtn()" class="dedBtn">刷新</el-button>
                    <el-button @click="submitDSM()" class="saveBtn">保存</el-button>
                    <el-button @click="drivingConfig = false" class="dedBtn">保存到其他车辆</el-button>
                    <el-button @click="drivingConfig = false" class="dedBtn">关闭</el-button>
              </el-row>
            </el-form> 
            
            <template>
              <el-table :data="tableData_DSM"  style="width: 100%">
                <el-table-column  prop="date" label="车牌号" width="180">
                </el-table-column>
                <el-table-column  prop="name" label="时间" width="180">
                </el-table-column>
                <el-table-column  prop="address"  label="状态">
                </el-table-column>
                <el-table-column  prop="address" label="类型">
                </el-table-column>
              </el-table>
            </template>
          </el-tab-pane>
        </el-tabs>
      
      </el-dialog>
</template>
<script>
import { getToken } from '@/utils/auth'
export default {
  data() {
    return {
      websocket: null,
      vehicleId: '',
      drivingConfig: false,
      tabChecked_DC: 'first',
      from_ADAS: {
        alarmSpeed: null,
        alarmVolume: null,
        photoStrategy: null,
        photoTime: null,
        photoDistance: null,
        photoNum: null,
        onePhotoTime: null,
        photoResolving: null,
        videoResolving: null,
        deviateAlarmSpeed: null,
        deviateAlarmVideoTime: null,
        deviateAlarmPhoNum: null,
        deviateAlarmPhoTime: null,
        collisionAlarmSpeed: null,
        collisionAlarmVideoTime: null,
        collisionAlarmNum: null,
        collisionAlarmTime: null,
        carDistanceSpeed: null,
        carDistanceVideoTime: null,
        carDistancePhoNum: null,
        carDistancePhoTime: null
      },
      from_DSM: {
        alarmSpeed: null,
        alarmVolume: null,
        photoStrategy: null,
        photoTime: null,
        photoDistance: null,
        onePhotoNum: null,
        onePhoTime: null,
        photoResolving: null,
        videoResolving: null,
        fatigueAlarmSpeed: null,
        fatigueAlarmVideoTime: null,
        fatigueAlarmPhoNum: null,
        fatigueAlarmPhoTime: null,
        distractionAlarmSpeed: null,
        distractionAlarmVideoTime: null,
        distractionAlarmPhoNum: null,
        distractionAlarmPhoTime: null,
        smokeAlarmSpeed: null,
        smokeAlarmVideoTime: null,
        smokeAlarmPhoNum: null,
        smokeAlarmPhoTime: null,
        phoneAlarmSpeed: null,
        phoneAlarmVideoTime: null,
        phoneAlarmPhoNum: null,
        phoneAlarmPhoTime: null,
        driveAbnormalSpeed: null,
        driveAbnormalVideoTime: null,
        driveAbnormalPhoNum: null,
        driveAbnormalPhoTime: null
      },
      snapshot: [{
        value: '1',
        label: '不开启'
      }, {
        value: '2',
        label: '定时抓拍'
      }, {
        value: '3',
        label: '定距抓拍'
      }],
      picture: [{
        value: '1',
        label: '704*576'
      }],
      video: [{
        value: '1',
        label: 'D1'
      }, {
        value: '2',
        label: 'CIF'
      }],
      tableData_ADAS: [{
        date: '王小虎',
        name: '2016-05-04',
        address: '上海市普陀区'
      }],
      tableData_DSM: [{
        date: '王小虎',
        name: '2016-05-04',
        address: '上海市普陀区'
      }]
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
        console.log('websocket drivingConfig 连接成功')
      }
      vm.websocket.onmessage = function(evt) {
        console.log('数据已接收gygy0000...')
        console.log(evt)
        console.log(JSON.parse(evt.data).Body)
        const obj = JSON.parse(evt.data)
        console.log(obj)
        switch (obj.Command) {
          case '8106':
            console.log(obj.Body.paramList[0].paramId)
            switch (obj.Body.code) {
              case 0:
                vm.open('返回失败')
                break
              case 1:
                switch (obj.Body.paramList[0].paramId) {
                  case 62309:
                    if (obj.Body.paramList != null) {
                      vm.from_DSM = obj.Body.paramList[0].driverState
                      console.log('from_DSM')
                      console.log(vm.from_DSM)
                    }
                    break
                  case 62308:
                    if (obj.Body.paramList != null) {
                      vm.from_ADAS = obj.Body.paramList[0].driverAuxiliary
                      console.log('from_ADAS')
                      console.log(vm.from_ADAS)
                    }
                    break
                  default:
                    break
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
          case '8103':
            console.log(obj.Body.code)
            switch (obj.Body.code) {
              case 1:
                vm.open('提交成功')
                vm.subscribeADAS(8106)
                vm.subscribeDSM(8106)
                break
              case 0:
                vm.open('提交失败')
                vm.subscribeADAS(8106)
                vm.subscribeDSM(8106)
                break
              default:
                break
            }
            break
          default:
            break
        }
        vm.websocket.onerror = function() {
          vm.initWebSocket()
        }
      }
    },
    open(ent) {
      this.$message(ent)
    },
    subscribeADAS(command) { // 获取请求参数
      const data = {
        Command: command,
        CommandType: 'command',
        Token: getToken(),
        Body: {
          data: {
            vehicleId: this.vehicleId,
            paramIds: [62308]
          }
        }
      }
      if (this.websocket.readyState === 1) {
        console.log('获取ADAS请求参数：', data)
        this.websocket.send(JSON.stringify(data))
      } else {
        console.log('websocket信息发送失败')
      }
    },
    subscribeDSM(command) { // 获取请求参数
      const data = {
        Command: command,
        CommandType: 'command',
        Token: getToken(),
        Body: {
          data: {
            vehicleId: this.vehicleId,
            paramIds: [62309]
          }
        }
      }
      if (this.websocket.readyState === 1) {
        console.log('获取DSM请求参数：', data)
        this.websocket.send(JSON.stringify(data))
      } else {
        console.log('websocket信息发送失败')
      }
    },
    submitADAS() {
      console.log(this.from_ADAS)
      const data = {
        Command: '8103',
        CommandType: 'command',
        Token: getToken(),
        Body: {
          data: {
            vehicleId: '4',
            params: [{
              paramId: '62308',
              driverAuxiliary: this.from_ADAS
            }]
          }
        }
      }
      if (this.websocket.readyState === 1) {
        console.log('提交ADAS请求参数：', data)
        this.websocket.send(JSON.stringify(data))
      } else {
        console.log('websocketADAS信息发送失败')
      }
    },
    submitDSM() {
      console.log(this.from_DSM)
      const data = {
        Command: '8103',
        CommandType: 'command',
        Token: getToken(),
        Body: {
          data: {
            vehicleId: '4',
            params: [{
              paramId: '62309',
              driverState: this.from_DSM
            }]
          }
        }
      }
      if (this.websocket.readyState === 1) {
        console.log('提交DSM请求参数：', data)
        this.websocket.send(JSON.stringify(data))
      } else {
        console.log('websocketDSM信息发送失败')
      }
    },
    refreshBtn() {
      this.subscribeADAS(8106)
      this.subscribeDSM(8106)
    }
  }
}
</script>