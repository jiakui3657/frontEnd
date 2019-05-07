<template>
  <div>
    <el-row>
      <el-col :span="10" style="padding:0 5px;height:300px;">
        <div @click="openidence" style="height:100%;border:1px solid #CDCDCD;border-radius:5px;cursor:pointer;">
          <img v-show="nopic" style="width:100%;height:100%;" src="../../../assets/404_images/404.png">
          <img v-show="havePic" style="width:100%;height:100%;" :src="mediaUrl">
        </div>
      </el-col>
      <el-col :span="14" style="padding:0 5px;height:300px;">
       <div style="height:100%;border:1px solid #CDCDCD;border-radius:5px;">
         <baidu-map class="map" :center="{lng: 116.404, lat: 39.915}" :zoom="15">
           <bm-marker :position="markerPoint" :dragging="false" @click="infoWindowOpen" :icon="{url: 'http://192.168.5.10:7000/upload/Icon/staPoint.png', size: {width: 29, height: 36}}">
              <bm-info-window :autoPan="true" :closeOnClick="false" :show="show" @close="infoWindowClose" @open="infoWindowOpen">
                <p>车牌：<span>{{ plateNo }}</span></p>
                <p>速度：<span>{{ speed }}</span></p>
                <p>时间：<span>{{ alarmStart }}</span></p>
                <p>地址：<span>{{ alarmAddress }}</span></p>
              </bm-info-window>
           </bm-marker>
         </baidu-map>
       </div>
      </el-col>
      <!-- 证据详情弹框 -->
      <el-dialog
        title="证据详情"
        :visible.sync="identDialog"
        :close-on-click-modal="false"
        append-to-body>
        <span>证据。。。</span>
      </el-dialog>
    </el-row>
    <el-row style="margin-top:10px;">
      <el-col :span="10" style="padding:0 5px;height:200px;">
        <div style="height:100%;border:1px solid #CDCDCD;border-radius:5px;">
          <el-radio-group v-model="doAlarmRadio" style="margin-top:18px;">
            <el-radio style="width:40%;margin:20px 0 20px 30px;" :label="1">电话通知</el-radio>
            <el-radio style="width:40%;margin:20px 0 20px 0;" :label="2">建议停车</el-radio>
            <el-radio style="width:40%;margin:20px 0 20px 30px;" :label="3">警告提醒</el-radio>
            <el-radio style="width:40%;margin:20px 0 20px 0;" :label="4">停车休息</el-radio>
            <el-radio style="width:40%;margin:20px 0 20px 30px;" :label="5">语音下发</el-radio>
            <el-radio style="width:40%;margin:20px 0 20px 0;" :label="6">其他</el-radio>
          </el-radio-group>
        </div>
      </el-col>
      <el-col :span="14" style="padding:0 5px;height:200px;">
        <div class="desBox" style="height:100%;border:1px solid #CDCDCD;border-radius:5px;">
          <p style="margin:15px 0 10px 6%;font-size:16px;font-weight:bold;">处理描述</p>
          <el-input style="width:90%;margin-left:5%;" type="textarea" v-model="alarmDesc"></el-input>
        </div>
      </el-col>
    </el-row>
    <el-row style="margin:20px 0;">
      <el-col :span="24" style="text-align:center;">
        <el-button style="border-radius:5px;padding: 9px 18px;border-color:#B0C7D3;color:#6C96AB;">取消</el-button>
        <el-button style="border-radius:5px;padding: 9px 18px;background:#628FA6;color:#fff;">处理完成</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    props: ['picData'],
    data() {
      return {
        show: true,
        selfData: [],
        identDialog: false,
        plateNo: '',
        mediaUrl: '',
        speed: '',
        alarmAddress: '',
        alarmStart: '',
        markerPoint: {},
        havePic: false,
        nopic: true,
        doAlarmRadio: '',
        alarmDesc: ''
      }
    },
    watch: {
      picData(val) {
        console.log(val)
        if (val) {
          this.picData = val
          this.plateNo = val.plateNo
          this.mediaUrl = val.mediaUrl
          this.alarmAddress = val.alarmAddress
          this.alarmStart = val.alarmStart
          this.speed = val.speed
          this.markerPoint = { lng: val.longitude, lat: val.latitude }
        }
        if (val.mediaUrl && val.mediaUrl !== null && val.mediaUrl !== '') {
          this.havePic = true
          this.nopic = false
        } else {
          this.havePic = false
          this.nopic = true
        }
      }
    },
    methods: {
      openidence() {
        this.identDialog = true
      },
      infoWindowClose() {
        this.show = false
      },
      infoWindowOpen() {
        this.show = true
      }
    }
  }
</script>

<style>
  .map {
    width:100%;
    height: 300px;
  }
  .anchorBL{
    display:none;
  }
</style>
