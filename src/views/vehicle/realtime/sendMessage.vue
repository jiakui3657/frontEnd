<template>
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
                v-model="form.sendContent">
              </el-input>
          </div>
          <div style="height:50px;line-height:50px;">
            <el-checkbox-group v-model="checkList" style="display:inline-block;">
              <el-checkbox label="紧急"></el-checkbox>
              <el-checkbox label="终端显示器显示"></el-checkbox>
              <el-checkbox label="TTS播读"></el-checkbox>
              <el-checkbox label="广告屏显示"></el-checkbox>
            </el-checkbox-group>
            <el-button style="float:right;margin:9px 10px 0 0;border-radius:5px;padding: 9px 18px;background:#628FA6;color:#fff;" @click="send">发送</el-button>
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
                  <el-col :span="24">内容：<span>您已严重分神驾驶，请您注意安全！！！</span></el-col>
                </el-row>
                <el-row style="color:#121011;padding-left: 10px;">
                  <el-col :span="24">状态：<span>下发成功</span></el-col>
                </el-row>
              </li>
            </ul>
          </div>
        </div>
  </div>
</template>

<script>
  import { textSend } from '@/api/vehicleMonitor/realtime'
  export default {
    props: ['msgs', 'sendtittle'],
    data() {
      return {
        checkList: [],
        textNews: '',
        text: '',
        form: {
          vechileId: '',
          deptId: '',
          sendContent: ''
        }
      }
    },
    methods: {
      gettextSend() {
        this.form.vechileId = this.sendtittle.vehicleId
        this.form.deptId = this.sendtittle.deptId
        console.log(this.form)
        textSend(this.form).then(res => {
          console.log(6666666666)
          console.log(res.data)
        })
      },
      send() {
        this.gettextSend()
      }
    },
    mounted() {
      console.log(555555555)
      console.log(this.sendtittle)
    }
  }
</script>
