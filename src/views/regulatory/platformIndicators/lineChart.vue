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
    setOptions({ date, trendScore } = {}) {
      this.chart.setOption({
        title: {
          show: true,
          text: '平台考核趋势',
          textStyle: {
            color: '#404040',
            fontWeight: 'bold',
            fontSize: 18
          }
        },
        xAxis: {
          data: date,
          boundaryGap: false,
          axisTick: {
            show: false
          },
          splitLine: {
            show: true
          }
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
            name: '平台考核趋势',
            smooth: true,
            type: 'line',
            symbolSize: 10,
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0, color: '#CEC9FF' // 0% 处的颜色
                }, {
                  offset: 0.5, color: '#CDE0FF' // 100% 处的颜色
                }, {
                  offset: 1, color: '#CBEFFF' // 100% 处的颜色
                }]),
                lineStyle: {
                  color: '#1879FC',
                  width: 2
                },
                areaStyle: {
                  normal: {}
                }
              }
            },
            data: trendScore,
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
