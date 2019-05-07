<template>
  <div
    class="big-screen"
    :style="{'padding-left': paddingLeft}"
  >
    <header>
      <img src="../../assets/big_screen/header_left.png">
      <img
        src="../../assets/big_screen/header_title.png"
        class="title"
      >
      <img src="../../assets/big_screen/header_right.png">
    </header>
    <main>
      <aside class="left">
        <data-layout title="主动安全报警走势">
          <div class="chart-container">
            <alarm-trend :scale="scale"></alarm-trend>
          </div>
        </data-layout>
        <data-layout title="今日主动安全报警分布" widen>
          <div class="chart-container">
            <active-prevention :scale="scale"></active-prevention>
          </div>
        </data-layout>
        <data-layout title="在线车辆与主动安全报警数" widen>
          <div class="chart-container">
            <vehicle-prevention :scale="scale"></vehicle-prevention>
          </div>
        </data-layout>


      </aside>
      <section>
        <big-screen-summary></big-screen-summary>
        <div class="map-container">
          <geo-map :scale="scale"></geo-map>
          <div class="map-table">
            <data-layout
              title="报警处理监控中心"
              large
            >
              <auto-scroll-table
                v-bind="tables.subPtAlarm"
                :scale="scale"
              ></auto-scroll-table>
            </data-layout>
          </div>
        </div>
      </section>
      <aside class="right">

        <data-layout title="安装率统计">
          <auto-scroll-table
            v-bind="tables.platform"
            :scale="scale"
          ></auto-scroll-table>
        </data-layout>
        <data-layout title="车辆上线率">
          <auto-scroll-table
            v-bind="tables.enterprise"
            :scale="scale"
          ></auto-scroll-table>
        </data-layout>
        <data-layout title="企业里程统计">
          <auto-scroll-table
            v-bind="tables.mileage"
            :scale="scale"
          ></auto-scroll-table>
        </data-layout>

        <!-- <data-layout title="在线车辆与违规报警数" widen>
          <div class="chart-container">
            <vehicle-violation :scale="scale"></vehicle-violation>
          </div>
        </data-layout> -->
      </aside>
    </main>
  </div>
</template>

<script>
import DataLayout from './components/DataLayout.vue'
import BigScreenSummary from './components/BigScreenSummary.vue'
import AutoScrollTable from './components/AutoScrollTable.vue'

import GeoMap from './components/charts/GeoMap.vue'
import AlarmTrend from './components/charts/AlarmTrend.vue'
import ActivePrevention from './components/charts/ActivePrevention.vue'
import VehiclePrevention from './components/charts/VehiclePrevention'
import VehicleViolation from './components/charts/VehicleViolation'

function initViewport() {
  const screenWidth = window.innerWidth || document.body.clientWidth
  const screenHeight = window.innerHeight || document.body.clientHeight

  // let screenWidth = 2020
  const scale = Math.min(screenWidth / 2020, screenHeight / 1080)
  window.document.documentElement.style['font-size'] = scale * 100 + 'px'
  const paddingLeft = (screenWidth - (2020 * scale)) / 2 + 'px'
  return { scale, paddingLeft }
}

function recoverViewport() {
  window.document.documentElement.style['font-size'] = null
}

const tables = {
  platform: {
    url: '/bigScreen/installStatistics',
    headers: [
      { text: '排名', value: '_idx', width: 7.5, align: 'center' },
      { text: '地区', value: 'name', width: 10, align: 'center' },
      { text: '所有车辆', value: 'totalCount', width: 10, align: 'center' },
      { text: '安装车辆', value: 'installCount', width: 10, align: 'center' },
      { text: '安装率', value: 'installPercentage', width: 10, align: 'left', style: { color: '#23E8F4', 'font-size': '0.12rem' }}
    ]
  },
  enterprise: {
    url: '/bigScreen/onlineStatistics',
    layoutStyle: { 'margin': '-0.06rem 0.03rem 0.3px', padding: '0.06rem 0.1rem 0' },
    headers: [
      { text: '企业', value: 'name', width: 10, align: 'center' },
      { text: '所有车辆', value: 'totalCount', width: 10, align: 'center' },
      { text: '车辆启动数', value: 'onlineCount', width: 13, align: 'center' },
      { text: '上线率', value: 'onlinePercentage', width: 14.5, align: 'left', style: { color: '#23E8F4', 'font-size': '0.12rem' }}
    ]
  },
  mileage: {
    url: '/bigScreen/mileage/enterprisesummary',
    layoutStyle: { 'margin': '-0.06rem 0.03rem 0.3px', padding: '0.06rem 0.1rem 0' },
    headers: [
      // { text: '地区', value: 'areaName', width: 10, align: 'center' },
      // { text: '平台', value: 'platformName', width: 10, align: 'center' },
      { text: '企业', value: 'owersName', width: 10, align: 'center' },
      { text: '车辆数', value: 'vehicleNumber', width: 10, align: 'center' },
      { text: '行驶总里程', value: 'sumMileage', width: 13.5, align: 'center' },
      { text: '行驶总时长', value: 'timeLength', width: 13.5, align: 'left', style: { color: '#23E8F4', 'font-size': '0.12rem' }}
    ]
  },
  subPtAlarm: {
    url: '/bigScreen/xjptbjNum',
    layoutStyle: { 'margin': '-0.06rem 0.03rem 0.3px', padding: '0.06rem 0.1rem 0' },
    layoutClass: null,
    headers: [
      { text: '平台', value: 'cityName', width: 6.7, align: 'center' },
      { text: '企业', value: 'name', width: 11.7, align: 'center' },
      { text: '报警次数', value: 'bjNum', width: 11.4, align: 'center' },
      { text: '处理次数', value: 'bjclNum', width: 11.4, align: 'center' },
      { text: '督办次数', value: 'dbNum', width: 11.4, align: 'center' },
      { text: '督办处理数', value: 'dbclNum', width: 11.4, align: 'center' },
      { text: '查岗次数', value: 'cgNum', width: 11.4, align: 'center' },
      { text: '回复次数', value: 'hfNum', width: 11.4, align: 'center' }
    ],
    rows: 4
  }
}

export default {
  name: 'big-screen',
  created() {
    this.init()
    window.addEventListener('resize', this.init)
  },
  destroyed() {
    recoverViewport()
    window.removeEventListener('resize', this.init)
  },
  data() {
    return {
      scale: 1,
      paddingLeft: 0,
      tables
    }
  },
  methods: {
    init() {
      const { scale, paddingLeft } = initViewport()
      this.scale = scale
      this.paddingLeft = paddingLeft
    }
  },
  components: {
    DataLayout,
    BigScreenSummary,
    GeoMap,
    AutoScrollTable,
    AlarmTrend,
    ActivePrevention,
    VehiclePrevention,
    VehicleViolation
  }
}
</script>

<style lang="scss" scoped>
.big-screen {
  background: url(../../assets/big_screen/bg.jpg) 0% / cover no-repeat;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  line-height: 0.115;
  header {
    padding: 0.42rem 0 0.46rem 0.93rem;
    img {
      width: 5.65rem;
      display: inline-block;
      &.title {
        width: 5.13rem;
        margin: 0 0.7rem 0 0.8rem;
      }
    }
  }
  main {
    padding: 0 0.25rem 0 0.26rem;
    aside,
    section {
      display: inline-block;
    }
    aside {
      width: 4.97rem;
      vertical-align: top;
      .chart-container {
        height: 2.45rem;
        margin-top: 0.16rem;
      }
    }
    section {
      padding-top: 0.15rem;
      margin: 0 0.1rem;
      width: 8.92rem;
      vertical-align: top;
      position: relative;
      .map-container {
        position: relative;
        margin-top: 0.28rem;
        height: 7.54rem;
        & > :first-child::before,
        & > :first-child::after,
        &::before,
        &::after {
          content: "";
          position: absolute;
          width: 0.33rem;
          height: 0.33rem;
          border-color: #07bcff;
          border-style: solid;
        }
        & > :first-child::before {
          bottom: 0;
          left: 0;
          border-width: 0 0 0.03rem 0.03rem;
        }
        & > :first-child::after {
          bottom: 0;
          right: 0;
          border-width: 0 0.03rem 0.03rem 0;
        }
        &::before {
          border-width: 0.03rem 0 0 0.03rem;
        }
        &::after {
          top: 0;
          right: 0;
          border-width: 0.03rem 0.03rem 0 0;
        }
        .map-table {
          position: absolute;
          bottom: 0;
          width: 100%;
        }
      }
    }
  }
}
</style>

<style scoped>
aside >>> .data-layout {
  margin-top: 0.24rem;
}
aside >>> .data-layout:first-child {
  margin-top: 0;
}
</style>
