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
    controlData: {
      type: Object
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    controlData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
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
    window.removeEventListener('resize', this.__resizeHanlder)
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    setOptions({ owersName, days, onlineRate, networkRate, onine, network, carnum } = {}) {
      this.chart.setOption({
        color: ['#A57DFA', '#52DEC3', '#4DB3FE', '#6387D2', '#6184D5'],
        title: {
          show: true,
          text: '企业运行变化趋势(' + owersName + ')',
          textStyle: {
            color: '#404040',
            fontWeight: 'bold',
            fontSize: 18
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
          data: ['所有车辆', '入网车辆', '上线车辆', '入网率', '上线率']
        },
        xAxis: [
          {
            type: 'category',
            data: days,
            axisLabel: {
              interval: 0
            },
            axisPointer: {
              type: 'shadow'
            }
          },
          {
            type: 'category',
            axisLine: { show: false },
            axisTick: { show: false },
            axisLabel: { show: false },
            splitArea: { show: false },
            splitLine: { show: false },
            data: days
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '车辆数'
          },
          {
            type: 'value',
            name: '百分比',
            axisLabel: {
              formatter: '{value} %'
            },
            splitLine: {
              show: false
            },
            splitArea: {
              show: false
            }
          }
        ],
        series: [
          {
            name: '所有车辆',
            type: 'bar',
            barGap: '-100%',
            barWidth: 30,
            data: carnum
          },
          {
            name: '入网车辆',
            type: 'bar',
            barWidth: 30,
            data: network
          },
          {
            name: '上线车辆',
            type: 'bar',
            barWidth: 30,
            data: onine
          },
          {
            name: '入网率',
            type: 'line',
            yAxisIndex: 1,
            data: networkRate
          },
          {
            name: '上线率',
            type: 'line',
            yAxisIndex: 1,
            data: onlineRate
          }
        ],
        animationDuration: animationDuration
      })
    },
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.controlData)
    }
  }
}
</script>
