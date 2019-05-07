<template>
  <div class="box">
    <el-tabs type="border-card" @tab-click="handleClick">
      <el-tab-pane label="上传车辆定位信息">
        <choose-car></choose-car>
        <location></location>
      </el-tab-pane>
      <el-tab-pane label="实时音视频">
        <choose-car></choose-car>
        <car-video></car-video>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import chooseCar from './chooseCar'
  import location from './location'
  import carVideo from './carVideo'
  export default {
    components: {
      chooseCar,
      location,
      carVideo
    },
    data() {
      return {
        tabChange: false
      }
    },
    methods: {
      handleClick(val) {
        if (val.label === '上传车辆定位信息') {
          val.$children[0].queryList.platformId = ''
          val.$children[0].carValue = ''
          val.$children[1].input = ''
          val.$children[1].carInfo = {}
          val.$children[1].wsStatus = ''
        } else if (val.label === '实时音视频') {
          val.$children[0].queryList.platformId = ''
          val.$children[0].carValue = ''
          val.$children[1].cameraValue = ''
          val.$children[1].carInfo = {}
          val.$children[1].sizeValue = ''
          val.$children[1].wsStatus = ''
          val.$children[1].imgUrl = ''
        } else if (val.label === '音视频资源目录') {
          val.$children[0].queryList.platformId = ''
          val.$children[0].carValue = ''
          val.$children[1].prValue = ''
          val.$children[1].carInfo = {}
          val.$children[1].desc = ''
          val.$children[1].wsStatus = ''
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
