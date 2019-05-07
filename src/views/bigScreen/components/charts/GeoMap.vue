<template>
  <div class="geo-map-container">
    <div class="geo-map">
      <v-echarts
        :options="options"
        ref="mapRef"
      ></v-echarts>
    </div>
    <div class="legend">
      <div class="online">所有车辆数</div>
      <div class="alarm">在线车辆数</div>
    </div>
  </div>
</template>

<script>
import VEcharts from './VEcharts.vue'
import ScaleMixin from './ScaleMixin'
import IntervalMixin from '../IntervalMixin'
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/scatter'

import axios from 'axios'
import request from '@/utils/request'

const scatterSymbol = 'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAE8AAAAcCAYAAAAgLuLfAAAAAXNSR0IArs4c6QAAAnRJREFUaAXtmTFrFFEQx2fm7S5JSNRgI4EQq2ApSBBTJZU2fgMRCzs/QwpJCstABCGkUkEhkkJRK8mpRSpFxCKkEgQPId5Fwpk73J1x3mrCO6Nyr8i9Ld7juJ2dnbuZ/b15y/L+OPW8ccUQXRWQCyAiEHig5m+lGZz+tg1Lz1ZgovHFQDpQBC7LTY/KaQMM3E0MyjURngKkYTcipI2iCO002iNanMHntBsHwnlgoUR7bRoIB0G4OyDoWcVgHWKBx9Q1TYhYaBseuhwd/yNQ8ipID/qxSyMOPwIo5PeDGO0SiPBcGp52hOcJzA2P8FwannaE5wnMDY/wXBqedoTnCcwNj/BcGp52hOcJzA2P8FwannaE5wnMDY/wXBqedoTnCcwNj/BcGp52hOcJzA1XeGJcR7R7JCBiEgRsA9FQKJ2g3JO1O9m97GaXekaPN3f0Ye1EBZb7wsWMAI6pLIR6D+X9HH1um8FKPWI04Qkkon/rKFYI0nCRpn7nv1Uh+weBBtcVVS3RzeSbSPKYmc8gM2kX9k0J0gkrtJkyVTxVjeLLYMwI8J8qYwlOdRZ+BUJPVaxqKbEwjxqxcp4O4U2QgbfJxqXjDT19MbMuL3e33uDI5Lk+dl5ZCux2tlcNmk8ofB3InPzlVUKktYpop8EaMC7AaGcTtsb6Xt9+PTD5uYSHy8s/rC/Zv1CbRVtkqFE/u968le0VTSC+AWk2rkI8aA9+hzx/ANnQAq4ufgxV3EHe2oFVGpV5VXk3O7rTNvltfXTM69L9oEu53knTO9DcmcOHFQDXza1a8Gw17y+eaiWcPioE7uUIT77S4Aq+Xqv/pe5KuH4C7r+62nB1tjMAAAAASUVORK5CYII='

const mapNameFileMap = {
  北京: 'beijing',
  天津: 'tianjin',
  河北: 'hebei',
  山西: 'shanxi',
  内蒙古: 'neimenggu',
  辽宁: 'liaoning',
  吉林: 'jilin',
  黑龙江: 'heilongjiang',
  上海: 'shanghai',
  江苏: 'jiangsu',
  浙江: 'zhejiang',
  安徽: 'anhui',
  福建: 'fujian',
  江西: 'jiangxi',
  山东: 'shandong',
  河南: 'henan',
  湖北: 'hubei',
  湖南: 'hunan',
  广东: 'guangdong',
  广西: 'guangxi',
  海南: 'hainan',
  重庆: 'chongqing',
  四川: 'sichuan',
  贵州: 'guizhou',
  云南: 'yunnan',
  西藏: 'xizang',
  陕西: 'shanxi1',
  甘肃: 'gansu',
  青海: 'qinghai',
  宁夏: 'ningxia',
  新疆: 'xinjiang',
  台湾: 'taiwan',
  香港: 'xianggang',
  澳门: 'aomen'
}

export default {
  name: 'geo-map',
  mixins: [ScaleMixin, IntervalMixin],
  data() {
    return {
      intervalMethod: this.scroll,
      timeoutID: null,
      map: {
        province: null
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.mapRef.chart.on('click', e => {
        const province = e.componentType === 'geo' ? e.name : e.value[4]
        this.map.province = mapNameFileMap[province] ? province : null
        if (this.intervalID) {
          window.clearInterval(this.intervalID)
          this.intervalID = null
        }
        if (this.timeoutID) {
          window.clearTimeout(this.timeoutID)
          this.timeoutID = null
        }
        this.timeoutID = window.setTimeout(() => {
          this.intervalID = window.setInterval(this.intervalMethod, this.intervalDelay)
        }, 30000)
      })
    })
  },
  watch: {
    'map.province'() {
      this.query()
    }
  },
  methods: {
    initMap(mapFile) {
      const map = echarts.getMap(mapFile)
      if (map) {
        return Promise.resolve(map.geoJson)
      } else {
        return axios.get(`/static/echarts/map/json/${mapFile}.json`).then(chinaJsonResp => {
          echarts.registerMap(mapFile, chinaJsonResp.data)
          return chinaJsonResp.data
        })
      }
    },
    query() {
      const mapFile = this.map.province ? `province/${mapNameFileMap[this.map.province]}` : 'china'
      this.initMap(mapFile).then(mapJson => {
        request({
          url: '/bigScreen/mapNum',
          params: { provinceShort: this.map.province }
        }).then(resp => {
          // if (mapFile === 'china') {
          //   resp.data[26].onLineNum = 1998
          //   resp.data[26].sumNum = 123
          //   resp.data[27].onLineNum = 90
          //   resp.data[27].sumNum = 3
          //   resp.data[22].onLineNum = 587
          //   resp.data[22].sumNum = 11
          // } else if (mapFile === 'province/shanxi1') {
          //   resp.data[0].onLineNum = 110
          //   resp.data[0].sumNum = 61
          //   resp.data[1].onLineNum = 80
          //   resp.data[1].sumNum = 12
          //   resp.data[5].onLineNum = 90
          //   resp.data[5].sumNum = 21
          // }

          const rich = {
            color: '#fff',
            align: 'center',
            width: 40 * this.scale,
            height: 28 * this.scale,
            fontWeight: 'bold',
            fontSize: 12 * this.scale
          }
          this.options = {
            geo: {
              map: mapFile,
              top: 21 * this.scale,
              bottom: 33 * this.scale,
              label: {
                normal: {
                  show: true,
                  color: '#AA7014',
                  fontWeight: '400',
                  fontFamily: 'MicrosoftYaHei',
                  fontSize: 12 * this.scale
                },
                emphasis: {
                  color: '#ffffff'
                }
              },
              itemStyle: {
                normal: {
                  areaColor: '#000945',
                  borderColor: '#0438a5'
                },
                emphasis: {
                  areaColor: '#0438a5'
                }
              }
            },
            series: [
              {
                type: 'scatter',
                coordinateSystem: 'geo',
                symbol: scatterSymbol,
                symbolSize: [79 * this.scale, 28 * this.scale],
                symbolOffset: [0, -20 * this.scale],
                label: {
                  normal: {
                    show: true,
                    formatter: ({ value }) => `{a|${value[2]}}{b|${value[3]}}`,
                    color: '#fff',
                    fontWeight: 'bold',
                    padding: [0, 0, 4 * this.scale, 0],
                    rich: {
                      a: rich,
                      b: rich
                    }
                  }
                },
                data: resp.data.filter(item => item.onLineNum > 0 || item.sumNum > 0).map(item => {
                  const cp = mapJson.features.find(f => f.id === String(item.area)).properties.cp
                  return [...cp, item.onLineNum, item.sumNum, item[!this.map.province ? 'province_short' : 'city_short']]
                })
              }
            ]
          }
        })
      })
    },
    scroll() {
      this.map.province = this.map.province ? null : '陕西'
    }
  },
  components: {
    VEcharts
  }
}
</script>

<style lang="scss" scoped>
.geo-map-container {
  position: relative;
  height: 100%;
  .geo-map {
    height: 5.78rem;
  }
  .legend {
    position: absolute;
    display: flex;
    top: 0.15rem;
    left: 0.13rem;
    color: #ffffff;
    font: 400 0.14rem MicrosoftYaHei;
    div {
      width: 0.92rem;
      height: 0.3rem;
      line-height: 0.3rem;
      text-align: center;
      &.online {
        background-color: #0099cc;
      }
      &.alarm {
        background-color: #ff576c;
      }
    }
  }
}
</style>
