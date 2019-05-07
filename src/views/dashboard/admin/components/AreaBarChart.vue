<template>
  <div :class="className" :style="{height:height,width:width}"></div>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import { debounce } from '@/utils'

const animationDuration = 6000

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
    setOptions({ name, allCar, inCar, online, user, installCar } = {}) {
      this.chart.setOption({
        title: {
          show: true,
          text: '辖区基本信息统计',
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
        legend: {
          left: 'right',
          data: ['所有车辆', '入网车辆', '在线车辆', '从业人员', '已安装车辆']
        },
        grid: {
          top: 40,
          left: 10,
          right: 10,
          bottom: 20,
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: name,
          axisLabel: {
            interval: 0,
            rotate: 0
          },
          axisTick: {
            alignWithLabel: true
          }
        }],
        yAxis: [{
          type: 'value',
          axisTick: {
            show: false
          }
        }],
        series: [
          {
            name: '所有车辆',
            type: 'bar',
            // barGap: '-100%',
            barWidth: 10,
            data: allCar,
            itemStyle: {
              normal: {
                barBorderRadius: [5, 5, 0, 0],
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0, color: '#27DDAA' // 0% 处的颜色
                }, {
                  offset: 0.5, color: '#33CFA8' // 100% 处的颜色
                }, {
                  offset: 1, color: '#3CC1A6' // 100% 处的颜色
                }])
              }
            },
            animationDuration
          },
          {
            name: '入网车辆',
            type: 'bar',
            barWidth: 10,
            data: inCar,
            itemStyle: {
              normal: {
                barBorderRadius: [5, 5, 0, 0],
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0, color: '#B8DDFA' // 0% 处的颜色
                }, {
                  offset: 0.5, color: '#A8CFFA' // 100% 处的颜色
                }, {
                  offset: 1, color: '#9BC3F7' // 100% 处的颜色
                }])
              }
            },
            animationDuration
          },
          {
            name: '在线车辆',
            type: 'bar',
            barWidth: 10,
            data: online,
            itemStyle: {
              normal: {
                barBorderRadius: [5, 5, 0, 0],
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0, color: '#A695FD' // 0% 处的颜色
                }, {
                  offset: 0.5, color: '#8589F7' // 100% 处的颜色
                }, {
                  offset: 1, color: '#6D81F2' // 100% 处的颜色
                }])
              }
            },
            animationDuration
          },
          {
            name: '从业人员',
            type: 'bar',
            barWidth: 10,
            data: user,
            itemStyle: {
              normal: {
                barBorderRadius: [5, 5, 0, 0],
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0, color: '#ff547a' // 0% 处的颜色
                }, {
                  offset: 0.5, color: '#ff85a4' // 100% 处的颜色
                }, {
                  offset: 1, color: '#ff85a4' // 100% 处的颜色
                }])
              }
            },
            animationDuration
          },
          {
            name: '已安装车辆',
            type: 'bar',
            barWidth: 10,
            data: installCar,
            itemStyle: {
              normal: {
                barBorderRadius: [5, 5, 0, 0],
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0, color: '#ffac36' // 0% 处的颜色
                }, {
                  offset: 0.5, color: '#ffd57d' // 100% 处的颜色
                }, {
                  offset: 1, color: '#ffd57d' // 100% 处的颜色
                }])
              }
            },
            animationDuration
          }
        ],
        label: {
          normal: {
            show: false,
            position: 'top'
          }
        }
      })
    },
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
    }
  }
}
</script>
