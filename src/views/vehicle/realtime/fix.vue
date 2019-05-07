<template>
  <el-dialog title="车辆监控" style="z-index:9999" :visible.sync="instructionsIssue" >
    <el-tabs type="card" v-model="tabChecked_II">
      <el-tab-pane label="快速拍照" name="first">
      	<div>
          <div style="height:360px;border: 1px solid #D1D1D1;border-radius:5px;padding:10px;">
                <div style="height:50px;border-bottom:1px dashed #DEDEDE;">
                  <span>分辨率：</span>
                    <el-select v-model="camera" placeholder="请选择">
                      <el-option
                        v-for="item in cameras"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                    <span>摄像头：</span>
                    <el-select v-model="resolution" placeholder="请选择">
                      <el-option
                        v-for="item in resolutions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                    <el-button @click="getPicsSend()" style="float:right;border-radius:5px;padding: 9px 18px;background:#628FA6;color:#fff;">拍照</el-button>
                </div>
                <div style="height:295px;overflow:auto;">
                  <ul style="width:100%;height:100%;padding:10px 0 0 0;margin:0;">
                    <li style="height:130px;padding:10px 25px;background:#F0F9FF;list-style:none;margin-bottom:10px;" v-for='item in items_getPics' :key="item.value" >
                      <el-row style="padding:0 10px 10px 10px;border-bottom:1px solid #B6DFF0;margin-bottom:10px;">
                        <el-col :span="12">
                          <img src="../../../assets/navicon/creame.png" style="vertical-align:middle;">
                          <span style="color:#6893A7;vertical-align:middle;">快速拍照</span>
                        </el-col>
                        <el-col :span="12" style="text-align:right;">
                          <span style="color:#242223;">{{ item.getPicsTime }}</span>
                        </el-col>
                      </el-row>
                      <el-row style="margin-bottom: 10px;color:#121011;text-align: center;">
                        <el-col :span="12">摄像头：<span>{{ item.getPicsResolution }}</span></el-col>
                        <el-col :span="12">状态：<span>{{ item.getPicsState }}</span></el-col>
                      </el-row>
                      <el-row style="color:#121011;text-align: center;">
                        <el-col :span="12">分辨率：<span>{{ item.getPicsCamera }}</span></el-col>
                        <el-col :span="12">操作：<span style="color:#51829A;cursor:pointer;">{{ item.getPicsUrl }}  查看图片</span></el-col>
                      </el-row>
                    </li>
                    <!-- <li style="height:130px;padding:10px 15px;background:#F0F9FF;list-style:none;margin-bottom:10px;">
                      <el-row style="padding:0 10px 10px 10px;border-bottom:1px solid #B6DFF0;margin-bottom:10px;">
                        <el-col :span="12">
                          <img src="../../../assets/navicon/creame.png" style="vertical-align:middle;">
                          <span style="color:#6893A7;vertical-align:middle;">快速拍照</span>
                        </el-col>
                        <el-col :span="12" style="text-align:right;">
                          <span style="color:#242223;">2018/11/11  14:31:00</span>
                        </el-col>
                      </el-row>
                      <el-row style="margin-bottom: 10px;color:#121011;text-align: center;">
                        <el-col :span="12">摄像头：<span>摄像头2</span></el-col>
                        <el-col :span="12">状态：<span>抓拍成功</span></el-col>
                      </el-row>
                      <el-row style="color:#121011;text-align: center;">
                        <el-col :span="12">分辨率：<span>320*420</span></el-col>
                        <el-col :span="12">操作：<span style="color:#51829A;cursor:pointer;">查看图片</span></el-col>
                      </el-row>
                    </li> -->
                  </ul>
                </div>
              </div>
        </div>
      	<div style="text-align: center;margin: 20px 0;">
          <el-button @click="instructionsIssue = false" style="border-radius:5px;padding: 9px 22px;border-color:#B0C7D3;color:#6C96AB;">取消</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="文本下发" name="second">
        <div>
          <div class="voiceBox" style="height:380px;border: 1px solid #D1D1D1;border-radius:5px;padding:10px;">
                <div style="height:160px;border-bottom:1px dashed #DEDEDE;">
                    <el-select v-model="text" placeholder="请选择消息模板" style="width:100%;">
                      <el-option
                        v-for="item in msgs"
                        :key="item.id"
                        :label="item.content"
                        :value="item.id">
                      </el-option>
                    </el-select>
                    <el-input
                      type="textarea"
                      placeholder="请输入内容"
                      v-model="form_SM.sendContent">
                    </el-input>
                </div>
                <div style="height:50px;line-height:50px;">
                  <!-- <el-checkbox-group v-model="radio" >
                    <el-checkbox v-model="radio" label="1">紧急</el-checkbox >
                    <el-checkbox v-model="radio" label="4">终端显示器显示</el-checkbox >
                    <el-checkbox v-model="radio" label="8">TTS播读</el-checkbox >
                    <el-checkbox v-model="radio" label="16">广告屏显示</el-checkbox >
                  </el-checkbox-group> -->
                  <el-radio-group v-model="radio" style="display:inline-block;">
                        <el-radio label="1">紧急</el-radio>
                        <el-radio label="4">终端显示器显示</el-radio>
                        <el-radio label="8">TTS播读</el-radio>
                        <el-radio label="16">广告屏显示</el-radio>
                      </el-radio-group>
                  <el-button  style="float:right;margin:9px 10px 0 0;border-radius:5px;padding: 9px 18px;background:#628FA6;color:#fff;" @click="send()">发送</el-button>
                </div>
                <div style="height:150px;overflow:auto;">
                  <ul style="width:100%;height:100%;padding:10px 0 0 0;margin:0;">
                    <li style="height:130px;padding:10px 25px;background:#F0F9FF;list-style:none;margin-bottom:10px;">
                      <el-row style="padding:0 10px 10px 10px;border-bottom:1px solid #B6DFF0;margin-bottom:10px;">
                        <el-col :span="12">
                          <img src="../../../assets/navicon/wenben.png" style="vertical-align:middle;">
                          <span style="color:#6893A7;vertical-align:middle;">文本下发</span>
                        </el-col>
                        <el-col :span="12" style="text-align:right;">
                          <span style="color:#242223;">2018/11/11  14:31:00</span>
                        </el-col>
                      </el-row>
                      <el-row style="margin-bottom: 10px;color:#121011;padding-left: 10px;">
                        <el-col :span="24">内容：<span>{{ form_SM.sendContent }}</span></el-col>
                      </el-row>
                      <el-row style="color:#121011;padding-left: 10px;">
                        <el-col :span="24">状态：<span>{{ sendState }}</span></el-col>
                      </el-row>
                    </li>
                  </ul>
                </div>
              </div>
        </div>
      	<div style="text-align: center;margin: 20px 0;">
          <el-button @click="instructionsIssue = false" style="border-radius:5px;padding: 9px 22px;border-color:#B0C7D3;color:#6C96AB;">取消</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="语音监听" name="third">
        <div>
          <div style="height:360px;border: 1px solid #D1D1D1;border-radius:5px;padding:10px;">
                <div style="height:50px;border-bottom:1px dashed #DEDEDE;">
                  <span>类型：</span>
                    <el-select style="width:130px;margin-right:10px;" v-model="voiceType" placeholder="请选择">
                      <el-option
                        v-for="item in voiceTypes"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                    <span>手机号：</span>
                    <el-input style="width:130px;" v-model="form_listen.phoneNumber" placeholder="请输入手机号"></el-input>
                    <el-button @click="listenBut()" style="float:right;border-radius:5px;padding: 9px 18px;background:#628FA6;color:#fff;">监听</el-button>
                </div>
                <div style="height:295px;overflow:auto;width:100%;">
                  <ul style="width:100%;height:100%;padding:10px 0 0 0;margin:0;">
                    <li  style="height:130px;padding:10px 25px;background:#F0F9FF;list-style:none;margin-bottom:10px;" v-for='item in items_listen' :key="item.value" >
                      <el-row style="padding:0 10px 10px 10px;border-bottom:1px solid #B6DFF0;margin-bottom:10px;">
                        <el-col :span="12">
                          <img src="../../../assets/navicon/erji.png" style="vertical-align:middle;">
                          <span style="color:#6893A7;vertical-align:middle;">语音监听</span>
                        </el-col>
                        <el-col :span="12" style="text-align:right;">
                          <span style="color:#242223;">{{ item.listenTime }}</span>
                        </el-col>
                      </el-row>
                      <el-row style="margin-bottom: 10px;color:#121011;text-align: center;">
                        <el-col :span="12">手机号：<span>{{ item.phoneNumber }}</span></el-col>
                        <el-col :span="12">类型：<span>{{ item.voiceType }}</span></el-col>
                      </el-row>
                      <el-row style="color:#121011;text-align: center;">
                        <el-col :span="12" style="padding-right:16px;">状态：<span>{{ item.listenState }}</span></el-col>
                      </el-row>
                    </li>
                    <!-- <li style="height:130px;padding:10px 25px;background:#F0F9FF;list-style:none;margin-bottom:10px;">
                      <el-row style="padding:0 10px 10px 10px;border-bottom:1px solid #B6DFF0;margin-bottom:10px;">
                        <el-col :span="12">
                          <img src="../../../assets/navicon/erji.png" style="vertical-align:middle;">
                          <span style="color:#6893A7;vertical-align:middle;">语音监听</span>
                        </el-col>
                        <el-col :span="12" style="text-align:right;">
                          <span style="color:#242223;">2018/11/11  14:31:00</span>
                        </el-col>
                      </el-row>
                      <el-row style="margin-bottom: 10px;color:#121011;text-align: center;">
                        <el-col :span="12">手机号：<span>17533274678</span></el-col>
                        <el-col :span="12">类型：<span>普通通话</span></el-col>
                      </el-row>
                      <el-row style="color:#121011;text-align: center;">
                        <el-col :span="12" style="padding-right:16px;">状态：<span>呼叫成功</span></el-col>
                      </el-row>
                    </li> -->
                  </ul>
                </div>
              </div>
        </div>
        <div style="text-align: center;margin: 20px 0;">
          <el-button @click="instructionsIssue = false" style="border-radius:5px;padding: 9px 22px;border-color:#B0C7D3;color:#6C96AB;">取消</el-button>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script>
  import { getToken } from '@/utils/auth'
  export default {
    props: ['iDatas', 'msgs', 'sendtittle'],
    data() {
      return {
        items_listen: [],
        items_getPics: [],
        listenList: {
          listenTime: '',
          phoneNumber: '',
          voiceType: '',
          listenState: ''
        },
        websocket: null,
        vechileId: '',
        checkList: [],
        textNews: '',
        // msgs: '',
        text: '',
        sendState: '',
        radio: '',
        form_SM: {
          vechileId: '4',
          type: '',
          sendContent: ''
        },
        form_listen: {
          vechileId: '4',
          sign: '',
          phoneNumber: ''
        },
        picData: [],
        instructionsIssue: false,
        tabChecked_II: 'first',
        msgData: [],
        phoneNum: '',
        resolution: '',
        resolutionname: '',
        resolutions: [{
          value: 1,
          label: 'DRV1'
        }, {
          value: 2,
          label: 'DRV2'
        }, {
          value: 3,
          label: 'DRV3'
        }, {
          value: 4,
          label: 'DSM'
        }, {
          value: 5,
          label: 'ADAS'
        }],
        voiceType: '',
        voiceTypename: '',
        voiceTypes: [{
          value: 0,
          label: '普通通话'
        }, {
          value: 1,
          label: '监听'
        }],
        cameras: [{
          value: 1,
          label: '320*240'
        }, {
          value: 2,
          label: '640*480'
        }, {
          value: 3,
          label: '800*600'
        }, {
          value: 4,
          label: '1024*768'
        }, {
          value: 5,
          label: '176*144;[Qcif]'
        }, {
          value: 6,
          label: '352*288;[Cif]'
        }, {
          value: 7,
          label: '704*288;[HALF D1]'
        }, {
          value: 8,
          label: '704*576;[D1]'
        }],
        camera: '',
        cameraname: ''
      }
    },
    watch: {
      voiceType(val) {
        switch (val) {
          case 0:
            this.voiceTypename = '普通通话'
            break
          case 1:
            this.voiceTypename = '监听'
            break
          default:
            break
        }
      },
      camera(val) {
        switch (val) {
          case 1:
            this.cameraname = '320*240'
            break
          case 2:
            this.cameraname = '640*480'
            break
          case 3:
            this.cameraname = '800*600'
            break
          case 4:
            this.cameraname = '1024*768'
            break
          case 5:
            this.cameraname = '176*144;[Qcif]'
            break
          case 6:
            this.cameraname = '352*288;[Cif]'
            break
          case 7:
            this.cameraname = '704*288;[HALF D1]'
            break
          case 8:
            this.cameraname = '704*576;[D1]'
            break
          default:
            break
        }
      },
      resolution(val) {
        switch (val) {
          case 1:
            this.resolutionname = 'DRV1'
            break
          case 2:
            this.resolutionname = 'DRV2'
            break
          case 3:
            this.resolutionname = 'DRV3'
            break
          case 4:
            this.resolutionname = 'DSM'
            break
          case 5:
            this.resolutionname = 'ADAS'
            break
          default:
            break
        }
      },
      iDatas(val) {
        console.log(val)
        this.picData = val
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
          console.log('websocket 文本连接成功')
        }
        vm.websocket.onmessage = function(evt) {
          console.log(evt)
          console.log(JSON.parse(evt.data).Body)
          const obj = JSON.parse(evt.data)
          console.log(obj)
          switch (obj.Command) {
            case '8300':
              console.log(obj.Body.code)
              switch (obj.Body.code) {
                case 1:
                  vm.sendState = '下发成功'
                  break
                case 0:
                  vm.sendState = '下发失败'
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
            case '8400':
              console.log(obj.Body.code)
              switch (obj.Body.code) {
                case 0:
                  vm.items_listen.push({
                    listenTime: vm.timeFormate(),
                    phoneNumber: vm.form_listen.phoneNumber,
                    listenState: '呼叫失败',
                    voiceType: vm.form_listen.sign
                  })
                  break
                case 1:
                  vm.items_listen.push({
                    listenTime: vm.timeFormate(),
                    phoneNumber: vm.form_listen.phoneNumber,
                    listenState: '呼叫成功',
                    voiceType: vm.voiceTypename
                  })
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
            case '8801':
              console.log(obj.Body.code)
              switch (obj.Body.code) {
                case 1:
                  vm.items_getPics.push({
                    getPicsTime: vm.timeFormate(),
                    getPicsResolution: vm.resolutionname,
                    getPicsState: '抓拍成功',
                    getPicsUrl: '',
                    getPicsCamera: vm.cameraname
                  })
                  break
                case 0:
                  vm.items_getPics.push({
                    getPicsTime: vm.timeFormate(),
                    getPicsResolution: vm.resolution,
                    getPicsState: '抓拍失败',
                    getPicsUrl: '',
                    getPicsCamera: vm.cameraname
                  })
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
          vm.websocket.onerror = function() {
            vm.initWebSocket()
          }
        }
      },
      send() {
        console.log(this.form_SM.sendContent)
        this.gettextSend()
      },
      gettextSend() {
        console.log('6666666')
        const data = {
          Command: '8300',
          CommandType: 'command',
          Token: getToken(),
          Body: {
            data: {
              vehicleId: this.vechileId,
              type: this.radio,
              text: this.form_SM.sendContent
            }
          }
        }
        if (this.websocket.readyState === 1) {
          console.log('文本下发请求参数：', data)
          this.websocket.send(JSON.stringify(data))
        } else {
          console.log('websocket文本下发信息发送失败')
        }
      },
      listenBut() {
        console.log(this.form_listen.phoneNumber)
        this.getlistenSend()
      },
      getlistenSend() {
        console.log('7777777')
        const data = {
          Command: '8400',
          CommandType: 'command',
          Token: getToken(),
          Body: {
            data: {
              vehicleId: this.vechileId,
              sign: this.voiceType,
              phoneNumber: this.form_listen.phoneNumber
            }
          }
        }
        if (this.websocket.readyState === 1) {
          console.log('语音监听请求参数：', data)
          this.websocket.send(JSON.stringify(data))
        } else {
          console.log('websocket语音监听发送失败')
        }
      },
      picsSend() {
        console.log(this.form_listen.phoneNumber)
        this.getPicsSend()
      },
      getPicsSend() {
        console.log('8888')
        const data = {
          Command: '8801',
          CommandType: 'command',
          Token: getToken(),
          Body: {
            data: {
              vehicleId: this.vechileId,
              channelId: this.camera,
              shotCommand: '4',
              photoTime: '0',
              saveType: '1',
              resolving: '2',
              imageQualiy: '5',
              brightness: '100',
              contrastRatio: '100',
              saturation: '100',
              chroma: '100'
            }
          }
        }
        if (this.websocket.readyState === 1) {
          console.log('语音监听请求参数：', data)
          this.websocket.send(JSON.stringify(data))
        } else {
          console.log('websocket语音监听发送失败')
        }
      },
      timeFormate() {
        // 获取当前时间函数
        const year = new Date().getFullYear()
        const month = new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth() + 1) : new Date().getMonth() + 1
        const date = new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate()
        const hh = new Date().getHours() < 10 ? '0' + new Date().getHours() : new Date().getHours()
        const mm = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes()
        const ss = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() : new Date().getSeconds()
        return year + '/' + month + '/' + date + ' ' + hh + ':' + mm + ':' + ss
      }
    }
  }
</script>

<style>
  .desBox .el-textarea__inner {
    min-height:130px !important;
    height: 130px !important;
  }
  .voiceBox .el-textarea__inner {
    min-height:110px !important;
    height: 110px !important;
  }
</style>
