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
      default: '99%'
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
    setOptions({ expectedData, actualData } = {}) {
      this.chart.setOption({
        title: {
          show: true,
          text: '企业报警处理率趋势',
          textStyle: {
            fontFamily: 'Arial, Verdana, sans...',
            color: '#404040',
            fontWeight: 'normal'
          }
        },
        xAxis: {
          data: ['8月20日', '8月21日', '8月22日', '8月23日', '8月24日', '8月25日', '8月26日'],
          boundaryGap: false,
          axisTick: {
            show: false
          },
          splitLine: {
            show: true
          }
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 30,
          containLabel: true
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
                lineStyle: {
                  color: '#1965F8',
                  width: 5
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
