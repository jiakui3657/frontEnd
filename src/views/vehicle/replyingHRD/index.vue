<template>
  <div>
    <el-container style="min-height: calc(100vh - 95px);">
      <el-main style="padding:0;">
        <baidu-map class="map" :center="startPoint" :zoom="13" :scroll-wheel-zoom="true">
          <bml-marker-clusterer :averageCenter="true">
            <bm-marker v-for="marker of markers" :key="marker.lng" :position="{lng: marker.lng, lat: marker.lat}" :icon="{url: require('../../../assets/reply/start.png'), size: {width: 38, height: 48}}"></bm-marker>
          </bml-marker-clusterer>
          <bml-marker-clusterer :averageCenter="true">
            <bm-marker v-for="marker of endmarkers" :key="marker.lng" :position="{lng: marker.lng, lat: marker.lat}" :icon="{url: require('../../../assets/reply/end.png'), size: {width: 38, height: 48}}"></bm-marker>
          </bml-marker-clusterer>
          <bm-polyline :path="path" stroke-color="blue" :stroke-opacity="0.5" :stroke-weight="0" :editing="false"></bm-polyline>
          <bml-lushu
            @start="start"
            @stop="reset"
            :path="path"
            :icon="icon"
            :speed="speed"
            :play="play"
            :infoWindow="true"
            :autoView="true"
            :content="contentInfo"
            :rotation="false">
          </bml-lushu>
        </baidu-map>
      </el-main>
    </el-container>
    <search-box ref="searchContent" @searchDatas="getDatas" @isrePlay="getRePlay" @isPause="getPause" @isStop="getStop" @speed="getSpeed" :searchStatus="searchLoad" :message="rtCar" :closeLoad="closeLoading"></search-box>
    <!-- <div class="pointBox">
      <ul>
        <li tabindex="1"><img src="../../../assets/realtime/line.png" alt=""><span>轨迹点</span></li>
        <li tabindex="2"><img src="../../../assets/realtime/ringBal.png" alt=""><span>报警点</span></li>
        <li tabindex="3"><img src="../../../assets/realtime/lineCharts.png" alt=""><span>曲线图</span></li>
      </ul>
    </div> -->
    <transition name="fade">
      <source-table ref="sorTable" v-show="isShowTable" :tableData='tableData'></source-table>
    </transition>
    <div @click="tableBtnClick" icon="el-icon-arrow-down" class="tableBtn" >
      <img class="dropDown" src="../../../assets/realtime/dropDown.png">
    </div>
    <!-- <footer-box></footer-box> -->
  </div>
</template>

<script>
  import footerBox from './footerBox'
  import searchBox from './searchBox'
  import sourceTable from './sourceTable'
  import { BmlLushu } from 'vue-baidu-map'
  import { BmlMarkerClusterer } from 'vue-baidu-map'
  export default {
    components: {
      footerBox,
      searchBox,
      sourceTable,
      BmlLushu,
      BmlMarkerClusterer
    },
    data() {
      return {
        address: null,
        speed: 100,
        markers: [],
        endmarkers: [],
        websocket: '',
        startPoint: '西安',
        endPoint: '西安',
        closeLoading: 0, // 控制子组件加载动效
        searchLoad: false,
        searchStatus: false,
        play: false,
        pause: false,
        path: [],
        icon: {
          url: require('../../../assets/reply/reply_car_1.png'),
          size: { width: 55, height: 56 },
          opts: { anchor: { width: 27, height: 13 }}
        },
        contentInfo: '1',
        // isShowTable: true,
        isShowTable: false,
        defaultProps: {
          children: 'children',
          label: 'text'
        },
        tableDataTmp: [],
        plineData: [],
        tableData: [],
        lastColor: null,
        rtCar: {}
      }
    },
    methods: {
      getSpeed(val) { // 回放速度
        this.speed = val
      },
      // 轨迹点数据
      getDatas(data) {
        try {
          if (this.closeLoading === 0) {
            this.closeLoading = 1
            this.tableData = []
            this.tableDataTmp = []
            this.plineData = []
            this.path = []
            this.dataIndex = 0
            this.dataPage = 0
          }
          const val = data.TrackItems
          this.isShowTable = true
          if (data) {
            document.getElementsByClassName('tableBtn')[0].style.transition = 'all .3s ease'
            document.getElementsByClassName('dropDown')[0].style.transition = 'all .3s ease'
            document.getElementsByClassName('tableBtn')[0].style.bottom = '230px'
            document.getElementsByClassName('dropDown')[0].style.transform = 'rotate(0deg)'
          }
          this.play = false
          const self = this
          if (val && val.length > 0) {
            val.forEach(item => {
              self.tableDataTmp.push({ dataTime: item.DataTime, longitude: item.PosData.Longitude, latitude: item.PosData.Latitude, currentSpeed: item.OvrallData.CurrentSpeed, currentMileage: item.OvrallData.CurrentMileage, address: item.address })
            })
          }
          console.log('tableData size:' + this.tableDataTmp.length + ' ; IsLast:' + data.IsLast)
          if (data.IsLast) { // 最后一批轨迹，绘制线路
            // 为了提高效应速度，后台轨迹数据是批次返回，而且时间不是正序的，需要对轨迹数据按时间升级排序
            console.log('draw path with ' + this.tableDataTmp.length + ' point')
            if (this.tableDataTmp && this.tableDataTmp.length > 0) {
              this.tableDataTmp.sort(function(d1, d2) {
                if (d1.dataTime < d2.dataTime) return -1
                else if (d1.dataTime > d2.dataTime) return 1
                else return 0
              })
              this.tableData = this.tableDataTmp.concat()
              console.log('==================tableData===============')
              console.log(this.tableData)
              this.$refs.searchContent.permmsion = false

              this.tableData.forEach(d => {
                // console.log('lng: ' + d.longitude + ', lat: ' + d.latitude)
                this.plineData.push({ lng: d.longitude, lat: d.latitude })
              })
              this.path = this.plineData
              this.contentInfo = this.$refs.searchContent.carValue
              this.startPoint = this.plineData[0]
              this.endPoint = this.plineData[this.plineData.length - 1]
              this.markers.push(this.startPoint)
              this.endmarkers.push(this.endPoint)
              this.closeLoading = 2 // 所有加载完成后，关闭子组件加动效
              setTimeout(() => {
                // 触发watch事件
                self.closeLoading = 0
                self.tableDataTmp = []
              }, 500)
            }
          }
        } catch (error) {
          console.log(error)
        } finally {
          // console.log('----finally-----')
          // console.log('----isLast -> ' + data.IsLast + ' ; closeLoading -> ' + this.closeLoading)
          if (data.IsLast) {
            // console.log('----------this.tableData----------')
            // console.log(this.tableData.length)
            if (this.tableData && this.tableData.length > 0) {
              this.searchLoad = true
            } else {
              this.searchLoad = false
            }
            const self = this
            self.closeLoading = 2 // 所有加载完成后，关闭子组件加动效
            setTimeout(() => {
              // 触发watch事件
              self.closeLoading = 0
              self.tableDataTmp = []
            }, 500)
          }
        }
      },
      start(v) {
      },
      reset() {
        this.play = false
      },
      getRePlay(val) {
        this.play = val
        this.path = []
        if (this.plineData) {
          this.path = this.plineData
        }
      },
      getPause(val) {
        this.play = val
      },
      getStop(val) {
        this.path = []
        this.startPoint = ''
        this.endPoint = ''
        this.markers = []
        this.endmarkers = []
        this.plineData = []
        this.contentInfo = ''
        this.tableData = []
      },
      tableBtnClick() {
        this.isShowTable = !this.isShowTable
        document.getElementsByClassName('tableBtn')[0].style.transition = 'all .5s ease'
        if (this.isShowTable) {
          document.getElementsByClassName('tableBtn')[0].style.bottom = '230px'
          document.getElementsByClassName('dropDown')[0].style.transform = 'rotate(0deg)'
        } else {
          document.getElementsByClassName('tableBtn')[0].style.bottom = '0px'
          document.getElementsByClassName('dropDown')[0].style.transform = 'rotate(180deg)'
        }
      }
    },
    mounted() {
      this.rtCar = this.$route.params
    }
  }
</script>

<style>
  .leftBox {
    background-color: rgb(238, 241, 246);
    position: absolute;
    top: 0;
    left: 0;
    overflow:auto
  }
  .map {
    width: 100%;
    height: 100%;
    overflow: hidden;
    margin:0;
  }
  .tableBtn {
    position: absolute;
    /*bottom:230px;*/
    bottom:0px;
    left:50%;
    width:71px;
    height:27px;
    background:#5F7ABF;
    border-radius:10px 10px 0px 0px;
    cursor: pointer;
  }
  .tableBtn .dropDown {
    margin: 7px 0 0 22px;
    transform:rotate(180deg)
  }
  .anchorBL{
    display:none;
  }
  .fade-enter-active, .fade-leave-active {
    transition: all .5s ease;
  }
  .fade-leave-to,.fade-enter{
    bottom: -200px
  }
  .fade-leave,.fade-enter-to{
    bottom: 0
  }
  .element.style {
    transition: all 0.5s ease 0s;
    bottom: 5px;
  }
</style>
