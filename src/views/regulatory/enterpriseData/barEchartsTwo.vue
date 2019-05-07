<template>
  <div class="chart" style="height: 500px;"></div>
</template>

<script>
  import echarts from 'echarts'
  require('echarts/theme/macarons') // echarts theme
  import { debounce } from '@/utils'

  export default {
    props: {
      echDataTwo: {
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
      window.removeEventListener('resize', this.__resizeHanlder)
      this.chart.dispose()
      this.chart = null
    },
    methods: {
      initChart() {
        this.chart = echarts.init(this.$el, 'macarons')

        this.chart.setOption({
          color: ['#A57DFA', '#52DEC3', '#4DB3FE', '#6387D2', '#6184D5'],
          title: {
            show: true,
            text: '车辆类型入网变化趋势',
            textStyle: {
              fontFamily: 'Arial, Verdana, sans...',
              color: '#333',
              fontWeight: 'normal'
            }
          },
          xAxis: [
            {
              type: 'category',
              data: ['10月1日', '10月2日', '10月3日', '10月4日', '10月5日']
            }
          ],
          legend: {
            data: ['所有车辆', '入网车辆', '上线车辆', '入网率', '上线率']
          },
          yAxis: [
            {
              type: 'value',
              name: '车辆数',
              min: 0,
              max: 500,
              interval: 30,
              axisLabel: {
                formatter: '{value}'
              }
            },
            {
              type: 'value',
              name: '百分比',
              min: 0,
              max: 100,
              interval: 20,
              axisLabel: {
                formatter: '{value} %'
              }
            }
          ],
          series: [
            {
              name: '所有车辆',
              type: 'bar',
              barGap: 0,
              data: [320, 332, 301, 334, 390]
            },
            {
              name: '入网车辆',
              type: 'bar',
              data: [220, 182, 191, 234, 290]
            },
            {
              name: '上线车辆',
              type: 'bar',
              data: [150, 232, 201, 154, 190]
            },
            {
              name: '入网率',
              type: 'line',
              yAxisIndex: 1,
              data: [15, 85, 66, 72, 92]
            },
            {
              name: '上线率',
              type: 'line',
              yAxisIndex: 1,
              data: [20, 30, 60, 80, 92]
            }
          ]
        })
      }
    }
  }
</script>
