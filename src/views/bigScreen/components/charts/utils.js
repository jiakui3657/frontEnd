export default {
  gridOf(scale, { top = 80, right = 0, bottom = 30, left = 70 } = {}) {
    return {
      top: top * scale,
      right: right * scale,
      bottom: bottom * scale,
      left: left * scale
    }
  },
  legendOf(scale, data) {
    return {
      top: 0,
      left: 20 * scale,
      textStyle: {
        fontSize: 14 * scale
      },
      itemWidth: 25 * scale,
      itemHeight: 14 * scale,
      data
    }
  },
  xAxisOf(scale, data) {
    return {
      type: 'category',
      axisLabel: {
        color: '#ffffff',
        fontSize: 14 * scale
      },
      axisLine: {
        lineStyle: {
          color: '#cccccc'
        }
      },
      axisTick: {
        show: false
      },
      data
    }
  },
  yAxisOf(scale, { name, splitLine = { lineStyle: { color: ['#cccccc'], opacity: 0.22 }}}) {
    return {
      type: 'value',
      name,
      nameGap: 20 * scale,
      minInterval: 1,
      nameTextStyle: {
        color: '#ffffff',
        align: 'left',
        fontSize: 12 * scale
      },
      axisLabel: {
        color: '#ffffff',
        margin: 20 * scale,
        fontSize: 14 * scale
      },
      axisTick: {
        show: false
      },
      axisLine: {
        show: false
      },
      splitLine
    }
  },
  series: {
    lineOf(scale, config) {
      return {
        type: 'line',
        symbolSize: 8 * scale,
        lineStyle: {
          normal: {
            color: config._color
          }
        },
        itemStyle: {
          normal: {
            color: config._color
          }
        },
        ...config
      }
    },
    barOf(scale, config) {
      return {
        type: 'bar',
        barWidth: 9 * scale,
        itemStyle: {
          normal: {
            borderWidth: 1,
            ...config._itemStyle
          }
        },
        ...config
      }
    }
  }
}
