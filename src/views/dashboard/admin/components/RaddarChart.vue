<template>
  <div :class="className" :style="{height:height,width:width}"></div>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import { debounce } from '@/utils'

const animationDuration = 3000

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
    setOptions({ rate, unDone, counts, done, alarmName } = {}) {
      this.chart.setOption({
        title: {
          show: true,
          text: '主动安全报警今日统计',
          textStyle: {
            color: '#404040',
            fontWeight: 'bold',
            fontSize: 16
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top: 60,
          left: 10,
          right: 10,
          bottom: 20,
          containLabel: true
        },
        legend: {
          left: 'right',
          data: ['报警处理率', '所有报警', '已处理']
        },
        xAxis: [
          {
            type: 'category',
            data: alarmName,
            axisLabel: {
              interval: 0,
              rotate: 20
            },
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '(次数)',
            axisLabel: {
              formatter: '{value} 次'
            }
          },
          {
            type: 'value',
            axisLabel: {
              formatter: '{value} %'
            }
          }
        ],
        series: [
          {
            name: '所有报警',
            type: 'bar',
            barGap: '-100%',
            barWidth: 20,
            itemStyle: {
              normal: {
                color: '#35CCA9',
                barBorderRadius: [5, 5, 0, 0]
              }
            },
            data: counts
          },

          {
            name: '已处理',
            type: 'bar',
            barWidth: 20,
            itemStyle: {
              normal: {
                color: '#97C0F6',
                barBorderRadius: [5, 5, 0, 0]
              }
            },
            data: done
          },
          // {
          //   name: '未处理',
          //   type: 'bar',
          //   barGap: '10%',
          //   itemStyle: {
          //     normal: {
          //       color: '#35CCA9',
          //       barBorderRadius: [5, 5, 0, 0]
          //     }
          //   },
          //   data: unDone
          // },
          {
            name: '报警处理率',
            smooth: false,
            type: 'line',
            yAxisIndex: 1,
            symbol: 'circle',
            symbolSize: 10,
            itemStyle: {
              normal: {
                color: '#FCA12C',
                lineStyle: {
                  color: '#FCA12C'
                }
              }
            },
            data: rate
          }
        ],
        animationDuration: animationDuration
      })
    },
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
      // window.onresize = this.chart.resize // 表格自适应屏幕宽度
    }
  }
}
</script>
