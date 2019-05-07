<template>
  <v-echarts :options="options"></v-echarts>
</template>

<script>
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/line'

import VEcharts from './VEcharts.vue'
import ScaleMixin from './ScaleMixin'
import IntervalMixin from '../IntervalMixin'
import utils from './utils'

import request from '@/utils/request'

function areaStyleOf(from, to) {
  return {
    normal: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        {
          offset: 0,
          color: from
        },
        {
          offset: 1,
          color: to
        }
      ])
    }
  }
}

function fmtDate(d) {
  return d.substr(5).replace('-', '/')
}

export default {
  name: 'alarm-trend',
  mixins: [ScaleMixin, IntervalMixin],
  data() {
    return {
      intervalDelay: 1000 * 60 * 60
    }
  },
  methods: {
    query() {
      request({
        url: '/bigScreen/lineNumOne'
      }).then(resp => {
        const items = resp.data
        this.options = {
          grid: utils.gridOf(this.scale),
          tooltip: {
            trigger: 'axis'
          },
          legend: utils.legendOf(this.scale, [
            { name: '预警数', textStyle: { color: '#2DBEFF' }},
            { name: '百公里预警数', textStyle: { color: '#FF3851' }}
          ]),
          xAxis: [
            utils.xAxisOf(this.scale, items.map(item => fmtDate(item.datetime)))
          ],
          yAxis: [
            utils.yAxisOf(this.scale, { name: '(次数)                   ' })
          ],
          series: [
            utils.series.lineOf(this.scale, {
              name: '预警数',
              _color: '#2DBEFF',
              smooth: true,
              areaStyle: areaStyleOf('#2DBEFF', '#0a1735'),
              data: items.map(item => item.num)
            }),
            utils.series.lineOf(this.scale, {
              name: '百公里预警数',
              _color: '#FF3851',
              smooth: true,
              areaStyle: areaStyleOf('#FF3851', '#2f1830'),
              data: items.map(item => item.hundredNum)
            })
          ]
        }
      })
    }
  },
  components: {
    VEcharts
  }
}
</script>
