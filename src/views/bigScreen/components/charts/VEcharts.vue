<template>
  <div
    class="v-echarts"
    :style="{ width, height }"
  ></div>
</template>

<script>
import echarts from 'echarts/lib/echarts'
import 'echarts/theme/macarons' // echarts theme

export default {
  name: 'v-echarts',
  props: {
    width: String,
    height: {
      type: String,
      default: '100%'
    },
    opts: {
      type: Object
    },
    options: {
      type: Object
    },
    theme: [Object, String]
  },
  data() {
    return {
      chart: null
    }
  },
  created() {
    this.chart = null
  },
  mounted() {
    this.$nextTick(() => {
      this.init()
    })
  },
  beforeDestroy() {
    this.clean()
  },
  watch: {
    options: {
      deep: true,
      handler(v) {
        if (!v) return
        this.chart.setOption(v, true)
      }
    }
  },
  methods: {
    init() {
      this.chart = echarts.init(this.$el, this.theme, this.opts)
      if (this.options) {
        this.chart.setOption(this.options)
      }
      window.addEventListener('resize', this.chart.resize)
    },
    clean() {
      window.removeEventListener('resize', this.chart.resize)
      this.chart.dispose()
    }
  }
}
</script>
