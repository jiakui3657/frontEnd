<template>
  <v-echarts :options="options"></v-echarts>
</template>

<script>

import VEcharts from './VEcharts.vue'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/line'

import ScaleMixin from './ScaleMixin'
import IntervalMixin from '../IntervalMixin'
import utils from './utils'

import request from '@/utils/request'

const barsNr = 11 // 加起始列 = 11
const barsNrRange = [...Array(barsNr).keys()]

function toTime(str) {
  const [hours, minutes] = str.split(':')
  return hours * 60 * 60 + minutes * 60
}

function pad(n) {
  return n < 10 ? '0' + n : n
}

function fmtTime(time) {
  const minutesSeconds = time % (3600)
  const minutes = minutesSeconds / 60
  const hours = (time - minutesSeconds) / 3600
  return pad(hours) + ':' + pad(minutes)
}

function getMaxTime() {
  const now = new Date()
  return toTime(now.getHours() + ':' + Math.floor(now.getMinutes() / 10) * 10)
}

export default {
  name: 'line-bar-chart',
  mixins: [ScaleMixin, IntervalMixin],
  props: {
    url: {
      type: String,
      required: true
    },
    bar: {
      type: Object, // { name: String, color: String, yAxisName: String, itemStyle: {} }
      required: true
    },
    line: {
      type: Object, // { name: String, color: String, yAxisName: String }
      required: true
    }
  },
  data() {
    return {
      intervalMethod: this.scroll,
      intervalDelay: 1000,
      items: {},
      current: getMaxTime() - (barsNr - 1) * 10 * 60
    }
  },
  methods: {
    query() {
      window.clearInterval(this.intervalID)
      const offset = barsNrRange.find(idx => !this.items[this.current + idx * 10 * 60])
      const startTime = this.current + offset * 10 * 60
      request({
        url: this.url,
        params: { startTime: fmtTime(startTime), endTime: fmtTime(Math.min(getMaxTime(), startTime + 23 * 10 * 60)) }
      }).then(resp => {
        resp.data.forEach(item => {
          this.items[toTime(item.time)] = item
        })
        this.updateOptions()
        this.intervalID = window.setInterval(this.intervalMethod, this.intervalDelay)
      })
    },
    updateOptions() {
      const times = barsNrRange.map(idx => this.current + idx * 10 * 60)
      this.options = {
        grid: utils.gridOf(this.scale, { right: 60 }),
        tooltip: {
          trigger: 'axis'
        },
        legend: utils.legendOf(this.scale, [
          { name: this.bar.name, textStyle: { color: this.bar.color }, icon: 'rect' },
          { name: this.line.name, textStyle: { color: this.line.color }}
        ]),
        xAxis: [
          utils.xAxisOf(this.scale, times.map(time => fmtTime(time)))
        ],
        yAxis: [
          utils.yAxisOf(this.scale, { name: this.bar.yAxisName }),
          utils.yAxisOf(this.scale, { name: this.line.yAxisName, splitLine: { show: false }})
        ],
        series: [
          utils.series.barOf(this.scale, {
            name: this.bar.name,
            _itemStyle: this.bar.itemStyle,
            data: times.map(time => this.items[time] && this.items[time].onLineNum)
          }),
          utils.series.lineOf(this.scale, {
            _color: this.line.color,
            name: this.line.name,
            yAxisIndex: 1,
            data: times.map(time => this.items[time] && this.items[time].num)
          })
        ]
      }
    },
    scroll() {
      this.current += 10 * 60
      const maxTime = getMaxTime()
      const endTime = this.current + (barsNr - 1) * 10 * 60

      if (endTime >= maxTime) {
        if (!this.items[maxTime]) {
          // refresh data every 10 minutes
          this.items = {}
          if (endTime > maxTime) {
            this.current -= 10 * 60
          }
        } else {
          this.current = 0
        }
      }
      if (this.items[this.current] && this.items[endTime]) {
        this.updateOptions()
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
