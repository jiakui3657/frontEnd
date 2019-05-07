<template>
  <div style="height:260px;">
    <el-row>
      <el-col :span="6">
        <img src="../../../assets/navicon/2-1.png" height="260" width="100%">
        <p class="leftTitle">主动防控平台</p>
        <p class="leftTitle1">考核指标</p>
      </el-col>
      <el-col :span="6" style="height:260px;">
        <ul style="list-style: none;padding:10px 0;height:100%;margin:0;">
          <li style="color:#363636;font-size:15px;height:50%;padding:10px 10px 10px 0;text-align: center;">
            <div style="height:60px;margin-top: 15px;border-right: 1px solid #ccc;">
              <p style="font-size:32px;color:#5F7ABF;margin:0;">{{inlineCar}}%</p>
              <p style="margin:5px 0 0 0 ;font-size:20px;font-weight: bold;">车辆上线率</p>
            </div>
          </li>
          <li style="color:#363636;font-size:15px;height:50%;padding:10px 10px 10px 0;text-align: center;">
            <div style="height:60px;margin-top: 15px;border-right: 1px solid #ccc;">
              <p style="font-size:32px;color:#5F7ABF;margin:0;">{{checkRate}}%</p>
              <p style="margin:5px 0 0 0 ;font-size:20px;font-weight: bold;">查岗响应率</p>
            </div>
          </li>
        </ul>
      </el-col>
      <el-col :span="6" style="height:260px;">
        <ul style="list-style: none;padding:10px 0;height:100%;margin:0;">
          <li style="color:#363636;font-size:15px;height:50%;padding:10px 10px 10px 0;text-align: center;">
            <div style="height:60px;margin-top: 15px;border-right: 1px solid #ccc;">
              <p style="font-size:32px;color:#5F7ABF;margin:0;">{{platformOnline}}%</p>
              <p style="margin:5px 0 0 0 ;font-size:20px;font-weight: bold;">平台连通率</p>
            </div>
          </li>
          <li style="color:#363636;font-size:15px;height:50%;padding:10px 10px 10px 0;text-align: center;">
            <div style="height:60px;margin-top: 15px;border-right: 1px solid #ccc;">
              <p style="font-size:32px;color:#5F7ABF;margin:0;">{{alarmRate}}%</p>
              <p style="margin:5px 0 0 0 ;font-size:20px;font-weight: bold;">报警处理率</p>
            </div>
          </li>
        </ul>
      </el-col>
      <el-col :span="6" style="height:260px;">
        <ul style="list-style: none;padding:10px 0;height:100%;margin:0;">
          <li style="color:#363636;font-size:15px;height:50%;padding:10px 10px 10px 0;text-align: center;">
            <div style="height:60px;margin-top: 15px;">
              <p style="font-size:32px;color:#5F7ABF;margin:0;">{{overseeRates}}%</p>
              <p style="margin:5px 0 0 0 ;font-size:20px;font-weight: bold;">督办处理率</p>
            </div>
          </li>
        </ul>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    props: ['leftData'],
    data() {
      return {
        inlineCar: 0,
        platformOnline: 0,
        overseeRates: 0,
        checkRate: 0,
        alarmRate: 0
      }
    },
    watch: {
      leftData(val, oldVal) {
        if (val && val.length !== 0) {
          this.inlineCar = val.onlineRate
          this.platformOnline = val.platformOnline
          this.overseeRates = val.overseeRates
          this.checkRate = val.checkRate
          this.alarmRate = val.alarmRate
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
