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
    faultData: {
      type: Object
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    faultData: {
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
    setOptions({ owersName, faultName, faultNumber } = {}) {
      this.chart.setOption({
        title: {
          show: true,
          text: '故障报警类型分布(' + owersName + ')',
          textStyle: {
            color: '#404040',
            fontWeight: 'bold',
            fontSize: 18
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          x: 'right',
          top: 30,
          data: faultName
        },
        calculable: true,
        series: [
          {
            name: '',
            type: 'pie',
            radius: [80, 120],
            center: ['50%', '60%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: 'center'
              },
              emphasis: {
                show: true,
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
            data: faultNumber,
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
      })
    },
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.faultData)
    }
  }
}
</script>
