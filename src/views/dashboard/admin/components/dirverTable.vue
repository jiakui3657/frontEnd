<template>
  <div>
    <p class="title">驾驶员监管排名统计</p>
    <el-table
    :data="tableData"
    style="width: 100%"
    :header-cell-style="{ background: '#E1E1E1' }"
    border
    stripe>
      <el-table-column
        prop="dates"
        min-width="130"
        align="center"
        label="排名">
      </el-table-column>
      <el-table-column
        prop="date"
        min-width="130"
        align="center"
        label="评分">
      </el-table-column>
      <el-table-column
        prop="name"
        min-width="130"
        align="center"
        label="驾驶员姓名">
      </el-table-column>
      <el-table-column
        prop="platform"
        min-width="130"
        align="center"
        label="监控平台">
      </el-table-column>
      <el-table-column
        prop="company"
        min-width="130"
        align="center"
        label="运营企业">
      </el-table-column>
      <el-table-column
        prop="telephone"
        min-width="130"
        align="center"
        label="联系电话">
      </el-table-column>
      <el-table-column
        prop="warnings"
        min-width="130"
        align="center"
        label="预警总数">
      </el-table-column>
      <el-table-column
        prop="mileages"
        min-width="130"
        align="center"
        label="发生里程">
      </el-table-column>
      <el-table-column
        prop="a"
        min-width="130"
        align="center"
        label="预警数/单位里程">
      </el-table-column>
      <el-table-column
        align="center"
        label="向前碰撞预警">
        <el-table-column
          prop="b"
          align="center"
          min-width="130"
          label="预警次数">
        </el-table-column>
        <el-table-column
          prop="b"
          align="center"
          min-width="130"
          label="预警数/百公里">
        </el-table-column>
      </el-table-column>
      <el-table-column
        align="center"
        label="车道偏移预警">
        <el-table-column
          prop="c"
          align="center"
          min-width="130"
          label="预警次数">
        </el-table-column>
        <el-table-column
          prop="c"
          align="center"
          min-width="130"
          label="预警数/百公里">
        </el-table-column>
      </el-table-column>
      <el-table-column
        prop="d"
        align="center"
        label="车距过近预警">
        <el-table-column
          prop="d"
          align="center"
          min-width="130"
          label="预警次数">
        </el-table-column>
        <el-table-column
          prop="d"
          align="center"
          min-width="130"
          label="预警数/百公里">
        </el-table-column>
      </el-table-column>
      <el-table-column
        align="center"
        label="疲劳驾驶预警">
        <el-table-column
          prop="e"
          align="center"
          min-width="130"
          label="预警次数">
        </el-table-column>
        <el-table-column
          prop="e"
          align="center"
          min-width="130"
          label="预警数/百公里">
        </el-table-column>
      </el-table-column>
      <el-table-column
        align="center"
        label="分神驾驶预警">
        <el-table-column
          prop="f"
          align="center"
          min-width="130"
          label="预警次数">
        </el-table-column>
        <el-table-column
          prop="f"
          align="center"
          min-width="130"
          label="预警数/百公里">
        </el-table-column>
      </el-table-column>
      <el-table-column
        align="center"
        label="抽烟预警">
        <el-table-column
          prop="g"
          align="center"
          min-width="130"
          label="预警次数">
        </el-table-column>
        <el-table-column
          prop="g"
          align="center"
          min-width="130"
          label="预警数/百公里">
        </el-table-column>
      </el-table-column>
    </el-table>
    <el-pagination
      style="padding: 15px 0;"
      @current-change="handleCurrentChange"
      :page-size="10"
      background
      layout="total, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableData: [
        {
          dates: 1,
          date: 90,
          name: '纪元',
          platform: '向南科技',
          company: '西安',
          telephone: '13409804509',
          warnings: 300,
          mileages: 280,
          a: '28.0',
          b: 209,
          c: '28.0',
          d: 209,
          e: 209,
          f: 209,
          g: 209,
          h: 209
        },
        {
          dates: 2,
          date: 90,
          name: '纪元',
          platform: '向南科技',
          company: '西安',
          telephone: '13409804509',
          warnings: 300,
          mileages: 280,
          a: '28.0',
          b: 209,
          c: '28.0',
          d: 209,
          e: 209,
          f: 209,
          g: 209,
          h: 209
        },
        {
          dates: 3,
          date: 90,
          name: '纪元',
          platform: '向南科技',
          company: '西安',
          telephone: '13409804509',
          warnings: 300,
          mileages: 280,
          a: '28.0',
          b: 209,
          c: '28.0',
          d: 209,
          e: 209,
          f: 209,
          g: 209,
          h: 209
        },
        {
          dates: 4,
          date: 90,
          name: '纪元',
          platform: '向南科技',
          company: '西安',
          telephone: '13409804509',
          warnings: 300,
          mileages: 280,
          a: '28.0',
          b: 209,
          c: '28.0',
          d: 209,
          e: 209,
          f: 209,
          g: 209,
          h: 209
        },
        {
          dates: 5,
          date: 90,
          name: '纪元',
          platform: '向南科技',
          company: '西安',
          telephone: '13409804509',
          warnings: 300,
          mileages: 280,
          a: '28.0',
          b: 209,
          c: '28.0',
          d: 209,
          e: 209,
          f: 209,
          g: 209,
          h: 209
        },
        {
          dates: 6,
          date: 90,
          name: '纪元',
          platform: '向南科技',
          company: '西安',
          telephone: '13409804509',
          warnings: 300,
          mileages: 280,
          a: '28.0',
          b: 209,
          c: '28.0',
          d: 209,
          e: 209,
          f: 209,
          g: 209,
          h: 209
        }
      ],
      total: 6
    }
  },
  methods: {
    handleCurrentChange(val) {
      console.log(val)
    }
  }
}
</script>
<style lang="scss" scoped>
  .title {
    font-size: 12px;
    color: #447ED9;
  }
</style>

