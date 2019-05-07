<template>
  <div class="box">
    <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="车辆单向监听" name="carlisten">
        <choice-car :vehicleNo="vehicleNo"></choice-car>
        <res-list :vehicleNo="vehicleNo"></res-list>
      </el-tab-pane>
      <el-tab-pane label="车辆拍照" name="carphoto">
        <choice-car :vehicleNo="vehicleNo"></choice-car>
        <get-pics :vehicleNo="vehicleNo"></get-pics>
      </el-tab-pane>
      <el-tab-pane label="下发车辆报文" name="cartext">
        <choice-car :vehicleNo="vehicleNo"></choice-car>
        <message :vehicleNo="vehicleNo"></message>
      </el-tab-pane>
      <!-- <el-tab-pane label="上报行驶记录">
        <choice-car></choice-car>
        <record></record>
      </el-tab-pane> -->
      <el-tab-pane label="车辆应急接入监管平台" name="carsys">
        <choice-car :vehicleNo="vehicleNo"></choice-car>
        <access :vehicleNo="vehicleNo"></access>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import choiceCar from './choiceCar'
  import resList from './resList'
  import getPics from './getPics'
  import message from './message'
  import record from './record'
  import access from './Access'

  export default {
    components: {
      choiceCar,
      resList,
      getPics,
      message,
      record,
      access
    },
    data() {
      return {
        tabChange: false,
        activeName: 'carlisten',
        vehicleNo: ''
      }
    },
    mounted() {
      if (this.$route.params.activename) {
        this.$nextTick(() => {
          this.activeName = this.$route.params.activename
          this.vehicleNo = this.$route.params.vNo
        })
      }
    },
    methods: {
      handleClick(val) {
        if (val.label === '车辆单向监听') {
          val.$children[0].queryList.platformId = ''
          val.$children[0].carValue = ''
          val.$children[1].input = ''
          val.$children[1].carInfo = {}
          val.$children[1].wsStatus = ''
        } else if (val.label === '车辆拍照') {
          val.$children[0].queryList.platformId = ''
          val.$children[0].carValue = ''
          val.$children[1].cameraValue = ''
          val.$children[1].carInfo = {}
          val.$children[1].sizeValue = ''
          val.$children[1].wsStatus = ''
          val.$children[1].imgUrl = ''
        } else if (val.label === '下发车辆报文') {
          val.$children[0].queryList.platformId = ''
          val.$children[0].carValue = ''
          val.$children[1].prValue = ''
          val.$children[1].carInfo = {}
          val.$children[1].desc = ''
          val.$children[1].wsStatus = ''
        } else if (val.label === '上报行驶记录') {
          val.$children[0].queryList.platformId = ''
          val.$children[0].carValue = ''
          val.$children[1].input = ''
          val.$children[1].carInfo = {}
          val.$children[1].dateValue = ''
          val.$children[1].dateValue = ''
          val.$children[1].wsStatus = ''
        } else {
          val.$children[0].queryList.platformId = ''
          val.$children[0].carValue = ''
          val.$children[1].carInfo = {}
          val.$children[1].wsStatus = ''
          val.$children[1].authCode = ''
          val.$children[1].accName = ''
          val.$children[1].username = ''
          val.$children[1].pwd = ''
          val.$children[1].IP = ''
          val.$children[1].tcpPort = ''
          val.$children[1].udpPort = ''
          val.$children[1].endTime = ''
        }
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .box{
    padding: 20px;
  }
</style>
