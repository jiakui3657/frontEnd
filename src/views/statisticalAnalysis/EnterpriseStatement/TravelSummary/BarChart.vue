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
    echData: {
      type: Object
    },
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
    window.removeEventListener('resize', this.__resizeHanlder)
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      console.log(this.echData)
      this.chart = echarts.init(this.$el, 'macarons')
      this.chart.setOption({
        title: {
          show: true,
          text: '企业行车统计图',
          textStyle: {
            fontFamily: 'Arial, Verdana, sans...',
            color: '#447ED9',
            fontWeight: 'normal'
          }
        },
        color: ['#63C4A8', '#818AEF'],
        tooltip: {
          trigger: 'axis',
          crossStyle: {
            color: '#999'
          }
        },
        legend: {
          left: 'right',
          data: ['行驶里程', '行驶时长']
        },
        grid: {
          top: 35,
          left: 10,
          right: 10,
          bottom: 20,
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: this.echData.xAxis,
          axisLabel: {
            interval: 0
          },
          axisTick: {
            alignWithLabel: true
          }
        }],
        yAxis: [
          {
            type: 'value',
            min: 0,
            max: 100000,
            axisLabel: {
              formatter: '{value} Km'
            }
          },
          {
            type: 'value',
            min: 0,
            max: 750,
            axisLabel: {
              formatter: '{value} h'
            }
          }
        ],
        series: [
          {
            name: '行驶里程',
            type: 'bar',
            barGap: 0,
            data: this.echData.series1,
            animationDuration
          },
          {
            name: '行驶时长',
            type: 'line',
            yAxisIndex: 1,
            data: this.echData.series2
          }
        ],
        label: {
          normal: {
            show: true,
            position: 'top'
          }
        }
      })
    }
  }
}
</script>
