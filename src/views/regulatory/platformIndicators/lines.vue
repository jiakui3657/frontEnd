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
    setOptions({ normDate, connected, onlineCars, SupervisoryTreatment, reaction, alamrFixs } = {}) {
      this.chart.setOption({
        title: {
          show: true,
          text: '考核指标分析',
          textStyle: {
            color: '#404040',
            fontWeight: 'bold',
            fontSize: 18
          }
        },
        xAxis: {
          data: normDate,
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
        legend: {
          data: ['平台连通率', '车辆上线率', '督办处理率', '查岗响应率', '报警处理率'],
          x: 'right'
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
            name: '平台连通率',
            smooth: false,
            type: 'line',
            symbolSize: 10,
            itemStyle: {
              normal: {
                color: '#FFA12D',
                lineStyle: {
                  color: '#FFA12D',
                  width: 2
                }
              }
            },
            data: connected,
            animationDuration: 2800,
            animationEasing: 'quadraticOut'
          },
          {
            name: '车辆上线率',
            smooth: false,
            type: 'line',
            symbolSize: 10,
            itemStyle: {
              normal: {
                color: '#39B8ED',
                lineStyle: {
                  color: '#39B8ED',
                  width: 2
                }
              }
            },
            data: onlineCars,
            animationDuration: 2800,
            animationEasing: 'quadraticOut'
          },
          {
            name: '督办处理率',
            smooth: false,
            type: 'line',
            symbolSize: 10,
            itemStyle: {
              normal: {
                color: '#7E7AE9',
                lineStyle: {
                  color: '#7E7AE9',
                  width: 2
                }
              }
            },
            data: SupervisoryTreatment,
            animationDuration: 2800,
            animationEasing: 'quadraticOut'
          },
          {
            name: '查岗响应率',
            smooth: false,
            type: 'line',
            symbolSize: 10,
            itemStyle: {
              normal: {
                color: '#009943',
                lineStyle: {
                  color: '#009943',
                  width: 2
                }
              }
            },
            data: reaction,
            animationDuration: 2800,
            animationEasing: 'quadraticOut'
          },
          {
            name: '报警处理率',
            smooth: false,
            type: 'line',
            symbolSize: 10,
            itemStyle: {
              normal: {
                color: '#E65051',
                lineStyle: {
                  color: '#E65051',
                  width: 2
                }
              }
            },
            data: alamrFixs,
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
