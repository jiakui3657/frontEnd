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
    accidentData: {
      type: Object
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    accidentData: {
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
    setOptions({ owersName, platformDate, accidentAlarmChart, accidentAlarmProcessedChart, accidentAlarmRateChart } = {}) {
      this.chart.setOption({
        /* 柱状图颜色 */
        color: ['#5780D5', '#b3b3b3', '#5780D5'],
        title: {
          show: true,
          text: '事故报警趋势分析(' + owersName + ')',
          textStyle: {
            color: '#404040',
            fontWeight: 'bold',
            fontSize: 18
          }
        },
        /* 鼠标悬浮显示数据 */
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        /* 四周边距(单位默认px，可以使用百分比) */
        grid: {
          top: 60,
          left: 10,
          right: 10,
          bottom: 20,
          containLabel: true
        },
        legend: {
          left: 'right',
          data: ['已处理', '报警总数', '处理率']
        },
        xAxis: [
          {
            type: 'category',
            data: platformDate,
            axisTick: {
              show: false
            },
            splitLine: {
              show: true
            }
          },
          {
            type: 'category',
            axisLine: { show: false },
            axisTick: { show: false },
            axisLabel: { show: false },
            splitArea: { show: false },
            splitLine: { show: false },
            data: platformDate
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '报警数'
          },
          {
            type: 'value',
            name: '报警处理率',
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
            name: '已处理',
            type: 'bar',
            data: accidentAlarmProcessedChart
          },
          {
            name: '报警总数',
            type: 'bar',
            barGap: '-100%',
            data: accidentAlarmChart
          },
          {
            name: '处理率',
            type: 'line',
            yAxisIndex: 1,
            data: accidentAlarmRateChart
          }
        ],
        animationDuration: animationDuration
      })
    },
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.accidentData)
    }
  }
}
</script>
