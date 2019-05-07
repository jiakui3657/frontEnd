<template>
  <div
    class="table-layout"
    :class="layoutClass"
    :style="layoutStyle"
  >
    <table class="tb-head">
      <colgroup>
        <col
          v-for="head in headers"
          :key="head.text"
          :width="head.width * 10 * scale"
        >
      </colgroup>
      <thead>
        <tr>
          <th
            v-for="head in headers"
            :key="head.text"
            :align="head.align"
          >
            <div>{{ head.text }}</div>
          </th>
        </tr>
      </thead>
    </table>
    <div
      class="tb-body-container"
      :style="{ height: 0.32 * rows + 'rem' }"
    >
      <table
        class="tb-body"
        :style="{ 'margin-top': -0.32 * rows * page  + 'rem' }"
      >
        <colgroup>
          <col
            v-for="head in headers"
            :key="head.text"
            :width="head.width * 10 * scale"
          >
        </colgroup>
        <tbody>
          <tr
            v-for="item in items"
            :key="item._idx"
          >
            <td
              v-for="head in headers"
              :key="head.text"
              :align="head.align"
            >
              <div
                class="td-content"
                :style="head.style"
              >{{ item[head.value] }}</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import request from '@/utils/request'
import IntervalMixin from './IntervalMixin'

export default {
  name: 'auto-scroll-table',
  mixins: [IntervalMixin],
  props: {
    url: {
      type: String,
      required: true
    },
    headers: {
      type: Array, // [{ text: String, value: String, align: String, width: Number, color: String }]
      required: true
    },
    scale: {
      type: Number,
      default: 1
    },
    layoutClass: {
      type: String,
      default: 'corner'
    },
    layoutStyle: {
      type: Object,
      default: () => ({ margin: '0.24rem 0.1rem 0', 'background-color': '#0c2546' })
    },
    rows: {
      type: Number,
      default: 5
    }
  },
  data() {
    return {
      page: 0,
      items: [],
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
        url: this.url,
        method: 'get'
      }).then(resp => {
        this.items = resp.data.filter(d => !!d).map((d, i) => { d._idx = i + 1; return d })
        this.page = 0
        this.scrollTimes = 0
      })
    },
    scroll() {
      if ((this.page + 1) * this.rows < this.items.length) {
        this.page += 1
      } else {
        if (this.scrollTimes >= 6) {
          this.query()
        } else {
          this.page = 0
        }
      }
      this.scrollTimes += 1
    }
  }
}
</script>

<style lang="scss" scoped>
.table-layout {
  border: 1px solid #5a89ae;
  position: relative;
  &.corner {
    &::before,
    &::after {
      content: "";
      position: absolute;
      width: 0.2rem;
      height: 0.2rem;
      border-color: #07bcff;
      border-style: solid;
    }
    &::before {
      bottom: -0.02rem;
      left: -0.02rem;
      border-width: 0 0 0.01rem 0.01rem;
    }
    &::after {
      bottom: -0.02rem;
      right: -0.02rem;
      border-width: 0 0.01rem 0.01rem 0;
    }
  }
  table {
    table-layout: fixed;
    border-spacing: 0;
    width: 100%;
    color: #ffffff;
    &.tb-head {
      border-bottom: 1px solid #5a89ae;
      padding: 0.08rem 0 0.08rem;
      thead tr th {
        font: 400 0.12rem MicrosoftYaHei;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    &.tb-body {
      transition: margin-top 1s;
      tr {
        height: 0.32rem;
        td {
          padding: 0;
          .td-content {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            font: 400 0.14rem MicrosoftYaHei;
          }
        }
      }
    }
  }
  .tb-body-container {
    margin: 0.16rem 0 0.17rem;
    overflow: hidden;
  }
}
</style>
