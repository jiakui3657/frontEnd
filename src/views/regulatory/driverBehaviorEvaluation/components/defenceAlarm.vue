<template>
  <div :class="className" :style="{height:height,width:width}"></div>
</template>
<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import { debounce } from '@/utils'

export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object
    }
  },
  data() {
    return {
      chart: null
    }
  },
  // created() {
  //   console.log(this.chartData)
  // },
  mounted() {
    this.initChart()
    if (this.autoResize) {
      this.__resizeHanlder = debounce(() => {
        if (this.chart) {
          this.chart.resize()
        }
      }, 100)
      // window.addEventListener('resize', this.__resizeHanlder)
    }

    // 监听侧边栏的变化
    // const sidebarElm = document.getElementsByClassName('sidebar-container')[0]
    // sidebarElm.addEventListener('transitionend', this.__resizeHanlder)
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    if (this.autoResize) {
      // window.removeEventListener('resize', this.__resizeHanlder)
    }

    // const sidebarElm = document.getElementsByClassName('sidebar-container')[0]
    // sidebarElm.removeEventListener('transitionend', this.__resizeHanlder)

    this.chart.dispose()
    this.chart = null
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },
  methods: {
    setOptions({ expectedData, actualData } = {}) {
      this.chart.setOption({
        title: {
          show: true,
          text: '驾驶员防控报警趋势',
          textStyle: {
            color: '#404040',
            fontWeight: 'bold',
            fontSize: 18
          }
        },
        xAxis: {
          data: expectedData,
          boundaryGap: false,
          axisTick: {
            show: false
          },
          splitLine: {
            show: true
          }
          // ,
          // axisLabel: {
          //   interval: 0
          // }
        },
        grid: {
          left: '10%',
          bottom: '10%'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: false
          },
          splitLine: {
            show: true
          }
        },
        series: [
          {
            name: '报警数量',
            smooth: true,
            type: 'line',
            symbolSize: 10,
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0, color: '#226CE1' // 0% 处的颜色
                }, {
                  offset: 0.5, color: '#4791F1' // 100% 处的颜色
                }, {
                  offset: 1, color: '#8BB7F5' // 100% 处的颜色
                }]),
                lineStyle: {
                  color: '#226CE1',
                  width: 2
                },
                areaStyle: {
                  normal: {}
                }
              }
            },
            data: actualData,
            animationDuration: 2800,
            animationEasing: 'quadraticOut'
          }
        ]
      })
    },
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
    }
  }
}
</script>
