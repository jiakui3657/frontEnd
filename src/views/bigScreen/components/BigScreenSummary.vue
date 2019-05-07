<template>
  <div class="summary-container">
    <div
      class="summary-inner"
      :style="{'margin-top': -1.3 * (scrollTimes % 2) + 'rem'}"
    >
      <div
        class="summary-row"
        v-for="row in [0, 1]"
        :key="row"
      >
        <div
          class="summary-li"
          v-for="li in rows[row]"
          :key="li.key"
        >
          <div class="title">{{ li.name }}</div>
          <div class="value">{{ valueOf(li) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import request from '@/utils/request'
import IntervalMixin from './IntervalMixin'

const rows = [
  [
    { name: '运营商平台', key: 'terraceNum' },
    { name: '运营企业', key: 'enterpriseNum' },
    { name: '车辆总数', key: 'vehicleNum' },
    { name: '入网车辆', key: 'networkNum' },
    { name: '在线车辆', key: 'onlineNum' },
    { name: '从业人员', key: 'practitionersNum' }
  ],
  [
    { name: '今日报警', key: 'alarmNum' },
    { name: '今日处理', key: 'disposeNum' },
    { name: '防控报警', key: 'preventionNum' },
    { name: '超速报警', key: 'speedNum' },
    { name: '超时疲劳', key: 'tiredNum' },
    { name: '凌晨运营', key: 'nightNum' }
  ]
]

export default {
  name: 'big-screen-summary',
  mixins: [IntervalMixin],
  data() {
    return {
      rows,
      items: {},
      scrollTimes: 0, // 滚动次数
      intervalMethod: this.scroll
    }
  },
  mounted() {
    this.query()
  },
  methods: {
    query() {
      request({
        url: '/bigScreen/tabNum'
      }).then(resp => {
        this.items = resp.data[0]
        this.scrollTimes = 0
      })
    },
    valueOf(li) {
      const v = this.items[li.key]
      return v === undefined ? '-' : v
    },
    scroll() {
      if (this.scrollTimes === 5) {
        this.query()
      } else {
        this.scrollTimes += 1
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@font-face {
  font-family: Digital-7Mono;
  src: url(../../../assets/big_screen/diaital_7_mono.ttf);
}
.summary-container {
  height: 1.3rem;
  overflow: hidden;
  .summary-inner {
    transition: margin-top 1s;
  }
}
.summary-li {
  background: url(../../../assets/big_screen/summary_li_bg.png) 0% / contain
    no-repeat;
  width: 1.36rem;
  height: 1.3rem;
  display: inline-block;
  text-align: center;
  .title {
    color: #ffffff;
    margin-top: 0.26rem;
    font: 400 0.18rem MicrosoftYaHei;
    line-height: 0.18rem;
  }
  .value {
    font: 0.4rem Digital-7Mono;
    color: #01fffd;
    margin-top: 0.24rem;
  }
}
</style>

<style scoped>
.summary-container .summary-row >>> .summary-li {
  margin-left: 0.12rem;
}
.summary-container .summary-row >>> .summary-li:first-child {
  margin-left: 0;
}
</style>
