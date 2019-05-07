<template>
  <div style="height:260px;">
    <el-row>
      <el-col :span="6">
        <img src="../../../assets/navicon/2-2.png" height="260" width="100%">
        <p class="leftTitle">主动防控动态</p>
        <p class="leftTitle1">监管数据</p>
      </el-col>
      <el-col :span="6" style="height:260px;">
        <ul style="list-style: none;padding:10px 0;height:100%;margin:0;">
          <li style="color:#363636;font-size:15px;height:50%;padding:10px 10px 10px 0;text-align: center;">
            <div style="height:60px;margin-top: 15px;border-right: 1px solid #ccc;">
              <p style="font-size:32px;color:#FEB228;margin:0;">{{fatigueDrivingAlarm}}</p>
              <p style="margin:5px 0 0 0 ;font-size:20px;font-weight: bold;">超时疲劳驾驶报警</p>
            </div>
          </li>
          <li style="color:#363636;font-size:15px;height:50%;padding:10px 10px 10px 0;text-align: center;">
            <div style="height:60px;margin-top: 15px;border-right: 1px solid #ccc;">
              <p style="font-size:32px;color:#30B59A;margin:0;">{{onlineTime}}</p>
              <p style="margin:5px 0 0 0 ;font-size:20px;font-weight: bold;">平均在线时长</p>
            </div>
          </li>
        </ul>
      </el-col>
      <el-col :span="6" style="height:260px;">
        <ul style="list-style: none;padding:10px 0;height:100%;margin:0;">
          <li style="color:#363636;font-size:15px;height:50%;padding:10px 10px 10px 0;text-align: center;">
            <div style="height:60px;margin-top: 15px;border-right: 1px solid #ccc;">
              <p style="font-size:32px;color:#359BC8;margin:0;">{{speedAlarm}}</p>
              <p style="margin:5px 0 0 0 ;font-size:20px;font-weight: bold;">超速报警</p>
            </div>
          </li>
          <!-- <li style="color:#363636;font-size:15px;height:50%;padding:10px 10px 10px 0;text-align: center;">
            <div style="height:60px;margin-top: 15px;border-right: 1px solid #ccc;">
              <p style="font-size:32px;color:#F54D6A;margin:0;">{{nightDrivingAlarm}}</p>
              <p style="margin:5px 0 0 0 ;font-size:20px;font-weight: bold;">夜间行车报警</p>
            </div>
          </li> -->
        </ul>
      </el-col>
      <el-col :span="6" style="height:260px;">
        <ul style="list-style: none;padding:10px 0;height:100%;margin:0;">
          <li style="color:#363636;font-size:15px;height:50%;padding:10px 10px 10px 0;text-align: center;">
            <div style="height:60px;margin-top: 15px;">
              <p style="font-size:32px;color:#427BDA;margin:0;">{{activeControlAlarm}}</p>
              <p style="margin:5px 0 0 0 ;font-size:20px;font-weight: bold;">主动防控报警</p>
            </div>
          </li>
        </ul>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import CountTo from '@/components/CountTo'
  export default {
    props: ['rightData'],
    components: {
      CountTo
    },
    data() {
      return {
        fatigueDrivingAlarm: 0,
        nightDrivingAlarm: 0,
        activeControlAlarm: 0,
        speedAlarm: 0,
        onlineTime: 0
      }
    },
    watch: {
      rightData(val, oldVal) {
        if (val && val.length !== 0) {
          this.fatigueDrivingAlarm = val.fatigueDrivingAlarm
          this.nightDrivingAlarm = val.nightDrivingAlarm
          this.activeControlAlarm = val.activeControlAlarm
          this.speedAlarm = val.speedAlarm
          this.onlineTime = val.onlineTime
        }
      }
    }
  }
</script>

<style scoped>
  .leftTitle {
    width:20px;
    line-height: 25px;
    position:absolute;
    top:0;
    left:20px;
    color:#fff;
    font-size:20px;
    font-weight:bold;
  }
  .leftTitle1 {
    width:20px;
    line-height: 25px;
    position:absolute;
    top:0;
    left:50px;
    color:#fff;
    font-size:20px;
    font-weight:bold;
  }
</style>
