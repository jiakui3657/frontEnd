<template>
  <div>
    <p class="title">运营企业监管排名统计</p>
    <el-table
    :data="tableData"
    style="width: 100%"
    :header-cell-style="{ background: '#E1E1E1' }"
    border
    stripe>
      <el-table-column
        min-width="120"
        align="center"
        prop="sort"
        label="排名">
      </el-table-column>
      <el-table-column
        prop="date"
        min-width="120"
        align="center"
        label="评分">
      </el-table-column>
      <el-table-column
        prop="platform"
        min-width="120"
        align="center"
        label="企业平台">
      </el-table-column>
      <el-table-column
        prop="company"
        min-width="120"
        align="center"
        label="运营企业">
      </el-table-column>
      <el-table-column
        prop="warnings"
        min-width="120"
        align="center"
        label="预警总数">
      </el-table-column>
      <el-table-column
        prop="timelyDeal"
        min-width="120"
        align="center"
        label="及时处理次数">
      </el-table-column>
      <el-table-column
        prop="overseeTimes"
        min-width="120"
        align="center"
        label="督办提醒次数">
      </el-table-column>
      <el-table-column
        prop="treatment"
        min-width="120"
        align="center"
        label="相应处理数">
      </el-table-column>
      <el-table-column
        prop="incomingVehicles"
        min-width="120"
        align="center"
        label="入网车辆数">
      </el-table-column>
      <el-table-column
        prop="onlineCars"
        min-width="120"
        align="center"
        label="在线车辆数">
      </el-table-column>
      <el-table-column
        prop="driverTotals"
        min-width="120"
        align="center"
        label="司机总数">
      </el-table-column>
      <el-table-column
        prop="principal"
        min-width="120"
        align="center"
        label="负责人">
      </el-table-column>
      <el-table-column
        prop="telephone"
        min-width="120"
        align="center"
        label="联系电话">
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
          sort: 1,
          date: 90,
          platform: '向南科技',
          company: '西安',
          warnings: 1000,
          timelyDeal: 3457,
          overseeTimes: 300,
          treatment: 280,
          incomingVehicles: 209,
          onlineCars: 109,
          driverTotals: 299,
          principal: 300,
          telephone: '13290872345'
        },
        {
          sort: 2,
          date: 90,
          platform: '向南科技',
          company: '西安',
          warnings: 1000,
          timelyDeal: 3457,
          overseeTimes: 300,
          treatment: 280,
          incomingVehicles: 209,
          onlineCars: 109,
          driverTotals: 299,
          principal: 300,
          telephone: '13290872345'
        },
        {
          sort: 3,
          date: 90,
          platform: '向南科技',
          company: '西安',
          warnings: 1000,
          timelyDeal: 3457,
          overseeTimes: 300,
          treatment: 280,
          incomingVehicles: 209,
          onlineCars: 109,
          driverTotals: 299,
          principal: 300,
          telephone: '13290872345'
        },
        {
          sort: 4,
          date: 90,
          platform: '向南科技',
          company: '西安',
          warnings: 1000,
          timelyDeal: 3457,
          overseeTimes: 300,
          treatment: 280,
          incomingVehicles: 209,
          onlineCars: 109,
          driverTotals: 299,
          principal: 300,
          telephone: '13290872345'
        },
        {
          sort: 5,
          date: 90,
          platform: '向南科技',
          company: '西安',
          warnings: 1000,
          timelyDeal: 3457,
          overseeTimes: 300,
          treatment: 280,
          incomingVehicles: 209,
          onlineCars: 109,
          driverTotals: 299,
          principal: 300,
          telephone: '13290872345'
        },
        {
          sort: 6,
          date: 90,
          platform: '向南科技',
          company: '西安',
          warnings: 1000,
          timelyDeal: 3457,
          overseeTimes: 300,
          treatment: 280,
          incomingVehicles: 209,
          onlineCars: 109,
          driverTotals: 299,
          principal: 300,
          telephone: '13290872345'
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
  .title{
    font-size: 12px;
    color: #447ED9;
  }
</style>

