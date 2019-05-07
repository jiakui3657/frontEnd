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
    this.__resizeHanlder = debounce(() => {
      if (this.chart) {
        this.chart.resize()
      }
    }, 100)
    window.addEventListener('resize', this.__resizeHanlder)
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    // window.removeEventListener('resize', this.__resizeHanlder)
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
    setOptions({ alarmName, count, number } = {}) {
      this.chart.setOption({
        title: {
          show: true,
          text: '主动安全设备安装统计图',
          textStyle: {
            color: '#404040',
            fontWeight: 'bold',
            fontSize: 16
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          x: 'right',
          data: alarmName
        },
        calculable: true,
        series: [
          {
            name: '',
            type: 'pie',
            radius: [70, 120],
            avoidLabelOverlap: false,
            label: {
              // normal: {
              //   show: false,
              //   position: 'center'
              // },
              normal: {
                show: true,
                position: 'center',
                formatter: function(argument) {
                  // var a = '123'
                  var html
                  html = '车辆总数\r\n\r\n' + number
                  return html
                },
                textStyle: {
                  fontSize: 15,
                  color: '#39CCCC'
                }
              },
              emphasis: {
                // show: true,
                show: false,
                textStyle: {
                  fontSize: '20',
                  fontWeight: 'bold',
                  color: '#404040'
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: count,
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
      })
    },
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
      // window.onresize = this.chart.resize
    }
  }
}
</script>
