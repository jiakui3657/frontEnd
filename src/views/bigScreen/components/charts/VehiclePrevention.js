import LineBarChart from './LineBarChart.vue'

export default {
  name: 'vehicle-prevention',
  functional: true,
  props: {
    scale: {
      type: Number,
      default: 1
    }
  },
  render(h, { props }) {
    return h(LineBarChart, {
      props: {
        scale: props.scale,
        url: '/bigScreen/lineNumTwo',
        bar: {
          name: '在线车辆',
          color: '#36B7FF',
          yAxisName: '(量/类型)                 ',
          itemStyle: {
            color: '#2DBEFF',
            opacity: 0.54,
            borderColor: '#72D9FF'
          }
        },
        line: {
          name: '主动安全报警次数',
          color: '#C9A2EE',
          yAxisName: '                 (次数)'
        }
      }
    })
  }
}
