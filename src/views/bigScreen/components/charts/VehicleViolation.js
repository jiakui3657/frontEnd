import LineBarChart from './LineBarChart.vue'

export default {
  name: 'vehicle-violation',
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
        url: '/bigScreen/lineNumThree',
        bar: {
          name: '在线车辆',
          color: '#15FED1',
          yAxisName: '(量/类型)                 ',
          itemStyle: {
            color: '#0B7062',
            borderColor: '#15FED1'
          }
        },
        line: {
          name: '违规报警次数',
          color: '#FDA22C',
          yAxisName: '                 (次数)'
        }
      }
    })
  }
}
