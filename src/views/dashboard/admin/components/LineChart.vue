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
        window.addEventListener('resize', this.__resizeHanlder)
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
      setOptions({ expectedData, actualData, date } = {}) {
        this.chart.setOption({
          title: {
            show: true,
            text: '主动安全报警趋势分析',
            textStyle: {
              color: '#404040',
              fontWeight: 'bold',
              fontSize: 16
            }
          },
          xAxis: {
            data: date,
            boundaryGap: false,
            axisTick: {
              show: false,
              alignWithLabel: true
            },
            axisLabel: {
              interval: 0
            }
          },
          grid: {
            left: 20,
            right: 50,
            bottom: 20,
            top: 40,
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
            }
          },
          legend: {
            left: 'right',
            data: ['主动防控报警']
          },
          series: [
            {
              name: '主动防控报警',
              smooth: true,
              type: 'line',
              symbolSize: 10,
              itemStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0, color: '#8DE3E2' // 0% 处的颜色
                  }, {
                    offset: 0.5, color: '#8CE7E2' // 100% 处的颜色
                  }, {
                    offset: 1, color: '#8BE7E2' // 100% 处的颜色
                  }]),
                  lineStyle: {
                    color: '#35CDA7',
                    width: 3
                  },
                  areaStyle: {
                    normal: {}
                  }
                }
              },
              data: expectedData,
              animationDuration: 2800,
              animationEasing: 'quadraticOut'
            }
            // {
            //   name: '百公里报警',
            //   smooth: true,
            //   type: 'line',
            //   symbolSize: 10,
            //   itemStyle: {
            //     normal: {
            //       color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            //         offset: 0, color: '#A79BFA' // 0% 处的颜色
            //       }, {
            //         offset: 0.5, color: '#B7ADFA' // 100% 处的颜色
            //       }, {
            //         offset: 1, color: '#CBC6FA' // 100% 处的颜色
            //       }]),
            //       lineStyle: {
            //         color: '#868AF6',
            //         width: 3
            //       },
            //       areaStyle: {
            //         normal: {}
            //       }
            //     }
            //   },
            //   data: actualData,
            //   animationDuration: 2800,
            //   animationEasing: 'quadraticOut'
            // }
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
