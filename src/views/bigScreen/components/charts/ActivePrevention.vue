<template>
  <v-echarts
    :options="options"
    ref="vEcharts"
  ></v-echarts>
</template>

<script>
import VEcharts from './VEcharts.vue'
import 'echarts/lib/chart/pie'

import ScaleMixin from './ScaleMixin'
import IntervalMixin from '../IntervalMixin'

import request from '@/utils/request'

const itemStyleMap = {
  '前向碰撞报警': { normal: { color: '#A3C972' }},
  '分神驾驶报警': { normal: { color: '#C3D0E7' }},
  '车道偏离报警': { normal: { color: '#FFE24B' }},
  '接打电话报警': { normal: { color: '#28CEAB' }},
  '车距过近报警': { normal: { color: '#FF5E78' }},
  '抽烟报警': { normal: { color: '#C9A2EE' }},
  '疲劳驾驶报警': { normal: { color: '#895DDF' }},
  '驾驶人异常报警': { normal: { color: '#FF9E43' }}
}
// const itemStyleMap = {
//   '前向碰撞报警': { normal: { color: '#A3C972' }},
//   '分神驾驶报警': { normal: { color: '#C9A2EE' }},
//   '车道偏离报警': { normal: { color: '#FFE24B' }},
//   '接打电话报警': { normal: { color: '#95CF9D' }},
//   '车距过近报警': { normal: { color: '#F8A26A' }},
//   '抽烟报警': { normal: { color: '#C9A2EE' }},
//   '疲劳驾驶报警': { normal: { color: '#895DDF' }},
//   '驾驶人异常报警': { normal: { color: '#FF9E43' }}
// }

function labelOf(scale, show) {
  return {
    normal: {
      show,
      position: 'center',
      formatter: ({ name, value }) => `{a|${value}}\n{b|${name.slice(0, -2)}}`,
      textStyle: {
        fontSize: 19 * scale,
        fontWeight: 300
      },
      rich: {
        a: {
          height: 38 * scale,
          color: '#ffffff',
          fontSize: 19 * scale,
          fontWeight: 300
        }
      }
    },
    emphasis: {
      show: true,
      color: '#ffffff'
    }
  }
}

export default {
  name: 'active-prevention',
  mixins: [ScaleMixin, IntervalMixin],
  data() {
    return {
      items: [],
      selected: 0,
      intervalMethod: this.scroll
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.vEcharts.chart.on('mouseover', () => {
        if (!this.intervalID) return

        window.clearInterval(this.intervalID)
        this.intervalID = null
        this.$refs.vEcharts.chart.dispatchAction({
          type: 'downplay',
          dataIndex: this.selected
        })
      })
      this.$refs.vEcharts.chart.on('mouseout', () => {
        this.scroll()
        this.intervalID = window.setInterval(this.intervalMethod, this.intervalDelay)
      })
    })
  },
  methods: {
    query() {
      request({
        url: '/bigScreen/annularNum'
      }).then(resp => {
        this.items = resp.data
        this.selected = 0
        this.updateOptions()
        this.$nextTick(() => {
          this.highlightSelected()
        })
      })
    },
    updateOptions() {
      this.options = {
        legend: {
          top: 52 * this.scale,
          left: 20 * this.scale,
          width: 215 * this.scale,
          textStyle: {
            color: '#ffffff',
            fontSize: 12 * this.scale
          },
          itemGap: 22 * this.scale,
          itemWidth: 8 * this.scale,
          itemHeight: 8 * this.scale,
          data: this.items.map(item => item.alarmName)
        },
        series: [
          {
            type: 'pie',
            center: ['75%', '50%'],
            radius: ['55%', '80%'],
            avoidLabelOverlap: false,
            label: labelOf(this.scale, false),
            labelLine: {
              normal: {
                show: false
              }
            },
            data: this.items.map((item, idx) => (
              {
                name: item.alarmName,
                value: item.count,
                itemStyle: itemStyleMap[item.alarmName]
              }
            ))
          }
        ]
      }
    },
    highlightSelected() {
      this.$refs.vEcharts.chart.dispatchAction({
        type: 'downplay',
        dataIndex: (this.selected === 0 ? this.items.length : this.selected) - 1
      })
      this.$refs.vEcharts.chart.dispatchAction({
        type: 'highlight',
        dataIndex: this.selected
      })
    },
    scroll() {
      this.selected += 1
      if (this.selected < this.items.length) {
        this.highlightSelected()
      } else {
        this.query()
      }
    }
  },
  components: {
    VEcharts
  }
}
</script>

<style lang="scss" scoped>
.chart {
  height: 100%;
}
</style>
